import test from 'node:test';
import assert from 'node:assert/strict';
import { defaults, normalize, purchase, equip, recordRound, claim, load, save } from '../src/state.js';

test('invalid persisted data recovers without granting arbitrary inventory', () => {
 const s = normalize({coins:-5,owned:['injected'],outfit:'injected',settings:{volume:999},stats:{hits:-1}});
 assert.equal(s.coins,0); assert.equal(s.outfit,'classic'); assert.deepEqual(s.owned,['classic','steel']); assert.equal(s.settings.volume,100); assert.equal(s.stats.hits,0);
});
test('buy once, equip owned item only, and reject insufficient balance', () => {
 const s=defaults(); assert.equal(equip(s,'ghost'),false); assert.equal(purchase(s,'ghost'),false);
 assert.equal(purchase(s,'ranger'),true); assert.equal(s.coins,350); assert.equal(purchase(s,'ranger'),false); assert.equal(s.coins,350); assert.equal(equip(s,'ranger'),true); assert.equal(s.outfit,'ranger');
});
test('earned training reward cannot be claimed twice even after reload', () => {
 let s=defaults(); assert.equal(claim(s,'first-round'),false);
 recordRound(s,{hits:10,shots:12}); assert.equal(s.stats.rounds,1); assert.equal(s.stats.hits,10); assert.equal(s.coins,850);
 assert.equal(claim(s,'first-round'),true); assert.equal(s.coins,1050);
 s=normalize(JSON.parse(JSON.stringify(s))); assert.equal(claim(s,'first-round'),false); assert.equal(s.coins,1050);
});
test('storage failure uses usable defaults and save reports persistence unavailable', () => {
 const storage={getItem(){throw Error('blocked')},setItem(){throw Error('blocked')}};
 assert.equal(load(storage).name,'PLAYER_01'); assert.equal(save(defaults(),storage),false);
});
test('invalid JSON and unsupported mode settings recover safely', () => {
 assert.equal(load({getItem(){return '{invalid'}}).name,'PLAYER_01');
 const s=normalize({mode:'unknown',map:'unknown',team:'unknown',name:'  ',settings:{quality:'bad',volume:'oops'}});
 assert.equal(s.mode,'training'); assert.equal(s.map,'erangel'); assert.equal(s.team,'solo'); assert.equal(s.name,'PLAYER_01'); assert.equal(s.settings.volume,35);
});
