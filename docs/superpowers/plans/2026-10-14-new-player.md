# New Player Implementation Plan
> Execution: inline with one final fresh review (superpowers:executing-plans).
**Goal:** Connect the researched new-account setup and intro/inventory/WOW screens to the existing lobby.
**Spec:** docs/superpowers/specs/2026-10-14-new-player.md
**Architecture:** player.js holds setup/appearance validation and first-run route decisions. model/store normalize and transact durable state. onboarding.js supplies pure setup/intro templates; controller and WebGL scene consume selected appearance.
**Constraints:** preserve existing saves and mobile layout; local profile only; no fake online account, match, tutorial reward or currency.
**Review focus:** bypass via hash/Back; duplicate Create; corrupted appearance; old-save loss; rank/profile fiction on a new account; ownership checks after migration and look restore.

## Task 1 — durable profile
- [x] Write and run failing creation/migration/ownership/gate tests.
- [x] Implement player.js and model/store migration/actions; run regression suite.
## Task 2 — connected screens
- [x] Extract intro/creator reference frames, implement onboarding.js and onboarding.css.
- [x] Connect creator, guide, intro, WOW, novice lobby and unequip actions/routes.
- [x] Make appearance and gear removal visible in procedural 3D, including geometry-cache inputs.
- [x] Verify pure screen and DOM-controller flow tests, mobile structure and all module imports.
## Task 3 — review and save
- [x] Fresh code review and concrete fixes; update README and run final tests.
- [ ] Save to existing GitHub main using expected SHA and verify new remote head.

## Review fix and validation

The fresh reviewer found that spreading equipped starter properties into a locked outfit or X-Suit preview retained `starter:true`, selecting the wrong mesh. Scene selection now resolves the preview outfit independently and chooses the X-Suit model explicitly. Two regression tests first failed on the inherited flag, then passed after the fix; a geometry test verifies that X-Suit decorations remain present with every starter outfit and basic gear.

The Node suite, module syntax/import checks, JPEG verification and CSS structure checks pass. Browser visual/device QA is unavailable in this managed environment; real-browser layout and touch verification remain pending.
