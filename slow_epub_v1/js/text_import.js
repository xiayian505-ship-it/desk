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

    function filename_to_chapter_title(filename) {
        // Each TXT is already a chapter. Use its filename as the heading,
        // preserving punctuation and Chinese characters (only remove .txt).
        return String(filename || "")
            .replace(/\.txt$/iu, "")
            .trim() || "未命名章節";
    }

    function chinese_chapter_number(filename) {
        // Chinese chapter filenames also need ordinal sorting: 第二章
        // comes before 第十章, and 章之二 before 章之十.
        const title = filename_to_chapter_title(filename);
        const match = /^(?:第([零〇一二三四五六七八九十百千兩两\d]+)[章回卷節]|章之([零〇一二三四五六七八九十百千兩两\d]+))/u.exec(title);

        if (!match) {
            return null;
        }

        const number_text = match[1] || match[2];

        if (/^\d+$/u.test(number_text)) {
            return Number(number_text);
        }

        const digits = {
            "零": 0, "〇": 0, "一": 1, "二": 2, "兩": 2, "两": 2,
            "三": 3, "四": 4, "五": 5, "六": 6, "七": 7,
            "八": 8, "九": 9
        };
        const units = { "十": 10, "百": 100, "千": 1000 };
        let result = 0;
        let current_digit = 0;

        for (const character of number_text) {
            if (Object.hasOwn(digits, character)) {
                current_digit = digits[character];
            } else if (Object.hasOwn(units, character)) {
                result += (current_digit || 1) * units[character];
                current_digit = 0;
            }
        }

        return result + current_digit;
    }

    function sort_files_by_name(files) {
        const collator = new Intl.Collator("zh-Hant", {
            numeric: true,
            sensitivity: "base"
        });

        // Preserve the file picker's order for names considered equal.
        return Array.from(files, (file, index) => ({ file, index }))
            .sort((first, second) => {
                const first_number = chinese_chapter_number(first.file.name);
                const second_number = chinese_chapter_number(second.file.name);

                if (first_number !== null && second_number !== null && first_number !== second_number) {
                    return first_number - second_number;
                }

                return collator.compare(first.file.name, second.file.name) || first.index - second.index;
            })
            .map((entry) => entry.file);
    }

    window.SlowTextImport = {
        normalize_newlines,
        detect_chapters,
        filename_to_chapter_title,
        sort_files_by_name
    };
}());
