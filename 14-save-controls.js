/* Oak & Iron - Save/load, UI buttons, zoom, minimap marker (sections 47-49). Loaded in order by index.html. */

/* ==========================================================================
 * 47. SAVE & LOAD
 * localStorage serialisation of the player, world state and settings (saveCfg later).
 * ========================================================================== */
const SV = "pixelvale2",
  SV_BAK = SV + "_bak",
  SAVE_TAG = "OAKIRON1:";
function saveData() {
  return Object.assign({ v: SAVE_VERSION, gv: GAME_VERSION, at: Date.now() }, {
        x: P.x,
        y: P.y,
        hp: P.hp,
        mp: P.mp,
        rage: P.rage,
        look,
        pname,
        xp,
        inv,
        gear,
        w: P.w,
        qs,
        trackedQuest,
        learnedSkills,
        cls,
        tickN,
        inMine,
        mineReturn,
        bank,
        hotbar,
        pl: objs.filter((o) => o.type == "plot").map((o) => [o.st, o.g]),
        grave: grave,
        tutorialDone,
      });
}
/* Upgrades older save formats in place. v1 = saves made before versioning existed. */
function migrateSave(s) {
  if (!s.v || s.v < 2) {
    s.bank = s.bank || {};
    s.gear = s.gear || {};
    s.learnedSkills = s.learnedSkills || [];
  }
  if (s.tutorialDone === undefined) s.tutorialDone = true; // Existing characters have already begun playing.
  s.v = SAVE_VERSION;
  return s;
}
const validItem = (v) => !!v && typeof v.n == "string" && v.n && v.n != "undefined" && Number.isFinite(v.q) && v.q > 0;
function readSave(k) {
  try {
    const s = JSON.parse(Store.get(k));
    return s && typeof s == "object" && "x" in s && Array.isArray(s.inv) ? migrateSave(s) : null;
  } catch (e) {
    return null;
  }
}
function save(m) {
  try {
    const s = JSON.stringify(saveData()),
      prev = Store.get(SV);
    if (prev && prev != s && readSave(SV)) Store.set(SV_BAK, prev);
    Store.set(SV, s);
    if (m) msg(Store.persistent() ? "Game saved." : "Saved for this session only: this browser blocks storage.", 1);
  } catch (e) {
    if (m) msg("Saving failed: " + e.message);
    else if (!save.warned) {
      save.warned = true;
      reportError(e, "autosave");
    }
  }
}
const b64e = (s) => btoa(unescape(encodeURIComponent(s))),
  b64d = (s) => decodeURIComponent(escape(atob(s.trim())));
function exportSave() {
  const raw = started ? JSON.stringify(saveData()) : Store.get(SV);
  if (!raw) return msg("There is no save to export yet.");
  if (started) save();
  const code = SAVE_TAG + b64e(raw),
    a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([code], { type: "text/plain" }));
  a.download = "oak-and-iron-" + new Date().toISOString().slice(0, 10) + ".oaksave";
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  copyText(code, () => msg("Save exported: a file was downloaded and the save code was copied.", 1));
}
function importSave(text) {
  try {
    text = String(text || "").trim();
    if (!text) return false;
    const s = migrateSave(JSON.parse(text.startsWith(SAVE_TAG) ? b64d(text.slice(SAVE_TAG.length)) : text));
    if (!("x" in s) || !Array.isArray(s.inv)) throw new Error("not an Oak & Iron save");
    const cur = Store.get(SV);
    if (cur) Store.set(SV_BAK, cur);
    Store.set(SV, JSON.stringify(s));
    started = false;
    location.reload();
    return true;
  } catch (e) {
    msg("That save could not be imported (" + e.message + ").");
    return false;
  }
}
function load() {
  try {
    let s = readSave(SV);
    if (!s) {
      s = readSave(SV_BAK);
      if (s) setTimeout(() => msg("Your save was damaged, so the most recent backup was loaded.", 1), 800);
    }
    if (!s) return false;
    P.x = P.ox = s.x;
    P.y = P.oy = s.y;
    if (bl(P.x, P.y)) {
      P.x = P.ox = SPAWN.x;
      P.y = P.oy = SPAWN.y;
    }
    P.mp = s.mp || 10;
    P.rage = Math.max(0, Math.min(RAGE_MAX, Number(s.rage) || 0));
    P.w = s.w;
    inMine = !!s.inMine;
    mineReturn = s.mineReturn || null;
    Object.assign(look, s.look);
    pname = s.pname;
    Object.assign(xp, s.xp);
    const savedHp = Number(s.hp) || 0,
      previousMaxHp = lv("Hitpoints");
    P.hp = savedHp >= previousMaxHp ? maxHp() : Math.max(0, Math.min(maxHp(), savedHp));
    Object.assign(gear, s.gear);
    Object.assign(qs, s.qs);
    trackedQuest = s.trackedQuest ?? null;
    tutorialDone = !!s.tutorialDone;
    if (Array.isArray(s.hotbar)) s.hotbar.slice(0, HOTBAR_SLOTS).forEach((n, i) => (hotbar[i] = typeof n == "string" && n ? n : null));
    Object.keys(CL_SKILLS).forEach((className) => {
      if (Array.isArray(s.learnedSkills?.[className]))
        learnedSkills[className] = CL_SKILLS[className]
          .slice(0, 3)
          .map((_, index) => !!s.learnedSkills[className][index]);
    });
    s.inv.forEach((v, i) => {
      if (i < inv.length) inv[i] = validItem(v) ? v : null;
    });
    cls = s.cls;
    if (cls && WP[P.w] && !canWear(P.w)) {
      P.w = CL[cls].w;
      if (gear[P.w] < 0) gear[P.w] = 0;
    }
    tickN = s.tickN;
    grave = s.grave;
    for (const [k, q] of Object.entries(s.bank || {})) if (validItem({ n: k, q })) bank[k] = q;
    const pl = objs.filter((o) => o.type == "plot");
    (s.pl || []).forEach((v, i) => {
      if (pl[i]) {
        pl[i].st = v[0];
        pl[i].g = v[1];
      }
    });
    return true;
  } catch (e) {
    return false;
  }
}
/* ==========================================================================
 * 48. UI BUTTONS, ZOOM & KEYBOARD
 * Save/new game, zoom buttons, wheel zoom and hotkeys.
 * ========================================================================== */
