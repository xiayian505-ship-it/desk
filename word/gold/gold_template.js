"use strict";
/* 金碧輝煌｜3D 燙金浮雕字。透明畫面：金砂只在文字遮罩內，字外僅有微陰影。 */
(function (global) {
  global.SlowlyGoldTemplate = String.raw`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
  width="@@WIDTH@@" height="@@HEIGHT@@" viewBox="0 0 @@WIDTH@@ @@HEIGHT@@"
  role="img" aria-labelledby="goldTitle goldDesc">
  <title id="goldTitle">@@TITLE@@</title>
  <desc id="goldDesc">@@DESC@@</desc>
  <defs>
    <!-- 明暗交錯的燙金字面，白金反光與暗金相間；字外保持全透明。 -->
    <linearGradient id="foilFace" x1=".08" y1=".03" x2=".91" y2=".96">
      <stop offset="0" stop-color="#fffbe3"/>
      <stop offset=".11" stop-color="#ffe9a1"/>
      <stop offset=".21" stop-color="#ae6b0f"/>
      <stop offset=".33" stop-color="#ffd85c"/>
      <stop offset=".43" stop-color="#fff9d2"/>
      <stop offset=".54" stop-color="#cf9421"/>
      <stop offset=".68" stop-color="#734209"/>
      <stop offset=".77" stop-color="#fbd467"/>
      <stop offset=".9" stop-color="#ffe9a7"/>
      <stop offset="1" stop-color="#9c671b"/>
    </linearGradient>
    <linearGradient id="edgeGold" x1=".04" y1=".02" x2=".95" y2=".99">
      <stop offset="0" stop-color="#fff9d5"/>
      <stop offset=".3" stop-color="#f2c658"/>
      <stop offset=".62" stop-color="#7d4a0b"/>
      <stop offset=".87" stop-color="#dca83c"/>
      <stop offset="1" stop-color="#573006"/>
    </linearGradient>
    <linearGradient id="sideGold" x1="0" y1="0" x2=".65" y2="1">
      <stop offset="0" stop-color="#a26d20"/>
      <stop offset=".48" stop-color="#754208"/>
      <stop offset="1" stop-color="#412305"/>
    </linearGradient>
    <linearGradient id="bevelGlint" x1=".12" y1="0" x2=".8" y2="1">
      <stop offset="0" stop-color="#fffdf0"/>
      <stop offset=".24" stop-color="#fff6be"/>
      <stop offset=".5" stop-color="#f6c04a"/>
      <stop offset="1" stop-color="#a66e17"/>
    </linearGradient>
    <linearGradient id="reliefLine" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fff8d4" stop-opacity=".95"/>
      <stop offset=".58" stop-color="#f4bd48" stop-opacity=".4"/>
      <stop offset="1" stop-color="#7b460c" stop-opacity=".12"/>
    </linearGradient>
    <filter id="smallShadow" x="-24%" y="-24%" width="148%" height="148%">
      <feGaussianBlur stdDeviation="5.5"/>
    </filter>
    <filter id="innerFoil" x="-12%" y="-12%" width="124%" height="124%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="1.8" result="height"/>
      <feSpecularLighting in="height" surfaceScale="3" specularConstant=".67"
        specularExponent="22" lighting-color="#fffbea" result="shine">
        <fePointLight x="-170" y="-240" z="320"/>
      </feSpecularLighting>
      <feComposite in="shine" in2="SourceAlpha" operator="in" result="shineInside"/>
      <feBlend in="SourceGraphic" in2="shineInside" mode="screen"/>
    </filter>
    <g id="allGlyphs">@@GLYPHS@@</g>
    <clipPath id="goldLetterMask">@@LETTER_USES@@</clipPath>
  </defs>
  <!-- 1. 僅為字形投下低透明、短距離的柔和陰影 -->
  <g transform="translate(6 8)" fill="#4f3215" opacity=".15" filter="url(#smallShadow)">@@LETTER_USES@@</g>
  <!-- 2. 多層金屬切面賦予筆畫真正的厚度 -->
  @@EXTRUSION@@
  <!-- 3. 燙金面與立體浮雕的邊緣 -->
  <g fill="url(#foilFace)" stroke="url(#edgeGold)" stroke-width="7" stroke-linejoin="round"
    paint-order="stroke fill" filter="url(#innerFoil)">@@LETTER_USES@@</g>
  <g fill="none" stroke="url(#bevelGlint)" stroke-width="2.4" stroke-linejoin="round"
    opacity=".85">@@LETTER_USES@@</g>
  <g clip-path="url(#goldLetterMask)">
    <!-- 4. 浮雕金紋只在字面發生，沒有延伸成背景花紋 -->
    @@RELIEF@@
    <!-- 5. 唯一內部裝飾是金砂：不再出現金塊、金幣或寶石 -->
    @@GOLD_DUST@@
  </g>
</svg>`;
})(window);
