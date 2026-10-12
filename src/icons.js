const paths={
helmet:'M4 14V11a8 8 0 0 1 16 0v3M3 14h18v4l-8 3-4-4H4zM8 10h12M14 10v5',
mail:'M3 5h18v14H3zM3 6l9 7 9-7',settings:'M9 3h6l1 3 3 1 2 5-2 5-3 1-1 3H9l-1-3-3-1-2-5 2-5 3-1zM15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
users:'M16 21v-2a5 5 0 0 0-5-5H6a5 5 0 0 0-5 5v2M12 6a4 4 0 1 1-8 0 4 4 0 0 1 8 0M17 3a4 4 0 0 1 0 8M23 21v-2a5 5 0 0 0-4-5',
crown:'M3 6l4 4 5-7 5 7 4-4-2 13H5z',shield:'M12 2l9 4v7c0 5-9 9-9 9s-9-4-9-9V6zM8 12l3 3 5-6',
box:'M3 6l9-4 9 4v13l-9 3-9-3zM3 6l9 4 9-4M12 10v12M7 4l10 4v6',
shirt:'M8 3L2 7l3 5 3-2v11h8V10l3 2 3-5-6-4c-1 3-7 3-8 0',eye:'M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12zM15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
volume:'M3 9h4l5-5v16l-5-5H3zM16 8a6 6 0 0 1 0 8M19 4a11 11 0 0 1 0 16',mute:'M3 9h4l5-5v16l-5-5H3zM17 9l5 6M22 9l-5 6',
edit:'M14 4l6 6M4 20l4-1L21 6l-4-4L4 15z',play:'M6 3l15 9-15 9z',
chat:'M3 3h18v14H8l-5 5zM7 8h10M7 12h7',gun:'M2 9h4l2-3h8v3h7v3h-7l-2 3 1 6h-4l-2-8H6l-4 3zM10 6V4h4v2M18 8v5',
clipboard:'M8 4H4v18h16V4h-4M8 2h8v5H8zM8 12h8M8 16h6',backpack:'M8 6V3h8v3M6 6h12l3 5v10H3V11zM7 13h10v5H7zM9 9h6',cart:'M2 3h3l3 13h11l3-10H6M10 21h.01M18 21h.01',
grid:'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',close:'M5 5l14 14M19 5L5 19',target:'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0M18 12a6 6 0 1 1-12 0 6 6 0 0 1 12 0M14 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0',
lock:'M6 10V7a6 6 0 0 1 12 0v3M4 10h16v12H4zM12 14v4',info:'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0M12 11v6M12 7h.01',download:'M12 2v13M7 10l5 5 5-5M3 15v6h18v-6',home:'M2 10L12 2l10 8M4 9v13h6v-8h4v8h6V9'
};
export const icon=name=>`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[name]||paths.info}"/></svg>`;
export function hydrate(root=document){root.querySelectorAll('[data-icon]').forEach(el=>{el.innerHTML=icon(el.dataset.icon);});}
export const gunArt=`<svg viewBox="0 0 380 130" aria-hidden="true"><defs><linearGradient id="metal"><stop stop-color="#96a6a8"/><stop offset=".4" stop-color="#405057"/><stop offset="1" stop-color="#1d3038"/></linearGradient></defs><g fill="url(#metal)" stroke="#9baaa9" stroke-width="1"><path d="M20 57h65l18-16h99l5 9h95v6h49v8h-49v10H190l-15 13-7 31h-22l-11-35h-27l-15 29H77l8-39H32L20 91H7V58z"/><path d="M104 41V30h62v11M201 50v24M218 51v22M230 51v22M242 51v22M254 51v22M267 51v22M284 50V32h8v19M322 55v-7h6v7"/><path d="M112 56h62v10h-62zM142 85l7 24h12l7-26M20 65h51M102 76h76"/></g></svg>`;
