> Archived v1 design. Superseded by docs/superpowers/specs/2026-10-12-lobby-rebuild.md.

# Lobby Implementation Plan

Goal: deliver the approved PUBG-inspired interactive lobby to FGadaruugan/Pubg.
Architecture: buildless ES modules with isolated state and training logic.
Spec: design.md

1. Write state tests for corrupt persistence, ownership, double purchases, reward replay, and settings normalization. Implement state/catalog and run node --test.
2. Build responsive shell, generated scene, accessible modal navigation and functional profile, mode, inventory, workshop, shop, missions and settings.
3. Implement local target training with pause-safe timing, hit detection and persistence. Explicitly gate multiplayer/voice/purchases.
4. Verify desktop/mobile layout, keyboard navigation, main interactions, storage reload and console errors. Review the diff, fix material findings and publish the initial source to the specified GitHub repository.

Constraints: no production dependencies; no real-money transactions; no fake friends/matchmaking; all paths relative for GitHub Pages; private browser data never uploaded.
Review focus: unavailable localStorage; corrupt/old values; rapid duplicate clicks; mobile portrait/landscape clipping; dialogs and training cancellation.
