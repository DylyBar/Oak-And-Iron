/* Oak & Iron - World constants, noise, terrain, towns, object spawning (sections 04-12). Loaded in order by index.html. */

/* ==========================================================================
 * 04. WORLD CONSTANTS
 * Tile size (T), map size (W x H) and the logical canvas size (LW x LH).
 * ========================================================================== */
const T = 24,
  W = 480,
  H = 360,
  cv = $("c"),
  g = cv.getContext("2d");
/* Logical canvas size. The height is fixed; fitCanvas() (js/11) widens LW to match the browser window. */
let LW = 768,
  LH = 576;
/* ==========================================================================
 * 05. NOISE HELPERS
 * Hash noise (hs) and smooth value noise (vn) used for terrain and scenery.
 * ========================================================================== */
const hs = (x, y) => {
  const n = Math.sin(x * 127.1 + y * 311.7 + 5) * 43758.5453;
  return n - Math.floor(n);
};
const vn = (x, y) => {
  const xi = Math.floor(x),
    yi = Math.floor(y),
    a = x - xi,
    b = y - yi,
    u = a * a * (3 - 2 * a),
    v = b * b * (3 - 2 * b);
  return (
    hs(xi, yi) * (1 - u) * (1 - v) +
    hs(xi + 1, yi) * u * (1 - v) +
    hs(xi, yi + 1) * (1 - u) * v +
    hs(xi + 1, yi + 1) * u * v
  );
};
let sd = 9;
const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647,
  R = Math.random,
  ri = (a, n) => a[Math.floor(rnd() * n)];
/* ==========================================================================
 * 06. DIRECTION TABLE
 * 8-way neighbour offsets: N, S, E, W and the four diagonals.
 * ========================================================================== */
const D = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
];
/* ==========================================================================
 * 07. WORLD ARRAYS
 * TY = tile type per map cell, RC = decor/region byte, og = object grid.
 * ========================================================================== */
const TY = new Uint8Array(W * H),
  RC = new Uint8Array(W * H),
  og = new Array(W * H).fill(null),
  BT = [0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1];
/* ==========================================================================
 * 08. ISLAND LAYOUT
 * Ellipse list that defines the shape of the world.
 * ========================================================================== */
const ISLANDS = [
  { x: 116, y: 182, rx: 114, ry: 98 },
  { x: 84, y: 62, rx: 74, ry: 56 },
  { x: 380, y: 264, rx: 86, ry: 78 },
  { x: 380, y: 74, rx: 80, ry: 60 },
  { x: 248, y: 302, rx: 76, ry: 50 },
  { x: 252, y: 152, rx: 62, ry: 48 },
  { x: 440, y: 170, rx: 34, ry: 40 },
  { x: 40, y: 330, rx: 30, ry: 22 },
  { x: 320, y: 20, rx: 34, ry: 18 },
  { x: 180, y: 340, rx: 36, ry: 18 },
  { x: 440, y: 340, rx: 30, ry: 22 },
  { x: 62, y: 260, rx: 24, ry: 22 },
  { x: 270, y: 45, rx: 30, ry: 22 },
  { x: 285, y: 245, rx: 34, ry: 25 },
];
/* ==========================================================================
 * 09. TERRAIN FIELD
 * Returns how "inside" a point is: >0 land, <0 water, near 0 = shoreline.
 * ========================================================================== */
