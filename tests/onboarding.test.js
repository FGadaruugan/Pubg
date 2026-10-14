import test from 'node:test';
import assert from 'node:assert/strict';
import {renderScreens,inventoryGrid} from '../src/screens.js';
import {fresh} from '../src/model.js';
import {createPlayer,defaultAppearance} from '../src/player.js';
const base={view:'welcome',tab:'outfit',preview:'bunny',stage:0,form:0,season:'classic',profile:'basic',collection:'opm',search:'',owned:true,sort:'quality',modal:null,saveStatus:'saved',createDraft:{name:'Hero',appearance:defaultAppearance()}};
test('all six onboarding screens render their own connected actions',()=>{
 const s=fresh();for(const view of ['welcome','create','guide','intro','wow','rookie']){
  const html=renderScreens({...base,view},s).screen;assert.ok(html.length>200,view);assert.ok(html.includes('data-action='),view);
 }
});
test('fresh lobby, Season and profile never inherit reference ranks or match history',()=>{
 const s=fresh();createPlayer(s,{name:'Hero',appearance:defaultAppearance()},1700000000000);s.introSeen=true;
 const lobby=renderScreens({...base,view:'lobby'},s).screen;assert.ok(lobby.includes('Lv. 1'));assert.ok(lobby.includes('Classic · Unranked'));assert.ok(lobby.includes('UC <b>0</b>'));
 const season=renderScreens({...base,view:'season'},s).screen;assert.ok(season.includes('No matches recorded'));assert.ok(!season.includes('2429'));
 const profile=renderScreens({...base,view:'profile'},s).screen;assert.ok(profile.includes('New player'));assert.ok(!profile.includes('3154'));assert.ok(!profile.includes('3 years'));
 const history=renderScreens({...base,view:'profile',profile:'career'},s).screen;assert.ok(history.includes('No matches yet'));assert.ok(!history.includes('2429'));
 const inventory=inventoryGrid(base,s);assert.ok(inventory.includes('Bunny Girl Set'));assert.ok(!inventory.includes('Azure Empress'));
});
test('character name remains escaped and gender controls are distinct',()=>{
 const s=fresh();const html=renderScreens({...base,view:'create',createDraft:{name:'<img>',appearance:{...defaultAppearance(),gender:'male'}}},s).screen;
 assert.ok(html.includes('value="&lt;img&gt;"'));assert.ok(html.includes('creation-male.jpg'));assert.ok(html.includes('data-value="gender:female"'));
});
