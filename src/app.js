import {catalogs} from './catalog.js';
import {gateRoute,defaultAppearance,validDraft} from './player.js';
import {createStore} from './store.js';
import {createRouter} from './router.js';
import {renderScreens,inventoryGrid} from './screens.js';
import {icon} from './icons.js';
import {Scene} from './scene.js';
import {sceneOptions} from './preview.js';

const app=document.querySelector('#app');
app.innerHTML='<div id="screen-root" class="screen-root"></div><div id="modal-root"></div>';
const screenRoot=document.querySelector('#screen-root'),modalRoot=document.querySelector('#modal-root');
let storage;try{storage=window.localStorage;}catch{storage=undefined;}
const store=createStore({storage}),router=createRouter();
const ui={view:'lobby',workshop:false,tab:'outfit',preview:'azure',stage:0,form:0,season:'classic',profile:'basic',collection:'opm',search:'',owned:false,sort:'quality',modal:null,reveal:null,saveStatus:store.status,createDraft:null,nameRoll:0,namesOpen:false,createError:'',introStep:0,guideStep:0,wowEntered:false};
let scene;
try{scene=new Scene(document.querySelector('#scene'));}catch(error){
 console.error('3D initialization failed',error);scene={set(){}};
 const fallback=document.createElement('div');fallback.className='webgl-fallback';fallback.textContent='3D preview is unavailable. Collection menus remain ready.';app.before(fallback);
}
let pending=null,queued=false,previousRoute='',lastScene='',focusReturn=null,modalOpen=false,commandNumber=0;
const scrollSelectors=['.item-grid','.cards-grid','.goal-track','.showroom-catalog','.rail','.data-content','.profile-card','.shop-grid','.roster','.dialog','.creation-options'];
function notice(message,kind='success'){
 const node=document.querySelector('#toast');node.replaceChildren();
 node.insertAdjacentHTML('beforeend',icon(kind==='success'?'check':'info'));
 node.append(document.createTextNode(message));node.dataset.kind=kind;node.classList.add('show');
 clearTimeout(notice.timer);notice.timer=setTimeout(()=>node.classList.remove('show'),4000);
}
function command(action){
 const result=store.dispatch({...action,id:'ui-'+(++commandNumber)});
 if(result.ok && !result.persisted)notice('Session-д хадгаллаа. Browser storage ашиглах боломжгүй.','info');
 return result;
}
function configureScene(){
 const options=sceneOptions(ui,store.getState());
 const key=JSON.stringify(options);if(key!==lastScene){lastScene=key;scene.set(options);}
}
function focusSnapshot(){
 const node=document.activeElement;
 if(!app.contains(node))return null;
 return {id:node.id,action:node.dataset?.action,value:node.dataset?.value,start:node.selectionStart,end:node.selectionEnd};
}
function findControl(focus){
 if(!focus)return null;
 if(focus.id)return document.getElementById(focus.id);
 return [...app.querySelectorAll('[data-action]')].find(n=>n.dataset.action===focus.action&&n.dataset.value===focus.value);
}
function restoreFocus(focus){
 const node=findControl(focus);if(!node)return;node.focus({preventScroll:true});
 if(typeof focus.start==='number'&&node.setSelectionRange && ['text','search'].includes(node.type))node.setSelectionRange(focus.start,focus.end);
}
function flush(){
 queued=false;const flags=pending||{};pending=null;
 const state=store.getState();ui.saveStatus=store.status;
 const routeKey=JSON.stringify(router.getRoute()),changedRoute=routeKey!==previousRoute;
 const focus=focusSnapshot();const scroll=[];
 if(!changedRoute)for(const selector of scrollSelectors){const node=app.querySelector(selector);if(node)scroll.push([selector,node.scrollLeft,node.scrollTop]);}
 if(flags.screen){
  const html=renderScreens(ui,state);screenRoot.innerHTML=html.screen;
  if(changedRoute){screenRoot.classList.remove('screen-enter');void screenRoot.offsetWidth;screenRoot.classList.add('screen-enter');}
  modalRoot.innerHTML=html.dialog;
 }else{
  if(flags.grid){const grid=screenRoot.querySelector('.item-grid');if(grid)grid.innerHTML=inventoryGrid(ui,state);}
  if(flags.dialog)modalRoot.innerHTML=renderScreens(ui,state,{dialogOnly:true}).dialog;
 }
 document.body.dataset.view=ui.view;
 for(const [selector,x,y] of scroll){const node=app.querySelector(selector);if(node){node.scrollLeft=x;node.scrollTop=y;}}
 for(const node of screenRoot.querySelectorAll('.item,.collectible,.rail button,.stage-list button,.goal-track button'))node.setAttribute('aria-pressed',String(node.classList.contains('selected')||node.classList.contains('active')));
 for(const node of app.querySelectorAll('.gear-remove'))node.setAttribute('aria-label','Remove equipped item');
 for(const node of app.querySelectorAll('.close,.dialog-close'))node.setAttribute('aria-label','Close screen');
 const workshopButton=app.querySelector('[data-action="workshop"]');if(workshopButton)workshopButton.setAttribute('aria-expanded',String(ui.workshop));
 screenRoot.inert=Boolean(ui.modal);document.querySelector('#scene').style.pointerEvents=ui.modal?'none':'';
 if(ui.modal){
  if(!modalOpen)focusReturn=focus;
  if(!modalOpen||flags.dialog||flags.screen){
   if(modalOpen && focus?.id && modalRoot.querySelector('#'+CSS.escape(focus.id)))restoreFocus(focus);
   else modalRoot.querySelector('input,select,button')?.focus({preventScroll:true});
  }
 }else if(modalOpen)restoreFocus(focusReturn);
 else if(!changedRoute)restoreFocus(focus);
 modalOpen=Boolean(ui.modal);previousRoute=routeKey;configureScene();
}
function schedule(kind='screen'){
 pending=pending||{};pending[kind]=true;if(kind==='screen')pending.dialog=true;
 if(!queued){queued=true;requestAnimationFrame(flush);}
}
function applyRoute(route){
 const state=store.getState(),gated=gateRoute(route,state);
 if(gated.view!==route.view){router.go(gated,{replace:true});return;}
 if(route.view==='create'&&(ui.view!=='create'||!ui.createDraft)){
  ui.createDraft={name:state.player.created?state.name:'',appearance:{...state.appearance}};ui.namesOpen=false;ui.createError='';
 }
 if(route.view==='intro'&&ui.view!=='intro')ui.introStep=0;
 if(route.view==='wow'&&ui.view!=='wow')ui.wowEntered=false;
 Object.assign(ui,route,{modal:null,workshop:false,stage:0,form:0,search:'',owned:route.view==='inventory'&&state.player.created&&!state.player.legacy});
 if(route.view==='inventory')ui.preview=state.equipped[route.tab];
 else if(['character','vehicle'].includes(route.view))ui.preview=state.equipped[route.view];
 else if(route.view==='lab')ui.preview='nature';
 else if(route.view==='companion')ui.preview='kitten';
 else if(route.view==='xsuit')ui.preview='azure';
 schedule();
}
function navigate(view){router.go({view});}
function showDialog(dialog){ui.modal=dialog;schedule('dialog');}
function dismiss(){ui.modal=null;schedule('dialog');}
function back(){if(ui.modal)dismiss();else if(ui.workshop){ui.workshop=false;schedule();}else router.back();}
store.subscribe((state,meta)=>schedule(meta.type==='settings'?'dialog':'screen'));
router.subscribe(applyRoute);
app.addEventListener('click',event=>{
 const button=event.target.closest('[data-action]');if(!button||button.disabled)return;
 if(ui.modal && !modalRoot.contains(button))return;
 const {action,value}=button.dataset,state=store.getState();
 switch(action){
  case 'nav':navigate(value);return;
  case 'back':back();return;
  case 'dismiss':dismiss();return;
  case 'info':showDialog({title:'Details',text:value});return;
  case 'workshop':ui.workshop=!ui.workshop;schedule();return;
  case 'settings':showDialog('settings');return;
  case 'modes':showDialog('modes');return;
  case 'inventory-tab':router.go({view:'inventory',tab:value});return;
  case 'preview':{
   const kind=ui.view==='lab'?'weapon':ui.view==='inventory'?ui.tab:ui.view;
   if(catalogs[kind]?.some(x=>x.id===value)){ui.preview=value;ui.stage=0;schedule();}return;
  }
  case 'appearance':{
   if(ui.view!=='create'||!ui.createDraft)return;
   const [key,raw]=value.split(':');if(!['gender','face','hair','hairColor','outfit'].includes(key))return;
   const appearance={...ui.createDraft.appearance,[key]:['face','hair','hairColor'].includes(key)?Number(raw):raw};
   if(validDraft({name:'Preview',appearance})){ui.createDraft.appearance=appearance;ui.createError='';schedule();}return;
  }
  case 'suggest-names':ui.nameRoll++;ui.namesOpen=true;schedule();return;
  case 'use-name':if(ui.createDraft){ui.createDraft.name=value;ui.namesOpen=false;ui.createError='';schedule();}return;
  case 'intro-step':{const n=Number(value);if(Number.isInteger(n)&&n>=0&&n<3){ui.introStep=n;schedule();}return;}
  case 'intro-next':ui.introStep=Math.min(2,ui.introStep+1);schedule();return;
  case 'intro-finish':if(command({type:'intro/seen'}).ok)router.go({view:'lobby'});return;
  case 'guide-step':{const n=Number(value);if(Number.isInteger(n)&&n>=0&&n<6){ui.guideStep=n;schedule();}return;}
  case 'wow-start':command({type:'wow/seen'});ui.wowEntered=true;schedule();return;
  case 'unequip':if(command({type:'unequip',kind:value}).ok){ui.preview='none';schedule();notice('Item removed');}return;
  case 'equip':{
   const [kind,item]=value.split(':');const result=command({type:'equip',kind,item});
   if(result.ok && result.persisted)notice('Equipped · сонголт хадгалагдлаа');
   else if(!result.ok)notice('Түгжээтэй item · зөвхөн preview боломжтой','info');return;
  }
  case 'save-look':if(command({type:'look/save'}).persisted)notice('Look saved');return;
  case 'looks':{
   const result=command({type:'look/apply'});
   if(result.ok){ui.preview=store.getState().equipped[ui.tab];if(result.persisted)notice('Saved look applied');}
   else notice('Эхлээд Save Look дарж хувцаслалтаа хадгална уу.','info');return;
  }
  case 'collection':router.go({view:'cards',tab:'detail',collection:value});ui.modal=null;schedule('dialog');return;
  case 'card-overview':router.go({view:'cards',tab:'overview'});return;
  case 'card-info':showDialog({title:'Collection card',text:`Owned copies: ${state.cards[value]||0}. Cards come from local sample packs. Online trading is not connected.`});return;
  case 'open-pack':{
   const result=command({type:'pack/open',collection:value});
   if(result.ok){ui.collection=value;ui.reveal=result.value;showDialog('pack');}
   else showDialog({title:'No sample packs available',text:result.error==='This action is not available.'?'Your starter packs have been used. View your cards or reset local demo progress in Settings.':result.error});return;
  }
  case 'stage':{const n=Number(value);if(Number.isInteger(n)&&n>=0&&n<(ui.view==='vehicle'?4:7)){ui.stage=n;schedule();}return;}
  case 'form':{const n=Number(value);if(Number.isInteger(n)&&n>=0&&n<3){ui.form=n;schedule();}return;}
  case 'season-tab':router.go({view:'season',season:value});return;
  case 'goals':router.go({view:'season',tab:'goals'});return;
  case 'season-overview':router.go({view:'season',season:ui.season});return;
  case 'goal':if(command({type:'goal',points:Number(value)}).persisted)notice('Season goal saved · rank өөрчлөгдөөгүй');return;
  case 'rewards':showDialog({title:'Tier rewards',text:'Tier-based rewards belong to the official game. Your selected goal is saved separately from the reference rank.'});return;
  case 'profile-tab':router.go({view:'profile',profile:value});return;
  case 'rename':showDialog('rename');return;
  case 'roster':showDialog('roster');return;
  case 'roster-select':ui.preview=value;ui.modal=null;schedule();return;
  case 'reset-confirm':showDialog('reset');return;
  case 'reset':command({type:'reset'});ui.modal=null;router.go({view:'welcome'});schedule();return;
  case 'shop-tab':showDialog({title:button.textContent,text:'Event Shop contains the current reference catalog. This additional section is not connected.'});return;
 }
});
app.addEventListener('input',event=>{
 if(event.target.id==='search'){ui.search=event.target.value;schedule('grid');}
 if(event.target.id==='player-name'&&ui.createDraft){ui.createDraft.name=event.target.value;ui.createError='';const error=document.getElementById('create-error');if(error)error.textContent='';}
});
app.addEventListener('change',event=>{
 const {id,value,checked}=event.target;
 if(id==='owned'){ui.owned=checked;schedule('grid');}
 if(id==='sort'){ui.sort=value;schedule('grid');}
 if(id==='motion')command({type:'settings',key:'motion',value:checked});
 if(id==='quality')command({type:'settings',key:'quality',value});
});
app.addEventListener('submit',event=>{
 if(event.target.id==='create-form'){
  event.preventDefault();if(ui.view!=='create')return;const state=store.getState();const name=new FormData(event.target).get('name');
  const input={name,appearance:ui.createDraft?.appearance};
  if(!validDraft(input)){ui.createError='3–20 letters, numbers, spaces, underscores or hyphens are required.';schedule();return;}
  const result=command({type:state.player.created?'player/update':'player/create',...input});
  if(result.ok)router.go({view:state.player.created?'lobby':'intro'});
  else{ui.createError=result.error;schedule();}return;
 }
 if(event.target.id!=='name-form')return;event.preventDefault();
 const result=command({type:'rename',name:new FormData(event.target).get('name')});
 if(result.ok){dismiss();if(result.persisted)notice('Display name saved');}
});
document.addEventListener('keydown',event=>{
 if(event.key==='Escape'){event.preventDefault();back();}
 if(event.key==='Tab'&&ui.modal){
  const nodes=[...modalRoot.querySelectorAll('button,input,select')].filter(n=>!n.disabled),first=nodes[0],last=nodes.at(-1);
  if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}
  else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
 }
 if(!ui.modal && event.key.toLowerCase()==='i'&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)&&!event.ctrlKey&&!event.metaKey&&!event.altKey)navigate('inventory');
});
applyRoute(router.getRoute());
