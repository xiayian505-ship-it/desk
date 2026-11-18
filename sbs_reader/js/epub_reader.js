"use strict";

function normalize_epub_path(path) {
    const parts = [];

    for (const part of decodeURIComponent(path).split("/")) {
        if (!part || part === ".") {
            continue;
        }

        if (part === "..") {
            parts.pop();
        } else {
            parts.push(part);
        }
    }

    return parts.join("/");
}

function resolve_epub_path(from_path, relative_href) {
    const relative_path = relative_href.split("#")[0].split("?")[0];
    const base_directory = from_path.slice(0, from_path.lastIndexOf("/") + 1);

    return normalize_epub_path(
        relative_path.startsWith("/")
            ? relative_path
            : base_directory + relative_path
    );
}

function parse_epub_xml(xml_text, filename) {
    const document = new DOMParser().parseFromString(xml_text, "application/xml");

    if (document.querySelector("parsererror")) {
        throw new Error(`XML 解析失敗：${filename}`);
    }

    return document;
}

function get_epub_elements(document, local_name) {
    return Array.from(document.getElementsByTagNameNS("*", local_name));
}

class LocalEpubBook {
    constructor(zip_reader) {
        this.zip = zip_reader;
        this.book_title = "未命名書籍";
        this.chapters = [];
        this.toc = [];
        this.manifest = new Map();
        this.object_urls = new Map();
        this.base_path = "";
    }

    static async open(file) {
        const zip_reader = new LocalZipReader(await file.arrayBuffer());
        const book = new LocalEpubBook(zip_reader);
        await book.load_package();
        return book;
    }

    async load_package() {
        const container = parse_epub_xml(
            await this.zip.read_text("META-INF/container.xml"),
            "META-INF/container.xml"
        );
        const rootfile = get_epub_elements(container, "rootfile")[0];

        if (!rootfile) {
            throw new Error("EPUB 缺少 container.xml 內的 OPF 路徑。");
        }

        this.base_path = rootfile.getAttribute("full-path");
        const package_xml = parse_epub_xml(
            await this.zip.read_text(this.base_path),
            this.base_path
        );
        const title_node = get_epub_elements(package_xml, "title")[0];

        if (title_node && title_node.textContent.trim()) {
            this.book_title = title_node.textContent.trim();
        }

        for (const item of get_epub_elements(package_xml, "item")) {
            const id = item.getAttribute("id");
            const href = item.getAttribute("href");

            if (!id || !href) {
                continue;
            }

            this.manifest.set(id, {
                id,
                path: resolve_epub_path(this.base_path, href),
                media_type: item.getAttribute("media-type") || "",
                properties: item.getAttribute("properties") || ""
            });
        }

        for (const itemref of get_epub_elements(package_xml, "itemref")) {
            const resource = this.manifest.get(itemref.getAttribute("idref"));

            if (!resource) {
                continue;
            }

            this.chapters.push({
                ...resource,
                title: resource.path.split("/").pop()
            });
        }

        if (this.chapters.length === 0) {
            throw new Error("這本 EPUB 沒有可讀取的章節。");
        }

        const navigation = Array.from(this.manifest.values()).find(resource =>
            resource.properties.split(/\s+/).includes("nav")
        );

        if (navigation) {
            await this.load_epub3_toc(navigation.path);
        }

        // 支援 EPUB 2 的 NCX（未提供 EPUB 3 nav 時）。
        if (this.toc.length === 0) {
            const ncx_resource = Array.from(this.manifest.values()).find(resource =>
                resource.media_type === "application/x-dtbncx+xml"
            );

            if (ncx_resource) {
                await this.load_ncx_toc(ncx_resource.path);
            }
        }

        for (const chapter of this.chapters) {
            const match = this.toc.find(entry => entry.path === chapter.path);

            if (match) {
                chapter.title = match.title;
            } else {
                // 封面及目錄常在 spine 內，卻不一定列在 nav 目錄中。
                const chapter_source = await this.zip.read_text(chapter.path);
                const title_match = chapter_source.match(/<title[^>]*>([^<]*)<\/title>/i);

                if (title_match && title_match[1].trim()) {
                    chapter.title = title_match[1].trim();
                }
            }
        }

        if (this.toc.length === 0) {
            this.toc = this.chapters.map(chapter => ({
                title: chapter.title,
                path: chapter.path,
                fragment: "",
                depth: 0
            }));
        }
    }

