import test from 'node:test';
import assert from 'node:assert/strict';
import {Scene} from '../src/scene.js';
import {fresh,equipItem} from '../src/model.js';
import {createPlayer,defaultAppearance} from '../src/player.js';
import {sceneOptions} from '../src/preview.js';
function fixture(){
 const events={},stats={uploads:0,draws:0,scheduled:0};
 const gl=new Proxy({getShaderParameter:()=>true,getProgramParameter:()=>true,getAttribLocation:()=>0,bufferData:(target,data)=>{assert.ok(data.every(Number.isFinite));stats.uploads++;stats.vertices=data.length/9;},drawArrays:()=>stats.draws++},{get:(o,k)=>k in o?o[k]:(/^[A-Z_]+$/.test(k)?1:()=>({}))});
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

test('creator appearance changes rebuild geometry and removing weapon changes the model',()=>{
 const {scene,stats}=fixture();const options={type:'create',starter:true,outfit:'bunny',color:'#eaf3f1',accent:'#50acda',weapon:'standard',gender:'female',face:0,hair:0,hairColor:0};
 scene.set(options);scene.frame(100);const first=stats.uploads;
 scene.set({...options,hair:1});scene.frame(200);assert.ok(stats.uploads>first,'hair is part of the geometry cache identity');
 const held=stats.vertices;scene.set({...options,hair:1,weapon:'none'});scene.frame(300);assert.ok(stats.vertices<held,'removed weapon must no longer contribute vertices');
 for(const gender of ['male','female'])for(let hair=0;hair<9;hair++){scene.set({...options,gender,hair,face:hair%8,hairColor:hair%6,weapon:'none'});scene.frame(400+hair*100);assert.ok(stats.vertices>100);}
});

test('X-Suit geometry remains visible when a novice has starter or basic gear equipped',()=>{
 const {scene}=fixture(),state=fresh();createPlayer(state,{name:'New Player',appearance:defaultAppearance()},1);
 for(const outfit of ['bunny','hoodie','cadet','none']){
  equipItem(state,'outfit',outfit);
  const options=sceneOptions({view:'xsuit',preview:'azure',stage:0,form:0},state);
  scene.set(options);scene.frame(100);const suitVertices=scene.modelCount;
  scene.set({...options,type:'avatar'});scene.frame(200);
  assert.ok(suitVertices>scene.modelCount,'X-Suit decorations must be present regardless of equipped gear');
 }
});
