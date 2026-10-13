# Lobby Interface System Implementation Plan

> Execution: inline using superpowers:executing-plans, with one final fresh review.

**Goal:** Improve CSS polish and make local UI actions reliable and efficient.
**Architecture:** Keep catalog/model invariants, add transactional store and validated routing, extract pure screen templates, and leave app.js as the controller. Share one lifecycle-aware WebGL scene.
**Tech Stack:** Buildless ES modules, CSS, SVG, WebGL, Node tests.
**Spec:** docs/superpowers/specs/2026-10-13-interface-system.md

## Global constraints
- Preserve mobile safe areas, local save v2, locked previews and goal/rank separation.
- No external production dependencies, actual match, purchases or online trading.
- Browser QA remains unavailable; use meaningful Node checks and report scope.

## Review focus
- Rapid pack taps cannot debit a second pack behind an open dialog.
- Failed storage keeps an interactive in-memory state; invalid actions change nothing.
- Hash/deep-link input cannot produce invalid catalogs or unsafe text.
- Search, popup and settings changes retain focus/scroll and avoid redundant scene rebuilds.
- Context loss, zero-sized canvas and visibility transitions recover without crashing menus.

## Task 1: state and routes
- [x] Add tests first for immutable snapshots, duplicate pack commands, failed/throwing mutations, storage fallback and route normalization.
- [x] Implement src/store.js and src/router.js with validated dispatch, normalize and navigation APIs.
- [x] Run focused and existing state tests.

## Task 2: interface and renderer
- [x] Extract screen templates to src/screens.js; create original inline SVG icons in src/icons.js.
- [x] Integrate store/router, split screen and dialog rendering, isolated search updates, focus/scroll preservation and save-status feedback in app.js.
- [x] Add bounded CSS polish after existing styles, preserve mobile measurements and reduced motion.
- [x] Add scene lifecycle tests first; implement cached environment, pinch controls, ResizeObserver and recovery.
- [x] Run full Node suite, module syntax and template flow smoke checks.

## Task 3: delivery
- [x] Fresh review, resolve critical/important findings, update README.
- [ ] Push through GitHub tree/commit API using the verified main SHA and verify resulting head.

Execution notes: implementation stayed in the existing source workspace and GitHub API workflow. The first fresh reviewer could not run because of its model usage quota; a replacement fresh reviewer completed the review with no remaining critical/important blockers. CSS verification is structural and code-based, not browser visual validation.

Final review fix: settings-dialog scroll retention reproduced at 0 instead of 180, fixed by preserving .dialog scroll, regression GREEN; full suite 22/22. Reviewer independently confirmed retained scroll/focus and renderer recovery. Source publication follows this plan snapshot and is recorded by Git history.
