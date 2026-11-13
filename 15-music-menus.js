/* Oak & Iron - Music sequencer, settings, title screen, character panel (sections 50-54). Loaded in order by index.html. */

/* ==========================================================================
 * 50. MUSIC SEQUENCER
 * Track data plus the note scheduler that plays background music.
 * ========================================================================== */
const TRK = [
  {
    n: "Oakhaven Dawn",
    bpm: 84,
    r: 57,
    sc: [0, 2, 4, 7, 9],
    ch: [
      [0, 4, 7],
      [5, 9, 12],
      [7, 11, 14],
      [0, 4, 7],
    ],
    w: "triangle",
    p: [0, 1, 2, 1, 0, 2, 1, 2],
  },
  {
    n: "Seaside Breeze",
    bpm: 96,
    r: 55,
    sc: [0, 2, 4, 5, 7, 9],
    ch: [
      [0, 4, 7],
      [9, 12, 16],
      [5, 9, 12],
      [7, 11, 14],
    ],
    w: "sine",
    p: [0, 2, 1, 2, 0, 1, 2, 1],
  },
  {
    n: "Goblin Hills",
    bpm: 108,
    r: 50,
    sc: [0, 2, 3, 5, 7, 8, 10],
    ch: [
      [0, 3, 7],
      [8, 12, 15],
      [5, 8, 12],
      [7, 10, 14],
    ],
    w: "square",
    p: [0, 2, 1, 2, 0, 2, 1, 2],
  },
  {
    n: "Night Vigil",
    bpm: 60,
    r: 52,
    sc: [0, 3, 5, 7, 10],
    ch: [
      [0, 7, 12],
      [3, 10, 15],
      [5, 12, 17],
      [0, 7, 12],
    ],
    w: "sine",
    p: [0, 1, 2, 1],
  },
];
let ms = 0,
  mnext = 0;
const mf = (m) => 440 * 2 ** ((m - 69) / 12);
function mnote(fr, t, d, ty, v) {
  const o = actx.createOscillator(),
    gn = actx.createGain();
  o.type = ty;
  o.frequency.value = fr;
  o.connect(gn);
  gn.connect(MU);
  gn.gain.setValueAtTime(0, t);
  gn.gain.linearRampToValueAtTime(v, t + 0.03);
  gn.gain.exponentialRampToValueAtTime(0.0001, t + d);
  o.start(t);
  o.stop(t + d + 0.05);
}
function mtick() {
  if (!actx || !MU || CFG.trk < 0) return;
  const K = TRK[CFG.trk],
    sd = 30 / K.bpm;
  if (mnext < actx.currentTime) mnext = actx.currentTime + 0.05;
  while (mnext < actx.currentTime + 0.5) {
    const c = K.ch[Math.floor(ms / 8) % K.ch.length],
      st = ms % 8;
    if (st == 0) mnote(mf(K.r - 12 + c[0]), mnext, sd * 7, "sine", 0.5);
    mnote(mf(K.r + c[K.p[st % K.p.length]]), mnext, sd * 1.6, K.w, 0.16);
    if (st % 4 == 2 && hs(ms, CFG.trk + 1) > 0.35)
      mnote(mf(K.r + 12 + K.sc[Math.floor(hs(ms * 3, 7) * K.sc.length)]), mnext, sd * 3, "sine", 0.22);
    mnext += sd;
    ms++;
  }
}
setInterval(mtick, 150);
/* ==========================================================================
 * 51. SETTINGS PANEL
 * Toggle list, config persistence and the settings modal wiring.
 * ========================================================================== */
const TG = [
  ["gfx", "Graphics", ["Low", "High"]],
  ["dn", "Day/night", ["Off", "On"]],
  ["run", "Run (R)", ["Walk", "Run"]],
  ["auto", "Auto-retaliate", ["Off", "On"]],
  ["names", "NPC names", ["Hide", "Show"]],
  ["splat", "Hit splats", ["Hide", "Show"]],
  ["autopause", "Pause when hidden", ["Off", "On"]],
];
function saveCfg() {
  try {
    Store.set("pixelvale_set", JSON.stringify(CFG));
  } catch (e) {}
}
/* ==========================================================================
 * 52. TITLE / PLAY SCREEN
 * Front screen controls: Play/Continue, New Game, Settings and Music.
 * ========================================================================== */
