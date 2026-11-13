OAK & IRON
==========
Double-click "Play Oak and Iron.bat" to play (opens in your default browser).
Keep all files and folders together; don't move the .bat out of this folder.

FILES
  index.html              page layout (HTML only)
  css/style.css           all styling
  js/ (loaded in this order by index.html - order matters)
    01-config-sound.js    config, audio context, settings button, sound effects
    02-world.js           world constants, terrain, towns, object spawning
    03-data.js            character look, player state, skills, items
    04-sprites.js         weapon, tool and gear sprites
    05-item-art.js        custom pixel art for every item + UI icons (edit art here)
    06-drops.js           rarity tiers and RNG drop tables (edit drop rates here)
    07-audio-chat.js      audio engine, chat/XP helpers, NPC dialog
    08-entities.js        entity types, NPC spawning, pathfinding, combat loot
    09-actions.js         player actions, gathering, cooking, farming, game tick
    10-ui-panels.js       side panel, shop/bank, crafting and smithing, character creation
    11-render-base.js     canvas input, minimap, tiles, shadows
    12-render-objects.js  object rendering, HUD, health bars
    13-render-loop.js     main render loop
    14-save-controls.js   save/load, buttons, zoom
    15-music-menus.js     music, settings, title screen, character panel
    15b-hotbar.js         quick access toolbar + using potions/food (loads before boot on purpose)
    16-boot-touch.js      boot and mobile touch controls

NOTES
  All JS files share one global scope (they were one big block before), so a
  function in one file can call a function in another. To add a file, add a
  <script src="js/..."></script> line in index.html in the right position.
  Saves live in your browser's localStorage, so they are tied to the browser
  you launch with.

PLATFORM, SAVES & RELEASES
- js/00-platform.js loads first: GAME_VERSION / SAVE_VERSION, the Store storage adapter,
  in-game error reports, pause/resume and offline-cache registration.
- Desktop/mobile wrappers can set window.OakPlatform.storage = { get, set, remove } before the
  game loads (e.g. files for Steam Cloud, Capacitor Preferences) and call OakPlatform.pause(),
  resume() and save() from app lifecycle events.
- Saves carry a format version (migrateSave in js/14-save-controls.js upgrades old saves) and a
  backup copy (pixelvale2_bak) that loads automatically if the main save is damaged.
- Export/Import save lives in the Settings screen (.oaksave file or copy/paste code).
- When releasing an update, bump GAME_VERSION in js/00-platform.js, VERSION in sw.js and the
  ?v= numbers in index.html so players never get a mix of old and new files.

Version 1.3.0 update:
- Added seven new quests covering forest, mining, ruins, harbor and grove adventures.
- Improved quest cards with descriptions, progress, reward details and completed-state styling.
- Quest givers with multiple quests now offer their next available quest after the active one is completed.
- Enhanced terrain tile detail and contrast for grass, sand, stone, roads and water-edge scenery when enhanced graphics are enabled.
- Updated offline cache/version identifiers so browsers pick up the new files.

Version 1.4.0 update:
- Added a guided, nine-step tutorial shown after a new character is created.
- Covers movement, world interactions, NPCs, quests, gathering, combat, character panels and saving.
- Tutorial can be skipped or navigated backward/forward and is marked complete in the character save.
- Existing characters are not forced through the tutorial.


VERSION 1.6.0 - ADVENTURE EXPANSION
- Added three story bosses: Mossheart Guardian, Cindermaw, and Tempest, each on a distinct island region.
- Added a three-part boss quest arc using existing NPC quest givers and progression systems.
- Bosses have unique pixel-art sprites, animated visual auras, boss labels, and larger health bars.
- Boss victories award bonus coins, runes, and a rare gem; bosses respawn on a longer timer.
- Improved quest card styling and tracked quest visibility.
- Existing save format, character progress, combat, crafting, inventory, tutorial, and enemy camps are preserved.


VERSION 1.7.0 — DODGE COMBAT
- Press Space or Shift to perform a directional dodge; mobile players can tap the DODGE button.
- Dodging moves up to two clear tiles in the direction you are facing.
- A short 420 ms invulnerability window avoids enemy melee hits and incoming magic.
- Dodge has a 1.45 second cooldown, with a blue trail/ring visual and movement sound.
- Enemy spell attacks now have a visible travel/telegraph delay, giving the player a reaction window.


VERSION 1.8.0 - QUICK ACCESS TOOLBAR & POTIONS
- New 10-slot toolbar under the spell bar. Put potions, food or any other item on it.
- Add items: right-click (or long-press) an item in your bag > Add to toolbar, drag an item from the bag onto a slot,
  or click/tap an empty slot to pick from the potions and food you are carrying.
- Use a slot by clicking/tapping it or pressing Alt+1 ... Alt+0 (1-3 stay your spell hotkeys).
  Right-click / long-press a slot to use it or remove it. Slots remember the item, dim when you run out, and are saved.
- Seven pixel-art potions: minor / normal / greater health and mana, plus stamina. Potions share a 3 second cooldown
  and will not be wasted when you are already full.
- Potions are crafted in the Crafting menu (grimy guam + berries/runes/potato, gems for the greater tiers)
  and drop from monsters (rarer tiers from higher-level monsters). Tune drops in js/06-drops.js, effects in js/03-data.js.


VERSION 1.9.0 - WARRIOR RAGE, OAKHAVEN QUESTS, FULL-WINDOW VIEW, NEW ICONS
- The game now fills the whole browser window. On wide screens you see more of the world sideways
  (js/11-render-base.js fitCanvas); tall/narrow windows keep the classic 4:3 view.
- Warriors use a RAGE bar (0-100) instead of MP. Landing hits (+10) and taking hits (+5 to +15) build rage, it
  drains after 5 seconds out of combat, and skills spend it: Bash 10, Cleave 25, Enrage 40 (RAGE_COST in js/03-data.js).
  Mana potions don't work for warriors. Rage is saved with the game.
- Nine new Oakhaven quests (ids 22-30) from Mayor Elric, Lila, Captain Joss, Warden Hale, Scout Rowan and
  Scholar Amara. Each giver now shows a ! / ? marker until all of their quests are done.
- New 16x16 pixel-art menu icons (settings, character, run, tap mode, menu, map, inventory, skills, quests, music,
  sound, crate, grave): edit UI16 in js/05-item-art.js.
