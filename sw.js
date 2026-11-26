/* Service worker: siempre intenta traer la versión nueva; el caché solo sirve sin internet. */
const V="bw-v6";
const CORE=["./","index.html","manifest.webmanifest","css/main.css","css/order.css","css/theme-dark.css","js/config.js","js/catalog.js","js/cart.js","js/templates.js","js/ui.js","js/privacy.js","js/pwa.js","js/main.js","img/icons.svg","img/brand/logo.png","img/brand/icon-192.png","img/brand/icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE.map(u=>new Request(u,{cache:"reload"})))).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("message",e=>{if(e.data==="skip")self.skipWaiting()});
/* Solo se guardan archivos estáticos de la app; nunca datos de clientes. */
self.addEventListener("fetch",e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=="GET"||u.origin!==location.origin)return;
  e.respondWith(
    fetch(r,{cache:"no-cache"}).then(res=>{
      if(res.ok){const cp=res.clone();caches.open(V).then(c=>c.put(r.mode==="navigate"?"index.html":r,cp))}
      return res;
    }).catch(()=>caches.match(r.mode==="navigate"?"index.html":r).then(h=>h||Response.error()))
  );
});
