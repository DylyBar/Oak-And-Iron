/* Oak & Iron - Character look, player state, skills, inventory, item data (sections 13-19). Loaded in order by index.html. */

/* ==========================================================================
 * 13. CHARACTER LOOK & EQUIPMENT DATA
 * Skin/hair palettes, name choices, weapon table (WP) and equipment tiers.
 * ========================================================================== */
const SKIN = ["#f5d0a9", "#e8b88a", "#c68e5f", "#9a6a44", "#6b4428"],
  HC = ["#2b1b10", "#6b3a1c", "#d9a441", "#c0392b", "#e8e8e8", "#3a5fc8"],
  SH = ["#d9453b", "#3a7bd5", "#4caf50", "#f2b632", "#8e55c2", "#e8e8e8"],
  PA = ["#3b3f63", "#5a3b22", "#2f5d3a", "#555"];
let look = { s: 1, hs: 0, hc: 1, sh: 1, pa: 0 },
  pname = "Hero";
const TN = ["Bronze", "Iron", "Steel", "Mithril"],
  TC = ["#b87333", "#8a8f96", "#c5ccd4", "#5b7fd6"],
  GN = { axe: "Axe", pick: "Pickaxe", rod: "Fishing rod", sword: "Sword" },
  GI = {},
  PR = [40, 60, 200, 500],
  gear = { axe: 0, pick: 0, rod: 0, sword: -1, spear: -1, bow: -1, staff: -1 };
