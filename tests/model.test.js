import test from 'node:test';
import assert from 'node:assert/strict';
import * as m from '../src/model.js';
test('locked preview cannot be equipped',()=>{const s=m.fresh();assert.equal(m.equipItem(s,'outfit','royal'),false);assert.equal(s.equipped.outfit,'azure');assert.equal(m.equipItem(s,'outfit','field'),true);});
test('pack opens once and cannot overdraft',()=>{const s=m.fresh();s.packs=1;const result=m.openPack(s,'opm',()=>0);assert.equal(result.length,3);assert.equal(s.packs,0);assert.equal(m.openPack(s,'opm',()=>0),null);assert.equal(s.cards['opm-0'],3);});
test('season goal never changes rating',()=>{const s=m.fresh();assert.equal(m.setGoal(s,3200),true);assert.equal(s.goal,3200);assert.equal(s.rating,2429);assert.equal(m.setGoal(s,7893),false);});
test('malformed saved ownership and selections are normalized',()=>{const s=m.normalize({packs:-4,equipped:{outfit:'royal'},cards:{'opm-0':-10},goal:NaN});assert.equal(s.packs,0);assert.equal(s.equipped.outfit,'azure');assert.equal(s.cards['opm-0']||0,0);assert.equal(s.goal,2700);});
test('corrupted storage is recoverable',()=>{assert.equal(m.load({getItem(){throw Error('blocked')}}).equipped.outfit,'azure');assert.equal(m.save(m.fresh(),{setItem(){throw Error('quota')}}),false);});
test('all roster upgrades remain locked without ownership',()=>{const s=m.fresh();assert.equal(m.equipItem(s,'character','sara'),false);assert.equal(m.equipItem(s,'character','victor'),true);assert.equal(m.equipItem(s,'weapon','nature'),false);});
