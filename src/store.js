import {createPlayer,validDraft,normalizeAppearance} from './player.js';
import {fresh,load,save,normalize,equipItem,setGoal,openPack} from './model.js';

const freeze = value => {
 if(value && typeof value==='object' && !Object.isFrozen(value)){
  for(const child of Object.values(value))freeze(child);
  Object.freeze(value);
 }
 return value;
};
const copy=value=>JSON.parse(JSON.stringify(value));

/** Atomic local actions: readers cannot mutate the published save. */
export function createStore({storage,rng=Math.random,now=Date.now}={}){
 let state=freeze(load(storage)),status='ready';
 const subscribers=new Set(),commands=new Map();
 function dispatch(command={}){
  if(command.id && commands.has(command.id))return {...commands.get(command.id),duplicate:true};
  const draft=copy(state);let value=null,ok=false;
  try{
   switch(command.type){
    case 'player/create':ok=createPlayer(draft,command,now());break;
    case 'player/update':
     if(draft.player.created && validDraft(command)){draft.name=command.name.trim();draft.appearance=normalizeAppearance(command.appearance);ok=true;}break;
    case 'intro/seen':if(draft.player.created){draft.introSeen=true;ok=true;}break;
    case 'wow/seen':if(draft.player.created){draft.wowSeen=true;ok=true;}break;
    case 'unequip':if(['outfit','weapon','vehicle'].includes(command.kind))ok=equipItem(draft,command.kind,'none');break;
    case 'equip':ok=equipItem(draft,command.kind,command.item);break;
    case 'goal':ok=setGoal(draft,command.points);break;
    case 'rename':{
     const name=typeof command.name==='string'?command.name.trim().slice(0,20):'';
     if(name){draft.name=name;ok=true;}break;
    }
    case 'settings':
     if(command.key==='motion' && typeof command.value==='boolean')ok=true;
     if(command.key==='quality' && ['low','high'].includes(command.value))ok=true;
     if(ok)draft.settings[command.key]=command.value;
     break;
    case 'look/save':draft.savedLook={...draft.equipped};ok=true;break;
    case 'look/apply':
     if(draft.savedLook){for(const [kind,item] of Object.entries(draft.savedLook))equipItem(draft,kind,item);ok=true;}
     break;
    case 'pack/open':value=openPack(draft,command.collection,rng);ok=Boolean(value);break;
    case 'reset':Object.assign(draft,fresh());ok=true;break;
   }
  }catch{return {ok:false,error:'Action could not be completed. Your progress is unchanged.'};}
  if(!ok)return {ok:false,error:'This action is not available.'};
  const next=freeze(normalize(draft));
  const persisted=save(next,storage);status=persisted?'saved':'memory';state=next;
  const result=freeze({ok:true,value,persisted});
  if(command.id){commands.set(command.id,result);if(commands.size>64)commands.delete(commands.keys().next().value);}
  for(const fn of subscribers){try{fn(state,{type:command.type,persisted});}catch(error){globalThis.console?.error('State subscriber failed',error);}}
  return result;
 }
 return {getState:()=>state,dispatch,subscribe(fn){subscribers.add(fn);return ()=>subscribers.delete(fn);},get status(){return status;}};
}
