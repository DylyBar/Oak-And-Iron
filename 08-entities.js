/* Oak & Iron - Entity types, NPC spawning, pathfinding, combat rewards (sections 27-30). Loaded in order by index.html. */

/* ==========================================================================
 * 27. ENTITY TYPES & NPC SPAWNING
 * Enemy stats, ground items, projectiles and where NPCs are placed.
 * ========================================================================== */
const npcs = [],
  ens = [],
  ET = {
    slime: { n: "Slime", hp: 4, mh: 2, lv: 1, c: "#5fd068", bones: false, docile: true },
    goblin: { n: "Goblin", hp: 8, mh: 3, lv: 3, c: "#4a9a3a", bones: true },
    rat: { n: "Rat", hp: 3, mh: 1, lv: 1, c: "#7f8c8d", bones: true },
    crab: { n: "Rock crab", hp: 7, mh: 2, lv: 2, c: "#d97845", bones: false },
    wolf: { n: "Forest wolf", hp: 10, mh: 3, lv: 4, c: "#77736f", bones: true },
    skeleton: { n: "Skeleton", hp: 20, mh: 5, lv: 8, c: "#d7cfb5", bones: true },
    scorpion: { n: "Cave scorpion", hp: 28, mh: 7, lv: 12, c: "#a65c38", bones: false },
    wisp: { n: "Grove wisp", hp: 14, mh: 4, lv: 6, c: "#62e6d3", bones: false, magic: true, spell: "#63f4e3" },
    emberMage: { n: "Ember acolyte", hp: 30, mh: 7, lv: 14, c: "#d65b38", bones: true, magic: true, spell: "#ff7138" },
    frostMage: { n: "Frost witch", hp: 48, mh: 10, lv: 22, c: "#83bce8", bones: true, magic: true, spell: "#89e8ff" },
    basaltGolem: { n: "Basalt golem", hp: 86, mh: 13, lv: 34, c: "#6d6660", bones: false },
    stormDrake: { n: "Storm drake", hp: 118, mh: 17, lv: 48, c: "#538b9c", bones: true, magic: true, spell: "#8ceaff" },
    voidKnight: { n: "Void knight", hp: 148, mh: 21, lv: 62, c: "#59416f", bones: true, magic: true, spell: "#cb7cff" },
    mossheart: { n: "Mossheart Guardian", hp: 190, mh: 12, lv: 18, c: "#527d3d", bones: false, boss: true },
    cindermaw: { n: "Cindermaw", hp: 310, mh: 18, lv: 34, c: "#c45a35", bones: true, boss: true, magic: true, spell: "#ff8a3d" },
    tempest: { n: "Tempest, Sky Tyrant", hp: 470, mh: 25, lv: 55, c: "#4b91b2", bones: true, boss: true, magic: true, spell: "#a6efff" },
    chicken: { n: "Farm chicken", hp: 3, mh: 0, rmh: 1, lv: 1, c: "#d8c8a4", bones: true, passive: true },
    cow: { n: "Farm cow", hp: 8, mh: 0, rmh: 2, lv: 2, c: "#eee5d3", bones: true, passive: true },
    sheep: { n: "Farm sheep", hp: 6, mh: 0, rmh: 1, lv: 2, c: "#e5e3d8", bones: true, passive: true },
  };
