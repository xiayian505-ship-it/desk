"use strict";

const elements = {
    file_input: document.querySelector("#epub_file"),
    book_name: document.querySelector("#book_name"),
    toc_select: document.querySelector("#toc_select"),
    previous_chapter: document.querySelector("#previous_chapter"),
    next_chapter: document.querySelector("#next_chapter"),
    reading_mode: document.querySelector("#reading_mode"),
    decrease_font: document.querySelector("#decrease_font"),
    increase_font: document.querySelector("#increase_font"),
    frame: document.querySelector("#book_frame"),
    empty_state: document.querySelector("#empty_state"),
    previous_page: document.querySelector("#previous_page"),
    next_page: document.querySelector("#next_page"),
    page_status: document.querySelector("#page_status")
};

const reader_state = {
    book: null,
    chapter_index: 0,
    page_index: 0,
    page_count: 1,
    font_size: 18,
    render_version: 0,
    active_document: null
};

function show_status(message) {
    elements.page_status.textContent = message;
}

function update_buttons() {
    const book = reader_state.book;
    const has_book = Boolean(book);
    elements.toc_select.disabled = !has_book;
    elements.previous_chapter.disabled = !has_book || reader_state.chapter_index === 0;
    elements.next_chapter.disabled = !has_book || reader_state.chapter_index >= book.chapters.length - 1;
    const is_page_mode = elements.reading_mode.value === "page";
    elements.previous_page.disabled = !has_book || (is_page_mode &&
        reader_state.chapter_index === 0 && reader_state.page_index === 0
    );
    elements.next_page.disabled = !has_book || (is_page_mode &&
        reader_state.chapter_index === book.chapters.length - 1 &&
        reader_state.page_index >= reader_state.page_count - 1
    );
}

function render_page_status() {
    if (!reader_state.book) {
        show_status("尚未開啟書籍");
        return;
    }

    const chapter = reader_state.book.chapters[reader_state.chapter_index];
    const page_text = elements.reading_mode.value === "page"
        ? `｜第 ${reader_state.page_index + 1} / ${reader_state.page_count} 頁`
        : "｜捲動閱讀";

    show_status(`${chapter.title}${page_text}`);
    update_buttons();
}

function measure_pages() {
    if (elements.reading_mode.value !== "page") {
        reader_state.page_count = 1;
        return;
    }

    const frame_document = elements.frame.contentDocument;
    const root = frame_document?.querySelector("#epub_content_root");

    if (!root) {
        reader_state.page_count = 1;
        return;
    }

    const page_width = elements.frame.contentWindow.innerWidth;
    reader_state.page_count = Math.max(1, Math.ceil((root.scrollWidth - 1) / page_width));
}

function show_page(index) {
    reader_state.page_index = Math.max(0, Math.min(index, reader_state.page_count - 1));
    const frame_document = elements.frame.contentDocument;
    const root = frame_document?.querySelector("#epub_content_root");

    if (root) {
        const page_width = elements.frame.contentWindow.innerWidth;
        root.style.transform = `translateX(-${reader_state.page_index * page_width}px)`;
    }

    render_page_status();
}

function find_chapter_by_path(path) {
    return reader_state.book.chapters.findIndex(chapter => chapter.path === path);
}

function go_to_fragment(fragment) {
    if (!fragment || !elements.frame.contentDocument) {
        return;
    }

    const frame_document = elements.frame.contentDocument;
    const target = frame_document.getElementById(decodeURIComponent(fragment));

    if (!target) {
        return;
    }

    if (elements.reading_mode.value === "page") {
        // 多欄模式以目前元素相對容器的橫向位置決定頁碼。
        const root = frame_document.querySelector("#epub_content_root");
        const page_width = elements.frame.contentWindow.innerWidth;
        const position = Math.max(0, target.getBoundingClientRect().left - root.getBoundingClientRect().left);
        show_page(Math.floor(position / page_width));
    } else {
        target.scrollIntoView({ block: "start" });
    }
}

function setup_chapter_links(chapter_path) {
    const frame_document = elements.frame.contentDocument;
    let touch_start = null;

    // 手機「翻頁」模式可以左右滑動；捲動模式仍保留原生上下滑動。
    frame_document.addEventListener("touchstart", event => {
        const touch = event.changedTouches[0];

        if (touch) {
            touch_start = { x: touch.clientX, y: touch.clientY };
        }
    }, { passive: true });

    frame_document.addEventListener("touchend", event => {
        if (elements.reading_mode.value !== "page" || !touch_start) {
            return;
        }

        const touch = event.changedTouches[0];

        if (!touch) {
            return;
        }

        const horizontal_distance = touch.clientX - touch_start.x;
        const vertical_distance = touch.clientY - touch_start.y;
        touch_start = null;

        if (Math.abs(horizontal_distance) > 45 &&
            Math.abs(horizontal_distance) > Math.abs(vertical_distance) * 1.3) {
            move_page(horizontal_distance < 0 ? 1 : -1);
        }
    }, { passive: true });

    frame_document.addEventListener("click", event => {
        const anchor = event.target.closest("a[href]");

        if (!anchor) {
            return;
        }

        const href = anchor.getAttribute("href");

        if (/^(https?:|mailto:|tel:|\/\/)/i.test(href)) {
            event.preventDefault();
            return;
        }

        const fragment = href.includes("#") ? href.split("#").slice(1).join("#") : "";
        const path = href.startsWith("#")
            ? chapter_path
            : resolve_epub_path(chapter_path, href);
        const index = find_chapter_by_path(path);
        event.preventDefault();

        if (index >= 0) {
            if (index === reader_state.chapter_index) {
                go_to_fragment(fragment);
            } else {
                render_chapter(index, fragment);
            }
        }
    });
}

