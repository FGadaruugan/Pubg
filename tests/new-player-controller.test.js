import test from 'node:test';
import assert from 'node:assert/strict';
test('new player controller enforces setup and preserves the created profile',async()=>{
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
let saved=null,writes=0;
globalThis.window={devicePixelRatio:1,location:{hash:'#inventory/weapon'},localStorage:{getItem:()=>saved,setItem:(key,value)=>{saved=value;writes++;}},matchMedia:()=>({matches:false}),addEventListener:(name,fn)=>windowEvents[name]=fn,removeEventListener(){},history:{pushState(data,title,hash){window.location.hash=hash;},replaceState(data,title,hash){window.location.hash=hash;}}};
globalThis.CSS={escape:s=>s};globalThis.requestAnimationFrame=fn=>{raf.push(fn);return raf.length;};globalThis.cancelAnimationFrame=()=>{};
const tick=()=>{const work=raf.splice(0);for(const fn of work)fn(performance.now()+100);};
const click=(action,value='',scope='screen')=>{const b=new Element('button',scope);b.dataset={action,value};b.tagName='BUTTON';b.closest=()=>b;b.textContent=action;app.handlers.click({target:b});};
await import('../src/app.js');tick();tick();
assert.equal(window.location.hash,'#welcome');assert.ok(nodes.get('screen-root').innerHTML.includes('CREATE LOCAL PLAYER'));
click('nav','create');tick();tick();assert.equal(window.location.hash,'#create');
click('appearance','gender:male');click('appearance','face:3');click('appearance','hair:1');click('appearance','hairColor:5');click('appearance','outfit:hoodie');tick();
globalThis.FormData=class {constructor(form){this.form=form;}get(name){return this.form.fields[name];}};
const form={id:'create-form',fields:{name:'New_Hero'}};
app.handlers.submit({target:form,preventDefault(){}});
assert.equal(window.location.hash,'#intro');assert.equal(writes,1);
app.handlers.submit({target:form,preventDefault(){}});assert.equal(writes,1,'stale Create events must be ignored after navigation');tick();tick();
let state=JSON.parse(saved);assert.equal(state.player.level,1);assert.equal(state.player.coins,0);assert.equal(state.appearance.gender,'male');assert.equal(state.appearance.hairColor,5);
click('nav','lobby');tick();assert.equal(window.location.hash,'#intro','unfinished introduction cannot be bypassed through navigation');
click('intro-finish');tick();tick();assert.equal(window.location.hash,'#lobby');assert.ok(nodes.get('screen-root').innerHTML.includes('Classic · Unranked'));
click('nav','inventory');tick();click('unequip','outfit');tick();assert.equal(JSON.parse(saved).equipped.outfit,'none');
click('nav','create');tick();click('appearance','hairColor:2');form.fields.name='New_Hero2';app.handlers.submit({target:form,preventDefault(){}});tick();
state=JSON.parse(saved);assert.equal(state.name,'New_Hero2');assert.equal(state.equipped.outfit,'none');assert.equal(state.appearance.hairColor,2);assert.equal(state.rating,0);
click('nav','wow');tick();click('wow-start');tick();assert.equal(JSON.parse(saved).wowSeen,true);
});
