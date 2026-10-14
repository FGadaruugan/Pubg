import {outfits,weapons,vehicles} from './catalog.js';
import {defaultAppearance} from './player.js';

// Pure scene selection keeps preview state separate from durable equipped gear.
export function sceneOptions(ui,state){
 const {view,tab,preview,stage,form}=ui;
 const setup=view==='create',appearance=setup?(ui.createDraft?.appearance||defaultAppearance()):state.appearance;
 const outfit=outfits.find(x=>x.id===(setup&&!state.player.created?appearance.outfit:state.equipped.outfit));
 const selectedOutfit=view==='inventory'&&tab==='outfit'?outfits.find(x=>x.id===preview):null;
 const renderedOutfit=selectedOutfit||outfit;
 const weapon=weapons.find(x=>x.id===(view==='lab'||(view==='inventory'&&tab==='weapon')?preview:state.equipped.weapon));
 const vehicle=vehicles.find(x=>x.id===preview);
 return {type:setup?'create':view==='lobby'?'lobby':view==='vehicle'?'vehicle':view==='lab'?'lab':view==='xsuit'?'xsuit':view==='companion'?'companion':'avatar',...renderedOutfit,
  character:view==='character'||(view==='inventory'&&tab==='character')?preview:state.equipped.character,
  weaponColor:weapon?.color,vehicle:view==='vehicle'?preview:state.equipped.vehicle,...(view==='vehicle'?{color:vehicle?.color}:{}),
  ...(view==='xsuit'?{color:'#e7e5d9',accent:['#9cce63','#e9964c','#7ecbdd'][form]}:{}),
  companion:view==='companion'?preview:state.equipped.companion,gender:appearance.gender,face:appearance.face,hair:appearance.hair,hairColor:appearance.hairColor,
  starter:view!=='xsuit'&&Boolean(renderedOutfit?.starter),outfit:view==='xsuit'?'xsuit':renderedOutfit?.id,weapon:setup?'none':weapon?.id,
  hidden:['welcome','intro','guide','wow','rookie','cards','season','shop'].includes(view)||(view==='profile'&&ui.profile!=='basic'),paused:Boolean(ui.modal),stage,...state.settings};
}
