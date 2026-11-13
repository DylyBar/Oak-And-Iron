/* Oak & Iron - Canvas input, render helpers, minimap, tiles, shadows (sections 38-42). Loaded in order by index.html. */

/* ==========================================================================
 * 38. CANVAS INPUT
 * Mouse/touch handling: tile picking, clicks, hover and the hotbar.
 * ========================================================================== */
const tile = (e) => {
  const r = cv.getBoundingClientRect(),
    s = sc();
  return [
    Math.floor(((((e.clientX - r.left) / r.width) * cv.width) / s + camx) / T),
    Math.floor(((((e.clientY - r.top) / r.height) * cv.height) / s + camy) / T),
  ];
};
cv.addEventListener("mousemove", (e) => {
  const [x, y] = tile(e);
  hov = { x, y };
  hotbarHover(e);
});
cv.addEventListener("mousedown", (e) => {
  if (e.button || !started) return;
  const r = cv.getBoundingClientRect();
  const ux = ((e.clientX - r.left) / r.width) * LW,
    uy = ((e.clientY - r.top) / r.height) * LH;
  if (ux > LW - 182 && uy < 74) {
    $("ch_btn").click();
    return;
  }
  const hbi = hotbarSlotAtUnits(ux, uy);
  if (hbi >= 0) {
    hotbarClick(hbi, e.clientX, e.clientY);
    return;
  }
  const sbi = spellSlotAtUnits(ux, uy);
  if (sbi >= 0) {
    useSkill(sbi);
    return;
  }
  const [x, y] = tile(e);
  opts(x, y)[0].f();
});
cv.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  if (!started) return;
  if (hotbarContext(e.clientX, e.clientY)) return;
  const [x, y] = tile(e);
  showM(e.clientX, e.clientY, "Choose Option", opts(x, y));
});
$("map_btn").onclick = () => {
  showMap = !showMap;
  if (showMap) {
    $("side").classList.remove("open", "utility", "skills-view", "quests-view");
    $("skillsPanel").style.display = "none";
    $("questsPanel").style.display = "none";
  }
  $("mw").style.display = showMap ? "block" : "none";
};
/* ==========================================================================
 * 39. RENDER HELPERS & SCALING
 * fillRect shortcut, shared render clock, zoom and canvas resizing.
 * ========================================================================== */
const F = (c, x, y, w, h) => {
    g.fillStyle = c;
    g.fillRect(x, y, w, h);
  },
  O = "#181412";
let tm = 0,
  zoom = 1;
const sc = () => (cv.width / LW) * zoom;
function fitCanvas() {
  // Fill the whole browser window (minus the chat dock): on wide screens the view shows more of the
  // world sideways instead of leaving black bars. Tall/narrow windows keep the classic 4:3 view.
  const vv = window.visualViewport,
    vw = Math.max(320, Math.floor(vv ? vv.width : window.innerWidth)),
    vh = Math.max(240, Math.floor(vv ? vv.height : window.innerHeight)),
    chatH = vh <= 520 ? 44 : Math.min(72, Math.max(48, Math.round(vh * 0.08))),
    aw = Math.max(1, vw - 8),
    ah = Math.max(1, vh - chatH - 12),
    aspect = aw / ah;
  LH = 576;
  LW = aspect >= 4 / 3 ? Math.min(Math.round(LH * aspect), LH * 3) : 768;
  const w = Math.max(1, Math.floor(Math.min(aw, (ah * LW) / LH))),
    h = Math.floor((w * LH) / LW);
  cv.style.width = w + "px";
  cv.style.height = h + "px";
  $("left").style.width = w + 8 + "px";
  cv.width = Math.max(LW, Math.min(LW * 3, Math.round(w * (devicePixelRatio || 1))));
  cv.height = Math.round((cv.width * LH) / LW);
  g.imageSmoothingEnabled = false;
}
/* ==========================================================================
 * 40. MINIMAP IMAGE
 * Pre-renders the world into the small minimap canvas.
 * ========================================================================== */
const mmc = $("mm").getContext("2d"),
  im = mmc.createImageData(684, 456),
  MC = [
    "#7cb342",
    "#1a3c5e",
    "#e8d29a",
    "#9a958a",
    "#c9a66b",
    "#a8793f",
    "#e3c79a",
    "#b5533c",
    "#7a4a24",
    "#b98a55",
    "#574b41",
    "#554437",
  ];
