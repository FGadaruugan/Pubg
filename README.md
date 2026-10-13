# Battleground lobby · interface system

Screenshot-inspired, buildless browser lobby with a native WebGL showroom. Drag the scene to orbit and scroll to zoom. Original procedural geometry represents the avatar, outfits, rifle, vehicle and companion; it does not use official PUBG 3D models.

## Run

Serve the folder over HTTP (ES modules need an HTTP origin):

```sh
python3 -m http.server 8080
```

Open `http://localhost:8080`. There are no runtime dependencies, CDNs, accounts or build steps.

## Implemented

- 3D stone-courtyard lobby, selectable full-screen menus, Workshop submenu.
- Inventory search, name sorting, owned filter, starter outfit/character/weapon equip, saved look.
- Cards overview and collection detail, three free local sample packs, duplicate counts, persisted collection progress.
- Character, Companions, Vehicles, The Lab and X-Suit showrooms, locked preview states and stage selection.
- Classic, Casual and Ultimate Royale Season reference screens; selectable saved rank goal that never changes rating.
- Profile name editing, screenshot reference stats and career results.
- Theme event-shop reference catalog, settings for render quality and idle animation.
- Validated local save v2, safe fallback when browser storage is blocked, explicit reset confirmation.
- Responsive landscape and portrait CSS, keyboard controls, dialog focus trap and Escape navigation.

START opens mode information. Actual 3D matches, multiplayer, payments, official inventory, live events, trading and official ranks are not connected. The rejected 2D target-practice game has been removed.

## Reference versus local state

Ranks, currency labels and profile statistics transcribe the supplied screenshots and are labeled reference data. Cards, selected goal, name and equipped starter items are local prototype state. Some inventory names are descriptive prototype labels. Viewing a locked item or upgrade stage never grants ownership. Stage effects are simple UI previews; original animation assets and advanced 3D skins are not available. Screenshot thumbnails are reference artwork, sometimes reused for sample cards.

Conqueror is a leaderboard position, not a fixed 7,893-point threshold. Choosing a Season goal does not promote a player or grant official rewards.

## Structure

- `src/scene.js`: native WebGL lighting, procedural meshes and orbit controls
- `src/app.js`: scheduled rendering, focus, action controller
- `src/screens.js`: pure screenshot-led screen templates and inventory grid
- `src/store.js`: atomic, immutable, validated local actions
- `src/router.js`: normalized deep links and browser navigation
- `src/icons.js`: original inline SVG icons
- `polish.css`: gold/cyan theme, typography, interaction states and animation
- `mobile.css`: touch sizes, dynamic viewport and mobile safe areas
- `src/catalog.js`: reference catalog and rank labels
- `src/model.js`: save validation, ownership, packs and goal logic
- `assets/reference/`: user-provided screenshot artwork for catalog thumbnails
- `tests/`: state regression tests and finite-geometry checks
- `docs/superpowers/`: implementation scope and plan

## Validation

```sh
npm test
node --check src/app.js
node --check src/scene.js
```

State transactions, saved-data validation, route parsing, template escaping, independent form/stage selection, finite geometry and renderer lifecycle tests run in Node. Popup controls block background actions, search replaces only the item grid, and idle animation reuses uploaded geometry. Interactive browser and visual QA have not been run in the managed environment; rendering fidelity and touch layouts still require a real-browser review. WebGL failure leaves the menus usable with an explanatory message.

## Hosting

The repository can be served as a static site. No server component is required. Deployment is separate from the source-code update.

Independent fan prototype, not affiliated with KRAFTON or Tencent. User-supplied screenshots are reference material; game artwork and marks belong to their owners.

## Controls

Drag to rotate the 3D scene; pinch with two touch pointers or scroll to zoom; double-click to reset the camera. Press `I` to open Inventory and `Escape` to close the top popup or return to the parent screen. Hash routes such as `#inventory/weapon`, `#cards/opm`, `#season/goals` and `#profile/statistics` can be linked directly; browser Back/Forward restore screen navigation.

Settings follow the device reduced-motion preference. GPU context restoration reconnects the showroom, and ResizeObserver follows the actual canvas area on mobile. Runtime dependencies remain empty.
