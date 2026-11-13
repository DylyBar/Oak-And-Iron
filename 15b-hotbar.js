/* Oak & Iron - Quick access toolbar (10 slots under the spell bar) and consumable use.
 * Loaded after the menus (15) and before boot (16) so the render loop can always find it.
 * The toolbar remembers item NAMES, so slots keep working as stacks change; a slot dims when you run out.
 * Potion effects live in POTIONS (js/03-data.js), potion art in js/05-item-art.js, drop rates in js/06-drops.js. */
let hotHover = -1,
  potionReadyAt = 0;
const hotMpCap = () => lv("Magic") * 2 + 10;

/* ---- layout (canvas units; the spell bar sits above the toolbar) ---- */
const spellRect = () => {
  const bW = 38, bH = 38, gap = 8;
  return { bW, bH, gap, stX: LW / 2 - (bW * 3 + gap * 2) / 2, stY: LH - 96 };
};
const hotbarRect = () => {
  const w = 34, h = 34, gap = 3, tot = w * HOTBAR_SLOTS + gap * (HOTBAR_SLOTS - 1);
  return { w, h, gap, tot, x0: LW / 2 - tot / 2, y: LH - 52 };
};
const overSpellBar = (ux, uy) => {
  const r = spellRect();
  return uy >= r.stY && uy <= r.stY + r.bH && ux >= r.stX && ux <= r.stX + r.bW * 3 + r.gap * 2;
};
const overHotbar = (ux, uy) => {
  const r = hotbarRect();
  return uy >= r.y && uy <= r.y + r.h && ux >= r.x0 && ux <= r.x0 + r.tot;
};
const spellSlotAtUnits = (ux, uy) => {
  if (!overSpellBar(ux, uy)) return -1;
  const r = spellRect(), off = ux - r.stX, i = Math.floor(off / (r.bW + r.gap));
  return i >= 0 && i < 3 && off % (r.bW + r.gap) <= r.bW ? i : -1;
};
const hotbarSlotAtUnits = (ux, uy) => {
  if (!overHotbar(ux, uy)) return -1;
  const r = hotbarRect(), off = ux - r.x0, i = Math.floor(off / (r.w + r.gap));
  return i >= 0 && i < HOTBAR_SLOTS && off % (r.w + r.gap) <= r.w ? i : -1;
};
const unitsOf = (cx, cy) => {
  const r = cv.getBoundingClientRect();
  return [((cx - r.left) / r.width) * LW, ((cy - r.top) / r.height) * LH];
};
const hotbarSlotAtClient = (cx, cy) => hotbarSlotAtUnits(...unitsOf(cx, cy));

/* ---- drawing ---- */
function drawHotbar() {
  const r = hotbarRect(),
    now = performance.now(),
    cdLeft = Math.max(0, potionReadyAt - now);
  g.save();
  g.imageSmoothingEnabled = false;
  for (let i = 0; i < HOTBAR_SLOTS; i++) {
    const x = r.x0 + i * (r.w + r.gap),
      y = r.y,
      name = hotbar[i],
      n = name ? count(name) : 0;
    F("rgba(40,28,16,.88)", x, y, r.w, r.h);
    g.strokeStyle = name ? (n ? rarityOf(name).color : "#555") : i == hotHover ? "#b89a6a" : "#4a3a28";
    g.lineWidth = 2;
    g.strokeRect(x + 1, y + 1, r.w - 2, r.h - 2);
    if (name) {
      g.globalAlpha = n ? 1 : 0.3;
      g.drawImage(SC[name], x + 5, y + 5, 24, 24);
      g.globalAlpha = 1;
      if (n) {
        g.font = "bold 10px monospace";
        g.textAlign = "right";
        g.fillStyle = "#000";
        g.fillText(fmtQ(n), x + r.w - 2, y + r.h - 2);
        g.fillStyle = "#fff";
        g.fillText(fmtQ(n), x + r.w - 3, y + r.h - 3);
        if (POTIONS[name] && cdLeft > 0) {
          const frac = cdLeft / POTION_CD;
          F("rgba(0,0,0,.55)", x + 2, y + 2 + (r.h - 4) * (1 - frac), r.w - 4, (r.h - 4) * frac);
          g.textAlign = "center";
          g.fillStyle = "#fff";
          g.fillText(Math.ceil(cdLeft / 1000), x + r.w / 2, y + 21);
        }
      }
    }
    g.font = "8px monospace";
    g.textAlign = "left";
    g.fillStyle = name ? "#ffd54f" : "#8a7a62";
    g.fillText(i == 9 ? "0" : String(i + 1), x + 3, y + 10);
  }
  if (hotHover >= 0 && hotbar[hotHover]) {
    const nm = hotbar[hotHover],
      p = POTIONS[nm],
      fx_ = p ? " (" + [p.hp && "+" + p.hp + " HP", p.mp && "+" + p.mp + " MP", p.en && "+" + p.en + " energy"].filter(Boolean).join(", ") + ")" : FOOD[nm] ? " (+" + FOOD[nm] + " HP)" : "",
      txt = nm + " x" + count(nm) + fx_;
    g.font = "bold 10px monospace";
    const w = g.measureText(txt).width + 10;
    F("rgba(30,20,10,.85)", LW / 2 - w / 2, LH - 16, w, 13);
    g.textAlign = "center";
    g.fillStyle = "#fff";
    g.fillText(txt, LW / 2, LH - 6);
  }
  g.restore();
}