Object.assign(GN, { spear: "Spear", bow: "Bow", staff: "Staff" });
const WP = {
    sword: { r: 1, sk: "Attack", cd: 3, b: 0 },
    spear: { r: 2, sk: "Attack", cd: 4, b: 1 },
    bow: { r: 12, sk: "Ranged", cd: 4, b: 1 },
    staff: { r: 12, sk: "Magic", cd: 5, b: 2 },
  },
  CL = {
    Warrior: { w: "sword", s: "Attack", d: "Starts with a sword and level 1 Attack. Melee." },
    Ranger: { w: "bow", s: "Ranged", d: "Starts with a bow and level 1 Ranged. Shoots from 12 tiles." },
    Mage: { w: "staff", s: "Magic", d: "Starts with a staff and level 1 Magic. Casts from 12 tiles." },
  },
  rg = (a) => (a.k == "attack" ? WP[P.w].r : 1),
  goalR = (t, r) => (x, y) => Math.abs(x - t.x) + Math.abs(y - t.y) <= r && !bl(x, y),
  QS = [
    {
      id: 0,
      n: "Slime Trouble",
      g: "Mayor Elric",
      d: "Slimes are overrunning the fields. Defeat 5 of them for me.",
      t: "kill",
      i: "slime",
      need: 5,
      c: 80,
      x: ["Attack", 200],
    },
    {
      id: 1,
      n: "Timber Please",
      g: "Fern",
      d: "I need 10 logs for repairs. Can you bring them?",
      t: "get",
      i: "Logs",
      need: 10,
      c: 60,
      x: ["Woodcutting", 200],
    },
    {
      id: 2,
      n: "Ore for the Smith",
      g: "Garrick",
      d: "Bring me 6 ore from the mountains.",
      t: "get",
      i: "Copper ore",
      need: 6,
      c: 90,
      x: ["Mining", 250],
    },
    {
      id: 3,
      n: "Goblin Menace",
      g: "Captain Joss",
      d: "Goblins threaten our roads. Defeat 4 of them.",
      t: "kill",
      i: "goblin",
      need: 4,
      c: 150,
      x: ["Hitpoints", 300],
    },
    {
      id: 4,
      n: "Fish Supper",
      g: "Lila",
      d: "I am hungry! Bring me 5 cooked fish.",
      t: "get",
      i: "Cooked shrimp",
      need: 5,
      c: 70,
      x: ["Cooking", 200],
    },
    {
      id: 5,
      n: "Elemental Threat",
      g: "Scholar Amara",
      d: "An elemental has been spotted near the old tower. Investigate and report back.",
      t: "talk",
      need: 0,
      c: 100,
      x: ["Magic", 150],
    },
    {
      id: 6,
      n: "Warrior's Trial",
      g: "Captain Joss",
      d: "Prove your worth in combat. Defeat 3 goblins without taking damage.",
      t: "kill",
      i: "goblin",
      need: 3,
      c: 200,
      x: ["Attack", 300],
      req: 5,
    },
    {
      id: 7,
      n: "A Storehouse in Need",
      g: "Ada",
      d: "Our storehouse is low on supplies. Bring me 5 potatoes.",
      t: "get",
      i: "Potato",
      need: 5,
      c: 65,
      x: ["Farming", 180],
    },
    {
      id: 8,
      n: "The Smith's Order",
      g: "Brogan",
      d: "The forge needs 3 iron ore for a new set of tools.",
      t: "get",
      i: "Iron ore",
      need: 3,
      c: 110,
      x: ["Mining", 240],
    },
    {
      id: 9,
      n: "A Fresh Catch",
      g: "Fia",
      d: "Bring me 3 raw trout for the Seaview festival.",
      t: "get",
      i: "Raw trout",
      need: 3,
      c: 90,
      x: ["Fishing", 200],
    },
    {
      id: 10,
      n: "Pest Control",
      g: "Tessa",
      d: "Rats are overrunning the lower tunnels. Defeat 4 of them.",
      t: "kill",
      i: "rat",
      need: 4,
      c: 130,
      x: ["Attack", 220],
    },
    {
      id: 11,
      n: "Delver's Supplies",
      g: "Pip",
      d: "I need 5 copper ore to shore up the tunnel supports.",
      t: "get",
      i: "Copper ore",
      need: 5,
      c: 100,
      x: ["Mining", 200],
    },
    {
      id: 12,
      n: "Timber for the Watchtower",
      g: "Warden Hale",
      d: "The watchtower needs sturdy oak. Bring me 8 oak logs.",
      t: "get", i: "Oak logs", need: 8, c: 180, x: ["Woodcutting", 350],
    },
    {
      id: 13,
      n: "Wolves at the Treeline",
      g: "Scout Rowan",
      d: "A pack of wolves is stalking the forest paths. Defeat 5 forest wolves.",
      t: "kill", i: "wolf", need: 5, c: 220, x: ["Attack", 400],
    },
    {
      id: 14,
      n: "Deep Mine Survey",
      g: "Prospector Nia",
      d: "I need 6 coal to test a new smelting process.",
      t: "get", i: "Coal", need: 6, c: 190, x: ["Mining", 350],
    },
    {
      id: 15,
      n: "Restless Bones",
      g: "Gravekeeper Moss",
      d: "Skeletons have risen near the old ruins. Put 4 of them to rest.",
      t: "kill", i: "skeleton", need: 4, c: 320, x: ["Hitpoints", 500],
    },
    {
      id: 16,
      n: "A Rare Seaview Catch",
      g: "Harbor Cook Sella",
      d: "The festival needs 6 cooked shrimp for the banquet.",
      t: "get", i: "Cooked shrimp", need: 6, c: 150, x: ["Cooking", 350],
    },
    {
      id: 17,
      n: "Cave of Whispers",
      g: "Delver Orin",
      d: "A strange glow haunts the caverns. Defeat 3 cave scorpions.",
      t: "kill", i: "scorpion", need: 3, c: 420, x: ["Attack", 650],
    },
    {
      id: 18,
      n: "The Grove's Light",
      g: "Keeper Elowen",
      d: "The grove wisps are growing hostile. Defeat 4 of them.",
      t: "kill", i: "wisp", need: 4, c: 380, x: ["Magic", 600],
    },
    {
      id: 19,
      n: "The Heartwood Awakens",
      g: "Keeper Elowen",
      d: "An ancient guardian stirs in the old woodland. Find the Mossheart Guardian and defeat it before its roots overrun the paths.",
      t: "kill", i: "mossheart", need: 1, c: 650, x: ["Woodcutting", 900],
    },
    {
      id: 20,
      n: "Ashes of the Old Kingdom",
      g: "Gravekeeper Moss",
      d: "The ruins are being scorched by Cindermaw, a creature born beneath the ash. Defeat the beast and bring peace to the eastern island.",
      t: "kill", i: "cindermaw", need: 1, c: 1200, x: ["Hitpoints", 1500], req: 15,
    },
    {
      id: 21,
      n: "Storm over the Shattered Isles",
      g: "Scholar Amara",
      d: "A storm dragon circles the northern heights. Defeat Tempest, then return with proof that the skies are safe again.",
      t: "kill", i: "tempest", need: 1, c: 2200, x: ["Magic", 2400], req: 20,
    },
    {
      id: 22,
      n: "Berries for the Harvest Table",
      g: "Mayor Elric",
      d: "Oakhaven's harvest feast needs fresh redberries. Pick 6 from the bushes outside town.",
      t: "get", i: "Redberries", need: 6, c: 70, x: ["Farming", 150],
    },
    {
      id: 23,
      n: "Feathers for the Festival",
      g: "Mayor Elric",
      d: "We are making festival banners. Bring me 10 feathers from the chickens.",
      t: "get", i: "Feathers", need: 10, c: 90, x: ["Hitpoints", 200],
    },
    {
      id: 24,
      n: "Goblin Bounty",
      g: "Mayor Elric",
      d: "The town council posts a bounty: defeat 8 goblins and Oakhaven will pay well.",
      t: "kill", i: "goblin", need: 8, c: 260, x: ["Attack", 380],
    },
    {
      id: 25,
      n: "Potato Soup",
      g: "Lila",
      d: "I'm cooking soup for the whole plaza. Could you bring me 8 potatoes?",
      t: "get", i: "Potato", need: 8, c: 85, x: ["Cooking", 220],
    },
    {
      id: 26,
      n: "A Healer's Request",
      g: "Lila",
      d: "The guards are running low on remedies. Craft 2 minor health potions (grimy guam and redberries) and bring them to me.",
      t: "get", i: "Minor health potion", need: 2, c: 140, x: ["Crafting", 260],
    },
    {
      id: 27,
      n: "Clear the Roads",
      g: "Captain Joss",
      d: "Slimes are fouling the roads around town. Defeat 8 of them.",
      t: "kill", i: "slime", need: 8, c: 120, x: ["Hitpoints", 260],
    },
    {
      id: 28,
      n: "Wool for the Watch",
      g: "Warden Hale",
      d: "Winter patrols need warm cloaks. Bring me 6 wool from the sheep.",
      t: "get", i: "Wool", need: 6, c: 95, x: ["Crafting", 220],
    },
    {
      id: 29,
      n: "Fletching for the Scouts",
      g: "Scout Rowan",
      d: "My quiver is nearly empty. Fletch me 15 arrows (feathers and logs at the crafting bench).",
      t: "get", i: "Arrows", need: 15, c: 130, x: ["Ranged", 260],
    },
    {
      id: 30,
      n: "Amara's Research",
      g: "Scholar Amara",
      d: "I am testing how metals hold arcane charge. Bring me 5 tin ore.",
      t: "get", i: "Tin ore", need: 5, c: 100, x: ["Mining", 220],
    },
  ],
  qs = {};