function islandAt(x, y) {
  let best = -Infinity;
  for (const a of ISLANDS) {
    const dx = (x - a.x) / a.rx,
      dy = (y - a.y) / a.ry;
    best = Math.max(best, 1 - dx * dx - dy * dy);
  }
  return best;
}
const LAKES = [
  { x: 168, y: 174, rx: 12, ry: 8 },
  { x: 122, y: 61, rx: 10, ry: 7 },
  { x: 220, y: 156, rx: 9, ry: 7 },
  { x: 330, y: 22, rx: 8, ry: 6 },
  { x: 412, y: 282, rx: 10, ry: 8 },
  { x: 413, y: 76, rx: 10, ry: 7 },
  { x: 42, y: 329, rx: 6, ry: 5 },
  { x: 62, y: 260, rx: 7, ry: 6 },
  { x: 270, y: 45, rx: 8, ry: 6 },
  { x: 285, y: 245, rx: 9, ry: 7 },
  { x: 148, y: 226, rx: 8, ry: 6 },
  { x: 190, y: 115, rx: 7, ry: 5 },
  { x: 344, y: 155, rx: 8, ry: 6 },
  { x: 350, y: 330, rx: 7, ry: 5 },
  { x: 30, y: 200, rx: 6, ry: 5 },
];
/* ==========================================================================
 * 10. TERRAIN GENERATION
 * Fills TY with water, sand, grass, forest, rock, town and road tiles.
 * ========================================================================== */
for (let y = 0; y < H; y++)
  for (let x = 0; x < W; x++) {
    const land = islandAt(x, y),
      n = vn(x / 13, y / 13) * 0.65 + vn(x / 4.5, y / 4.5) * 0.35,
      p = vn(x / 4, y / 4);
    if (land < -0.12) TY[y * W + x] = 1;
    else if (land < 0.04) {
      // Add small ponds near shores
      TY[y * W + x] = p > 0.75 && hs(x, y) < 0.3 ? 1 : 2;
    } else {
      const ridge = vn(x / 18 + 31, y / 18 + 17);
      // Inland ponds
      if (ridge < 0.2 && p > 0.8 && hs(x, y) < 0.1) TY[y * W + x] = 1;
      else TY[y * W + x] = ridge > 0.66 || ((x > W * 0.65 || x < W * 0.1) && n > 0.56) ? 3 : 0;
    }
  }
for (const lake of LAKES) {
  for (let y = lake.y - lake.ry - 2; y <= lake.y + lake.ry + 2; y++)
    for (let x = lake.x - lake.rx - 2; x <= lake.x + lake.rx + 2; x++) {
      const dx = (x - lake.x) / lake.rx,
        dy = (y - lake.y) / lake.ry,
        edge = dx * dx + dy * dy + (hs(x, y) - 0.5) * 0.18,
        k = y * W + x;
      if (edge < 0.78) TY[k] = 1;
      else if (edge < 1.18) TY[k] = 2;
    }
}
/* ==========================================================================
 * 11. TOWNS, HOUSES & ROADS
 * Town definitions, house stamping and the road carver used during world gen.
 * ========================================================================== */
const TW = [
  { n: "Oakhaven", x: 116, y: 182, r: 18, h: [-15, -7, 1, 9] },
  { n: "Willowbrook", x: 84, y: 62, r: 13, h: [-8, 2] },
  { n: "Stonebridge", x: 380, y: 264, r: 13, h: [-8, 2] },
  { n: "Seaview", x: 380, y: 74, r: 13, h: [-8, 2] },
];
const RCOL = ["#c0452f", "#3a6fb5", "#4f8f3a", "#8e55c2", "#b58a3d", "#367c78", "#8b6045", "#596b9a"],
  inT = (x, y, m = 0) => TW.find((t) => Math.abs(x - t.x) <= t.r + m && Math.abs(y - t.y) <= 9 + m);
