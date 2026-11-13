/* Oak & Iron - Custom pixel art for every item and UI icon (10x10 grids, shown at 2x).
 * Digits 1-5 pick palette colours, o = outline, w = white, . = empty.
 * Entries: [name, shape, palette, patches "x,y,char ..."]. Loaded after sprites, so it overrides them. */
const ART_SH = {
  ORE: ["...oooo...", "..o2222oo.", ".o2222111o", "o22221111o", "o11111133o", ".o333333o.", "..oooooo.."],
  BAR: ["..oooooo..", ".o222221o.", "o11111111o", "o13333331o", ".oooooooo."],
  DRUM: ["...oooo...", "..o2222o..", ".o222222o.", ".o222222o.", "..o2222o..", "...o11o...", "....o1o...", ".o11o.o11o", ".oooo.oooo"],
  STEAK: ["..oooooo..", ".o22222oo.", "o22242222o", "o22222422o", "o32222222o", ".o3333333o", "..oooooo.."],
  CHOP: ["...oooo...", "..o2222o..", ".o222222o.", ".o242242o.", "..o2222o..", "..oo11oo..", "..o1111o..", "..oooooo.."],
  FEATHER: ["......ooo.", ".....o22o.", "....o221o.", "...o2211o.", "..o22 11o.", ".o2211oo..", "o3211o....", "o3oo......"],
  WOOL: ["..oo.oo...", ".o22o22oo.", "o22222222o", "o22w22222o", "o22222322o", ".o333333o.", "..oooooo.."],
  HIDE: ["oo.oooo.oo", "o11oooo11o", "o11122111o", "o11411211o", "o12111141o", ".o111111o.", "o11o11o11o", ".oo.oo.oo."],
  LEATHER: [".oooooooo.", "o22222221o", "o21111111o", "o21114111o", "o21111111o", "o11333333o", ".oooooooo."],
  STRING: ["..oooooo..", ".o222222o.", "o22oooo22o", "o2o....o2o", "o22oooo22o", ".o222222oo", "..oooooo.w"],
  ARMOR: [".oo....oo.", "o11oooo11o", "o21111112o", ".o111111o.", ".o211111o.", "..o3333o..", "...o33o...", "...o43o..."],
  NEST: ["..oooooo..", ".o334433o.", "o33433433o", "o33222233o", ".o333333o.", "..oooooo.."],
  GEM: ["..oooooo..", ".o22w111o.", "o22221111o", "o11111133o", ".o111133o.", "..o1133o..", "...o33o...", "....oo...."],
  ROUND: ["...oooo...", "..o22w1o..", ".o222111o.", ".o2111133o", "..o1133o..", "...oooo..."],
  POTION: ["...oooo...", "...o33o...", "...o44o...", "..oo44oo..", ".o444444o.", ".o222222o.", ".o11w111o.", ".o111111o.", "..o1111o..", "...oooo..."],
  BOOT: ["..oooo....", "..o22o....", "..o11o....", "..o11o....", ".oo111ooo.", "o11111111o", "o33333333o", ".oooooooo."],
  LOG1: [".oooooooo.", "o22222oo4o", "o11111o44o", "o11111o4oo", "o33333o44o", ".oooooooo."],
  LOG2: ["..oooooooo", ".o2222o4 4o", "o11111o44o", "oooooooooo", "o2222o4 4o", "o11111o44o", ".oooooooo."],
  LOG3: ["o.o..o..o.", "o2o.o2o.o2", "o1o.o1o.o1", "o1oo.1oo1o", ".o3o4o3o3o", "..ooooooo."],
  LOG4: [".oooooooo.", "o33333o4 4o", "o22522o44o", "o33333o44o", "o33333o4oo", ".oooooooo."],
  gear: ["..o.oo.o..", ".o22oo22o.", "..o2222o..", "oo22oo22oo", "oo22oo22oo", "..o2222o..", ".o22oo22o.", "..o.oo.o.."],
  person: ["...oooo...", "..o2222o..", "..o2222o..", "...oooo...", "..oo11oo..", ".o111111o.", ".o11oo11o.", "..oo..oo.."],
  run: ["...oo.....", "w..o22o...", "ww.o11o...", "w..o11ooo.", "...o11111o", "..o333333o"],
  tap: ["...oo.....", "..o22o....", "..o22o....", "..o22oooo.", ".oo222222o", "o222222 22o", "o22222222o", ".o222222o.", "..oooooo.."],
  menu: ["..oooooo..", ".o222222o.", ".o233332o.", ".o222222o.", ".o233332o.", ".o222222o.", ".o233332o.", ".oooooooo."],
  map: ["oooooooooo", "o22211133o", "o22211143o", "o22211133o", "o22211133o", "oooooooooo"],
  pack: ["..oooooo..", ".o222222o.", "o22222222o", "o21111112o", "o21oooo12o", "o21o33o12o", "o11111111o", ".oooooooo."],
  swords: ["oo......oo", "o2o....o2o", ".o2o..o2o.", "..o2oo2o..", "...o22o...", "..o3oo3o..", ".o3o..o3o.", "oo......oo"],
  note: ["...ooooo..", "...o222o..", "...o2ooo..", "...o2o....", "...o2o....", ".ooo2o....", "o2222o....", ".oooo....."],
  speaker: ["....o.....", "...oo..o..", "ooo2o...o.", "o222o.o.o.", "o222o.o.o.", "ooo2o...o.", "...oo..o..", "....o....."],
  crate: [".oooooooo.", "o22222222o", "o23333332o", "oooo44oooo", "o11114111o", "o11111111o", ".oooooooo."],
  grave: ["..oooooo..", ".o222222o.", "o222oo222o", "o2oooooo2o", "o222oo222o", "o222oo222o", "o11111111o", "oooooooooo"],
};
const ORE_V = {
  "Copper ore": "3,2,4 4,3,4 7,3,4 5,4,4 2,4,4 6,2,4",
  "Tin ore": "2,3,4 3,3,4 6,4,4 7,4,4 5,2,4 8,3,4",
  "Iron ore": "3,2,4 4,3,4 5,3,4 6,4,4 2,4,4 7,2,4",
  "Silver ore": "3,3,4 4,3,4 4,2,4 7,4,4 6,3,4 3,4,w",
  "Gold ore": "3,2,4 4,2,4 3,3,4 4,3,4 7,4,4 8,4,4 6,2,w",
  Coal: "3,3,4 4,2,4 6,3,4 7,4,4 3,4,4",
  "Mithril ore": "3,2,4 3,3,4 4,3,4 7,3,4 7,4,4 6,4,w",
  "Adamantite ore": "4,2,4 3,3,4 4,3,4 5,3,4 6,4,4 7,3,w",
  "Runite ore": "3,2,4 4,2,4 7,3,4 6,3,4 6,4,4 3,4,w",
  Clay: "3,3,2 4,3,2 6,4,2",
  Ore: "3,2,4 6,3,4 5,4,4",
};
const ORE_P = {
  "Copper ore": ["#8c8c8c", "#b0b0b0", "#5e5e5e", "#e0833a"],
  "Tin ore": ["#8c8c8c", "#b0b0b0", "#5e5e5e", "#d4d8dc"],
  "Iron ore": ["#7d7d7d", "#a0a0a0", "#555555", "#b0523a"],
  "Silver ore": ["#aab2bd", "#dce3eb", "#68717e", "#f7f7f7"],
  "Gold ore": ["#9a7430", "#e0b84c", "#594018", "#fff1a1"],
  Coal: ["#3a3a3a", "#555555", "#1e1e1e", "#777777"],
  "Mithril ore": ["#7e8aa0", "#a0acc0", "#505c70", "#6a9aff"],
  "Adamantite ore": ["#476a50", "#74a37b", "#294332", "#b3e1a4"],
  "Runite ore": ["#70454c", "#a86a73", "#3f2930", "#f0a3b0"],
  Clay: ["#79594a", "#b38a72", "#49372f", "#dfb69a"],
  Ore: ["#8a8a8a", "#aaaaaa", "#5e5e5e", "#e8c84a"],
};
const BAR_P = {
  "Bronze bar": ["#b0703a", "#d9985a", "#7a4a22", "3,1,w"],
  "Iron bar": ["#8a8f96", "#b8bec6", "#5a5f66", "2,2,3 7,2,3"],
  "Steel bar": ["#a9b4c2", "#d6e0ec", "#6c7888", "3,1,w 4,2,w 5,3,w"],
  "Silver bar": ["#cfd6de", "#f4f7fa", "#8a94a2", "3,1,w 7,3,w"],
  "Gold bar": ["#e0b030", "#fff0a0", "#a07818", "3,1,w 4,1,w 7,3,w"],
  "Mithril bar": ["#5a7ad8", "#9ab8ff", "#34479a", "4,2,w 5,2,w 4,3,w"],
  "Adamantite bar": ["#4a9a5a", "#8ad49a", "#27593a", "3,2,3 5,2,3 7,2,3"],
  "Runite bar": ["#b0505e", "#f0909c", "#6a2a36", "4,2,w 5,2,w 5,3,w"],
};
const MEAT = {
  Raw: [["#f3b6a8", "#c8786a", "#fff2e0"], ["#c9444f", "#8c2a34", "#f4d0c8"], ["#e08a80", "#a85a50", "#fff0e8"]],
  Cooked: [["#c98a3a", "#8a5a1e", "#ffe0a0"], ["#8a4a2a", "#5a2e18", "#d8a070"], ["#a8683a", "#6a3e1e", "#ffe0a0"]],
  Burnt: [["#2a2a2a", "#111111", "#555555"], ["#2a2a2a", "#111111", "#555555"], ["#2a2a2a", "#111111", "#555555"]],
};
const ART = [];
Object.keys(ORE_P).forEach((n) => ART.push([n, "ORE", ORE_P[n], ORE_V[n]]));
Object.keys(BAR_P).forEach((n) => ART.push([n, "BAR", BAR_P[n].slice(0, 3), BAR_P[n][3]]));
["Raw", "Cooked", "Burnt"].forEach((s) =>
  ["chicken|DRUM", "beef|STEAK", "mutton|CHOP"].forEach((m, i) => {
    const [nm, sh] = m.split("|"), c = MEAT[s][i];
    ART.push([s + " " + nm, sh, s == "Burnt" ? ["#2a2a2a", "#111111", "#555555", "#555555"] : [c[0], c[1], c[0], c[2]], ""]);
  }),
);
ART.push(
  ["Logs", "LOG1", ["#b98a55", "#d4a870", "#8a6234", "#f0d9a8"], ""],
  ["Oak logs", "LOG2", ["#8a4f26", "#a86a3a", "#5a3016", "#d2a86a"], ""],
  ["Willow logs", "LOG3", ["#9aa65a", "#b8c478", "#6a7a3a", "#e4f0a8"], ""],
  ["Yew logs", "LOG4", ["#6b3a3a", "#8a5252", "#3d1f1f", "#e0a070", "#c0603a"], ""],
  ["Feathers", "FEATHER", ["#e8e8e8", "#ffffff", "#9aa0a8"], ""],
  ["Wool", "WOOL", ["#f4efe4", "#fffaf0", "#c9c0ae"], ""],
  ["Cowhide", "HIDE", ["#c8a070", "#e0c090", "#4a3020", "#4a3020"], ""],
  ["Leather", "LEATHER", ["#a8703a", "#c8905a", "#6e4624", "#3a2412"], ""],
  ["Bowstring", "STRING", ["#e8d8a8", "#c8b888", "#fff"], ""],
  ["Leather armor", "ARMOR", ["#a8703a", "#c8905a", "#6e4624", "#3a2412"], ""],
  ["Bird's nest", "NEST", ["#8a6a3a", "#a8c8d8", "#5a4020", "#c8a060"], ""],
  ["Amber", "ROUND", ["#e09a20", "#ffcf60", "#a8620a"], ""],
  ["Pearl", "ROUND", ["#e8e4f0", "#ffffff", "#a8a4b8"], ""],
  ["Uncut sapphire", "GEM", ["#3a6ad8", "#7aa8ff", "#243a8a"], ""],
  ["Uncut emerald", "GEM", ["#2aa84a", "#78e098", "#146a2a"], ""],
  ["Uncut ruby", "GEM", ["#d82a3a", "#ff7a88", "#8a1420"], ""],
  ["Uncut diamond", "GEM", ["#bfeaff", "#ffffff", "#6aaac8"], ""],
  ["Old boot", "BOOT", ["#7a5a3a", "#9a7a52", "#4a3420", "#2a1e12"], ""],
  ["Golden potato", "POT", ["#e0b030", "#fff0a0", "#a07818"], ""],
);
/* Potions: palette = [liquid, liquid highlight, cork, glass]. Cork colour shows the tier (brown / silver / gold). */
ART.push(
  ["Minor health potion", "POTION", ["#d83a4a", "#ff8a96", "#a8703a", "#cfe8f0"], ""],
  ["Health potion", "POTION", ["#c8243a", "#ff6a7a", "#b8bec6", "#cfe8f0"], ""],
  ["Greater health potion", "POTION", ["#9a1030", "#ff4a5a", "#e0b030", "#cfe8f0"], ""],
  ["Minor mana potion", "POTION", ["#3a6ad8", "#7aa8ff", "#a8703a", "#cfe8f0"], ""],
  ["Mana potion", "POTION", ["#2a4ac0", "#6a90ff", "#b8bec6", "#cfe8f0"], ""],
  ["Greater mana potion", "POTION", ["#5a2ad8", "#a07aff", "#e0b030", "#cfe8f0"], ""],
  ["Stamina potion", "POTION", ["#3aa84a", "#8ae098", "#a8703a", "#cfe8f0"], ""],
);
const UIC = {};
const uiPal = { gear: ["#9aa0a8", "#d0d4da"], person: ["#f5d0a9", "#4a7ad8"], run: ["#c05a2a", "#8a8f96", "#5a3a1a"], tap: ["#f5d0a9"], menu: ["#f4e8c8", "#8a6a3a"], map: ["#e8d8a8", "#7ab070", "#c0452f", "#7ab070"], pack: ["#b0703a", "#8a4f26", "#e0b030"], swords: ["#dfe6ee", "#8a5a2a"], note: ["#ffd54f"], speaker: ["#d0d4da"], crate: ["#b98a55", "#6a4a2a", "#e0b030", "#e0b030"], grave: ["#b8bcc4", "#6a8a4a"] };
function artCanvas(shape, pal, patches) {
  const rows = (ART_SH[shape] || SPR[shape]).map((r) => (r.replace(/ /g, "") + "..........").slice(0, 10).split(""));
  (patches || "").split(" ").filter(Boolean).forEach((p) => {
    const [x, y, c] = p.split(",");
    if (rows[+y]) rows[+y][+x] = c;
  });
  const c = document.createElement("canvas"),
    g = c.getContext("2d"),
    oy = Math.floor((10 - rows.length) / 2);
  c.width = c.height = 10;
  rows.forEach((row, j) =>
    row.forEach((ch, i) => {
      if (ch == ".") return;
      g.fillStyle = ch == "o" ? "#2b1d14" : ch == "w" ? "#fff" : pal[+ch - 1] || "#2b1d14";
      g.fillRect(i, oy + j, 1, 1);
    }),
  );
  return c;
}
const iconHtml = (c, cls) => '<img class="' + (cls || "ic") + '" src="' + c.toDataURL() + '">';
ART.forEach(([n, sh, pal, patch]) => {
  SC[n] = artCanvas(sh, pal, patch);
  IC[n] = iconHtml(SC[n]);
});
Object.keys(uiPal).forEach((k) => (UIC[k] = artCanvas(k, uiPal[k])));
SC.Crate = UIC.crate;
SC.Grave = UIC.grave;
/* 16x16 UI icons (settings, character, inventory, map...). Rows use letters from each icon's palette; o = dark outline, . = empty.
 * Edit here to restyle the menu icons. They are drawn at 2x in the quick menu. */