let cls = "Warrior";
QS.forEach((q) => (qs[q.id] = { s: 0, k: 0 }));
Object.assign(GN, {
  helm: "Helmet",
  body: "Platebody",
  shield: "Shield",
  cowl: "Cowl",
  leather: "Leather armor",
  vamb: "Vambraces",
  hat: "Wizard hat",
  robe: "Magic robe",
  mboots: "Magic boots",
});
Object.assign(gear, { helm: -1, body: -1, shield: -1, cowl: -1, leather: -1, vamb: -1, hat: -1, robe: -1, mboots: -1 });
/* Armor class restrictions: only the listed class can wear a slot. Owned armor of another class stays
 * in your gear but gives no defence and isn't shown until you switch back to that class. */
const ARMOR_CLASS = {
    helm: "Warrior",
    body: "Warrior",
    shield: "Warrior",
    cowl: "Ranger",
    leather: "Ranger",
    vamb: "Ranger",
    hat: "Mage",
    robe: "Mage",
    mboots: "Mage",
  },
  WEAPON_CLASS = {
    sword: "Warrior",
    spear: "Warrior",
    dagger: "Warrior",
    mace: "Warrior",
    bow: "Ranger",
    xbow: "Ranger",
    staff: "Mage",
    wand: "Mage",
  },
  LEATHER_PAL = ["#8b5a2b", "#6e4526", "#7a6650", "#3f7a4a"],
  ROBE_PAL = ["#5d6fd6", "#4a8fc9", "#7b4fc9", "#c94f8f"],
  ARMOR_TN = {
    cowl: ["Leather cowl", "Hard leather cowl", "Studded cowl", "Dragonhide cowl"],
    leather: ["Leather armor", "Hard leather armor", "Studded leather armor", "Dragonhide armor"],
    vamb: ["Leather vambraces", "Hard leather vambraces", "Studded vambraces", "Dragonhide vambraces"],
    hat: ["Apprentice hat", "Adept hat", "Mystic hat", "Archmage hat"],
    robe: ["Apprentice robe", "Adept robe", "Mystic robe", "Archmage robe"],
    mboots: ["Apprentice boots", "Adept boots", "Mystic boots", "Archmage boots"],
  },
  ARMOR_PAL = { cowl: LEATHER_PAL, leather: LEATHER_PAL, vamb: LEATHER_PAL, hat: ROBE_PAL, robe: ROBE_PAL, mboots: ROBE_PAL },
  gearClass = (k) => ARMOR_CLASS[k] || WEAPON_CLASS[k],
  canWear = (k, c = cls) => !gearClass(k) || gearClass(k) == c,
  classLock = (k) => `Only a ${gearClass(k)} can ${WEAPON_CLASS[k] ? "use" : "wear"} this`,
  worn = (k) => (canWear(k) ? gear[k] : -1),
  gearName = (k, t = gear[k]) => (ARMOR_TN[k] ? ARMOR_TN[k][Math.max(0, t)] : TN[Math.max(0, t)] + " " + GN[k]);