for (let my = 0; my < 456; my++)
  for (let mx = 0; mx < 684; mx++) {
    const wx = Math.min(W - 1, Math.floor((mx / 684) * W)),
      wy = Math.min(H - 1, Math.floor((my / 456) * H)),
      c = parseInt(MC[TY[wy * W + wx]].slice(1), 16);
    im.data.set([c >> 16, (c >> 8) & 255, c & 255, 255], (my * 684 + mx) * 4);
  }
mmc.putImageData(im, 0, 0);
mmc.scale(3, 3);
mmc.imageSmoothingEnabled = false;
const enemyPixels = {
  slime: ["..ooooo..", ".ogggggo.", "ogggggggo", "oggygyggo", "ogggggggo", ".ogggggo.", "..ooooo..", "........."],
  goblin: ["..ooo..", ".oggg.o", "ogggggo", "ogogogo", ".oggg.o", "..o.o..", "...o..."],
  chicken: ["...ww...", "..wwwy..", ".wwwwyo.", "wwwwwwwo", ".wwwwwo.", "..o..o..", "........."],
  cow: ["..oooo..", ".owwwwo.", "owwbbwwo", "owwwwwwo", ".owwwwo.", ".o.o.o..", "........."],
  sheep: ["..oooo..", ".owwwwo.", "owwwwwwo", "owwwwwwo", ".owwwo..", ".o..o...", "........."],
  rat: ["..ooo..", ".oggg..", "ogggggo", "ogggggo", ".ogog.o", "..o.o..", "......."],
  crab: [".......", ".o...o.", "..rrr..", ".orrr.o", "orrrrro", ".o.o.o.", "......."],
  wolf: ["..ooo..", ".owwwo.", "owwwwwo", "owwwwwo", ".owwwo.", "..o.o..", "......."],
  skeleton: ["..ooo..", ".owwwo.", "owwwwww", "..www..", "..www..", ".o...o.", "......."],
  scorpion: ["...p...", "..ppp..", ".ppppp.", "..p.p..", ".p..p.p", "p.....p", "......."],
  wisp: ["...ccc...", "..ccccc..", ".ccwwwcc.", "ccwwwwwcc", "ccwwwwwcc", ".ccwwwcc.", "..ccccc..", "...ccc...", "........."],
  emberMage: ["...rrr...", "..rRRRr..", ".rRRRRRr.", "rRrRRRrRr", ".rrrrrrr.", "..rRRRr..", "..rRrRr..", ".rr...rr.", "........."],
  frostMage: ["...bbb...", "..bBBBb..", ".bBBBBBb.", "bBbBBBbBb", ".bbbbbbb.", "..bBBBb..", "..bBbBb..", ".bb...bb.", "........."],
  basaltGolem: ["...ooo...", "..oggggo..", ".oggggggo.", "oggggggggo", "oggooggggo", ".oggggggo.", "..o...o..", "...o.o...", "........."],
  stormDrake: ["b..b...b..", "bb.bbb.bb.", ".bbbbbbb..", "..bgggb...", ".bgggggb..", "b..b.b..b.", "...b.b....", "..b...b...", ".........."],
  voidKnight: ["...ppp...", "..pPPPp..", ".pPPPPPp.", "..pPpPp..", "...ppp...", "..ppppp..", ".pp...pp.", ".p.....p.", ".........."],
};
const enemyColors = {
  slime: { g: "#65db73", o: "#204d28", y: "#efff9a" },
  goblin: { g: "#8ac653", o: "#26461e" },
  chicken: { w: "#eee5d3", y: "#df9a43", o: "#7a5030" },
  cow: { w: "#eee5d3", b: "#76583f", o: "#493524" },
  sheep: { w: "#e5e3d8", o: "#77766c" },
  rat: { g: "#aaa", o: "#393939" },
  crab: { r: "#e87850", o: "#4b2218" },
  wolf: { w: "#b88a55", o: "#392c20" },
  skeleton: { w: "#ddd", o: "#424242" },
  scorpion: { p: "#be72dc", o: "#40254d" },
  wisp: { c: "#48cfbd", w: "#d8fff4" },
  emberMage: { r: "#b73a27", R: "#ff7138" },
  frostMage: { b: "#5288be", B: "#b5f3ff" },
  basaltGolem: { g: "#77736e", o: "#302d2a" },
  stormDrake: { b: "#4b889b", g: "#e5d97c" },
  voidKnight: { p: "#604775", P: "#d8a8ff" },
};
const drawEnemyMapIcon = (type, x, y) => {
  const sprite = enemyPixels[type],
    colors = enemyColors[type],
    pixel = 2,
    left = x - (sprite[0].length * pixel) / 2,
    top = y - (sprite.length * pixel) / 2;
  for (let row = 0; row < sprite.length; row++)
    for (let col = 0; col < sprite[row].length; col++) {
      const color = colors[sprite[row][col]];
      if (color) {
        mmc.fillStyle = color;
        mmc.fillRect(left + col * pixel, top + row * pixel, pixel, pixel);
      }
    }
};
const enemyMapGroups = new Map(),
  enemyMarkers = $("enemyMarkers");
