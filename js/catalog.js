/* Catálogo: productos, tamaños, precios y opciones. Para cambiar precios o productos edita solo este archivo. */
(()=>{
const L=s=>s.split(",").map(x=>{const[a,b]=x.split(":");return[a,+b||0]});
const SAL=L("BBQ,Ranch,Honey tocino,Mango habanero:1,Piña habanero:1,Mandarina habanero:1,Maracuyá habanero:1,Tamarindo morita:2,Blueberry morita:2,Frutos rojos:1,Búfalo:2,Doritos flamin Hot:2,Takis fuego:2");
const CON=L("Natural,Adobo,Habanero pimienta,Queso");
const MAR=L("Pimienta limón,Búfalo");
const PREP=L("Crema,Lechera,Chocolate líquido,Mermelada de fresa,Mermelada de frutos rojos,Granillo de chocolate,Granillo de colores");
const SAB=L("Jamaica,Horchata,Limón");
const SZ=["Chica","Grande","Familiar"];
const sal=n=>({t:`Salsa adicional (elige ${n})`,l:SAL,n});
const tam=(id,nom,pr,pz,d,ex=[])=>SZ.map((s,i)=>({id:id+i,nombre:`${nom} ${s} · ${pz[i]} pzas`,precio:pr[i],d,o:[...ex,sal(i+1)]}));
const TRAD="Ensalada + preparación tradicional (queso, catsup y salsa)";
const variantes={
"Alitas":tam("al","Alitas",[80,150,210],[6,12,18],"Ensalada + preparación tradicional (Maggi, Valentina, Tajín y limón)"),
"Boneless":tam("bo","Boneless",[110,200,285],[10,20,30],"Marinado a elegir + ensalada",[{t:"Marinado (elige 1)",l:MAR,n:1}]),
"Nuggets":tam("nu","Nuggets",[80,150,210],[15,30,45],TRAD),
"Tenders":tam("te","Tenders",[110,200,285],[6,12,18],TRAD),
"Dedos de queso":tam("dq","Dedos de queso mozzarella",[110,200,285],[10,20,30],TRAD),
"Aros de cebolla":tam("ac","Aros de cebolla",[60,110,150],[15,30,45],TRAD),
"Salchipulpos":tam("sp","Salchipulpos",[55,100,135],[16,32,48],TRAD),
"Papas a la francesa":SZ.map((s,i)=>({id:"pf"+i,nombre:`Papas a la francesa ${s}`,precio:[55,100,135][i],d:"Preparación tradicional: queso, catsup y salsa",o:[{t:`Condimentador (elige ${i+1})`,l:CON,n:i+1}]})),
"Botanas BW":[["Papas de hojuela · Vaso",30],["Papas de hojuela · Bolsa",50],["Papatinas · Vaso",35],["Papatinas · Bolsa",60]].map(([n,p],i)=>({id:"bt"+i,nombre:n,precio:p,d:"Maggi, Valentina y Tajín + 1 condimentador",o:[{t:"Condimentador (elige 1)",l:CON,n:1}]})),
"Combos BW":[["Alas","6 pzas de alas",125],["Nuggets","15 pzas de nuggets",125],["Boneless","10 pzas de boneless",155,1],["Tender","6 pzas de tender",155],["Dedos de queso","10 dedos de queso mozzarella",155],["Aros de cebolla","15 aros de cebolla",105],["Salchipulpos","16 salchipulpos",100]].map(([n,d,p,m],i)=>({id:"cb"+i,nombre:`Combo ${n}`,precio:p,d:`${d} + papas a la francesa chica + ensalada`,o:[...(m?[{t:"Marinado (elige 1)",l:MAR,n:1}]:[]),sal(1),{t:"Condimentador para tus papas (elige 1)",l:CON,n:1}]})),
"Taco Bony":[["Pastor",18,80,140],["Suadero",22,100,180],["Longaniza",18,80,140],["Campechano (suadero y longaniza)",20,90,160]].flatMap(([n,a,b,c],i)=>[["1 taco",a],["Orden de 5",b],["Orden de 10",c]].map(([t,p],j)=>({id:`tb${i}${j}`,nombre:`Tacos de ${n} · ${t}`,precio:p,d:"Incluye verdura y salsa"}))),
"Postres y bebidas":[
 ...SZ.map((s,i)=>({id:"pl"+i,nombre:`Plátanos fritos ${s}`,precio:[60,110,150][i],d:"Elige tu preparación",o:[{t:"Preparación (elige las que quieras)",l:PREP,n:7,min:1}]})),
 {id:"fc",nombre:"Fresas con crema",precio:75,d:"Incluye crema, lechera, chocolate líquido y granillo"},
 {id:"fr",nombre:"Frutos rojos con crema",precio:85,d:"Incluye crema, lechera, chocolate líquido y granillo"},
 {id:"ck",nombre:"Cheesecake de zarzamora",precio:50,d:"Postre individual"},
 {id:"ca",nombre:"Carlotta de limón",precio:50,d:"Postre individual"},
 ...[["1 litro",25],["1.5 litros",35]].map(([l,p],i)=>({id:"bb"+i,nombre:`Bebida ${l}`,precio:p,d:"Jamaica, horchata o limón",o:[{t:"Sabor (elige 1)",l:SAB,n:1}]}))
]};
const cats=[
 {id:"combos",nombre:"Combos BW",nota:"Todo tu antojo en una sola orden",promos:[["combos.jpg","Combos BW"]]},
 {id:"pollo",nombre:"Alitas y pollo",nota:"Preparados al momento",promos:[["alitas.jpg","Alitas"],["boneless.jpg","Boneless"],["tenders.jpg","Tenders"],["nuggets.jpg","Nuggets"]]},
 {id:"botanas",nombre:"Botanas",nota:"Crujientes y doraditas",promos:[["dedos-de-queso.jpg","Dedos de queso"],["aros-de-cebolla.jpg","Aros de cebolla"],["salchipulpos.jpg","Salchipulpos"],["papas-francesa.jpg","Papas a la francesa"],["botanas.jpg","Botanas BW"]]},
 {id:"tacos",nombre:"Taco Bony",nota:"Tacos con todo el sabor",promos:[["taco-bony.jpg","Taco Bony"]]},
 {id:"postres",nombre:"Postres y bebidas",nota:"El final perfecto para tu antojo",promos:[["postres.jpg","Postres y bebidas"]]}
];
BW.catalog={variantes,cats};
})();
