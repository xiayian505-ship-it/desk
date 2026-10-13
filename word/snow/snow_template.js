"use strict";
(function (global) {
  global.SlowlySnowTemplate = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="840" height="1200" viewBox="0 0 840 1200" role="img" aria-labelledby="snowTitle snowDesc">
  <title id="snowTitle">@@TITLE@@</title>
  <desc id="snowDesc">@@DESC@@</desc>
  <defs>
    <linearGradient id="snowFace" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ffffff"/>
      <stop offset=".3" stop-color="#dff2ff"/>
      <stop offset=".65" stop-color="#a8c9ea"/>
      <stop offset="1" stop-color="#7798bf"/>
    </linearGradient>
    <linearGradient id="iceStroke" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#5c7a99"/>
      <stop offset="1" stop-color="#f0fbff"/>
    </linearGradient>
    <radialGradient id="mistGlow" cx="50%" cy="45%" r="60%">
      <stop offset="0" stop-color="#eef7ff" stop-opacity=".78"/>
      <stop offset="1" stop-color="#eef7ff" stop-opacity="0"/>
    </radialGradient>
    <filter id="snowShadow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="5"/></filter>
    <g id="snowGlyphBank">@@GLYPHS@@</g>
    <clipPath id="snowLetterMask">@@LETTER_CLIPS@@</clipPath>
  </defs>
  <g opacity=".65">@@MIST@@</g>
  <g opacity=".74">@@CRYSTALS@@</g>
  <g opacity=".7">@@SNOWFLAKES@@</g>
  <g fill="#7390b4" filter="url(#snowShadow)" opacity=".24" transform="translate(4 8)">@@LETTER_USES@@</g>
  <g fill="url(#snowFace)" stroke="url(#iceStroke)" stroke-width="3.6" paint-order="stroke fill">@@LETTER_USES@@</g>
  <g clip-path="url(#snowLetterMask)" fill="none">@@FROST@@</g>
  <g opacity=".86">@@FLURRIES@@</g>
</svg>`;
})(window);
