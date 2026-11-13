/* Oak & Iron - Weapon, tool and gear sprites, colour helpers (sections 20-23). Loaded in order by index.html. */

/* ==========================================================================
 * 20. WEAPON & TOOL SPRITES
 * Pixel art definitions for weapons and tools held by characters.
 * ========================================================================== */
const SPR = {
  LOG: [".oooooooo.", "o22222oo4o", "o11111o44o", "o11111o4oo", "o33333o44o", ".oooooooo."],
  ORE: ["...oooo...", "..o2222oo.", "..o222414o", "o22144111o", "o11114133o", ".o333333o.", "..oooooo.."],
  FISH: ["..ooooo...", "o.o22222o.", "ooo1111w1o", "ooo333333o", "o.o44444o.", "..ooooo..."],
  SHRIMP: ["..oooo....", ".o2222o...", "o22wo22o..", "o2222222o.", ".o111111o.", "..o3o.o3o."],
  SWORD: ["....ooooo.", "o..o22221o", "ooo2211w1o", "o..o33333o", "....o4444o", ".....ooooo"],
  COIN: ["...oooo...", "..o2221oo.", ".o221111o.", ".o211131o.", ".o111333o.", "..o3333o..", "...oooo..."],
  SEED: ["..oo...oo.", ".o12o.o12o", ".o11o.o11o", "..oo..o11o", "........oo"],
  ARROW: ["..........", "ww....o2o.", "w11111122o", "ww....o2o."],
  RUNE: ["..oooooo..", ".o222222o.", "o22244222o", "o22414122o", "o22244222o", ".o333333o.", "..oooooo.."],
  POT: ["..oooooo..", ".o222221o.", "o22211111o", "o21113111o", "o11111131o", ".o333333o.", "..oooooo.."],
  BONE: ["oo......oo", "o1oooooo1o", "o11111111o", "o1oooooo1o", "oo......oo"],
};
const SC = {};
[
  ["Logs", "LOG", ["#b98a55", "#d4a870", "#8a6234", "#f0d9a8"]],
  ["Oak logs", "LOG", ["#8a4f26", "#a86a3a", "#5a3016", "#d2a86a"]],
  ["Willow logs", "LOG", ["#9aa65a", "#b8c478", "#6a7a3a", "#e4f0a8"]],
  ["Yew logs", "LOG", ["#6b3a3a", "#8a5252", "#3d1f1f", "#e0a070"]],
  ["Copper ore", "ORE", ["#8c8c8c", "#b0b0b0", "#5e5e5e", "#e0833a"]],
  ["Clay", "ORE", ["#79594a", "#b38a72", "#49372f", "#dfb69a"]],
  ["Tin ore", "ORE", ["#8c8c8c", "#b0b0b0", "#5e5e5e", "#d4d8dc"]],
  ["Iron ore", "ORE", ["#7d7d7d", "#a0a0a0", "#555", "#b0523a"]],
  ["Silver ore", "ORE", ["#aab2bd", "#dce3eb", "#68717e", "#f7f7f7"]],
  ["Gold ore", "ORE", ["#9a7430", "#e0b84c", "#594018", "#fff1a1"]],
  ["Coal", "ORE", ["#3a3a3a", "#555", "#1e1e1e", "#777"]],
  ["Mithril ore", "ORE", ["#7e8aa0", "#a0acc0", "#505c70", "#6a9aff"]],
  ["Adamantite ore", "ORE", ["#476a50", "#74a37b", "#294332", "#b3e1a4"]],
  ["Runite ore", "ORE", ["#70454c", "#a86a73", "#3f2930", "#f0a3b0"]],
  ["Ore", "ORE", ["#8a8a8a", "#aaa", "#5e5e5e", "#e8c84a"]],
  ["Raw shrimp", "SHRIMP", ["#f4a08a", "#ffc8b8", "#c8644e"]],
  ["Cooked shrimp", "SHRIMP", ["#e07030", "#f09050", "#a04a1a"]],
  ["Raw trout", "FISH", ["#6f9a7a", "#9fc4a0", "#4f7060", "#d8e8c8"]],
  ["Raw fish", "FISH", ["#8a9aa8", "#b0c0cc", "#5a6a78", "#e8eef2"]],
  ["Cooked trout", "FISH", ["#c98a3a", "#e0a860", "#8a5a1e", "#f0d8a0"]],
  ["Cooked fish", "FISH", ["#b8844a", "#d8a470", "#7a5230", "#ecd8b0"]],
  ["Raw salmon", "FISH", ["#e0805a", "#f4a07a", "#b0583a", "#f8c8b0"]],
  ["Cooked salmon", "FISH", ["#d9743a", "#ee9a5a", "#9a4a1a", "#f6c89a"]],
  ["Burnt fish", "FISH", ["#2a2a2a", "#444", "#111", "#333"]],
  ["Raw swordfish", "SWORD", ["#5a7fa8", "#7fa2c8", "#3a5878", "#cfd8e0"]],
  ["Cooked swordfish", "SWORD", ["#b8803a", "#d8a060", "#7a4e1e", "#f0d8a8"]],
  ["Coins", "COIN", ["#f2b632", "#ffe07a", "#b87a14"]],
  ["Seeds", "SEED", ["#c9a45a", "#e8d08a"]],
  ["Arrows", "ARROW", ["#8b5a2b", "#c0c4c8"]],
  ["Runes", "RUNE", ["#000", "#6a5acd", "#33236f", "#d8f0ff"]],
  ["Potato", "POT", ["#b8894f", "#d4a86a", "#6e4a24"]],
  ["Redberries", "SEED", ["#8c1d32", "#ee536c"]],
  ["Grimy guam", "SEED", ["#5d6e36", "#89a64a"]],
  ["Bones", "BONE", ["#efe6d0"]],
].forEach(([n, sh, pal]) => {
  const c = document.createElement("canvas");
  c.width = 10;
  c.height = 10;
  const x = c.getContext("2d"),
    r = SPR[sh],
    oy = Math.floor((10 - r.length) / 2);
  r.forEach((row, j) =>
    [...row].forEach((ch, i) => {
      if (ch == ".") return;
      x.fillStyle = ch == "o" ? "#2b1d14" : ch == "w" ? "#fff" : pal[+ch - 1];
      x.fillRect(i, oy + j, 1, 1);
    }),
  );
  SC[n] = c;
  IC[n] = '<img class="ic" src="' + c.toDataURL() + '">';
});
Object.assign(WP, {
  dagger: { r: 1, sk: "Attack", cd: 2, b: -1 },
  mace: { r: 1, sk: "Attack", cd: 4, b: 2 },
  wand: { r: 12, sk: "Magic", cd: 3, b: 0 },
  xbow: { r: 12, sk: "Ranged", cd: 5, b: 2 },
});
Object.assign(GN, { dagger: "Dagger", mace: "Mace", wand: "Wand", xbow: "Crossbow", sickle: "Sickle" });
Object.assign(gear, { dagger: -1, mace: -1, wand: -1, xbow: -1, sickle: -1 });
Object.assign(SKF, { dagger: "Attack", mace: "Attack", wand: "Magic", xbow: "Ranged", sickle: "Farming" });
AM.xbow = "Arrows";
SHP.wpn.g.push("dagger", "mace", "wand", "xbow");
SHP.arm.g.push("dagger");
SHP.farm.g.push("sickle");
SHP.gen.g.push("sickle");
/* ==========================================================================
 * 21. GEAR SPRITES
 * Pixel art definitions for armour and equipment icons.
 * ========================================================================== */
