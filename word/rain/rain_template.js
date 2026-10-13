"use strict";
/* SVG 靜態筆觸、雨痕與墨色定義。實際文字與漣漪由 rain.js 注入。 */
(function (global) {
  const SOURCE = String.raw`<svg xmlns="http://www.w3.org/2000/svg" width="840" height="1200" viewBox="0 0 840 1200" role="img" aria-label="@@TITLE@@">
<title>@@TITLE@@｜雨系藝術字</title><desc>@@DESC@@</desc>
<defs>
  <linearGradient id="inkTone" x1="0" y1="0" x2=".83" y2="1" objectBoundingBox="true">
    <stop offset="0" stop-color="#182c37"/><stop offset=".28" stop-color="#35586a"/><stop offset=".48" stop-color="#7c9aa5"/><stop offset=".67" stop-color="#294452"/><stop offset="1" stop-color="#122c3d"/>
  </linearGradient>
  <linearGradient id="wetAccent" x1="0" y1="0" x2=".8" y2="1"><stop offset="0" stop-color="#a5c6cf"/><stop offset=".55" stop-color="#577b8a"/><stop offset="1" stop-color="#243e51"/></linearGradient>
  <linearGradient id="rainFade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#80abb9" stop-opacity="0"/><stop offset=".4" stop-color="#8bb3bd" stop-opacity=".65"/><stop offset="1" stop-color="#496d7c" stop-opacity=".1"/></linearGradient>
  <radialGradient id="wash"><stop offset="0" stop-color="#608998" stop-opacity=".32"/><stop offset="1" stop-color="#7497a0" stop-opacity="0"/></radialGradient>
  <filter id="softWash" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="11"/></filter>
  <filter id="inkSpread" x="-18%" y="-15%" width="136%" height="130%"><feGaussianBlur stdDeviation="3.2"/></filter>
  <filter id="unevenEdge" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency=".018 .027" numOctaves="2" seed="12" result="grains"/><feDisplacementMap in="SourceGraphic" in2="grains" scale="4" xChannelSelector="R" yChannelSelector="G"/></filter>
  <mask id="inkSpeckles" maskUnits="userSpaceOnUse" x="0" y="0" width="840" height="1200"><rect width="840" height="1200" fill="white"/>
    <g fill="black" opacity=".7"><circle cx="331" cy="169" r="1.8"/><circle cx="512" cy="250" r="2.8"/><circle cx="369" cy="473" r="1.6"/><circle cx="456" cy="550" r="2.5"/><circle cx="383" cy="696" r="2.3"/><circle cx="506" cy="795" r="2"/><circle cx="305" cy="919" r="1.5"/><circle cx="483" cy="1033" r="3"/><circle cx="400" cy="1088" r="2"/></g>
  </mask>
  <g id="glyphs">@@GLYPHS@@</g>
</defs>
<!-- 整張畫布沒有任何背景矩形，alpha 一律透明。 -->
<!-- 稀淡雨霧，不是書封底圖 -->
<g opacity=".68" filter="url(#softWash)"><ellipse cx="337" cy="345" rx="260" ry="92" fill="url(#wash)"/><ellipse cx="503" cy="798" rx="275" ry="115" fill="url(#wash)"/></g>
<!-- 左上濕枝與落水痕：非星環、非玻璃水晶字 -->
<g fill="none" stroke="#536d72" stroke-linecap="round" opacity=".39">
  <path d="M122 -5 Q151 75 137 194 M123 59 Q91 91 85 154 M138 115 Q171 141 177 176" stroke-width="3.8"/>
  <path d="M136 107 Q118 107 106 86 Q103 118 133 131 M138 168 Q118 150 106 151 Q115 172 137 182 M161 144 Q181 136 193 117 Q187 157 172 173" stroke-width="1.2" fill="#57737a"/>
</g>
<g stroke="url(#rainFade)" fill="none" stroke-linecap="round" opacity=".6">
  <path d="M210 48 V189 M652 40 V208 M683 228 V368 M157 376 V516 M720 522 V702 M169 709 V848 M675 904 V1073 M233 991 V1154" stroke-width="1.8"/>
  <path d="M273 120 V216 M589 142 V267 M622 419 V516 M211 579 V653 M615 739 V839 M285 951 V1064 M592 1026 V1165" stroke-width=".8"/>
</g>
<g id="sparse-ink" fill="#426674" opacity=".34">
  <circle cx="177" cy="174" r="3"/><circle cx="661" cy="249" r="2"/><circle cx="648" cy="384" r="3.3"/><circle cx="192" cy="557" r="2.4"/><circle cx="640" cy="697" r="2.6"/><circle cx="196" cy="933" r="2.2"/><circle cx="650" cy="1097" r="3"/>
</g>
<!-- 漣漪依文字數與位置生成 -->
@@ORNAMENTS@@
<!-- 濕墨邊緣向外緩慢洇散 -->
<g fill="#638593" opacity=".30" filter="url(#softWash)"><use href="#glyph0"/><use href="#glyph1"/><use href="#glyph2"/><use href="#glyph3"/></g>
<g fill="#3e5c6b" opacity=".34" filter="url(#inkSpread)"><use href="#glyph0"/><use href="#glyph1"/><use href="#glyph2"/><use href="#glyph3"/></g>
<g fill="url(#inkTone)" stroke="#273f4b" stroke-width="1.3" opacity=".95" filter="url(#unevenEdge)" mask="url(#inkSpeckles)" paint-order="stroke fill"><use href="#glyph0"/><use href="#glyph1"/><use href="#glyph2"/><use href="#glyph3"/></g>
<g fill="none" stroke="#dce9e8" stroke-width="1.05" stroke-linejoin="round" opacity=".22"><use href="#glyph0"/><use href="#glyph1"/><use href="#glyph2"/><use href="#glyph3"/></g>
<!-- 水珠點在局部筆鋒：點綴，不採用寶石吊墜 -->
@@DROPLETS@@
<!-- 角落淡淡水印 -->
<g fill="none" stroke="#749ba2" opacity=".26" stroke-width="2"><path d="M165 1164 Q220 1150 254 1163"/><path d="M609 56 Q631 66 654 61"/></g>
</svg>`;
  global.SlowlyRainArtTemplate = SOURCE;
})(window);
