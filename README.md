# Battleground lobby · v2

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
- `src/app.js`: screen rendering, navigation and interactions
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

Business-state tests and JS syntax checks run in Node. Interactive browser and visual QA have not been run in the managed environment; rendering fidelity and touch layouts still require a real-browser review. WebGL failure leaves the menus usable with an explanatory message.

## Hosting

The repository can be served as a static site. No server component is required. Deployment is separate from the source-code update.

Independent fan prototype, not affiliated with KRAFTON or Tencent. User-supplied screenshots are reference material; game artwork and marks belong to their owners.