const STK = [
    "Coins",
    "Seeds",
    "Arrows",
    "Runes",
    "Potato",
    "Redberries",
    "Grimy guam",
    "Copper ore",
    "Tin ore",
    "Iron ore",
    "Coal",
    "Silver ore",
    "Gold ore",
    "Mithril ore",
    "Adamantite ore",
    "Runite ore",
    "Bronze bar",
    "Iron bar",
    "Steel bar",
    "Silver bar",
    "Gold bar",
    "Mithril bar",
    "Adamantite bar",
    "Runite bar",
    "Feathers",
    "Wool",
    "Bowstring",
    "Cowhide",
    "Leather",
    "Bird's nest",
    "Amber",
    "Pearl",
    "Old boot",
    "Golden potato",
    "Uncut sapphire",
    "Uncut emerald",
    "Uncut ruby",
    "Uncut diamond",
    "Minor health potion",
    "Health potion",
    "Greater health potion",
    "Minor mana potion",
    "Mana potion",
    "Greater mana potion",
    "Stamina potion",
  ],
  FOOD = {
    "Cooked fish": 4,
    "Cooked shrimp": 4,
    "Cooked swordfish": 14,
    Potato: 2,
    "Cooked trout": 7,
    "Cooked salmon": 10,
    "Cooked chicken": 3,
    "Cooked beef": 7,
    "Cooked mutton": 6,
  },
  /* Potions: hp / mp / en (energy, 0-100) restored on use. All potions share one POTION_CD cooldown (ms). */
  POTIONS = {
    "Minor health potion": { hp: 6 },
    "Health potion": { hp: 12 },
    "Greater health potion": { hp: 20 },
    "Minor mana potion": { mp: 10 },
    "Mana potion": { mp: 25 },
    "Greater mana potion": { mp: 50 },
    "Stamina potion": { en: 50 },
  },
  POTION_CD = 3000,
  AM = { bow: "Arrows" },
  GROW = 40,
  bank = {},
  REQ = [1, 10, 20, 30],
  SKF = {
    axe: "Woodcutting",
    pick: "Mining",
    rod: "Fishing",
    sword: "Attack",
    spear: "Attack",
    bow: "Ranged",
    staff: "Magic",
    helm: "Defence",
    body: "Defence",
    shield: "Defence",
    leather: "Defence",
    robe: "Defence",
    cowl: "Defence",
    vamb: "Defence",
    hat: "Defence",
    mboots: "Defence",
    hammer: "Smithing",
  },
  CX = {
    "Raw shrimp": 30,
    "Raw trout": 70,
    "Raw salmon": 90,
    "Raw swordfish": 140,
    "Raw chicken": 12,
    "Raw beef": 30,
    "Raw mutton": 25,
  },
  TR = [
    { n: "Tree", l: 1, t: 0, it: "Logs", xp: 25, c: "#3e8e2f", h: "#5aa843" },
    { n: "Oak", l: 15, t: 1, it: "Oak logs", xp: 37.5, c: "#5a7d2a", h: "#7da83c" },
    { n: "Willow", l: 30, t: 2, it: "Willow logs", xp: 67.5, c: "#8fbf4a", h: "#b5d86a" },
    { n: "Yew", l: 60, t: 3, it: "Yew logs", xp: 175, c: "#1d5c4a", h: "#2f8a6e" },
  ],
  RK = [
    { n: "Copper rock", l: 1, t: 0, it: "Copper ore", xp: 17.5, c: "#d98a3d" },
    { n: "Iron rock", l: 15, t: 1, it: "Iron ore", xp: 35, c: "#a0522d" },
    { n: "Coal rock", l: 30, t: 2, it: "Coal", xp: 50, c: "#222" },
    { n: "Mithril rock", l: 55, t: 3, it: "Mithril ore", xp: 80, c: "#5b7fd6" },
  ],
  FSH = [
    { n: "shrimp", l: 1, t: 0, xp: 10 },
    { n: "trout", l: 20, t: 1, xp: 30 },
    { n: "salmon", l: 30, t: 2, xp: 50 },
    { n: "swordfish", l: 50, t: 3, xp: 80 },
  ],
  DEF = () => Object.keys(ARMOR_CLASS).reduce((a, k) => a + worn(k) + 1, 0),
  SHP = {
    gen: {
      g: ["axe", "pick", "rod"],
      i: [
        ["Seeds", 4, 5],
        ["Cooked shrimp", 10, 1],
      ],
    },
    arm: { g: ["helm", "body", "shield", "cowl", "leather", "vamb", "hat", "robe", "mboots", "sword"], i: [] },
    wpn: { g: ["sword", "spear", "bow", "staff"], i: [["Arrows", 20, 10]] },
    farm: {
      g: ["rod"],
      i: [
        ["Seeds", 3, 5],
        ["Cooked trout", 18, 1],
      ],
    },
    fish: {
      g: ["rod"],
      i: [
        ["Cooked trout", 18, 1],
        ["Cooked salmon", 28, 1],
      ],
    },
    warrior: {
      g: [],
      i: [
        ["Bash", 50, 1],
        ["Cleave", 100, 1],
        ["Enrage", 200, 1],
      ],
    },
    ranger: {
      g: [],
      i: [
        ["Rapid", 50, 1],
        ["Snipe", 100, 1],
        ["Volley", 200, 1],
      ],
    },
    mage: {
      g: [],
      i: [
        ["Ice", 50, 1],
        ["Fire", 100, 1],
        ["Nova", 200, 1],
      ],
    },
    smith: {
      g: [],
      i: [
        ["Smith", 100, 1],
      ],
    },
  },
  use = (n) => {
    const s = inv.find((i) => i && i.n == n);
    s.q--;
    if (!s.q) inv[inv.indexOf(s)] = null;
    dirty = true;
  };
