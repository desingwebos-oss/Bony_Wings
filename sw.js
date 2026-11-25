const V="bw-v4";
const CORE=["./","index.html","manifest.webmanifest","css/main.css","css/order.css","css/theme-dark.css","js/config.js","js/catalog.js","js/cart.js","js/templates.js","js/ui.js","js/privacy.js","js/pwa.js","js/main.js","img/icons.svg","img/brand/logo.png","img/brand/icon-192.png","img/brand/icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
/* Solo se guardan archivos estáticos de la app; nunca datos de clientes. */
self.addEventListener("fetch",e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=="GET"||u.origin!==location.origin)return;
  if(r.mode==="navigate"){
    e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(V).then(c=>c.put("index.html",cp));return res}).catch(()=>caches.match("index.html")));
    return;
  }
  e.respondWith(caches.match(r).then(h=>{
    const net=fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp))}return res}).catch(()=>h);
    return h||net;
  }));
});
