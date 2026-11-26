/* Catálogo: productos, tamaños, precios, ingredientes y condiciones. Para cambiar precios o productos edita solo este archivo.
   Cada producto se arma "desde cero": todos los ingredientes son opcionales (salvo el sabor de las bebidas). */
(()=>{
const X=BW.cfg.extra||{};
const L=s=>s.split(",").map(x=>{const[a,b]=x.split(":");return[a,+b||0]});
const SAL=L("BBQ,Ranch,Honey tocino,Mango habanero:1,Piña habanero:1,Mandarina habanero:1,Maracuyá habanero:1,Tamarindo morita:2,Blueberry morita:2,Frutos rojos:1,Búfalo:2,Doritos flamin Hot:2,Takis fuego:2");
const CON=L("Natural,Adobo,Habanero pimienta,Queso");
const MAR=L("Pimienta limón,Búfalo");
const SAB=L("Jamaica,Horchata,Limón");
const SZ=["Chica","Grande","Familiar"];
/* Grupos de ingredientes: t título, s nombre corto, e emoji, l lista, n máximo incluido, min mínimo, x precio por extra, casa = la de la casa */
const sal=n=>({t:"Salsas adicionales",s:"salsa adicional",e:"🌶️",l:SAL,n,x:X.salsa||0});
const con=(n,t="Condimentador")=>({t:n>1?t+"es":t,s:"condimentador",e:"🧂",l:CON,n,x:X.condimentador||0});
const ens={t:"Ensalada",s:"ensalada",e:"🥬",l:[["Cama de lechuga y zanahoria",0]],n:1};
const qcs=(t="Preparación tradicional")=>({t,s:t.toLowerCase(),e:"🧀",l:L("Queso,Catsup,Salsa"),n:3,casa:["Queso","Catsup","Salsa"]});
const mvtl={t:"Preparación tradicional",s:"preparación tradicional",e:"🧂",l:L("Maggi,Valentina,Tajín,Limón"),n:4,casa:["Maggi","Valentina","Tajín","Limón"]};
const mar={t:"Marinado",s:"marinado",e:"🔥",l:MAR,n:1};
const s1=n=>`Incluye hasta ${n} salsa${n>1?"s":""} adicional${n>1?"es":""}`;
const tam=(id,nom,pr,pz,gr)=>SZ.map((s,i)=>({id:id+i,nombre:`${nom} ${s} · ${pz[i]} pzas`,precio:pr[i],d:s1(i+1),o:[...gr,sal(i+1)]}));
const topp={t:"Cubierta",s:"cubierta",e:"🍫",l:L("Crema,Lechera,Chocolate líquido"),n:3};
const gran={t:"Granillo",s:"granillo",e:"✨",l:L("De chocolate,De colores"),n:1};
const incl={...topp,t:"Preparación incluida",s:"preparación",casa:["Crema","Lechera","Chocolate líquido"],ct:"Poner toda la incluida"};

const variantes={
"Alitas":tam("al","Alitas",[80,150,210],[6,12,18],[ens,mvtl]),
"Boneless":tam("bo","Boneless",[110,200,285],[10,20,30],[mar,ens]),
"Nuggets":tam("nu","Nuggets",[80,150,210],[15,30,45],[ens,qcs()]),
"Tenders":tam("te","Tenders",[110,200,285],[6,12,18],[ens,qcs()]),
"Dedos de queso":tam("dq","Dedos de queso mozzarella",[110,200,285],[10,20,30],[ens,qcs()]),
"Aros de cebolla":tam("ac","Aros de cebolla",[60,110,150],[15,30,45],[ens,qcs()]),
"Salchipulpos":tam("sp","Salchipulpos",[55,100,135],[16,32,48],[ens,qcs()]),
"Papas a la francesa":SZ.map((s,i)=>({id:"pf"+i,nombre:`Papas a la francesa ${s}`,precio:[55,100,135][i],d:`Incluye hasta ${i+1} condimentador${i?"es":""}`,o:[qcs(),con(i+1)]})),
"Botanas BW":[["Papas de hojuela · Vaso",30],["Papas de hojuela · Bolsa",50],["Papatinas · Vaso",35],["Papatinas · Bolsa",60]].map(([n,p],i)=>({id:"bt"+i,nombre:n,precio:p,d:"Incluye hasta 1 condimentador",o:[{t:"Preparación",s:"preparación",e:"🧂",l:L("Maggi,Valentina,Tajín"),n:3,casa:["Maggi","Valentina","Tajín"]},con(1)]})),
"Combos BW":[["Alas","6 pzas de alas",125,[ens,qcs()]],["Nuggets","15 pzas de nuggets",125,[ens,qcs()]],["Boneless","10 pzas de boneless",155,[mar,ens]],["Tender","6 pzas de tender",155,[ens,qcs()]],["Dedos de queso","10 dedos de queso mozzarella",155,[ens,qcs()]],["Aros de cebolla","15 aros de cebolla",105,[ens,qcs()]],["Salchipulpos","16 salchipulpos",100,[ens,qcs()]]].map(([n,d,p,gr],i)=>({id:"cb"+i,nombre:`Combo ${n}`,precio:p,d:`${d} + papas a la francesa chica`,o:[...gr,sal(1),qcs("Preparación de tus papas"),con(1,"Condimentador para tus papas")]})),
"Taco Bony":[["Pastor",18,80,140],["Suadero",22,100,180],["Longaniza",18,80,140],["Campechano (suadero y longaniza)",20,90,160]].flatMap(([n,a,b,c],i)=>[["1 taco",a],["Orden de 5",b],["Orden de 10",c]].map(([t,p],j)=>({id:`tb${i}${j}`,nombre:`Tacos de ${n} · ${t}`,precio:p,d:"Incluyen verdura y salsa",o:[{t:"Verdura y salsa",s:"verdura y salsa",e:"🌿",l:L("Verdura,Salsa"),n:2,casa:["Verdura","Salsa"],ct:"Poner las dos (como se incluyen)"}]}))),
"Postres y bebidas":[
 ...SZ.map((s,i)=>({id:"pl"+i,nombre:`Plátanos fritos ${s}`,precio:[60,110,150][i],d:"Preparación a elegir",o:[topp,{t:"Mermelada",s:"mermelada",e:"🍓",l:L("Fresa,Frutos rojos"),n:1},gran]})),
 {id:"fc",nombre:"Fresas con crema",precio:75,d:"Preparación incluida: crema, lechera, chocolate líquido y granillo",o:[incl,gran]},
 {id:"fr",nombre:"Frutos rojos con crema",precio:85,d:"Preparación incluida: crema, lechera, chocolate líquido y granillo",o:[incl,gran]},
 {id:"ck",nombre:"Cheesecake de zarzamora",precio:50,d:"Postre individual"},
 {id:"ca",nombre:"Carlotta de limón",precio:50,d:"Postre individual"},
 ...[["1 litro",25],["1.5 litros",35]].map(([l,p],i)=>({id:"bb"+i,nombre:`Bebida ${l}`,precio:p,d:"Jamaica, horchata o limón",o:[{t:"Sabor",s:"sabor",e:"🥤",l:SAB,n:1,min:1}]}))
]};

/* Condiciones por producto (tomadas del menú) */
const ENV="Envíos a domicilio: mandamos los ingredientes aparte para conservar la calidad.";
const SAL3="Cada tamaño incluye 1 (chica), 2 (grande) o 3 (familiar) salsas adicionales a elegir.";
const meta={
"Alitas":{p1:"Elige tu tamaño",c:["Preparadas al momento.",SAL3,"Preparación tradicional: Maggi, Valentina, Tajín y limón.",ENV]},
"Boneless":{p1:"Elige tu tamaño",c:["Preparados al momento.","Marinado a elegir: pimienta limón o búfalo.",SAL3,ENV]},
"Nuggets":{p1:"Elige tu tamaño",c:["Preparados al momento.",SAL3,"Preparación tradicional: queso, catsup y salsa.",ENV]},
"Tenders":{p1:"Elige tu tamaño",c:["Preparados al momento.",SAL3,"Preparación tradicional: queso, catsup y salsa.",ENV]},
"Dedos de queso":{p1:"Elige tu tamaño",c:["Rellenos de queso mozzarella.",SAL3,"Preparación tradicional: queso, catsup y salsa.",ENV]},
"Aros de cebolla":{p1:"Elige tu tamaño",c:["Preparados al momento.",SAL3,"Preparación tradicional: queso, catsup y salsa.",ENV]},
"Salchipulpos":{p1:"Elige tu tamaño",c:["Preparados al momento.",SAL3,"Preparación tradicional: queso, catsup y salsa.",ENV]},
"Papas a la francesa":{p1:"Elige tu tamaño",c:["Preparación tradicional: queso, catsup y salsa.","Cada tamaño incluye 1 (chica), 2 (grande) o 3 (familiar) condimentadores a elegir.",ENV]},
"Botanas BW":{p1:"Elige tu botana",c:["Incluyen preparación (Maggi, Valentina y Tajín) y 1 condimentador a elegir.",ENV]},
"Combos BW":{p1:"Elige tu combo",c:["Todos los combos incluyen 1 orden chica de papas a la francesa.","Cada combo incluye 1 salsa adicional y 1 condimentador para tus papas.",ENV]},
"Taco Bony":{p1:"Elige tus tacos",c:["Todos los tacos incluyen verdura y salsa."]},
"Postres y bebidas":{p1:"Elige tu postre o bebida",c:["Preparamos al momento con ingredientes de calidad.","Envíos a domicilio: mandamos los ingredientes aparte cuando sea necesario para conservar el producto."]}
};

const cats=[
 {id:"pollo",nombre:"Alitas y pollo",nota:"Preparados al momento",promos:[["alitas.jpg","Alitas"],["boneless.jpg","Boneless"],["tenders.jpg","Tenders"],["nuggets.jpg","Nuggets"]]},
 {id:"botanas",nombre:"Botanas",nota:"Crujientes y doraditas",promos:[["dedos-de-queso.jpg","Dedos de queso"],["aros-de-cebolla.jpg","Aros de cebolla"],["salchipulpos.jpg","Salchipulpos"],["papas-francesa.jpg","Papas a la francesa"],["botanas.jpg","Botanas BW"]]},
 {id:"tacos",nombre:"Taco Bony",nota:"Tacos con todo el sabor",promos:[["taco-bony.jpg","Taco Bony"]]},
 {id:"postres",nombre:"Postres y bebidas",nota:"El final perfecto para tu antojo",promos:[["postres.jpg","Postres y bebidas"]]},
 {id:"combos",nombre:"Combos BW",nota:"Todo tu antojo en una sola orden",promos:[["combos.jpg","Combos BW"]]}
];
BW.catalog={variantes,cats,meta};
})();