const GS = {
  axe: [
    "....ooo...",
    "...o221oo.",
    "...o2111o.",
    "..oo111oo.",
    "..o3oooo..",
    ".o33o.....",
    ".o33o.....",
    "o33o......",
    "o43o......",
    "oo........",
  ],
  pick: [
    "..oooooo..",
    ".o221112o.",
    "o11oo3oo1o",
    "oo.o33o.oo",
    "...o33o...",
    "...o33o...",
    "...o33o...",
    "...o43o...",
    "...o43o...",
    "....oo....",
  ],
  rod: [
    "......ooo.",
    ".....o33oo",
    "....o33o.w",
    "...o33o..w",
    "..o33o...w",
    ".o43o....w",
    "o43o.....w",
    "oo.....owo",
    ".......ooo",
  ],
  sword: [
    ".......ooo",
    "......o21o",
    ".....o21o.",
    "....o21o..",
    "...o21o...",
    ".ooo1o....",
    "..o33o....",
    ".o43o.....",
    "o44o......",
    ".oo.......",
  ],
  spear: [
    "........oo",
    ".......o2o",
    "......o12o",
    ".....o33o.",
    "....o33o..",
    "...o33o...",
    "..o33o....",
    ".o43o.....",
    "o43o......",
    "oo........",
  ],
  bow: [
    "..ooo.....",
    "..ow1oo...",
    "..ow.o1o..",
    "..ow..o1o.",
    "..ow..o1o.",
    "..ow..o1o.",
    "..ow.o1o..",
    "..owo1oo..",
    "..ooo.....",
  ],
  staff: [
    ".....ooo..",
    "....opppo.",
    "....opwpo.",
    ".....o3o..",
    "....o3o...",
    "...o3o....",
    "..o3o.....",
    ".o43o.....",
    "o43o......",
    "oo........",
  ],
  wand: [
    ".......y..",
    "......yyy.",
    ".....o3o..",
    "....o3o...",
    "...o3o....",
    "..o3o.....",
    ".o43o.....",
    "o43o......",
    "oo........",
  ],
  xbow: [
    ".......oo.",
    "......o11o",
    ".....wo1o.",
    "ooooowo1o.",
    "o33333w1o.",
    "ooooowo1o.",
    ".....wo1o.",
    "......o11o",
    ".......oo.",
  ],
  dagger: [
    "........oo",
    ".......o2o",
    "......o21o",
    ".....o21o.",
    "...ooo1o..",
    "....o33o..",
    "...o43o...",
    "...ooo....",
  ],
  mace: [
    "...oooo...",
    "..o2221o..",
    "..o2111o..",
    "..o1111o..",
    "...oooo...",
    "....o3o...",
    "....o3o...",
    "....o3o...",
    "....o43o..",
    ".....oo...",
  ],
  sickle: [
    "..oooooo..",
    ".o222211o.",
    "o22oo.o11o",
    "oo.o...o1o",
    "..o3o.....",
    "..o3o.....",
    "..o3o.....",
    ".o43o.....",
    "..oo......",
  ],
  helm: ["..oooooo..", ".o222111o.", "o22211111o", "o11111111o", "o1o4444o1o", "o1o....o1o", "ooo....ooo"],
  cowl: ["..oooooo..", ".o111111o.", "o11oooo11o", "o1o....o1o", "o1o....o1o", "o11o..o11o", ".o111111o.", "..oooooo.."],
  vamb: ["oooo..oooo", "o11o..o11o", "oyyo..oyyo", "o11o..o11o", "o11o..o11o", "oyyo..oyyo", "oooo..oooo"],
  hat: ["......oo..", ".....o1o..", "....o11o..", "...o1y1o..", "...o111o..", "..o11111o.", "oyyyyyyyyo", "oooooooooo"],
  mboots: ["..oo..oo..", ".o1o.o1o..", ".o1o.o1o..", ".oyo.oyo..", "o11oo11o..", "o111o111o.", "ooooooooo."],
  robe: ["..oooooo..", ".o1y11y1o.", "o11y22y11o", ".o1y11y1o.", ".o1y11y1o.", "o11y11y11o", "o11y11y11o", "oooooooooo"],
  leather: [".oo....oo.", "o11oooo11o", "o21111112o", ".o111111o.", ".o211111o.", "..o3333o..", "...o33o...", "...o43o..."],
  body: [
    ".oo....oo.",
    "o11oooo11o",
    "o21111112o",
    ".o111111o.",
    ".o211111o.",
    ".o111111o.",
    ".o333333o.",
    "..oooooo..",
  ],
  shield: [
    ".oooooooo.",
    "o22222111o",
    "o21y1y111o".replace("y1y", "y11"),
    "o21yyyy11o",
    "o21y11111o".replace("y1", "y1"),
    ".o111111o.",
    "..o1111o..",
    "...o11o...",
    "....oo....",
  ],
};
/* ==========================================================================
 * 22. SPRITE COLOUR HELPERS
 * lit() brightens a colour, gic() renders a cached gear icon.
 * ========================================================================== */