const makeEnemy = (t, x, y) => ({
  t,
  x,
  y,
  ox: x,
  oy: y,
  hx: x,
  hy: y,
  hp: ET[t].hp,
  dead: false,
  rt: 0,
  tg: null,
  cd: 0,
  hb: 0,
  path: [],
});
/* Anything that is attacked fights back, including farm animals (passive only means "won't start a fight"). */
const provoke = (e) => {
  if (!e || e.dead) return;
  if (e.tg != P) e.ag = performance.now() + 1100;
  e.tg = P;
};
const enemyCanAggro = (type, playerLevel = cmb()) => {
  const enemy = ET[type];
  return !!enemy && !enemy.passive && !enemy.docile && playerLevel <= enemy.lv * 2;
};
TW.forEach((t) =>
  LN[t.n].forEach((a, i) => {
    const outsideTrainer = a[1] == "trainer" && ["warrior", "ranger", "mage"].includes(a[3]),
      inside = a[4] !== undefined && !outsideTrainer,
      bx = inside ? t.x + t.h[a[4]] : 0,
      x = outsideTrainer
        ? t.x + { warrior: -7, ranger: 0, mage: 7 }[a[3]]
        : inside
          ? bx + (a[5] === undefined ? 3 : a[5])
          : t.x - 2 + i * 2,
      y = outsideTrainer ? t.y + 12 : inside ? houseY(t) + (a[6] === undefined ? 4 : a[6]) : t.y + 3 + (i % 2),
      l = {
        s: Math.floor(rnd() * 5),
        hs: Math.floor(rnd() * 4),
        hc: Math.floor(rnd() * 6),
        sh: Math.floor(rnd() * 6),
        pa: Math.floor(rnd() * 4),
      };
    const n = {
      n: a[0],
      role: a[1],
      lines: a[2],
      kind: a[3],
      i: 0,
      look: l,
      x,
      y,
      ox: x,
      oy: y,
      hx: x,
      hy: y,
      fixed: inside || outsideTrainer,
      d: outsideTrainer ? 3 : 0,
      task: outsideTrainer ? "practice" : "idle",
      taskPool: outsideTrainer
        ? ["practice"]
        : a[1] == "shop"
          ? ["work", "tidy", "wave"]
          : a[1] == "bank"
            ? ["work", "read", "idle"]
            : ["look", "wave", "idle"],
      taskUntil: tickN + 2 + Math.floor(rnd() * 5),
    };
    npcs.push(n);
    if (inside && a[5] === undefined) {
      put(a[1] == "talk" ? "table" : "counter", bx + 3, houseY(t) + 2).npc = n;
      put("shelf", bx + 1, houseY(t) + 2);
      put("barrel", bx + 5, houseY(t) + 2);
    }
  }),
);
// Keep Bram clear of the shop doorway/interior traffic. Place him at his own
// spot on the Oakhaven plaza and synchronize his movement anchors so he does
// not snap back to the old spawn tile during the next NPC update.
const bramNpc = npcs.find((npc) => npc.n === "Bram");
if (bramNpc) {
  const oakhaven = TW.find((town) => town.n === "Oakhaven");
  if (oakhaven) {
    bramNpc.x = oakhaven.x;
    bramNpc.y = oakhaven.y + 7;
    bramNpc.ox = bramNpc.hx = bramNpc.x;
    bramNpc.oy = bramNpc.hy = bramNpc.y;
    bramNpc.fixed = true;
  }
}
// Move Mayor Elric away from Bram so their character sprites do not overlap
// on the Oakhaven plaza. Keep his movement anchors in sync with the new spot.
const mayorNpc = npcs.find((npc) => npc.n === "Mayor Elric");
if (mayorNpc) {
  const oakhaven = TW.find((town) => town.n === "Oakhaven");
  if (oakhaven) {
    mayorNpc.x = oakhaven.x - 9;
    mayorNpc.y = oakhaven.y + 3;
    mayorNpc.ox = mayorNpc.hx = mayorNpc.x;
    mayorNpc.oy = mayorNpc.hy = mayorNpc.y;
    mayorNpc.fixed = true;
  }
}
const VILLAGE_PROPS = {
  Oakhaven: [
    [-8, 6, "cart"],
    [8, 6, "stall"],
    [-11, 0, "well"],
    [11, 1, "lantern"],
    [-11, 7, "crates"],
    [11, 7, "bench"],
  ],
  Willowbrook: [
    [-10, 6, "produceCart"],
    [10, 6, "stall"],
    [-11, 0, "planter"],
    [11, 0, "lantern"],
  ],
  Stonebridge: [
    [-10, 6, "oreCart"],
    [10, 6, "anvil"],
    [-11, 0, "crates"],
    [11, 0, "sign"],
  ],
  Seaview: [
    [-10, 6, "fishCart"],
    [10, 6, "fishStall"],
    [-11, 0, "netRack"],
    [11, 0, "barrel"],
  ],
};
TW.forEach((t) => {
  (VILLAGE_PROPS[t.n] || []).forEach(([dx, dy, style]) => {
    const x = t.x + dx,
      y = t.y + dy;
    if (
      og[y * W + x] ||
      npcs.some((n) => !n.cave && Math.abs(n.x - x) <= 1 && Math.abs(n.y - y) <= 1)
    )
      return;
    const labels = {
      cart: "a wooden handcart",
      produceCart: "a cart of fresh produce",
      oreCart: "a cart loaded with ore",
      fishCart: "a fisher's handcart",
      stall: "a village market stall",
      fishStall: "a fishmonger's stall",
      well: "the village well",
      lantern: "a street lantern",
      crates: "stacked supply crates",
      bench: "a wooden bench",
      planter: "a flower planter",
      anvil: "a village anvil",
      craftingBench: "a leatherworking and fletching bench",
      sign: "a carved village sign",
      netRack: "a rack of fishing nets",
      barrel: "a weathered barrel",
      windChime: "a little trail-side wind chime",
      telescope: "an old brass sea telescope",
      campfire: "a cozy island campfire",
      shells: "a colorful pile of seashells",
      dummy: "a straw practice dummy",
    };
    put("villageProp", x, y, { style, label: labels[style], solid: false });
  });
});
const FUN_OBJECTS = [
  ["windChime", "a trail-side wind chime", "A tiny tune dances through the breeze.", "#bce7df"],
  ["telescope", "an old brass sea telescope", "You spot a distant sail and wonder where it is going.", "#9dd7e8"],
  ["campfire", "a cozy island campfire", "You warm your hands by the crackling fire.", "#ffad53"],
  ["shells", "a colorful pile of seashells", "You find a shell shaped like a little spiral.", "#f5a8bf"],
  ["dummy", "a straw practice dummy", "You give the practice dummy a playful tap.", "#f4d36a"],
];
for (let y = 2; y < H - 2; y++)
  for (let x = 2; x < W - 2; x++) {
    const k = y * W + x,
      h = hs(x * 29 + 317, y * 37 + 811);
    if (
      h > 0.00055 ||
      (TY[k] != 0 && TY[k] != 2) ||
      og[k] ||
      inT(x, y, 4) ||
      npcs.some((n) => Math.abs(n.x - x) <= 1 && Math.abs(n.y - y) <= 1)
    )
      continue;
    const styleIndex = Math.floor(hs(x * 41 + 17, y * 43 + 29) * FUN_OBJECTS.length),
      [style, label, funMessage, fun] = FUN_OBJECTS[styleIndex];
    put("villageProp", x, y, { style, label, funMessage, fun, solid: false });
  }
