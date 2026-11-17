/*
 * Inline image anchors used by the plain-text chapter editor.
 *
 * An image's bytes and display options are stored separately in section.images.
 * The standalone [[slow_image:<uuid>]] line marks its exact reading position.
 * This keeps images anchored when the author edits surrounding paragraphs.
 */
(function () {
    "use strict";

    const marker_pattern = /^[ \t\u3000]*\[\[slow_image:([0-9a-f-]{36})\]\][ \t\u3000]*$/i;
    const valid_widths = ["60", "80", "100"];

    function create_marker(image_id) {
        return `[[slow_image:${image_id}]]`;
    }

    function read_marker(line) {
        const match = marker_pattern.exec(String(line || ""));
        return match ? match[1] : null;
    }

    function find_marker_ids(body) {
        const ids = [];

        for (const line of String(body ?? "").replace(/\r\n?/g, "\n").split("\n")) {
            const image_id = read_marker(line);

            if (image_id) {
                ids.push(image_id);
            }
        }

        return ids;
    }

    function normalize_image(image) {
        const source = image && typeof image === "object" ? image : {};

        return {
            id: String(source.id ?? ""),
            name: String(source.name ?? "插圖"),
            data_url: String(source.data_url ?? ""),
            alt: String(source.alt ?? ""),
            caption: String(source.caption ?? ""),
            width: valid_widths.includes(String(source.width)) ? String(source.width) : "100",
            separate_page: source.separate_page === true
        };
    }

    function insert_marker(body, image_id, position, cursor_position = 0) {
        const text = String(body ?? "");
        const marker = create_marker(image_id);
        let insert_at = 0;

        if (position === "end") {
            insert_at = text.length;
        } else if (position === "cursor") {
            const cursor = Math.max(0, Math.min(text.length, cursor_position));
            const line_end = text.indexOf("\n", cursor);
            insert_at = line_end < 0 ? text.length : line_end + 1;
        }

        const before = text.slice(0, insert_at);
        const after = text.slice(insert_at);
        const prefix = before && !before.endsWith("\n") ? "\n" : "";
        const suffix = after && !after.startsWith("\n") ? "\n" : "";
        const result = before + prefix + marker + suffix + after;

        return {
            body: result,
            marker_position: before.length + prefix.length
        };
    }

    function remove_marker(body, image_id) {
        const marker = create_marker(image_id);
        const lines = String(body ?? "").replace(/\r\n?/g, "\n").split("\n");
        return lines.filter((line) => line.trim() !== marker).join("\n");
    }

    function count_visible_characters(body) {
        const text = String(body ?? "");
        return [...text.replace(/^[ \t\u3000]*\[\[slow_image:[0-9a-f-]{36}\]\][ \t\u3000]*(?:\r?\n|$)/gim, "")].length;
    }

    function validate_images(section) {
        const images = Array.isArray(section.images) ? section.images : [];
        const image_ids = new Set();
        const marker_ids = find_marker_ids(section.body);
        const seen_markers = new Set();
        const name = String(section.title || "未命名章節");

        for (const image of images) {
            if (!image.id || image_ids.has(image.id)) {
                throw new Error(`「${name}」有重複或無效的插圖 ID。`);
            }

            image_ids.add(image.id);

            if (!/^data:image\/(?:jpeg|png);base64,[A-Za-z0-9+/=]+$/i.test(image.data_url)) {
                throw new Error(`「${name}」的插圖「${image.name}」檔案損壞，請重新加入。`);
            }
        }

        for (const image_id of marker_ids) {
            if (!image_ids.has(image_id)) {
                throw new Error(`「${name}」有找不到圖片的插圖標記，請檢查正文。`);
            }

            if (seen_markers.has(image_id)) {
                throw new Error(`「${name}」同一張圖片的插入標記重複出現，請只保留一處。`);
            }

            seen_markers.add(image_id);
        }

        for (const image of images) {
            if (!seen_markers.has(image.id)) {
                throw new Error(`「${name}」的「${image.name}」尚未放入正文，請在章節編輯器重新插入或移除。`);
            }
        }
    }

    window.SlowIllustrations = {
        create_marker,
        read_marker,
        find_marker_ids,
        normalize_image,
        insert_marker,
        remove_marker,
        count_visible_characters,
        validate_images
    };
}());