const UI16 = {
  gear: {
    rows: [".......oo.......", "...o..oaao..o...", "..oaoooaaooobo..", ".oaaaacaaaabbbo.", "..oaacaaaabbbo..", "..oacaaaabbbbo..", ".ooaaaoooobbdoo.", "oaaaaao..obddddo", "oaaaaao..odddddo", ".ooaaboooodddoo.", "..oabbbbdddddo..", "..obbbbddddddo..", ".obbbbddddddddo.", "..oboooddooodo..", "...o..oddo..o...", ".......oo......."],
    pal: {"a": "#e4e8ee", "b": "#9aa0a8", "c": "#ffffff", "d": "#6c737c"},
  },
  person: {
    rows: ["................", "....oooooooo....", "...oabbbbbbao...", "...oaaaaaaaao...", "...oaaccccaao...", "...oaaccccaao...", "....ococcoco....", "...ooccccccoo...", "..odddceecdddo..", ".oddddeeeeddddo.", ".odddddffdddddo.", "oddddddffddddddo", "oddddddddddddddo", "oddddddddddddddo", "odggggggggggggdo", ".oooooooooooooo."],
    pal: {"a": "#6a4a2a", "b": "#8a6a3a", "c": "#f5d0a9", "d": "#4a7ad8", "e": "#d9a67a", "f": "#f4e8c8", "g": "#2f55a8"},
  },
  run: {
    rows: ["................", ".....oooooo.....", "....oabbbcco....", "oooooabbbcco....", "ddddoobbbcco....", "oooo.obbbcco....", "oooo.obbbcco....", "ddddoobbbccoooo.", "oooo.obbbbbbbbbo", ".ooo.obebebebbbo", "odddoobbbbbbbbbo", ".ooo.occccccccco", ".....occccccccco", ".....offfffffffo", "......ooooooooo.", "................"],
    pal: {"a": "#fff0c8", "b": "#b0703a", "c": "#7a4a22", "d": "#dfe9f2", "e": "#ffffff", "f": "#3a2412"},
  },
  tap: {
    rows: ["..oaobo..oboao..", ".o.o.oooooo.o.o.", "oao..occcdo..oao", ".o...occcdo...o.", ".....occcdo.....", ".....occcdo.....", ".....occcdo.....", "...ooocccdoo....", "..occdccdcddo...", "..occcccccddo...", "..occcccccddo...", "..occcccccddo...", "..occcccccddo...", "...oddddddddo...", "....oooooooo....", "................"],
    pal: {"a": "#7fd8ff", "b": "#bff0ff", "c": "#f5d0a9", "d": "#d9a67a"},
  },
  menu: {
    rows: [".oooooooooooooo.", "oaaaaaaaaaaaaabo", "oaaaaaaaaaaaaabo", "oaaccadddddddabo", "oaaccadddddddabo", "oaaaaaaaaaaaaabo", "oaaaaaaaaaaaaabo", "oaaccadddddddabo", "oaaccadddddddabo", "oaaaaaaaaaaaaabo", "oaaaaaaaaaaaaabo", "oaaccadddddddabo", "oaaccadddddddabo", "oaaaaaaaaaaaaabo", "obbbbbbbbbbbbbbo", ".oooooooooooooo."],
    pal: {"a": "#f4e8c8", "b": "#d6c08a", "c": "#c0452f", "d": "#8a6a3a"},
  },
  map: {
    rows: ["................", "oooooooooooooooo", "aaaaabaaaabaaaaa", "accccbadaabcccaa", "aceecbadaabcccaa", "accccbadaabcccaa", "accccbadaabccaaa", "accccbadaabaaaaa", "accccbaaddbaaaaa", "aacccbaaddfaafaa", "aacccbaadabffaaa", "aaaaabaadabffaaa", "aaaaabaadafaafaa", "aaaaabaadabaaaaa", "oooooooooooooooo", "................"],
    pal: {"a": "#e8d8a8", "b": "#c8b078", "c": "#7ab070", "d": "#5a9ad8", "e": "#a5d89a", "f": "#c0452f"},
  },
  pack: {
    rows: [".....oaaaao.....", "....oaaaaaao....", "..oooaaaaaaooo..", ".obbbbbbbbbbbbo.", ".occcccccccccao.", "oacccccccccccaao", "oabbbbbbbbbbbbao", "oaaaaaadeaaaaaao", "oaaaaaaeeaaaaaao", "oaccccceeccccaao", "oaccbbbeebbbcaao", ".occbbbbbbbbcao.", ".occaaaaaaaacao.", ".oaaaaaaaaaaaao.", "..oooooooooooo..", "................"],
    pal: {"a": "#8a4f26", "b": "#d0925a", "c": "#b0703a", "d": "#fff0a0", "e": "#e0b030"},
  },
  swords: {
    rows: ["..o..........o..", ".oao........oao.", ".obco......ocbo.", "..obco....ocbo..", "...obco..ocbo...", "....obcoocbo....", ".....obccbo.....", "......ocbo......", ".....ocbbco.....", "..ooocbddbcooo..", ".oddcboddobcddo.", "..ocdoooooodco..", "..oooddooddooo..", ".oeo.oo..oo.oeo.", "..oeo......oeo..", "...oeo....oeo..."],
    pal: {"a": "#ffffff", "b": "#e4e8ee", "c": "#9aa0a8", "d": "#e0b030", "e": "#8a5a2a"},
  },
  note: {
    rows: ["................", ".....ooooooooo..", "....oaaaaaaaaao.", "....oaaaaaaaaao.", "....obbbbbbbbbo.", "....oaaoooooaao.", "....oaao...oaao.", "....oaao...oaao.", "....oaao...oaao.", "....oaao..ooaao.", "...ooaao.oaaaao.", "..oaaaaooacaaaao", ".oacaaaaoaaaaaao", ".oaaaaaaooaaaao.", "..oaaaao..oooo..", "...oooo........."],
    pal: {"a": "#ffd54f", "b": "#c9962a", "c": "#fff0a0"},
  },
  speaker: {
    rows: ["................", "........o.......", ".....oooao......", "....obbbao..o...", "..ooobbbao.oco..", ".obbbbbbaooco...", ".obdbbbbaoco....", ".obbbbbbaooco...", ".obbbbbbaooco...", ".obbbbbbaoco....", ".oaaabbbaooco...", "..ooobbbao.oco..", "....oaaaao..o...", ".....oooao......", "........o.......", "................"],
    pal: {"a": "#8a9098", "b": "#d0d4da", "c": "#ffd54f", "d": "#ffffff"},
  },
  crate: {
    rows: ["................", "................", ".oooooooooooooo.", "oaabbbbbbbbbbaao", "oacdaddddddadcao", "oaaddaddddaddaao", "oaadddaddadddaao", "oaaddddaaddddaao", "oaaaaaaaaaaaaaao", "oaaddddddddddaao", "oaaddddddddddaao", "oaaddddddddddaao", "oacddddddddddcao", "oaaaaaaaaaaaaaao", ".oooooooooooooo.", "................"],
    pal: {"a": "#6a4a2a", "b": "#d4a870", "c": "#e0b030", "d": "#b98a55"},
  },
  grave: {
    rows: [".......oo.......", ".....ooaaoo.....", "....obaaaaao....", "...obaaccaaao...", "..oaaaaccaaaao..", "..oaacccccccco..", "..oaacccccccco..", "..oaaaaccaacco..", "..oaaaaccaacco..", "..oaaaaccaacco..", "..oaaaaaaaacco..", "..oaaaaaaaacco..", "ooddaaaaaaaccdoo", "dddddddddddddddd", "dedddddddedddddd", "oooooooooooooooo"],
    pal: {"a": "#b8bcc4", "b": "#e8ecf2", "c": "#7e848e", "d": "#6a8a4a", "e": "#8ab25a"},
  },
  skills: {
    rows: [".....ooooo......", "....oaabbaoo....", "...oaoccccaao...", "..oaocooooocao..", "..oaco.....ocbo.", ".oaco.....odeao.", ".oao.....odeooao", "oao.....odeo..o.", ".o.....odeo.....", "......odeo......", ".....odeo.......", "....odeo........", "...odeo.........", "..odeo..........", ".odeo...........", "..oo............"],
    pal: {"a": "#d5d9de", "b": "#ffffff", "c": "#8a9098", "d": "#8a5a2a", "e": "#b0804a"},
  },
  quests: {
    rows: ["oabbbbbbbbbbbbao", "oaaaaaaaaaaaaaao", ".occcccccccccao.", ".occcccccccccao.", ".occddddddddcao.", ".occcccccccccao.", ".occddddddddcao.", ".occcccccccccao.", ".occdddddccccao.", ".occcccccccceao.", ".occcccccccecao.", ".occccccececcao.", ".occcccceeeccao.", ".occcccccccccao.", "oaaaaaaaaaaaaaao", "oaffffffffffffao"],
    pal: {"a": "#d6c08a", "b": "#e8d8a8", "c": "#f4e8c8", "d": "#8a6a3a", "e": "#3fa04d", "f": "#b89a60"},
  },
};
function art16(def) {
  const n = def.rows.length,
    c = document.createElement("canvas"),
    x = c.getContext("2d");
  c.width = c.height = n;
  def.rows.forEach((r, j) =>
    [...r].forEach((ch, i) => {
      if (ch == ".") return;
      x.fillStyle = ch == "o" ? "#2b1d14" : def.pal[ch];
      x.fillRect(i, j, 1, 1);
    }),
  );
  return c;
}
Object.keys(UI16).forEach((k) => (UIC[k] = art16(UI16[k])));
const UI = (k, cls) => iconHtml(UIC[k], cls || "uic");
/* Every "Raw X" item gets a charred "Burnt X" icon, and any item without art falls back to a
 * generated icon instead of rendering the text "undefined". */