TW.forEach((t) => {
  const placeStation = (type, options) => {
    const spot = options
      .map(([dx, dy]) => ({ x: t.x + dx, y: t.y + dy }))
      .find(
        (p) =>
          !og[p.y * W + p.x] &&
          !npcs.some((n) => !n.cave && Math.abs(n.x - p.x) <= 1 && Math.abs(n.y - p.y) <= 1),
      );
    if (spot) put(type, spot.x, spot.y, { solid: false });
  };
  placeStation("furnace", [
    [-5, 3],
    [6, 3],
    [-5, 5],
  ]);
  placeStation("anvil", [
    [5, 3],
    [-6, 3],
    [6, 5],
  ]);
  placeStation("craftingBench", [
    [-7, 5],
    [7, 5],
    [-6, 6],
  ]);
});
/* Enemy populations are placed in deliberate, separated camps rather than
 * scattered by a world-wide random spawn pass. Each camp has a home anchor;
 * idle movement and respawning keep enemies close to that anchor. */
const spawnFarm = (type, count, area) => {
  for (let added = 0, tries = 0; added < count && tries < 6000; tries++) {
    const x = area.x1 + Math.floor(R() * (area.x2 - area.x1 + 1)),
      y = area.y1 + Math.floor(R() * (area.y2 - area.y1 + 1)),
      k = y * W + x;
    if (
      !(TY[k] == 0 || TY[k] == 3) ||
      og[k] ||
      inT(x, y, 8) ||
      ens.some((e) => !e.dead && Math.abs(e.x - x) + Math.abs(e.y - y) < 5)
    )
      continue;
    ens.push(makeEnemy(type, x, y));
    added++;
  }
};
spawnFarm("chicken", 12, { x1: 143, x2: 195, y1: 145, y2: 177 });
spawnFarm("cow", 12, { x1: 111, x2: 155, y1: 38, y2: 89 });
spawnFarm("sheep", 12, { x1: 145, x2: 202, y1: 197, y2: 231 });
const spawnRegional = (type, count, region, area, anchor, spread = 5) => {
  const [cx, cy] = anchor;
  for (let added = 0, tries = 0; added < count && tries < 9000; tries++) {
    // A triangular offset makes a compact camp with a denser centre.
    const x = Math.round(cx + (R() + R() - 1) * spread),
      y = Math.round(cy + (R() + R() - 1) * spread),
      k = y * W + x;
    if (
      x < 1 || x >= W - 1 || y < 1 || y >= H - 1 ||
      worldRegion(x, y) != region ||
      !(TY[k] == 0 || TY[k] == 3) || og[k] || inT(x, y, 8) ||
      ens.some((e) => Math.abs(e.x - x) <= 2 && Math.abs(e.y - y) <= 2) ||
      !area(x, y, k)
    ) continue;
    const enemy = makeEnemy(type, x, y);
    // Keep a personal home position so idle wandering/respawning stays local.
    enemy.hx = enemy.ox = x;
    enemy.hy = enemy.oy = y;
    enemy.campX = cx;
    enemy.campY = cy;
    ens.push(enemy);
    added++;
  }
};
// Early-game mainland camps — kept separate from farms and each other.
spawnRegional("slime", 18, 0, (x, y) => x >= 35 && x <= 85 && y >= 145 && y <= 195, [61, 169], 9);
spawnRegional("goblin", 16, 0, (x, y) => x >= 145 && x <= 195 && y >= 80 && y <= 130, [170, 105], 8);
spawnRegional("wolf", 12, 0, (x, y) => x >= 115 && x <= 155 && y >= 75 && y <= 112, [135, 94], 6);
spawnRegional("wisp", 14, 0, (x, y) => x >= 70 && x <= 165 && y >= 65 && y <= 125, [91, 86], 6);
// Coastal and northern islands.
spawnRegional("crab", 14, 1, (x, y, k) => x >= 320 && y < 112 && [TY[k - 1], TY[k + 1], TY[k - W], TY[k + W]].includes(1), [370, 92], 8);
spawnRegional("goblin", 12, 1, (x, y) => x >= 200 && x <= 300 && y >= 115 && y <= 205, [267, 177], 8);
// Eastern ash island.
spawnRegional("skeleton", 16, 2, (x, y) => x >= 335 && y >= 220 && y <= 320, [373, 272], 9);
spawnRegional("emberMage", 10, 2, (x, y) => x >= 335 && x <= 405 && y >= 220 && y <= 315, [397, 242], 6);
// Frost island in the east.
spawnRegional("scorpion", 12, 3, (x, y) => x >= 410 && y >= 135 && y <= 220, [441, 190], 7);
spawnRegional("frostMage", 10, 3, (x, y) => x >= 410 && x <= 475 && y >= 135 && y <= 220, [463, 153], 5);
// Remote high-level islands.
spawnRegional("basaltGolem", 14, 4, (x, y) => x >= 35 && x <= 90 && y >= 235 && y <= 285, [58, 260], 7);
spawnRegional("stormDrake", 12, 5, (x, y) => x >= 238 && x <= 305 && y >= 20 && y <= 75, [270, 47], 7);
spawnRegional("voidKnight", 10, 6, (x, y) => x >= 245 && x <= 305 && y >= 220 && y <= 275, [275, 248], 6);