async function render_chapter(index, fragment = "") {
    if (!reader_state.book) {
        return;
    }

    const render_version = ++reader_state.render_version;
    reader_state.chapter_index = index;
    reader_state.page_index = 0;
    reader_state.page_count = 1;
    elements.toc_select.value = String(index);
    show_status("正在排版…");
    update_buttons();

    try {
        const html = await reader_state.book.get_chapter_html(
            index,
            elements.reading_mode.value,
            reader_state.font_size
        );

        if (render_version !== reader_state.render_version) {
            return;
        }

        const load_completed = new Promise(resolve => {
            elements.frame.addEventListener("load", resolve, { once: true });
        });

        elements.frame.srcdoc = html;
        await load_completed;

        if (render_version !== reader_state.render_version) {
            return;
        }

        reader_state.active_document = elements.frame.contentDocument;
        setup_chapter_links(reader_state.book.chapters[index].path);
        await new Promise(resolve => requestAnimationFrame(resolve));
        measure_pages();
        show_page(0);
        go_to_fragment(fragment);
        render_page_status();
    } catch (error) {
        show_status(`無法顯示章節：${error.message}`);
        console.error(error);
    }
}

async function open_epub(file) {
    if (!file) {
        return;
    }

    show_status("正在開啟 EPUB…");

    try {
        const book = await LocalEpubBook.open(file);
        ++reader_state.render_version;

        if (reader_state.book) {
            reader_state.book.close();
        }

        reader_state.book = book;
        reader_state.chapter_index = 0;
        reader_state.page_index = 0;
        elements.book_name.textContent = `${book.book_title}（${file.name}）`;
        elements.toc_select.replaceChildren();

        for (let index = 0; index < book.chapters.length; index += 1) {
            const chapter = book.chapters[index];
            const option = document.createElement("option");
            option.value = String(index);
            option.textContent = chapter.title;
            elements.toc_select.append(option);
        }

        elements.frame.hidden = false;
        elements.empty_state.hidden = true;
        await render_chapter(0);
    } catch (error) {
        show_status(`無法開啟：${error.message}`);
        console.error(error);
    }
}

async function move_page(direction) {
    if (!reader_state.book) {
        return;
    }

    if (elements.reading_mode.value === "page") {
        const destination = reader_state.page_index + direction;

        if (destination >= 0 && destination < reader_state.page_count) {
            show_page(destination);
            return;
        }
    } else {
        const window = elements.frame.contentWindow;
        const document = elements.frame.contentDocument;
        const max_scroll = Math.max(
            0,
            document.documentElement.scrollHeight - window.innerHeight
        );
        const desired_position = window.scrollY + direction * window.innerHeight * 0.85;

        if (desired_position >= 0 && desired_position <= max_scroll) {
            window.scrollTo({ top: desired_position, behavior: "smooth" });
            return;
        }

        if (direction < 0 && window.scrollY > 1) {
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        if (direction > 0 && window.scrollY < max_scroll - 1) {
            window.scrollTo({ top: max_scroll, behavior: "smooth" });
            return;
        }
    }

    const next_chapter = reader_state.chapter_index + direction;

    if (next_chapter >= 0 && next_chapter < reader_state.book.chapters.length) {
        await render_chapter(next_chapter);

        if (direction < 0) {
            if (elements.reading_mode.value === "page") {
                show_page(reader_state.page_count - 1);
            } else {
                const window = elements.frame.contentWindow;
                window.scrollTo(0, elements.frame.contentDocument.documentElement.scrollHeight);
            }
        }
    }
}

elements.file_input.addEventListener("click", event => {
    // 允許重新選取同名且已修改的 EPUB，用來重測新匯出的版本。
    event.target.value = "";
});

elements.file_input.addEventListener("change", event => {
    open_epub(event.target.files[0]);
});

elements.toc_select.addEventListener("change", event => {
    render_chapter(Number(event.target.value));
});

elements.previous_chapter.addEventListener("click", () => {
    render_chapter(reader_state.chapter_index - 1);
});

elements.next_chapter.addEventListener("click", () => {
    render_chapter(reader_state.chapter_index + 1);
});

elements.previous_page.addEventListener("click", () => move_page(-1));
elements.next_page.addEventListener("click", () => move_page(1));

elements.reading_mode.addEventListener("change", () => {
    if (reader_state.book) {
        render_chapter(reader_state.chapter_index);
    }
});

elements.decrease_font.addEventListener("click", () => {
    reader_state.font_size = Math.max(12, reader_state.font_size - 2);

    if (reader_state.book) {
        render_chapter(reader_state.chapter_index);
    }
});

elements.increase_font.addEventListener("click", () => {
    reader_state.font_size = Math.min(32, reader_state.font_size + 2);

    if (reader_state.book) {
        render_chapter(reader_state.chapter_index);
    }
});

window.addEventListener("keydown", event => {
    if (!reader_state.book || ["INPUT", "SELECT", "TEXTAREA"].includes(event.target.tagName)) {
        return;
    }

    if (event.key === "ArrowRight" || event.key === "PageDown") {
        event.preventDefault();
        move_page(1);
    } else if (event.key === "ArrowLeft" || event.key === "PageUp") {
        event.preventDefault();
        move_page(-1);
    }
});

let resize_timer;
window.addEventListener("resize", () => {
    if (!reader_state.book || elements.reading_mode.value !== "page") {
        return;
    }

    clearTimeout(resize_timer);
    resize_timer = setTimeout(() => {
        measure_pages();
        show_page(Math.min(reader_state.page_index, reader_state.page_count - 1));
    }, 160);
});
