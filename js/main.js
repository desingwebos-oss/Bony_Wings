/* Arranque de la app. */
BW.ui.mount();BW.ui.bind();BW.privacy.init();BW.pwa.init();
const $=id=>document.getElementById(id);
document.querySelectorAll(".arrows button").forEach(b=>b.addEventListener("click",()=>{
  const r=b.closest(".sec").querySelector(".rail");r.scrollBy({left:b.dataset.dir*(r.querySelector(".card").offsetWidth+14),behavior:"smooth"})}));
const links=[...$("chips").children];
const io=new IntersectionObserver(es=>es.forEach(e=>{
  if(!e.isIntersecting)return;
  links.forEach(l=>l.classList.toggle("on",l.dataset.id===e.target.id));
  const on=$("chips").querySelector(".on");if(on)$("chips").scrollTo({left:on.offsetLeft-16,behavior:"smooth"});
}),{rootMargin:"-30% 0px -60% 0px"});
document.querySelectorAll(".sec").forEach(s=>io.observe(s));