/* Story bosses: each is anchored to a distinct island region and respawns slowly. */
function spawnWorldBoss(type, cx, cy, region) {
  let spot = null;
  for (let radius = 0; radius <= 12 && !spot; radius++) {
    for (let dy = -radius; dy <= radius && !spot; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) != radius) continue;
        const x = cx + dx, y = cy + dy, k = y * W + x;
        if (x < 2 || y < 2 || x >= W - 2 || y >= H - 2) continue;
        if (worldRegion(x, y) != region || !(TY[k] == 0 || TY[k] == 3) || og[k] || inT(x, y, 10)) continue;
        if (ens.some((e) => !e.dead && Math.abs(e.x - x) + Math.abs(e.y - y) < 5)) continue;
        spot = { x, y };
        break;
      }
    }
  }
  if (!spot) return;
  const boss = makeEnemy(type, spot.x, spot.y);
  boss.hx = boss.ox = spot.x;
  boss.hy = boss.oy = spot.y;
  boss.campX = spot.x;
  boss.campY = spot.y;
  boss.boss = true;
  boss.rt = 0;
  ens.push(boss);
}
spawnWorldBoss("mossheart", 91, 86, 0);
spawnWorldBoss("cindermaw", 410, 290, 2);
spawnWorldBoss("tempest", 270, 47, 5);

