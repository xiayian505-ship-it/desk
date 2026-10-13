"use strict";
/* SVG 視覺模板，只負責圖像樣貌：字形與電弧由 thunder.js 注入。 */
(function (global) {
  global.SlowlyThunderTemplate = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="840" height="1200" viewBox="0 0 840 1200" role="img" aria-labelledby="thunderTitle thunderDesc">
<title id="thunderTitle">@@TITLE@@</title>
<desc id="thunderDesc">@@DESC@@</desc>
<defs>
  <linearGradient id="face" x1=".11" y1=".1" x2=".82" y2="1" objectBoundingBox="true">
    <stop offset="0" stop-color="#b3eaff"/><stop offset=".19" stop-color="#264574"/><stop offset=".40" stop-color="#081124"/><stop offset=".61" stop-color="#7a9dce"/><stop offset=".78" stop-color="#27365b"/><stop offset="1" stop-color="#020610"/>
  </linearGradient>
  <linearGradient id="flash" x1="0" y1="0" x2="1" y2="1" objectBoundingBox="true">
    <stop offset="0" stop-color="#ecfcff"/><stop offset=".27" stop-color="#b4f2ff"/><stop offset=".53" stop-color="#449efa"/><stop offset=".77" stop-color="#a69bff"/><stop offset="1" stop-color="#d5f6ff"/>
  </linearGradient>
  <linearGradient id="crack" x1="0" y1="0" x2="1" y2="1" objectBoundingBox="true">
    <stop offset="0" stop-color="#d3fbff" stop-opacity="0"/><stop offset=".32" stop-color="#fff" stop-opacity=".97"/><stop offset=".66" stop-color="#70d9ff" stop-opacity=".88"/><stop offset="1" stop-color="#c5a9ff" stop-opacity=".12"/>
  </linearGradient>
  <radialGradient id="shock"><stop offset="0" stop-color="#e0fcff" stop-opacity=".85"/><stop offset=".19" stop-color="#5cb7ff" stop-opacity=".45"/><stop offset=".65" stop-color="#527cce" stop-opacity=".12"/><stop offset="1" stop-color="#527cce" stop-opacity="0"/></radialGradient>
  <filter id="edgeGlare" x="-65%" y="-65%" width="230%" height="230%"><feGaussianBlur stdDeviation="9"/></filter>
  <filter id="boltBloom" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur stdDeviation="5.8"/></filter>
  <filter id="dustBlur" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="15"/></filter>
  <filter id="rough" x="-12%" y="-12%" width="124%" height="124%"><feTurbulence type="fractalNoise" baseFrequency=".034 .018" numOctaves="2" seed="8" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="4.7" xChannelSelector="R" yChannelSelector="G"/></filter>
  <g id="definedGlyphs">@@GLYPHS@@</g>
  <clipPath id="glyphClip">@@CLIP_USES@@</clipPath>
</defs>
<!-- 雲的大片底色刻意不輸出；下面全部是獨立透明圖層 -->
<g id="arc-haze" opacity=".8">@@LIGHT_WELLS@@</g>
<g id="rear-lightning">@@REAR_BOLTS@@</g>
<g id="glyph-glare" fill="none" stroke="#70b9ff" stroke-width="24" opacity=".63" filter="url(#edgeGlare)">@@GLYPH_USES@@</g>
<g id="glyph-shadows" fill="none" stroke="#030816" stroke-width="22" stroke-linejoin="bevel">@@GLYPH_USES@@</g>
<g id="glyph-strokes" fill="url(#face)" stroke="#2968aa" stroke-width="9" stroke-linejoin="bevel" filter="url(#rough)">@@GLYPH_USES@@</g>
<g id="glyph-metal" fill="none" stroke="#9bc4ff" opacity=".73" stroke-width="2" stroke-linejoin="miter">@@GLYPH_USES@@</g>
<g id="ink-fissures" clip-path="url(#glyphClip)">@@FISSURES@@</g>
<g id="front-lightning">@@FRONT_BOLTS@@</g>
<g id="sparks">@@SPARKS@@</g>
</svg>`;
})(window);