/* 4-frame walk cycle: frames 1 & 3 are strides (feet apart, body low), 2 & 4 are passing
 * frames (body raised). Running strides wider and bobs higher. */
const walkBob = (fr, run) => (fr && fr % 2 == 0 ? (run ? 2 : 1) : 0);
function ch(c, x, y, L, d, fr, run = false) {
  const F = (k, a, b, w, h) => {
      c.fillStyle = k;
      c.fillRect(x + a, y + b, w, h);
    },
    sk = SKIN[L.s],
    hr = HC[L.hc],
    sh = SH[L.sh],
    pa = PA[L.pa],
    O = "#2b1d14";
  c.fillStyle = "rgba(0,0,0,.25)";
  c.beginPath();
  c.ellipse(x + 12, y + 21, 7, 3, 0, 0, 6.3);
  c.fill();
  const side = d == 2 || d == 3,
    s = d == 2 ? -1 : 1,
    amp = run ? 2 : 1,
    ph = fr == 1 ? 1 : fr == 3 ? -1 : 0,
    boot = "#4a3220";
  y -= walkBob(fr, run);
  F(O, 6, 0, 12, 11);
  F(O, 4, 8, 16, 9);
  F(O, 7, 15, 10, 7);
  if (side) {
    const lift = fr == 2 ? [0, 1] : fr == 4 ? [1, 0] : [0, 0],
      lx = [10 + ph * amp * s, 10 - ph * amp * s];
    [1, 0].forEach((i) => {
      F(pa, lx[i], 15, 3, 5 - lift[i]);
      F(boot, lx[i] - (s < 0 ? 1 : 0), 20 - lift[i], 4, 2);
      if (i) F("rgba(0,0,0,.22)", lx[i], 15, 3, 7 - lift[i]);
    });
  } else {
    const lift = fr == 1 ? [0, amp] : fr == 3 ? [amp, 0] : [0, 0];
    F(pa, 8, 15, 3, 5 - lift[0]);
    F(pa, 13, 15, 3, 5 - lift[1]);
    F(boot, 8, 20 - lift[0], 3, 2);
    F(boot, 13, 20 - lift[1], 3, 2);
  }
  F(sh, 7, 9, 10, 7);
  const armSwing = ph * (run ? 3 : 2);
  F(sh, 5, 9 + armSwing, 3, 5);
  F(sh, 16, 9 - armSwing, 3, 5);
  F(sk, 5, 13 + armSwing, 2, 2);
  F(sk, 17, 13 - armSwing, 2, 2);
  F(sk, 7, 1, 10, 9);
  if (d == 1) F(hr, 7, 0, 10, L.hs == 1 ? 13 : 9);
  else {
    F(hr, 7, 0, 10, 3);
    if (L.hs == 1) {
      F(hr, 6, 1, 2, 11);
      F(hr, 16, 1, 2, 11);
    } else {
      F(hr, 6, 1, 2, 4);
      F(hr, 16, 1, 2, 4);
    }
    if (L.hs == 2) {
      F(hr, 8, -2, 2, 3);
      F(hr, 11, -3, 2, 4);
      F(hr, 14, -2, 2, 3);
    }
    if (L.hs == 3) F(hr, 10, -3, 5, 4);
    const e = d == 2 ? -1 : d == 3 ? 1 : 0;
    F("#222", 9 + e, 5, 2, 2);
    F("#222", 13 + e, 5, 2, 2);
  }
}
function drawWornGear(c, x, y, direction = 0) {
  drawGear(c, x, y, worn("helm"), worn("body"), worn("shield"), direction, worn("leather"), worn("robe"), {
    cowl: worn("cowl"),
    vamb: worn("vamb"),
    hat: worn("hat"),
    mboots: worn("mboots"),
  });
}
function drawGear(c, x, y, helm, body, shield, direction = 0, leather = -1, robe = -1, extra = {}) {
  const F_ = (color, dx, dy, w, h) => {
      c.fillStyle = color;
      c.fillRect(x + dx, y + dy, w, h);
    },
    shade = (tier) => ["#8a4c24", "#626870", "#6f7a82", "#334c85"][tier] || "#626870",
    bright = (tier) => TC[tier >= 0 ? tier : 1],
    trim = (tier) => ["#efb35b", "#d9e0e5", "#f2cd72", "#b0d7ff"][tier] || "#d9e0e5";
  if (body >= 0) {
    const base = bright(body),
      dark = shade(body),
      shine = trim(body);
    F_(dark, 6, 9, 12, 8);
    F_(base, 7, 9, 10, 7);
    F_(shine, 8, 10, 2, 5);
    F_(base, 10, 10, 4, 5);
    F_(dark, 14, 10, 2, 5);
    F_(shine, 8, 9, 8, 1);
    F_(dark, 7, 16, 10, 2);
    F_(shine, 8, 16, 8, 1);
    F_(dark, 5, 10, 2, 5);
    F_(base, 5, 10, 2, 3);
    F_(dark, 17, 10, 2, 5);
    F_(base, 17, 10, 2, 3);
    F_(shine, 11, 12, 2, 2);
    F_(dark, 8, 18, 8, 1);
  }
  if (leather >= 0) {
    const lc = ARMOR_PAL.leather[leather] || "#8b5a2b";
    F_("#4a2d18", 6, 9, 12, 9);
    F_(lc, 7, 9, 10, 7);
    F_("#b67a3e", 8, 10, 2, 5);
    F_("#70451f", 14, 10, 2, 5);
    F_("#d6aa59", 8, 9, 8, 1);
    F_("#4a2d18", 7, 16, 10, 2);
    F_("#d6aa59", 11, 12, 2, 2);
    if (leather >= 2) [9, 13].forEach((sx) => [11, 14].forEach((sy) => F_("#cfd4da", sx, sy, 1, 1)));
    if (leather >= 3) F_("#2e5a36", 5, 10, 2, 4), F_("#2e5a36", 17, 10, 2, 4);
  }
  if (robe >= 0) {
    const rc = ARMOR_PAL.robe[robe] || "#5d6fd6",
      trimC = ["#d9d4c4", "#ffe97a", "#ffd54f", "#fff1a8"][robe];
    F_("#1f1a33", 5, 9, 14, 13);
    F_(rc, 6, 9, 12, 12);
    F_("#00000033", 6, 16, 12, 5);
    F_(trimC, 11, 9, 2, 12);
    F_(trimC, 6, 9, 12, 1);
    F_(trimC, 6, 20, 12, 1);
    F_(rc, 4, 10, 2, 5);
    F_(rc, 18, 10, 2, 5);
    if (robe >= 1) F_("#c07bff", 11, 12, 2, 2);
  }
  const { cowl = -1, vamb = -1, hat = -1, mboots = -1 } = extra;
  if (vamb >= 0) {
    const vc = LEATHER_PAL[vamb];
    F_("#4a2d18", 4, 11, 4, 4);
    F_("#4a2d18", 16, 11, 4, 4);
    F_(vc, 5, 11, 2, 3);
    F_(vc, 17, 11, 2, 3);
    F_(vamb >= 2 ? "#cfd4da" : "#d6aa59", 5, 12, 2, 1);
    F_(vamb >= 2 ? "#cfd4da" : "#d6aa59", 17, 12, 2, 1);
  }
  if (mboots >= 0) {
    const bc = ROBE_PAL[mboots],
      bt = ["#d9d4c4", "#ffe97a", "#ffd54f", "#fff1a8"][mboots];
    F_("#1f1a33", 7, 18, 5, 5);
    F_("#1f1a33", 12, 18, 5, 5);
    F_(bc, 8, 19, 3, 3);
    F_(bc, 13, 19, 3, 3);
    F_(bt, 8, 19, 3, 1);
    F_(bt, 13, 19, 3, 1);
  }
  if (cowl >= 0) {
    const cc = LEATHER_PAL[cowl],
      cd = "#3a2414";
    if (direction == 1) {
      F_(cd, 5, -2, 14, 13);
      F_(cc, 6, -1, 12, 11);
      F_(cd, 11, 1, 2, 9);
    } else {
      F_(cd, 5, -2, 14, 4);
      F_(cc, 6, -1, 12, 3);
      F_(cd, 4, 1, 4, 10);
      F_(cd, 16, 1, 4, 10);
      F_(cc, 5, 1, 2, 9);
      F_(cc, 17, 1, 2, 9);
      F_(cd, 7, 9, 10, 2);
      F_(cc, 8, 9, 8, 1);
      if (cowl >= 3) F_("#2e5a36", 11, -1, 2, 2);
    }
  }
  if (hat >= 0) {
    const hc = ROBE_PAL[hat],
      ht = ["#d9d4c4", "#ffe97a", "#ffd54f", "#fff1a8"][hat];
    F_("#1f1a33", 2, 0, 20, 3);
    F_(hc, 3, 1, 18, 1);
    F_("#1f1a33", 6, -4, 12, 5);
    F_(hc, 7, -3, 10, 4);
    F_(ht, 7, 0, 10, 1);
    F_("#1f1a33", 8, -7, 8, 4);
    F_(hc, 9, -6, 6, 3);
    F_("#1f1a33", 10, -10, 5, 4);
    F_(hc, 11, -9, 3, 3);
    F_(hc, 14, -11, 3, 2);
    if (hat >= 1) F_("#ffe97a", 11, -3, 2, 2);
  }
  if (helm >= 0) {
    const base = bright(helm),
      dark = shade(helm),
      shine = trim(helm);
    F_(dark, 6, 0, 12, 6);
    F_(base, 7, 0, 10, 5);
    F_(shine, 8, 1, 7, 1);
    F_(dark, 5, 4, 14, 2);
    F_(base, 6, 4, 12, 1);
    F_(dark, 7, 5, 3, 3);
    F_(dark, 14, 5, 3, 3);
    F_(shine, 11, 5, 2, 2);
    if (helm >= 2) {
      F_(shine, 11, -1, 2, 2);
      F_(dark, 5, 2, 2, 2);
      F_(dark, 17, 2, 2, 2);
    }
  }
  if (shield >= 0) {
    const base = bright(shield),
      dark = shade(shield),
      shine = trim(shield),
      side = direction == 2 ? 18 : 1;
    F_(dark, side, 9, 5, 10);
    F_(base, side + 1, 10, 3, 7);
    F_(shine, side + 2, 11, 1, 5);
    F_(dark, side + 1, 17, 3, 2);
  }
}
/* ==========================================================================
 * 14. PLAYER STATE
 * The player object P, spawn point, inventory and starting values.
 * ========================================================================== */