ens.forEach((enemy) => {
  const px = Math.min(227, Math.floor(((enemy.hx ?? enemy.x) / W) * 228)),
    py = Math.min(151, Math.floor(((enemy.hy ?? enemy.y) / H) * 152)),
    sectorX = Math.floor(px / 120),
    sectorY = Math.floor(py / 96),
    key = enemy.t + ":" + sectorX + ":" + sectorY,
    group = enemyMapGroups.get(key);
  if (group) {
    group.count++;
    group.x += px;
    group.y += py;
  } else enemyMapGroups.set(key, { type: enemy.t, x: px, y: py, count: 1 });
});
const placedEnemyMarkers = [];
enemyMapGroups.forEach((group) => {
  let x = Math.round(group.x / group.count),
    y = Math.round(group.y / group.count);
  for (
    let attempt = 0;
    placedEnemyMarkers.some((p) => Math.abs(p.x - x) < 11 && Math.abs(p.y - y) < 11);
    attempt++
  ) {
    const angle = attempt * 2.4,
      distance = 9 + Math.floor(attempt / 4) * 5;
    x = Math.max(8, Math.min(220, Math.round(group.x / group.count + Math.cos(angle) * distance)));
    y = Math.max(8, Math.min(144, Math.round(group.y / group.count + Math.sin(angle) * distance)));
  }
  placedEnemyMarkers.push({ x, y });
  drawEnemyMapIcon(group.type, x, y);
  const info = ET[group.type],
    marker = document.createElement("button"),
    description = `${info.n} · Level ${info.lv}${info.magic ? " · Magic" : ""}`;
  marker.type = "button";
  marker.className = "enemy-map-hit";
  marker.style.left = x - 10 + "px";
  marker.style.top = y - 10 + "px";
  marker.title = description;
  marker.setAttribute("aria-label", description);
  enemyMarkers.appendChild(marker);
});
/* ==========================================================================
 * 41. TILE RENDERING
 * Draws one terrain tile, including animated water and shore blending.
 * ========================================================================== */
