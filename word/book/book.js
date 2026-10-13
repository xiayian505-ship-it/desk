"use strict";
/* 開卷有益直式｜獨立使用軍火庫直式完成品。 */
(function (global) {
  const component=global.SlowlyTextGenerator;
  const art=global.SlowlyBookTemplate;
  if (!component?.create || !art?.renderSVG) {
    console.error('開卷有益：直式零件或模板尚未載入。');
    return;
  }
  const W=840, H=1200, MAX=4;
  const arrangements={
    1: [[420,584,396,0]],
    2: [[417,354,316,-2],[424,827,316,2]],
    3: [[420,230,280,-2],[412,601,280,1],[428,965,280,-1]],
    4: [[417,174,248,-3],[429,453,248,1],[408,736,248,-2],[428,1014,248,2]]
  };
  function renderSVG(text,helpers) {
    const places=arrangements[helpers.splitCharacters(text).length].map(([x,y,size,angle])=>({x,y,size,angle}));
    return art.renderSVG(text,helpers,{width:W,height:H,orientation:'vertical',positions:places});
  }
  const instance=component.create({
    maxChars:MAX,
    sourceSize:{width:W,height:H},
    renderSVG,
    presets:{png:{scale:2},cover:{width:700,height:1000,fit:'contain',paddingX:54,paddingY:48}},
    filenames:{
      svg: text=>`${component.fileSafe(text)}_開卷有益.svg`,
      png: text=>`${component.fileSafe(text)}_開卷有益_2x.png`,
      cover: text=>`${component.fileSafe(text)}_角角者書封_700x1000.png`
    }
  });
  global.SlowlyBookArt=Object.freeze({
    MAX,
    characters:component.splitCharacters,
    normalize:instance.normalize,
    generateSVG:instance.generateSVG,
    makeURL:instance.makeURL,
    downloadSVG:instance.downloadSVG,
    downloadPNG: text=>instance.downloadPNG(text,'png'),
    downloadCover:instance.downloadCover
  });
})(window);