const MINE = { left: 440, top: 326, right: 477, bottom: 357, entryY: 342 },
  MINE_ENTRANCES = [
    { x: 232, y: 150 },
    { x: 421, y: 300 },
    { x: 19, y: 327 },
    { x: 438, y: 170 },
  ];
const mineMarkers = $("mineMarkers");
MINE_ENTRANCES.forEach((entrance, index) => {
  const marker = document.createElement("button");
  marker.type = "button";
  marker.className = "mine-map-marker";
  marker.textContent = "M";
  marker.title = `Mine entrance ${index + 1}`;
  marker.setAttribute("aria-label", `Mine entrance ${index + 1}`);
  marker.style.left = (entrance.x / W) * 228 + "px";
  marker.style.top = (entrance.y / H) * 152 + "px";
  mineMarkers.appendChild(marker);
});
const inCaveBounds = (x, y) =>
  x >= MINE.left && x <= MINE.right && y >= MINE.top && y <= MINE.bottom;
for (let i = objs.length - 1; i >= 0; i--) {
  const o = objs[i];
  if (inCaveBounds(o.x, o.y)) {
    og[o.y * W + o.x] = null;
    objs.splice(i, 1);
  }
}
for (let i = ens.length - 1; i >= 0; i--)
  if (inCaveBounds(ens[i].x, ens[i].y)) ens.splice(i, 1);
for (let y = MINE.top; y <= MINE.bottom; y++)
  for (let x = MINE.left; x <= MINE.right; x++) {
    const wall =
      x == MINE.left || x == MINE.right || y == MINE.top || y == MINE.bottom;
    TY[y * W + x] = wall ? 3 : 10;
  }