const lit = (c) => {
    const n = parseInt(c.slice(1), 16);
    return (
      "#" +
      [16, 8, 0]
        .map((b) =>
          Math.min(255, ((n >> b) & 255) + 70)
            .toString(16)
            .padStart(2, "0"),
        )
        .join("")
    );
  },
  GC = {};
function gic(k, t) {
  const key = k + t;
  if (GC[key]) return GC[key];
  const tc = (ARMOR_PAL[k] && ARMOR_PAL[k][Math.max(0, t)]) || TC[t < 0 ? 1 : t],
    pal = [tc, lit(tc), "#8b5a2b", "#5a3a1a"],
    r = GS[k],
    c = document.createElement("canvas");
  c.width = 10;
  c.height = 10;
  const x = c.getContext("2d"),
    oy = Math.floor((10 - r.length) / 2);
  r.forEach((row, j) =>
    [...row].forEach((ch, i) => {
      if (ch == ".") return;
      x.fillStyle =
        ch == "o"
          ? "#2b1d14"
          : ch == "w"
            ? "#fff"
            : ch == "p"
              ? "#c07bff"
              : ch == "y"
                ? "#ffe97a"
                : pal[+ch - 1];
      x.fillRect(i, oy + j, 1, 1);
    }),
  );
  return (GC[key] = '<img class="ic" src="' + c.toDataURL() + '">');
}
Object.keys(GS).forEach((k) => (GI[k] = gic(k, 1)));
/* ==========================================================================
 * 23. MAGIC WEAPON CHECK
 * True for staff/wand, which consume mana instead of ammo.
 * ========================================================================== */
const MAGW = (w) => w == "staff" || w == "wand";
