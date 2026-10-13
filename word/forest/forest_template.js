"use strict";
/* 林風藝術字 SVG：紙雕層次與葉脈文字模板，由宿主控制外觀。 */
(function (global) {
  global.SlowlyForestTemplate = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="840" height="1200" viewBox="0 0 840 1200" role="img" aria-labelledby="forestTitle forestDesc">
  <title id="forestTitle">@@TITLE@@</title>
  <desc id="forestDesc">@@DESC@@</desc>
  <defs>
    <linearGradient id="inkFace" x1=".03" y1=".08" x2=".94" y2=".95" objectBoundingBox="true">
      <stop offset="0" stop-color="#c4cf9c"/>
      <stop offset=".24" stop-color="#63846b"/>
      <stop offset=".48" stop-color="#285545"/>
      <stop offset=".72" stop-color="#173c32"/>
      <stop offset="1" stop-color="#0b2827"/>
    </linearGradient>
    <linearGradient id="copper" x1="0" y1="0" x2="1" y2="1" objectBoundingBox="true">
      <stop offset="0" stop-color="#f4e5b7"/>
      <stop offset=".28" stop-color="#ad9460"/>
      <stop offset=".62" stop-color="#f4db99"/>
      <stop offset="1" stop-color="#a77f4a"/>
    </linearGradient>
    <linearGradient id="leafPaint" x1="0" y1="0" x2="1" y2="1" objectBoundingBox="true">
      <stop offset="0" stop-color="#adcba0"/>
      <stop offset=".44" stop-color="#547b5d"/>
      <stop offset="1" stop-color="#1d483b"/>
    </linearGradient>
    <filter id="paperRough" x="-15%" y="-15%" width="130%" height="130%">
      <feTurbulence baseFrequency=".045 .035" numOctaves="2" seed="17" type="fractalNoise" result="grain"/>
      <feDisplacementMap in="SourceGraphic" in2="grain" scale="2.4" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
    <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="4"/>
    </filter>
    <g id="glyphBank">@@GLYPHS@@</g>
    <clipPath id="letterMask">@@LETTER_CLIPS@@</clipPath>
  </defs>

  <!-- 所有圖層皆為透明：沒有矩形底圖或底色。 -->
  <g id="rear-branches">@@BACK_BRANCHES@@</g>
  <g id="rear-leaves">@@BACK_LEAVES@@</g>
  <g id="shadow-letter" fill="#082c26" opacity=".28" filter="url(#shadow)" transform="translate(5 10)">@@LETTER_USES@@</g>
  <g id="woodcut-border" fill="none" stroke="#a98a51" stroke-width="12" stroke-linejoin="round" opacity=".85">@@LETTER_USES@@</g>
  <g id="ink-letters" fill="url(#inkFace)" stroke="#2b5744" stroke-width="3" stroke-linejoin="round" filter="url(#paperRough)">@@LETTER_USES@@</g>
  <g id="letter-inner-etching" clip-path="url(#letterMask)" fill="none" stroke-linecap="round">@@ENGRAVING@@</g>
  <g id="handcut-highlights" fill="none" stroke="url(#copper)" stroke-width="2.3" stroke-linejoin="round" opacity=".88">@@LETTER_USES@@</g>
  <g id="wind-cuts">@@WIND@@</g>
  <g id="front-leaves">@@FRONT_LEAVES@@</g>
  <g id="golden-fleck">@@FLECKS@@</g>
</svg>`;
})(window);
