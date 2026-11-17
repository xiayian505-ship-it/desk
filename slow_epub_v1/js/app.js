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
    const illustrations = window.SlowIllustrations;
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
    let importing_txt_files = false;
    let txt_selection_revision = 0;

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
            parent_id: null,
            include_toc: true,
            format: create_format(),
            images: []
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
            toc_style: epub.toc_default_style(),
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
        normalized.toc_style = epub.normalize_toc_style(book.toc_style);
        normalized.sections = Array.isArray(book.sections)
            ? book.sections.map((section) => ({
                id: String(section.id || create_id()),
                title: String(section.title ?? "未命名頁面"),
                type: ["chapter", "page", "group"].includes(section.type) ? section.type : "chapter",
                body: String(section.body ?? ""),
                parent_id: section.parent_id ? String(section.parent_id) : null,
                include_toc: section.include_toc !== false,
                format: epub.sanitize_format(section.format),
                images: Array.isArray(section.images)
                    ? section.images.map(illustrations.normalize_image)
                    : []
            }))
            : [];

        // v1.4 projects did not have parent_id; they remain top-level.
        // Invalid, nested and self-referencing parents are promoted to top-level.
        const roots = new Map(normalized.sections
            .filter((section) => !section.parent_id)
            .map((section) => [section.id, section]));

        for (const section of normalized.sections) {
            if (!roots.has(section.parent_id) || section.id === section.parent_id || section.type === "group") {
                section.parent_id = null;
            }

            if (section.type === "group") {
                section.include_toc = true;
                section.body = "";
                section.images = [];
            }
        }

        normalized.sections = arrange_sections(normalized.sections);

        if (!normalized.cover || typeof normalized.cover.data_url !== "string") {
            normalized.cover = null;
        }

        return normalized;
    }

    function arrange_sections(sections) {
        // Keep each parent immediately before its children in reading order.
        // This avoids a child appearing elsewhere in the EPUB spine after an
        // import, a parent change or loading an older project backup.
        const arranged = [];

        for (const section of sections) {
            if (section.parent_id) {
                continue;
            }

            arranged.push(section);
            arranged.push(...sections.filter((child) => child.parent_id === section.id));
        }

        return arranged;
    }

    function section_has_children(section_id) {
        return current_book.sections.some((section) => section.parent_id === section_id);
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
        // Image anchors are editor controls, not characters of the novel.
        return illustrations.count_visible_characters(text);
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
        render_toc_settings();
        render_cover();
        render_sections();
        set_save_status("已暫存");
        show_view("book_view");
    }

    const toc_control_fields = {
        toc_color: "color",
        toc_heading_size: "heading_size",
        toc_link_size: "link_size",
        toc_line_height: "line_height",
        toc_item_gap: "item_gap",
        toc_indent: "indent",
        toc_align: "align",
        toc_underline: "underline",
        toc_custom_css: "custom_css"
    };

    function render_toc_settings() {
        const style = current_book.toc_style;

        for (const [control_id, key] of Object.entries(toc_control_fields)) {
            const control = get_element(control_id);

            if (control.type === "checkbox") {
                control.checked = style[key];
            } else {
                control.value = style[key];
            }
        }

        render_toc_preview();
    }

    function render_toc_preview() {
        if (!current_book) {
            return;
        }

        const error_message = get_element("toc_css_error");
        const host = get_element("toc_preview");
        const shadow = host.shadowRoot || host.attachShadow({ mode: "open" });
        const fragment = document.createDocumentFragment();
        const style_element = document.createElement("style");

        try {
            // Same CSS text is exported to OEBPS/styles/toc.css. Shadow DOM
            // confines user-authored selectors to this preview on the site.
            style_element.textContent = `:host { display: block; }
` +
                epub.build_toc_css(current_book.toc_style);
            error_message.hidden = true;
            error_message.textContent = "";
        } catch (error) {
            error_message.textContent = `CSS 設定有問題：${error.message}`;
            error_message.hidden = false;
            style_element.textContent = epub.build_toc_css(epub.toc_default_style());
        }

        const nav = document.createElement("nav");
        nav.id = "toc";
        const title = create_text_element("h1", "目錄");
        const list = document.createElement("ol");
        const sections = epub.get_toc_tree(current_book.sections);
        const real_sections = current_book.sections.filter((section) => section.type !== "group");

        function create_toc_preview_item(node) {
            const item = document.createElement("li");
            const section = node.section;
            const title = section.title || "未命名頁面";

            if (section.type === "group") {
                item.append(create_text_element("span", title));
            } else {
                const link = document.createElement("a");
                const position = real_sections.findIndex((entry) => entry.id === section.id);
                link.textContent = title;
                link.href = `text/section-${String(position + 1).padStart(3, "0")}.xhtml`;
                link.dataset.target_title = title;
                item.append(link);
            }

            if (node.children.length) {
                const child_list = document.createElement("ol");

                for (const child of node.children) {
                    child_list.append(create_toc_preview_item(child));
                }

                item.append(child_list);
            }

            return item;
        }

        for (const node of sections) {
            list.append(create_toc_preview_item(node));
        }

        if (!sections.length) {
            list.append(create_text_element("li", "新增章節後，這裡會出現目錄。"));
        }

        nav.append(title, list);
        fragment.append(style_element, nav);
        shadow.replaceChildren(fragment);
    }

    function update_toc_style(control_id, control) {
        if (!current_book) {
            return;
        }

        const key = toc_control_fields[control_id];
        const numeric_keys = ["heading_size", "link_size", "line_height", "item_gap", "indent"];
        let value = control.type === "checkbox" ? control.checked : control.value;

        if (numeric_keys.includes(key)) {
            const number = Number(value);
            const minimum = Number(control.min);
            const maximum = Number(control.max);

            // Number inputs are allowed to be briefly empty while typing.
            // Wait for a complete in-range number before persisting it.
            if (!value || !Number.isFinite(number) || number < minimum || number > maximum) {
                return;
            }

            value = number;
        }

        current_book.toc_style[key] = value;
        schedule_save();
        render_toc_preview();
    }

    function reset_toc_style() {
        if (!window.confirm("要恢復預設目錄樣式，並清除進階自訂 CSS 嗎？")) {
            return;
        }

        current_book.toc_style = epub.toc_default_style();
        render_toc_settings();
        schedule_save();
        notify("已恢復預設目錄樣式。");
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

        for (const section of sections) {
            const row = create_text_element("div", "", "list-row");
            const main = create_text_element("div", "", "row-main");
            const is_child = Boolean(section.parent_id);
            const siblings = sections.filter((item) => item.parent_id === section.parent_id);
            const sibling_index = siblings.findIndex((item) => item.id === section.id);

            if (is_child) {
                row.classList.add("subsection-row");
            }

            const type_label = section.type === "group"
                ? "目錄分類"
                : is_child ? "子節" : section.type === "page" ? "內頁" : "章節";
            const details = section.type === "group"
                ? `${type_label} · 不產生獨立正文頁`
                : `${type_label} · ${get_character_count(section.body).toLocaleString("zh-TW")} 字元 · ${(section.images || []).length} 張插圖 · ${section.include_toc ? "列入目錄" : "不列目錄"}`;
            main.append(
                create_text_element("strong", section.title || "未命名頁面"),
                create_text_element("span", details, "muted")
            );

            const actions = create_text_element("div", "", "row-actions");
            const up = create_button("↑", "move-up", section.id);
            const down = create_button("↓", "move-down", section.id);
            up.disabled = sibling_index === 0;
            down.disabled = sibling_index === siblings.length - 1;
            actions.append(create_button("編輯", "edit-section", section.id, ""));

            if (!is_child) {
                actions.append(create_button("＋ 子節", "add-child", section.id));
            }

            actions.append(up, down, create_button("刪除", "delete-section", section.id));
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
        get_element("section_content_fields").hidden = section.type === "group";

        const parent_select = get_element("section_parent");
        parent_select.replaceChildren(new Option("最上層（章節／內頁）", ""));
        const has_children = section_has_children(section.id);

        // Two levels only; a parent with existing children cannot become a
        // child, or those grandchildren would disappear from the navigation.
        for (const possible_parent of current_book.sections) {
            if (possible_parent.id === section.id || possible_parent.parent_id) {
                continue;
            }

            parent_select.append(new Option(possible_parent.title || "未命名頁面", possible_parent.id));
        }

        parent_select.value = section.parent_id || "";
        parent_select.disabled = section.type === "group" || has_children;
        get_element("section_parent_hint").textContent = section.type === "group"
            ? "目錄分類只能放在最上層；它本身不產生空白頁。"
            : has_children
                ? "這一項已有子節；請先移走子節，才能將它改成子節。"
                : "可指定上一層；未指定時是一般章節或內頁。";
        get_element("section_indent").value = section.format.indent;
        get_element("section_align").value = section.format.align;
        get_element("section_line_height").value = section.format.line_height;
        get_element("section_gap").value = section.format.gap;
        get_element("preview_details").open = false;
        get_element("illustration_details").open = false;
        get_element("illustration_file_input").value = "";
        get_element("illustration_position").value = "cursor";
        get_element("editor_save_status").textContent = "未修改";
        render_editor_count();
        render_illustrations();
        show_view("editor_view");
    }

    function render_editor_count() {
        get_element("section_char_count").textContent =
            `${get_character_count(get_element("section_body").value).toLocaleString("zh-TW")} 字元`;
    }

    function create_illustration_field(title, image, field, type = "text") {
        const label = document.createElement("label");
        label.append(document.createTextNode(title));
        let control;

        if (type === "select") {
            control = document.createElement("select");

            for (const value of ["60", "80", "100"]) {
                const option = document.createElement("option");
                option.value = value;
                option.textContent = `${value}%`;
                control.append(option);
            }

            control.value = image.width;
        } else if (type === "checkbox") {
            control = document.createElement("input");
            control.type = "checkbox";
            control.checked = image.separate_page;
            label.className = "checkbox-line";
        } else {
            control = document.createElement("input");
            control.type = "text";
            control.value = image[field];
            control.maxLength = 500;
        }

        control.dataset.image_id = image.id;
        control.dataset.image_field = field;
        label.append(control);
        return label;
    }

    function render_illustrations() {
        const section = get_active_section();
        const host = get_element("illustrations_list");
        host.replaceChildren();

        if (!section || !section.images?.length) {
            host.append(create_text_element("p", "本章尚未插入圖片。", "hint"));
            return;
        }

        const located_ids = new Set(illustrations.find_marker_ids(section.body));

        for (const image of section.images) {
            const row = create_text_element("div", "", "illustration-row");
            const preview = document.createElement("img");
            preview.src = image.data_url;
            preview.alt = "圖片縮圖";
            preview.loading = "lazy";
            const info = create_text_element("div", "", "illustration-info");
            info.append(create_text_element("strong", image.name));

            if (!located_ids.has(image.id)) {
                info.append(create_text_element("p", "尚未放入正文：請重新插入，或移除圖片。", "hint"));
            }

            info.append(
                create_illustration_field("替代文字（裝飾圖可留空）", image, "alt"),
                create_illustration_field("圖說（可空）", image, "caption"),
                create_illustration_field("顯示寬度", image, "width", "select"),
                create_illustration_field("獨立一頁（閱讀器支援程度可能不同）", image, "separate_page", "checkbox")
            );

            const actions = create_text_element("div", "", "action-row");
            actions.append(
                create_button("定位標記", "locate-illustration", image.id),
                create_button("插入游標處", "reinsert-illustration", image.id),
                create_button("移除圖片", "remove-illustration", image.id)
            );
            info.append(actions);
            row.append(preview, info);
            host.append(row);
        }
    }

    function create_preview_illustration(image) {
        const figure = document.createElement("figure");
        figure.className = "book-illustration";
        figure.style.width = `${image.width}%`;
        const picture = document.createElement("img");
        picture.src = image.data_url;
        picture.alt = image.alt;
        picture.loading = "lazy";
        figure.append(picture);

        if (image.caption) {
            figure.append(create_text_element("figcaption", image.caption));
        }

        return figure;
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
        const image_map = new Map((section.images || []).map((image) => [image.id, image]));
        fragment.append(title);
        preview.style.lineHeight = format.line_height;

        for (const line of text_import.normalize_newlines(section.body).split("\n")) {
            const image_id = illustrations.read_marker(line);

            if (image_id) {
                const image = image_map.get(image_id);
                fragment.append(image
                    ? create_preview_illustration(image)
                    : create_text_element("p", "〔找不到對應的插圖，請檢查標記〕", "hint")
                );
                continue;
            }

            const paragraph = document.createElement("p");
            paragraph.textContent = epub.adjust_line_for_indent(line, format.indent) || "\u00A0";
            paragraph.style.textIndent = format.indent === "css" && line.trim() ? "2em" : "0";
            paragraph.style.textAlign = format.align;
            paragraph.style.marginBottom = line.length ? `${format.gap}em` : "0";
            fragment.append(paragraph);
        }

        preview.replaceChildren(fragment);
    }

    async function add_illustration() {
        const section = get_active_section();
        const input = get_element("illustration_file_input");
        const file = input.files[0];

        if (!section || !file) {
            notify("請先選擇 JPG 或 PNG 圖片。");
            return;
        }

        const file_name = file.name.toLowerCase();
        const mime = file.type === "image/png" || file.type === "image/jpeg"
            ? file.type
            : /\.png$/i.test(file_name) ? "image/png"
                : /\.jpe?g$/i.test(file_name) ? "image/jpeg" : "";

        if (!mime) {
            notify("插圖僅支援 JPG 或 PNG。");
            return;
        }

        if (file.size > 8 * 1024 * 1024) {
            notify("圖片超過 8 MB，請先縮小後再插入。");
            return;
        }

        const button = get_element("add_illustration_button");
        button.disabled = true;

        try {
            const header = new Uint8Array(await file.slice(0, 12).arrayBuffer());
            const valid_png = mime === "image/png" &&
                [137, 80, 78, 71, 13, 10, 26, 10].every((value, index) => header[index] === value);
            const valid_jpeg = mime === "image/jpeg" &&
                header[0] === 0xFF && header[1] === 0xD8 && header[2] === 0xFF;

            if (!valid_png && !valid_jpeg) {
                throw new Error("檔案內容不是有效的 JPG 或 PNG。");
            }

            const data_url = await read_file_as_data_url(file);

            if (get_active_section() !== section) {
                throw new Error("章節已切換，請重新插入圖片。");
            }

            const image = illustrations.normalize_image({
                id: create_id(),
                name: file.name,
                data_url: data_url.replace(/^data:[^,]*,/i, `data:${mime};base64,`),
                alt: "",
                caption: "",
                width: "100",
                separate_page: false
            });
            const editor = get_element("section_body");
            const placement = illustrations.insert_marker(
                editor.value,
                image.id,
                get_element("illustration_position").value,
                editor.selectionStart
            );

            section.images.push(image);
            section.body = placement.body;
            editor.value = placement.body;
            editor.setSelectionRange(placement.marker_position, placement.marker_position);
            input.value = "";
            mark_editor_changed();
            render_editor_count();
            render_illustrations();
            schedule_preview();
            notify("圖片已插入；按下方「儲存」才會保留本次修改。");
        } catch (error) {
            console.error("插入圖片失敗：", error);
            notify(`無法插入圖片：${error.message}`);
        } finally {
            button.disabled = false;
        }
    }

    function update_illustration(event) {
        const control = event.target.closest("[data-image-field]");
        const section = get_active_section();

        if (!control || !section) {
            return;
        }

        const image = section.images.find((item) => item.id === control.dataset.image_id);

        if (!image) {
            return;
        }

        const field = control.dataset.image_field;
        image[field] = control.type === "checkbox" ? control.checked : control.value;
        mark_editor_changed();
        schedule_preview();
    }

    function handle_illustration_action(event) {
        const button = event.target.closest("button[data-action]");
        const section = get_active_section();

        if (!button || !section) {
            return;
        }

        const image = section.images.find((item) => item.id === button.dataset.id);

        if (!image) {
            return;
        }

        const editor = get_element("section_body");
        const marker = illustrations.create_marker(image.id);
        const marker_position = editor.value.indexOf(marker);

        if (button.dataset.action === "locate-illustration") {
            if (marker_position < 0) {
                notify("這張圖片尚未放入正文，請按「插入游標處」。");
                return;
            }

            editor.focus();
            editor.setSelectionRange(marker_position, marker_position + marker.length);
        } else if (button.dataset.action === "reinsert-illustration") {
            if (marker_position >= 0) {
                notify("這張圖片已有標記，請使用「定位標記」後移動該行。");
                return;
            }

            const placement = illustrations.insert_marker(editor.value, image.id, "cursor", editor.selectionStart);
            editor.value = placement.body;
            section.body = placement.body;
            mark_editor_changed();
            render_editor_count();
            render_illustrations();
            schedule_preview();
            notify("已將圖片放到正文游標所在行之後。");
        } else if (button.dataset.action === "remove-illustration") {
            if (!window.confirm(`確定移除「${image.name}」及正文中的插圖標記？`)) {
                return;
            }

            section.images = section.images.filter((item) => item.id !== image.id);
            section.body = illustrations.remove_marker(editor.value, image.id);
            editor.value = section.body;
            mark_editor_changed();
            render_editor_count();
            render_illustrations();
            schedule_preview();
        }
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
        const previous_parent = section_index >= 0 ? current_book.sections[section_index].parent_id : null;

        if (saved_section.parent_id) {
            const parent = current_book.sections.find((entry) => entry.id === saved_section.parent_id);

            if (!parent || parent.parent_id || parent.id === saved_section.id || section_has_children(saved_section.id)) {
                notify("上層章節無效，或此章已有子節，無法儲存階層。");
                return;
            }
        }

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

        if (saved_section.parent_id && saved_section.parent_id !== previous_parent) {
            // Move a newly assigned child to the end of its parent's group.
            current_book.sections = current_book.sections.filter((section) => section.id !== saved_section.id);
            const parent_index = current_book.sections.findIndex((section) => section.id === saved_section.parent_id);
            let insert_index = parent_index + 1;

            while (insert_index < current_book.sections.length &&
                current_book.sections[insert_index].parent_id === saved_section.parent_id) {
                insert_index += 1;
            }

            current_book.sections.splice(insert_index, 0, saved_section);
        }

        current_book.sections = arrange_sections(current_book.sections);
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
        reset_txt_selection_status();
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
        editor_pending_split.parent_id = section.parent_id;
        const moved_image_ids = new Set(illustrations.find_marker_ids(remaining_part));
        editor_pending_split.images = section.images.filter((image) => moved_image_ids.has(image.id));
        section.images = section.images.filter((image) => !moved_image_ids.has(image.id));
        render_editor_count();
        render_illustrations();
        schedule_preview();
        mark_editor_changed();
        notify("已準備拆成兩章；按儲存會新增，按取消則不變動。");
    }

    function move_section(section_id, delta) {
        const sections = current_book.sections;
        const target = sections.find((section) => section.id === section_id);

        if (!target) {
            return;
        }

        if (target.parent_id) {
            // Child sections can only move within their own parent's group.
            const siblings = sections.filter((section) => section.parent_id === target.parent_id);
            const current_index = siblings.findIndex((section) => section.id === section_id);
            const other = siblings[current_index + delta];

            if (!other) {
                return;
            }

            const first_position = sections.findIndex((section) => section.id === section_id);
            const second_position = sections.findIndex((section) => section.id === other.id);
            [sections[first_position], sections[second_position]] = [sections[second_position], sections[first_position]];
        } else {
            // Move the entire parent-and-children block, not just its title.
            const roots = sections.filter((section) => !section.parent_id);
            const root_index = roots.findIndex((section) => section.id === section_id);
            const other = roots[root_index + delta];

            if (!other) {
                return;
            }

            const blocks = roots.map((root) => [
                root,
                ...sections.filter((section) => section.parent_id === root.id)
            ]);
            [blocks[root_index], blocks[root_index + delta]] = [blocks[root_index + delta], blocks[root_index]];
            current_book.sections = blocks.flat();
        }

        schedule_save();
        render_sections();
        render_toc_preview();
    }

    function delete_section(section_id) {
        const section = current_book.sections.find((item) => item.id === section_id);

        if (!section) {
            return;
        }

        const has_children = section_has_children(section_id);
        const message = has_children
            ? `確定刪除「${section.title}」？它的子節會保留並提升為最上層，此操作不能復原。`
            : `確定刪除「${section.title}」及其全部內文？此操作不能復原。`;

        if (!window.confirm(message)) {
            return;
        }

        // Do not silently delete children's manuscripts with their parent.
        for (const child of current_book.sections) {
            if (child.parent_id === section_id) {
                child.parent_id = null;
            }
        }

        current_book.sections = current_book.sections.filter((item) => item.id !== section_id);
        schedule_save();
        render_sections();
        render_toc_preview();
        notify(has_children ? "已刪除上層項目；子節已保留。" : "已刪除章節。請記得另外備份重要原稿。");
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

        if (current_book.sections.some((section) => (section.images || []).some((image) =>
            illustrations.create_marker(image.id).includes(needle)
        ))) {
            notify("搜尋字詞包含插圖定位標記，為避免圖片失聯，請改用章節編輯器處理。");
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

    function reset_txt_selection_status() {
        get_element("txt_selection_status").textContent =
            "可一次選取多個 TXT；各檔會以檔名建立獨立章節，依檔名自然排序。";
    }

    async function decode_txt_file(file, encoding) {
        if (!/\.txt$/iu.test(file.name)) {
            throw new Error(`「${file.name}」不是 TXT 檔案。`);
        }

        // Fail explicitly on an encoding mismatch instead of silently
        // replacing broken characters throughout a novel's manuscript.
        const decoder = new TextDecoder(encoding, { fatal: true });
        const raw_data = await file.arrayBuffer();
        return decoder.decode(raw_data).replace(/^\uFEFF/u, "");
    }

    async function read_txt_file() {
        const files = Array.from(get_element("txt_file_input").files);
        const selected_revision = ++txt_selection_revision;

        if (!files.length) {
            reset_txt_selection_status();
            return;
        }

        if (files.length > 1) {
            get_element("txt_selection_status").textContent =
                `已選取 ${files.length} 個 TXT。按「批次匯入」會各建一章，不會覆蓋下方貼上的文字。`;
            return;
        }

        try {
            const file = files[0];
            const encoding = get_element("txt_encoding").value;
            const decoded_text = await decode_txt_file(file, encoding);

            // Keep the original one-file workflow: preview in the textarea
            // and choose whether to auto-split. Multi-file selection never
            // silently replaces the pasted text in that textarea.
            if (selected_revision !== txt_selection_revision) {
                return;
            }

            get_element("import_text").value = decoded_text;
            get_element("txt_selection_status").textContent =
                `已讀取「${file.name}」。可用下方文字匯入，或直接按「批次匯入」以檔名建立一章。`;
        } catch (error) {
            console.error("讀取 TXT 失敗：", error);
            get_element("txt_selection_status").textContent = "TXT 讀取失敗，請檢查編碼與檔案。";
            notify(`無法讀取 TXT：${error.message}`);
        }
    }

    async function batch_import_txt_files() {
        if (!current_book || importing_txt_files) {
            return;
        }

        const input = get_element("txt_file_input");
        const selected_files = Array.from(input.files);

        if (!selected_files.length) {
            notify("請先選擇一個或多個 TXT 檔案。");
            return;
        }

        const target_book = current_book;
        const encoding = get_element("txt_encoding").value;
        const sorted_files = text_import.sort_files_by_name(selected_files);
        const button = get_element("batch_import_button");
        importing_txt_files = true;
        button.disabled = true;

        try {
            const imported_sections = [];

            // Read all files before changing the book. If one fails, none
            // are added: there is no accidental half-import or missing chapter.
            for (const file of sorted_files) {
                const body = await decode_txt_file(file, encoding);
                imported_sections.push(create_section(
                    text_import.filename_to_chapter_title(file.name),
                    "chapter",
                    body
                ));
            }

            if (current_book !== target_book) {
                throw new Error("書籍已切換，請重新選擇要匯入的檔案。");
            }

            current_book.sections.push(...imported_sections);
            schedule_save();
            render_sections();
            render_toc_preview();
            input.value = "";
            txt_selection_revision += 1;
            reset_txt_selection_status();
            notify(`已依檔名順序新增 ${imported_sections.length} 個章節。`);
        } catch (error) {
            console.error("批次匯入 TXT 失敗：", error);
            notify(`批次匯入失敗，原章節未變動：${error.message}`);
        } finally {
            importing_txt_files = false;
            button.disabled = false;
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
        } else if (action === "add-child") {
            const parent = current_book.sections.find((section) => section.id === section_id);

            if (parent && !parent.parent_id) {
                const child = create_section("新子節", "page");
                child.parent_id = parent.id;
                open_editor(child.id, child);
            }
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
        get_element("add_group_button").addEventListener("click", () => {
            const group = create_section("新目錄分類", "group");
            open_editor(group.id, group);
        });
        get_element("generate_toc_page").addEventListener("change", (event) => {
            current_book.generate_toc_page = event.target.checked;
            schedule_save();
        });
        for (const control_id of Object.keys(toc_control_fields)) {
            const control = get_element(control_id);
            const event_name = control.tagName === "SELECT" || control.type === "checkbox"
                ? "change"
                : "input";
            control.addEventListener(event_name, () => update_toc_style(control_id, control));
        }

        get_element("toc_reset_button").addEventListener("click", reset_toc_style);
        get_element("toc_style_details").addEventListener("toggle", () => {
            if (get_element("toc_style_details").open) {
                render_toc_preview();
            }
        });
        get_element("toc_preview").addEventListener("click", (event) => {
            const link = event.composedPath().find((item) =>
                item instanceof HTMLAnchorElement && item.dataset.target_title
            );

            if (link) {
                event.preventDefault();
                get_element("toc_preview_jump").textContent =
                    `跳轉測試：將前往「${link.dataset.target_title}」。`;
            }
        });
        get_element("txt_file_input").addEventListener("change", read_txt_file);
        get_element("txt_encoding").addEventListener("change", read_txt_file);
        get_element("batch_import_button").addEventListener("click", batch_import_txt_files);
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

        get_element("section_parent").addEventListener("change", (event) => {
            const section = get_active_section();

            if (section) {
                section.parent_id = event.target.value || null;
                mark_editor_changed();
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
        get_element("illustration_details").addEventListener("toggle", () => {
            if (get_element("illustration_details").open) {
                render_illustrations();
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
        get_element("add_illustration_button").addEventListener("click", add_illustration);
        get_element("illustrations_list").addEventListener("input", update_illustration);
        get_element("illustrations_list").addEventListener("change", update_illustration);
        get_element("illustrations_list").addEventListener("click", handle_illustration_action);
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