const $title = $("title");
const titleMusic = () => {
  const off = CFG.trk < 0 || !TRK[CFG.trk];
  $("t_music").innerHTML = UI("note") + " Music: " + (off ? "OFF" : "ON");
  $("t_now").textContent = off ? "Music off" : "♪ " + TRK[CFG.trk].n;
};
const showTitle = () => {
  $title.style.display = "flex";
  $("t_play").textContent = hasSave ? "Continue" : "Play";
  $("t_new").style.display = hasSave ? "" : "none";
  titleMusic();
};
const hideTitle = () => ($title.style.display = "none");
const beginGame = () => {
  hideTitle();
  if (hasSave) {
    started = true;
    msg("Welcome back, " + pname + "! Game loaded.", 1);
    if (!tutorialDone) showTutorial();
  } else {
    buildCC();
    $("cc").style.display = "flex";
  }
};
$("t_play").onclick = beginGame;
let tnc = 0;
$("t_new").onclick = () => {
  if (!hasSave) return;
  if (!tnc++) {
    $("t_new").textContent = "Erase saved game?";
    setTimeout(() => {
      tnc = 0;
      $("t_new").textContent = "New Game";
    }, 3000);
    return;
  }
  try {
    Store.remove(SV);
    Store.remove(SV_BAK);
  } catch (e) {}
  location.reload();
};
$("t_settings").onclick = () => {
  setUI();
  $("settings_modal").style.display = "flex";
};
$("t_music").onclick = () => {
  CFG.trk = CFG.trk < 0 ? 0 : -1;
  ms = 0;
  mnext = 0;
  saveCfg();
  setUI();
  titleMusic();
};
addEventListener("keydown", (e) => {
  if (e.target.tagName == "BUTTON") return;
  if ($title.style.display != "none" && (e.key == "Enter" || e.key == " ")) {
    e.preventDefault();
    beginGame();
  }
});
showTitle();
/* ==========================================================================
 * 53. GAMEPLAY HELPERS
 * Run speed/energy drain and combat level calculation.
 * ========================================================================== */
function spd() {
  if (CFG.run && P.en >= 1 && P.path.length) {
    P.en -= 2.2;
    return 2;
  }
  return 1;
}
function cmb() {
  const m = Math.max(lv("Attack"), Math.floor(lv("Ranged") * 1.5), Math.floor(lv("Magic") * 1.5));
  return Math.max(1, Math.floor(0.25 * (lv("Defence") + lv("Hitpoints")) + 0.325 * m));
}
function setUI() {
  $("setx").innerHTML =
    '<div class="row">' + UI("speaker") + ' <input id="vol" type="range" min="0" max="1" step=".05" value="' +
    CFG.vol +
    '" style="width:60%"></div><div class="row">' + UI("note") + ' <input id="mvol" type="range" min="0" max="1" step=".05" value="' +
    CFG.mvol +
    '" style="width:60%"></div><div class="row"><button data-m="-1">◀</button><span style="flex:1;font-size:13px">' +
    (CFG.trk < 0 ? "Music off" : TRK[CFG.trk].n) +
    '</span><button data-m="1">▶</button></div>' +
    TG.map(
      (t) =>
        `<div class="row"><button data-t="${t[0]}" style="width:100%">${t[1]}: ${t[2][CFG[t[0]]]}</button></div>`,
    ).join("");
}
$("setx").onclick = (e) => {
  const k = e.target.dataset.t,
    m = e.target.dataset.m;
  if (k) {
    CFG[k] ^= 1;
    saveCfg();
    setUI();
  }
  if (m) {
    const n = TRK.length + 1;
    CFG.trk = ((CFG.trk + 1 + +m + n) % n) - 1;
    ms = 0;
    mnext = 0;
    saveCfg();
    setUI();
    msg(CFG.trk < 0 ? "Music off." : "Now playing: " + TRK[CFG.trk].n);
  }
};
$("setx").oninput = (e) => {
  if (e.target.id == "mvol") {
    CFG.mvol = +e.target.value;
    if (MU) MU.gain.value = CFG.mvol * 0.5;
    saveCfg();
  }
  if (e.target.id == "vol") {
    CFG.vol = +e.target.value;
    if (MG) MG.gain.value = CFG.vol;
    saveCfg();
  }
};
$("set_btn").onclick = () => {
  setUI();
  $("settings_modal").style.display = "flex";
};
setUI();
/* ==========================================================================
 * 54. CHARACTER PANEL & BUTTON ICONS
 * SVG icon helper and the character/run button icons.
 * ========================================================================== */
