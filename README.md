# PUBG-inspired Battleground Lobby

A responsive, independent fan lobby for desktop and mobile browsers. Original generated artwork, a PUBG-style layout, interactive menus and a playable local target range.

## Run

Serve the repository over HTTP (ES modules do not run reliably from `file://`):

```sh
python -m http.server 8080
```

Open http://localhost:8080. Alternatively, open the folder in VS Code and use Live Server.

## Publish with GitHub Pages

In the repository, open **Settings → Pages → Build and deployment → Deploy from a branch**, select **main** and **/(root)**, then Save. GitHub supplies the live address after deployment. No build step is needed.

## Included

- Cinematic illustrated lobby, squad slots, yellow Start, event rail and bottom navigation.
- Mode and map preferences; online modes are explicitly marked unavailable.
- 30-second local target practice with hit detection, weapon firing intervals, results and pause when the tab is hidden.
- Profile name, statistics, training rank, inventory, workshop and BP theme shop.
- Earned milestone rewards with duplicate-claim prevention.
- Volume, interface sound, visual-quality and reduced-motion controls.
- Validated, versioned browser storage with in-memory fallback when storage is blocked.
- Keyboard-accessible native dialogs; responsive portrait and landscape styles.

The main scene is original AI-generated artwork, not an interactive 3D model. Equipping a lobby theme changes its color treatment. Training uses stylized shooting ranges, not the full PUBG maps. The weapon stat charts are illustrative.

There is no multiplayer server, live friends/chat, real-money store, official competitive rank or account/cloud sync. These entry points explain their availability rather than faking network actions. Local BP has no monetary value. Clearing browser storage removes progress.

## Structure

- `index.html`, `styles.css`: lobby shell and responsive layout
- `src/app.js`: menus and UI interactions
- `src/state.js`: catalog, validation, progression and persistence
- `src/training.js`: local canvas target practice
- `src/icons.js`: original inline SVG UI icons
- `assets/lobby.webp`: optimized original generated scene
- `tests/`: Node.js tests

```sh
npm test
```

No production dependencies or external asset requests are required. Node.js 22+ is recommended for tests.

## Reference and asset provenance

Visual and interaction research used PUBG Mobile's official lobby/help documentation, the official New Era lobby page and Google Play's PUBG Mobile interface guides:

- https://www.pubgmobile.com/en/event/newera/
- https://pubgmobile.helpshift.com/hc/en/3-pubg-mobile/faq/395-game-lobby-has-been-changed/
- https://play.google.com/store/apps/editorial?hl=en-US&id=mc_editorialevergreen_post_install_pubg_mobile_team_up_now_fcp

Scene created with the built-in image generation tool: a cinematic battle-royale survivor in helmet, white shirt and tactical harness, rifle held safely across the body, military jeep, coastal airfield and mountainous stormy sunset; uncluttered corners for UI; no text or logos. Original source was converted to WebP for the site.

Independent fan project; not affiliated with or endorsed by KRAFTON or Tencent. PUBG and related marks belong to their respective owners.
