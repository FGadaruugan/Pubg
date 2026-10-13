import test from 'node:test';
import assert from 'node:assert/strict';
test('controller protects pack taps and retains the search field',async()=>{
const nodes=new Map(),raf=[],windowEvents={};
class Element {
 constructor(id,scope='screen'){this.id=id;this.scope=scope;this.dataset={};this.style={};this.tagName='DIV';this.scrollLeft=0;this.scrollTop=0;this.classList={add(){},remove(){},contains(){return false;}};this.handlers={};}
 set innerHTML(value){this.html=value;if(this.id==='modal-root'&&nodes.has('dialog'))nodes.get('dialog').scrollTop=0;}
 get innerHTML(){return this.html||'';}
 addEventListener(name,fn){this.handlers[name]=fn;}
 removeEventListener(){}
 contains(node){return this.id==='app'?Boolean(node?.scope):this.id==='modal-root'?node?.scope==='modal':false;}
 querySelector(selector){if(selector==='.item-grid')return nodes.get('grid');if(selector==='.dialog')return nodes.get('dialog');if(selector==='#quality')return nodes.get('quality');if(this.id==='modal-root'&&this.html)return nodes.get('modal-control');return null;}
 querySelectorAll(){return [];}
 setAttribute(){}
 focus(){document.activeElement=this;}
 setSelectionRange(a,b){this.selectionStart=a;this.selectionEnd=b;}
 replaceChildren(){this.html='';}
 insertAdjacentHTML(position,value){this.html=(this.html||'')+value;}
 append(){}
 before(){}
 after(){}
 remove(){}
 setPointerCapture(){}
}
for(const id of ['app','screen-root','modal-root','scene','toast','grid','modal-control','dialog','quality'])nodes.set(id,new Element(id,['modal-control','dialog','quality'].includes(id)?'modal':'screen'));
const app=nodes.get('app'),canvas=nodes.get('scene');canvas.clientWidth=900;canvas.clientHeight=500;
const gl=new Proxy({getShaderParameter:()=>true,getProgramParameter:()=>true,getAttribLocation:()=>0},{get:(o,k)=>k in o?o[k]:(/^[A-Z_]+$/.test(k)?1:()=>({}))});canvas.getContext=()=>gl;
globalThis.document={hidden:false,body:new Element('body',''),activeElement:new Element('body',''),querySelector:s=>nodes.get(s.replace('#','')),getElementById:id=>nodes.get(id),createElement:()=>new Element('new'),createTextNode:t=>t,addEventListener(){},removeEventListener(){}};
let saved=null;
globalThis.window={devicePixelRatio:1,location:{hash:'#lobby'},localStorage:{getItem:()=>saved,setItem:(key,value)=>saved=value},matchMedia:()=>({matches:false}),addEventListener:(name,fn)=>windowEvents[name]=fn,removeEventListener(){},history:{pushState(data,title,hash){window.location.hash=hash;},replaceState(data,title,hash){window.location.hash=hash;}}};
globalThis.CSS={escape:s=>s};globalThis.requestAnimationFrame=fn=>{raf.push(fn);return raf.length;};globalThis.cancelAnimationFrame=()=>{};
const tick=()=>{const work=raf.splice(0);for(const fn of work)fn(performance.now()+100);};
const click=(action,value='',scope='screen')=>{const b=new Element('button',scope);b.dataset={action,value};b.tagName='BUTTON';b.closest=()=>b;b.textContent=action;app.handlers.click({target:b});};
await import('../src/app.js');tick();tick();
assert.ok(nodes.get('screen-root').innerHTML.includes('START'));
click('nav','cards');tick();tick();assert.ok(nodes.get('screen-root').innerHTML.includes('CARD COLLECTION'));
click('open-pack','opm');click('open-pack','opm');tick();tick();assert.equal(JSON.parse(saved).packs,2,'double tap must spend one pack');assert.ok(nodes.get('modal-root').innerHTML.includes('Pack opened'));
click('nav','inventory');tick();assert.equal(window.location.hash,'#cards','background nav must be blocked');
click('dismiss','','modal');tick();click('nav','inventory');tick();assert.equal(window.location.hash,'#inventory/outfit');
let input=new Element('search');input.value='field';input.type='search';input.tagName='INPUT';input.selectionStart=5;input.selectionEnd=5;nodes.set('search',input);document.activeElement=input;
const html=nodes.get('screen-root').innerHTML;app.handlers.input({target:input});tick();
assert.equal(nodes.get('screen-root').innerHTML,html,'search must leave screen/input intact');assert.ok(nodes.get('grid').innerHTML.includes('Field Explorer'));assert.equal(document.activeElement,input);

click('settings');tick();
const dialog=nodes.get('dialog'),quality=nodes.get('quality');dialog.scrollTop=180;quality.tagName='SELECT';quality.value='low';document.activeElement=quality;
app.handlers.change({target:quality});tick();assert.equal(dialog.scrollTop,180,'settings updates must preserve an overflowing dialog scroll position');
});