    async load_epub3_toc(navigation_path) {
        const document = parse_epub_xml(
            await this.zip.read_text(navigation_path), navigation_path
        );
        const toc_navigation = get_epub_elements(document, "nav").find(node =>
            node.getAttribute("epub:type") === "toc" ||
            node.getAttributeNS("http://www.idpf.org/2007/ops", "type") === "toc" ||
            node.getAttribute("id") === "toc"
        ) || get_epub_elements(document, "nav")[0];

        if (!toc_navigation) {
            return;
        }

        const walk_list = (list, depth) => {
            for (const child of Array.from(list.children)) {
                if (child.localName !== "li") {
                    continue;
                }

                const anchor = Array.from(child.children).find(node => node.localName === "a");
                const label = anchor || Array.from(child.children).find(node => node.localName === "span");

                if (anchor) {
                    const href = anchor.getAttribute("href") || "";
                    const fragment = href.includes("#") ? href.split("#").slice(1).join("#") : "";
                    this.toc.push({
                        title: anchor.textContent.trim(),
                        path: resolve_epub_path(navigation_path, href),
                        fragment,
                        depth
                    });
                } else if (label) {
                    this.toc.push({
                        title: label.textContent.trim(),
                        path: "",
                        fragment: "",
                        depth
                    });
                }

                const nested_list = Array.from(child.children).find(node => node.localName === "ol");

                if (nested_list) {
                    walk_list(nested_list, depth + 1);
                }
            }
        };

        const root_list = Array.from(toc_navigation.children).find(node => node.localName === "ol");

        if (root_list) {
            walk_list(root_list, 0);
        }
    }

    async load_ncx_toc(navigation_path) {
        const document = parse_epub_xml(
            await this.zip.read_text(navigation_path), navigation_path
        );
        const nav_map = get_epub_elements(document, "navMap")[0];

        if (!nav_map) {
            return;
        }

        const walk_points = (container, depth) => {
            for (const child of Array.from(container.children)) {
                if (child.localName !== "navPoint") {
                    continue;
                }

                const content = get_epub_elements(child, "content")[0];
                const nav_label = get_epub_elements(child, "navLabel")[0];
                const href = content ? (content.getAttribute("src") || "") : "";

                this.toc.push({
                    title: nav_label ? nav_label.textContent.trim() : "未命名章節",
                    path: resolve_epub_path(navigation_path, href),
                    fragment: href.includes("#") ? href.split("#").slice(1).join("#") : "",
                    depth
                });

                walk_points(child, depth + 1);
            }
        };

        walk_points(nav_map, 0);
    }

    async resource_url(path) {
        if (this.object_urls.has(path)) {
            return this.object_urls.get(path);
        }

        const bytes = await this.zip.read_bytes(path);
        const resource = Array.from(this.manifest.values()).find(item => item.path === path);
        const extension = path.split(".").pop().toLowerCase();
        const types = {
            png: "image/png",
            jpg: "image/jpeg",
            jpeg: "image/jpeg",
            gif: "image/gif",
            svg: "image/svg+xml",
            webp: "image/webp",
            woff: "font/woff",
            woff2: "font/woff2",
            ttf: "font/ttf",
            otf: "font/otf"
        };
        const mime_type = resource?.media_type || types[extension] || "application/octet-stream";
        const url = URL.createObjectURL(new Blob([bytes], { type: mime_type }));
        this.object_urls.set(path, url);
        return url;
    }

