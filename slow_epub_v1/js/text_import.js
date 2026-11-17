/* Convert copied plain text into sections without discarding original spaces. */
(function () {
    "use strict";

    function normalize_newlines(text) {
        return String(text || "").replace(/\r\n?/g, "\n").replace(/^\uFEFF/, "");
    }

    function is_chapter_heading(line) {
        const title = line.trim();

        if (!title || title.length > 90) {
            return false;
        }

        const chinese_heading = /^第[零〇一二三四五六七八九十百千兩两\d]+[章回卷](?:[\s\u3000：:．.、—-]*.*)?$/u;
        const english_heading = /^(?:chapter|chap\.)\s*\d+(?:\b.*)?$/iu;
        const extra_heading = /^(?:番外|後記|序章|楔子|終章|尾聲)(?:[\s\u3000：:．.、—-]*.*)?$/u;

        return chinese_heading.test(title)
            || english_heading.test(title)
            || extra_heading.test(title);
    }

    function detect_chapters(text) {
        const normalized_text = normalize_newlines(text);
        const lines = normalized_text.split("\n");
        const heading_locations = [];
        let offset = 0;

        for (const line of lines) {
            if (is_chapter_heading(line)) {
                heading_locations.push({
                    start: offset,
                    end: offset + line.length,
                    title: line.trim()
                });
            }

            offset += line.length + 1;
        }

        if (heading_locations.length === 0) {
            return [{ title: "正文", body: normalized_text, type: "chapter" }];
        }

        const result = [];
        const introduction = normalized_text.slice(0, heading_locations[0].start);

        if (introduction.trim()) {
            result.push({ title: "未分章內容", body: introduction, type: "page" });
        }

        heading_locations.forEach((heading, index) => {
            const next_heading = heading_locations[index + 1];
            let chapter_body = normalized_text.slice(
                heading.end,
                next_heading ? next_heading.start : normalized_text.length
            );

            // Only remove the newline that separates the heading itself from
            // its body. Any additional blank lines belong to the author.
            if (chapter_body.startsWith("\n")) {
                chapter_body = chapter_body.slice(1);
            }

            result.push({
                title: heading.title,
                body: chapter_body,
                type: "chapter"
            });
        });

        return result;
    }

    window.SlowTextImport = { normalize_newlines, detect_chapters };
}());
