import {catalogs,collections,goals} from './catalog.js';
import {freshPlayer,normalizeAppearance} from './player.js';
// Retain the key so existing users keep their v2 saves; schema evolves inside it.
export const KEY='pubg-reference-lobby:v2';
export function fresh(){return {version:3,name:'PLAYER_01',player:freshPlayer(),appearance:normalizeAppearance(),introSeen:false,wowSeen:false,equipped:{outfit:'azure',character:'default',weapon:'violet',vehicle:'buggy',companion:'none'},packs:3,cards:{},goal:2700,rating:2429,settings:{motion:true,quality:'high'},savedLook:null};}
const whole=(n,f=0)=>Number.isFinite(n)?Math.max(0,Math.min(100000,Math.floor(n))):f;
export function ownedItem(state,kind,id){
 const item=catalogs[kind]?.find(x=>x.id===id);if(!item)return false;
 if(item.starter)return true;
 return (!state.player?.created||state.player.legacy)&&Boolean(item.owned);
}
export function normalize(input){
 const d=fresh(),v=input&&typeof input==='object'?input:{};
 if(typeof v.name==='string'&&v.name.trim())d.name=v.name.trim().slice(0,20);
 const legacy=v.version===2&&!v.player;
 if(legacy||v.player?.created===true){
  d.player={...freshPlayer(),created:true,legacy:legacy||v.player?.legacy===true,createdAt:Number.isFinite(v.player?.createdAt)?Math.max(0,Math.floor(v.player.createdAt)):0};
  if(d.player.legacy)Object.assign(d.player,{level:41,collectionLevel:24,coins:303,uc:8});
 }
 d.appearance=normalizeAppearance(v.appearance);d.introSeen=d.player.legacy||v.introSeen===true;d.wowSeen=v.wowSeen===true;
 if(d.player.created&&!d.player.legacy){d.rating=0;d.goal=2200;d.equipped={outfit:d.appearance.outfit,character:'default',weapon:'standard',vehicle:'none',companion:'none'};}
 d.packs=whole(v.packs,d.packs);
 for(const kind of Object.keys(catalogs)){const id=v.equipped?.[kind];if(ownedItem(d,kind,id))d.equipped[kind]=id;}
 for(const c of collections)for(let i=0;i<c.total;i++){const id=`${c.id}-${i}`,count=whole(v.cards?.[id]);if(count)d.cards[id]=count;}
 if(goals.includes(v.goal))d.goal=v.goal;
 if(typeof v.settings?.motion==='boolean')d.settings.motion=v.settings.motion;
 if(v.settings?.quality==='low')d.settings.quality='low';
 if(v.savedLook&&typeof v.savedLook==='object'){d.savedLook={};for(const kind of Object.keys(catalogs)){const id=v.savedLook[kind];if(ownedItem(d,kind,id))d.savedLook[kind]=id;}}
 return d;
}
export function load(storage){try{return normalize(JSON.parse(storage.getItem(KEY)));}catch{return fresh();}}
export function save(s,storage){try{storage.setItem(KEY,JSON.stringify(s));return true;}catch{return false;}}
export function equipItem(s,kind,id){if(!ownedItem(s,kind,id))return false;s.equipped[kind]=id;return true;}
export function setGoal(s,points){if(!goals.includes(points))return false;s.goal=points;return true;}
export function openPack(s,collectionId,rng=Math.random){const c=collections.find(x=>x.id===collectionId);if(!c||s.packs<1)return null;s.packs--;const result=[];for(let i=0;i<3;i++){const roll=Number(rng());const index=Math.min(c.total-1,Math.max(0,Math.floor((Number.isFinite(roll)?roll:0)*c.total)));const id=`${c.id}-${index}`;const duplicate=Boolean(s.cards[id]);s.cards[id]=(s.cards[id]||0)+1;result.push({id,index,duplicate});}return result;}
export function progress(s,id){return Object.keys(s.cards).filter(k=>k.startsWith(id+'-')&&s.cards[k]>0).length;}
