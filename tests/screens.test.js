import test from 'node:test';
import assert from 'node:assert/strict';
import {renderScreens,inventoryGrid} from '../src/screens.js';
import {fresh} from '../src/model.js';
const base={view:'lobby',workshop:false,tab:'outfit',preview:'azure',stage:0,form:0,season:'classic',profile:'basic',collection:'opm',search:'',owned:false,sort:'quality',modal:null,reveal:null,saveStatus:'saved'};
test('every full screen renders from the same valid state',()=>{
 const s=fresh();
 for(const view of ['lobby','inventory','cards','season','profile','shop','xsuit','lab','vehicle','companion','character']){
  const screen=renderScreens({...base,view,preview:view==='lab'?'nature':view==='vehicle'?'buggy':view==='companion'?'kitten':view==='character'?'default':'azure'},s).screen;
  assert.ok(screen.length>200,view);assert.ok(screen.includes('data-action='),view);
 }
});
test('search matches names without rebuilding input markup and only owned items pass filter',()=>{
 const grid=inventoryGrid({...base,search:'  field ',owned:true},fresh());
 assert.ok(grid.includes('Field Explorer'));assert.ok(!grid.includes('Azure Empress'));assert.ok(!grid.includes('<input'));
 assert.ok(inventoryGrid({...base,search:'not-here'},fresh()).includes('No matching items'));
});
test('player and information text are escaped at the template boundary',()=>{
 const s=fresh();s.name='<img src=x onerror=alert(1)>';
 assert.ok(renderScreens(base,s).screen.includes('&lt;img'));
 const dialog=renderScreens({...base,modal:{title:'<script>',text:'<b>unsafe</b>'}},s,{dialogOnly:true});
 assert.equal(dialog.screen,'');assert.ok(dialog.dialog.includes('&lt;script&gt;'));assert.ok(dialog.dialog.includes('&lt;b&gt;unsafe'));
});
test('X-Suit form and upgrade stage selections remain independent',()=>{
 const screen=renderScreens({...base,view:'xsuit',form:2,stage:4},fresh()).screen;
 assert.ok(screen.includes('class="selected" data-action="form" data-value="2"'));
 assert.ok(screen.includes('class="active" data-action="stage" data-value="4"'));
});
