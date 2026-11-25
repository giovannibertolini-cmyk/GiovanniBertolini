/* Effekte */
const cv=$('#fx'),cx=cv.getContext('2d');let P=[],fxRaf=0;
function fit(){cv.width=innerWidth;cv.height=innerHeight}fit();addEventListener('resize',fit);
function burst(x,y,n=28){const cols=['#34d27b','#7cf2b0','#f5a300','#2b8be6','#ffffff'];
  for(let i=0;i<n;i++){const a=Math.random()*6.28,s=2+Math.random()*7;P.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-3,l:1,r:3+Math.random()*4,c:cols[i%5],g:Math.random()*6})}
  if(!fxRaf)fxRaf=requestAnimationFrame(tickFx)}
function tickFx(){cx.clearRect(0,0,cv.width,cv.height);P=P.filter(p=>p.l>0);
  P.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.26;p.vx*=.985;p.l-=.017;cx.globalAlpha=Math.max(p.l,0);cx.fillStyle=p.c;cx.save();cx.translate(p.x,p.y);cx.rotate(p.g+=.2);cx.fillRect(-p.r,-p.r/2,p.r*2,p.r);cx.restore()});
  fxRaf=P.length?requestAnimationFrame(tickFx):0}
function pop(x,y,t,c){const d=document.createElement('div');d.className='pop';d.textContent=t;d.style.cssText=`left:${x}px;top:${y}px;color:${c}`;document.body.appendChild(d);setTimeout(()=>d.remove(),1100)}
/* Spiel */
const BIN=[['Elektro','#f5a300'],['Papier','#2b8be6'],['Plastik','#ff7a1a'],['Bio','#2fb35a'],['Restmüll','#7a8691']];
const POOL=[['Batterie',0],['Kabel',0],['Festplatte',0],['Altes Handy',0],['Zeitung',1],['Karton',1],['Flasche',2],['Becher',2],['Bananenschale',3],['Laub',3],['Apfelrest',3],['Zigarette',4],['Müllsack',4]];
const BADGES=[['Eco-Rookie','Erstes Spiel beendet'],['Recycling-Meister','90 % Genauigkeit'],['Eco-Warrior','Alle Gegenstände geschafft'],['Flammenmeister','Serie von 8']];
const TOTAL=25,arena=$('#arena'),ov=$('#ov');let G={run:false,items:[]},AW=0,AH=0,gRaf=0;
$('#bins').innerHTML=BIN.map((b,i)=>`<div class="bin" data-i="${i}" style="--c:${b[1]}">${b[0]}</div>`).join('');
const mult=()=>Math.min(1+Math.floor(G.streak/3),5);
function showStart(){ov.className='ov';ov.innerHTML=`<h2>Bereit?</h2><p>Ziehe die Gegenstände in die richtige Tonne, bevor sie unten ankommen. Du hast 3 Leben.</p><p>Rekord: <b>${store.get('cg-best',0)}</b></p><button class="b" id="go">Spiel starten</button>`;$('#go').onclick=startGame}
function startGame(){cancelAnimationFrame(gRaf);$$('.it').forEach(e=>e.remove());AW=arena.clientWidth;AH=arena.clientHeight;
  G={run:true,items:[],score:0,streak:0,max:0,lives:3,spawned:0,ok:0,bad:0,miss:0,lvl:1,sp:.3,last:performance.now(),d:null};
  ov.className='ov off';hud();gRaf=requestAnimationFrame(loop)}
function hud(){const l=Math.max(G.lives,0);$('#hS').textContent='Punkte: '+G.score;$('#hC').textContent=`Serie ${G.streak} · x${mult()}`;$('#hL').textContent=`Leben: ${l}/3`;$('#hV').textContent='Level '+G.lvl;$('#hP').style.width=(G.ok+G.bad+G.miss)/TOTAL*100+'%'}
function spawn(){const p=POOL[Math.random()*POOL.length|0],el=document.createElement('div');el.className='it';el.style.setProperty('--c',BIN[p[1]][1]);el.textContent=p[0];
  arena.appendChild(el);const wd=el.offsetWidth,it={el,b:p[1],wd,x:Math.random()*Math.max(AW-wd,0),y:-60,v:80+Math.random()*25,r:Math.random()*30-15,w:Math.random()*30-15,ph:Math.random()*6,drag:false};
  el._it=it;G.items.push(it);G.spawned++}
const paint=it=>it.el.style.transform=`translate3d(${it.x}px,${it.y}px,0) rotate(${it.drag?0:it.r}deg)`;
function drop_(it){G.items=G.items.filter(i=>i!==it);it.el.classList.add('out');setTimeout(()=>it.el.remove(),300)}
function loop(t){
  if(!G.run)return;
  const dt=Math.min((t-G.last)/1000,.05);G.last=t;
  const k=1+G.lvl*.1+Math.min(G.streak,12)*.03;
  if((G.sp-=dt)<=0&&G.spawned<TOTAL){spawn();G.sp=Math.max(.8,2.1-G.lvl*.18)}
  for(const it of [...G.items]){
    if(!it.drag){it.y+=it.v*k*dt;it.r+=it.w*dt*.5;it.x=Math.max(0,Math.min(AW-it.wd,it.x+Math.sin(t/450+it.ph)*18*dt))}
    paint(it);if(!it.drag&&it.y>AH-100)missed(it)}
  if(G.lives<=0)return endGame(false);
  if(G.spawned>=TOTAL&&!G.items.length)return endGame(true);
  gRaf=requestAnimationFrame(loop)}
