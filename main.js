const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const store={get(k,d){try{const v=localStorage.getItem(k);return v===null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const cur=document.body.dataset.p||'home',L=(h,t,k)=>`<a href="${h}" ${cur===k?'class="on" aria-current="page"':''}>${t}</a>`;
document.body.insertAdjacentHTML('afterbegin',`<header class="h" id="hdr"><a class="logo" href="index.html"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1C19 6 20 14 12 23 4 14 5 6 12 1Z"/></svg>Code Green</a><nav>${L('index.html','Startseite','home')}${L('index.html#projekte','Projekte','projekte')}${L('spiel.html','Spiel','spiel')}</nav><button class="ib" id="theme" aria-label="Farbschema wechseln"></button></header>`);
document.body.insertAdjacentHTML('beforeend','<footer class="ft">Code Green · ITT Buonarroti</footer>');
function setTheme(t,save){document.documentElement.dataset.theme=t;$('#theme').textContent=t==='dark'?'Hell':'Dunkel';if(save)store.set('cg-theme',t)}
setTheme(document.documentElement.dataset.theme||'light');
$('#theme').onclick=()=>setTheme(document.documentElement.dataset.theme==='dark'?'light':'dark',true);
const sc=()=>$('#hdr').classList.toggle('sc',scrollY>20);addEventListener('scroll',sc,{passive:true});sc();
/* Startseite: Blatt mit Leiterbahnen */
const LF=$('#leaf');if(LF){let s='';for(let i=0;i<5;i++){const y=130+i*58,dx=48-i*5;[1,-1].forEach(g=>{const x1=200+g*dx,x2=x1+g*22,y2=y-22,d=+(1+i*.18+(g<0?.08:0)).toFixed(2);
s+=`<path class="tr" pathLength="1" style="--d:${d}s" d="M200 ${y}H${x1}L${x2} ${y2}"/><circle class="nd" style="--d:${(d+1).toFixed(2)}s" cx="${x2}" cy="${y2}" r="5"/>`})}LF.insertAdjacentHTML('beforeend',s)}
