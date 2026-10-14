import {faceTones,hairColors} from './player.js';
// Small dependency-free WebGL showroom. Original procedural geometry, not PUBG assets.
const V=(x,y,z)=>[x,y,z];
const sub=(a,b)=>a.map((x,i)=>x-b[i]), dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0), cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]], norm=a=>{let n=Math.hypot(...a)||1;return a.map(x=>x/n)};
function mul(a,b){let o=new Float32Array(16);for(let c=0;c<4;c++)for(let r=0;r<4;r++)for(let k=0;k<4;k++)o[c*4+r]+=a[k*4+r]*b[c*4+k];return o;}
function camera(eye,target,aspect){let z=norm(sub(eye,target)),x=norm(cross([0,1,0],z)),y=cross(z,x);let view=[...x.map((_,i)=>[x[i],y[i],z[i],0]).flat(),-dot(x,eye),-dot(y,eye),-dot(z,eye),1];let f=1/Math.tan(.65/2),n=.1,far=160;let p=[f/aspect,0,0,0,0,f,0,0,0,0,(far+n)/(n-far),-1,0,0,2*far*n/(n-far),0];return mul(p,view);}
const color=s=>{if(Array.isArray(s))return s;let h=s.replace('#','');return [0,2,4].map(i=>parseInt(h.slice(i,i+2),16)/255)};
const cube=[[[1,0,0],[1,-1,-1],[1,1,-1],[1,1,1],[1,-1,1]],[[-1,0,0],[-1,-1,1],[-1,1,1],[-1,1,-1],[-1,-1,-1]],[[0,1,0],[-1,1,-1],[-1,1,1],[1,1,1],[1,1,-1]],[[0,-1,0],[-1,-1,1],[-1,-1,-1],[1,-1,-1],[1,-1,1]],[[0,0,1],[1,-1,1],[1,1,1],[-1,1,1],[-1,-1,1]],[[0,0,-1],[-1,-1,-1],[-1,1,-1],[1,1,-1],[1,-1,-1]]];
class Mesh {
 constructor(){this.data=[];this.turn=0;this.origin=[0,0,0];}
 point(p,n,c){let a=this.turn,co=Math.cos(a),si=Math.sin(a);let t=[co*p[0]+si*p[2]+this.origin[0],p[1]+this.origin[1],-si*p[0]+co*p[2]+this.origin[2]];let nn=[co*n[0]+si*n[2],n[1],-si*n[0]+co*n[2]];this.data.push(...t,...nn,...c);}
 tri(a,b,c,col){let n=norm(cross(sub(b,a),sub(c,a)));for(let p of [a,b,c])this.point(p,n,color(col));}
 box(p,s,col,rz=0){let co=Math.cos(rz),si=Math.sin(rz);const tf=v=>{let x=v[0]*s[0]/2,y=v[1]*s[1]/2;return [p[0]+x*co-y*si,p[1]+x*si+y*co,p[2]+v[2]*s[2]/2]};for(let face of cube){let q=face.slice(1).map(tf);this.tri(q[0],q[1],q[2],col);this.tri(q[0],q[2],q[3],col);}}
 sphere(p,s,col,seg=14,rings=10){let c=color(col);const v=(i,j)=>{let a=i/seg*Math.PI*2,b=j/rings*Math.PI;return [Math.sin(b)*Math.cos(a),Math.cos(b),Math.sin(b)*Math.sin(a)]};for(let j=0;j<rings;j++)for(let i=0;i<seg;i++){let q=[v(i,j),v(i+1,j),v(i+1,j+1),v(i,j+1)];for(let k of [0,1,2,0,2,3]){let n=q[k];this.point(n.map((x,l)=>p[l]+x*s[l]),norm(n.map((x,l)=>x/s[l])),c);}}}
 cone(p,r0,r1,h,col,seg=16){for(let i=0;i<seg;i++){let a=i/seg*Math.PI*2,b=(i+1)/seg*Math.PI*2;let q=[[p[0]+Math.cos(a)*r0,p[1]-h/2,p[2]+Math.sin(a)*r0],[p[0]+Math.cos(b)*r0,p[1]-h/2,p[2]+Math.sin(b)*r0],[p[0]+Math.cos(b)*r1,p[1]+h/2,p[2]+Math.sin(b)*r1],[p[0]+Math.cos(a)*r1,p[1]+h/2,p[2]+Math.sin(a)*r1]];this.tri(q[0],q[1],q[2],col);this.tri(q[0],q[2],q[3],col);this.tri([p[0],p[1]+h/2,p[2]],q[3],q[2],col);}}
 beam(a,b,r,col){let d=sub(b,a),len=Math.hypot(...d);let u=norm(cross(norm(d),Math.abs(d[1]/len)>.9?[1,0,0]:[0,1,0])),v=norm(cross(norm(d),u));for(let i=0;i<8;i++){let q=[];for(let [p,t] of [[a,i],[a,i+1],[b,i+1],[b,i]]){let angle=t/8*Math.PI*2;q.push(p.map((x,k)=>x+r*(u[k]*Math.cos(angle)+v[k]*Math.sin(angle))));}this.tri(q[0],q[1],q[2],col);this.tri(q[0],q[2],q[3],col);}}
}
function rifle(m,p=[0,0,0],c='#984de0',scale=1){let old=m.origin;m.origin=old.map((x,i)=>x+p[i]);const b=(p,s,c2=c)=>m.box(p.map(x=>x*scale),s.map(x=>x*scale),c2);b([0,0,0],[1,.15,.16]);b([-.65,-.01,0],[.42,.2,.12]);b([.65,.01,0],[.45,.055,.065],'#3b3f50');b([.9,.01,0],[.08,.085,.085],'#d6b65f');b([.02,-.19,0],[.17,.32,.13],'#cfc9d9');b([-.27,-.18,0],[.1,.25,.12]);b([.13,.12,0],[.36,.045,.08],'#d4b35d');for(let i=0;i<4;i++)b([-.35+i*.2,.01,.085],[.08,.055,.01],'#e3c2fa');m.origin=old;}
function avatarHead(m,o,skin,male,accent,gold){
 const face=Number.isInteger(o.face)?o.face:0,hair=Number.isInteger(o.hair)?o.hair:0,hairColor=hairColors[o.hairColor]||'#292c31';
 const width=(male?.195:.17)+(face%3-.5)*.007;
 m.sphere([0,2.18,0],[width,.23,.16],skin);m.sphere([0,2.17,.12],[width*.84,.173,.076],skin);
 if(hair!==6){
  m.sphere([0,2.3,-.055],[width+.015,hair===4?.095:.17,.16],hairColor);
  if(hair!==4)m.box([0,2.32,.105],[width*1.65,.065,.07],hairColor,-.06);
 }
 if([0,2,5,7,8].includes(hair))for(const side of [-1,1])m.sphere([side*(width+.004),hair===5?2.05:2.16,-.04],[.045,hair===5?.3:.13,.08],hairColor);
 if(hair===1){m.sphere([0,2.25,-.22],[.07,.07,.07],hairColor);m.sphere([0,2.04,-.28],[.075,.23,.08],hairColor);}
 if(hair===2)for(const side of [-1,1])for(let i=0;i<3;i++)m.sphere([side*(width+.035),2.17-i*.08,-.08],[.068,.068,.065],hairColor,10,7);
 if(hair===3)for(let i=0;i<10;i++){const a=i/10*Math.PI*2;m.sphere([Math.cos(a)*.14,2.35+Math.sin(a)*.035,-.015+Math.sin(a)*.1],[.075,.085,.075],hairColor,8,6);}
 if(hair===7)for(let i=0;i<6;i++)m.sphere([.12,2.13-i*.075,-.16],[.038,.048,.04],hairColor,8,6);
 if(hair===8)m.sphere([-.09,2.31,.13],[.125,.095,.025],hairColor);
 for(const x of [-.058,.058]){m.sphere([x,2.205,.183],[.027,.012,.009],'#eeeeed',8,6);m.sphere([x,2.204,.193],[.009,.012,.004],'#283238',8,6);m.box([x,2.239,.179],[.052,.009,.01],hairColor,x>0?.08:-.08);}
 m.sphere([0,2.155,.193],[.022,.031,.025],skin,8,6);m.box([0,2.103,.19],[.051,.011,.008],'#a77069');
 for(const x of [-width,width])m.sphere([x,2.155,0],[.025,.049,.028],skin,8,6);
 if(!o.starter&&o.outfit!=='none'){m.cone([0,2.31,-.01],width+.015,width,.045,gold);m.sphere([0,2.31,.179],[.032,.039,.012],accent,8,6);}
}
function starterAvatar(m,o){
 const skin=faceTones[o.face]||faceTones[0],color=o.color||'#eaf3f1',accent=o.accent||'#50acda',male=o.character==='victor'||o.gender==='male';
 const basic=o.outfit==='none',hoodie=o.outfit==='hoodie',cadet=o.outfit==='cadet';
 for(const x of [-.19,.19]){m.sphere([x,.88,0],[.112,.44,.13],skin);m.sphere([x,.36,.01],[.085,.34,.095],skin);m.box([x,.08,.08],[.18,.12,.28],basic?'#737b72':accent);
  if(!basic&&!cadet)for(let i=0;i<6;i++)m.cone([x,.2+i*.058,.01],.09,.09,.056,hoodie?'#443342':i%2===0?'#e6eee8':accent,12);
 }
 m.sphere([0,1.36,0],[male?.31:.28,.19,.19],color);m.cone([0,1.64,0],.235,male?.32:.28,.5,color);m.cone([0,1.95,0],.09,.09,.15,skin);
 avatarHead(m,{...o,starter:true},skin,male,accent,'#c4a45a');
 for(const side of [-1,1]){const shoulder=[side*.31,1.84,0],elbow=[side*.42,1.5,.02],hand=[side*.48,1.22,.1];m.sphere(shoulder,[.13,.13,.12],color);m.beam(shoulder,elbow,.074,hoodie?color:skin);m.beam(elbow,hand,.06,hoodie?color:skin);m.sphere(hand,[.06,.077,.043],skin);
  if(hoodie)m.box([side*.385,1.67,0],[.14,.26,.14],color,side*.15);
 }
 if(basic||cadet||hoodie){for(const x of [-.15,.15])m.box([x,1.17,0],[.27,.31,.24],cadet?'#364a44':basic?'#677970':color);}
 else{m.cone([0,1.13,0],.43,.26,.38,'#e5eeea',18);m.box([0,1.48,.206],[.13,.28,.035],accent);for(const side of [-1,1])m.box([side*.145,1.52,.209],[.17,.11,.04],accent,side*.4);m.sphere([0,1.49,.235],[.045,.05,.02],accent,8,6);m.box([0,1.31,-.23],[.27,.17,.03],accent);}
 if(hoodie){m.cone([0,1.87,0],.29,.17,.1,accent);m.box([0,1.49,.207],[.025,.39,.02],'#eee7ea');m.sphere([.18,1.28,.22],[.11,.12,.065],'#efe6e4');}
 if(cadet){m.box([0,1.66,.175],[.43,.34,.105],'#40564c');for(const x of [-.125,.125])m.box([x,1.55,.235],[.1,.15,.06],accent);m.cone([0,1.38,0],.255,.255,.065,accent);}
 if(o.weapon!=='none')rifle(m,[.39,1.43,.29],o.weaponColor||'#807054',.64);
}
function avatar(m,o,time){if(o.starter||o.outfit==='none'){starterAvatar(m,o);return;}let skin=faceTones[o.face]||'#d8af91',gold='#c4a45a',white=o.color||'#ece6d5',blue=o.accent||'#436fc6';let male=o.character==='victor'||o.gender==='male';
 // Stylized articulated mannequin with layered cloth and metallic accessories.
 for(let x of [-.19,.19]){m.sphere([x,.87,0],[.12,.45,.13],skin);m.sphere([x,.35,.025],[.085,.34,.09],skin);m.box([x,.12,.07],[.17,.13,.29],blue);for(let y of [.19,.32,.48])m.cone([x,y,.025],.088,.088,.04,gold,10);}
 m.sphere([0,1.34,0],[.3,.2,.19],white);m.cone([0,1.63,0],.22,.3,.5,white);m.cone([0,1.42,0],.24,.24,.075,gold);m.cone([0,1.96,0],.1,.1,.15,skin);
 avatarHead(m,o,skin,male,blue,gold);
 for(let side of [-1,1]){let shoulder=[side*.31,1.85,0],elbow=[side*.41,1.53,.015],hand=[side*.48,1.22,.07];m.sphere(shoulder,[.14,.15,.13],white);m.beam(shoulder,elbow,.073,skin);m.beam(elbow,hand,.055,skin);m.sphere(hand,[.06,.08,.04],skin);m.cone([side*.365,1.7,.009],.08,.08,.08,gold);m.box([side*.4,1.44,-.08],[.17,.53,.035],blue,side*.12);}
 if(!male){for(let side of [-1,1]){m.box([side*.29,1.02,-.06],[.2,.68,.06],white,side*.2);m.box([side*.22,.98,-.13],[.15,.77,.045],blue,side*.1);}m.box([0,1.13,.197],[.16,.56,.028],blue);m.box([0,1.14,.216],[.025,.55,.01],gold);}
 m.cone([0,1.9,0],.31,.15,.12,gold);m.sphere([0,1.74,.21],[.04,.052,.025],blue,8,6);
 if(o.weapon!=='none')rifle(m,[.39,1.43,.29],o.weaponColor||'#984de0',.64);
 if(o.suit){m.cone([0,.03,0],.8,.75,.08,gold);for(let side of [-1,1])for(let i=0;i<4;i++){let x=side*(.7+i*.09);m.beam([x,.2+i*.25,-.2],[x+side*.16,.65+i*.25,-.1],.022,blue);}}
}
function vehicle(m,o){let c=o.color||'#cba44b',dark='#26303c';let type=o.vehicle||'buggy';for(let x of [-.62,.62])for(let z of [-.75,.75]){m.sphere([x,.3,z],[.18,.31,.31],dark);m.sphere([x*1.18,.3,z],[.015,.21,.21],c);m.sphere([x*1.205,.3,z],[.016,.08,.08],'#aeb5bd');}m.box([0,.39,0],[1.1,.22,1.8],c);m.box([0,.61,-.55],[1.03,.29,.65],c);m.box([0,.63,.66],[.97,.23,.48],c);m.box([0,.67,.03],[.8,.16,.6],dark);for(let x of [-.23,.23])m.box([x,.84,-.14],[.34,.44,.13],dark);
 if(type==='buggy'){for(let x of [-.47,.47]){m.beam([x,.5,.45],[x,1.25,.12],.04,c);m.beam([x,1.25,.12],[x,1.19,-.4],.04,c);m.beam([x,1.19,-.4],[x,.5,-.7],.04,c);}m.beam([-.47,1.25,.12],[.47,1.25,.12],.04,c);m.beam([-.47,1.19,-.4],[.47,1.19,-.4],.04,c);}else{m.box([0,1.02,-.05],[1,.48,.88],'#516e79');m.box([0,1.3,-.05],[1.03,.08,.96],c);for(let x of [-.48,.48])m.box([x,.85,-.1],[.055,.42,1],c);}
 for(let x of [-.33,.33])m.sphere([x,.68,.91],[.11,.09,.035],'#fff1ba',10,6);m.box([0,.48,.96],[.8,.08,.08],'#b4b7ba');}
