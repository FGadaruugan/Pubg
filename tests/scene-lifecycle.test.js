import test from 'node:test';
import assert from 'node:assert/strict';
import {Scene} from '../src/scene.js';
function fixture(){
 const events={},stats={uploads:0,draws:0,scheduled:0};
 const gl=new Proxy({getShaderParameter:()=>true,getProgramParameter:()=>true,getAttribLocation:()=>0,bufferData:(target,data)=>{assert.ok(data.every(Number.isFinite));stats.uploads++;},drawArrays:()=>stats.draws++},{get:(o,k)=>k in o?o[k]:(/^[A-Z_]+$/.test(k)?1:()=>({}))});
 globalThis.window={devicePixelRatio:1,addEventListener(){},removeEventListener(){},matchMedia:()=>({matches:false})};
 globalThis.document={hidden:false,addEventListener(){},removeEventListener(){}};
 globalThis.requestAnimationFrame=()=>{stats.scheduled++;return stats.scheduled;};globalThis.cancelAnimationFrame=()=>{};
 const canvas={getContext:()=>gl,addEventListener:(name,fn)=>events[name]=fn,removeEventListener(){},setPointerCapture(){},clientWidth:900,clientHeight:500};
 return {scene:new Scene(canvas),stats,events,canvas};
}
test('paused showroom does not draw behind the dialog',()=>{const {scene,stats}=fixture();scene.set({type:'avatar',paused:true});scene.frame(100);assert.equal(stats.draws,0);});
test('idle animation reuses GPU geometry rather than reuploading every frame',()=>{
 const {scene,stats}=fixture();scene.set({type:'lobby'});scene.frame(100);const uploads=stats.uploads;
 scene.frame(200);assert.equal(stats.uploads,uploads);assert.ok(stats.draws>0);
});
test('two touch pointers pinch to zoom and loss/restoration events are available',()=>{
 const {scene,events}=fixture();const before=scene.zoom;
 events.pointerdown({pointerId:1,clientX:0,clientY:0});events.pointerdown({pointerId:2,clientX:100,clientY:0});
 events.pointermove({pointerId:2,clientX:160,clientY:0});assert.ok(scene.zoom<before);
 assert.equal(typeof events.webglcontextlost,'function');assert.equal(typeof events.webglcontextrestored,'function');
 let prevented=false;events.webglcontextlost({preventDefault(){prevented=true;}});assert.equal(prevented,true);
});
