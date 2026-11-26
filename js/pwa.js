/* PWA: service worker, actualización forzada y botón de instalar. */
(()=>{
let dip=null,pend=false,refreshing=false;
BW.pwa={
  /* Recarga para aplicar una versión nueva, solo si no hay un pedido a medias. */
  aplicar(){if(!pend||refreshing||BW.cart.count())return;refreshing=true;location.reload()},
  init(){
    if("serviceWorker" in navigator){
      const had=!!navigator.serviceWorker.controller;
      navigator.serviceWorker.addEventListener("controllerchange",()=>{if(!had||refreshing)return;pend=true;BW.pwa.aplicar()});
      addEventListener("load",()=>navigator.serviceWorker.register("sw.js",{updateViaCache:"none"}).then(reg=>{
        const chk=()=>reg.update().catch(()=>{});
        chk();setInterval(chk,30*60*1000);
        document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible")chk()});
      }).catch(()=>{}));
    }
    const b=document.getElementById("instalar");
    addEventListener("beforeinstallprompt",e=>{e.preventDefault();dip=e;b.hidden=false});
    b.addEventListener("click",async()=>{if(!dip)return;dip.prompt();await dip.userChoice;dip=null;b.hidden=true});
    addEventListener("appinstalled",()=>{b.hidden=true});
  }
};
})();