$("sv").onclick = () => save(1);
$("pause_btn").onclick = () => {
  $("settings_modal").style.display = "none";
  if (started) setPaused(true);
};
$("exp_btn").onclick = exportSave;
$("imp_btn").onclick = () => $("imp_file").click();
$("imp_file").onchange = (e) => {
  const f = e.target.files[0];
  if (f) f.text().then(importSave);
  e.target.value = "";
};
$("imp_paste").onclick = () => importSave(prompt("Paste your Oak & Iron save code:"));
$("ver_line").textContent =
  "Version " + GAME_VERSION + " · save format v" + SAVE_VERSION + (Store.persistent() ? "" : " · storage blocked: progress lasts this session only");
$("zi").onclick = () => (zoom = Math.min(2.6, zoom * 1.15));
$("zo").onclick = () => (zoom = Math.max(0.55, zoom / 1.15));
cv.addEventListener(
  "wheel",
  (e) => {
    e.preventDefault();
    zoom = Math.min(2.6, Math.max(0.55, zoom * (e.deltaY < 0 ? 1.1 : 0.9)));
  },
  { passive: false },
);
addEventListener("keydown", (e) => {
  if (!started) return;
  if (
    e.repeat ||
    (e.altKey && !/^Digit\d$/.test(e.code)) ||
    e.ctrlKey ||
    e.metaKey ||
    e.target.isContentEditable ||
    /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) ||
    ["cc", "shop", "settings_modal", "char_modal", "death"].some(
      (id) => $(id).style.display == "flex",
    )
  )
    return;
  if (e.altKey && /^Digit\d$/.test(e.code)) {
    e.preventDefault();
    hotbarKey(e.code);
    return;
  }
  if (e.code == "Space" || e.key.toLowerCase() == "shift") {
    e.preventDefault();
    tryDodge();
  }
  if (e.key == "i" || e.key == "b") $("side").classList.toggle("open");
  const skillKey = e.code.match(/^Digit([1-3])$/);
  if (skillKey || (e.key >= "1" && e.key <= "3")) {
    e.preventDefault();
    useSkill(Number(skillKey ? skillKey[1] : e.key) - 1);
  }
  if (e.key.toLowerCase() == "m") {
    $("map_btn").click();
  }
  if (e.key.toLowerCase() == "r" && e.target.tagName != "INPUT") {
    CFG.run ^= 1;
    saveCfg();
    msg("You are now " + (CFG.run ? "running" : "walking") + ".");
  }
});
// A saved game is restored into memory here, but play does not begin
// until the player presses Play / Continue on the title screen.
const hasSave = load();
$("bp").onclick = () => {
  const side = $("side");
  if (side.classList.contains("open") && !side.classList.contains("utility")) side.classList.remove("open");
  else {
    side.classList.add("open");
    tab(1);
  }
};
const toggleUtility = (view) => {
  const side = $("side");
  const activeView = side.classList.contains("skills-view") ? "skills" : "quests";
  if (side.classList.contains("open") && side.classList.contains("utility") && activeView == view) {
    side.classList.remove("open", "utility", "skills-view", "quests-view");
    $("skillsPanel").style.display = "none";
    $("questsPanel").style.display = "none";
  } else {
    side.classList.add("open", "utility", view + "-view");
    side.classList.remove(view == "skills" ? "quests-view" : "skills-view");
    $("inv").style.display = "none";
    $("gr").style.display = "none";
    $("skillsPanel").style.display = view == "skills" ? "block" : "none";
    $("questsPanel").style.display = view == "quests" ? "block" : "none";
    $("t1").className = "";
    $("t3").className = "";
  }
};
$("sq_btn").onclick = () => toggleUtility("skills");
$("quest_btn").onclick = () => toggleUtility("quests");
$("cx").onclick = () => {
  $("side").classList.remove("open", "utility", "skills-view", "quests-view");
  $("skillsPanel").style.display = "none";
  $("questsPanel").style.display = "none";
};
/* ==========================================================================
 * 49. MINIMAP PLAYER MARKER
 * Keeps the red dot on the minimap in sync with the player.
 * ========================================================================== */
