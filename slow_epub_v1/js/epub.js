/* Build a reflowable EPUB 3 book from locally edited plain-text sections. */
(function () {
    "use strict";

    const illustrations = window.SlowIllustrations;

    function escape_xml(input) {
        return String(input ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&apos;");
    }

    function safe_xml_text(input) {
        // Invalid XML 1.0 control characters are removed only in the export.
        // The source text in the project remains untouched.
        return String(input ?? "")
            .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\uFFFE\uFFFF]/g, "")
            .replace(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g, "\uFFFD");
    }

    function sanitize_language(language) {
        return /^[a-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/i.test(language || "")
            ? language
            : "zh-TW";
    }

    function sanitize_format(format) {
        const requested = format || {};
        const indent = ["preserve", "css", "none"].includes(requested.indent)
            ? requested.indent
            : "preserve";
        const align = ["left", "justify", "center", "right"].includes(requested.align)
            ? requested.align
            : "left";
        const line_height = ["1.4", "1.6", "1.8", "2.0"].includes(String(requested.line_height))
            ? String(requested.line_height)
            : "1.8";
        const gap = ["0", "0.5", "1"].includes(String(requested.gap))
            ? String(requested.gap)
            : "0";

        return { indent, align, line_height, gap };
    }

    // Contents-page settings belong to each book. The EPUB navigation panel
    // remains controlled by the reader, so only nav.xhtml receives this CSS.
    const default_toc_style = Object.freeze({
        color: "#242424",
        heading_size: 1.5,
        link_size: 1,
        line_height: 1.8,
        item_gap: 0.5,
        indent: 0,
        align: "left",
        underline: false,
        custom_css: ""
    });

    function toc_default_style() {
        return { ...default_toc_style };
    }

    function toc_number(value, fallback, minimum, maximum) {
        const number = Number(value);
        return Number.isFinite(number) && number >= minimum && number <= maximum
            ? number
            : fallback;
    }

    function normalize_toc_style(value) {
        const source = value && typeof value === "object" ? value : {};

        return {
            color: /^#[0-9a-fA-F]{6}$/.test(source.color || "")
                ? source.color
                : default_toc_style.color,
            heading_size: toc_number(source.heading_size, 1.5, 1, 3),
            link_size: toc_number(source.link_size, 1, 0.8, 2.5),
            line_height: toc_number(source.line_height, 1.8, 1, 3),
            item_gap: toc_number(source.item_gap, 0.5, 0, 3),
            indent: toc_number(source.indent, 0, 0, 5),
            align: ["left", "center", "right"].includes(source.align)
                ? source.align
                : "left",
            underline: source.underline === true,
            custom_css: String(source.custom_css ?? "").slice(0, 12000)
        };
    }

    function validate_toc_css(custom_css) {
        const css = String(custom_css ?? "");

        // Keep the EPUB self-contained. Raw CSS is inserted into a separate
        // file rather than HTML, and only on nav.xhtml (not novel chapters).
        // Prevent external requests, at-rules, and style-tag terminators.
        if (/@|url\s*\(|expression\s*\(|(?:-moz-binding|behavior)\s*:|<\s*\/?\s*style/i.test(css)) {
            throw new Error("自訂目錄 CSS 不可使用 @ 規則、url()、外部資源或 HTML 標籤。");
        }

        if (css.length > 12000) {
            throw new Error("自訂目錄 CSS 不可超過 12000 字元。");
        }

        return css;
    }

    // Do not specify a font family for either the contents page or chapters.
    // Both should follow the font chosen in the reader rather than forcing serif.
    function build_toc_css(value) {
        const style = normalize_toc_style(value);
        const custom_css = validate_toc_css(style.custom_css);

        return `@charset "utf-8";

#toc {
    color: ${style.color};
}

#toc h1 {
    font-size: ${style.heading_size}em;
    text-align: center;
    line-height: 1.5;
    margin: 1.5em 0 1.8em;
}

#toc ol {
    list-style: none;
    padding-left: ${style.indent}em;
    margin: 0;
    line-height: ${style.line_height};
}

#toc li {
    margin: 0 0 ${style.item_gap}em;
    text-align: ${style.align};
}

#toc ol ol {
    padding-left: 1.5em;
    margin-top: ${style.item_gap}em;
}

#toc li > span {
    color: ${style.color};
    font-size: ${style.link_size}em;
}

#toc a,
#toc a:link,
#toc a:visited {
    color: ${style.color};
    font-size: ${style.link_size}em;
    text-decoration: ${style.underline ? "underline" : "none"};
}

/* 自訂目錄 CSS：以下樣式在基本設定後套用。 */
${custom_css}
`;
    }

    function get_toc_sections(sections) {
        const physical_sections = sections.filter((section) => section.type !== "group");
        const listed_sections = physical_sections.filter((section) => section.include_toc !== false);
        return listed_sections.length ? listed_sections : physical_sections.slice(0, 1);
    }

    function get_toc_tree(sections) {
        // EPUB 3 allows a <li> to contain either a link or a span heading,
        // followed by a nested <ol>. Only the linked entries need XHTML files.
        const readable_sections = get_toc_sections(sections);
        const visible_ids = new Set(readable_sections.map((section) => section.id));
        const group_ids = new Set(sections
            .filter((section) => section.type === "group")
            .map((section) => section.id));
        const by_id = new Map();
        const roots = [];

        for (const section of sections) {
            if (section.type === "group") {
                by_id.set(section.id, { section, children: [] });
            } else if (visible_ids.has(section.id)) {
                by_id.set(section.id, { section, children: [] });
            }
        }

        for (const section of sections) {
            const node = by_id.get(section.id);

            if (!node) {
                continue;
            }

            const parent = by_id.get(section.parent_id);

            if (parent && !parent.section.parent_id && parent.section.id !== section.id) {
                parent.children.push(node);
            } else {
                roots.push(node);
            }
        }

        // Standalone directory groups are omitted until they have at least
        // one visible child; they must never create a blank EPUB page.
        return roots.filter((node) => node.section.type !== "group" || node.children.length);
    }

    function adjust_line_for_indent(text, indent) {
        if (indent === "css" || indent === "none") {
            return text.replace(/^[ \t\u3000]+/, "");
        }

        return text;
    }

    function illustration_html(image) {
        const image_class = image.separate_page
            ? "book-illustration illustration-new-page"
            : "book-illustration";
        const caption = image.caption
            ? `\n            <figcaption>${escape_xml(safe_xml_text(image.caption))}</figcaption>`
            : "";

        return `<figure class="${image_class}" style="width: ${image.width}%;">
            <img src="../${image.path}" alt="${escape_xml(safe_xml_text(image.alt))}" />${caption}
        </figure>`;
    }

    function section_text_html(text, format, image_assets = []) {
        const lines = String(text ?? "").replace(/\r\n?/g, "\n").split("\n");
        const image_map = new Map(image_assets.map((image) => [image.id, image]));

        return lines.map((line) => {
            const image_id = illustrations.read_marker(line);

            if (image_id) {
                const image = image_map.get(image_id);

                if (!image) {
                    throw new Error("正文包含無法找到對應檔案的插圖標記。");
                }

                return illustration_html(image);
            }

            if (line.length === 0) {
                return '<p class="blank-line">&#160;</p>';
            }

            const output_line = adjust_line_for_indent(line, format.indent);

            if (!output_line) {
                return '<p class="blank-line">&#160;</p>';
            }

            return `<p class="body-paragraph" style="margin-bottom: ${format.gap}em;">${escape_xml(safe_xml_text(output_line))}</p>`;
        }).join("\n");
    }

    function section_document(section, language, image_assets = []) {
        const format = sanitize_format(section.format);
        const classes = `indent-${format.indent} align-${format.align}`;
        const style = `line-height: ${format.line_height};`;
        const title = escape_xml(safe_xml_text(section.title || "未命名頁面"));

        return `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="${escape_xml(language)}" lang="${escape_xml(language)}">
<head>
    <meta charset="utf-8" />
    <title>${title}</title>
    <link rel="stylesheet" type="text/css" href="../styles/book.css" />
</head>
<body>
    <section class="book-section ${classes}" style="${style}">
        <h1 class="chapter-title">${title}</h1>
        <div class="chapter-text">
${section_text_html(section.body, format, image_assets)}
        </div>
    </section>
</body>
</html>`;
    }

    function navigation_document(book, sections, language) {
        const toc_tree = get_toc_tree(sections);

        function navigation_list(nodes, depth = 0) {
            const indent = "    ".repeat(depth + 3);

            return nodes.map((node) => {
                const section = node.section;
                const title = escape_xml(safe_xml_text(section.title || "未命名頁面"));
                const heading = section.type === "group"
                    ? `<span>${title}</span>`
                    : `<a href="text/${section.filename}">${title}</a>`;
                const children = node.children.length
                    ? `\n${indent}    <ol>\n${navigation_list(node.children, depth + 2)}\n${indent}    </ol>\n${indent}`
                    : "";

                return `${indent}<li>${heading}${children}</li>`;
            }).join("\n");
        }

        const items = navigation_list(toc_tree);

        return `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="${escape_xml(language)}" lang="${escape_xml(language)}">
<head>
    <meta charset="utf-8" />
    <title>目錄</title>
    <link rel="stylesheet" type="text/css" href="styles/book.css" />
    <link rel="stylesheet" type="text/css" href="styles/toc.css" />
</head>
<body>
    <nav epub:type="toc" id="toc">
        <h1>目錄</h1>
        <ol>
${items}
        </ol>
    </nav>
</body>
</html>`;
    }

    function get_cover_info(book) {
        if (!book.cover || !book.cover.data_url) {
            return null;
        }

        const match = /^data:(image\/(?:jpeg|png));base64,([A-Za-z0-9+/=]+)$/.exec(book.cover.data_url);

        if (!match) {
            throw new Error("封面格式無法辨識。請重新選擇 JPG 或 PNG。");
        }

        const extension = match[1] === "image/png" ? "png" : "jpg";
        const binary = atob(match[2]);
        const bytes = new Uint8Array(binary.length);

        for (let index = 0; index < binary.length; index += 1) {
            bytes[index] = binary.charCodeAt(index);
        }

        return {
            path: `images/cover.${extension}`,
            mime: match[1],
            data: bytes
        };
    }

    function get_illustration_info(image, path) {
        const match = /^data:(image\/(?:jpeg|png));base64,([A-Za-z0-9+/=]+)$/i.exec(image.data_url);

        if (!match) {
            throw new Error(`插圖「${image.name}」格式無法辨識，請重新加入 JPG 或 PNG。`);
        }

        const binary = atob(match[2]);
        const bytes = new Uint8Array(binary.length);

        for (let index = 0; index < binary.length; index += 1) {
            bytes[index] = binary.charCodeAt(index);
        }

        const is_png = match[1].toLowerCase() === "image/png";
        const valid_signature = is_png
            ? [137, 80, 78, 71, 13, 10, 26, 10].every((value, index) => bytes[index] === value)
            : bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF;

        if (!valid_signature) {
            throw new Error(`插圖「${image.name}」檔案格式不正確，請重新加入。`);
        }

        return {
            ...illustrations.normalize_image(image),
            path,
            mime: match[1].toLowerCase(),
            data: bytes
        };
    }

    function get_book_illustrations(sections) {
        const all_images = [];
        const section_images = [];

        for (const [section_index, section] of sections.entries()) {
            illustrations.validate_images(section);
            const assets = [];

            for (const [image_index, image] of (section.images || []).entries()) {
                const extension = image.data_url.toLowerCase().startsWith("data:image/png;")
                    ? "png" : "jpg";
                const filename = `illustration-${String(section_index + 1).padStart(3, "0")}-${String(image_index + 1).padStart(3, "0")}.${extension}`;
                const asset = get_illustration_info(image, `images/${filename}`);
                assets.push(asset);
                all_images.push(asset);
            }

            section_images.push(assets);
        }

        return { all_images, section_images };
    }

    function cover_document(book, language, cover) {
        return `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="${escape_xml(language)}" lang="${escape_xml(language)}">
<head>
    <meta charset="utf-8" />
    <title>封面</title>
    <link rel="stylesheet" type="text/css" href="styles/book.css" />
</head>
<body class="cover-page">
    <div class="cover-container">
        <img src="${cover.path}" alt="${escape_xml(safe_xml_text(book.title || "書籍封面"))}" />
    </div>
</body>
</html>`;
    }

    function package_document(book, sections, cover, images, modified_time, language) {
        const title = escape_xml(safe_xml_text(book.title || "未命名書籍"));
        const author = escape_xml(safe_xml_text(book.author || "未署名"));
        const identifier = escape_xml(book.id || "slow-epub-book");
        const optional_meta = [
            book.publisher ? `        <dc:publisher>${escape_xml(safe_xml_text(book.publisher))}</dc:publisher>` : "",
            book.description ? `        <dc:description>${escape_xml(safe_xml_text(book.description))}</dc:description>` : "",
            book.rights ? `        <dc:rights>${escape_xml(safe_xml_text(book.rights))}</dc:rights>` : ""
        ].filter(Boolean).join("\n");
        const manifest_sections = sections.map((section, index) => (
            `        <item id="section-${index + 1}" href="text/${section.filename}" media-type="application/xhtml+xml" />`
        )).join("\n");
        const spine_sections = sections.map((section, index) => (
            `        <itemref idref="section-${index + 1}" />`
        )).join("\n");
        const cover_manifest = cover
            ? `        <item id="cover-page" href="cover.xhtml" media-type="application/xhtml+xml" />\n        <item id="cover-image" href="${cover.path}" media-type="${cover.mime}" properties="cover-image" />`
            : "";
        const cover_spine = cover ? '        <itemref idref="cover-page" />\n' : "";
        const illustration_manifest = images.map((image, index) => (
            `        <item id="illustration-${index + 1}" href="${image.path}" media-type="${image.mime}" />`
        )).join("\n");
        // nav.xhtml is already a valid XHTML document with clickable chapter
        // links. Adding it to the spine makes it a visible contents page.
        const visible_toc_spine = book.generate_toc_page === true
            ? '        <itemref idref="nav" />\n'
            : "";

        return `<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="book-id" xml:lang="${escape_xml(language)}">
    <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
        <dc:identifier id="book-id">urn:uuid:${identifier}</dc:identifier>
        <dc:title>${title}</dc:title>
        <dc:creator>${author}</dc:creator>
        <dc:language>${escape_xml(language)}</dc:language>
        <meta property="dcterms:modified">${modified_time}</meta>
${optional_meta}
    </metadata>
    <manifest>
        <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav" />
        <item id="style" href="styles/book.css" media-type="text/css" />
        <item id="toc-style" href="styles/toc.css" media-type="text/css" />
${cover_manifest}
${illustration_manifest}
${manifest_sections}
    </manifest>
    <spine page-progression-direction="ltr">
${cover_spine}${visible_toc_spine}${spine_sections}
    </spine>
</package>`;
    }

    // Keep font-family unset throughout exported XHTML. The reading app
    // remains in charge of the font for chapters, preliminaries, and appendices.
    const book_css = `@charset "utf-8";

html {
    writing-mode: horizontal-tb;
}

body {
    margin: 0;
    padding: 0;
}

.chapter-title {
    text-align: center;
    font-weight: bold;
    font-size: 1.5em;
    line-height: 1.5;
    margin: 1.5em 0 1.8em;
}

.chapter-text {
    margin: 0;
    padding: 0;
}

.body-paragraph {
    white-space: pre-wrap;
    overflow-wrap: break-word;
    margin: 0;
}

.blank-line {
    margin: 0;
    padding: 0;
    height: 1em;
    line-height: 1;
}

.indent-preserve .body-paragraph,
.indent-none .body-paragraph {
    text-indent: 0;
}

.indent-css .body-paragraph {
    text-indent: 2em;
}

.align-left .body-paragraph {
    text-align: left;
}

.align-justify .body-paragraph {
    text-align: justify;
}

.align-center .body-paragraph {
    text-align: center;
}

.align-right .body-paragraph {
    text-align: right;
}

.book-illustration {
    display: block;
    max-width: 100%;
    margin: 1.2em auto;
    padding: 0;
    text-align: center;
    break-inside: avoid;
    page-break-inside: avoid;
}

.book-illustration img {
    display: block;
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 95vh;
    margin: 0 auto;
}

.book-illustration figcaption {
    margin-top: 0.5em;
    font-size: 0.9em;
    line-height: 1.5;
}

.illustration-new-page {
    break-before: page;
    break-after: page;
    page-break-before: always;
    page-break-after: always;
}

nav h1 {
    text-align: center;
}

nav ol {
    line-height: 1.8;
}

.cover-page {
    margin: 0;
    padding: 0;
    text-align: center;
}

.cover-container img {
    display: block;
    max-width: 100%;
    max-height: 100%;
    margin: 0 auto;
}
`;

    function export_epub(book) {
        if (!book || !Array.isArray(book.sections) || book.sections.length === 0) {
            throw new Error("請先新增至少一個章節或內頁。");
        }

        const language = sanitize_language(book.language);
        const modified_time = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
        const cover = get_cover_info(book);
        const content_sections = book.sections.filter((section) => section.type !== "group");

        if (!content_sections.length) {
            throw new Error("至少需要一章有正文的章節／內頁，目錄分類不能單獨匯出。");
        }

        const sections = content_sections.map((section, index) => ({
            ...section,
            filename: `section-${String(index + 1).padStart(3, "0")}.xhtml`
        }));
        const section_map = new Map(sections.map((section) => [section.id, section]));
        const navigation_sections = book.sections.map((section) =>
            section_map.get(section.id) || section
        );
        const book_illustrations = get_book_illustrations(sections);
        const files = [
            // EPUB OCF requires this exact first, uncompressed entry.
            { name: "mimetype", content: "application/epub+zip" },
            {
                name: "META-INF/container.xml",
                content: `<?xml version="1.0" encoding="utf-8"?>\n<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">\n    <rootfiles>\n        <rootfile full-path="OEBPS/package.opf" media-type="application/oebps-package+xml" />\n    </rootfiles>\n</container>`
            },
            { name: "OEBPS/styles/book.css", content: book_css },
            { name: "OEBPS/styles/toc.css", content: build_toc_css(book.toc_style) },
            { name: "OEBPS/nav.xhtml", content: navigation_document(book, navigation_sections, language) },
            {
                name: "OEBPS/package.opf",
                content: package_document(book, sections, cover, book_illustrations.all_images, modified_time, language)
            }
        ];

        if (cover) {
            files.push({ name: `OEBPS/${cover.path}`, content: cover.data });
            files.push({ name: "OEBPS/cover.xhtml", content: cover_document(book, language, cover) });
        }

        for (const image of book_illustrations.all_images) {
            files.push({ name: `OEBPS/${image.path}`, content: image.data });
        }

        for (const [index, section] of sections.entries()) {
            files.push({
                name: `OEBPS/text/${section.filename}`,
                content: section_document(section, language, book_illustrations.section_images[index])
            });
        }

        return window.SlowZipWriter.create_zip(files);
    }

    window.SlowEpub = {
        export_epub,
        sanitize_format,
        adjust_line_for_indent,
        toc_default_style,
        normalize_toc_style,
        build_toc_css,
        get_toc_sections,
        get_toc_tree
    };
}());