/* ---- using items ---- */
function useItem(name) {
  if (!started || paused || P.hp <= 0 || $("death").style.display == "flex") return false;
  const p = POTIONS[name];
  if (p) {
    const now = performance.now();
    if (now < potionReadyAt) {
      msg("Your potions need a moment (" + Math.ceil((potionReadyAt - now) / 1000) + "s).");
      return false;
    }
    if (cls == "Warrior" && p.mp && !p.hp && !p.en) {
      msg("Warriors use rage, not mana.");
      return false;
    }
    const useful = (p.hp && P.hp < maxHp()) || (p.mp && P.mp < hotMpCap()) || (p.en && P.en < 100);
    if (!useful) {
      msg(p.hp ? "You're already at full health." : p.mp ? "Your mana is already full." : "You're already at full energy.");
      return false;
    }
    if (!consumeItem(name, 1)) return false;
    const parts = [];
    if (p.hp) {
      const b = P.hp;
      P.hp = Math.min(maxHp(), P.hp + p.hp);
      parts.push("+" + (P.hp - b) + " HP");
    }
    if (p.mp) {
      const b = P.mp;
      P.mp = Math.min(hotMpCap(), P.mp + p.mp);
      parts.push("+" + (P.mp - b) + " MP");
    }
    if (p.en) {
      const b = P.en;
      P.en = Math.min(100, P.en + p.en);
      parts.push("+" + Math.round(P.en - b) + "% energy");
    }
    potionReadyAt = now + POTION_CD;
    sfx("drink");
    msg("You drink the " + name.toLowerCase() + " (" + parts.join(", ") + ").");
    dirty = true;
    return true;
  }
  if (FOOD[name]) {
    if (P.hp >= maxHp()) {
      msg("You're already at full health.");
      return false;
    }
    const i = inv.findIndex((it) => it && it.n == name);
    if (i < 0) return false;
    eat(i);
    return true;
  }
  msg("You can't use " + name.toLowerCase() + " from the toolbar.");
  return false;
}
function hotbarUse(i) {
  const name = hotbar[i];
  if (!name) return;
  if (!count(name)) return void msg("You have no " + name.toLowerCase() + " left.");
  useItem(name);
}
const hotbarKey = (code) => {
  const d = +code.slice(5);
  hotbarUse(d == 0 ? 9 : d - 1);
};

/* ---- assigning / removing ---- */
function hotbarSet(i, name) {
  for (let k = 0; k < HOTBAR_SLOTS; k++) if (hotbar[k] == name) hotbar[k] = null;
  hotbar[i] = name;
  dirty = true;
  save();
}
function hotbarAdd(name) {
  const at = hotbar.indexOf(name);
  if (at >= 0) return void msg(name + " is already on your toolbar (slot " + (at + 1) + ").");
  const i = hotbar.indexOf(null);
  if (i < 0) return void msg("Your toolbar is full. Remove something first, or drag the item onto a slot to replace it.");
  hotbarSet(i, name);
  msg("Added " + name.toLowerCase() + " to toolbar slot " + (i + 1) + ".");
}
function hotbarAssignMenu(i, cx, cy) {
  const names = [...new Set(inv.filter((it) => it && (POTIONS[it.n] || FOOD[it.n]) && !hotbar.includes(it.n)).map((it) => it.n))].slice(0, 8);
  if (!names.length) return void msg("Nothing to add. Right-click or long-press any item in your bag and choose Add to toolbar.");
  showM(cx, cy, "Add to slot " + (i + 1), names.map((n) => ({ l: n + " x" + count(n), f: () => hotbarSet(i, n) })).concat({ l: "Cancel" }));
}
function hotbarSlotMenu(i, cx, cy) {
  const name = hotbar[i];
  showM(cx, cy, name, [
    { l: "Use", f: () => hotbarUse(i) },
    {
      l: "Remove from toolbar",
      f: () => {
        hotbar[i] = null;
        dirty = true;
        save();
      },
    },
    { l: "Cancel" },
  ]);
}
function hotbarClick(i, cx, cy) {
  if (hotbar[i]) hotbarUse(i);
  else hotbarAssignMenu(i, cx, cy);
}
function hotbarContext(cx, cy) {
  const i = hotbarSlotAtClient(cx, cy);
  if (i < 0) return false;
  if (hotbar[i]) hotbarSlotMenu(i, cx, cy);
  else hotbarAssignMenu(i, cx, cy);
  return true;
}
function hotbarHover(e) {
  const [ux, uy] = unitsOf(e.clientX, e.clientY);
  hotHover = hotbarSlotAtUnits(ux, uy);
  if (hotHover >= 0 || overSpellBar(ux, uy) || overHotbar(ux, uy)) hov = { x: -1, y: -1 };
}
cv.addEventListener("mouseleave", () => (hotHover = -1));
/* Drag an item from the bag onto a toolbar slot (desktop). */
cv.addEventListener("dragover", (e) => {
  if (invDragFrom >= 0 && hotbarSlotAtClient(e.clientX, e.clientY) >= 0) e.preventDefault();
});
cv.addEventListener("drop", (e) => {
  const i = hotbarSlotAtClient(e.clientX, e.clientY);
  if (i < 0 || invDragFrom < 0) return;
  e.preventDefault();
  const it = inv[invDragFrom];
  invDragFrom = -1;
  if (it) hotbarSet(i, it.n);
});