function dt(x, y) {
  if (inMine && !inCaveBounds(x, y)) {
    const X = x * T,
      Y = y * T,
      h = hs(x * 3.1, y * 4.7);
    F("#252323", X, Y, T, T);
    F(h > 0.5 ? "#35302c" : "#302b28", X + ((h * 17) | 0), Y + ((h * 13) | 0), 6, 4);
    return;
  }
  const X = x * T,
    Y = y * T,
    h = hs(x, y),
    k = TY[y * W + x],
    up = TY[(y - 1) * W + x],
    dn = TY[(y + 1) * W + x],
    lf = TY[y * W + x - 1],
    rt = TY[y * W + x + 1];
  if (k == 1) {
    F("#1a3c5e", X, Y, T, T);
    const wv = Math.sin(x * 1.5 + y * 2 + tm / 400);
    if (wv > 0.5) F("#26517a", X + 3, Y + 5, 12, 2);
    if (wv < -0.5) F("#122a44", X + 6, Y + 14, 10, 2);
    if (up != 1) F("#d6efff", X, Y, T, 2);
    if (lf != 1) F("#0f2338", X, Y, 2, T);
    if (CFG.gfx) {
      g.globalAlpha = 0.3 + 0.3 * Math.sin(tm / 450 + x * 0.7 + y);
      if (dn == 2) F("#fff", X, Y + T - 3, T, 3);
      if (up == 2) F("#fff", X, Y, T, 3);
      if (lf == 2) F("#fff", X, Y, 3, T);
      if (rt == 2) F("#fff", X + T - 3, Y, 3, T);
      g.globalAlpha = 1;
      if (wv > 0.92) F("#cfeaff", X + 8, Y + 9, 3, 1);
    }
    return;
  }
  if (k == 2) {
    F("#e8d29a", X, Y, T, T);
    if (h < 0.4) F("#d4bb7e", X + (((h * 50) | 0) % 18), Y + (((h * 90) | 0) % 18), 2, 2);
    if (CFG.gfx) {
      const grain = hs(x * 3 + 7, y * 5 + 2);
      F(grain > .5 ? "#f4dfad" : "#cdb77e", X + 3 + ((grain * 17) | 0), Y + 4 + ((hs(x + 9, y + 4) * 16) | 0), 3, 1);
      if (hs(x + 31, y + 11) > .78) F("#bda36d", X + 16, Y + 18, 2, 2);
    }
    return;
  }
  if (k == 3) {
    F(h < 0.5 ? "#9c978c" : "#938e83", X, Y, T, T);
    F("#85807a", X + (((h * 40) | 0) % 16), Y + (((h * 77) | 0) % 16), 5, 3);
    if (CFG.gfx) {
      F("#b7b1a4", X + 2, Y + 3, 7, 2);
      F("#77736c", X + 12 + ((h * 5) | 0), Y + 15, 8, 3);
      F("rgba(255,255,255,.12)", X, Y, T, 2);
    }
    return;
  }
  if (k == 4) {
    F("#c9a66b", X, Y, T, T);
    F("#b4905a", X + (((h * 60) | 0) % 18), Y + (((h * 99) | 0) % 18), 3, 2);
    if (CFG.gfx) {
      F("rgba(255,235,190,.2)", X + 1, Y + 1, T - 2, 2);
      F("#a98250", X + 4, Y + 18, 5, 2);
      F("#dfc18a", X + 15, Y + 7, 4, 2);
    }
    return;
  }
  if (k == 5) {
    F("#a8793f", X, Y, T, T);
    F("#7d5528", X, Y + 7, T, 1);
    F("#7d5528", X, Y + 15, T, 1);
    if (CFG.gfx) {
      F("#c09253", X + 2, Y + 2, 8, 2);
      F("#d0a568", X + 13, Y + 9, 7, 2);
      F("#68451f", X + 5, Y + 20, 4, 1);
    }
    return;
  }
  if (k == 7) {
    const style = RC[y * W + x],
      accent = ["#f1c96a", "#9fd2ea", "#d4df8a", "#f3b3d2", "#f5df9a", "#98ddd0", "#deb394", "#b8c5ed"][style];
    F(RCOL[style], X, Y, T, T);
    if (style % 4 == 0) {
      F("rgba(0,0,0,.18)", X, Y + 6, T, 2);
      F(accent, X + 3, Y + 12, 4, 2);
      F(accent, X + 15, Y + 12, 4, 2);
    } else if (style % 4 == 1) {
      F("rgba(0,0,0,.2)", X + 5, Y, 2, T);
      F(accent, X + 11, Y + 4, 3, 3);
      F("rgba(0,0,0,.2)", X + 17, Y, 2, T);
    } else if (style % 4 == 2) {
      F("rgba(0,0,0,.18)", X, Y + 14, T, 2);
      F(accent, X + 4, Y + 5, 2, 4);
      F(accent, X + 18, Y + 5, 2, 4);
    } else {
      F("rgba(0,0,0,.2)", X, Y + 6, T, 2);
      F("rgba(0,0,0,.2)", X, Y + 16, T, 2);
      F(accent, X + 9, Y + 10, 6, 2);
    }
    if (up != 7) F(O, X, Y, T, 2);
    if (dn != 7) F(O, X, Y + T - 2, T, 2);
    if (lf != 7) F(O, X, Y, 2, T);
    if (rt != 7) F(O, X + T - 2, Y, 2, T);
    return;
  }
  if (k == 6) {
    const style = RC[y * W + x];
    F(["#e3c79a", "#d8c6a2", "#cdb997", "#e7d4b7", "#dfc99b", "#c8c0a3", "#d8b89a", "#c7c9d1"][style], X, Y, T, T);
    F(["#c9a97a", "#bba986", "#ad9873", "#ccb79a", "#c2a978", "#a9a58b", "#b7997d", "#a3a8b8"][style], X, Y + 11, T, 1);
    return;
  }
  if (k == 11) {
    const style = RC[y * W + x],
      frame = ["#7a4a24", "#67462f", "#59422c", "#744c38", "#70502e", "#425750", "#684331", "#4b536b"][style],
      glass = ["#8cc6df", "#a9d8e8", "#b2d8e3", "#9fc9dd", "#b8d7dc", "#92cec6", "#b8d1d9", "#aabde0"][style];
    F(["#e3c79a", "#d8c6a2", "#cdb997", "#e7d4b7", "#dfc99b", "#c8c0a3", "#d8b89a", "#c7c9d1"][style], X, Y, T, T);
    F(frame, X + 4, Y + 4, 16, 16);
    F(glass, X + 6, Y + 6, 12, 12);
    F("#f7e5b7", X + 11, Y + 6, 2, 12);
    F("#f7e5b7", X + 6, Y + 11, 12, 2);
    return;
  }
  if (k == 8) {
    const style = RC[y * W + x],
      wood = ["#7a4a24", "#63452e", "#63452e", "#744331", "#72502f", "#41645c", "#69412c", "#48566f"][style];
    F(["#e3c79a", "#d8c6a2", "#cdb997", "#e7d4b7", "#dfc99b", "#c8c0a3", "#d8b89a", "#c7c9d1"][style], X, Y, T, T);
    if (Math.abs(P.x - x) + Math.abs(P.y - y) < 3) {
      F(O, X + 3, Y + 2, 18, 22);
      F(wood, X + 2, Y + 4, 4, 20);
    } else {
      F(O, X + 3, Y + 2, 18, 22);
      F(wood, X + 5, Y + 4, 14, 20);
      F("#f2b632", X + 16, Y + 14, 2, 2);
    }
    return;
  }
  if (k == 9) {
    const floor = ["#b98a55", "#ab906a", "#a18862", "#c09a71", "#b09563", "#947d63", "#ac826b", "#8e927f"][RC[y * W + x]],
      seam = ["#9d7144", "#8f7657", "#806d4d", "#a27c5c", "#94794f", "#796b54", "#906c58", "#747967"][RC[y * W + x]];
    F(floor, X, Y, T, T);
    F(seam, X, Y + 7, T, 1);
    F(seam, X, Y + 15, T, 1);
    return;
  }
  if (k == 10) {
    F("#51483f", X, Y, T, T);
    F("#62564a", X + (((h * 50) | 0) % 18), Y + (((h * 90) | 0) % 18), 4, 3);
    return;
  }
  F(h < 0.33 ? "#69a936" : h < 0.66 ? "#78b943" : "#8ac653", X, Y, T, T);
  F(hs(x + 17, y + 29) > 0.72 ? "#5b9b35" : "#9bd35d", X + 3 + ((h * 9) | 0), Y + 4 + ((h * 13) | 0), 2, 2);
  if (CFG.gfx) {
    const detail = hs(x * 7 + 13, y * 11 + 3);
    if (detail > .72) {
      F("#a6d76a", X + 4 + ((detail * 9) | 0), Y + 5 + ((h * 11) | 0), 2, 3);
      F("#477f2b", X + 7 + ((h * 8) | 0), Y + 15 + ((detail * 5) | 0), 2, 2);
    } else if (detail < .12) {
      F("#e7d58a", X + 12, Y + 8, 2, 2);
      F("#fff0b0", X + 13, Y + 8, 1, 1);
    }
    if (hs(x + 61, y + 29) > .94) F("rgba(255,255,255,.18)", X + 2, Y + 2, T - 4, 1);
  }
  if (h < 0.2) {
    F("#5e9b2e", X + 4, Y + 14, 1, 4);
    F("#5e9b2e", X + 7, Y + 12, 1, 5);
  }
  if (h > 0.96) {
    F("#ff6f91", X + 6, Y + 8, 3, 3);
    F("#fff", X + 7, Y + 9, 1, 1);
  } else if (h > 0.93) F("#ffd54f", X + 14, Y + 12, 3, 3);
}
/* ==========================================================================
 * 42. SHADOWS
 * Shared soft shadow ellipse used by characters and objects.
 * ========================================================================== */
function sh_(x, y, r) {
  g.fillStyle = "rgba(0,0,0,.25)";
  g.beginPath();
  g.ellipse(x, y, r, r / 2.4, 0, 0, 6.3);
  g.fill();
}