const worldRegion = (x, y) => {
  if (x >= 245 && x <= 305 && y >= 220 && y <= 275) return 6;
  if (x >= 238 && x <= 305 && y >= 20 && y <= 75) return 5;
  if (x >= 35 && x <= 90 && y >= 235 && y <= 285) return 4;
  if (x >= 410 && y >= 135 && y <= 220) return 3;
  if (x >= 335 && y >= 220 && y <= 320) return 2;
  if (x >= 320 && y >= 35 && y <= 112) return 1;
  if (x >= 200 && x <= 300 && y >= 265) return 1;
  if (x <= 155 && y <= 112) return 0;
  if (x <= 210 && y >= 130 && y <= 235) return 0;
  if (x <= 75 && y >= 305) return 1;
  if (x >= 205 && x <= 310 && y >= 115 && y <= 205) return 1;
  return x < 0.55 * W ? 0 : x < 0.78 * W ? 1 : 2;
};
const houseY = (t) => t.y - 11;
function house(x0, y0, c) {
  for (let j = 0; j < 8; j++)
    for (let i = 0; i < 7; i++) {
      const k = (y0 + j) * W + x0 + i;
      TY[k] =
        j < 2
          ? 7
          : j == 7
            ? i == 3 ? 8 : 6
            : i == 0 || i == 6
              ? j == 3 || j == 5 ? 11 : 6
              : 9;
      RC[k] = c;
    }
}
TW.forEach((t, ti) => {
  for (let y = t.y - 12; y <= t.y + 9; y++)
    for (let x = t.x - t.r; x <= t.x + t.r; x++) TY[y * W + x] = 0;
  for (let x = t.x - t.r; x <= t.x + t.r; x++) TY[t.y * W + x] = TY[(t.y + 1) * W + x] = 4;
  for (let y = t.y - 6; y <= t.y + 7; y++) TY[y * W + t.x] = TY[y * W + t.x + 1] = 4;
  t.h.forEach((o, i) => {
    house(t.x + o, houseY(t), (i + ti * 2) % RCOL.length);
    TY[(t.y - 3) * W + t.x + o + 3] = 4;
  });
});
function road(a, b) {
  const c = (x, y) => {
    const k = y * W + x;
    if (TY[k] < 6) TY[k] = TY[k] == 1 ? 5 : 4;
  };
  for (let x = Math.min(a.x, b.x); x <= Math.max(a.x, b.x); x++) {
    c(x, a.y);
    c(x, a.y + 1);
  }
  for (let y = Math.min(a.y, b.y); y <= Math.max(a.y, b.y); y++) {
    c(b.x, y);
    c(b.x + 1, y);
  }
}
for (let i = 1; i < 4; i++) road(TW[0], TW[i]);
road(TW[0], { x: 248, y: 302 });
road({ x: 248, y: 302 }, { x: 252, y: 152 });
road(TW[3], { x: 440, y: 170 });
road(TW[3], { x: 320, y: 20 });
road(TW[0], { x: 40, y: 330 });
road({ x: 248, y: 302 }, { x: 180, y: 340 });
road(TW[2], { x: 440, y: 340 });
road(TW[0], { x: 62, y: 260 });
road(TW[3], { x: 270, y: 45 });
road(TW[2], { x: 285, y: 245 });
/* ==========================================================================
 * 12. WORLD OBJECT SPAWNING
 * Trees, rocks, fishing spots, branches and other interactive objects.
 * ========================================================================== */