function missed(it){const r=it.el.getBoundingClientRect();drop_(it);G.streak=0;G.lives--;G.miss++;pop(r.left+r.width/2,r.top,'Verpasst','#e5383b');navigator.vibrate&&navigator.vibrate(60);hud()}
const binAt=(x,y)=>$$('.bin').find(b=>{const r=b.getBoundingClientRect();return x>=r.left&&x<=r.right&&y>=r.top-30&&y<=r.bottom+10});
arena.addEventListener('pointerdown',e=>{const el=e.target.closest('.it');if(!el||!G.run||G.d)return;const it=el._it,r=arena.getBoundingClientRect();
  it.drag=true;it.ox=e.clientX-r.left-it.x;it.oy=e.clientY-r.top-it.y;G.d=it;el.classList.add('drag');arena.setPointerCapture(e.pointerId)});
arena.addEventListener('pointermove',e=>{const it=G.d;if(!it)return;const r=arena.getBoundingClientRect();
  it.x=Math.max(0,Math.min(AW-it.wd,e.clientX-r.left-it.ox));it.y=Math.max(-20,Math.min(AH-60,e.clientY-r.top-it.oy));paint(it);
  const b=binAt(e.clientX,e.clientY);$$('.bin').forEach(x=>x.classList.toggle('hov',x===b))});
function release(e){const it=G.d;if(!it)return;G.d=null;it.drag=false;it.el.classList.remove('drag');$$('.bin').forEach(x=>x.classList.remove('hov'));
  if(!G.run||e.type==='pointercancel')return;
  const b=binAt(e.clientX,e.clientY);if(!b)return;const r=b.getBoundingClientRect(),cx_=r.left+r.width/2,cy=r.top+r.height/2;drop_(it);
  if(+b.dataset.i===it.b){
    G.ok++;G.streak++;G.max=Math.max(G.max,G.streak);const m=mult(),pts=10*m,lv=1+Math.floor(G.ok/4);G.score+=pts;
    b.classList.remove('bad');void b.offsetWidth;b.classList.add('good');burst(cx_,cy,24+m*8);pop(cx_,cy,'+'+pts,'#34d27b');
    if(G.streak%3===0)setTimeout(()=>pop(cx_,cy-45,`COMBO x${m}!`,'#f5a300'),200);
    if(lv>G.lvl){G.lvl=lv;const a=arena.getBoundingClientRect();setTimeout(()=>pop(a.left+a.width/2,a.top+a.height/2,'LEVEL '+lv,'#2b8be6'),400)}
  }else{
    G.bad++;G.streak=0;G.lives--;b.classList.remove('good');void b.offsetWidth;b.classList.add('bad');
    arena.classList.remove('shake');void arena.offsetWidth;arena.classList.add('shake');pop(cx_,cy,'Falsch: '+BIN[it.b][0],'#e5383b');navigator.vibrate&&navigator.vibrate(90)}
  hud()}
arena.addEventListener('pointerup',release);arena.addEventListener('pointercancel',release);
addEventListener('resize',()=>{AW=arena.clientWidth;AH=arena.clientHeight});
function endGame(win){G.run=false;G.d=null;cancelAnimationFrame(gRaf);
  const n=G.ok+G.bad+G.miss,acc=n?Math.round(G.ok/n*100):0,best=store.get('cg-best',0),rec=G.score>best;if(rec)store.set('cg-best',G.score);
  const have=store.get('cg-badges',[]),fresh=[];[true,acc>=90&&n>=10,win,G.max>=8].forEach((e,i)=>{if(e&&!have.includes(i)){have.push(i);fresh.push(i)}});store.set('cg-badges',have);
  ov.className='ov';ov.innerHTML=`<h2>${win?'Gewonnen!':'Game Over'}</h2>${rec?'<span class="bg" style="background:#f5a300">Neuer Rekord!</span>':''}
  <div class="sg"><div><b>${G.score}</b>Punkte</div><div><b>${acc} %</b>Genauigkeit</div><div><b>${G.max}</b>Beste Serie</div><div><b>${Math.max(best,G.score)}</b>Rekord</div></div>
  <div class="bgs">${BADGES.map((b,i)=>`<span class="bdg ${have.includes(i)?'':'lock'} ${fresh.includes(i)?'new':''}" title="${b[1]}">${b[0]}</span>`).join('')}</div><button class="b" id="go">Nochmal spielen</button>`;
  $('#go').onclick=startGame;
  if(win){const r=arena.getBoundingClientRect();[0,1,2].forEach(i=>setTimeout(()=>burst(r.left+r.width*(.2+i*.3),r.top+r.height*.4,50),i*250))}}
showStart();
