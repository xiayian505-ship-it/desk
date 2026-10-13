"use strict";
(function (global) {
  global.SlowlyBloomTemplate = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="840" height="1200" viewBox="0 0 840 1200" role="img" aria-labelledby="bloomTitle bloomDesc">
  <title id="bloomTitle">@@TITLE@@</title>
  <desc id="bloomDesc">@@DESC@@</desc>
  <defs>
    <linearGradient id="bloomFace" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fff4f2"/>
      <stop offset=".32" stop-color="#f4c8ce"/>
      <stop offset=".63" stop-color="#d79fb0"/>
      <stop offset="1" stop-color="#9d7587"/>
    </linearGradient>
    <linearGradient id="leafTone" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#d2e3bf"/>
      <stop offset="1" stop-color="#789469"/>
    </linearGradient>
    <filter id="bloomShadow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="4"/></filter>
    <g id="bloomGlyphBank">@@GLYPHS@@</g>
    <clipPath id="bloomLetterMask">@@LETTER_CLIPS@@</clipPath>
  </defs>
  <g opacity=".56">@@BRANCHES@@</g>
  <g opacity=".72">@@BLOSSOMS@@</g>
  <g opacity=".55">@@PETALS@@</g>
  <g opacity=".76">@@BIRDS@@</g>
  <g fill="#7c626b" filter="url(#bloomShadow)" opacity=".26" transform="translate(4 8)">@@LETTER_USES@@</g>
  <g fill="url(#bloomFace)" stroke="#8b6a75" stroke-width="3.4" paint-order="stroke fill">@@LETTER_USES@@</g>
  <g clip-path="url(#bloomLetterMask)" fill="none">@@VEINS@@</g>
  <g opacity=".8">@@BLOSSOM_SPARKS@@</g>
</svg>`;
})(window);
