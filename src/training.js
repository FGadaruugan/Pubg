import {weapons,maps} from './state.js';

// Local target practice, deliberately separate from online battle royale.
export function startTraining(state,onFinish,playSound){
 const root=document.querySelector('#training'),canvas=document.querySelector('#range'),ctx=canvas.getContext('2d');
 if(!ctx)throw new Error('Canvas is unavailable in this browser.');
 root.hidden=false;document.querySelector('#lobby').inert=true;
 const gun=weapons.find(x=>x.id===state.weapon),map=maps.find(x=>x.id===state.map);
 document.querySelector('#range-map').textContent=`${map.name.toUpperCase()} RANGE`;
 document.querySelector('#range-weapon').textContent=`${gun.name} / ${gun.ammo}`;
 let w=0,h=0,hits=0,shots=0,remaining=30,last=performance.now(),lastShot=-Infinity,raf,done=false,targets=[],flash=null;
 const palette=map.id==='miramar'?['#9e9b83','#d0bb93','#9c805f']:map.id==='vikendi'?['#617d95','#c5d5df','#82989f']:['#425f73','#9daaa1','#52685c'];
 function target(){const top=Math.max(135,h*.28),bottom=Math.max(top+30,h-105);return {x:50+Math.random()*Math.max(20,w-100),y:top+Math.random()*(bottom-top),r:Math.max(18,Math.min(32,w*.026))};}
 function resize(){w=window.innerWidth;h=window.innerHeight;const dpr=Math.min(devicePixelRatio||1,state.settings.quality==='low'?1:2);canvas.width=w*dpr;canvas.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);targets=Array.from({length:5},target);}
 function draw(now){
 if(done)return;
 const dt=Math.min((now-last)/1000,.1);last=now;if(!document.hidden)remaining=Math.max(0,remaining-dt);
 document.querySelector('#time-left').textContent=Math.ceil(remaining);
 const sky=ctx.createLinearGradient(0,0,0,h);sky.addColorStop(0,palette[0]);sky.addColorStop(.6,palette[1]);sky.addColorStop(1,palette[2]);ctx.fillStyle=sky;ctx.fillRect(0,0,w,h);
 ctx.fillStyle=palette[2];ctx.beginPath();ctx.moveTo(0,h*.53);for(let x=0;x<=w+70;x+=70)ctx.lineTo(x,h*.43-Math.sin(x*.012)*h*.045-Math.cos(x*.023)*h*.025);ctx.lineTo(w,h);ctx.lineTo(0,h);ctx.fill();
 ctx.strokeStyle='#bfcdb622';ctx.lineWidth=1;for(let i=-8;i<=8;i++){ctx.beginPath();ctx.moveTo(w/2,h*.53);ctx.lineTo(w/2+i*w*.25,h);ctx.stroke();}for(let i=1;i<6;i++){let y=h*.53+(h*.47)*Math.pow(i/6,2);ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}
 for(const t of targets){ctx.fillStyle='#13222b80';ctx.beginPath();ctx.ellipse(t.x,t.y+t.r+13,t.r*1.3,7,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#5d5142';ctx.fillRect(t.x-3,t.y,6,t.r+12);for(const [ratio,color] of [[1,'#e6d8b7'],[.8,'#34404a'],[.59,'#e6d8b7'],[.38,'#b94937'],[.15,'#efce69']]){ctx.fillStyle=color;ctx.beginPath();ctx.arc(t.x,t.y,t.r*ratio,0,Math.PI*2);ctx.fill();}}
 if(flash&&now-flash.time<160){ctx.strokeStyle=flash.hit?'#ffda77':'#f9ece3';ctx.lineWidth=2;const {x,y}=flash;ctx.beginPath();ctx.moveTo(x-8,y-8);ctx.lineTo(x-3,y-3);ctx.moveTo(x+8,y-8);ctx.lineTo(x+3,y-3);ctx.moveTo(x-8,y+8);ctx.lineTo(x-3,y+3);ctx.moveTo(x+8,y+8);ctx.lineTo(x+3,y+3);ctx.stroke();}
 if(remaining<=0){finish(true);return;}raf=requestAnimationFrame(draw);
 }
 function shoot(e){if(done||document.hidden)return;const now=performance.now();if(now-lastShot<gun.delay)return;lastShot=now;shots++;const rect=canvas.getBoundingClientRect(),x=e.clientX-rect.left,y=e.clientY-rect.top;const i=targets.findIndex(t=>Math.hypot(t.x-x,t.y-y)<=t.r);if(i>=0){hits++;targets[i]=target();}flash={x,y,hit:i>=0,time:now};playSound(i>=0?'hit':'shot');document.querySelector('#hit-count').textContent=hits;document.querySelector('#range-accuracy').textContent=`${Math.round(hits/shots*100)}% ACCURACY`;}
 function visibility(){last=performance.now();document.querySelector('#range-paused').hidden=!document.hidden;}
 function key(e){if(e.key==='Escape'){e.preventDefault();finish(false);}}
 function leave(){finish(false);}
 function finish(completed){if(done)return;done=true;cancelAnimationFrame(raf);window.removeEventListener('resize',resize);document.removeEventListener('visibilitychange',visibility);document.removeEventListener('keydown',key);canvas.removeEventListener('pointerdown',shoot);document.querySelector('#leave-range').removeEventListener('click',leave);root.hidden=true;document.querySelector('#range-paused').hidden=true;document.querySelector('#lobby').inert=false;onFinish({completed,hits,shots});}
 document.querySelector('#hit-count').textContent='0';document.querySelector('#time-left').textContent='30';document.querySelector('#range-accuracy').textContent='0% ACCURACY';
 canvas.addEventListener('pointerdown',shoot);window.addEventListener('resize',resize);document.addEventListener('visibilitychange',visibility);document.addEventListener('keydown',key);document.querySelector('#leave-range').addEventListener('click',leave);resize();canvas.focus();raf=requestAnimationFrame(draw);
 return ()=>finish(false);
}
