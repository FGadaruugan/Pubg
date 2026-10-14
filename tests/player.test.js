import test from 'node:test';
import assert from 'node:assert/strict';
import * as player from '../src/player.js';
import {fresh,normalize,ownedItem,equipItem,load,save} from '../src/model.js';
import {createStore} from '../src/store.js';
const appearance={gender:'female',face:2,hair:1,hairColor:2,outfit:'bunny'};
test('new local player commits chosen appearance and honest empty progress',()=>{
 const state=fresh();assert.equal(player.createPlayer(state,{name:'  New_Hero  ',appearance},1000),true);
 assert.equal(state.name,'New_Hero');assert.equal(state.player.level,1);assert.equal(state.player.coins,0);assert.equal(state.player.uc,0);assert.equal(state.rating,0);
 assert.equal(state.equipped.outfit,'bunny');assert.equal(state.equipped.vehicle,'none');assert.equal(state.equipped.weapon,'standard');assert.equal(state.appearance.hair,1);
 const before=JSON.stringify(state);assert.equal(player.createPlayer(state,{name:'Second',appearance},2000),false);assert.equal(JSON.stringify(state),before);
});
test('invalid creation draft cannot partly mutate the profile',()=>{
 const state=fresh(),before=JSON.stringify(state);
 assert.equal(player.createPlayer(state,{name:'',appearance},100),false);
 assert.equal(player.createPlayer(state,{name:'Valid',appearance:{...appearance,face:99}},100),false);assert.equal(JSON.stringify(state),before);
});
test('first-run gates enforce setup then intro and permit existing profiles',()=>{
 const state=fresh();assert.equal(player.gateRoute({view:'inventory',tab:'weapon'},state).view,'welcome');
 assert.equal(player.gateRoute({view:'create'},state).view,'create');
 player.createPlayer(state,{name:'Hero',appearance},100);
 assert.equal(player.gateRoute({view:'lobby'},state).view,'intro');state.introSeen=true;
 assert.equal(player.gateRoute({view:'lobby'},state).view,'lobby');
});
test('v2 reference saves migrate without losing cards, name or equipped look',()=>{
 const state=normalize({version:2,name:'OLD_PLAYER',packs:1,cards:{'opm-1':2},equipped:{outfit:'field'},goal:3200});
 assert.equal(state.player.created,true);assert.equal(state.player.legacy,true);assert.equal(state.introSeen,true);
 assert.equal(state.name,'OLD_PLAYER');assert.equal(state.cards['opm-1'],2);assert.equal(state.equipped.outfit,'field');assert.equal(state.goal,3200);
});
test('novice starter ownership does not silently unlock the legacy catalog',()=>{
 const state=fresh();player.createPlayer(state,{name:'Hero',appearance},100);
 assert.equal(ownedItem(state,'outfit','bunny'),true);assert.equal(ownedItem(state,'outfit','azure'),false);assert.equal(equipItem(state,'outfit','royal'),false);
 assert.equal(equipItem(state,'outfit','none'),true);assert.equal(state.equipped.outfit,'none');assert.equal(equipItem(state,'weapon','none'),true);
});
test('store appearance edits and reload preserve removal and other progress',()=>{
 let text=null;const storage={getItem:()=>text,setItem:(key,value)=>text=value};const store=createStore({storage,now:()=>100});
 assert.equal(store.dispatch({type:'player/create',name:'Hero',appearance}).ok,true);store.dispatch({type:'intro/seen'});
 store.dispatch({type:'unequip',kind:'outfit'});store.dispatch({type:'goal',points:3200});
 assert.equal(store.dispatch({type:'player/update',name:'Hero2',appearance:{...appearance,hairColor:5}}).ok,true);
 const state=createStore({storage}).getState();assert.equal(state.name,'Hero2');assert.equal(state.appearance.hairColor,5);assert.equal(state.equipped.outfit,'none');assert.equal(state.goal,3200);assert.equal(state.rating,0);
});
