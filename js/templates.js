/* Plantillas de la interfaz (el HTML se genera desde aquí). */
(()=>{
const C=BW.cfg;
const I=(id,c="icon")=>`<svg class="${c}"><use href="img/icons.svg#${id}"/></svg>`;
const ext=(r,inner,cls="")=>`<a ${cls?`class="${cls}" `:""}href="${r.url}" target="_blank" rel="noopener" aria-label="${r.nombre}">${inner}</a>`;
const tipos=C.tipos.map(t=>`<button type="button" class="tipo" data-tipo="${t.id}"><span>${t.ico}</span>${t.nombre}</button>`).join("");
BW.tpl={
header:`<div class="bar"><div class="bar-in"><img src="img/brand/logo.png" alt="Logo ${C.nombre}" width="46" height="46"><div><span class="nom">${C.nombre}</span><small>Servicio a domicilio · Preparados al momento</small></div><a class="wa-top" data-wa href="#">${I("walogo")}Escríbenos</a></div></div><nav class="chips" id="chips" aria-label="Categorías"></nav>`,
main:`<section class="banner"><div class="banner-in"><img class="hero" src="img/brand/logo.png" alt="${C.nombre} BW" width="512" height="512" fetchpriority="high"><div class="redes">${C.redes.map(r=>ext(r,I(r.id),"ico")).join("")}<a class="wa-pill" data-wa href="#">${I("walogo")}Escríbenos</a><button id="instalar" class="wa-pill" type="button" style="border-color:var(--oro)" hidden>📲 Instalar app</button></div></div></section>
<section class="pasos"><div class="wrap"><h1>¿Qué se te antoja hoy?</h1><ol><li><b>1</b>Elige tu antojo</li><li><b>2</b>Prepáralo a tu gusto</li><li><b>3</b>Ve a tu carrito y envía por WhatsApp</li></ol><div class="info"><span>🛵 Envío gratis</span><span>🛒 Mínimo $${C.min} a domicilio</span><span>📍 Cobertura 3 km</span><span>📦 Ingredientes aparte en envíos</span></div></div></section><div id="secciones"></div>`,
footer:`<div class="wrap"><div class="foot"><div><h3>${C.nombre}</h3><p>Más sabor, más papas, más BW.<br>Preparados al momento.<br>Puedes apartar tu orden y mandar tu propio repartidor: se la entregamos con los datos que nos des.</p></div><div><h3>Contacto</h3><p>WhatsApp: ${C.waVer}<br>${C.redes.map(r=>`<a href="${r.url}" target="_blank" rel="noopener">${r.txt}</a>`).join("<br>")}</p><div class="social"><a href="https://wa.me/${C.wa}" target="_blank" rel="noopener">${I("wa")}WhatsApp</a>${C.redes.map(r=>`<a href="${r.url}" target="_blank" rel="noopener">${I(r.id)}${r.nombre}</a>`).join("")}</div></div><div><h3>Zona de envío</h3><p>${C.colonias.join(", ")}.<br>Cobertura máxima de 3 km a la redonda · Pedido mínimo $${C.min} · Envío gratis.</p></div></div><div class="legal">© ${C.nombre} · Más sabor, más papas, más BW · v${C.version}</div></div>`,
cartbar:`<button id="barEmpty" class="empty" type="button">🛒 Carrito</button><button id="barGo" class="go" type="button" hidden><span id="barTxt">Ver carrito</span><em id="barN">0</em></button>`,
dialogs:`
<dialog id="cart"><form class="sheet" id="form" autocomplete="off" novalidate>
  <div class="sheet-h"><h3>Tu carrito <small id="folio" class="folio"></small></h3><button class="x" type="button" data-close>✕</button></div>
  <div id="items"></div>
  <div class="tot"><span id="total">Total: $0</span></div><div class="min" id="minHint" hidden></div>
  <div class="field"><label>¿Cómo quieres tu pedido?</label><div class="tipos">${tipos}</div><div class="hint" id="tipoNota"></div></div>
  <div class="field"><label>Tu nombre</label><input id="cliNombre" name="bw-n" placeholder="Ej: Carlos" autocomplete="off" autocapitalize="words"></div>
  <div class="field"><label>WhatsApp (10 dígitos)</label><input id="cliTel" name="bw-t" type="tel" inputmode="numeric" placeholder="Ej: 55 1234 5678" autocomplete="off"></div>
  <div class="field" id="fLugar" hidden><label id="lugarLbl"></label><input id="cliLugar" name="bw-l" autocomplete="off"><div class="hint">Incluye referencias para llegar más rápido</div></div>
  <div class="field"><label>Notas del pedido (opcional)</label><textarea id="notas" name="bw-o" autocomplete="off" placeholder="Ej: salsa aparte, sin ensalada..."></textarea></div>
  <div class="captcha"><span>Confirma: escribe <b>${C.captcha}</b></span><input id="captcha" name="bw-c" placeholder="${C.captcha}" autocomplete="off"></div>
  <input id="honey" type="text" style="position:absolute;left:-9999px;top:-9999px" tabindex="-1" autocomplete="off">
  <div class="alert">Para evitar pedidos falsos, <b>todos los pedidos se confirman por WhatsApp</b>. Debes responder <b>“Confirmo”</b> cuando te contestemos. Pedidos mayores a $200 o clientes nuevos requieren anticipo del 50% con link de Mercado Pago. Sin confirmación no se cocina.</div>
  <button id="send" class="send" type="button">${I("wa")}Enviar por WhatsApp</button>
  <p class="fine">Te llegará con folio y datos completos. Si no respondes la confirmación, tu pedido se cancela.</p>
  <p class="privacidad">🔒 No guardamos tus datos: se borran al enviar o a los 10 min sin actividad.</p>
  <button id="vaciar" class="vaciar" type="button">Vaciar pedido y borrar mis datos</button>
</form></dialog>
<dialog id="lb"><div class="sheet"><div class="sheet-h"><h3 id="lbName"></h3><button class="x" type="button" data-close>✕</button></div><img id="lbImg" alt=""></div></dialog>
<dialog id="addModal"><div class="sheet">
  <div class="sheet-h"><h3 id="addTitle">Elige</h3><button class="x" type="button" data-close>✕</button></div>
  <p class="nota">Tú eliges cada ingrediente: empiezas de cero y armas tu preparación.</p>
  <p class="paso" id="addVarsT" hidden></p>
  <div id="addVars" class="combo-list"></div>
  <div id="addOpts"></div>
  <details class="cond" id="addCond"><summary>Condiciones de este producto</summary><ul id="addCondL"></ul></details>
  <div class="addbar">
    <div class="preview" id="addPrev"></div>
    <div class="qty-row"><span>¿Cuántos?</span><div class="qty"><button type="button" data-q="-1" aria-label="Menos">−</button><input id="qty" type="number" inputmode="numeric" min="1" max="${C.max}" value="1" autocomplete="off"><button type="button" data-q="1" aria-label="Más">+</button></div><div class="qq"><button type="button" data-q="5">+5</button><button type="button" data-q="10">+10</button></div></div>
    <p class="hint" id="addHint"></p>
    <button id="addGo" class="add" type="button" style="width:100%;min-height:50px;margin-top:8px">Agregar al carrito</button>
    <div class="row2"><button id="addMore" type="button">+ Agregar y preparar otro distinto</button><button type="button" data-close>Cancelar</button></div>
  </div>
</div></dialog>`
};
})();
