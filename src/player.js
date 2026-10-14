export const hairColors=['#292c31','#68573e','#a5784d','#d8d8d4','#505b7b','#af477e'];
export const faceTones=['#d6b194','#d1a984','#ba947b','#79583f','#c9a282','#a9836b','#d8b59c','#94735c'];
export const hairNames=['Short bob','Ponytail','Waves','Curly','Buzz cut','Long','Shaved','Braid','Side swept'];
export const starterOutfits=['bunny','hoodie','cadet'];
export const defaultAppearance=()=>({gender:'female',face:0,hair:0,hairColor:0,outfit:'bunny'});
export const freshPlayer=()=>({created:false,legacy:false,createdAt:0,level:1,collectionLevel:1,coins:0,uc:0});
export function normalizeAppearance(value={}){
 const d=defaultAppearance();if(value?.gender==='male')d.gender='male';
 for(const [key,max] of [['face',8],['hair',9],['hairColor',6]])if(Number.isInteger(value?.[key])&&value[key]>=0&&value[key]<max)d[key]=value[key];
 if(starterOutfits.includes(value?.outfit))d.outfit=value.outfit;return d;
}
export function validDraft(input){
 const a=input?.appearance,name=typeof input?.name==='string'?input.name.trim():'';
 return name.length>=3&&name.length<=20&&/^[\p{L}\p{N}_ .-]+$/u.test(name)&&a&&['male','female'].includes(a.gender)&&starterOutfits.includes(a.outfit)&&[['face',8],['hair',9],['hairColor',6]].every(([key,max])=>Number.isInteger(a[key])&&a[key]>=0&&a[key]<max);
}
export function createPlayer(state,input,now=Date.now()){
 if(state.player?.created||!validDraft(input))return false;
 state.name=input.name.trim();state.appearance=normalizeAppearance(input.appearance);
 state.player={...freshPlayer(),created:true,createdAt:Number.isFinite(now)?Math.max(0,Math.floor(now)):0};
 state.rating=0;state.goal=2200;state.cards={};state.packs=3;state.savedLook=null;state.introSeen=false;state.wowSeen=false;
 state.equipped={outfit:state.appearance.outfit,character:'default',weapon:'standard',vehicle:'none',companion:'none'};
 return true;
}
export function gateRoute(route,state){
 if(!state.player?.created)return ['welcome','create','guide'].includes(route.view)?route:{view:'welcome'};
 if(!state.introSeen)return {view:'intro'};
 if(route.view==='welcome')return {view:'lobby'};
 return route;
}
export function suggestedNames(name='',roll=0){
 const base=(name.trim().replace(/[^\p{L}\p{N}_]/gu,'')||'Survivor').slice(0,14);
 return [3,55,778].map(n=>base+((n+roll*17)%1000));
}
