# Lobby Rebuild Implementation Plan
> **For agentic workers:** Use superpowers:executing-plans inline.
**Goal:** Replace the rejected image lobby with a connected screenshot-led lobby prototype.
**Architecture:** Catalog, local state, WebGL scene, screen renderers and controller are separate modules. HTML/CSS overlay the shared canvas; full-screen catalog pages change scene subjects.
**Tech Stack:** HTML, CSS, ES modules, WebGL, Node tests.
**Spec:** docs/superpowers/specs/2026-10-12-lobby-rebuild.md
## Global Constraints
- Actual orbitable 3D preview; no target practice START.
- No real purchases, networking, matchmaking or invented rank awards.
- Ownership is distinct from preview; sample values are labeled.
## Review Focus
- Invalid saved values cannot equip locked items.
- Double pack opening cannot spend nonexistent packs.
- Goal selection cannot change current rank.
- Switching screens cannot retain incorrect scene/model.
- User names render as text; storage errors do not crash UI.
## Task 1 — state and assets
- [x] Write tests for locked equip, sample pack debit, goal/current rank separation and malformed saves; run red.
- [x] Implement src/catalog.js and src/model.js; run tests green.
## Task 2 — 3D and UI
- [x] Implement src/scene.js: native WebGL, procedural mesh geometry, camera rotation, correct resizing, context failure message.
- [x] Replace index.html/styles.css; implement screen functions in src/app.js. Inventory filters and equip, workshop previews, collection navigation and local demo pack reveal, sample Season/Profile, Theme shop information, mode selection.
- [x] Validate all screens render using DOM integration checks if available; syntax-check modules.
## Task 3 — delivery
- [x] Whole-branch review, state tests, asset-path and import validation.
- [ ] Commit changed files through GitHub tree API with expected main SHA. Verify returned branch head.
- [ ] Clearly state procedural assets and postponed gameplay/browser QA limitations.

Review: both companion-preview mapping and short-landscape stage scrolling findings fixed. Seven Node tests pass, all ten UI paths pass DOM-stub smoke. Geometry checks are not GPU/browser rendering checks. Browser visual QA remains pending.