TY[MINE.entryY * W + MINE.left] = 10;
TY[(MINE.entryY + 1) * W + MINE.left] = 10;
TY[MINE.entryY * W + (MINE.left + 1)] = 10;
put("mineExit", MINE.left, MINE.entryY, { solid: false });
const clearMineSite = (x, y) => {
  for (let i = objs.length - 1; i >= 0; i--) {
    const o = objs[i];
    if (Math.abs(o.x - x) <= 2 && Math.abs(o.y - y) <= 2) {
      og[o.y * W + o.x] = null;
      objs.splice(i, 1);
    }
  }
  for (let i = ens.length - 1; i >= 0; i--)
    if (Math.abs(ens[i].x - x) <= 2 && Math.abs(ens[i].y - y) <= 2) ens.splice(i, 1);
  for (let dy = -2; dy <= 2; dy++)
    for (let dx = -2; dx <= 2; dx++) TY[(y + dy) * W + x + dx] = 0;
};
MINE_ENTRANCES.forEach(({ x, y }) => {
  clearMineSite(x, y);
  put("mineEntrance", x, y, { solid: false });
});
[
  [448, 336, 0, "Copper ore"],
  [445, 337, 0, "Tin ore"],
  [451, 339, 0, "Copper ore"],
  [448, 341, 0, "Tin ore"],
  [455, 336, 0, "Tin ore"],
  [454, 342, 1, "Iron ore"],
  [460, 338, 1, "Iron ore"],
  [466, 341, 2, "Coal"],
  [465, 336, 2, "Coal"],
  [471, 338, 1, "Iron ore"],
  [451, 350, 0, "Tin ore"],
  [457, 352, 1, "Iron ore"],
  [460, 350, 2, "Coal"],
  [464, 350, 2, "Coal"],
  [468, 351, 2, "Mithril ore"],
  [471, 350, 3, "Mithril ore"],
].forEach(([x, y, tier, ore]) => {
  const miningLevel = { "Copper ore": 1, "Tin ore": 1, "Iron ore": 15, Coal: 30, "Mithril ore": 55 }[ore];
  const mineXp = { "Copper ore": 17.5, "Tin ore": 17.5, "Iron ore": 35, Coal: 50, "Mithril ore": 80 }[ore];
  put("rock", x, y, { tier, mineOre: ore, miningLevel, mineXp });
});
const spawnRat = (x, y) => {
  const rat = {
    t: "rat",
    x,
    y,
    ox: x,
    oy: y,
    hx: x,
    hy: y,
    hp: ET.rat.hp,
    dead: false,
    rt: 0,
    tg: null,
    cd: 0,
    hb: 0,
    path: [],
  };
  ens.push(rat);
};
[
  [452, 344],
  [461, 344],
  [470, 344],
  [458, 347],
].forEach(([x, y]) => spawnRat(x, y));
ens.push(makeEnemy("skeleton", 470, 346), makeEnemy("scorpion", 473, 350));
[
  ["Tessa", "The lower tunnels are crawling with rats. Help me clear them out."],
  ["Pip", "The tunnel supports need copper ore. Bring me a few loads if you find any."],
].forEach(([name, line], i) => {
  const x = 444,
    y = 342 + i * 5;
  npcs.push({
    n: name,
    role: "talk",
    lines: [line],
    i: 0,
    look: {
      s: Math.floor(rnd() * 5),
      hs: Math.floor(rnd() * 4),
      hc: Math.floor(rnd() * 6),
      sh: Math.floor(rnd() * 6),
      pa: Math.floor(rnd() * 4),
    },
    x,
    y,
    ox: x,
    oy: y,
    hx: x,
    hy: y,
    d: 0,
    fixed: true,
    cave: true,
    task: "idle",
    taskPool: i == 0 ? ["look", "wave", "idle"] : ["work", "tidy", "idle"],
    taskUntil: tickN + 2 + Math.floor(rnd() * 5),
  });
});
const enterMine = () => {
  if (inMine) return;
  mineReturn = { x: P.x, y: P.y };
  inMine = true;
  P.x = P.ox = MINE.left + 2;
  P.y = P.oy = MINE.entryY;
  P.path = [];
  P.act = null;
  ens.forEach((q) => (q.tg = null));
  $("shop").style.display = "none";
  msg("You enter the mine. Watch for rats and mine the ore veins.");
  dirty = true;
  const quest = QS.find((entry) => entry.id == trackedQuest),
    giver = quest && npcs.find((npc) => npc.n == quest.g && npc.cave);
  if (giver) setAct("talk", giver);
};
const leaveMine = () => {
  if (!inMine) return;
  const destination = mineReturn || MINE_ENTRANCES[0];
  inMine = false;
  P.x = P.ox = destination.x;
  P.y = P.oy = destination.y;
  P.path = [];
  P.act = null;
  mineReturn = null;
  ens.forEach((q) => (q.tg = null));
  msg("You leave the mine.");
  dirty = true;
};
/* ==========================================================================
 * 28. COLLISION & PATHFINDING
 * bl() = blocked tile test; findPath() = BFS over walkable tiles.
 * ========================================================================== */
const bl = (x, y) => {
  if (x < 0 || y < 0 || x >= W || y >= H) return true;
  if (inMine && !inCaveBounds(x, y)) return true;
  const k = y * W + x;
  return BT[TY[k]] || (og[k] && og[k].solid && og[k].alive);
};
function findPath(s, goal, max = W * H) {
  if (goal(s.x, s.y)) return [];
  const pv = new Int32Array(W * H).fill(-2),
    q = [s.y * W + s.x];
  pv[q[0]] = -1;
  let i = 0;
  while (i < q.length && i < max) {
    const c = q[i++],
      cx = c % W,
      cy = (c / W) | 0;
    for (const [dx, dy] of D) {
      const nx = cx + dx,
        ny = cy + dy;
      if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
      const k = ny * W + nx;
      if (pv[k] != -2 || bl(nx, ny) || (dx && dy && (bl(cx + dx, cy) || bl(cx, cy + dy)))) continue;
      pv[k] = c;
      if (goal(nx, ny)) {
        const p = [];
        let a = k;
        while (pv[a] != -1) {
          p.push([a % W, (a / W) | 0]);
          a = pv[a];
        }
        return p.reverse();
      }
      q.push(k);
    }
  }
  return null;
}
/* ==========================================================================
 * 29. ENTITY STEPPING
 * Moves an entity along its path and updates facing/animation.
 * ========================================================================== */
