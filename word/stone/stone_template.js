"use strict";
/* 石破天驚 SVG：裂石、碎片與震波沿字體展開；透明背景。 */
(function (global) {
  global.SlowlyStoneTemplate = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="840" height="1200" viewBox="0 0 840 1200" role="img" aria-labelledby="stoneTitle stoneDesc">
  <title id="stoneTitle">@@TITLE@@</title>
  <desc id="stoneDesc">@@DESC@@</desc>
  <defs>
    <linearGradient id="rockFace" x1=".06" y1=".04" x2=".96" y2=".96" objectBoundingBox="true">
      <stop offset="0" stop-color="#f3efe7"/>
      <stop offset=".18" stop-color="#cdc6bb"/>
      <stop offset=".48" stop-color="#8b837a"/>
      <stop offset=".78" stop-color="#534d48"/>
      <stop offset="1" stop-color="#2e2b29"/>
    </linearGradient>
    <linearGradient id="rockEdge" x1="0" y1="0" x2="1" y2="1" objectBoundingBox="true">
      <stop offset="0" stop-color="#faf7f0"/>
      <stop offset=".32" stop-color="#b8aa97"/>
      <stop offset=".72" stop-color="#5b5148"/>
      <stop offset="1" stop-color="#1b1817"/>
    </linearGradient>
    <linearGradient id="magma" x1="0" y1="0" x2="1" y2="1" objectBoundingBox="true">
      <stop offset="0" stop-color="#fff4b6"/>
      <stop offset=".2" stop-color="#ffd35d"/>
      <stop offset=".48" stop-color="#ff7b1f"/>
      <stop offset=".74" stop-color="#d94411"/>
      <stop offset="1" stop-color="#6a1007"/>
    </linearGradient>
    <radialGradient id="dustGlow" cx="50%" cy="50%" r="58%">
      <stop offset="0" stop-color="#ffe3a1" stop-opacity=".86"/>
      <stop offset="1" stop-color="#ffe3a1" stop-opacity="0"/>
    </radialGradient>
    <filter id="stoneRough" x="-20%" y="-20%" width="140%" height="140%">
      <feTurbulence type="fractalNoise" baseFrequency=".045 .036" numOctaves="2" seed="13" result="grain"/>
      <feDisplacementMap in="SourceGraphic" in2="grain" scale="2.3" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
    <filter id="stoneShadow" x="-35%" y="-35%" width="170%" height="170%">
      <feGaussianBlur stdDeviation="5"/>
    </filter>
    <filter id="magmaGlow" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="4.2"/>
    </filter>
    <g id="glyphBank">@@GLYPHS@@</g>
    <clipPath id="letterMask">@@LETTER_CLIPS@@</clipPath>
  </defs>

  <g id="dust-aura">@@AURAS@@</g>
  <g id="impact-shadow" fill="#1a1817" opacity=".28" filter="url(#stoneShadow)" transform="translate(7 12)">@@LETTER_USES@@</g>
  <g id="impact-outline" fill="none" stroke="#efe6d7" stroke-width="10" stroke-linejoin="round" opacity=".9">@@LETTER_USES@@</g>
  <g id="rock-letters" fill="url(#rockFace)" stroke="url(#rockEdge)" stroke-width="4" stroke-linejoin="round" filter="url(#stoneRough)">@@LETTER_USES@@</g>
  <g id="chisel-ridge" fill="none" stroke="#f6f0e5" stroke-width="2.4" stroke-linejoin="round" opacity=".56">@@LETTER_USES@@</g>
  <g id="magma-under" clip-path="url(#letterMask)" filter="url(#magmaGlow)">@@CRACK_GLOW@@</g>
  <g id="stone-cracks" clip-path="url(#letterMask)">@@CRACKS@@</g>
  <g id="inner-chip" clip-path="url(#letterMask)">@@INNER_CHIPS@@</g>
  <g id="outer-fragments">@@FRAGMENTS@@</g>
  <g id="shock-lines">@@SHOCKS@@</g>
  <g id="dust-motes">@@DUST@@</g>
</svg>`;
})(window);
