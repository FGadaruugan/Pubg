const views=new Set(['lobby','inventory','cards','season','profile','shop','xsuit','lab','vehicle','companion','character']);
const oneOf=(v,list,fallback)=>list.includes(v)?v:fallback;
export function parseRoute(hash=''){
 let parts;try{parts=decodeURIComponent(hash.replace(/^#\/?/,'')).split('/');}catch{parts=hash.replace(/^#\/?/,'').split('/');}
 const [name,sub]=parts,view=views.has(name)?name:'lobby';
 if(view==='inventory')return {view,tab:oneOf(sub,['outfit','weapon','character'],'outfit')};
 if(view==='cards')return ['blood','opm','gourmet','playful'].includes(sub)?{view,tab:'detail',collection:sub}:{view,tab:'overview',collection:'opm'};
 if(view==='season')return {view,tab:sub==='goals'?'goals':'overview',season:oneOf(sub,['classic','casual','ultimate'],'classic')};
 if(view==='profile')return {view,profile:oneOf(sub,['basic','statistics','career','collections','honor','custom'],'basic')};
 return {view};
}
export function routeHash(route){
 if(!views.has(route.view))return '#lobby';
 const sub=route.view==='inventory'?oneOf(route.tab,['outfit','weapon','character'],'outfit'):route.view==='cards'&&route.tab==='detail'?oneOf(route.collection,['blood','opm','gourmet','playful'],'opm'):route.view==='season'?(route.tab==='goals'?'goals':oneOf(route.season,['classic','casual','ultimate'],'classic')):route.view==='profile'?oneOf(route.profile,['basic','statistics','career','collections','honor','custom'],'basic'):'';
 return '#'+route.view+(sub?'/'+sub:'');
}
export function parentRoute(route){
 if(route.view==='cards' && route.tab==='detail')return {view:'cards',tab:'overview'};
 if(route.view==='season' && route.tab==='goals')return {view:'season',season:route.season,tab:'overview'};
 return {view:'lobby'};
}
export function createRouter(target=window){
 let route=parseRoute(target.location.hash);const listeners=new Set();
 const publish=()=>{route=parseRoute(target.location.hash);for(const fn of listeners)fn(route);};
 const go=(next,{replace=false}={})=>{
  const hash=routeHash(next);if(target.location.hash===hash)return;
  target.history[replace?'replaceState':'pushState']({lobby:true},'',hash);publish();
 };
 target.addEventListener('popstate',publish);target.addEventListener('hashchange',publish);
 return {getRoute:()=>route,go,back:()=>go(parentRoute(route)),subscribe(fn){listeners.add(fn);return ()=>listeners.delete(fn);},destroy(){target.removeEventListener('popstate',publish);target.removeEventListener('hashchange',publish);listeners.clear();}};
}