function fallbackArt(n) {
  const c = document.createElement("canvas"),
    x = c.getContext("2d"),
    src = ["Raw", "Cooked"].map((p) => n.replace(/^Burnt/, p)).find((k) => /^Burnt /.test(n) && Object.hasOwn(SC, k));
  c.width = c.height = 10;
  if (src) {
    x.drawImage(SC[src], 0, 0);
    x.globalCompositeOperation = "source-atop";
    x.fillStyle = "#2a2a2a";
    x.fillRect(0, 0, 10, 10);
    x.fillStyle = "#4a4a4a";
    x.fillRect(0, 0, 10, 3);
  } else {
    x.fillStyle = "#2b1d14";
    x.fillRect(2, 3, 6, 6);
    x.fillRect(4, 1, 2, 2);
    x.fillStyle = "#b0703a";
    x.fillRect(3, 4, 4, 4);
    x.fillStyle = "#ffe97a";
    x.fillRect(4, 5, 2, 1);
  }
  return c;
}
Object.keys(SC)
  .filter((k) => /^Raw /.test(k) && !Object.hasOwn(SC, k.replace(/^Raw/, "Burnt")))
  .forEach((k) => {
    const n = k.replace(/^Raw/, "Burnt");
    SC[n] = fallbackArt(n);
    IC[n] = iconHtml(SC[n]);
  });
[SC, IC].forEach((store) =>
  Object.setPrototypeOf(
    store,
    new Proxy(Object.prototype, {
      get(t, k, r) {
        if (typeof k != "string" || k in Object.prototype) return Reflect.get(t, k, r);
        if (!Object.hasOwn(SC, k)) SC[k] = fallbackArt(k);
        if (!Object.hasOwn(IC, k)) IC[k] = iconHtml(SC[k]);
        return store[k];
      },
    }),
  ),
);
