/* Build a reflowable EPUB 3 book from locally edited plain-text sections. */
(function () {
    "use strict";

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

    function adjust_line_for_indent(text, indent) {
        if (indent === "css" || indent === "none") {
            return text.replace(/^[ \t\u3000]+/, "");
        }

        return text;
    }

    function section_text_html(text, format) {
        const lines = String(text ?? "").replace(/\r\n?/g, "\n").split("\n");

        return lines.map((line) => {
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

    function section_document(section, language) {
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
${section_text_html(section.body, format)}
        </div>
    </section>
</body>
</html>`;
    }

    function navigation_document(book, sections, language) {
        const all_toc_sections = sections.filter((section) => section.include_toc !== false);
        const toc_sections = all_toc_sections.length ? all_toc_sections : sections.slice(0, 1);
        const items = toc_sections.map((section) => (
            `            <li><a href="text/${section.filename}">${escape_xml(safe_xml_text(section.title || "未命名頁面"))}</a></li>`
        )).join("\n");

        return `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="${escape_xml(language)}" lang="${escape_xml(language)}">
<head>
    <meta charset="utf-8" />
    <title>目錄</title>
    <link rel="stylesheet" type="text/css" href="styles/book.css" />
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

    function package_document(book, sections, cover, modified_time, language) {
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
${cover_manifest}
${manifest_sections}
    </manifest>
    <spine page-progression-direction="ltr">
${cover_spine}${visible_toc_spine}${spine_sections}
    </spine>
</package>`;
    }

    const book_css = `@charset "utf-8";

html {
    writing-mode: horizontal-tb;
}

body {
    margin: 0;
    padding: 0;
    font-family: serif;
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
        const sections = book.sections.map((section, index) => ({
            ...section,
            filename: `section-${String(index + 1).padStart(3, "0")}.xhtml`
        }));
        const files = [
            // EPUB OCF requires this exact first, uncompressed entry.
            { name: "mimetype", content: "application/epub+zip" },
            {
                name: "META-INF/container.xml",
                content: `<?xml version="1.0" encoding="utf-8"?>\n<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">\n    <rootfiles>\n        <rootfile full-path="OEBPS/package.opf" media-type="application/oebps-package+xml" />\n    </rootfiles>\n</container>`
            },
            { name: "OEBPS/styles/book.css", content: book_css },
            { name: "OEBPS/nav.xhtml", content: navigation_document(book, sections, language) },
            {
                name: "OEBPS/package.opf",
                content: package_document(book, sections, cover, modified_time, language)
            }
        ];

        if (cover) {
            files.push({ name: `OEBPS/${cover.path}`, content: cover.data });
            files.push({ name: "OEBPS/cover.xhtml", content: cover_document(book, language, cover) });
        }

        for (const section of sections) {
            files.push({
                name: `OEBPS/text/${section.filename}`,
                content: section_document(section, language)
            });
        }

        return window.SlowZipWriter.create_zip(files);
    }

    window.SlowEpub = {
        export_epub,
        sanitize_format,
        adjust_line_for_indent
    };
}());
