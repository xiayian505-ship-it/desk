// 單款延遲載入資料；與藝術字生成器程式不同。
window.SlowlyCoverWordEntryRegistry = window.SlowlyCoverWordEntryRegistry || Object.create(null);
window.SlowlyCoverWordEntryRegistry["word_count"] = Object.freeze({
  "code": "word_count",
  "title": "字數統計",
  "sample": "字數統計",
  "vertical": "SlowlyWordCountArt",
  "horizontal": "SlowlyWordCountHorizontalArt",
  "scripts": [
    "https://lib.stillnessbyslowly.com/data/blob/blob_url.js",
    "https://lib.stillnessbyslowly.com/Image/png/canvas_png.js",
    "https://lib.stillnessbyslowly.com/Image/png/png_download.js",
    "https://lib.stillnessbyslowly.com/component/text_generator/text_generator_component.js",
    "https://lib.stillnessbyslowly.com/component/text_generator/text_generator_core.js",
    "https://lib.stillnessbyslowly.com/component/text_generator/text_generator_horizontal_component.js",
    "https://desk.stillnessbyslowly.com/word/word_count/word_count_template.js",
    "https://desk.stillnessbyslowly.com/word/word_count/word_count.js",
    "https://desk.stillnessbyslowly.com/word/word_count/word_count_horizontal.js"
  ]
});