const objs = [];
function put(type, x, y, e) {
  const o = { type, x, y, alive: true, solid: type != "fish", rt: 0, ...e };
  objs.push(o);
  og[y * W + x] = o;
  return o;
}
for (let y = 1; y < H - 1; y++)
  for (let x = 1; x < W - 1; x++) {
    const k = y * W + x,
      t = TY[k];
    if (og[k] || inT(x, y, 2)) continue;
    const region = worldRegion(x, y);
    // Increased spawn rates slightly
    if (t == 0 && vn(x / 6 + 9, y / 6 + 4) > 0.68 && hs(x * 1.7, y * 2.3) < 0.07) {
      const tier = region;
      put("tree", x, y, { tier });
    } else if (t == 3 && hs(x + 3, y + 9) < 0.03) {
      const tier = region;
      const roll = hs(x * 7.1 + 19, y * 5.3 + 41);
      let mineOre = "Copper ore",
        miningLevel = 1,
        mineXp = 18;
      if (region == 0) {
        if (roll > 0.56) mineOre = "Tin ore";
      } else if (region == 1) {
        mineOre = roll > 0.78 ? "Silver ore" : "Iron ore";
        miningLevel = roll > 0.78 ? 20 : 15;
        mineXp = roll > 0.78 ? 40 : 35;
      } else if (region == 2) {
        mineOre = roll > 0.82 ? "Gold ore" : roll > 0.42 ? "Coal" : "Iron ore";
        miningLevel = mineOre == "Gold ore" ? 40 : mineOre == "Coal" ? 30 : 15;
        mineXp = mineOre == "Gold ore" ? 65 : mineOre == "Coal" ? 50 : 35;
      } else if (region >= 5 && roll > 0.78) {
        mineOre = "Runite ore";
        miningLevel = 85;
        mineXp = 125;
      } else if (region >= 4 && roll > 0.62) {
        mineOre = "Adamantite ore";
        miningLevel = 70;
        mineXp = 95;
      } else if (roll > 0.94) {
        mineOre = "Runite ore";
        miningLevel = 85;
        mineXp = 125;
      } else if (roll > 0.76) {
        mineOre = "Adamantite ore";
        miningLevel = 70;
        mineXp = 95;
      } else if (roll > 0.42) {
        mineOre = "Mithril ore";
        miningLevel = 55;
        mineXp = 80;
      } else {
        mineOre = "Coal";
        miningLevel = 30;
        mineXp = 50;
      }
      put("rock", x, y, { tier, mineOre, miningLevel, mineXp });
    } else if (t == 2 && hs(x * 5 + 13, y * 7 + 29) < 0.006) {
      put("rock", x, y, { tier: 0, mineOre: "Clay", miningLevel: 1, mineXp: 5 });
    } else if (
      t == 1 &&
      hs(x * 2, y * 3) < 0.055 &&
      [1, -1].some((d) => TY[k + d] == 2 || TY[k + d * W] == 2 || TY[k + d * W + d] == 0)
    )
      put("fish", x, y, { maxTier: worldRegion(x, y) });
  }
for (const lake of LAKES) {
  let placed = 0;
  for (let y = lake.y - lake.ry; y <= lake.y + lake.ry && placed < 4; y++)
    for (let x = lake.x - lake.rx; x <= lake.x + lake.rx && placed < 4; x++) {
      const k = y * W + x;
      if (
        TY[k] == 1 &&
        !og[k] &&
        (TY[k - 1] == 2 || TY[k + 1] == 2 || TY[k - W] == 2 || TY[k + W] == 2)
      ) {
        put("fish", x, y, { maxTier: worldRegion(x, y) });
        placed++;
      }
    }
}
for (let y = 2; y < H - 2; y++)
  for (let x = 2; x < W - 2; x++) {
    const k = y * W + x,
      t = TY[k],
      h = hs(x * 13 + 211, y * 17 + 97);
    if (og[k] || inT(x, y, 2)) continue;
    if (t == 0 && h > 0.02 && h < 0.035)
      put("scenery", x, y, { style: "tree", solid: true });
    else if (t == 0 && h < 0.0018)
      put("herbPatch", x, y, { item: "Grimy guam", req: 1, xp: 10 });
    else if (t == 0 && h > 0.998)
      put("berryBush", x, y, { item: "Redberries", req: 1, xp: 8 });
    else if (t == 0 && h < 0.0035)
      put("scenery", x, y, { style: h < 0.0026 ? "flowers" : "mushrooms", solid: false });
    else if (t == 2 && h < 0.003)
      put("scenery", x, y, { style: "driftwood", solid: false });
    else if (t == 3 && h < 0.002)
      put("scenery", x, y, { style: h < 0.0007 ? "crystal" : "cairn", solid: false });
  }
TW.forEach((t) => {
  put("range", t.x + 4, t.y + 3);
  for (let i = 0; i < 4; i++) put("plot", t.x - 8 + i, t.y + 5, { st: 0, g: 0 });
});