const step = (e, n) => {
  let moved = 0;
  for (let i = 0; i < n && e.path.length; i++, moved++) {
    const [x, y] = e.path.shift(),
      dx = x - e.x,
      dy = y - e.y;
    e.d = dy > 0 ? 0 : dy < 0 ? 1 : dx < 0 ? 2 : 3;
    e.x = x;
    e.y = y;
  }
  if (e === P && moved) playerMoved(moved);
};
const goalAdj = (t) => (x, y) => Math.abs(x - t.x) + Math.abs(y - t.y) == 1 && !bl(x, y);
/* ==========================================================================
 * 30. COMBAT: DEATH, LOOT & REWARDS
 * Respawn timing, loot drops, quest progress and XP on kill.
 * ========================================================================== */
function killCheck(t) {
  if (t.hp <= 0 && !t.dead) {
    t.dead = true;
    t.rt = tickN + (ET[t.t].boss ? 300 : 30);
    QS.forEach((q) => {
      if (q.t == "kill" && q.i == t.t && qs[q.id].s == 1) qs[q.id].k++;
    });
    dirty = true;
    t.tg = null;
    P.act = null;
    msg("You defeat the " + ET[t.t].n.toLowerCase() + ".");
    sfx("edie");
    sfx(creatureVoice(t.t));
    dropLoot(t);
  }
  function dropLoot(t) {
    const type = ET[t.t],
      L = type.lv;
    if (!type.passive && R() < 0.65) gdrop("Coins", 1 + Math.floor(R() * (3 + L * 3)), t.x, t.y);
    if (type.bones) gdrop("Bones", 1, t.x, t.y);
    if (t.t == "slime" && R() < 0.3) gdrop("Seeds", 1 + Math.floor(R() * 3), t.x, t.y);
    if (t.t == "goblin") {
      if (R() < 0.3) gdrop("Arrows", 5 + Math.floor(R() * 10), t.x, t.y);
      if (R() < 0.2) gdrop(R() < 0.5 ? "Copper ore" : "Iron ore", 1, t.x, t.y);
    }
    if (t.t == "crab" && R() < 0.35) gdrop("Raw shrimp", 1, t.x, t.y);
    if (t.t == "wolf" && R() < 0.25) gdrop("Raw trout", 1, t.x, t.y);
    if (t.t == "chicken") {
      gdrop("Raw chicken", 1, t.x, t.y);
      if (R() < 0.8) gdrop("Feathers", 5 + Math.floor(R() * 8), t.x, t.y);
    }
    if (t.t == "cow") {
      gdrop("Raw beef", 1, t.x, t.y);
      if (R() < 0.85) gdrop("Cowhide", 1, t.x, t.y);
    }
    if (t.t == "sheep") {
      gdrop("Raw mutton", 1, t.x, t.y);
      if (R() < 0.9) gdrop("Wool", 1 + Math.floor(R() * 2), t.x, t.y);
    }
    if (t.t == "skeleton" && R() < 0.2) gdrop("Runes", 1 + Math.floor(R() * 3), t.x, t.y);
    if (t.t == "scorpion" && R() < 0.2) gdrop("Runes", 2 + Math.floor(R() * 4), t.x, t.y);
    if (ET[t.t].magic && R() < 0.65) gdrop("Runes", 2 + Math.floor(R() * ET[t.t].lv / 4), t.x, t.y);
    MONSTER_BONUS.forEach(([n, c, min]) => {
      if (L >= min && R() < c) gdrop(n, 1, t.x, t.y);
    });
    if (ET[t.t].boss) {
      gdrop("Coins", 250 + L * 35, t.x, t.y);
      gdrop(L >= 50 ? "Uncut diamond" : L >= 30 ? "Uncut ruby" : "Uncut emerald", 1, t.x, t.y);
      gdrop("Runes", 12 + L, t.x, t.y);
      msg("LEGENDARY VICTORY! The guardian's hoard is yours.", 1);
    }
    msg("The " + ET[t.t].n.toLowerCase() + " drops some loot.");
  }
}
