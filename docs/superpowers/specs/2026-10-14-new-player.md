# New-player setup from the supplied videos

Implement the new-player UI and inventory/intro behavior observed in 3153.mp4 and 3152.mp4. First-time local users see a welcome screen, can inspect the six training steps as an explicitly labeled guide, then choose gender, eight faces, nine hairstyles, six hair colors, one of three starter outfits and a name. Create saves one local profile; duplicate submission must not reset it. Old v2 saves migrate as existing reference profiles without deleting their progress.

A new profile starts at level 1, collection level 1, G/UC 0 and Unranked with no invented match results. Intro slides use video reference artwork and do not grant currency. First-run route guards block deep-link bypass and resume at setup/intro. Appearance can be edited later without clearing cards or goals. Inventory supports genuine ownership checks and outfit/weapon/vehicle removal with 3D changes. New-user lobby presents Season, Inventory and an expanded menu for the prototype screens.

Add the Welcome to WOW screen and an honest explanatory continuation; no pretend network matchmaking or creator-server session. Preserve existing local cards, Workshop, Season and Profile views and their demo labeling. Real authentication and 3D match gameplay remain outside this UI phase. Do not replicate private Google email/account chooser data from the video.

Maintain mobile safe areas, focus/scroll preservation and reduced motion. Use procedural geometry for 3D; extracted user video frames are thumbnail/intro artwork. Tests cover creation/migration, invalid drafts, ownership, removal, repeated submits, route gates and controller navigation. Browser visual QA is unavailable in this environment.