function cat(m){let c='#d5d3cd';m.sphere([0,.19,0],[.16,.2,.21],c);m.sphere([0,.4,.06],[.18,.16,.15],c);for(let s of [-1,1]){m.cone([s*.12,.54,.04],.075,0,.15,c,5);m.sphere([s*.065,.42,.195],[.029,.036,.008],'#485455',8,6);m.sphere([s*.09,.06,.13],[.07,.06,.11],c);}m.sphere([0,.37,.214],[.025,.017,.009],'#af9290',8,6);m.beam([0,.12,-.15],[.26,.26,-.27],.05,c);}
function pet(m,id){
 if(id==='none')return;
 if(id==='kitten'){cat(m);return;}
 if(id==='penguin'){m.sphere([0,.28,0],[.18,.28,.16],'#343c49');m.sphere([0,.25,.11],[.14,.2,.08],'#e1e3dc');m.sphere([0,.55,0],[.13,.13,.12],'#343c49');m.cone([0,.53,.15],.06,0,.1,'#d7a449',5);for(let x of [-.065,.065])m.sphere([x,.57,.107],[.018,.023,.015],'#eeeeec');for(let x of [-.2,.2])m.beam([x*.65,.4,0],[x,.14,0],.055,'#343c49');return;}
 let c=id==='bear'?'#a68a5d':'#c68c4c';m.sphere([0,.24,0],[.2,.24,.24],c);m.sphere([0,.5,.07],[.2,.18,.16],c);m.sphere([0,.45,.21],[.12,.085,.065],'#e4d5b4');for(let x of [-.13,.13]){if(id==='bear')m.sphere([x,.65,.03],[.085,.08,.06],c);else m.cone([x,.67,.02],.085,0,.17,c,5);m.sphere([x*.55,.53,.21],[.017,.022,.009],'#2c3033');m.sphere([x,.08,.15],[.09,.08,.13],c);}m.sphere([0,.47,.277],[.035,.025,.015],'#343536');if(id==='shiba')m.sphere([.18,.33,-.18],[.085,.12,.1],c);
}
function environment(m,type){let lobby=type==='lobby',forest=type==='xsuit';m.box([0,-.08,0],[100,.1,100],lobby?'#626f72':forest?'#364d42':'#252e3b');if(lobby){for(let i=-9;i<=9;i++){m.box([i*1.3,-.021,-1],[.014,.009,26],'#414b50');m.box([0,-.02,i*1.3],[24,.009,.014],'#414b50');}for(let s of [-1,1]){m.box([s*7,2,-8],[5,4,8],'#7e8989');for(let z of [-10,-7,-4]){m.box([s*7,4,z],[1.7,1.7,1.7],'#798589');m.cone([s*7,5.2,z],1.3,0,1.4,'#374554',4);}for(let z=-10;z<=-4;z+=1.4)m.box([s*4.47,2.1,z],[.015,1,.5],'#34464d');for(let z of [-6,-10]){m.cone([s*3.8,1.3,z],.12,.09,2.6,'#47473c');m.sphere([s*3.8,3,z],[1.1,1.8,1.1],'#344c45');}}
 for(let i=-4;i<=4;i++)m.cone([i*5,1,-30-Math.abs(i)*2],7,0,8+(i%3)*2,'#75868b',5);
 }else{m.cone([0,-.005,0],2.8,2.8,.04,'#444f5e',64);for(let s of [-1,1]){m.box([s*5,2.7,-4],[.15,5.5,4],'#354151');m.box([s*3.8,3.5,-4],[2.6,.03,.12],forest?'#b1d586':'#668fbc');}m.box([0,2.5,-6],[14,5,.2],forest?'#2a4941':'#29333f');}}
