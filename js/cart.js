/* Carrito en memoria (nunca se guarda en el navegador) y armado del mensaje de WhatsApp. */
(()=>{
const C=BW.cfg,items=new Map();let folio=null;
const rnd=()=>`${C.prefijo}-${Math.floor(1000+Math.random()*9000)}`;
const vals=()=>[...items.values()];
const total=()=>vals().reduce((a,v)=>a+v.q*v.precio,0);
BW.cart={
  items,total,
  get folio(){return folio||(folio=rnd())},
  renew(){folio=rnd()},
  count:()=>vals().reduce((a,v)=>a+v.q,0),
  qtyOf:b=>vals().filter(v=>v.base===b).reduce((a,v)=>a+v.q,0),
  add(v,sel,q,base){const k=v.nombre+"__"+sel,c=items.get(k);items.set(k,{n:v.nombre,sel,q:Math.min(C.max,(c?c.q:0)+q),base,precio:v.precio})},
  change(k,d){const c=items.get(k);if(!c)return;const q=Math.min(C.max,c.q+d);q>0?items.set(k,{...c,q}):items.delete(k)},
  removeOne(b){const e=[...items.entries()].find(([,v])=>v.base===b);if(e)BW.cart.change(e[0],-1)},
  clear(){items.clear()},
  mensaje(d){
    const t=C.tipos.find(x=>x.id===d.tipo);
    const lista=vals().map(v=>`• ${v.q} x ${v.n} — $${v.q*v.precio}`+(v.sel?"\n"+v.sel.split(" · ").map(s=>"   ↳ "+s).join("\n"):"")).join("\n");
    const lugar=d.tipo==="domicilio"?`\n📍 Dirección: ${d.lugar}`:d.tipo==="punto"?`\n📍 Punto de encuentro: ${d.lugar}`:"";
    return `🍗 *BONY WINGS* 🍗\nFolio: *${BW.cart.folio}*\n\nHola, quiero hacer un pedido:\n\n${lista}\n\n💰 *Total: $${total()}*\n\n🧾 Tipo: *${t.nombre}*\n👤 Nombre: ${d.nombre}\n📱 WhatsApp: ${d.tel}${lugar}${d.notas?`\n📝 Notas: ${d.notas}`:""}\n\n✅ Confirmo pedido real.`;
  }
};
})();
