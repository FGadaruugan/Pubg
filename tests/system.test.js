import test from 'node:test';
import assert from 'node:assert/strict';
import * as system from '../src/store.js';
import * as routes from '../src/router.js';
const memory=()=>{let text=null;return {getItem:()=>text,setItem:(key,value)=>text=value};};
test('published state is immutable and equip respects ownership',()=>{
 const s=system.createStore({storage:memory()});let before=s.getState();
 assert.throws(()=>before.equipped.outfit='royal',TypeError);
 assert.equal(s.dispatch({type:'equip',kind:'outfit',item:'royal'}).ok,false);
 assert.equal(s.getState(),before);
 assert.equal(s.dispatch({type:'equip',kind:'outfit',item:'field'}).ok,true);
 assert.equal(s.getState().equipped.outfit,'field');assert.equal(before.equipped.outfit,'azure');
});
test('pack command IDs prevent duplicate debit and return original reveal',()=>{
 const s=system.createStore({storage:memory(),rng:()=>0});let events=0;s.subscribe(()=>events++);
 const command={type:'pack/open',collection:'opm',id:'tap-1'};
 let first=s.dispatch(command),second=s.dispatch(command);
 assert.equal(first.ok,true);assert.equal(second.duplicate,true);
 assert.deepEqual(second.value,first.value);assert.equal(s.getState().packs,2);assert.equal(events,1);
 assert.equal(s.getState().cards['opm-0'],3);
});
test('throwing pack draw leaves every field unchanged',()=>{
 let count=0;const s=system.createStore({storage:memory(),rng:()=>{if(++count===2)throw Error('draw failed');return 0;}});
 const before=s.getState();assert.equal(s.dispatch({type:'pack/open',collection:'opm'}).ok,false);
 assert.equal(s.getState(),before);
});
test('storage failure commits in memory and reports its status',()=>{
 const s=system.createStore({storage:{getItem:()=>null,setItem:()=>{throw Error('quota');}}});
 const result=s.dispatch({type:'goal',points:3200});assert.equal(result.ok,true);assert.equal(result.persisted,false);
 assert.equal(s.getState().goal,3200);assert.equal(s.getState().rating,2429);assert.equal(s.status,'memory');
});
test('settings reject malformed values and a saved state can be reloaded',()=>{
 const storage=memory(),s=system.createStore({storage});
 assert.equal(s.dispatch({type:'settings',key:'quality',value:'ultra-invalid'}).ok,false);
 assert.equal(s.dispatch({type:'rename',name:'  HELLO  '}).ok,true);
 assert.equal(s.dispatch({type:'settings',key:'quality',value:'low'}).ok,true);
 const reloaded=system.createStore({storage});assert.equal(reloaded.getState().name,'HELLO');assert.equal(reloaded.getState().settings.quality,'low');
});
test('route input normalizes to valid screen/catalog choices',()=>{
 assert.deepEqual(routes.parseRoute('#cards/opm'),{view:'cards',tab:'detail',collection:'opm'});
 assert.deepEqual(routes.parseRoute('#season/goals'),{view:'season',tab:'goals',season:'classic'});
 assert.equal(routes.parseRoute('#not-a-screen').view,'lobby');
 assert.equal(routes.parseRoute('#cards/%E0%A4%A').view,'cards');
 assert.equal(routes.parseRoute('#inventory/royal').tab,'outfit');
 assert.equal(routes.routeHash({view:'profile',profile:'statistics'}),'#profile/statistics');
});
test('router publishes Back and Forward destinations without invalid subroutes',()=>{
 const handlers={},history=['#lobby'];let index=0;
 const target={location:{hash:history[0]},addEventListener:(name,fn)=>handlers[name]=fn,removeEventListener(){},history:{
  pushState(data,title,hash){history.splice(++index);history.push(hash);target.location.hash=hash;},
  replaceState(data,title,hash){history[index]=hash;target.location.hash=hash;}
 }};
 const router=routes.createRouter(target);const seen=[];router.subscribe(route=>seen.push(route));
 router.go({view:'inventory',tab:'weapon'});router.go({view:'profile',profile:'statistics'});
 target.location.hash=history[--index];handlers.popstate();assert.equal(router.getRoute().view,'inventory');assert.equal(router.getRoute().tab,'weapon');
 target.location.hash=history[++index];handlers.popstate();assert.equal(router.getRoute().profile,'statistics');assert.equal(seen.length,4);
 router.destroy();
});
