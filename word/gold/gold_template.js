"use strict";
(function (global) {
  global.SlowlyGoldTemplate = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="840" height="1200" viewBox="0 0 840 1200" role="img" aria-labelledby="goldTitle goldDesc">
  <title id="goldTitle">@@TITLE@@</title>
  <desc id="goldDesc">@@DESC@@</desc>
  <defs>
    <linearGradient id="goldFace" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fff9cf"/>
      <stop offset=".16" stop-color="#ffe68b"/>
      <stop offset=".34" stop-color="#d59c22"/>
      <stop offset=".52" stop-color="#f8d56c"/>
      <stop offset=".72" stop-color="#9e6e11"/>
      <stop offset="1" stop-color="#fff3b8"/>
    </linearGradient>
    <linearGradient id="goldStroke" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#7b5200"/>
      <stop offset="1" stop-color="#f3d376"/>
    </linearGradient>
    <radialGradient id="goldGlow" cx="50%" cy="45%" r="60%">
      <stop offset="0" stop-color="#fff4b8" stop-opacity=".8"/>
      <stop offset="1" stop-color="#fff4b8" stop-opacity="0"/>
    </radialGradient>
    <filter id="goldShadow" x="-30%" y="-30%" width="160%" height="160%">
      <feOffset dx="0" dy="8"/>
      <feGaussianBlur stdDeviation="7" result="blur"/>
      <feColorMatrix in="blur" type="matrix" values="0 0 0 0 0.42 0 0 0 0 0.28 0 0 0 0 0.05 0 0 0 .35 0"/>
    </filter>
    <filter id="goldEmboss" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur"/>
      <feSpecularLighting in="blur" surfaceScale="3" specularConstant=".72" specularExponent="18" lighting-color="#ffffff" result="spec">
        <fePointLight x="-220" y="-180" z="220"/>
      </feSpecularLighting>
      <feComposite in="spec" in2="SourceAlpha" operator="in" result="specOut"/>
      <feBlend in="SourceGraphic" in2="specOut" mode="screen"/>
    </filter>
    <g id="goldGlyphBank">@@GLYPHS@@</g>
    <clipPath id="goldLetterMask">@@LETTER_CLIPS@@</clipPath>
  </defs>
  <g opacity=".95">@@AURAS@@</g>
  <g opacity=".44">@@RAYS@@</g>
  <g fill="none" stroke="url(#goldStroke)" stroke-width="3.2" stroke-linecap="round">@@FILIGREE@@</g>
  <g filter="url(#goldShadow)" opacity=".33" fill="#7b560d" transform="translate(4 10)">@@LETTER_USES@@</g>
  <g fill="url(#goldFace)" stroke="url(#goldStroke)" stroke-width="6" paint-order="stroke fill" filter="url(#goldEmboss)">@@LETTER_USES@@</g>
  <g clip-path="url(#goldLetterMask)" fill="none">@@ETCHING@@</g>
  <g opacity=".82">@@JEWELS@@</g>
  <g opacity=".85">@@SPARKLES@@</g>
</svg>`;
})(window);
