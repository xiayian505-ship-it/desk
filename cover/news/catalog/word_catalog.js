"use strict";
/* 純目錄：UI 搜尋、A～Z、分頁；與藝術字腳本載入完全分離。 */
(function (global) {
  const items = global.SlowlyCoverWordCatalogData;
  if (!Array.isArray(items)) throw new Error("尚未載入藝術字輕量索引");
  const byCode = new Map();
  const counters = Object.fromEntries(Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ", letter=>[letter,0]));
  for (const item of items) {
    if (!/^[a-z][a-z0-9_-]*$/.test(item.code) || byCode.has(item.code)) throw new Error("目錄識別碼重複或無效：" + item.code);
    const frozen = Object.freeze({code:item.code,title:item.title,letter:item.code[0].toUpperCase()});
    byCode.set(item.code,frozen);
    counters[frozen.letter]++;
  }
  const sorted = [...byCode.values()].sort((a,b)=>a.code.localeCompare(b.code,"en"));
  const normalized = q => String(q??"").trim().toLocaleLowerCase();
  const query = ({text="",letter="ALL",page=0,pageSize=12}={}) => {
    const keyword=normalized(text);
    const key=letter.toUpperCase();
    const size=Math.max(1,Math.min(40,Math.trunc(pageSize)||12));
    const matches=sorted.filter(item => (key==="ALL" || item.letter===key) && (!keyword || item.code.includes(keyword) || item.title.toLocaleLowerCase().includes(keyword)));
    const count=matches.length, totalPages=Math.max(1,Math.ceil(count/size));
    const current=Math.max(0,Math.min(Math.trunc(page)||0,totalPages-1));
    return {items:matches.slice(current*size,(current+1)*size),count,page:current,pages:totalPages};
  };
  global.SlowlyCoverWordCatalog=Object.freeze({
    count:sorted.length,
    letters:Object.freeze({...counters}),
    get:code=>byCode.get(code)||null,
    query,
    has:code=>byCode.has(code)
  });
})(window);
