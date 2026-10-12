export const KEY = 'battleground-lobby:v1';
export const themes = [
 {id:'classic',name:'Classic Dawn',rarity:'STANDARD',price:0,color:'#e6be74',filter:'none',description:'The original battleground. Warm light, cold steel.'},
 {id:'ranger',name:'Field Ops',rarity:'RARE',price:400,color:'#98bd84',filter:'sepia(.3) hue-rotate(30deg) saturate(.8)',description:'A muted green atmosphere for your lobby.'},
 {id:'ghost',name:'Nightfall',rarity:'EPIC',price:1200,color:'#a694d9',filter:'brightness(.6) saturate(.65) hue-rotate(175deg)',description:'A cool, moonlit treatment for your lobby.'},
 {id:'ember',name:'Ember Sky',rarity:'RARE',price:600,color:'#ef9b65',filter:'sepia(.35) saturate(1.5)',description:'Golden skies and a warmer battleground.'}
];
export const weapons = [
 {id:'m416',name:'M416',type:'ASSAULT RIFLE',ammo:'5.56 mm',power:43,control:76,rate:78,delay:180},
 {id:'ump',name:'UMP45',type:'SUBMACHINE GUN',ammo:'.45 ACP',power:35,control:89,rate:88,delay:110},
 {id:'kar98',name:'Kar98k',type:'SNIPER RIFLE',ammo:'7.62 mm',power:91,control:42,rate:20,delay:650}
];
export const maps=[{id:'erangel',name:'Erangel',sub:'COASTAL RANGE',color:'#83967c'},{id:'miramar',name:'Miramar',sub:'DESERT RANGE',color:'#c99a6a'},{id:'vikendi',name:'Vikendi',sub:'ALPINE RANGE',color:'#a2c8d9'}];
export const missions=[{id:'first-round',name:'First deployment',description:'Complete a training round',goal:1,stat:'rounds',reward:200},{id:'steady-aim',name:'Steady aim',description:'Hit 25 training targets',goal:25,stat:'hits',reward:350},{id:'regular',name:'Back to the range',description:'Complete 5 training rounds',goal:5,stat:'rounds',reward:500}];
export function defaults(){return {version:1,name:'PLAYER_01',coins:750,owned:['classic','steel'],outfit:'classic',weapon:'m416',mode:'training',map:'erangel',team:'solo',perspective:'tpp',settings:{volume:35,sound:true,quality:'high',motion:true},stats:{rounds:0,hits:0,shots:0,best:0},claimed:[]};}
const number=(v,fallback,min=0,max=1e9)=>Number.isFinite(v)?Math.min(max,Math.max(min,Math.floor(v))):fallback;
const pick=(v,allowed,fallback)=>allowed.includes(v)?v:fallback;
export function normalize(value){
 const d=defaults(), v=value&&typeof value==='object'?value:{};
 d.name=typeof v.name==='string'&&v.name.trim()?v.name.trim().slice(0,20):d.name;
 d.coins=number(v.coins,d.coins);
 d.owned=[...new Set(['classic','steel',...(Array.isArray(v.owned)?v.owned.filter(x=>themes.some(t=>t.id===x)):[])])];
 d.outfit=d.owned.includes(v.outfit)&&themes.some(t=>t.id===v.outfit)?v.outfit:'classic';
 d.weapon=pick(v.weapon,weapons.map(x=>x.id),d.weapon); d.mode=pick(v.mode,['training','classic','arena'],d.mode);d.map=pick(v.map,maps.map(x=>x.id),d.map);d.team=pick(v.team,['solo','duo','squad'],d.team);d.perspective=pick(v.perspective,['tpp','fpp'],d.perspective);
 for(const k of Object.keys(d.stats))d.stats[k]=number(v.stats?.[k],0);
 d.stats.hits=Math.min(d.stats.hits,d.stats.shots);d.stats.best=Math.min(d.stats.best,100);
 d.settings.volume=number(v.settings?.volume,35,0,100);d.settings.quality=pick(v.settings?.quality,['low','high'],d.settings.quality);
 for(const k of ['sound','motion'])if(typeof v.settings?.[k]==='boolean')d.settings[k]=v.settings[k];
 d.claimed=Array.isArray(v.claimed)?[...new Set(v.claimed.filter(x=>missions.some(m=>m.id===x)))]:[];
 return d;
}
export function load(storage){try{return normalize(JSON.parse(storage.getItem(KEY)));}catch{return defaults();}}
export function save(state,storage){try{storage.setItem(KEY,JSON.stringify(state));return true;}catch{return false;}}
export function purchase(state,id){const t=themes.find(x=>x.id===id);if(!t||state.owned.includes(id)||state.coins<t.price)return false;state.coins-=t.price;state.owned.push(id);return true;}
export function equip(state,id){if(!state.owned.includes(id)||!themes.some(t=>t.id===id))return false;state.outfit=id;return true;}
export function recordRound(state,result){const shots=number(result.shots,0,0,10000),hits=number(result.hits,0,0,shots);state.stats.rounds++;state.stats.hits+=hits;state.stats.shots+=shots;const accuracy=shots?Math.round(hits/shots*100):0;state.stats.best=Math.max(state.stats.best,accuracy);const reward=Math.min(500,hits*10);state.coins+=reward;return {hits,shots,accuracy,reward};}
export function claim(state,id){const m=missions.find(x=>x.id===id);if(!m||state.claimed.includes(id)||state.stats[m.stat]<m.goal)return false;state.coins+=m.reward;state.claimed.push(id);return true;}
