import test from 'node:test';
import assert from 'node:assert/strict';
import {fresh,equipItem,ownedItem} from '../src/model.js';
import {createPlayer,defaultAppearance} from '../src/player.js';
import {sceneOptions} from '../src/preview.js';

function novice(){const state=fresh();createPlayer(state,{name:'New Player',appearance:defaultAppearance()},1);return state;}
test('locked outfit preview renders its own model without inheriting the equipped starter model',()=>{
 const state=novice(),ui={view:'inventory',tab:'outfit',preview:'azure',stage:0,form:0};
 const options=sceneOptions(ui,state);
 assert.equal(options.starter,false);assert.equal(options.outfit,'azure');
 assert.equal(ownedItem(state,'outfit','azure'),false);assert.equal(state.equipped.outfit,'bunny');
 for(const outfit of ['hoodie','cadet','none']){
  equipItem(state,'outfit',outfit);
  const preview=sceneOptions(ui,state);
  assert.equal(preview.starter,false);assert.equal(preview.outfit,'azure');
  assert.equal(preview.color,options.color);assert.equal(preview.accent,options.accent);
 }
});
test('X-Suit preview selects its own model after equipping or removing any starter outfit',()=>{
 const state=novice(),ui={view:'xsuit',preview:'azure',stage:0,form:0};
 for(const outfit of ['bunny','hoodie','cadet','none']){
  equipItem(state,'outfit',outfit);
  const options=sceneOptions(ui,state);
  assert.equal(options.starter,false);assert.equal(options.outfit,'xsuit');
  assert.equal(options.type,'xsuit');assert.equal(state.equipped.outfit,outfit);
 }
});