const px_ = (w, r) =>
  `<svg width="17" height="17" viewBox="0 0 12 12" shape-rendering="crispEdges" style="display:block">${r.map((a) => `<rect x="${a[0]}" y="${a[1]}" width="${a[2]}" height="${a[3]}" fill="${a[4]}"/>`).join("")}</svg>`;
const CHIC = px_(0, [
  [3, 0, 6, 1, "#2b1b10"],
  [3, 1, 6, 3, "#f5d0a9"],
  [4, 2, 1, 1, "#222"],
  [7, 2, 1, 1, "#222"],
  [2, 4, 8, 4, "#3a7bd5"],
  [2, 4, 8, 1, "#5a98ee"],
  [1, 5, 1, 3, "#f5d0a9"],
  [10, 5, 1, 3, "#f5d0a9"],
  [3, 8, 2, 3, "#3b3f63"],
  [7, 8, 2, 3, "#3b3f63"],
  [2, 11, 3, 1, "#4a3220"],
  [7, 11, 3, 1, "#4a3220"],
]);
const runIc = (on) => {
  const c = on ? "#c0452f" : "#8a8f96",
    h = on ? "#e8715a" : "#b8bec6";
  return px_(
    0,
    [
      [4, 2, 4, 1, "#fff4dc"],
      [4, 3, 4, 5, c],
      [4, 3, 1, 5, h],
      [4, 7, 7, 2, c],
      [5, 4, 2, 1, "#ffd54f"],
      [5, 6, 2, 1, "#ffd54f"],
      [3, 9, 8, 2, "#2b1d14"],
    ].concat(
      on
        ? [
            [0, 4, 3, 1, "#ffd54f"],
            [0, 6, 2, 1, "#ffd54f"],
            [1, 8, 2, 1, "#ffd54f"],
          ]
        : [],
    ),
  );
};
$("ch_btn").innerHTML = CHIC;
function charUI() {
  const A = P.act && { tree: "axe", rock: "pick", fish: "rod", attack: P.w }[P.act.k];
  $("chbody").innerHTML =
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">' +
    ["axe", "pick", "rod", P.w]
      .map(
        (k) =>
          `<div class="k" style="display:block;text-align:center;${A == k ? "outline:2px solid #ffd54f" : ""}"><div>${gic(k, gear[k]).replace('class="ic"', 'class="ic" style="width:36px;height:36px"')}</div>${GN[k]}<br><b>${gear[k] >= 0 ? (ARMOR_CLASS[k] ? gearName(k) : TN[gear[k]]) : "None"}</b><br><small>${SKF[k]} ${lv(SKF[k])}</small></div>`,
      )
      .join("") +
    '</div><div class="k" style="margin-top:6px"><span>Defence bonus</span><b>' +
    DEF() +
    '</b></div><div class="k"><span>Combat level</span><b>' +
    cmb() +
    "</b></div>";
}
$("ch_btn").onclick = () => {
  charUI();
  $("char_modal").style.display = "flex";
};
$("cls_ch").onclick = () => ($("char_modal").style.display = "none");
$("run_btn").onclick = () => {
  CFG.run ^= 1;
  saveCfg();
  msg("You are now " + (CFG.run ? "running" : "walking") + ".");
};
setInterval(() => {
  const b = $("run_btn");
  if (b._o !== CFG.run) {
    b._o = CFG.run;
    b.innerHTML = runIc(CFG.run);
  }
  b.style.background = CFG.run ? "#9a7a4e" : "var(--panel)";
  b.title = "Run: " + (CFG.run ? "ON" : "OFF") + " (" + Math.round(P.en) + "% energy)";
  if ($("char_modal").style.display == "flex") charUI();
}, 300);
setInterval(() => {
  $("mw").style.top = Math.round((76 * cv.getBoundingClientRect().width) / LW + 8) + "px";
}, 400);
fitCanvas();
