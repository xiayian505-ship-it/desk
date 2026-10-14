"use strict";
/* 煙波浩渺橫式｜獨立使用軍火庫橫式完成品，與直式不互相呼叫。 */
(function (global) {
  const component=global.SlowlyHorizontalTextGenerator;
  const core=global.SlowlyTextGeneratorCore;
  const art=global.SlowlyOceanTemplate;
  if (!component?.create || !core?.splitCharacters || !art?.renderSVG) {
    console.error('煙波浩渺：橫式零件或模板尚未載入。');
    return;
  }
  const W=1200, H=760, MAX=4;
  function renderSVG(text,helpers,layout,animated=false) {
    const slots=layout.slots;
    const size=[0,330,292,253,221][slots.length];
    const places=slots.map((slot,index)=>({
      x:slot.x,
      y:slot.y,
      size,
      angle:[-2,1,-1,2][index]
    }));
    return art.renderSVG(text,helpers,{width:W,height:H,orientation:'horizontal',positions:places,animated});
  }
  const instance=component.create({
    maxChars:MAX,
    sourceSize:{width:W,height:H},
    renderSVG:(text,helpers,layout)=>renderSVG(text,helpers,layout),
    presets:{png:{scale:2},cover:{width:700,height:1000,fit:'contain',paddingX:42,paddingY:68}},
    filenames:{
      svg: text=>`${core.fileSafe(text)}_煙波浩渺_橫式.svg`,
      png: text=>`${core.fileSafe(text)}_煙波浩渺_橫式_2x.png`,
      cover: text=>`${core.fileSafe(text)}_煙波浩渺_橫式_角角者書封_700x1000.png`
    }
  });
  // 共用同一構圖，只有水波位移動畫開關不同。
  const animatedInstance=component.create({
    maxChars:MAX,
    sourceSize:{width:W,height:H},
    renderSVG:(text,helpers,layout)=>renderSVG(text,helpers,layout,true),
    filenames:{svg:text=>`${core.fileSafe(text)}_煙波浩渺_橫式_動態.svg`}
  });
  global.SlowlyOceanHorizontalArt=Object.freeze({
    hasAnimatedSVG:true,
    generateAnimatedSVG:animatedInstance.generateSVG,
    downloadAnimatedSVG:animatedInstance.downloadSVG,
    MAX,
    characters:core.splitCharacters,
    normalize:instance.normalize,
    generateSVG:instance.generateSVG,
    makeURL:instance.makeURL,
    downloadSVG:instance.downloadSVG,
    downloadPNG:text=>instance.downloadPNG(text,'png'),
    downloadCover:instance.downloadCover
  });
})(window);
