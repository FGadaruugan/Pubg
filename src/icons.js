const paths={
 close:'M6 6l12 12M18 6L6 18',back:'M15 5l-7 7 7 7',arrow:'M5 12h14M13 6l6 6-6 6',
 inventory:'M7 7V5a5 5 0 0110 0v2M4 7h16l1 14H3L4 7zm4 4h8',
 cards:'M7 4h13v16H7zM4 7H2v15h14v-2M10 8h7M10 12h7M10 16h4',
 workshop:'M14 3a6 6 0 00-7 7L2 15a3 3 0 004 4l5-5a6 6 0 007-7l-4 4-3-3 3-5z',
 season:'M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-6z',
 theme:'M12 3a9 9 0 100 18h1a2 2 0 002-2v-1a2 2 0 012-2h1a4 4 0 004-4 9 9 0 00-10-9zM7 8h.01M12 6h.01M17 8h.01M6 13h.01',
 settings:'M9 3h6l1 3 3 1 2 5-2 5-3 1-1 3H9l-1-3-3-1-2-5 2-5 3-1 1-3zM12 8a4 4 0 100 8 4 4 0 000-8z',
 home:'M3 10l9-8 9 8M5 8v13h14V8M9 21v-8h6v8',
 user:'M12 3a4 4 0 100 8 4 4 0 000-8zM4 21v-3a8 8 0 0116 0v3',
 search:'M10 3a7 7 0 100 14 7 7 0 000-14zM15 15l6 6',
 check:'M4 12l5 5L20 6',lock:'M6 10h12v11H6zM8 10V6a4 4 0 018 0v4M12 14v3',
 save:'M4 3h13l4 4v14H3V3h1M7 3v7h10V3M7 21v-7h10v7',
 cloud:'M6 18a5 5 0 01-1-10 7 7 0 0113 2 4 4 0 010 8H6M9 12l3 3 3-3M12 9v6',
 rotate:'M3 10a9 9 0 0117-3M21 3v5h-5M21 14A9 9 0 014 17M3 21v-5h5',
 car:'M4 10l2-6h12l2 6M3 10h18v8H3zM5 18v3M19 18v3M6 14h2M16 14h2',
 pet:'M12 12c-3 0-7 4-7 7s4 2 7 1c3 1 7 2 7-1s-4-7-7-7zM4 6a2 3 0 104 0 2 3 0 10-4 0M10 4a2 3 0 104 0 2 3 0 10-4 0M16 6a2 3 0 104 0 2 3 0 10-4 0',
 suit:'M8 3l4 3 4-3 6 4-4 5v9H6v-9L2 7l6-4z',
 rifle:'M2 9h16v4H6l-2 4H2V9M18 10h4M11 13l2 6h3l-2-6',
 gift:'M3 8h18v4H3zM5 12v9h14v-9M12 8v13M12 8C4 8 5 1 9 3l3 5M12 8c8 0 7-7 3-5l-3 5',
 info:'M12 2a10 10 0 100 20 10 10 0 000-20zM12 11v6M12 7h.01',
 zoom:'M4 9h12M10 3v12M15 15l6 6'
};
export const icon=(name,cls='')=>`<svg class="ui-icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[name]||paths.info}"/></svg>`;