const pd = $("pd");
const qd = $("qd");
const graveMarker = $("graveMarker");
const mapLayer = $("mapLayer");
const mapZoomLabel = $("mapZoomLevel");
const mapViewport = $("mapViewport");
let mapPanX = 0,
  mapPanY = 0,
  mapDrag = null;
function clampMapPan() {
  mapPanX = Math.max(228 * (1 - mapZoom), Math.min(0, mapPanX));
  mapPanY = Math.max(152 * (1 - mapZoom), Math.min(0, mapPanY));
}
function setMapZoom(nextZoom, anchorX = 114, anchorY = 76) {
  const next = Math.min(4, Math.max(1, nextZoom)),
    ratio = next / mapZoom;
  mapPanX = anchorX - (anchorX - mapPanX) * ratio;
  mapPanY = anchorY - (anchorY - mapPanY) * ratio;
  mapZoom = next;
  clampMapPan();
  updateMapZoom();
}
function updateMapZoom() {
  const px = (P.x / W) * 228,
    py = (P.y / H) * 152;
  clampMapPan();
  mapLayer.style.transform = `translate(${mapPanX}px, ${mapPanY}px) scale(${mapZoom})`;
  mapZoomLabel.textContent = Math.round(mapZoom * 100) + "%";
  pd.style.left = px - 4 + "px";
  pd.style.top = py - 4 + "px";
  graveMarker.style.display = grave ? "block" : "none";
  if (grave) {
    graveMarker.style.left = (grave.x / W) * 228 + "px";
    graveMarker.style.top = (grave.y / H) * 152 + "px";
  }
  const target = trackedMapTarget();
  qd.style.display = target ? "block" : "none";
  if (target) {
    qd.style.left = (target.x / W) * 228 - 4 + "px";
    qd.style.top = (target.y / H) * 152 - 4 + "px";
  }
}
$("mapZoomIn").onclick = () => {
  setMapZoom(mapZoom * 1.25);
};
$("mapZoomOut").onclick = () => {
  setMapZoom(mapZoom / 1.25);
};
mapViewport.addEventListener("pointerdown", (e) => {
  if (e.button !== 0 || e.target.closest("#mapZoom, #enemyMarkers, #mineMarkers")) return;
  mapDrag = { id: e.pointerId, x: e.clientX, y: e.clientY };
  mapViewport.setPointerCapture(e.pointerId);
  mapViewport.classList.add("dragging");
  e.preventDefault();
});
mapViewport.addEventListener("pointermove", (e) => {
  if (!mapDrag || mapDrag.id !== e.pointerId) return;
  mapPanX += e.clientX - mapDrag.x;
  mapPanY += e.clientY - mapDrag.y;
  mapDrag.x = e.clientX;
  mapDrag.y = e.clientY;
  clampMapPan();
  updateMapZoom();
});
const endMapDrag = (e) => {
  if (!mapDrag || mapDrag.id !== e.pointerId) return;
  mapDrag = null;
  mapViewport.classList.remove("dragging");
};
mapViewport.addEventListener("pointerup", endMapDrag);
mapViewport.addEventListener("pointercancel", endMapDrag);
mapViewport.addEventListener("lostpointercapture", endMapDrag);
$("mapViewport").addEventListener(
  "wheel",
  (e) => {
    e.preventDefault();
    const rect = mapViewport.getBoundingClientRect();
    setMapZoom(mapZoom * (e.deltaY < 0 ? 1.15 : 1 / 1.15), e.clientX - rect.left, e.clientY - rect.top);
  },
  { passive: false },
);
setInterval(() => {
  if (showMap) {
    updateMapZoom();
  }
}, 200);
