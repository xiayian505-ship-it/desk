/* 《星河入夢》專屬星軌與裝飾向量模板；由 title.js 依輸入文字動態產生字形。 */
window.SlowlyStarArtTemplate = String.raw`<svg xmlns="http://www.w3.org/2000/svg" width="840" height="1200" viewBox="0 @@TOP@@ 820 @@HEIGHT@@" preserveAspectRatio="xMidYMid meet" role="img" aria-labelledby="title desc">
<title id="title">@@TITLE@@</title>
<desc id="desc">@@DESC@@</desc>
<defs>
  <linearGradient id="letterFill" x1="0.12" y1="0" x2="0.85" y2="1" objectBoundingBox="true">
    <stop offset="0" stop-color="#fffbed"/><stop offset=".14" stop-color="#ffe1d3"/>
    <stop offset=".31" stop-color="#eac6fa"/><stop offset=".5" stop-color="#a0baff"/>
    <stop offset=".68" stop-color="#caa8ff"/><stop offset=".85" stop-color="#fff1cc"/>
    <stop offset="1" stop-color="#ecc5ff"/>
  </linearGradient>
  <linearGradient id="edgeGrad" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#fff7ea"/><stop offset=".35" stop-color="#efb8ec"/>
    <stop offset=".65" stop-color="#7e96ff"/><stop offset="1" stop-color="#fff0b5"/>
  </linearGradient>
  <linearGradient id="ribbon" x1="0" y1="0" x2="1" y2=".9">
    <stop offset="0" stop-color="#eb9bfd" stop-opacity="0"/>
    <stop offset=".15" stop-color="#fff0c8" stop-opacity=".85"/>
    <stop offset=".38" stop-color="#918efa" stop-opacity=".82"/>
    <stop offset=".64" stop-color="#f6b9ff" stop-opacity=".8"/>
    <stop offset=".83" stop-color="#ffdfb0" stop-opacity=".86"/>
    <stop offset="1" stop-color="#a9b6ff" stop-opacity="0"/>
  </linearGradient>
  <linearGradient id="silver" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#f9d1e5" stop-opacity=".03"/><stop offset=".45" stop-color="#ffe5bc" stop-opacity=".74"/><stop offset=".72" stop-color="#a4a7ff" stop-opacity=".6"/><stop offset="1" stop-color="#f9d1e5" stop-opacity="0"/>
  </linearGradient>
  <radialGradient id="mistPink"><stop offset="0" stop-color="#e9a1ff" stop-opacity=".32"/><stop offset=".45" stop-color="#b384fa" stop-opacity=".1"/><stop offset="1" stop-color="#b384fa" stop-opacity="0"/></radialGradient>
  <radialGradient id="mistBlue"><stop offset="0" stop-color="#759afe" stop-opacity=".27"/><stop offset=".52" stop-color="#7d92fc" stop-opacity=".09"/><stop offset="1" stop-color="#7d92fc" stop-opacity="0"/></radialGradient>
  <radialGradient id="starGlow"><stop offset="0" stop-color="#fffdfa" stop-opacity=".96"/><stop offset=".1" stop-color="#ffe4cb" stop-opacity=".7"/><stop offset=".35" stop-color="#dfb3ff" stop-opacity=".25"/><stop offset="1" stop-color="#b7b6ff" stop-opacity="0"/></radialGradient>
  <filter id="softBlur" x="-90%" y="-90%" width="280%" height="280%"><feGaussianBlur stdDeviation="9"/></filter>
  <filter id="haloBlur" x="-90%" y="-90%" width="280%" height="280%"><feGaussianBlur stdDeviation="21"/></filter>
  <filter id="starBlur" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="4"/></filter>

  
  
  
  
  @@GLYPHS@@
  <clipPath id="lettersClip"><use href="#glyph0"/><use href="#glyph1"/><use href="#glyph2"/><use href="#glyph3"/></clipPath>
  <g id="tinyStar"><path d="M0 -8 Q1.4 -1.4 8 0 Q1.4 1.4 0 8 Q-1.4 1.4 -8 0 Q-1.4 -1.4 0 -8Z" fill="#fff7e3"/><circle r="2" fill="#fff"/></g>
  <g id="diamond"><path d="M0 -10 L6 0 L0 10 L-6 0Z" fill="none" stroke="#ead2fd" stroke-width="1.1"/><circle r="2" fill="#fff2e0"/></g>
</defs>

<!-- 全畫面沒有背景矩形；零 alpha 區域保持透明 -->


<!-- 宇宙絲帶：置於字後，以半透明流線烘托直排節奏 -->
<g id="celestial-ribbons" fill="none" stroke-linecap="round">

  <path d="M196 171 C267 75 521 69 606 185 C685 289 547 340 448 358 C319 383 178 393 178 484 C178 544 289 563 362 553" stroke="url(#ribbon)" stroke-width="3" opacity=".82"/>

  <path d="M171 365 C76 435 135 556 285 572 C452 586 647 473 664 552 C685 647 515 693 472 749" stroke="url(#ribbon)" stroke-width="3.4" opacity=".82"/>

  <path d="M548 649 C692 663 705 755 613 816 C508 889 202 842 158 925 C129 980 194 1030 262 1054" stroke="url(#ribbon)" stroke-width="3" opacity=".72"/>

  <path d="M256 1180 C113 1165 135 1302 294 1320 C456 1338 615 1165 695 1239 C730 1272 660 1340 579 1361" stroke="url(#ribbon)" stroke-width="3.7" opacity=".85"/>
  <path d="M200 205 C249 108 483 102 556 170 M179 947 C244 886 549 896 637 964 M193 1243 C173 1297 304 1358 469 1311" stroke="url(#silver)" stroke-width="1.15" stroke-dasharray="1 8" opacity=".65"/>
</g>

<!-- 金色星環與散落的細線軌道 -->
<g id="orbits" fill="none" stroke="#e2c9f2" stroke-linecap="round">
  <ellipse cx="413" cy="244" rx="233" ry="135" transform="rotate(-23 413 244)" stroke-width="1.2" stroke-dasharray="1.4 8" opacity=".66"/>
  <ellipse cx="404" cy="800" rx="257" ry="157" transform="rotate(18 404 800)" stroke-width="1.1" stroke-dasharray="1.6 7" opacity=".46"/>
  <path d="M272 595 C122 654 111 720 180 780 M634 812 C714 882 692 981 620 1037" stroke-width="1.4" stroke-dasharray="2 9" opacity=".55"/>
  <path d="M305 1285 C431 1408 599 1320 668 1285" stroke="#ffe8bf" stroke-width="1.2" stroke-dasharray="2 8" opacity=".56"/>
</g>

<g id="bead-chains" fill="none" stroke="#f2d7e7" stroke-linecap="round" opacity=".84">
  <path d="M632 314 V461 M220 583 V732 M594 919 V1088 M305 1266 V1370" stroke-width="1.05" stroke-dasharray="2 8"/>
  <circle cx="632" cy="332" r="3" stroke-width="1.3"/><circle cx="632" cy="351" r="1.8" fill="#fcece6"/><circle cx="632" cy="376" r="2.5" fill="#b2b5fa"/>
  <circle cx="220" cy="615" r="2.5"/><circle cx="220" cy="645" r="2" fill="#fff4de"/>
  <circle cx="594" cy="948" r="2.4"/><circle cx="594" cy="976" r="2.5" fill="#c8b9ff"/>
  <circle cx="305" cy="1298" r="2.7"/><circle cx="305" cy="1333" r="2.2" fill="#ffeace"/>
</g>
<g id="floating-charms">
  <use href="#diamond" transform="translate(632 444) scale(1.0)"/>
  <use href="#diamond" transform="translate(220 720) scale(.8)"/>
  <use href="#diamond" transform="translate(594 1065) scale(1.2)"/>
  <use href="#diamond" transform="translate(305 1382) scale(.9)"/>
  <path d="M540 1243 A19 19 0 1 0 562 1216 A15 15 0 1 1 540 1243Z" fill="#fff2d0" opacity=".82"/>
  <path d="M637 1130 A12 12 0 1 0 650 1110 A10 10 0 1 1 637 1130Z" fill="#d9c2fd" opacity=".85"/>
</g>

<g id="field-stars">
<circle cx="721.4" cy="138.7" r="0.70" fill="#ffdccc" opacity="0.75"/>
<circle cx="723.9" cy="1117.3" r="0.76" fill="#e8d5ff" opacity="0.55"/>
<circle cx="112.0" cy="158.2" r="1.13" fill="#ecceff" opacity="0.49"/>
<circle cx="671.1" cy="1244.2" r="1.32" fill="#ffdccc" opacity="0.55"/>
<circle cx="355.1" cy="947.8" r="1.15" fill="#e8d5ff" opacity="0.49"/>
<circle cx="482.3" cy="332.5" r="0.41" fill="#ffdccc" opacity="0.65"/>
<circle cx="159.9" cy="896.4" r="0.42" fill="#ffdccc" opacity="0.36"/>
<circle cx="199.3" cy="1329.1" r="2.04" fill="#ffdccc" opacity="0.69"/>
<circle cx="436.8" cy="1152.7" r="1.51" fill="#ffdccc" opacity="0.37"/>
<circle cx="131.6" cy="885.0" r="0.30" fill="#ecceff" opacity="0.75"/>
<circle cx="570.6" cy="868.7" r="0.58" fill="#ffdccc" opacity="0.29"/>
<circle cx="604.9" cy="269.7" r="0.68" fill="#ffdccc" opacity="0.40"/>
<circle cx="155.8" cy="1087.4" r="1.42" fill="#acc3ff" opacity="0.37"/>
<circle cx="304.6" cy="1217.9" r="0.46" fill="#ecceff" opacity="0.39"/>
<circle cx="310.9" cy="309.8" r="1.14" fill="#ecceff" opacity="0.56"/>
<circle cx="471.0" cy="1173.3" r="0.68" fill="#ecceff" opacity="0.75"/>
<circle cx="410.1" cy="343.0" r="1.89" fill="#acc3ff" opacity="0.75"/>
<circle cx="594.0" cy="413.3" r="0.59" fill="#acc3ff" opacity="0.33"/>
<circle cx="393.8" cy="369.7" r="0.50" fill="#ffdccc" opacity="0.53"/>
<circle cx="272.0" cy="764.0" r="1.29" fill="#ffdccc" opacity="0.77"/>
<circle cx="459.3" cy="525.9" r="1.95" fill="#ffdccc" opacity="0.66"/>
<circle cx="113.5" cy="228.5" r="1.82" fill="#ecceff" opacity="0.44"/>
<circle cx="645.0" cy="769.8" r="1.24" fill="#e8d5ff" opacity="0.70"/>
<circle cx="699.6" cy="974.0" r="0.51" fill="#acc3ff" opacity="0.31"/>
<circle cx="544.4" cy="1193.8" r="0.36" fill="#e8d5ff" opacity="0.71"/>
<circle cx="278.1" cy="903.9" r="1.42" fill="#ffdccc" opacity="0.64"/>
<circle cx="640.1" cy="1332.6" r="1.09" fill="#e8d5ff" opacity="0.62"/>
<circle cx="453.7" cy="425.3" r="0.35" fill="#e8d5ff" opacity="0.57"/>
<circle cx="293.8" cy="1100.2" r="0.40" fill="#ecceff" opacity="0.75"/>
<circle cx="399.8" cy="229.4" r="1.11" fill="#ffdccc" opacity="0.38"/>
<circle cx="647.9" cy="1349.7" r="0.62" fill="#e8d5ff" opacity="0.48"/>
<circle cx="572.9" cy="291.0" r="0.38" fill="#acc3ff" opacity="0.45"/>
<circle cx="703.6" cy="958.2" r="1.32" fill="#ecceff" opacity="0.76"/>
<circle cx="143.8" cy="518.2" r="0.60" fill="#e8d5ff" opacity="0.57"/>
<circle cx="631.9" cy="83.4" r="1.35" fill="#ecceff" opacity="0.45"/>
<circle cx="146.0" cy="114.9" r="0.54" fill="#ffdccc" opacity="0.35"/>
<circle cx="300.0" cy="584.0" r="2.16" fill="#acc3ff" opacity="0.46"/>
<circle cx="530.0" cy="1129.1" r="1.24" fill="#ecceff" opacity="0.68"/>
<circle cx="434.9" cy="908.1" r="0.32" fill="#e8d5ff" opacity="0.33"/>
<circle cx="395.6" cy="68.4" r="0.43" fill="#ecceff" opacity="0.56"/>
<circle cx="368.5" cy="786.4" r="0.83" fill="#ecceff" opacity="0.64"/>
<circle cx="467.2" cy="896.1" r="1.45" fill="#ffdccc" opacity="0.38"/>
<circle cx="258.2" cy="940.1" r="0.38" fill="#ffdccc" opacity="0.48"/>
<circle cx="635.7" cy="442.6" r="0.48" fill="#e8d5ff" opacity="0.51"/>
<circle cx="192.1" cy="794.7" r="0.70" fill="#ecceff" opacity="0.51"/>
<circle cx="434.7" cy="412.8" r="1.24" fill="#acc3ff" opacity="0.47"/>
<circle cx="696.4" cy="1053.4" r="1.31" fill="#ffdccc" opacity="0.52"/>
<circle cx="694.0" cy="279.9" r="1.44" fill="#acc3ff" opacity="0.31"/>
<circle cx="204.3" cy="130.4" r="1.30" fill="#ecceff" opacity="0.48"/>
<circle cx="234.4" cy="615.9" r="1.80" fill="#ecceff" opacity="0.45"/>
<circle cx="459.4" cy="1214.4" r="0.35" fill="#ffdccc" opacity="0.37"/>
<circle cx="627.0" cy="900.6" r="0.41" fill="#acc3ff" opacity="0.60"/>
<circle cx="153.0" cy="459.0" r="1.38" fill="#e8d5ff" opacity="0.68"/>
<circle cx="163.8" cy="891.6" r="0.45" fill="#e8d5ff" opacity="0.73"/>
<circle cx="208.2" cy="240.8" r="0.33" fill="#e8d5ff" opacity="0.75"/>
<circle cx="561.6" cy="929.1" r="0.71" fill="#ffdccc" opacity="0.47"/>
<circle cx="607.1" cy="751.9" r="2.23" fill="#ecceff" opacity="0.53"/>
<circle cx="159.5" cy="126.6" r="1.55" fill="#acc3ff" opacity="0.30"/>
<circle cx="155.2" cy="1310.6" r="0.53" fill="#ecceff" opacity="0.58"/>
<circle cx="229.1" cy="981.4" r="1.42" fill="#ffdccc" opacity="0.66"/>
<circle cx="334.9" cy="657.7" r="1.22" fill="#acc3ff" opacity="0.48"/>
<circle cx="487.4" cy="518.4" r="1.52" fill="#acc3ff" opacity="0.53"/>
<circle cx="727.1" cy="687.5" r="1.51" fill="#acc3ff" opacity="0.67"/>
<circle cx="419.5" cy="1198.6" r="1.23" fill="#e8d5ff" opacity="0.38"/>
<circle cx="658.9" cy="548.7" r="0.71" fill="#ffdccc" opacity="0.31"/>
<circle cx="492.4" cy="1351.0" r="1.48" fill="#e8d5ff" opacity="0.65"/>
<circle cx="422.8" cy="107.9" r="0.62" fill="#acc3ff" opacity="0.70"/>
<circle cx="276.2" cy="271.5" r="0.40" fill="#ecceff" opacity="0.79"/>
<circle cx="294.7" cy="992.8" r="1.16" fill="#ecceff" opacity="0.33"/>
<circle cx="379.0" cy="1326.7" r="0.33" fill="#acc3ff" opacity="0.39"/>
<circle cx="459.0" cy="185.7" r="1.52" fill="#acc3ff" opacity="0.42"/>
<circle cx="388.0" cy="408.6" r="0.73" fill="#acc3ff" opacity="0.62"/>
<circle cx="196.9" cy="953.5" r="0.44" fill="#acc3ff" opacity="0.31"/>
<circle cx="429.1" cy="1196.9" r="0.56" fill="#e8d5ff" opacity="0.55"/>
<circle cx="662.2" cy="402.5" r="1.07" fill="#e8d5ff" opacity="0.34"/>
<circle cx="405.0" cy="881.4" r="1.02" fill="#acc3ff" opacity="0.33"/>
<circle cx="499.4" cy="1129.1" r="0.47" fill="#ecceff" opacity="0.59"/>
<circle cx="122.9" cy="1320.5" r="1.27" fill="#ffdccc" opacity="0.71"/>
<circle cx="183.8" cy="798.5" r="0.76" fill="#acc3ff" opacity="0.27"/>
<circle cx="321.7" cy="809.2" r="1.36" fill="#e8d5ff" opacity="0.74"/>
<circle cx="199.4" cy="254.5" r="0.55" fill="#acc3ff" opacity="0.51"/>
<circle cx="582.8" cy="627.3" r="0.59" fill="#e8d5ff" opacity="0.53"/>
<circle cx="330.4" cy="1348.4" r="0.50" fill="#ffdccc" opacity="0.71"/>
<circle cx="642.2" cy="1294.8" r="1.49" fill="#ecceff" opacity="0.66"/>
<circle cx="695.1" cy="1293.6" r="0.31" fill="#e8d5ff" opacity="0.57"/>
<circle cx="358.9" cy="1132.8" r="0.67" fill="#ecceff" opacity="0.72"/>
<circle cx="115.2" cy="601.7" r="0.78" fill="#ecceff" opacity="0.44"/>
<circle cx="726.3" cy="1129.7" r="0.75" fill="#e8d5ff" opacity="0.62"/>
<circle cx="270.7" cy="757.0" r="1.55" fill="#ecceff" opacity="0.37"/>
<circle cx="562.1" cy="188.2" r="0.59" fill="#acc3ff" opacity="0.31"/>
<circle cx="313.9" cy="1328.5" r="1.50" fill="#e8d5ff" opacity="0.74"/>
<circle cx="463.6" cy="1107.0" r="1.41" fill="#acc3ff" opacity="0.78"/>
<circle cx="256.3" cy="960.1" r="1.20" fill="#acc3ff" opacity="0.65"/>
<circle cx="136.9" cy="1094.2" r="0.74" fill="#ffdccc" opacity="0.75"/>
<circle cx="125.7" cy="435.7" r="1.01" fill="#e8d5ff" opacity="0.78"/>
<circle cx="361.2" cy="1231.4" r="0.34" fill="#ffdccc" opacity="0.51"/>
<circle cx="724.6" cy="1003.3" r="1.30" fill="#acc3ff" opacity="0.71"/>
<circle cx="453.1" cy="463.7" r="1.13" fill="#e8d5ff" opacity="0.49"/>
<circle cx="584.4" cy="311.2" r="0.64" fill="#ffdccc" opacity="0.36"/>
<circle cx="711.2" cy="1185.7" r="1.51" fill="#acc3ff" opacity="0.73"/>
<circle cx="254.3" cy="273.7" r="0.56" fill="#ffdccc" opacity="0.46"/>
<circle cx="173.3" cy="823.7" r="1.42" fill="#ffdccc" opacity="0.72"/>
<circle cx="447.5" cy="132.7" r="0.51" fill="#ecceff" opacity="0.38"/>
<circle cx="326.5" cy="1102.6" r="0.49" fill="#ecceff" opacity="0.43"/>
<circle cx="292.2" cy="770.8" r="0.56" fill="#ecceff" opacity="0.56"/>
<circle cx="137.7" cy="1309.4" r="1.49" fill="#e8d5ff" opacity="0.55"/>
<circle cx="114.8" cy="1034.6" r="1.03" fill="#ecceff" opacity="0.53"/>
<circle cx="336.8" cy="706.3" r="0.74" fill="#ffdccc" opacity="0.79"/>
<circle cx="288.8" cy="998.8" r="0.38" fill="#e8d5ff" opacity="0.29"/>
<circle cx="712.2" cy="1082.5" r="2.32" fill="#e8d5ff" opacity="0.33"/>
<circle cx="372.1" cy="965.7" r="1.30" fill="#ecceff" opacity="0.71"/>
<circle cx="232.1" cy="255.9" r="0.81" fill="#e8d5ff" opacity="0.54"/>
<circle cx="609.4" cy="89.7" r="0.80" fill="#e8d5ff" opacity="0.71"/>
<circle cx="231.1" cy="732.0" r="0.48" fill="#e8d5ff" opacity="0.34"/>
<circle cx="191.9" cy="936.8" r="0.85" fill="#e8d5ff" opacity="0.29"/>
<circle cx="129.8" cy="708.8" r="1.52" fill="#acc3ff" opacity="0.32"/>
<circle cx="633.6" cy="269.8" r="1.28" fill="#e8d5ff" opacity="0.33"/>
<circle cx="458.0" cy="714.8" r="0.55" fill="#ecceff" opacity="0.34"/>
<circle cx="486.2" cy="432.7" r="1.43" fill="#ecceff" opacity="0.41"/>
<circle cx="453.3" cy="385.7" r="0.53" fill="#ffdccc" opacity="0.52"/>
<circle cx="193.8" cy="1173.6" r="0.52" fill="#ffdccc" opacity="0.52"/>
<circle cx="129.0" cy="377.5" r="1.50" fill="#acc3ff" opacity="0.50"/>
<circle cx="616.1" cy="1032.2" r="1.28" fill="#ecceff" opacity="0.64"/>
<circle cx="115.6" cy="505.1" r="0.56" fill="#ecceff" opacity="0.39"/>
<circle cx="719.5" cy="829.9" r="1.24" fill="#e8d5ff" opacity="0.49"/>
<circle cx="230.7" cy="1257.7" r="1.49" fill="#acc3ff" opacity="0.27"/>
<circle cx="138.9" cy="897.9" r="0.67" fill="#ecceff" opacity="0.61"/>
<circle cx="735.0" cy="270.4" r="0.52" fill="#acc3ff" opacity="0.69"/>
<circle cx="481.3" cy="1154.5" r="0.74" fill="#e8d5ff" opacity="0.68"/>
<circle cx="450.7" cy="237.0" r="0.56" fill="#ecceff" opacity="0.38"/>
<circle cx="351.9" cy="137.5" r="0.53" fill="#ffdccc" opacity="0.62"/>
<circle cx="223.5" cy="609.0" r="0.83" fill="#e8d5ff" opacity="0.39"/>
<circle cx="467.0" cy="457.2" r="1.30" fill="#acc3ff" opacity="0.41"/>
<circle cx="146.2" cy="1135.4" r="0.60" fill="#acc3ff" opacity="0.76"/>
<circle cx="310.5" cy="1080.1" r="1.28" fill="#ecceff" opacity="0.65"/>
<circle cx="243.9" cy="500.4" r="1.09" fill="#acc3ff" opacity="0.49"/>
<circle cx="677.9" cy="1206.0" r="0.42" fill="#e8d5ff" opacity="0.78"/>
<circle cx="533.1" cy="965.0" r="1.46" fill="#ecceff" opacity="0.43"/>
<circle cx="640.1" cy="605.0" r="2.26" fill="#ffdccc" opacity="0.65"/>
<circle cx="427.7" cy="185.1" r="1.45" fill="#ecceff" opacity="0.40"/>
<circle cx="134.8" cy="250.2" r="1.18" fill="#ffdccc" opacity="0.55"/>
<circle cx="571.5" cy="605.0" r="1.09" fill="#e8d5ff" opacity="0.41"/>
<circle cx="632.8" cy="559.4" r="1.12" fill="#e8d5ff" opacity="0.71"/>
<circle cx="686.9" cy="490.7" r="1.46" fill="#ecceff" opacity="0.51"/>
<circle cx="716.9" cy="806.2" r="0.54" fill="#ffdccc" opacity="0.34"/>
<circle cx="345.4" cy="402.6" r="1.11" fill="#ecceff" opacity="0.79"/>
<circle cx="216.7" cy="280.4" r="0.51" fill="#e8d5ff" opacity="0.40"/>
<circle cx="295.1" cy="521.9" r="0.39" fill="#acc3ff" opacity="0.54"/>
<circle cx="666.4" cy="613.4" r="0.37" fill="#ecceff" opacity="0.47"/>
<circle cx="151.7" cy="682.1" r="0.32" fill="#e8d5ff" opacity="0.61"/>
<circle cx="718.9" cy="512.6" r="0.64" fill="#ffdccc" opacity="0.61"/>
<circle cx="297.2" cy="494.7" r="0.37" fill="#acc3ff" opacity="0.56"/>
<circle cx="644.7" cy="512.3" r="1.54" fill="#ffdccc" opacity="0.34"/>
<circle cx="134.4" cy="97.8" r="0.79" fill="#ffdccc" opacity="0.75"/>
<circle cx="570.8" cy="711.9" r="1.24" fill="#ffdccc" opacity="0.67"/>
<circle cx="599.2" cy="99.2" r="0.53" fill="#ffdccc" opacity="0.48"/>
<circle cx="150.7" cy="312.9" r="0.61" fill="#ffdccc" opacity="0.30"/>
<circle cx="168.6" cy="793.1" r="1.19" fill="#ecceff" opacity="0.54"/>
<circle cx="178.6" cy="603.5" r="0.80" fill="#ffdccc" opacity="0.38"/>
<circle cx="650.0" cy="1231.6" r="1.09" fill="#e8d5ff" opacity="0.62"/>
<circle cx="573.8" cy="412.1" r="0.47" fill="#e8d5ff" opacity="0.67"/>
<circle cx="320.7" cy="1192.2" r="0.68" fill="#ecceff" opacity="0.55"/>
<circle cx="461.6" cy="387.7" r="0.59" fill="#e8d5ff" opacity="0.77"/>
<circle cx="369.2" cy="363.3" r="1.16" fill="#ffdccc" opacity="0.58"/>
<circle cx="612.6" cy="319.4" r="2.24" fill="#ffdccc" opacity="0.41"/>
<circle cx="725.8" cy="401.1" r="1.50" fill="#acc3ff" opacity="0.52"/>
<circle cx="649.2" cy="1057.4" r="1.46" fill="#ecceff" opacity="0.61"/>
<circle cx="177.5" cy="1066.7" r="0.47" fill="#ecceff" opacity="0.64"/>
<circle cx="277.0" cy="168.2" r="1.38" fill="#acc3ff" opacity="0.56"/>
<circle cx="553.5" cy="867.9" r="0.78" fill="#e8d5ff" opacity="0.39"/>
<circle cx="582.4" cy="1349.2" r="1.90" fill="#e8d5ff" opacity="0.79"/>
<circle cx="301.5" cy="326.5" r="1.47" fill="#ecceff" opacity="0.70"/>
<circle cx="431.5" cy="589.2" r="0.44" fill="#ecceff" opacity="0.40"/>
<circle cx="341.2" cy="312.9" r="0.63" fill="#acc3ff" opacity="0.33"/>
<circle cx="197.9" cy="1316.0" r="1.32" fill="#ecceff" opacity="0.33"/>
<circle cx="722.2" cy="803.7" r="0.34" fill="#acc3ff" opacity="0.50"/>
<circle cx="242.2" cy="984.9" r="1.73" fill="#ecceff" opacity="0.65"/>
<circle cx="675.1" cy="945.7" r="0.59" fill="#ffdccc" opacity="0.44"/>
<circle cx="429.2" cy="807.5" r="1.92" fill="#acc3ff" opacity="0.43"/>
<circle cx="332.2" cy="646.5" r="0.53" fill="#ecceff" opacity="0.53"/>
<circle cx="677.5" cy="800.4" r="0.76" fill="#acc3ff" opacity="0.36"/>
<circle cx="610.1" cy="936.1" r="0.41" fill="#e8d5ff" opacity="0.33"/>
<circle cx="309.9" cy="800.9" r="0.76" fill="#ecceff" opacity="0.44"/>
<circle cx="431.0" cy="803.3" r="0.61" fill="#e8d5ff" opacity="0.62"/>
<circle cx="461.4" cy="532.8" r="1.54" fill="#ecceff" opacity="0.76"/>
<circle cx="729.2" cy="275.5" r="1.29" fill="#acc3ff" opacity="0.69"/>
<circle cx="626.2" cy="627.9" r="0.69" fill="#ffdccc" opacity="0.78"/>
<circle cx="288.4" cy="1179.1" r="0.72" fill="#ecceff" opacity="0.58"/>
<circle cx="120.6" cy="321.2" r="0.78" fill="#acc3ff" opacity="0.47"/>
<circle cx="584.6" cy="1055.4" r="1.15" fill="#ffdccc" opacity="0.74"/>
<circle cx="268.0" cy="1145.5" r="1.00" fill="#ecceff" opacity="0.61"/>
<circle cx="138.8" cy="496.8" r="1.02" fill="#acc3ff" opacity="0.63"/>
<circle cx="442.9" cy="1123.3" r="0.45" fill="#ecceff" opacity="0.30"/>
<circle cx="686.0" cy="613.4" r="0.63" fill="#e8d5ff" opacity="0.48"/>
<circle cx="538.8" cy="931.3" r="0.56" fill="#ffdccc" opacity="0.49"/>
<circle cx="437.3" cy="1182.9" r="0.72" fill="#acc3ff" opacity="0.51"/>
<circle cx="137.1" cy="1008.9" r="0.44" fill="#e8d5ff" opacity="0.53"/>
<circle cx="729.7" cy="259.4" r="0.54" fill="#acc3ff" opacity="0.65"/>
<circle cx="458.5" cy="715.9" r="2.08" fill="#ffdccc" opacity="0.58"/>
<circle cx="357.5" cy="197.6" r="0.53" fill="#ffdccc" opacity="0.39"/>
<circle cx="440.2" cy="1232.8" r="1.31" fill="#ecceff" opacity="0.28"/>
<circle cx="228.1" cy="853.8" r="0.72" fill="#ffdccc" opacity="0.35"/>
<circle cx="616.9" cy="721.9" r="1.45" fill="#acc3ff" opacity="0.34"/>
<circle cx="637.4" cy="187.6" r="1.40" fill="#e8d5ff" opacity="0.71"/>
<circle cx="724.4" cy="265.9" r="1.24" fill="#ffdccc" opacity="0.70"/>
<circle cx="358.9" cy="75.5" r="0.81" fill="#e8d5ff" opacity="0.76"/>
<circle cx="568.3" cy="1339.7" r="1.09" fill="#ecceff" opacity="0.44"/>
<circle cx="653.9" cy="731.8" r="2.06" fill="#e8d5ff" opacity="0.31"/>
<circle cx="639.5" cy="1089.0" r="0.74" fill="#e8d5ff" opacity="0.72"/>
<circle cx="630.4" cy="895.3" r="1.53" fill="#ecceff" opacity="0.60"/>
<circle cx="406.9" cy="1123.8" r="0.57" fill="#e8d5ff" opacity="0.74"/>
<circle cx="643.8" cy="294.5" r="1.52" fill="#acc3ff" opacity="0.50"/>
<circle cx="215.4" cy="1221.9" r="1.85" fill="#ecceff" opacity="0.48"/>
<circle cx="456.3" cy="205.9" r="1.13" fill="#ffdccc" opacity="0.34"/>
<circle cx="118.2" cy="506.9" r="2.05" fill="#ffdccc" opacity="0.52"/>
<circle cx="668.2" cy="1144.3" r="0.68" fill="#acc3ff" opacity="0.77"/>
<circle cx="274.8" cy="733.7" r="1.99" fill="#ffdccc" opacity="0.77"/>
<circle cx="639.9" cy="240.9" r="0.46" fill="#acc3ff" opacity="0.78"/>
<circle cx="315.3" cy="937.1" r="0.38" fill="#ffdccc" opacity="0.36"/>
<circle cx="681.7" cy="910.0" r="0.77" fill="#e8d5ff" opacity="0.61"/>
</g>
<g id="title-lettering">
  <g>

  <use href="#glyph0" fill="#231f5c" stroke="#947dc8" stroke-width="10" stroke-linejoin="round" opacity=".24"/>
  <use href="#glyph0" fill="url(#letterFill)" stroke="url(#edgeGrad)" stroke-width="6.5" stroke-linejoin="round"/>
  <use href="#glyph0" fill="none" stroke="#fffaed" stroke-width="1.8" stroke-linejoin="round" opacity=".78"/>
  </g>
  <g>


  <use href="#glyph1" fill="#231f5c" stroke="#947dc8" stroke-width="10" stroke-linejoin="round" opacity=".24"/>
  <use href="#glyph1" fill="url(#letterFill)" stroke="url(#edgeGrad)" stroke-width="6.5" stroke-linejoin="round"/>
  <use href="#glyph1" fill="none" stroke="#fffaed" stroke-width="1.8" stroke-linejoin="round" opacity=".78"/>
  </g>
  <g>


  <use href="#glyph2" fill="#231f5c" stroke="#947dc8" stroke-width="10" stroke-linejoin="round" opacity=".24"/>
  <use href="#glyph2" fill="url(#letterFill)" stroke="url(#edgeGrad)" stroke-width="6.5" stroke-linejoin="round"/>
  <use href="#glyph2" fill="none" stroke="#fffaed" stroke-width="1.8" stroke-linejoin="round" opacity=".78"/>
  </g>
  <g>


  <use href="#glyph3" fill="#231f5c" stroke="#947dc8" stroke-width="10" stroke-linejoin="round" opacity=".24"/>
  <use href="#glyph3" fill="url(#letterFill)" stroke="url(#edgeGrad)" stroke-width="6.5" stroke-linejoin="round"/>
  <use href="#glyph3" fill="none" stroke="#fffaed" stroke-width="1.8" stroke-linejoin="round" opacity=".78"/>
  </g>
</g>
<g id="embedded-stardust" clip-path="url(#lettersClip)">
<circle cx="404.7" cy="900.1" r="3.38" fill="#faf0c8" opacity="0.44"/>
<circle cx="305.6" cy="1168.1" r="0.48" fill="#ffe2e0" opacity="0.29"/>
<circle cx="292.6" cy="537.4" r="1.42" fill="#faf0c8" opacity="0.32"/>
<circle cx="504.7" cy="684.9" r="0.85" fill="#ffe2e0" opacity="0.26"/>
<circle cx="475.1" cy="424.8" r="1.18" fill="#e6a0f8" opacity="0.68"/>
<circle cx="282.3" cy="408.4" r="1.28" fill="#fffefe" opacity="0.34"/>
<circle cx="327.6" cy="442.9" r="2.20" fill="#6b90fc" opacity="0.70"/>
<circle cx="345.6" cy="73.4" r="2.23" fill="#6b90fc" opacity="0.22"/>
<circle cx="523.3" cy="112.1" r="1.12" fill="#e6a0f8" opacity="0.30"/>
<circle cx="319.5" cy="698.3" r="0.92" fill="#fffefe" opacity="0.34"/>
<circle cx="583.4" cy="825.5" r="2.43" fill="#e6a0f8" opacity="0.49"/>
<circle cx="478.7" cy="967.4" r="2.39" fill="#fffefe" opacity="0.52"/>
<circle cx="365.2" cy="829.8" r="0.81" fill="#e6a0f8" opacity="0.31"/>
<circle cx="311.1" cy="813.0" r="2.22" fill="#ffe2e0" opacity="0.30"/>
<circle cx="539.0" cy="1235.1" r="0.88" fill="#6b90fc" opacity="0.43"/>
<circle cx="252.0" cy="1162.5" r="1.41" fill="#6b90fc" opacity="0.56"/>
<circle cx="459.5" cy="865.4" r="1.36" fill="#6b90fc" opacity="0.67"/>
<circle cx="491.5" cy="1167.7" r="2.27" fill="#ffe2e0" opacity="0.65"/>
<circle cx="359.2" cy="986.6" r="1.36" fill="#6b90fc" opacity="0.31"/>
<circle cx="414.9" cy="1233.5" r="0.75" fill="#6b90fc" opacity="0.43"/>
<circle cx="515.1" cy="956.2" r="1.73" fill="#ffe2e0" opacity="0.75"/>
<circle cx="351.5" cy="684.3" r="0.53" fill="#6b90fc" opacity="0.26"/>
<circle cx="532.8" cy="960.8" r="3.37" fill="#faf0c8" opacity="0.36"/>
<circle cx="276.7" cy="492.5" r="1.53" fill="#6b90fc" opacity="0.25"/>
<circle cx="585.9" cy="893.9" r="1.72" fill="#fffefe" opacity="0.36"/>
<circle cx="281.0" cy="907.0" r="1.48" fill="#6b90fc" opacity="0.71"/>
<circle cx="546.9" cy="1021.0" r="0.46" fill="#6b90fc" opacity="0.35"/>
<circle cx="513.1" cy="691.3" r="2.30" fill="#6b90fc" opacity="0.69"/>
<circle cx="548.2" cy="287.2" r="2.35" fill="#e6a0f8" opacity="0.32"/>
<circle cx="226.4" cy="210.0" r="0.86" fill="#fffefe" opacity="0.78"/>
<circle cx="365.1" cy="322.8" r="2.46" fill="#ffe2e0" opacity="0.57"/>
<circle cx="532.2" cy="1261.8" r="2.40" fill="#faf0c8" opacity="0.59"/>
<circle cx="254.5" cy="521.5" r="0.60" fill="#faf0c8" opacity="0.51"/>
<circle cx="401.9" cy="458.9" r="3.36" fill="#e6a0f8" opacity="0.69"/>
<circle cx="463.7" cy="159.5" r="2.10" fill="#faf0c8" opacity="0.38"/>
<circle cx="419.0" cy="418.9" r="2.57" fill="#e6a0f8" opacity="0.64"/>
<circle cx="482.1" cy="924.8" r="1.79" fill="#6b90fc" opacity="0.61"/>
<circle cx="561.8" cy="1312.2" r="0.75" fill="#fffefe" opacity="0.49"/>
<circle cx="241.7" cy="457.6" r="0.59" fill="#e6a0f8" opacity="0.70"/>
<circle cx="228.6" cy="909.0" r="2.56" fill="#faf0c8" opacity="0.34"/>
<circle cx="456.4" cy="1000.7" r="0.65" fill="#6b90fc" opacity="0.32"/>
<circle cx="496.0" cy="592.3" r="2.54" fill="#e6a0f8" opacity="0.32"/>
<circle cx="359.6" cy="649.5" r="1.14" fill="#ffe2e0" opacity="0.70"/>
<circle cx="493.1" cy="500.8" r="0.81" fill="#6b90fc" opacity="0.29"/>
<circle cx="272.0" cy="1027.8" r="3.19" fill="#6b90fc" opacity="0.49"/>
<circle cx="415.3" cy="984.5" r="1.20" fill="#6b90fc" opacity="0.52"/>
<circle cx="435.4" cy="1164.0" r="1.75" fill="#ffe2e0" opacity="0.66"/>
<circle cx="580.7" cy="387.8" r="1.76" fill="#faf0c8" opacity="0.29"/>
<circle cx="274.2" cy="957.4" r="1.27" fill="#e6a0f8" opacity="0.42"/>
<circle cx="569.4" cy="934.5" r="2.35" fill="#faf0c8" opacity="0.20"/>
<circle cx="428.2" cy="729.1" r="1.77" fill="#e6a0f8" opacity="0.36"/>
<circle cx="336.3" cy="641.2" r="1.78" fill="#faf0c8" opacity="0.30"/>
<circle cx="264.0" cy="844.9" r="0.63" fill="#ffe2e0" opacity="0.40"/>
<circle cx="528.1" cy="930.6" r="0.95" fill="#faf0c8" opacity="0.76"/>
<circle cx="367.6" cy="584.4" r="0.45" fill="#fffefe" opacity="0.45"/>
<circle cx="316.1" cy="1135.2" r="3.39" fill="#faf0c8" opacity="0.63"/>
<circle cx="266.9" cy="1263.1" r="1.89" fill="#ffe2e0" opacity="0.32"/>
<circle cx="496.0" cy="963.3" r="2.23" fill="#faf0c8" opacity="0.41"/>
<circle cx="370.6" cy="346.9" r="2.53" fill="#ffe2e0" opacity="0.36"/>
<circle cx="597.7" cy="675.6" r="1.25" fill="#fffefe" opacity="0.22"/>
<circle cx="373.4" cy="1252.5" r="2.13" fill="#ffe2e0" opacity="0.61"/>
<circle cx="356.0" cy="1116.8" r="2.52" fill="#6b90fc" opacity="0.68"/>
<circle cx="530.9" cy="415.8" r="2.33" fill="#fffefe" opacity="0.36"/>
<circle cx="260.8" cy="809.6" r="1.85" fill="#ffe2e0" opacity="0.48"/>
<circle cx="381.7" cy="521.3" r="2.58" fill="#e6a0f8" opacity="0.24"/>
<circle cx="557.3" cy="226.4" r="1.54" fill="#e6a0f8" opacity="0.54"/>
<circle cx="346.2" cy="556.0" r="3.15" fill="#ffe2e0" opacity="0.38"/>
<circle cx="280.6" cy="171.5" r="2.00" fill="#e6a0f8" opacity="0.28"/>
<circle cx="484.7" cy="828.2" r="1.87" fill="#faf0c8" opacity="0.79"/>
<circle cx="430.1" cy="1278.2" r="1.39" fill="#fffefe" opacity="0.37"/>
<circle cx="285.0" cy="189.6" r="0.70" fill="#e6a0f8" opacity="0.46"/>
<circle cx="246.1" cy="797.4" r="1.34" fill="#e6a0f8" opacity="0.30"/>
<circle cx="415.6" cy="889.4" r="1.78" fill="#faf0c8" opacity="0.38"/>
<circle cx="465.7" cy="245.4" r="0.66" fill="#ffe2e0" opacity="0.51"/>
<circle cx="404.6" cy="1061.5" r="2.35" fill="#fffefe" opacity="0.63"/>
<circle cx="354.2" cy="425.5" r="1.80" fill="#fffefe" opacity="0.65"/>
<circle cx="432.4" cy="267.8" r="2.50" fill="#e6a0f8" opacity="0.49"/>
<circle cx="289.7" cy="1247.5" r="2.40" fill="#faf0c8" opacity="0.78"/>
<circle cx="310.7" cy="1015.0" r="0.52" fill="#6b90fc" opacity="0.68"/>
<circle cx="378.9" cy="1187.7" r="1.45" fill="#e6a0f8" opacity="0.64"/>
<circle cx="378.6" cy="310.0" r="0.53" fill="#faf0c8" opacity="0.64"/>
<circle cx="510.7" cy="1095.5" r="0.82" fill="#faf0c8" opacity="0.45"/>
<circle cx="478.2" cy="1034.7" r="2.04" fill="#6b90fc" opacity="0.66"/>
<circle cx="539.4" cy="1263.6" r="1.43" fill="#e6a0f8" opacity="0.25"/>
<circle cx="388.1" cy="1028.5" r="2.58" fill="#faf0c8" opacity="0.26"/>
<circle cx="463.7" cy="602.1" r="1.59" fill="#fffefe" opacity="0.79"/>
<circle cx="547.8" cy="640.0" r="2.24" fill="#ffe2e0" opacity="0.60"/>
<circle cx="265.9" cy="573.9" r="0.52" fill="#ffe2e0" opacity="0.59"/>
<circle cx="557.5" cy="483.2" r="2.42" fill="#6b90fc" opacity="0.31"/>
<circle cx="358.2" cy="679.9" r="2.53" fill="#fffefe" opacity="0.32"/>
<circle cx="307.2" cy="246.2" r="1.61" fill="#ffe2e0" opacity="0.65"/>
<circle cx="523.3" cy="1025.1" r="1.91" fill="#fffefe" opacity="0.39"/>
<circle cx="503.0" cy="1271.2" r="1.09" fill="#ffe2e0" opacity="0.67"/>
<circle cx="581.3" cy="72.5" r="0.50" fill="#fffefe" opacity="0.70"/>
<circle cx="585.3" cy="141.8" r="2.35" fill="#faf0c8" opacity="0.54"/>
<circle cx="238.7" cy="240.8" r="0.65" fill="#faf0c8" opacity="0.73"/>
<circle cx="488.2" cy="1141.8" r="1.53" fill="#6b90fc" opacity="0.74"/>
<circle cx="398.7" cy="156.4" r="2.28" fill="#faf0c8" opacity="0.21"/>
<circle cx="328.5" cy="970.4" r="2.57" fill="#fffefe" opacity="0.64"/>
<circle cx="418.8" cy="132.3" r="2.57" fill="#fffefe" opacity="0.58"/>
<circle cx="492.9" cy="757.1" r="1.47" fill="#faf0c8" opacity="0.67"/>
<circle cx="290.9" cy="1087.1" r="2.42" fill="#fffefe" opacity="0.62"/>
<circle cx="239.6" cy="431.5" r="1.95" fill="#fffefe" opacity="0.69"/>
<circle cx="384.8" cy="619.3" r="1.41" fill="#fffefe" opacity="0.55"/>
<circle cx="494.9" cy="657.1" r="1.76" fill="#ffe2e0" opacity="0.27"/>
<circle cx="349.5" cy="512.8" r="1.14" fill="#ffe2e0" opacity="0.36"/>
<circle cx="567.0" cy="116.7" r="0.78" fill="#faf0c8" opacity="0.23"/>
<circle cx="376.7" cy="124.2" r="2.22" fill="#6b90fc" opacity="0.38"/>
<circle cx="247.0" cy="1261.2" r="1.16" fill="#e6a0f8" opacity="0.75"/>
<circle cx="555.5" cy="1241.1" r="1.76" fill="#fffefe" opacity="0.74"/>
<circle cx="526.2" cy="285.6" r="2.42" fill="#ffe2e0" opacity="0.34"/>
<circle cx="319.1" cy="1205.5" r="1.97" fill="#faf0c8" opacity="0.55"/>
<circle cx="247.8" cy="706.2" r="2.30" fill="#faf0c8" opacity="0.69"/>
<circle cx="266.9" cy="351.4" r="1.43" fill="#ffe2e0" opacity="0.24"/>
<circle cx="569.4" cy="572.3" r="1.12" fill="#fffefe" opacity="0.53"/>
<circle cx="469.7" cy="181.7" r="1.20" fill="#ffe2e0" opacity="0.31"/>
<circle cx="408.8" cy="922.9" r="0.70" fill="#fffefe" opacity="0.67"/>
<circle cx="347.6" cy="76.3" r="2.23" fill="#e6a0f8" opacity="0.65"/>
<circle cx="424.8" cy="1306.6" r="2.02" fill="#e6a0f8" opacity="0.40"/>
<circle cx="417.9" cy="1098.5" r="1.89" fill="#faf0c8" opacity="0.42"/>
<circle cx="527.8" cy="1312.6" r="1.06" fill="#ffe2e0" opacity="0.30"/>
<circle cx="429.5" cy="281.0" r="2.59" fill="#ffe2e0" opacity="0.67"/>
<circle cx="500.6" cy="701.5" r="2.04" fill="#fffefe" opacity="0.52"/>
<circle cx="321.7" cy="908.6" r="1.74" fill="#ffe2e0" opacity="0.35"/>
<circle cx="474.6" cy="398.1" r="1.08" fill="#fffefe" opacity="0.34"/>
<circle cx="369.1" cy="265.1" r="0.75" fill="#6b90fc" opacity="0.36"/>
<circle cx="526.2" cy="1224.7" r="2.22" fill="#fffefe" opacity="0.62"/>
<circle cx="273.9" cy="1213.6" r="1.68" fill="#ffe2e0" opacity="0.58"/>
<circle cx="346.9" cy="831.7" r="1.04" fill="#6b90fc" opacity="0.39"/>
<circle cx="521.6" cy="802.1" r="0.81" fill="#ffe2e0" opacity="0.23"/>
<circle cx="378.9" cy="1171.5" r="2.47" fill="#e6a0f8" opacity="0.54"/>
<circle cx="268.1" cy="857.1" r="2.35" fill="#6b90fc" opacity="0.62"/>
<circle cx="501.6" cy="921.4" r="3.01" fill="#6b90fc" opacity="0.74"/>
<circle cx="572.6" cy="92.0" r="0.74" fill="#fffefe" opacity="0.37"/>
<circle cx="509.0" cy="1106.6" r="1.12" fill="#fffefe" opacity="0.48"/>
<circle cx="411.3" cy="864.4" r="0.87" fill="#ffe2e0" opacity="0.22"/>
<circle cx="551.1" cy="688.5" r="1.01" fill="#6b90fc" opacity="0.52"/>
<circle cx="255.5" cy="419.0" r="0.73" fill="#6b90fc" opacity="0.76"/>
<circle cx="230.5" cy="994.0" r="1.99" fill="#ffe2e0" opacity="0.67"/>
<circle cx="240.2" cy="700.2" r="2.51" fill="#faf0c8" opacity="0.64"/>
<circle cx="392.0" cy="695.9" r="0.87" fill="#faf0c8" opacity="0.57"/>
<circle cx="313.3" cy="1159.1" r="1.29" fill="#ffe2e0" opacity="0.47"/>
<circle cx="518.0" cy="1003.6" r="1.72" fill="#faf0c8" opacity="0.76"/>
<circle cx="443.5" cy="184.9" r="2.15" fill="#faf0c8" opacity="0.39"/>
<circle cx="501.2" cy="1014.8" r="1.73" fill="#6b90fc" opacity="0.40"/>
<circle cx="510.9" cy="1031.1" r="2.37" fill="#6b90fc" opacity="0.66"/>
<circle cx="333.3" cy="1248.7" r="2.41" fill="#e6a0f8" opacity="0.22"/>
<circle cx="496.2" cy="844.6" r="2.22" fill="#e6a0f8" opacity="0.68"/>
<circle cx="440.2" cy="680.2" r="1.50" fill="#ffe2e0" opacity="0.28"/>
<circle cx="319.3" cy="158.3" r="0.61" fill="#6b90fc" opacity="0.64"/>
<circle cx="516.9" cy="895.7" r="0.71" fill="#faf0c8" opacity="0.57"/>
<circle cx="280.5" cy="1168.2" r="0.82" fill="#fffefe" opacity="0.28"/>
<circle cx="329.4" cy="330.4" r="2.02" fill="#fffefe" opacity="0.71"/>
<circle cx="460.2" cy="778.3" r="1.28" fill="#fffefe" opacity="0.33"/>
<circle cx="405.0" cy="300.4" r="2.16" fill="#faf0c8" opacity="0.27"/>
<circle cx="471.5" cy="998.6" r="2.09" fill="#6b90fc" opacity="0.78"/>
<circle cx="288.4" cy="790.0" r="2.59" fill="#faf0c8" opacity="0.35"/>
<circle cx="273.3" cy="188.5" r="0.95" fill="#ffe2e0" opacity="0.39"/>
<circle cx="391.0" cy="900.5" r="2.08" fill="#e6a0f8" opacity="0.72"/>
<circle cx="268.3" cy="1280.2" r="1.15" fill="#6b90fc" opacity="0.39"/>
<circle cx="548.3" cy="864.1" r="0.94" fill="#fffefe" opacity="0.22"/>
<circle cx="449.8" cy="767.7" r="1.68" fill="#e6a0f8" opacity="0.56"/>
<circle cx="421.6" cy="750.4" r="2.24" fill="#fffefe" opacity="0.30"/>
<circle cx="291.9" cy="326.6" r="0.82" fill="#6b90fc" opacity="0.38"/>
<circle cx="315.7" cy="1193.4" r="1.81" fill="#e6a0f8" opacity="0.70"/>
<circle cx="253.6" cy="806.9" r="2.25" fill="#fffefe" opacity="0.22"/>
<circle cx="268.2" cy="344.7" r="1.47" fill="#6b90fc" opacity="0.36"/>
<circle cx="550.6" cy="645.7" r="0.82" fill="#fffefe" opacity="0.35"/>
<circle cx="473.0" cy="1260.6" r="0.41" fill="#6b90fc" opacity="0.74"/>
<circle cx="509.5" cy="379.3" r="1.12" fill="#faf0c8" opacity="0.69"/>
<circle cx="276.0" cy="148.5" r="0.99" fill="#ffe2e0" opacity="0.46"/>
<circle cx="226.6" cy="217.8" r="1.33" fill="#6b90fc" opacity="0.44"/>
<circle cx="280.6" cy="646.4" r="0.43" fill="#ffe2e0" opacity="0.59"/>
<circle cx="595.4" cy="327.5" r="0.66" fill="#fffefe" opacity="0.48"/>
<circle cx="224.9" cy="377.6" r="1.71" fill="#faf0c8" opacity="0.49"/>
<circle cx="502.3" cy="1047.4" r="2.56" fill="#ffe2e0" opacity="0.24"/>
<circle cx="266.1" cy="420.0" r="2.49" fill="#6b90fc" opacity="0.54"/>
<circle cx="523.7" cy="141.3" r="1.45" fill="#6b90fc" opacity="0.61"/>
<circle cx="545.2" cy="418.7" r="0.49" fill="#6b90fc" opacity="0.33"/>
<circle cx="273.8" cy="1124.2" r="2.15" fill="#6b90fc" opacity="0.76"/>
<circle cx="396.8" cy="409.8" r="1.19" fill="#fffefe" opacity="0.67"/>
<circle cx="523.9" cy="900.2" r="1.20" fill="#ffe2e0" opacity="0.55"/>
<circle cx="284.6" cy="408.3" r="0.64" fill="#e6a0f8" opacity="0.44"/>
<circle cx="250.5" cy="501.6" r="1.86" fill="#ffe2e0" opacity="0.38"/>
<circle cx="242.1" cy="895.8" r="2.56" fill="#faf0c8" opacity="0.30"/>
<circle cx="275.6" cy="551.5" r="0.57" fill="#ffe2e0" opacity="0.51"/>
<circle cx="512.2" cy="392.4" r="1.10" fill="#faf0c8" opacity="0.25"/>
<circle cx="351.6" cy="121.8" r="3.30" fill="#faf0c8" opacity="0.67"/>
<circle cx="487.3" cy="809.9" r="2.05" fill="#6b90fc" opacity="0.47"/>
<circle cx="356.0" cy="342.9" r="1.61" fill="#faf0c8" opacity="0.72"/>
<circle cx="560.8" cy="960.1" r="1.24" fill="#faf0c8" opacity="0.46"/>
<circle cx="268.4" cy="782.7" r="1.64" fill="#e6a0f8" opacity="0.26"/>
<circle cx="237.7" cy="360.3" r="2.59" fill="#faf0c8" opacity="0.68"/>
<circle cx="588.2" cy="264.2" r="1.75" fill="#ffe2e0" opacity="0.64"/>
<circle cx="264.4" cy="364.4" r="0.71" fill="#faf0c8" opacity="0.54"/>
<circle cx="571.0" cy="823.1" r="1.91" fill="#6b90fc" opacity="0.39"/>
<circle cx="302.7" cy="1096.9" r="1.05" fill="#fffefe" opacity="0.76"/>
<circle cx="262.4" cy="325.6" r="0.49" fill="#ffe2e0" opacity="0.29"/>
<circle cx="514.9" cy="500.6" r="2.34" fill="#fffefe" opacity="0.39"/>
<circle cx="529.8" cy="399.3" r="2.20" fill="#e6a0f8" opacity="0.74"/>
<circle cx="261.9" cy="672.1" r="1.85" fill="#fffefe" opacity="0.78"/>
<circle cx="483.7" cy="767.2" r="1.11" fill="#faf0c8" opacity="0.29"/>
<circle cx="443.8" cy="260.0" r="2.21" fill="#6b90fc" opacity="0.44"/>
<circle cx="562.8" cy="961.3" r="1.09" fill="#fffefe" opacity="0.63"/>
<circle cx="426.6" cy="728.6" r="1.65" fill="#ffe2e0" opacity="0.31"/>
<circle cx="407.3" cy="563.5" r="1.40" fill="#e6a0f8" opacity="0.73"/>
<circle cx="549.8" cy="788.6" r="2.26" fill="#faf0c8" opacity="0.77"/>
<circle cx="266.3" cy="475.9" r="1.44" fill="#fffefe" opacity="0.50"/>
<circle cx="287.2" cy="1310.1" r="2.20" fill="#fffefe" opacity="0.53"/>
<circle cx="546.3" cy="323.1" r="3.20" fill="#e6a0f8" opacity="0.53"/>
<circle cx="230.6" cy="844.7" r="2.19" fill="#6b90fc" opacity="0.49"/>
<circle cx="319.4" cy="952.3" r="2.13" fill="#faf0c8" opacity="0.35"/>
<circle cx="329.5" cy="1259.6" r="0.47" fill="#e6a0f8" opacity="0.64"/>
<circle cx="460.9" cy="300.0" r="2.22" fill="#faf0c8" opacity="0.52"/>
<circle cx="345.2" cy="440.0" r="2.11" fill="#6b90fc" opacity="0.32"/>
<circle cx="335.1" cy="495.1" r="1.98" fill="#ffe2e0" opacity="0.31"/>
<circle cx="260.3" cy="956.8" r="0.91" fill="#6b90fc" opacity="0.50"/>
<circle cx="344.4" cy="1172.6" r="1.74" fill="#6b90fc" opacity="0.36"/>
<circle cx="349.5" cy="1017.0" r="1.13" fill="#ffe2e0" opacity="0.63"/>
<circle cx="540.0" cy="1300.2" r="1.54" fill="#fffefe" opacity="0.45"/>
<circle cx="427.4" cy="1029.6" r="2.65" fill="#6b90fc" opacity="0.54"/>
<circle cx="406.4" cy="510.2" r="2.14" fill="#faf0c8" opacity="0.47"/>
<circle cx="517.9" cy="1023.0" r="1.47" fill="#6b90fc" opacity="0.44"/>
<circle cx="501.6" cy="1064.8" r="0.90" fill="#ffe2e0" opacity="0.57"/>
<circle cx="564.2" cy="1120.9" r="2.53" fill="#ffe2e0" opacity="0.74"/>
<circle cx="545.7" cy="520.2" r="1.42" fill="#faf0c8" opacity="0.73"/>
<circle cx="369.2" cy="1052.6" r="1.00" fill="#faf0c8" opacity="0.60"/>
<circle cx="598.9" cy="989.1" r="2.31" fill="#faf0c8" opacity="0.21"/>
<circle cx="327.1" cy="547.9" r="1.89" fill="#faf0c8" opacity="0.34"/>
<circle cx="396.7" cy="1085.0" r="0.93" fill="#6b90fc" opacity="0.26"/>
<circle cx="451.1" cy="343.2" r="0.61" fill="#fffefe" opacity="0.29"/>
<circle cx="393.6" cy="873.3" r="2.84" fill="#e6a0f8" opacity="0.73"/>
<circle cx="526.9" cy="917.9" r="1.29" fill="#faf0c8" opacity="0.53"/>
<circle cx="526.9" cy="420.3" r="1.05" fill="#6b90fc" opacity="0.34"/>
<circle cx="579.7" cy="422.6" r="1.56" fill="#faf0c8" opacity="0.52"/>
<circle cx="570.1" cy="663.6" r="0.99" fill="#fffefe" opacity="0.74"/>
<circle cx="226.1" cy="367.9" r="0.44" fill="#6b90fc" opacity="0.24"/>
<circle cx="445.9" cy="738.0" r="1.99" fill="#6b90fc" opacity="0.22"/>
<circle cx="301.4" cy="609.8" r="1.16" fill="#ffe2e0" opacity="0.45"/>
<circle cx="304.0" cy="814.9" r="1.32" fill="#fffefe" opacity="0.32"/>
<circle cx="342.2" cy="648.6" r="1.48" fill="#6b90fc" opacity="0.76"/>
<circle cx="497.3" cy="1125.6" r="0.44" fill="#faf0c8" opacity="0.20"/>
<circle cx="561.9" cy="831.6" r="2.93" fill="#fffefe" opacity="0.80"/>
<circle cx="328.0" cy="109.5" r="0.44" fill="#6b90fc" opacity="0.80"/>
<circle cx="357.1" cy="1241.1" r="2.00" fill="#faf0c8" opacity="0.79"/>
<circle cx="477.0" cy="818.3" r="1.20" fill="#ffe2e0" opacity="0.55"/>
<circle cx="387.5" cy="181.5" r="0.69" fill="#e6a0f8" opacity="0.78"/>
<circle cx="545.9" cy="122.5" r="2.09" fill="#faf0c8" opacity="0.58"/>
<circle cx="500.1" cy="1196.8" r="2.42" fill="#faf0c8" opacity="0.28"/>
<circle cx="245.1" cy="251.4" r="0.49" fill="#6b90fc" opacity="0.41"/>
<circle cx="474.4" cy="757.1" r="1.25" fill="#ffe2e0" opacity="0.54"/>
<circle cx="225.8" cy="611.7" r="1.11" fill="#fffefe" opacity="0.62"/>
<circle cx="399.8" cy="449.5" r="1.33" fill="#e6a0f8" opacity="0.57"/>
<circle cx="313.4" cy="416.6" r="3.28" fill="#faf0c8" opacity="0.67"/>
<circle cx="247.4" cy="235.5" r="0.82" fill="#ffe2e0" opacity="0.45"/>
<circle cx="493.8" cy="1166.4" r="1.38" fill="#faf0c8" opacity="0.45"/>
<circle cx="406.3" cy="463.3" r="1.85" fill="#e6a0f8" opacity="0.62"/>
<circle cx="555.0" cy="1037.4" r="1.36" fill="#faf0c8" opacity="0.40"/>
<circle cx="550.0" cy="393.9" r="1.78" fill="#fffefe" opacity="0.46"/>
<circle cx="401.4" cy="863.7" r="1.45" fill="#fffefe" opacity="0.72"/>
<circle cx="505.0" cy="1302.4" r="0.53" fill="#6b90fc" opacity="0.64"/>
<circle cx="341.8" cy="347.3" r="1.47" fill="#fffefe" opacity="0.33"/>
<circle cx="244.6" cy="1152.5" r="0.68" fill="#6b90fc" opacity="0.33"/>
<circle cx="481.9" cy="217.8" r="0.42" fill="#ffe2e0" opacity="0.39"/>
<circle cx="254.1" cy="203.7" r="3.24" fill="#faf0c8" opacity="0.30"/>
<circle cx="287.6" cy="1216.0" r="1.32" fill="#e6a0f8" opacity="0.72"/>
<circle cx="586.5" cy="1164.2" r="2.10" fill="#6b90fc" opacity="0.31"/>
<circle cx="277.3" cy="631.7" r="0.44" fill="#fffefe" opacity="0.46"/>
<circle cx="512.1" cy="739.7" r="1.27" fill="#e6a0f8" opacity="0.26"/>
<circle cx="573.2" cy="658.2" r="2.12" fill="#e6a0f8" opacity="0.66"/>
<circle cx="255.3" cy="482.6" r="1.22" fill="#e6a0f8" opacity="0.30"/>
<circle cx="443.9" cy="603.5" r="2.22" fill="#6b90fc" opacity="0.60"/>
<circle cx="473.3" cy="797.7" r="0.92" fill="#faf0c8" opacity="0.74"/>
<circle cx="335.5" cy="778.6" r="0.60" fill="#e6a0f8" opacity="0.74"/>
<circle cx="522.7" cy="187.5" r="2.37" fill="#fffefe" opacity="0.43"/>
<circle cx="333.0" cy="978.3" r="2.84" fill="#ffe2e0" opacity="0.49"/>
<circle cx="528.1" cy="1172.0" r="2.19" fill="#faf0c8" opacity="0.51"/>
<circle cx="445.5" cy="494.3" r="1.02" fill="#6b90fc" opacity="0.28"/>
<circle cx="460.3" cy="1210.8" r="1.82" fill="#fffefe" opacity="0.46"/>
<circle cx="302.3" cy="931.0" r="0.62" fill="#6b90fc" opacity="0.59"/>
<circle cx="433.7" cy="1148.0" r="0.97" fill="#ffe2e0" opacity="0.49"/>
<circle cx="272.9" cy="675.0" r="1.68" fill="#e6a0f8" opacity="0.63"/>
<circle cx="341.9" cy="476.1" r="2.58" fill="#e6a0f8" opacity="0.60"/>
<circle cx="575.7" cy="397.3" r="1.37" fill="#6b90fc" opacity="0.66"/>
<circle cx="256.1" cy="549.8" r="1.41" fill="#faf0c8" opacity="0.41"/>
<circle cx="294.2" cy="1064.3" r="1.74" fill="#ffe2e0" opacity="0.31"/>
<circle cx="226.7" cy="725.4" r="2.51" fill="#fffefe" opacity="0.55"/>
<circle cx="531.6" cy="1258.7" r="0.78" fill="#faf0c8" opacity="0.58"/>
<circle cx="533.2" cy="153.2" r="2.37" fill="#fffefe" opacity="0.61"/>
<circle cx="389.8" cy="568.6" r="2.02" fill="#ffe2e0" opacity="0.30"/>
<circle cx="332.4" cy="834.0" r="2.32" fill="#e6a0f8" opacity="0.47"/>
<circle cx="231.3" cy="227.9" r="1.23" fill="#e6a0f8" opacity="0.36"/>
<circle cx="299.5" cy="988.3" r="1.97" fill="#e6a0f8" opacity="0.43"/>
<circle cx="527.5" cy="890.1" r="1.65" fill="#e6a0f8" opacity="0.51"/>
<circle cx="384.8" cy="981.8" r="2.25" fill="#6b90fc" opacity="0.66"/>
<circle cx="455.8" cy="372.2" r="0.50" fill="#6b90fc" opacity="0.21"/>
<circle cx="389.7" cy="556.9" r="2.27" fill="#ffe2e0" opacity="0.66"/>
<circle cx="479.1" cy="206.2" r="2.36" fill="#fffefe" opacity="0.72"/>
<circle cx="273.9" cy="525.0" r="2.43" fill="#e6a0f8" opacity="0.42"/>
<circle cx="408.9" cy="356.4" r="1.06" fill="#e6a0f8" opacity="0.59"/>
<circle cx="304.0" cy="1297.2" r="2.14" fill="#ffe2e0" opacity="0.65"/>
<circle cx="306.5" cy="1168.7" r="0.46" fill="#6b90fc" opacity="0.52"/>
<circle cx="455.4" cy="584.5" r="1.83" fill="#fffefe" opacity="0.59"/>
<circle cx="455.1" cy="829.3" r="0.46" fill="#ffe2e0" opacity="0.45"/>
<circle cx="525.8" cy="396.1" r="1.88" fill="#faf0c8" opacity="0.49"/>
<circle cx="576.6" cy="893.4" r="1.05" fill="#ffe2e0" opacity="0.47"/>
<circle cx="496.0" cy="374.9" r="1.81" fill="#fffefe" opacity="0.56"/>
<circle cx="252.8" cy="73.7" r="1.13" fill="#ffe2e0" opacity="0.80"/>
<circle cx="308.4" cy="215.7" r="3.18" fill="#fffefe" opacity="0.33"/>
<circle cx="348.7" cy="184.7" r="0.80" fill="#ffe2e0" opacity="0.53"/>
<circle cx="253.3" cy="316.4" r="0.72" fill="#e6a0f8" opacity="0.74"/>
<circle cx="314.3" cy="1142.1" r="1.58" fill="#faf0c8" opacity="0.71"/>
<circle cx="373.2" cy="854.8" r="2.37" fill="#faf0c8" opacity="0.76"/>
<circle cx="342.5" cy="570.9" r="2.27" fill="#fffefe" opacity="0.20"/>
<circle cx="389.3" cy="771.6" r="2.46" fill="#faf0c8" opacity="0.54"/>
<circle cx="591.3" cy="647.5" r="2.03" fill="#6b90fc" opacity="0.42"/>
<circle cx="426.7" cy="1264.4" r="1.68" fill="#faf0c8" opacity="0.48"/>
<circle cx="300.4" cy="503.7" r="1.47" fill="#6b90fc" opacity="0.23"/>
<circle cx="425.7" cy="606.8" r="2.18" fill="#fffefe" opacity="0.20"/>
<circle cx="490.4" cy="1065.7" r="3.30" fill="#e6a0f8" opacity="0.54"/>
<circle cx="569.9" cy="245.6" r="1.32" fill="#e6a0f8" opacity="0.32"/>
<circle cx="244.7" cy="270.1" r="2.18" fill="#e6a0f8" opacity="0.75"/>
<circle cx="291.4" cy="339.8" r="0.93" fill="#fffefe" opacity="0.64"/>
<circle cx="439.3" cy="1270.7" r="2.26" fill="#faf0c8" opacity="0.69"/>
<circle cx="575.2" cy="1171.6" r="1.59" fill="#e6a0f8" opacity="0.35"/>
<circle cx="592.4" cy="613.0" r="2.40" fill="#faf0c8" opacity="0.62"/>
<circle cx="259.3" cy="512.6" r="0.90" fill="#ffe2e0" opacity="0.38"/>
<circle cx="543.5" cy="643.0" r="0.94" fill="#6b90fc" opacity="0.54"/>
<circle cx="282.6" cy="582.8" r="1.04" fill="#e6a0f8" opacity="0.47"/>
<circle cx="597.8" cy="357.0" r="0.50" fill="#6b90fc" opacity="0.26"/>
<circle cx="393.5" cy="790.4" r="3.38" fill="#e6a0f8" opacity="0.55"/>
<circle cx="457.7" cy="452.5" r="2.06" fill="#ffe2e0" opacity="0.61"/>
<circle cx="386.4" cy="423.0" r="0.50" fill="#e6a0f8" opacity="0.33"/>
<circle cx="441.7" cy="641.3" r="1.53" fill="#6b90fc" opacity="0.68"/>
<circle cx="581.6" cy="731.2" r="1.78" fill="#fffefe" opacity="0.48"/>
<circle cx="416.1" cy="803.3" r="1.93" fill="#6b90fc" opacity="0.49"/>
<circle cx="298.0" cy="374.2" r="0.58" fill="#6b90fc" opacity="0.47"/>
<circle cx="333.2" cy="89.1" r="1.34" fill="#6b90fc" opacity="0.74"/>
<circle cx="324.2" cy="370.6" r="2.23" fill="#6b90fc" opacity="0.39"/>
<circle cx="229.0" cy="345.3" r="1.53" fill="#e6a0f8" opacity="0.80"/>
<circle cx="548.1" cy="1021.2" r="2.07" fill="#faf0c8" opacity="0.71"/>
<circle cx="382.7" cy="444.1" r="2.32" fill="#ffe2e0" opacity="0.36"/>
<circle cx="360.7" cy="1269.1" r="0.89" fill="#faf0c8" opacity="0.40"/>
<circle cx="347.1" cy="1170.6" r="0.50" fill="#ffe2e0" opacity="0.21"/>
<circle cx="444.8" cy="1284.8" r="1.78" fill="#ffe2e0" opacity="0.75"/>
<circle cx="419.6" cy="554.4" r="0.65" fill="#ffe2e0" opacity="0.39"/>
<circle cx="362.2" cy="554.8" r="2.25" fill="#ffe2e0" opacity="0.63"/>
<circle cx="319.1" cy="327.3" r="2.45" fill="#fffefe" opacity="0.56"/>
<circle cx="406.2" cy="807.3" r="1.33" fill="#6b90fc" opacity="0.27"/>
<circle cx="368.1" cy="1269.1" r="1.53" fill="#ffe2e0" opacity="0.57"/>
<circle cx="478.9" cy="589.2" r="1.47" fill="#6b90fc" opacity="0.30"/>
<circle cx="569.6" cy="322.8" r="1.92" fill="#fffefe" opacity="0.35"/>
<circle cx="342.3" cy="976.2" r="2.99" fill="#fffefe" opacity="0.54"/>
<circle cx="575.9" cy="1157.7" r="1.18" fill="#ffe2e0" opacity="0.26"/>
<circle cx="308.1" cy="731.3" r="1.32" fill="#fffefe" opacity="0.50"/>
<circle cx="470.6" cy="100.9" r="0.45" fill="#faf0c8" opacity="0.47"/>
<circle cx="414.6" cy="750.2" r="1.16" fill="#faf0c8" opacity="0.28"/>
<circle cx="395.2" cy="1205.8" r="2.02" fill="#ffe2e0" opacity="0.52"/>
<circle cx="386.1" cy="631.8" r="1.95" fill="#6b90fc" opacity="0.45"/>
<circle cx="405.8" cy="761.7" r="2.13" fill="#faf0c8" opacity="0.35"/>
<circle cx="497.5" cy="956.4" r="1.68" fill="#6b90fc" opacity="0.68"/>
<circle cx="296.9" cy="695.0" r="0.45" fill="#ffe2e0" opacity="0.35"/>
<circle cx="441.2" cy="756.0" r="2.51" fill="#fffefe" opacity="0.72"/>
<circle cx="433.8" cy="427.4" r="2.24" fill="#faf0c8" opacity="0.21"/>
<circle cx="462.4" cy="418.0" r="0.92" fill="#e6a0f8" opacity="0.79"/>
<circle cx="469.5" cy="786.4" r="2.29" fill="#6b90fc" opacity="0.54"/>
<circle cx="333.9" cy="1201.2" r="1.77" fill="#e6a0f8" opacity="0.71"/>
<circle cx="551.3" cy="518.5" r="1.20" fill="#faf0c8" opacity="0.35"/>
<circle cx="221.0" cy="517.7" r="2.52" fill="#fffefe" opacity="0.57"/>
<circle cx="374.9" cy="1135.3" r="2.14" fill="#faf0c8" opacity="0.39"/>
<circle cx="540.0" cy="414.9" r="1.08" fill="#e6a0f8" opacity="0.26"/>
<circle cx="309.3" cy="102.1" r="1.43" fill="#e6a0f8" opacity="0.31"/>
<circle cx="584.5" cy="710.6" r="2.06" fill="#6b90fc" opacity="0.34"/>
<circle cx="257.2" cy="1037.0" r="2.05" fill="#6b90fc" opacity="0.31"/>
<circle cx="254.8" cy="678.2" r="2.02" fill="#faf0c8" opacity="0.34"/>
<circle cx="522.2" cy="91.9" r="0.46" fill="#ffe2e0" opacity="0.56"/>
<circle cx="297.7" cy="886.1" r="1.52" fill="#faf0c8" opacity="0.50"/>
<circle cx="242.4" cy="1254.2" r="2.09" fill="#e6a0f8" opacity="0.24"/>
<circle cx="554.9" cy="757.9" r="1.45" fill="#faf0c8" opacity="0.67"/>
<circle cx="408.8" cy="966.7" r="1.70" fill="#faf0c8" opacity="0.53"/>
<circle cx="273.4" cy="760.4" r="2.52" fill="#ffe2e0" opacity="0.74"/>
<circle cx="520.8" cy="585.0" r="1.89" fill="#fffefe" opacity="0.61"/>
<circle cx="579.9" cy="346.6" r="1.03" fill="#faf0c8" opacity="0.75"/>
<circle cx="236.8" cy="718.6" r="1.99" fill="#faf0c8" opacity="0.31"/>
<circle cx="498.5" cy="783.9" r="0.85" fill="#e6a0f8" opacity="0.49"/>
<circle cx="237.8" cy="266.7" r="3.02" fill="#ffe2e0" opacity="0.57"/>
<circle cx="278.9" cy="1024.8" r="0.84" fill="#6b90fc" opacity="0.64"/>
<circle cx="401.8" cy="447.9" r="1.46" fill="#e6a0f8" opacity="0.40"/>
<circle cx="393.0" cy="262.6" r="2.17" fill="#faf0c8" opacity="0.35"/>
<circle cx="289.1" cy="1194.5" r="0.81" fill="#faf0c8" opacity="0.41"/>
<circle cx="559.1" cy="584.6" r="2.50" fill="#e6a0f8" opacity="0.43"/>
<circle cx="404.5" cy="597.7" r="2.49" fill="#faf0c8" opacity="0.23"/>
<circle cx="570.4" cy="472.0" r="0.97" fill="#faf0c8" opacity="0.68"/>
<circle cx="498.9" cy="135.9" r="2.60" fill="#6b90fc" opacity="0.22"/>
<circle cx="588.6" cy="918.3" r="0.65" fill="#6b90fc" opacity="0.31"/>
<circle cx="518.2" cy="304.6" r="1.42" fill="#fffefe" opacity="0.45"/>
<circle cx="227.7" cy="392.8" r="2.06" fill="#fffefe" opacity="0.69"/>
<circle cx="508.7" cy="838.2" r="2.28" fill="#ffe2e0" opacity="0.34"/>
<circle cx="317.2" cy="973.1" r="1.28" fill="#6b90fc" opacity="0.58"/>
<circle cx="382.8" cy="187.7" r="1.47" fill="#6b90fc" opacity="0.60"/>
<circle cx="512.7" cy="1257.5" r="1.17" fill="#6b90fc" opacity="0.36"/>
<circle cx="565.9" cy="441.8" r="2.22" fill="#e6a0f8" opacity="0.27"/>
<circle cx="413.7" cy="486.5" r="1.68" fill="#e6a0f8" opacity="0.31"/>
<circle cx="248.1" cy="71.9" r="1.68" fill="#faf0c8" opacity="0.52"/>
<circle cx="507.2" cy="418.9" r="1.91" fill="#fffefe" opacity="0.27"/>
<circle cx="308.7" cy="667.9" r="2.12" fill="#faf0c8" opacity="0.63"/>
<circle cx="355.2" cy="1219.7" r="2.57" fill="#e6a0f8" opacity="0.45"/>
<circle cx="360.9" cy="102.9" r="2.11" fill="#faf0c8" opacity="0.41"/>
<circle cx="321.1" cy="504.4" r="1.88" fill="#faf0c8" opacity="0.51"/>
<circle cx="316.5" cy="91.5" r="1.09" fill="#faf0c8" opacity="0.42"/>
<circle cx="561.5" cy="977.4" r="1.91" fill="#faf0c8" opacity="0.54"/>
<circle cx="225.5" cy="1251.7" r="2.33" fill="#6b90fc" opacity="0.24"/>
<circle cx="220.7" cy="1024.5" r="0.52" fill="#6b90fc" opacity="0.45"/>
<circle cx="258.9" cy="655.9" r="2.15" fill="#fffefe" opacity="0.63"/>
<circle cx="494.8" cy="581.9" r="1.64" fill="#e6a0f8" opacity="0.52"/>
<circle cx="524.9" cy="582.7" r="1.45" fill="#e6a0f8" opacity="0.58"/>
<circle cx="505.9" cy="213.3" r="1.37" fill="#faf0c8" opacity="0.58"/>
<circle cx="597.5" cy="273.7" r="1.23" fill="#6b90fc" opacity="0.47"/>
<circle cx="263.2" cy="463.6" r="2.27" fill="#fffefe" opacity="0.20"/>
<circle cx="522.1" cy="743.7" r="1.61" fill="#e6a0f8" opacity="0.76"/>
<circle cx="404.9" cy="835.5" r="1.65" fill="#6b90fc" opacity="0.34"/>
<circle cx="493.3" cy="249.1" r="1.35" fill="#fffefe" opacity="0.37"/>
<circle cx="475.4" cy="958.5" r="0.40" fill="#e6a0f8" opacity="0.71"/>
<circle cx="503.6" cy="481.2" r="2.24" fill="#e6a0f8" opacity="0.59"/>
<circle cx="316.1" cy="57.6" r="1.79" fill="#fffefe" opacity="0.26"/>
<circle cx="410.1" cy="384.5" r="0.71" fill="#e6a0f8" opacity="0.70"/>
<circle cx="455.1" cy="780.5" r="1.95" fill="#fffefe" opacity="0.44"/>
<circle cx="310.8" cy="355.6" r="0.96" fill="#fffefe" opacity="0.79"/>
<circle cx="536.3" cy="449.3" r="1.60" fill="#ffe2e0" opacity="0.64"/>
<circle cx="252.8" cy="384.7" r="2.96" fill="#ffe2e0" opacity="0.55"/>
</g>
<g id="fine-flourishes" fill="none" stroke-linecap="round">
  <path d="M213 340 C118 372 135 433 223 452 C302 464 336 426 353 415" stroke="url(#ribbon)" stroke-width="5" opacity=".83"/>
  <path d="M485 425 C596 385 650 419 640 476" stroke="url(#ribbon)" stroke-width="2" opacity=".7"/>
  <path d="M232 742 C123 821 175 909 268 890" stroke="url(#ribbon)" stroke-width="4" opacity=".8"/>
  <path d="M491 1010 C602 953 681 1087 608 1150" stroke="url(#ribbon)" stroke-width="2.3" opacity=".65"/>
  <path d="M492 1323 C560 1355 634 1328 682 1276" stroke="#ffd7f4" stroke-width="1.3" opacity=".67"/>
</g>
<g id="signature-stars">
<path d="M222 94.2 Q226.8 126.2 257.0 131 Q226.8 135.8 222 167.8 Q217.2 135.8 187.0 131 Q217.2 126.2 222 94.2 Z" fill="#fff0d6" opacity=".92"/>
<circle cx="222" cy="131" r="6.0" fill="#fffdf7"/>
<path d="M176.0 131 H268.0 M222 87.3 V174.7" stroke="#fff0d6" stroke-width=".9" opacity=".45"/>
<path d="M640 262.2 Q643.8 287.2 667.4 291 Q643.8 294.8 640 319.8 Q636.2 294.8 612.6 291 Q636.2 287.2 640 262.2 Z" fill="#b7cfff" opacity=".92"/>
<circle cx="640" cy="291" r="4.7" fill="#fffdf7"/>
<path d="M604.0 291 H676.0 M640 256.8 V325.2" stroke="#b7cfff" stroke-width=".9" opacity=".45"/>
<path d="M201 434.4 Q204.4 456.6 225.3 460 Q204.4 463.4 201 485.6 Q197.6 463.4 176.7 460 Q197.6 456.6 201 434.4 Z" fill="#fff0d6" opacity=".92"/>
<circle cx="201" cy="460" r="4.2" fill="#fffdf7"/>
<path d="M169.0 460 H233.0 M201 429.6 V490.4" stroke="#fff0d6" stroke-width=".9" opacity=".45"/>
<path d="M594 574.6 Q599.0 608.0 630.5 613 Q599.0 618.0 594 651.4 Q589.0 618.0 557.5 613 Q589.0 608.0 594 574.6 Z" fill="#fff0d6" opacity=".92"/>
<circle cx="594" cy="613" r="6.2" fill="#fffdf7"/>
<path d="M546.0 613 H642.0 M594 567.4 V658.6" stroke="#fff0d6" stroke-width=".9" opacity=".45"/>
<path d="M174 835.0 Q177.2 855.9 196.8 859 Q177.2 862.1 174 883.0 Q170.8 862.1 151.2 859 Q170.8 855.9 174 835.0 Z" fill="#b7cfff" opacity=".92"/>
<circle cx="174" cy="859" r="3.9" fill="#fffdf7"/>
<path d="M144.0 859 H204.0 M174 830.5 V887.5" stroke="#b7cfff" stroke-width=".9" opacity=".45"/>
<path d="M610 829.0 Q613.1 849.9 632.8 853 Q613.1 856.1 610 877.0 Q606.9 856.1 587.2 853 Q606.9 849.9 610 829.0 Z" fill="#b7cfff" opacity=".92"/>
<circle cx="610" cy="853" r="3.9" fill="#fffdf7"/>
<path d="M580.0 853 H640.0 M610 824.5 V881.5" stroke="#b7cfff" stroke-width=".9" opacity=".45"/>
<path d="M241 1050.2 Q244.8 1075.2 268.4 1079 Q244.8 1082.8 241 1107.8 Q237.2 1082.8 213.6 1079 Q237.2 1075.2 241 1050.2 Z" fill="#fff0d6" opacity=".92"/>
<circle cx="241" cy="1079" r="4.7" fill="#fffdf7"/>
<path d="M205.0 1079 H277.0 M241 1044.8 V1113.2" stroke="#fff0d6" stroke-width=".9" opacity=".45"/>
<path d="M672 1179.0 Q675.1 1199.8 694.8 1203 Q675.1 1206.2 672 1227.0 Q668.9 1206.2 649.2 1203 Q668.9 1199.8 672 1179.0 Z" fill="#fff0d6" opacity=".92"/>
<circle cx="672" cy="1203" r="3.9" fill="#fffdf7"/>
<path d="M642.0 1203 H702.0 M672 1174.5 V1231.5" stroke="#fff0d6" stroke-width=".9" opacity=".45"/>
<path d="M304 1272.2 Q307.8 1297.2 331.4 1301 Q307.8 1304.8 304 1329.8 Q300.2 1304.8 276.6 1301 Q300.2 1297.2 304 1272.2 Z" fill="#fff0d6" opacity=".92"/>
<circle cx="304" cy="1301" r="4.7" fill="#fffdf7"/>
<path d="M268.0 1301 H340.0 M304 1266.8 V1335.2" stroke="#fff0d6" stroke-width=".9" opacity=".45"/>
<path d="M530 121.4 Q532.3 136.7 546.7 139 Q532.3 141.3 530 156.6 Q527.7 141.3 513.3 139 Q527.7 136.7 530 121.4 Z" fill="#b7cfff" opacity=".92"/>
<circle cx="530" cy="139" r="2.9" fill="#fffdf7"/>
<path d="M508.0 139 H552.0 M530 118.1 V159.9" stroke="#b7cfff" stroke-width=".9" opacity=".45"/>
<path d="M393 706.0 Q396.1 726.9 415.8 730 Q396.1 733.1 393 754.0 Q389.9 733.1 370.2 730 Q389.9 726.9 393 706.0 Z" fill="#fff0d6" opacity=".92"/>
<circle cx="393" cy="730" r="3.9" fill="#fffdf7"/>
<path d="M363.0 730 H423.0 M393 701.5 V758.5" stroke="#fff0d6" stroke-width=".9" opacity=".45"/>
<path d="M539 1138.4 Q541.3 1153.7 555.7 1156 Q541.3 1158.3 539 1173.6 Q536.7 1158.3 522.3 1156 Q536.7 1153.7 539 1138.4 Z" fill="#b7cfff" opacity=".92"/>
<circle cx="539" cy="1156" r="2.9" fill="#fffdf7"/>
<path d="M517.0 1156 H561.0 M539 1135.1 V1176.9" stroke="#b7cfff" stroke-width=".9" opacity=".45"/>
</g>
<g id="petals" fill="#f8bfe9" opacity=".78">
  <path d="M611 526 Q633 519 639 499 Q642 527 615 536Z"/>
  <path d="M165 1051 Q189 1048 193 1025 Q202 1055 178 1061Z"/>
  <path d="M636 1033 Q660 1026 671 1007 Q668 1037 642 1045Z"/>
</g>
</svg>
`;
