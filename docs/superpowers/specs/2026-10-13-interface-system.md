# Lobby interface and interaction upgrade

Improve the existing PUBG-inspired UI while retaining screenshot-led navigation, local ownership rules and the mobile viewport work. Use a coherent gold/cyan visual language, crisp SVG icons, readable headers, selected states, restrained motion and improved card reveal presentation. Preserve the light collection/Season surfaces and full-screen showroom layout.

Replace direct UI mutations with a validated transaction store: atomic pack opens, immutable snapshots, persisted equip/goal/name/settings/looks, duplicate-command protection and visible storage status. Saved v2 data remains readable. Add validated hash routes so screen links and browser Back work. Search updates the item grid without rebuilding the search field. Render popup separately, preserve keyboard focus and scrolling, and block background actions while dialogs are open.

Improve the native renderer with a cached environment, pointer/pinch controls, element resize observation, hidden-tab scheduling and context-loss recovery. No new dependency, server, payment, official rank or match subsystem.

Validate state transactions, malformed routes, scene lifecycle/geometry and all full-screen render paths. Browser visual QA is unavailable in the current managed environment; report that limitation accurately. Save changes to the existing FGadaruugan/Pubg repository.