    async rewrite_css_urls(css_text, css_path) {
        // 保留原書 CSS；只把 ZIP 裡的相對資源路徑換成暫時 Blob URL。
        const matches = Array.from(css_text.matchAll(/url\(\s*(['"]?)([^'"\)]+)\1\s*\)/gi));
        let output = css_text;

        for (const match of matches) {
            const value = match[2].trim();

            if (/^(data:|blob:|https?:|\/\/|#)/i.test(value)) {
                continue;
            }

            const path = resolve_epub_path(css_path, value);

            if (this.zip.has(path)) {
                const url = await this.resource_url(path);
                output = output.replace(match[0], `url("${url}")`);
            }
        }

        return output;
    }

    async get_chapter_html(index, mode, font_size) {
        const chapter = this.chapters[index];
        const source = await this.zip.read_text(chapter.path);
        const document = new DOMParser().parseFromString(source, "text/html");

        // EPUB 不需要執行內嵌 JavaScript；預覽中全部移除。
        document.querySelectorAll("script, iframe, object, embed, form, base, meta[http-equiv]").forEach(
            node => node.remove()
        );

        for (const link of Array.from(document.querySelectorAll("link[rel~='stylesheet']"))) {
            const href = link.getAttribute("href");

            if (!href || /^(https?:|\/\/)/i.test(href)) {
                link.remove();
                continue;
            }

            const path = resolve_epub_path(chapter.path, href);

            if (!this.zip.has(path)) {
                link.remove();
                continue;
            }

            const css = await this.rewrite_css_urls(await this.zip.read_text(path), path);
            const style = document.createElement("style");
            style.textContent = css;
            link.replaceWith(style);
        }

        for (const style of Array.from(document.querySelectorAll("style"))) {
            style.textContent = await this.rewrite_css_urls(style.textContent, chapter.path);
        }

        for (const element of Array.from(document.querySelectorAll("img, image, source"))) {
            for (const attribute of ["src", "href", "xlink:href"]) {
                const value = element.getAttribute(attribute);

                if (!value || /^(data:|blob:|https?:|\/\/|#)/i.test(value)) {
                    continue;
                }

                const path = resolve_epub_path(chapter.path, value);

                if (this.zip.has(path)) {
                    element.setAttribute(attribute, await this.resource_url(path));
                }
            }
        }

        // 禁止嵌入內容連往外站；章內連結交由主頁導覽。
        for (const element of Array.from(document.querySelectorAll("[onload], [onclick], [onerror]"))) {
            element.removeAttribute("onload");
            element.removeAttribute("onclick");
            element.removeAttribute("onerror");
        }

        const page_css = mode === "page" ? `
            html, body {
                height: 100% !important;
                overflow: hidden !important;
            }
            body {
                width: 100% !important;
                padding: 0 !important;
                margin: 0 !important;
            }
            .cover-page #epub_content_root {
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .cover-page #epub_content_root .cover-container img {
                max-height: calc(100vh - 40px) !important;
                width: auto;
            }
            #epub_content_root {
                width: 100vw;
                height: 100vh;
                padding: 15px 24px 20px;
                box-sizing: border-box;
                column-width: calc(100vw - 48px);
                column-gap: 48px;
                column-fill: auto;
                overflow: visible;
                will-change: transform;
            }
        ` : `
            html, body {
                height: auto !important;
                overflow-x: hidden !important;
                overflow-y: auto !important;
            }
            body {
                width: auto !important;
                max-width: 760px;
                margin: 0 auto !important;
                padding: 16px 24px 30px !important;
            }
        `;

        const reader_style = document.createElement("style");
        reader_style.textContent = `
            html {
                font-size: ${font_size}px !important;
                background: #ffffff;
                color: #202020;
            }
            img, svg {
                max-width: 100%;
            }
            ${page_css}
        `;
        document.head.append(reader_style);

        if (mode === "page") {
            const content_root = document.createElement("div");
            content_root.id = "epub_content_root";

            while (document.body.firstChild) {
                content_root.appendChild(document.body.firstChild);
            }

            document.body.appendChild(content_root);
        }

        // 沙盒中的 EPUB 可用樣式與 Blob 圖片，但不能載入網路檔案或執行腳本。
        const content_security_policy = document.createElement("meta");
        content_security_policy.setAttribute("http-equiv", "Content-Security-Policy");
        content_security_policy.setAttribute(
            "content",
            "default-src 'none'; img-src blob: data:; style-src 'unsafe-inline'; font-src blob: data:;"
        );
        document.head.prepend(content_security_policy);

        return "<!DOCTYPE html>\n" + document.documentElement.outerHTML;
    }

    close() {
        for (const url of this.object_urls.values()) {
            URL.revokeObjectURL(url);
        }

        this.object_urls.clear();
    }
}