export class Scene {
 constructor(canvas){
  this.canvas=canvas;this.gl=canvas.getContext('webgl',{antialias:true,alpha:false});
  this.options={type:'lobby'};this.angle=-.18;this.zoom=1;this.dirty=true;this.last=0;this.raf=0;this.lost=false;
  this.pointers=new Map();this.environmentCache=new Map();this.modelKey='';this.backgroundKey='';this.listeners=[];
  this.frame=this.frame.bind(this);this.onVisibility=()=>{if(document.hidden)this.stop();else this.wake();};
  this.onResize=()=>this.wake();
  if(!this.gl){this.fallback('3D preview requires WebGL. Menus remain available.');return;}
  this.initialize();
  const listen=(event,fn,options)=>{canvas.addEventListener(event,fn,options);this.listeners.push([event,fn,options]);};
  listen('pointerdown',event=>{
   this.pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});canvas.setPointerCapture?.(event.pointerId);
   this.anchorGesture();
  });
  listen('pointermove',event=>{
   if(!this.pointers.has(event.pointerId))return;
   this.pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});
   const points=[...this.pointers.values()];
   if(points.length>=2){
    const distance=Math.hypot(points[1].x-points[0].x,points[1].y-points[0].y);
    if(this.pinchDistance>0)this.zoom=Math.max(.65,Math.min(1.65,this.pinchZoom*this.pinchDistance/Math.max(1,distance)));
   }else if(this.drag)this.angle=this.drag.angle+(event.clientX-this.drag.x)*.008;
   this.wake();
  });
  const release=event=>{this.pointers.delete(event.pointerId);this.anchorGesture();};
  for(const event of ['pointerup','pointercancel','lostpointercapture'])listen(event,release);
  listen('wheel',event=>{event.preventDefault();this.zoom=Math.max(.65,Math.min(1.65,this.zoom+event.deltaY*.0006));this.wake();},{passive:false});
  listen('dblclick',()=>{this.angle=this.options.type==='vehicle'?.65:-.18;this.zoom=1;this.wake();});
  listen('webglcontextlost',event=>{event.preventDefault();this.lost=true;this.stop();this.fallback('3D renderer reconnecting…');});
  listen('webglcontextrestored',()=>{
   try{this.initialize();this.lost=false;this.fallbackNode?.remove();this.fallbackNode=null;this.wake();}
   catch(error){this.lost=true;this.fallback('3D preview unavailable. Reload to reconnect.');console.error(error);}
  });
  window.addEventListener('resize',this.onResize);document.addEventListener?.('visibilitychange',this.onVisibility);
  if(typeof ResizeObserver!=='undefined'){this.observer=new ResizeObserver(this.onResize);this.observer.observe(canvas);}
  this.wake();
 }
 fallback(message){
  if(!this.fallbackNode&&document.createElement){this.fallbackNode=document.createElement('div');this.fallbackNode.className='webgl-fallback';this.fallbackNode.setAttribute('role','status');this.canvas.after?.(this.fallbackNode);}
  if(this.fallbackNode)this.fallbackNode.textContent=message;
 }
 initialize(){
  const gl=this.gl;
  const shader=(type,source)=>{const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;};
  const vertex=shader(gl.VERTEX_SHADER,`attribute vec3 aPos;attribute vec3 aNormal;attribute vec3 aColor;uniform mat4 uVP;uniform float uTurn;uniform vec3 uSky;varying vec3 vColor;varying float vFog;void main(){float c=cos(uTurn),s=sin(uTurn);mat3 r=mat3(c,0.,-s,0.,1.,0.,s,0.,c);vec3 p=r*aPos;vec3 normal=r*aNormal;gl_Position=uVP*vec4(p,1.);float light=.42+.48*max(dot(normalize(normal),normalize(vec3(-.5,1.,.7))),0.)+.16*max(dot(normalize(normal),normalize(vec3(.8,.3,-.8))),0.);vColor=aColor*light;vFog=clamp((gl_Position.w-12.)/45.,0.,.75);}`);
  const fragment=shader(gl.FRAGMENT_SHADER,'precision mediump float;varying vec3 vColor;varying float vFog;uniform vec3 uSky;void main(){gl_FragColor=vec4(mix(vColor,uSky,vFog),1.);}');
  const pr=gl.createProgram();gl.attachShader(pr,vertex);gl.attachShader(pr,fragment);gl.linkProgram(pr);
  if(!gl.getProgramParameter(pr,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(pr));
  gl.deleteShader(vertex);gl.deleteShader(fragment);gl.useProgram(pr);this.pr=pr;
  this.attributes=['aPos','aNormal','aColor'].map(name=>gl.getAttribLocation(pr,name));
  this.vp=gl.getUniformLocation(pr,'uVP');this.sky=gl.getUniformLocation(pr,'uSky');this.turn=gl.getUniformLocation(pr,'uTurn');
  this.backgroundBuffer=gl.createBuffer();this.modelBuffer=gl.createBuffer();this.backgroundKey='';this.modelKey='';
  gl.enable(gl.DEPTH_TEST);
 }
 anchorGesture(){
  const points=[...this.pointers.values()];
  if(points.length>=2){this.pinchDistance=Math.hypot(points[1].x-points[0].x,points[1].y-points[0].y);this.pinchZoom=this.zoom;this.drag=null;}
  else{this.pinchDistance=0;this.drag=points[0]?{x:points[0].x,angle:this.angle}:null;}
 }
 active(){return Boolean(this.gl)&&!this.lost&&!document.hidden&&!this.options.hidden&&!this.options.paused;}
 stop(){if(this.raf){globalThis.cancelAnimationFrame?.(this.raf);this.raf=0;}}
 wake(){this.dirty=true;if(this.active()&&!this.raf)this.raf=requestAnimationFrame(this.frame);}
 set(options){
  if(this.options.type!==options.type){this.angle=options.type==='vehicle'?.65:-.18;this.zoom=1;this.pointers.clear();this.drag=null;}
  this.options=options;this.motion=options.motion!==false && !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if(this.active())this.wake();else this.stop();
 }
 bind(buffer){
  const gl=this.gl;gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
  this.attributes.forEach((loc,index)=>{if(loc>=0){gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,3,gl.FLOAT,false,36,index*12);}});
 }
 geometry(){
  const gl=this.gl,o=this.options;
  if(this.backgroundKey!==o.type){
   let data=this.environmentCache.get(o.type);
   if(!data){const mesh=new Mesh();environment(mesh,o.type);data=new Float32Array(mesh.data);this.environmentCache.set(o.type,data);}
   gl.bindBuffer(gl.ARRAY_BUFFER,this.backgroundBuffer);gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);this.backgroundCount=data.length/9;this.backgroundKey=o.type;
  }
  const key=JSON.stringify([o.type,o.color,o.accent,o.character,o.weaponColor,o.weapon,o.vehicle,o.companion,o.stage,o.starter,o.outfit,o.gender,o.face,o.hair,o.hairColor]);
  if(this.modelKey===key)return;
  const m=new Mesh();
  if(o.type==='vehicle'){if(o.vehicle!=='none')vehicle(m,o);}
  else if(o.type==='lab'){
   m.origin=[0,1.3,0];if(o.weapon!=='none')rifle(m,[0,0,0],o.weaponColor,1.65);
   if(o.stage>=3){m.origin=[0,0,0];m.cone([0,.02,0],1.9,1.9,.04,'#b99852',40);}
  }else{
   avatar(m,{...o,suit:o.type==='xsuit'},0);
   if(o.type==='lobby'&&o.vehicle!=='none'){m.origin=[-1.7,0,-.2];m.turn=.75;vehicle(m,{vehicle:'buggy'});}
   if(o.companion&&o.companion!=='none'){m.origin=[.8,0,.3];m.turn=0;pet(m,o.companion);}
  }
  gl.bindBuffer(gl.ARRAY_BUFFER,this.modelBuffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(m.data),gl.STATIC_DRAW);this.modelCount=m.data.length/9;this.modelKey=key;
 }
 frame(now){
  this.raf=0;if(!this.active())return;
  const motion=this.motion!==false;
  if(!this.dirty && (!motion || now-this.last<33)){if(motion)this.raf=requestAnimationFrame(this.frame);return;}
  const gl=this.gl,c=this.canvas,o=this.options;
  if(c.clientWidth<=0||c.clientHeight<=0)return;
  this.last=now;this.dirty=false;
  const dpr=Math.min(window.devicePixelRatio||1,o.quality==='low'?1:1.7);
  const w=Math.max(1,Math.round(c.clientWidth*dpr)),h=Math.max(1,Math.round(c.clientHeight*dpr));
  if(c.width!==w||c.height!==h){c.width=w;c.height=h;}gl.viewport(0,0,w,h);
  const sky=o.type==='lobby'?[.39,.47,.52]:o.type==='xsuit'?[.16,.26,.24]:[.085,.12,.17];
  gl.clearColor(...sky,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.useProgram(this.pr);this.geometry();
  let distance=(o.type==='lobby'?5.8:o.type==='vehicle'?5.9:o.type==='lab'?6.2:5)*this.zoom;
  const aspect=w/h;distance*=Math.max(1,.95/aspect);const portrait=window.innerHeight>window.innerWidth;const targetX=o.type==='create'?(portrait?0:-1.1):aspect<1?0:o.type==='lobby'?.25:.55;
  gl.uniformMatrix4fv(this.vp,false,camera([targetX,2.25,distance],[targetX,1.23,0],aspect));gl.uniform3fv(this.sky,sky);
  this.bind(this.backgroundBuffer);gl.uniform1f(this.turn,0);gl.drawArrays(gl.TRIANGLES,0,this.backgroundCount);
  this.bind(this.modelBuffer);gl.uniform1f(this.turn,this.angle+(motion?Math.sin(now*.0005)*.018:0));gl.drawArrays(gl.TRIANGLES,0,this.modelCount);
  if(motion)this.raf=requestAnimationFrame(this.frame);
 }
 destroy(){
  this.stop();this.observer?.disconnect();for(const [event,fn,options] of this.listeners)this.canvas.removeEventListener?.(event,fn,options);
  window.removeEventListener?.('resize',this.onResize);document.removeEventListener?.('visibilitychange',this.onVisibility);
  if(this.gl&&!this.lost){this.gl.deleteBuffer(this.backgroundBuffer);this.gl.deleteBuffer(this.modelBuffer);this.gl.deleteProgram(this.pr);}
  this.fallbackNode?.remove();this.pointers.clear();this.environmentCache.clear();
 }
}