const SPAWN = { x: 116, y: 183 },
  P = {
    x: SPAWN.x,
    y: SPAWN.y,
    ox: SPAWN.x,
    oy: SPAWN.y,
    d: 0,
    path: [],
    act: null,
    cd: 0,
    hp: 10,
    mp: 10,
    hb: 0,
    w: "sword",
    lst_s: "Hitpoints",
    en: 100,
    rage: 0,
  };
/* Warriors use RAGE (0-100) instead of MP: built by landing and taking hits, fades out of combat, spent on skills. */
const RAGE_MAX = 100,
  RAGE_COST = [10, 25, 40],
  gainRage = (n) => {
    P.rage = Math.min(RAGE_MAX, (P.rage || 0) + n);
    P.rageAt = performance.now();
    dirty = true;
  };
/* ==========================================================================
 * 15. SKILLS & XP CURVE
 * Skill list, XP table (xpt), level lookup (lv) and class skill data.
 * ========================================================================== */
const SK = [
    "Attack",
    "Hitpoints",
    "Woodcutting",
    "Mining",
    "Fishing",
    "Cooking",
    "Ranged",
    "Magic",
    "Farming",
    "Defence",
    "Smithing",
    "Crafting",
  ],
  xp = {};
SK.forEach((s) => (xp[s] = 0));
const MAX_SKILL_LEVEL = 99,
  XP_CAP = 200_000_000,
  xpt = [0, 0];
{
  let a = 0;
  for (let l = 1; l < 100; l++) {
    a += Math.floor(l + 300 * 2 ** (l / 7));
    xpt[l + 1] = Math.floor(a / 4);
  }
}
const lv = (s) => {
  let L = 1;
  while (L < MAX_SKILL_LEVEL && xp[s] >= xpt[L + 1]) L++;
  return L;
};
const maxHp = () => 10 + Math.floor((lv("Hitpoints") - 1) / 5);
const CL_SKILLS = {
  Warrior: [
    { n: "Bash", lv: 2, cd: 10, m: 1 },
    { n: "Cleave", lv: 5, cd: 15, m: 2 },
    { n: "Enrage", lv: 10, cd: 30, m: 0 },
    { n: "Smith", lv: 3, cd: 20, m: 1 },
  ],
  Ranger: [
    { n: "Rapid", lv: 2, cd: 10, m: 1 },
    { n: "Snipe", lv: 5, cd: 15, m: 2 },
    { n: "Volley", lv: 10, cd: 30, m: 3 },
    { n: "Smith", lv: 3, cd: 20, m: 1 },
  ],
  Mage: [
    { n: "Ice", lv: 2, cd: 10, m: 1 },
    { n: "Fire", lv: 5, cd: 15, m: 2 },
    { n: "Nova", lv: 10, cd: 30, m: 3 },
    { n: "Smith", lv: 3, cd: 20, m: 1 },
  ],
};
let learnedSkills = Object.fromEntries(
  Object.keys(CL_SKILLS).map((className) => [className, [false, false, false]]),
);
/* ==========================================================================
 * 16. CLASS SKILL SLOTS
 * Cooldowns/state for the three class abilities.
 * ========================================================================== */
