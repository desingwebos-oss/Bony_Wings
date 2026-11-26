/* Interfaz: pintar menú, ventana de agregar (con cantidad), carrito, tipo de pedido y envío por WhatsApp. */
(()=>{
const C=BW.cfg,T=BW.tpl,cart=BW.cart,cat=BW.catalog,$=id=>document.getElementById(id);
const IMG={};cat.cats.forEach(c=>c.promos.forEach(([f,n])=>IMG[n]="img/menu/"+f));
const ARROW=d=>`<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg>`;
const wa=t=>`https://wa.me/${C.wa}?text=${encodeURIComponent(t)}`;
const ctl=n=>{const q=cart.qtyOf(n);return q?`<div class="step"><button type="button" data-a="dec" data-n="${n}">−</button><span>${q}</span><button type="button" data-a="inc" data-n="${n}">+</button></div>`:`<button class="add" type="button" data-a="inc" data-n="${n}">👨‍🍳 Prepáralo a tu gusto</button>`};
let tipo=null,promo=null,vars=[],cur=null,lastSend=0;

function mount(){
  $("top").innerHTML=T.header;$("main").innerHTML=T.main;$("foot").innerHTML=T.footer;
  $("cartbar").innerHTML=T.cartbar;$("dialogs").innerHTML=T.dialogs;
  $("chips").innerHTML=cat.cats.map(c=>`<a class="chip" href="#${c.id}" data-id="${c.id}"><img src="img/menu/${c.promos[0][0]}" alt="" width="36" height="36">${c.nombre}</a>`).join("");
  $("secciones").innerHTML=cat.cats.map(c=>`
<section class="sec" id="${c.id}">
 <div class="sec-head"><div><h2>${c.nombre}</h2><p class="nota">${c.nota}</p></div>
  <div class="arrows"><button type="button" data-dir="-1">${ARROW("M15 5l-7 7 7 7")}</button><button type="button" data-dir="1">${ARROW("M9 5l7 7-7 7")}</button></div></div>
 <div class="rail">${c.promos.map(([f,n])=>`
  <article class="card"><button class="poster" type="button" data-zoom="${n}"><img src="img/menu/${f}" alt="${n}" width="800" height="1200" loading="lazy"></button>
   <div class="cap"><b>${n}</b><div class="ctl" data-n="${n}">${ctl(n)}</div></div></article>`).join("")}</div>
</section>`).join("");
  document.querySelectorAll("[data-wa]").forEach(a=>a.href=wa("Hola, Bony Wings 👋 Quiero hacer un pedido."));
  setTipo(null);
}

function sync(){
  const n=cart.count(),tot=cart.total();
  document.querySelectorAll(".ctl[data-n]").forEach(e=>e.innerHTML=ctl(e.dataset.n));
  $("barGo").hidden=!n;$("barEmpty").hidden=!!n;
  $("barTxt").textContent=n?`Ver carrito · $${tot}`:"Ver carrito";$("barN").textContent=n||"";
  $("items").innerHTML=[...cart.items].map(([k,v])=>`<div class="item"><img src="${IMG[v.base]||"img/brand/logo.png"}" alt=""><div style="flex:1"><b>${v.n}</b>${v.sel?`<small style="display:block;color:var(--gris)">${v.sel}</small>`:""}<span style="font-weight:700;color:var(--rojo)">$${v.q*v.precio}</span></div><div class="ctl"><div class="step"><button type="button" data-a="dec" data-k="${k}">−</button><span>${v.q}</span><button type="button" data-a="inc" data-k="${k}">+</button></div></div></div>`).join("")||"<p>Tu pedido está vacío.</p>";
  $("total").textContent=`Total: $${tot}`;$("folio").textContent=cart.folio;
  const falta=C.min-tot,m=$("minHint");m.hidden=!(n&&tipo==="domicilio"&&falta>0);m.textContent=`Pedido mínimo para envío a domicilio: $${C.min}. Te faltan $${falta}.`;
  if(!n&&$("cart").open)$("cart").close();
}

function setTipo(id){
  tipo=id;const t=C.tipos.find(x=>x.id===id);
  document.querySelectorAll(".tipo").forEach(b=>b.classList.toggle("on",b.dataset.tipo===id));
  $("tipoNota").textContent=t?t.nota:"Elige cómo quieres recibir tu pedido";
  const f=$("fLugar");f.hidden=!(t&&t.lugar);
  if(t&&t.lugar){$("lugarLbl").textContent=t.lugar;$("cliLugar").placeholder=t.ph}
  sync();
}

/* Borra todo dato del cliente (formulario, tipo y, si full, también el carrito). Nada se guarda en el navegador. */
function reset(full){
  ["cliNombre","cliTel","cliLugar","notas","captcha","honey"].forEach(id=>{const e=$(id);if(e)e.value=""});
  if(full){cart.clear();cart.renew();if($("cart").open)$("cart").close()}
  setTipo(null);
  if(full&&BW.pwa)setTimeout(BW.pwa.aplicar,300);
}

/* ---- Ventana de preparación: tamaño + ingredientes (desde cero) + cantidad ---- */
const qty=()=>Math.max(1,Math.min(C.max,parseInt($("qty").value)||1));
const gs=()=>cur&&cur.o?cur.o:[];
const short=g=>g.s||g.t;
const cap=t=>t.charAt(0).toUpperCase()+t.slice(1);
const checked=gi=>[...$("addOpts").querySelectorAll(`input[data-g="${gi}"]:checked`)].map(x=>x.value);
const extra=()=>gs().reduce((a,g,gi)=>a+(g.x?Math.max(0,checked(gi).length-g.n)*g.x:0),0);
const parts=()=>gs().map((g,gi)=>{const c=checked(gi);
  if(!c.length)return(g.min||0)>0?null:`Sin ${short(g).toLowerCase()}`;
  return g.l.length===1?cap(short(g)):`${cap(short(g))}: ${c.join(", ")}`}).filter(Boolean);
const groups=v=>{const off=vars.length>1?2:1;return(v.o||[]).map((g,gi)=>{
  const min=g.min||0,sub=min>0?`Obligatorio: elige ${min===g.n?g.n:`de ${min} a ${g.n}`}`:(g.l.length===1?"Ponla o no, tú decides":g.n>=g.l.length?"Elige los que quieras, o ninguno":`Hasta ${g.n}, o ninguno`)+(g.x?` · extra +$${g.x} c/u`:"");
  return `<div class="grp"><div class="grp-h"><span class="pn">${gi+off}</span><b>${g.e||""} ${g.t}</b><em class="cnt" data-c="${gi}">0 / ${g.n}</em></div><div class="grp-sub">${sub}</div><div class="salsa-list">`
   +g.l.map(([a,h])=>`<label class="salsa-item"><input type="checkbox" data-g="${gi}" value="${a}"><span>${a}${h?" "+"🔥".repeat(h):""}</span></label>`).join("")
   +`</div>${g.casa?`<button class="casa" type="button" data-casa="${gi}">${g.ct||"Poner la de la casa"}</button>`:""}</div>`}).join("")};
function upd(){
  gs().forEach((g,gi)=>{const e=document.querySelector(`[data-c="${gi}"]`);if(e)e.textContent=`${checked(gi).length} / ${g.n}`});
  const ex=extra(),p=parts();
  $("addGo").textContent=cur?`Agregar al carrito · $${(cur.precio+ex)*qty()}`:"Elige una opción";
  $("addPrev").innerHTML=cur?`<b>👨‍🍳 ${cur.nombre}</b><br>${p.length?p.join(" · "):"Tal cual, sin preparación extra"}${ex?`<br><b>+$${ex} por extras (c/u)</b>`:""}`:"Elige primero una opción 👆";
  $("addHint").textContent=cur&&p.length&&qty()>1?"La preparación aplica a todas las piezas. Usa “preparar otro distinto” si quieres variar.":"";
}
function showOpts(){$("addOpts").innerHTML=cur?groups(cur):"";upd()}
function openAdd(n){
  promo=n;vars=cat.variantes[n];cur=vars.length===1?vars[0]:null;const m=cat.meta[n]||{};
  $("addTitle").textContent=`👨‍🍳 ${n}`;
  const t=$("addVarsT");t.hidden=vars.length===1;t.innerHTML=`<span class="pn">1</span>${m.p1||"Elige tu tamaño"}`;
  const l=$("addVars");l.hidden=vars.length===1;
  l.innerHTML=vars.map(v=>`<button class="combo-item" type="button" data-vid="${v.id}"><b>${v.nombre}</b><span class="precio">$${v.precio}</span><small>${v.d||""}</small></button>`).join("");
  $("addCondL").innerHTML=(m.c||[]).map(x=>`<li>${x}</li>`).join("");$("addCond").hidden=!(m.c&&m.c.length);$("addCond").open=false;
  $("qty").value=1;showOpts();$("addModal").showModal();
}
function pickVar(id){
  cur=vars.find(v=>v.id===id)||null;
  document.querySelectorAll("#addVars .combo-item").forEach(b=>b.classList.toggle("on",b.dataset.vid===id));
  showOpts();if(cur&&cur.o)$("addOpts").scrollIntoView({behavior:"smooth",block:"nearest"});
}
function addGo(){
  if(!cur){alert("Elige una opción");return false}
  for(let gi=0;gi<gs().length;gi++){const g=cur.o[gi],m=g.min||0;
    if(checked(gi).length<m){alert(`${g.t}: ${m===g.n?"elige "+g.n:"elige al menos "+m}`);return false}}
  const ex=extra(),p=parts();if(ex)p.push(`Extras: +$${ex} c/u`);
  cart.add({...cur,precio:cur.precio+ex},p.join(" · "),qty(),promo);sync();return true;
}
function otro(){
  if(!addGo())return;
  $("addOpts").querySelectorAll("input").forEach(i=>{i.checked=false;i.closest("label").classList.remove("on")});
  $("qty").value=1;upd();$("addHint").textContent="✔ Agregado al carrito. Prepara el siguiente.";
  $("addOpts").scrollIntoView({behavior:"smooth",block:"start"});
}

/* ---- Envío por WhatsApp (el mensaje se arma solo al momento de enviar) ---- */
function enviar(){
  if($("honey").value)return;
  const d={tipo,nombre:$("cliNombre").value.trim(),tel:$("cliTel").value.replace(/\D/g,""),lugar:$("cliLugar").value.trim(),notas:$("notas").value.trim()};
  if(!d.tipo)return alert("Elige cómo quieres tu pedido");
  if(!d.nombre||d.tel.length<10)return alert("Escribe tu nombre y tu WhatsApp de 10 dígitos");
  if(d.tipo!=="tienda"&&!d.lugar)return alert(d.tipo==="domicilio"?"Escribe tu dirección completa":"Escribe el punto de encuentro");
  if($("captcha").value.trim().toUpperCase()!==C.captcha)return alert(`Escribe ${C.captcha}`);
  if(!cart.count())return alert("Agrega algo a tu pedido");
  if(d.tipo==="domicilio"&&cart.total()<C.min)return alert(`El pedido mínimo para envío a domicilio es de $${C.min}`);
  if(Date.now()-lastSend<C.esperaMs)return alert("Espera 3 minutos para enviar otro pedido");
  const a=document.createElement("a");a.href=wa(cart.mensaje(d));a.target="_blank";a.rel="noopener";
  document.body.appendChild(a);a.click();a.remove();
  lastSend=Date.now();reset(true);
}

function bind(){
  $("form").addEventListener("submit",e=>e.preventDefault());
  document.addEventListener("click",e=>{
    const t=e.target;let b;
    if(b=t.closest("[data-a]")){
      const k=b.dataset.k;
      if(k){cart.change(k,b.dataset.a==="inc"?1:-1);sync();return}
      if(b.dataset.a==="inc"){openAdd(b.dataset.n);return}
      cart.removeOne(b.dataset.n);sync();return;
    }
    if(b=t.closest("[data-zoom]")){const n=b.dataset.zoom;$("lbName").textContent=n;$("lbImg").src=IMG[n];$("lbImg").alt=n;$("lb").showModal();return}
    if(b=t.closest("[data-close]")){b.closest("dialog").close();return}
    if(t.tagName==="DIALOG"){t.close();return}
    if(t.closest("#barGo")){$("cart").showModal();return}
    if(b=t.closest("#addVars .combo-item")){pickVar(b.dataset.vid);return}
    if(b=t.closest("[data-q]")){$("qty").value=Math.max(1,Math.min(C.max,qty()+(+b.dataset.q)));upd();return}
    if(t.closest("#addGo")){if(addGo())$("addModal").close();return}
    if(t.closest("#addMore")){otro();return}
    if(b=t.closest("[data-casa]")){const g=cur.o[+b.dataset.casa];$("addOpts").querySelectorAll(`input[data-g="${b.dataset.casa}"]`).forEach(i=>{i.checked=g.casa.includes(i.value);i.closest("label").classList.toggle("on",i.checked)});upd();return}
    if(b=t.closest(".tipo")){setTipo(b.dataset.tipo);return}
    if(t.closest("#send")){enviar();return}
    if(t.closest("#vaciar")){reset(true)}
  });
  document.addEventListener("change",e=>{
    const i=e.target;if(!i.matches("#addOpts input"))return;
    const g=cur.o[+i.dataset.g],all=[...$("addOpts").querySelectorAll(`input[data-g="${i.dataset.g}"]`)],mx=g.x?g.n+6:g.n;
    if(all.filter(x=>x.checked).length>mx){
      if(mx===1)all.forEach(x=>{if(x!==i){x.checked=false;x.closest("label").classList.remove("on")}});
      else{i.checked=false;alert(`Máximo ${mx}`);return}
    }
    i.closest("label").classList.toggle("on",i.checked);upd();
  });
  $("qty").addEventListener("input",upd);
}
BW.ui={mount,bind,sync,reset,setTipo};
})();
