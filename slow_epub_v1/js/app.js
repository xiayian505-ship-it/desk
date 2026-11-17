/*
 * Mobile-first authoring interface.
 *
 * Source paragraphs are stored as plain text. Imported whitespace is never
 * silently reformatted in the project; EPUB-only layout choices are applied
 * when generating the book file.
 */
(function () {
    "use strict";

    const storage = window.SlowProjectStorage;
    const text_import = window.SlowTextImport;
    const epub = window.SlowEpub;
    const get_element = (id) => document.getElementById(id);

    let current_book = null;
    let active_section_id = null;
    let editor_draft = null;
    let editor_is_new = false;
    let editor_pending_split = null;
    let save_timer = null;
    let preview_timer = null;
    let notification_timer = null;
    let save_queue = Promise.resolve();
    let revision = 0;

    function create_id() {
        if (window.crypto && typeof window.crypto.randomUUID === "function") {
            return window.crypto.randomUUID();
        }

        // Some non-HTTPS browsers omit randomUUID. Keep valid UUID syntax
        // for the EPUB metadata identifier even in those environments.
        const bytes = new Uint8Array(16);

        if (window.crypto && typeof window.crypto.getRandomValues === "function") {
            window.crypto.getRandomValues(bytes);
        } else {
            for (let index = 0; index < bytes.length; index += 1) {
                bytes[index] = Math.floor(Math.random() * 256);
            }
        }

        bytes[6] = (bytes[6] & 0x0F) | 0x40;
        bytes[8] = (bytes[8] & 0x3F) | 0x80;
        const characters = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");

        return [
            characters.slice(0, 8),
            characters.slice(8, 12),
            characters.slice(12, 16),
            characters.slice(16, 20),
            characters.slice(20)
        ].join("-");
    }

    function create_format() {
        return {
            indent: "preserve",
            align: "left",
            line_height: "1.8",
            gap: "0"
        };
    }

    function create_section(title, type, body = "") {
        return {
            id: create_id(),
            title,
            type,
            body,
            include_toc: true,
            format: create_format()
        };
    }

    function create_book() {
        const timestamp = new Date().toISOString();

        return {
            id: create_id(),
            title: "未命名書籍",
            author: "",
            language: "zh-TW",
            publisher: "",
            description: "",
            rights: "",
            cover: null,
            generate_toc_page: false,
            sections: [],
            created_at: timestamp,
            updated_at: timestamp
        };
    }

    function normalize_book(book) {
        const normalized = {
            ...create_book(),
            ...book
        };

        normalized.id = String(book.id || create_id());
        normalized.title = String(book.title ?? "未命名書籍");
        normalized.author = String(book.author ?? "");
        normalized.language = String(book.language ?? "zh-TW");
        normalized.publisher = String(book.publisher ?? "");
        normalized.description = String(book.description ?? "");
        normalized.rights = String(book.rights ?? "");
        normalized.generate_toc_page = book.generate_toc_page === true;
        normalized.sections = Array.isArray(book.sections)
            ? book.sections.map((section) => ({
                id: String(section.id || create_id()),
                title: String(section.title ?? "未命名頁面"),
                type: section.type === "page" ? "page" : "chapter",
                body: String(section.body ?? ""),
                include_toc: section.include_toc !== false,
                format: epub.sanitize_format(section.format)
            }))
            : [];

        if (!normalized.cover || typeof normalized.cover.data_url !== "string") {
            normalized.cover = null;
        }

        return normalized;
    }

    function get_active_section() {
        return editor_draft && editor_draft.id === active_section_id ? editor_draft : null;
    }

    function show_view(view_id) {
        for (const view of document.querySelectorAll("main > .view")) {
            view.hidden = view.id !== view_id;
        }

        window.scrollTo({ top: 0, behavior: "auto" });
    }

    function notify(message) {
        const notice = get_element("notification");
        notice.textContent = message;
        notice.hidden = false;
        clearTimeout(notification_timer);
        notification_timer = setTimeout(() => { notice.hidden = true; }, 4000);
    }

    function set_save_status(message) {
        get_element("save_status").textContent = message;
        get_element("editor_save_status").textContent = message;
    }

    function schedule_save() {
        if (!current_book) {
            return;
        }

        revision += 1;
        current_book.updated_at = new Date().toISOString();
        set_save_status("尚未暫存");
        clearTimeout(save_timer);
        save_timer = setTimeout(() => {
            save_timer = null;
            enqueue_save();
        }, 550);
    }

    function enqueue_save() {
        if (!current_book) {
            return save_queue;
        }

        const book_snapshot = JSON.parse(JSON.stringify(current_book));
        const saved_revision = revision;

        save_queue = save_queue.catch(() => undefined).then(async () => {
            try {
                await storage.save_book(book_snapshot);

                if (current_book?.id === book_snapshot.id && revision === saved_revision) {
                    set_save_status("已暫存");
                }
            } catch (error) {
                console.error("儲存專案失敗：", error);
                set_save_status("暫存失敗，請備份專案");
                notify("本機暫存失敗。請立即匯出專案備份，避免資料遺失。");
                throw error;
            }
        });

        return save_queue;
    }

    async function flush_save() {
        if (save_timer !== null) {
            clearTimeout(save_timer);
            save_timer = null;
            enqueue_save();
        }

        try {
            await save_queue;
        } catch (error) {
            console.warn("自動儲存尚未成功。", error);
        }
    }

    function create_button(label, action, id, class_name = "button-outline") {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = label;
        button.className = class_name;
        button.dataset.action = action;
        button.dataset.id = id;
        return button;
    }

    function create_text_element(tag_name, text, class_name = "") {
        const element = document.createElement(tag_name);
        element.textContent = text;
        element.className = class_name;
        return element;
    }

    function get_character_count(text) {
        return [...String(text || "")].length;
    }

    async function render_home() {
        const list = get_element("books_list");
        list.replaceChildren();
        const books = await storage.get_all_books();
        books.sort((first, second) =>
            String(second.updated_at || "").localeCompare(String(first.updated_at || ""))
        );

        get_element("home_empty").hidden = books.length > 0;

        for (const book of books) {
            const row = create_text_element("div", "", "list-row");
            const main = create_text_element("div", "", "row-main");
            main.append(
                create_text_element("strong", book.title || "未命名書籍"),
                create_text_element("span", `${book.sections?.length || 0} 個章節／內頁`, "muted")
            );
            const actions = create_text_element("div", "", "row-actions");
            actions.append(
                create_button("開啟", "open-book", book.id, ""),
                create_button("刪除", "delete-book", book.id)
            );
            row.append(main, actions);
            list.append(row);
        }
    }

    function render_book() {
        if (!current_book) {
            return;
        }

        get_element("book_heading").textContent = current_book.title || "未命名書籍";
        get_element("book_title").value = current_book.title;
        get_element("book_author").value = current_book.author;
        get_element("book_language").value = current_book.language;
        get_element("book_publisher").value = current_book.publisher;
        get_element("book_description").value = current_book.description;
        get_element("book_rights").value = current_book.rights;
        get_element("generate_toc_page").checked = current_book.generate_toc_page;
        render_cover();
        render_sections();
        set_save_status("已暫存");
        show_view("book_view");
    }

    function render_cover() {
        const preview = get_element("cover_preview");
        const remove_button = get_element("remove_cover_button");
        const data_url = current_book?.cover?.data_url;

        preview.hidden = !data_url;
        remove_button.hidden = !data_url;

        if (data_url) {
            preview.src = data_url;
        } else {
            preview.removeAttribute("src");
        }
    }

    function render_sections() {
        const list = get_element("sections_list");
        list.replaceChildren();
        const sections = current_book.sections;
        get_element("sections_empty").hidden = sections.length !== 0;
        const book_character_count = sections.reduce((total, section) =>
            total + get_character_count(section.body), 0
        );
        get_element("book_word_count").textContent = `${book_character_count.toLocaleString("zh-TW")} 字元`;

        for (const [index, section] of sections.entries()) {
            const row = create_text_element("div", "", "list-row");
            const main = create_text_element("div", "", "row-main");
            main.append(
                create_text_element("strong", section.title || "未命名頁面"),
                create_text_element(
                    "span",
                    `${section.type === "page" ? "內頁" : "章節"} · ${get_character_count(section.body).toLocaleString("zh-TW")} 字元 · ${section.include_toc ? "列入目錄" : "不列目錄"}`,
                    "muted"
                )
            );
            const actions = create_text_element("div", "", "row-actions");
            const up = create_button("↑", "move-up", section.id);
            const down = create_button("↓", "move-down", section.id);
            up.disabled = index === 0;
            down.disabled = index === sections.length - 1;
            actions.append(
                create_button("編輯", "edit-section", section.id, ""),
                up,
                down,
                create_button("刪除", "delete-section", section.id)
            );
            row.append(main, actions);
            list.append(row);
        }
    }

    function render_editor() {
        const section = get_active_section();

        if (!section) {
            return;
        }

        get_element("section_title").value = section.title;
        get_element("section_body").value = section.body;
        get_element("section_in_toc").checked = section.include_toc;
        get_element("section_indent").value = section.format.indent;
        get_element("section_align").value = section.format.align;
        get_element("section_line_height").value = section.format.line_height;
        get_element("section_gap").value = section.format.gap;
        get_element("preview_details").open = false;
        get_element("editor_save_status").textContent = "未修改";
        render_editor_count();
        show_view("editor_view");
    }

    function render_editor_count() {
        get_element("section_char_count").textContent =
            `${get_character_count(get_element("section_body").value).toLocaleString("zh-TW")} 字元`;
    }

    function render_preview() {
        if (!get_element("preview_details").open) {
            return;
        }

        const section = get_active_section();

        if (!section) {
            return;
        }

        const format = epub.sanitize_format(section.format);
        const preview = get_element("section_preview");
        const title = create_text_element("h4", section.title || "未命名頁面");
        const fragment = document.createDocumentFragment();
        fragment.append(title);
        preview.style.lineHeight = format.line_height;

        for (const line of text_import.normalize_newlines(section.body).split("\n")) {
            const paragraph = document.createElement("p");
            paragraph.textContent = epub.adjust_line_for_indent(line, format.indent) || "\u00A0";
            paragraph.style.textIndent = format.indent === "css" && line.trim() ? "2em" : "0";
            paragraph.style.textAlign = format.align;
            paragraph.style.marginBottom = line.length ? `${format.gap}em` : "0";
            fragment.append(paragraph);
        }

        preview.replaceChildren(fragment);
    }

    function schedule_preview() {
        clearTimeout(preview_timer);
        preview_timer = setTimeout(render_preview, 200);
    }

    async function open_book(book_id) {
        await flush_save();
        const book = await storage.get_book(book_id);

        if (!book) {
            notify("找不到這本書的暫存資料。");
            return;
        }

        current_book = normalize_book(book);
        active_section_id = null;
        editor_draft = null;
        editor_pending_split = null;
        revision = 0;
        render_book();
    }

    async function go_home() {
        await flush_save();
        current_book = null;
        active_section_id = null;
        editor_draft = null;
        editor_pending_split = null;
        await render_home();
        show_view("home_view");
    }

    async function go_book() {
        await flush_save();
        active_section_id = null;
        editor_draft = null;
        editor_is_new = false;
        editor_pending_split = null;
        render_book();
    }

    function open_editor(section_id, new_section = null) {
        const source = new_section || current_book.sections.find((item) => item.id === section_id);

        if (!source) {
            notify("找不到章節，請返回書籍列表再試一次。");
            return;
        }

        // Separate editable state from the persisted book. Cancel can then
        // discard this entire edit without racing IndexedDB autosaves.
        active_section_id = source.id;
        editor_draft = JSON.parse(JSON.stringify(source));
        editor_is_new = Boolean(new_section);
        editor_pending_split = null;
        render_editor();
    }

    function mark_editor_changed() {
        get_element("editor_save_status").textContent = "尚未儲存修改";
    }

    async function save_editor() {
        if (!current_book || !editor_draft) {
            return;
        }

        const saved_section = editor_draft;
        const section_index = current_book.sections.findIndex((item) => item.id === saved_section.id);

        if (editor_is_new) {
            current_book.sections.push(saved_section);
        } else if (section_index >= 0) {
            current_book.sections[section_index] = saved_section;
        } else {
            notify("原章節已不存在，無法儲存修改。");
            return;
        }

        if (editor_pending_split) {
            const position = current_book.sections.findIndex((item) => item.id === saved_section.id);
            current_book.sections.splice(position + 1, 0, editor_pending_split);
        }

        schedule_save();
        await go_book();
        notify("章節修改已儲存。");
    }

    async function cancel_editor() {
        if (!editor_draft) {
            return;
        }

        // A newly added page is provisional too: Cancel leaves no empty page.
        await go_book();
        notify("已取消本次編輯，原內容沒有變動。");
    }

    function append_section(title, type, body = "") {
        const section = create_section(title, type, body);
        current_book.sections.push(section);
        schedule_save();
        render_sections();
        return section;
    }

    function handle_import(auto_detect) {
        const input = get_element("import_text");
        const raw_text = input.value;

        if (!raw_text.trim()) {
            notify("請先貼上文字或匯入 TXT。");
            return;
        }

        if (auto_detect) {
            const chapters = text_import.detect_chapters(raw_text);

            const new_sections = chapters.map((chapter) =>
                create_section(chapter.title, chapter.type, chapter.body)
            );
            current_book.sections.push(...new_sections);
            render_sections();
            notify(`已匯入 ${chapters.length} 個章節／內頁。`);
        } else {
            append_section("新增內頁", "page", text_import.normalize_newlines(raw_text));
            notify("已將文字原樣新增為內頁。");
        }

        input.value = "";
        get_element("txt_file_input").value = "";
        get_element("import_details").open = false;
        schedule_save();
    }

    function manual_split() {
        const section = get_active_section();

        if (!section) {
            return;
        }

        if (editor_pending_split) {
            notify("本章已有一處待儲存的分章，請先按儲存再繼續。");
            return;
        }

        const editor = get_element("section_body");
        const body = editor.value;
        const cursor = editor.selectionStart;
        const line_start = body.lastIndexOf("\n", Math.max(0, cursor - 1)) + 1;
        const next_newline = body.indexOf("\n", cursor);
        const line_end = next_newline < 0 ? body.length : next_newline;
        const title = body.slice(line_start, line_end).trim();

        if (!title) {
            notify("請把游標放在有章節標題的那一行。");
            return;
        }

        if (title.length > 200) {
            notify("這一行太長了，不像章節名稱。請先換行。");
            return;
        }

        const first_part = body.slice(0, line_start);
        const remaining_part = next_newline < 0 ? "" : body.slice(line_end + 1);

        if (!first_part.trim()) {
            section.title = title;
            section.body = remaining_part;
            get_element("section_title").value = title;
            editor.value = remaining_part;
            render_editor_count();
            schedule_preview();
            mark_editor_changed();
            notify("已將第一行設為章節標題；按儲存才會套用。");
            return;
        }

        section.body = first_part;
        editor.value = first_part;
        editor_pending_split = create_section(title, "chapter", remaining_part);
        render_editor_count();
        schedule_preview();
        mark_editor_changed();
        notify("已準備拆成兩章；按儲存會新增，按取消則不變動。");
    }

    function move_section(section_id, delta) {
        const list = current_book.sections;
        const position = list.findIndex((section) => section.id === section_id);
        const next_position = position + delta;

        if (position < 0 || next_position < 0 || next_position >= list.length) {
            return;
        }

        const [section] = list.splice(position, 1);
        list.splice(next_position, 0, section);
        schedule_save();
        render_sections();
    }

    function delete_section(section_id) {
        const section = current_book.sections.find((item) => item.id === section_id);

        if (!section || !window.confirm(`確定刪除「${section.title}」及其全部內文？此操作不能復原。`)) {
            return;
        }

        current_book.sections = current_book.sections.filter((item) => item.id !== section_id);
        schedule_save();
        render_sections();
        notify("已刪除章節。請記得另外備份重要原稿。");
    }

    function count_occurrences(content, needle) {
        return needle ? content.split(needle).length - 1 : 0;
    }

    function search_book() {
        const needle = get_element("search_text").value;
        const results = get_element("search_results");
        results.replaceChildren();

        if (!needle) {
            notify("請輸入要尋找的文字。");
            return;
        }

        let total = 0;
        const found = [];

        for (const section of current_book.sections) {
            const count = count_occurrences(section.body, needle);

            if (count) {
                total += count;
                found.push({ section, count });
            }
        }

        results.append(create_text_element("p", `全文找到 ${total} 處。`));

        for (const item of found) {
            const row = create_text_element("div", "", "list-row");
            row.append(
                create_text_element("span", `${item.section.title}（${item.count} 處）`),
                create_button("前往", "search-section", item.section.id)
            );
            results.append(row);
        }
    }

    function replace_all() {
        const needle = get_element("search_text").value;
        const replacement = get_element("replace_text").value;

        if (!needle) {
            notify("請先輸入要尋找的文字。");
            return;
        }

        let total = 0;

        for (const section of current_book.sections) {
            total += count_occurrences(section.body, needle);
        }

        if (!total) {
            notify("沒有找到符合的文字。");
            return;
        }

        if (!window.confirm(`即將在整本書取代 ${total} 處文字，確定繼續？`)) {
            return;
        }

        for (const section of current_book.sections) {
            section.body = section.body.split(needle).join(replacement);
        }

        schedule_save();
        render_sections();
        search_book();
        notify(`已取代 ${total} 處文字。`);
    }

    async function read_txt_file() {
        const file = get_element("txt_file_input").files[0];

        if (!file) {
            return;
        }

        try {
            const encoding = get_element("txt_encoding").value;
            const raw_data = await file.arrayBuffer();
            const decoder = new TextDecoder(encoding);
            get_element("import_text").value = decoder.decode(raw_data).replace(/^\uFEFF/, "");
            notify(`已讀取 ${file.name}，確認內容後再匯入。`);
        } catch (error) {
            console.error("讀取 TXT 失敗：", error);
            notify("TXT 讀取失敗。請確認檔案與編碼設定。");
        }
    }

    function read_file_as_data_url(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(file);
        });
    }

    async function change_cover() {
        const file = get_element("cover_file_input").files[0];

        if (!file) {
            return;
        }

        if (!["image/jpeg", "image/png"].includes(file.type)) {
            notify("封面僅支援 JPG 或 PNG。");
            return;
        }

        if (file.size > 8 * 1024 * 1024) {
            notify("封面超過 8 MB，請先縮小圖片再匯入。");
            return;
        }

        try {
            const data_url = await read_file_as_data_url(file);
            current_book.cover = { name: file.name, data_url };
            schedule_save();
            render_cover();
            notify("封面已加入專案。");
        } catch (error) {
            console.error("匯入封面失敗：", error);
            notify("無法讀取封面圖片。");
        }
    }

    function sanitize_filename(filename) {
        return String(filename || "未命名書籍")
            .replace(/[\\/:*?"<>|\u0000-\u001F]/g, "_")
            .slice(0, 90) || "未命名書籍";
    }

    function download_blob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.append(link);
        link.click();
        link.remove();

        // Delay revocation: some Android download handlers access the URL later.
        setTimeout(() => URL.revokeObjectURL(url), 30000);
    }

    async function export_book() {
        if (!current_book.sections.length) {
            notify("請先加入至少一章或一頁內容。");
            return;
        }

        await flush_save();
        get_element("export_epub_button").disabled = true;

        try {
            const blob = epub.export_epub(current_book);
            download_blob(blob, `${sanitize_filename(current_book.title)}.epub`);
            notify("EPUB 已產生。正式上架讀墨前，請再使用 EPUBCheck 驗證。");
        } catch (error) {
            console.error("EPUB 匯出失敗：", error);
            notify(`匯出失敗：${error.message}`);
        } finally {
            get_element("export_epub_button").disabled = false;
        }
    }

    async function backup_project() {
        await flush_save();
        const document_data = {
            format: "slow_epub_project",
            version: 1,
            exported_at: new Date().toISOString(),
            book: current_book
        };
        const backup_text = JSON.stringify(document_data, null, 2);
        const blob = new Blob([backup_text], { type: "application/json;charset=utf-8" });
        download_blob(blob, `${sanitize_filename(current_book.title)}.slow-epub.json`);
        notify("專案備份已下載。此檔可再次匯入並繼續編輯。");
    }

    async function restore_project() {
        const input = get_element("restore_project_input");
        const file = input.files[0];

        if (!file) {
            return;
        }

        try {
            const parsed = JSON.parse(await file.text());

            if (parsed.format !== "slow_epub_project" || parsed.version !== 1 || !parsed.book) {
                throw new Error("不是本工具的專案備份格式。");
            }

            const book = normalize_book(parsed.book);

            // Import as a new project, never silently overwrite an existing one.
            book.id = create_id();
            book.created_at = new Date().toISOString();
            book.updated_at = book.created_at;
            await storage.save_book(book);
            await open_book(book.id);
            notify("專案備份已還原成一本新書。");
        } catch (error) {
            console.error("還原專案失敗：", error);
            notify(`無法還原：${error.message}`);
        } finally {
            input.value = "";
        }
    }

    async function handle_home_row_click(event) {
        const target = event.target.closest("button[data-action]");

        if (!target) {
            return;
        }

        const book_id = target.dataset.id;

        if (target.dataset.action === "open-book") {
            await open_book(book_id);
        }

        if (target.dataset.action === "delete-book") {
            if (!window.confirm("確定刪除整本書的本機暫存？這個動作無法復原。")) {
                return;
            }

            await storage.delete_book(book_id);
            await render_home();
            notify("已刪除本機專案。");
        }
    }

    function handle_section_row_click(event) {
        const target = event.target.closest("button[data-action]");

        if (!target) {
            return;
        }

        const section_id = target.dataset.id;
        const action = target.dataset.action;

        if (action === "edit-section") {
            open_editor(section_id);
        } else if (action === "move-up") {
            move_section(section_id, -1);
        } else if (action === "move-down") {
            move_section(section_id, 1);
        } else if (action === "delete-section") {
            delete_section(section_id);
        }
    }

    function update_metadata(key, value) {
        if (!current_book) {
            return;
        }

        current_book[key] = value;

        if (key === "title") {
            get_element("book_heading").textContent = value || "未命名書籍";
        }

        schedule_save();
    }

    function update_section_format(key, value) {
        const section = get_active_section();

        if (!section) {
            return;
        }

        section.format[key] = value;
        mark_editor_changed();
        schedule_preview();
    }

    function bind_events() {
        get_element("create_book_button").addEventListener("click", async () => {
            await flush_save();
            const book = create_book();
            await storage.save_book(book);
            await open_book(book.id);
            get_element("metadata_details").open = true;
        });

        get_element("books_list").addEventListener("click", (event) => {
            handle_home_row_click(event).catch((error) => {
                console.error(error);
                notify("無法開啟或刪除專案。");
            });
        });
        get_element("sections_list").addEventListener("click", handle_section_row_click);
        get_element("restore_project_input").addEventListener("change", restore_project);
        get_element("book_home_button").addEventListener("click", go_home);
        get_element("editor_back_button").addEventListener("click", cancel_editor);
        get_element("editor_cancel_button").addEventListener("click", cancel_editor);
        get_element("editor_save_button").addEventListener("click", save_editor);
        get_element("export_epub_button").addEventListener("click", export_book);
        get_element("backup_project_button").addEventListener("click", backup_project);
        get_element("auto_import_button").addEventListener("click", () => handle_import(true));
        get_element("plain_import_button").addEventListener("click", () => handle_import(false));
        get_element("add_chapter_button").addEventListener("click", () => {
            const section = create_section("新章節", "chapter");
            open_editor(section.id, section);
        });
        get_element("add_page_button").addEventListener("click", () => {
            const section = create_section("新內頁／番外", "page");
            open_editor(section.id, section);
        });
        get_element("generate_toc_page").addEventListener("change", (event) => {
            current_book.generate_toc_page = event.target.checked;
            schedule_save();
        });
        get_element("txt_file_input").addEventListener("change", read_txt_file);
        get_element("txt_encoding").addEventListener("change", read_txt_file);
        get_element("cover_file_input").addEventListener("change", change_cover);
        get_element("remove_cover_button").addEventListener("click", () => {
            current_book.cover = null;
            get_element("cover_file_input").value = "";
            schedule_save();
            render_cover();
        });

        const metadata_fields = {
            book_title: "title",
            book_author: "author",
            book_language: "language",
            book_publisher: "publisher",
            book_description: "description",
            book_rights: "rights"
        };

        for (const [element_id, key] of Object.entries(metadata_fields)) {
            get_element(element_id).addEventListener("input", (event) => {
                update_metadata(key, event.target.value);
            });
        }

        get_element("section_title").addEventListener("input", (event) => {
            const section = get_active_section();

            if (section) {
                section.title = event.target.value;
                mark_editor_changed();
                schedule_preview();
            }
        });

        get_element("section_body").addEventListener("input", (event) => {
            const section = get_active_section();

            if (section) {
                section.body = event.target.value;
                mark_editor_changed();
                schedule_preview();
                render_editor_count();
            }
        });

        get_element("section_in_toc").addEventListener("change", (event) => {
            const section = get_active_section();

            if (section) {
                section.include_toc = event.target.checked;
                mark_editor_changed();
            }
        });

        const format_controls = {
            section_indent: "indent",
            section_align: "align",
            section_line_height: "line_height",
            section_gap: "gap"
        };

        for (const [element_id, key] of Object.entries(format_controls)) {
            get_element(element_id).addEventListener("change", (event) => {
                update_section_format(key, event.target.value);
            });
        }

        get_element("manual_split_button").addEventListener("click", manual_split);
        get_element("preview_details").addEventListener("toggle", render_preview);
        get_element("search_button").addEventListener("click", search_book);
        get_element("replace_all_button").addEventListener("click", replace_all);
        get_element("search_results").addEventListener("click", (event) => {
            const target = event.target.closest("button[data-action='search-section']");

            if (!target) {
                return;
            }

            open_editor(target.dataset.id);
            const needle = get_element("search_text").value;
            const position = get_element("section_body").value.indexOf(needle);

            if (position >= 0) {
                const body = get_element("section_body");
                body.focus();
                body.setSelectionRange(position, position + needle.length);
            }
        });

        document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === "hidden" && current_book && save_timer !== null) {
                clearTimeout(save_timer);
                save_timer = null;
                enqueue_save();
            }
        });
    }

    async function initialize() {
        bind_events();

        try {
            await storage.open_database();
            await render_home();
            show_view("home_view");
        } catch (error) {
            console.error("啟動本機資料庫失敗：", error);
            notify("無法開啟瀏覽器暫存。請改用 HTTPS 網址開啟本工具，並允許網站儲存資料。");
        }
    }

    initialize();
}());