const P_SK = [0, 0, 0],
  lvl_up = [];
/* ==========================================================================
 * 17. GLOBAL RUNTIME STATE
 * Tick counter, camera, timers, hover tile, particle/effect lists.
 * ========================================================================== */
let tickN = 0,
  last = performance.now(),
  dirty = true,
  started = false,
  inMine = false,
  mineReturn = null,
  grave = null,
  camx = 0,
  camy = 0,
  hov = { x: -1, y: -1 },
  mark = null,
  showMap = false,
  mapZoom = 1,
  trackedQuest = null,
  tutorialDone = false;
const fx = [],
  gd = [],
  fl = [],
  splats = [],
  proj = [],
  shots = [],
  inv = Array(28).fill(null),
  HOTBAR_SLOTS = 10,
  hotbar = Array(HOTBAR_SLOTS).fill(null); /* quick access toolbar: item names (see js/15b-hotbar.js) */
/* ==========================================================================
 * 18. ITEM ICONS & VALUES
 * Inventory icons, shop prices and cooked-food XP values.
 * ========================================================================== */
const IC = {};
const SELL = {
  Bones: 3,
  Logs: 4,
  "Oak logs": 8,
  "Willow logs": 14,
  "Yew logs": 30,
  "Copper ore": 6,
  Clay: 3,
  "Tin ore": 5,
  "Iron ore": 12,
  "Silver ore": 18,
  "Gold ore": 35,
  Coal: 20,
  "Mithril ore": 40,
  "Adamantite ore": 65,
  "Runite ore": 110,
  "Redberries": 4,
  "Grimy guam": 8,
  "Raw shrimp": 3,
  "Cooked shrimp": 6,
  "Raw salmon": 14,
  "Cooked salmon": 24,
  "Raw swordfish": 30,
  "Cooked swordfish": 55,
  Potato: 7,
  "Raw trout": 8,
  "Cooked trout": 14,
  "Raw chicken": 2,
  "Cooked chicken": 5,
  "Raw beef": 6,
  "Cooked beef": 12,
  "Raw mutton": 5,
  "Cooked mutton": 10,
  Feathers: 2,
  Wool: 4,
  Cowhide: 12,
  Leather: 20,
  "Bowstring": 8,
  Arrows: 1,
  "Bird's nest": 25,
  Amber: 120,
  Pearl: 90,
  "Old boot": 1,
  "Golden potato": 150,
  "Uncut sapphire": 60,
  "Uncut emerald": 110,
  "Uncut ruby": 220,
  "Uncut diamond": 500,
  "Minor health potion": 15,
  "Health potion": 40,
  "Greater health potion": 100,
  "Minor mana potion": 15,
  "Mana potion": 40,
  "Greater mana potion": 100,
  "Stamina potion": 20,
};
/* ==========================================================================
 * 19. INVENTORY HELPERS
 * add / spend / count / remove helpers for the player bag.
 * ========================================================================== */
const full = () => inv.indexOf(null) < 0,
  count = (n) => inv.reduce((a, i) => a + (i && i.n == n ? i.q : 0), 0);
function consumeItem(n, q = 1) {
  if (count(n) < q) return false;
  for (let i = 0; i < inv.length && q > 0; i++) {
    const item = inv[i];
    if (!item || item.n != n) continue;
    const used = Math.min(item.q, q);
    item.q -= used;
    q -= used;
    if (!item.q) inv[i] = null;
  }
  dirty = true;
  return true;
}
function add(n, q = 1) {
  if (typeof n != "string" || !n || n == "undefined" || !(q > 0)) return false;
  if (STK.includes(n)) {
    const s = inv.find((i) => i && i.n == n);
    if (s) {
      s.q += q;
      dirty = true;
      return true;
    }
  }
  const i = inv.indexOf(null);
  if (i < 0) return false;
  inv[i] = { n, q };
  dirty = true;
  return true;
}
function spend(c) {
  const s = inv.find((i) => i && i.n == "Coins");
  if (!s || s.q < c) return false;
  s.q -= c;
  if (!s.q) inv[inv.indexOf(s)] = null;
  dirty = true;
  return true;
}
add("Coins", 30);
