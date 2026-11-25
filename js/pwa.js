/* PWA: service worker y botón de instalar. */
(()=>{
let dip=null;
BW.pwa={init(){
  if("serviceWorker" in navigator)addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));
  const b=document.getElementById("instalar");
  addEventListener("beforeinstallprompt",e=>{e.preventDefault();dip=e;b.hidden=false});
  b.addEventListener("click",async()=>{if(!dip)return;dip.prompt();await dip.userChoice;dip=null;b.hidden=true});
  addEventListener("appinstalled",()=>{b.hidden=true});
}};
})();
