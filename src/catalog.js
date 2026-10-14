// Screenshot-derived catalog. Only the explicitly marked starter items are locally usable.
export const outfits = [
 {id:'none',name:'Basic Outfit',color:'#a9b4ac',accent:'#687c74',starter:true,quality:'Basic'},
 {id:'bunny',name:'Bunny Girl Set',color:'#eaf3f1',accent:'#50acda',starter:true,quality:'Starter',file:'creation',rect:[1332,456,80,80]},
 {id:'hoodie',name:'Rose Bunny Hoodie',color:'#d298bd',accent:'#553e64',starter:true,quality:'Starter',file:'creation',rect:[1244,456,80,80]},
 {id:'cadet',name:'Field Cadet Set',color:'#596a5d',accent:'#a95755',starter:true,quality:'Starter',file:'creation',rect:[1156,456,80,80]},
 {id:'azure',name:'Azure Empress',color:'#ece6d5',accent:'#436fc6',quality:'Mythic',owned:true,rect:[968,154,112,132]},
 {id:'royal',name:'Crimson Vanguard',color:'#e5e2d9',accent:'#ac333d',quality:'Mythic',rect:[1094,154,114,132]},
 {id:'shadow',name:'Midnight Operative',color:'#263842',accent:'#7794af',quality:'Epic',rect:[1218,154,115,132]},
 {id:'field',name:'Field Explorer',color:'#307c62',accent:'#edb94d',quality:'Epic',owned:true,rect:[968,296,112,130]},
 {id:'tide',name:'Ocean Expedition',color:'#2589a7',accent:'#e7bd4d',quality:'Epic',rect:[1094,296,114,130]},
 {id:'neon',name:'Neon Runner',color:'#443159',accent:'#bcdb36',quality:'Epic',rect:[1218,296,115,130]},
 {id:'sand',name:'Desert Wanderer',color:'#ab8551',accent:'#faf4dd',quality:'Epic',rect:[968,439,112,130]},
 {id:'rose',name:'Rose Performer',color:'#713a51',accent:'#edd99b',quality:'Epic',rect:[1094,439,114,130]},
 {id:'crimson',name:'Crimson Coat',color:'#ab3540',accent:'#e4cc9e',quality:'Epic',rect:[1218,439,115,130]}
];
export const characters=[{id:'default',name:'Default Character',owned:true,starter:true,rect:[55,157,237,328]},{id:'victor',name:'Victor',owned:true,rect:[312,157,238,328]},{id:'sara',name:'Sara',rect:[569,157,237,328]},{id:'carlo',name:'Carlo',rect:[825,157,237,328]},{id:'andy',name:'Andy',rect:[1081,157,237,328]}];
export const weapons=[{id:'none',name:'No held weapon',starter:true,color:'#707362'},{id:'standard',name:'Standard AKM',starter:true,color:'#807054'},{id:'violet',name:'Violet M416',owned:true,color:'#963ede',rect:[1204,100,197,96]},{id:'nature',name:'Naturespirit Growth · ACE32',color:'#e9e3ce',rect:[1204,214,197,96]},{id:'gilded',name:'Gilded Assault',color:'#cfac5d',rect:[1204,328,197,94]},{id:'frost',name:'Frost Vector',color:'#77b9d6',rect:[1204,439,197,92]},{id:'ember',name:'Inferno P90',color:'#ff7834',rect:[1204,553,197,93]}];
export const vehicles=[{id:'none',name:'No lobby vehicle',starter:true,color:'#718681'},{id:'buggy',name:'Golden Buggy',owned:true,color:'#cea545'},{id:'lincoln',name:'Lincoln Model L (Golden Age)',color:'#e2bf62',rect:[1278,102,110,51]},{id:'apollo',name:'Apollo EVO (Radiant Gold)',color:'#dda745'},{id:'uaz',name:'Dimensional Warp UAZ',color:'#8bc5dc'}];
export const companions=[{id:'none',name:'No companion',owned:true,starter:true},{id:'kitten',name:'Kitten',rect:[685,156,201,289]},{id:'shiba',name:'Shiba',rect:[911,156,201,289]},{id:'bear',name:'Detective Bear',ended:true,rect:[64,156,146,289]},{id:'penguin',name:'Penguin',ended:true,rect:[1136,156,201,289]}];
export const collections=[{id:'blood',name:'Bloodhunt',total:15,rect:[178,106,257,323],color:'#935579'},{id:'opm',name:'One-Punch Man',total:9,rect:[480,106,262,323],color:'#c68730'},{id:'gourmet',name:'Gourmet Tour: Türkiye',total:14,rect:[788,106,250,323],color:'#b5886e'},{id:'playful',name:'Playful Battleground 4.0',total:16,rect:[1092,106,249,323],color:'#daa858'}];
export const opmNames=['Saitama & Genos','One-Punch Man','Saitama','Terrible Tornado','Genos','Watchdog Man','Garou','King','Hero Association'];
export const labStages=['Basic Form','Elimination Special Effect','Advanced Form','Elimination Broadcast','Hit Effect','Final Form','Loot Crate'];
export const suitStages=['Basic Form','Spectacular Arrival','Advanced Form','Victory Broadcast','Shock and Awe','Final Form','Radiant Form'];
export const goals=Array.from({length:35},(_,i)=>2200+i*100);
export function rankName(points){const roman=['V','IV','III','II','I'];if(points<2200)return 'Silver';if(points<4200){const n=Math.floor((points-2200)/100);return `${['Gold','Platinum','Diamond','Crown'][Math.floor(n/5)]} ${roman[n%5]}`;}const stars=Math.floor((points-4200)/100)+1;return `${stars<6?'Ace':stars<11?'Ace Master':'Ace Dominator'} ${stars}`;}
export const catalogs={outfit:outfits,character:characters,weapon:weapons,vehicle:vehicles,companion:companions};
