/* Privacidad: los datos del cliente viven solo en memoria y se borran solos. */
(()=>{
const C=BW.cfg;let t=null;
const arm=()=>{clearTimeout(t);t=setTimeout(()=>BW.ui.reset(true),C.inactividadMs)};
BW.privacy={init(){
  ["bwfolio","bwlast"].forEach(k=>{try{localStorage.removeItem(k)}catch(_){}}); /* limpia restos de la versión anterior */
  ["click","input","keydown","touchstart"].forEach(ev=>addEventListener(ev,arm,{passive:true}));
  addEventListener("pagehide",()=>BW.ui.reset(true));
  arm();
}};
})();
