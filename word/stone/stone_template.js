"use strict";
/* 石破天驚 SVG：古碑震裂派。透明背景，主體是風化石刻與沿字而行的裂痕。 */
(function (global) {
  global.SlowlyStoneTemplate = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="840" height="1200" viewBox="0 0 840 1200" role="img" aria-labelledby="stoneTitle stoneDesc">
  <title id="stoneTitle">@@TITLE@@</title>
  <desc id="stoneDesc">@@DESC@@</desc>
  <defs>
    <linearGradient id="rockFace" x1=".08" y1=".02" x2=".94" y2=".96">
      <stop offset="0" stop-color="#f6f0e6"/>
      <stop offset=".18" stop-color="#d7cdbd"/>
      <stop offset=".48" stop-color="#978c7d"/>
      <stop offset=".78" stop-color="#5f564f"/>
      <stop offset="1" stop-color="#322d2a"/>
    </linearGradient>
    <linearGradient id="rockEdge" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fffaf0"/>
      <stop offset=".28" stop-color="#c8ba9f"/>
      <stop offset=".68" stop-color="#594f47"/>
      <stop offset="1" stop-color="#171513"/>
    </linearGradient>
    <linearGradient id="dustLine" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#d7c6ab"/>
      <stop offset="1" stop-color="#8f7764"/>
    </linearGradient>
    <linearGradient id="emberVein" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fff6c7"/>
      <stop offset=".22" stop-color="#e9c774"/>
      <stop offset=".56" stop-color="#b56f27"/>
      <stop offset="1" stop-color="#522216"/>
    </linearGradient>
    <radialGradient id="dustGlow" cx="50%" cy="48%" r="58%">
      <stop offset="0" stop-color="#e8d8b9" stop-opacity=".72"/>
      <stop offset="1" stop-color="#e8d8b9" stop-opacity="0"/>
    </radialGradient>
    <filter id="stoneRough" x="-20%" y="-20%" width="140%" height="140%">
      <feTurbulence type="fractalNoise" baseFrequency=".042 .034" numOctaves="2" seed="11" result="grain"/>
      <feDisplacementMap in="SourceGraphic" in2="grain" scale="1.8" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
    <filter id="stoneShadow" x="-35%" y="-35%" width="170%" height="170%">
      <feGaussianBlur stdDeviation="4.6"/>
    </filter>
    <filter id="veilGlow" x="-35%" y="-35%" width="170%" height="170%">
      <feGaussianBlur stdDeviation="3.4"/>
    </filter>
    <g id="glyphBank">@@GLYPHS@@</g>
    <clipPath id="letterMask">@@LETTER_CLIPS@@</clipPath>
  </defs>

  <g id="dust-aura">@@AURAS@@</g>
  <g id="stele-shadow" fill="#171412" opacity=".26" filter="url(#stoneShadow)" transform="translate(7 11)">@@LETTER_USES@@</g>
  <g id="stele-outline" fill="none" stroke="#f5eddc" stroke-width="9.2" stroke-linejoin="round" opacity=".9">@@LETTER_USES@@</g>
  <g id="stele-body" fill="url(#rockFace)" stroke="url(#rockEdge)" stroke-width="4.2" stroke-linejoin="round" filter="url(#stoneRough)">@@LETTER_USES@@</g>
  <g id="stele-chisel" fill="none" stroke="#f3ebdf" stroke-width="2.2" stroke-linejoin="round" opacity=".42">@@LETTER_USES@@</g>
  <g id="vein-glow" clip-path="url(#letterMask)" filter="url(#veilGlow)">@@CRACK_GLOW@@</g>
  <g id="weather-cracks" clip-path="url(#letterMask)">@@CRACKS@@</g>
  <g id="weather-chips" clip-path="url(#letterMask)">@@INNER_CHIPS@@</g>
  <g id="broken-edges">@@FRAGMENTS@@</g>
  <g id="dust-rings">@@SHOCKS@@</g>
  <g id="dust-motes">@@DUST@@</g>
</svg>`;
})(window);
