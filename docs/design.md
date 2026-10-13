> Archived v1 design. Superseded by docs/superpowers/specs/2026-10-12-lobby-rebuild.md.

# PUBG-inspired lobby

Build a static, responsive fan-made lobby in the user's empty FGadaruugan/Pubg repository. The preceding conversation provides the approved visual and feature brief: cinematic central survivor, squad slots, yellow Start at lower left, mode selection, profile, inventory, workshop, shop, missions, settings and secondary menus.

Use original generated artwork, not extracted game assets. HTML/CSS and browser JavaScript modules, no production dependencies. Local progress, equipment, settings and training results persist in versioned localStorage with validation and memory fallback. Actual multiplayer, purchases and voice chat are unavailable and must be labeled, never simulated as real connections.

The working Play path is a 30-second local target-training round with results. Classic/Arena can be configured but cannot start an online match. Cosmetics change scene treatment and equipped labels; no editable 3D character model is claimed. Menus are keyboard-accessible modal dialogs with escape/close support. Desktop landscape resembles the PUBG composition; portrait remains usable with scroll and responsive repositioning.

Files: index.html + styles.css (shell), src/state.js (persistence, catalog, progression), src/app.js (dialogs and navigation), src/training.js (canvas practice), assets/lobby.webp (generated artwork), tests/state.test.js (meaningful data-integrity checks).

Acceptance: mode and profile persist; invalid stored data recovers; buying an owned item doesn't charge twice; unaffordable items cannot be equipped; mission rewards cannot be claimed twice; training records real hits; no fake online status; no horizontal overflow at phone widths; no uncaught browser errors.
