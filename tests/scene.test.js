import test from 'node:test';
import assert from 'node:assert/strict';
import {Scene} from '../src/scene.js';

test('all showroom types emit finite geometry, including default options',()=>{
 let vertices=0;
 const gl=new Proxy({getShaderParameter:()=>true,getProgramParameter:()=>true,getAttribLocation:()=>0,bufferData:(target,data)=>{assert.ok(data.every(Number.isFinite),'geometry must have finite positions, normals and colors');vertices=data.length/9;}},{get:(o,k)=>k in o?o[k]:(/^[A-Z_]+$/.test(k)?1:()=>({}))});
 globalThis.window={devicePixelRatio:1,addEventListener:()=>{}};
 globalThis.document={hidden:false};globalThis.requestAnimationFrame=()=>{};
 const canvas={getContext:()=>gl,addEventListener:()=>{},clientWidth:1200,clientHeight:650};
 const scene=new Scene(canvas);
 for(const type of ['lobby','avatar','vehicle','lab','xsuit','companion']){
  scene.set({type,companion:type==='companion'?'shiba':'none'});scene.frame(100);
  assert.ok(vertices>100,`${type} must emit geometry`);
 }
 for(const companion of ['none','kitten','shiba','bear','penguin']){scene.set({type:'companion',companion});scene.frame(200);assert.ok(vertices>100);}
});
