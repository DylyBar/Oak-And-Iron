/* Oak & Iron - Player actions, dialog, gathering, cooking, farming, game tick (sections 31-34). Loaded in order by index.html. */

/* ==========================================================================
 * 31. PLAYER ACTIONS & CONTEXT MENU
 * Class skills, clicking to walk, interacting and right-click options.
 * ========================================================================== */
function useSkill(i) {
  if (!started) return;
  const a = P.act;
  if (!a || a.k != "attack") {
    msg("Target an enemy first.");
    return;
  }
  const s = CL_SKILLS[cls][i];
  if (!learnedSkills[cls][i]) {
    msg("Learn " + s.n + " from your class trainer first.");
    return;
  }
  if (lv(CL[cls].s) < s.lv) {
    msg("Skill locked.");
    return;
  }
  if (P_SK[i] > 0) {
    msg("Skill on cooldown.");
    return;
  }
  if (cls == "Warrior") {
    const cost = RAGE_COST[i] || 0;
    if ((P.rage || 0) < cost) {
      msg("Not enough rage! Land and take hits to build it.");
      return;
    }
    P.rage -= cost;
    dirty = true;
  }
  if (cls == "Mage" || cls == "Ranger") {
    if (P.mp < s.m * 4) {
      msg("Not enough MP!");
      return;
    }
    P.mp -= s.m * 4;
    dirty = true;
  }
  P_SK[i] = s.cd;
  msg("You cast " + s.n + "!");
  const t = a.t;
  if (!t || t.dead) return;
  let d = Math.floor(lv(CL[cls].s) * (1 + i * 0.5) + gear[P.w] * 2);
  if (cls == "Warrior" && i == 2) {
    P.hp = Math.min(maxHp(), P.hp + 10);
    msg("You heal 10 HP!");
    d = 0;
  }
  playSnd(cls == "Warrior" ? "sword" : cls == "Ranger" ? "bow" : "magic");
  proj.push({ a: P.x, b: P.y, c: t.x, d: t.y, e: performance.now() + 350, sk: cls, si: i });
  skillFx(t, i);
  setTimeout(() => {
    if (!t.dead) {
      t.hp -= d;
      t.hb = performance.now() + 3000;
      splat(t, d);
      provoke(t);
      if (d) {
        awardCombatXp(CL[cls].s, d);
        playSnd("ehurt");
      }
      killCheck(t);
      dirty = true;
    }
  }, 350);
}
function setAct(k, t) {
  const d = k == "tree" ? TR[t.tier] : k == "rock" ? RK[t.tier] : null;
  if (k == "forage" && lv("Farming") < t.req) {
    msg("You need level " + t.req + " Farming to gather this resource.");
    return;
  }
  if (d) {
    const sk = k == "tree" ? "Woodcutting" : "Mining",
      tl = k == "tree" ? "axe" : "pick",
      req = k == "rock" ? t.miningLevel || d.l : d.l;
    if (lv(sk) < req) {
      msg("You need level " + req + " " + sk + " to use the " + (t.mineOre || d.n).toLowerCase() + ".");
      return;
    }
    if (gear[tl] < d.t) {
      msg("You need a " + TN[d.t] + " " + GN[tl].toLowerCase() + " or better.");
      return;
    }
  }
  P.act = { k, t, w: 0 };
  P.path = [];
  const m = {
    tree: "You swing your axe at the tree.",
    rock: "You swing your pickaxe at the rock.",
    fish: "You cast your line.",
  }[k];
  if (m) msg(m);
}
function walkTo(x, y) {
  P.act = null;
  if (bl(x, y)) return;
  const p = findPath(P, (a, b) => a == x && b == y);
  if (p) {
    P.path = p;
    mark = { x, y, e: performance.now() + 700 };
  }
}
function trackedNpc() {
  const q = QS.find((entry) => entry.id == trackedQuest);
  return q ? npcs.find((npc) => npc.n == q.g) || null : null;
}
function trackedMapTarget() {
  const npc = trackedNpc();
  if (!npc) return null;
  if (npc.cave && !inMine) {
    return MINE_ENTRANCES.reduce(
      (best, entrance) =>
        !best ||
        Math.abs(P.x - entrance.x) + Math.abs(P.y - entrance.y) <
          Math.abs(P.x - best.x) + Math.abs(P.y - best.y)
          ? entrance
          : best,
      null,
    );
  }
  return npc;
}
function trackQuest(id) {
  const q = QS.find((entry) => entry.id == Number(id)),
    npc = q && npcs.find((entry) => entry.n == q.g);
  if (!q || !npc) {
    msg("That quest giver cannot be found.");
    return;
  }
  trackedQuest = q.id;
  save();
  $("side").classList.remove("open", "utility", "skills-view", "quests-view");
  $("skillsPanel").style.display = "none";
  $("questsPanel").style.display = "none";
  showMap = true;
  $("mw").style.display = "block";
  if (!!npc.cave == inMine) setAct("talk", npc);
  else if (npc.cave) {
    const entrance = MINE_ENTRANCES.reduce(
      (best, candidate) =>
        !best ||
        Math.abs(P.x - candidate.x) + Math.abs(P.y - candidate.y) <
          Math.abs(P.x - best.x) + Math.abs(P.y - best.y)
          ? candidate
          : best,
      null,
    );
    const object = entrance && og[entrance.y * W + entrance.x];
    if (object) setAct("mine", object);
    else msg("The mine entrance cannot be reached.");
  } else {
    if (inMine) leaveMine();
    setAct("talk", npc);
  }
  msg("Tracking " + q.n + " — " + q.g + ".");
  dirty = true;
}
$("qu").onclick = (e) => {
  const entry = e.target.closest("[data-quest]");
  if (entry) trackQuest(entry.dataset.quest);
};
function opts(tx, ty) {
  const o = [],
    en = ens.find((q) => !q.dead && q.x == tx && q.y == ty),
    np = npcs.find((q) => !!q.cave == inMine && q.x == tx && q.y == ty),
    ob = tx >= 0 && ty >= 0 && tx < W && ty < H ? og[ty * W + tx] : null;
  if (grave && grave.x == tx && grave.y == ty) {
    o.push({ l: "Loot gravestone", f: () => setAct("loot", grave) });
    o.push({ l: "Check grave", f: () => msg("Items at death: " + grave.items.map((it) => it.q + "× " + it.n).join(", ") || "none") });
  }
  gd.forEach((i) => {
    if (i.x == tx && i.y == ty)
      o.push({ l: "Take " + i.n + (i.q > 1 ? " (" + i.q + ")" : ""), f: () => setAct("take", i) });
  });
  if (en)
    o.push({ l: "Attack " + ET[en.t].n + " (level " + ET[en.t].lv + ")", f: () => setAct("attack", en) });
  if (np && !hiddenAt(np.x, np.y))
    o.push({
      l:
        np.role == "mine"
          ? "Enter mine"
          : (np.role == "shop" ? "Trade with " : np.role == "bank" ? "Bank with " : "Talk-to ") + np.n,
      f: () => setAct("talk", np),
    });
  if (ob && ob.npc && !hiddenAt(tx, ty))
    o.push({
      l:
        (ob.npc.role == "shop" ? "Trade with " : ob.npc.role == "bank" ? "Bank with " : "Talk-to ") +
        ob.npc.n,
      f: () => setAct("talk", ob.npc),
    });
  if (ob && ob.alive) {
    const L = {
      tree: ["Chop down " + TR[ob.tier || 0].n, "tree"],
      rock: ["Mine " + (ob.mineOre || RK[ob.tier || 0].n), "rock"],
      fish: ["Fish Fishing spot", "fish"],
      herbPatch: ["Gather herbs", "forage"],
      berryBush: ["Pick redberries", "forage"],
      mineEntrance: ["Enter mine", "mine"],
      mineExit: ["Leave mine", "mine"],
      range: ["Cook at Stove", "range"],
      furnace: ["Smelt ores", "smith"],
      anvil: ["Forge equipment", "smith"],
      craftingBench: ["Craft animal goods", "craft"],
      plot: [
        ob.st == 0 ? "Plant Seeds" : tickN - ob.g >= GROW ? "Harvest Potatoes" : "Potatoes (growing)",
        "plot",
      ],
    }[ob.type];
    if (L) o.push({ l: L[0], f: () => setAct(L[1], ob) });
  }
  if (ob && ob.type == "villageProp") {
    if (ob.style == "anvil")
      o.push({ l: "Forge equipment", f: () => setAct("smith", { ...ob, type: "anvil" }) });
    if (ob.style == "craftingBench")
      o.push({ l: "Craft animal goods", f: () => setAct("craft", ob) });
    if (ob.fun)
      o.push({ l: "Interact", f: () => setAct("play", ob) });
    o.push({ l: "Examine " + ob.label, f: () => msg("You see " + ob.label + ".") });
  }
  const ex = en
    ? ET[en.t].n +
      " (level " +
      ET[en.t].lv +
      "). " +
      (ET[en.t].passive ? "It is a peaceful farm animal, but it will fight back if attacked." : "It looks hostile.")
    : np
      ? np.n + ", a local of this settlement."
      : ob && ob.npc
        ? ob.npc.n + " is waiting at the counter."
        : ob && ob.type == "tree"
          ? "A " + TR[ob.tier || 0].n.toLowerCase() + ". Needs Woodcutting " + TR[ob.tier || 0].l + "."
          : ob && ob.type == "rock"
          ? (ob.mineOre || RK[ob.tier || 0].n).toLowerCase() +
            " rock. Needs Mining " +
            (ob.miningLevel || RK[ob.tier || 0].l) +
            "."
            : ob && ob.type == "fish"
              ? "A good spot to fish."
              : ob && ob.type == "herbPatch"
                ? "A wild guam herb patch. Ready to forage."
                : ob && ob.type == "berryBush"
                  ? "A berry bush growing redberries."
                  : ob && ob.type == "scenery"
                    ? ({
                        tree: "A leafy tree grows here. It is part of the landscape and cannot be chopped.",
                        flowers: "Wildflowers brighten the trail.",
                        mushrooms: "A cluster of mushrooms grows in the shade.",
                        driftwood: "Weathered driftwood washed ashore.",
                        crystal: "A vivid mineral crystal juts from the rock.",
                        cairn: "A small cairn marks the mountain path.",
                      }[ob.style] || "A piece of island scenery.")
                  : ob && ob.type == "villageProp"
                    ? "A village detail: " + ob.label + "."
              : ob && ob.type == "mineEntrance"
                ? "A mine entrance. Ores and rats lie below."
                : ob && ob.type == "mineExit"
                  ? "Leave the mine and return to the surface."
              : ob && ob.type == "range"
                ? "A stove for cooking raw fish."
                : ob && ob.type == "plot"
                  ? "A farming plot for potatoes."
                  : ob && ob.type == "furnace"
                    ? "A stone furnace for smelting ores into metal bars."
                    : ob && ob.type == "anvil"
                      ? "A blacksmith's anvil for forging equipment from metal bars."
                            : ob && ob.type == "craftingBench"
                              ? "A workbench for tanning hides, making bows, and fletching arrows."
                          : "";
  o.push({ l: "Walk here", f: () => walkTo(tx, ty) });
  if (ex) o.push({ l: "Examine", f: () => msg(ex) });
  o.push({ l: "Cancel" });
  return o;
}
const rem = (n, q) => consumeItem(n, q);
/* ==========================================================================
 * 32. DIALOG & DAMAGE FEEDBACK
 * NPC dialogue flow plus hit splats, damage numbers and attack effects.
 * ========================================================================== */
function dialog(n) {
  // If a giver has several quests, finish the active one before offering the next.
  const q = QS.find((z) => z.g == n.n && qs[z.id].s == 1) || QS.find((z) => z.g == n.n && qs[z.id].s == 0),
    s = q && qs[q.id];
  let t;
  if (q && s.s == 0) {
    s.s = 1;
    s.k = 0;
    t = q.d + " (Quest started: " + q.n + ")";
    msg("Quest started: " + q.n, 1);
  } else if (q && s.s == 1) {
    const h = q.t == "kill" ? s.k : q.t == "talk" ? q.need : count(q.i);
    if (h >= q.need) {
      if (q.t == "get") rem(q.i, q.need);
      s.s = 2;
      add("Coins", q.c);
      addXp(q.x[0], q.x[1]);
      t = "Thank you! Here are " + q.c + " coins.";
      msg("Quest complete: " + q.n + "! +" + q.c + " coins.", 1);
    } else t = "Progress: " + h + "/" + q.need + ". Keep going!";
  } else t = n.lines[n.i++ % n.lines.length];
  dirty = true;
  const d = $("dlg");
  d.innerHTML = "<b>" + n.n + "</b><br>" + t + "<br><small>(click to close)</small>";
  d.style.zIndex = "20";
  d.style.display = "block";
}
$("dlg").onclick = () => ($("dlg").style.display = "none");
function splat(e, d) {
  splats.push({ x: e.x, y: e.y, d, e: performance.now() + 900 });
}
function tryDodge() {
  const now = performance.now();
  if (!started || paused || $("death").style.display == "flex") return false;
  if (P.dodge && now < P.dodge.cooldown) {
    msg("Dodge is recharging.");
    return false;
  }
  const dirs = [[0, 1], [0, -1], [-1, 0], [1, 0]];
  const [dx, dy] = dirs[P.d] || [0, 1];
  let nx = P.x, ny = P.y, moved = 0;
  for (let i = 0; i < 2; i++) {
    if (bl(nx + dx, ny + dy)) break;
    nx += dx; ny += dy; moved++;
  }
  if (!moved) {
    msg("No room to dodge!");
    return false;
  }
  P.path = [];
  P.act = null;
  P.x = nx; P.y = ny;
  P.dodge = { until: now + 420, cooldown: now + 1450, dx, dy };
  playerMoved(moved);
  fx.push(
    { t: "ring", x: P.x, y: P.y, s: now, e: now + 360, c: "#8deaff", rad: 19 },
    { t: "burst", x: P.x - dx, y: P.y - dy, s: now, e: now + 260, c: "#b9f5ff", r: 0.4 }
  );
  sfx("whoosh");
  dirty = true;
  return true;
}
function hurt(d) {
  if (P.dodge && performance.now() < P.dodge.until) {
    sfx("block");
    fx.push({ t: "ring", x: P.x, y: P.y, s: performance.now(), e: performance.now() + 220, c: "#8deaff", rad: 14 });
    return;
  }
  d = Math.max(0, d - Math.floor(DEF() / 4));
  P.hp -= d;
  if (d > 0 && cls == "Warrior") gainRage(Math.min(15, 5 + d));
  if (d > 0) P.hurtAt = performance.now();
  sfx(d > 0 ? "hurt" : "block");
  P.hb = performance.now() + 3000;
  splat(P, d);
  if (P.hp <= 0) {
    die();
  }
}
function die() {
  msg("You perished...");
  // Keep all death loot in the gravestone; if one already exists, add to it.
  if (!grave) {
    grave = {
      x: P.x,
      y: P.y,
      items: [],
      t: tickN
    };
  }
  inv.forEach((item, i) => {
    if (item) {
      grave.items.push({ n: item.n, q: item.q });
      inv[i] = null;
    }
  });
  dirty = true;
  // Teleport player to spawn
  inMine = false;
  mineReturn = null;
  P.x = P.ox = SPAWN.x;
  P.y = P.oy = SPAWN.y;
  P.path = [];
  P.act = null;
  P.hp = maxHp();
  P.en = 100;
  ens.forEach((e) => (e.tg = null));
  // Show death modal with grave info
  $("deathCause").textContent = " perished. Your items are at the gravestone marked on the map.";
  $("deathItems").innerHTML = "";
  // List items in grave
  if (grave.items.length > 0) {
    const itemsList = grave.items.map((it) => `<span>${it.q > 1 ? it.q + "× " : ""}${it.n}</span>`).join(" ");
    $("deathItems").innerHTML = `<div>Items at death location: ${itemsList}</div>`;
  }
  $("death").style.display = "flex";
  sfx("death");
  save();
}
/* Basic weapon attacks are animated: the hit (damage, splat, XP) lands at the exact
 * moment the blade connects or the arrow/bolt reaches the target. Timings in ms. */
const ATK_ANIM = {
  swing: { dur: 440, hit: 0.5 },
  thrust: { dur: 380, hit: 0.45 },
  bash: { dur: 460, hit: 0.5 },
  shoot: { draw: 420, recover: 220, speed: 85 },
  crossbow: { draw: 170, recover: 220, speed: 60 },
  cast: { draw: 330, recover: 260, speed: 80 },
};
function attackKind(w, dist) {
  if (w == "bow") return "shoot";
  if (w == "xbow") return "crossbow";
  if (MAGW(w)) return dist <= 1 ? "bash" : "cast";
  if (w == "spear" || w == "dagger") return "thrust";
  return "swing";
}
function startAttack(t, d, W_) {
  const now = performance.now(),
    w = P.w,
    dist = Math.abs(P.x - t.x) + Math.abs(P.y - t.y),
    kind = attackKind(w, dist),
    A = ATK_ANIM[kind];
  let rel, hit, end;
  if (A.speed) {
    rel = now + A.draw;
    hit = rel + Math.max(160, Math.hypot(t.x - P.x, t.y - P.y) * A.speed);
    end = Math.max(hit, rel + A.recover);
  } else {
    rel = hit = now + A.dur * A.hit;
    end = now + A.dur;
  }
  P.atk = { kind, w, t, d, s: now, rel, hit, e: end, tx: t.x, ty: t.y, x: P.x, y: P.y };
  if (kind == "shoot" || kind == "crossbow") sfx("bowdraw");
  else if (!A.speed) setTimeout(() => sfx("whoosh"), Math.max(0, hit - now - 110));
  if (A.speed) {
    setTimeout(() => {
      if (kind == "cast") sfx(w == "wand" ? "magic" : "zap");
      else sfx("twang");
      shots.push({ kind: kind == "cast" ? "orb" : kind == "crossbow" ? "bolt" : "arrow", w, t, s: rel, e: hit, miss: !d, sx: P.x, sy: P.y, tx: t.x, ty: t.y, r: R() });
    }, rel - now);
  } else
    setTimeout(() => {
      const ty = w == "sword" ? "hack" : w == "mace" || kind == "bash" ? "blunt" : "stab";
      sfx(ty, d > 0);
    }, hit - now);
  setTimeout(() => landHit(t, d, W_, kind), hit - now);
}
function landHit(t, d, W_, kind) {
  if (t.dead) return;
  const n = performance.now(),
    dx = Math.sign(t.x - P.x),
    dy = Math.sign(t.y - P.y),
    magic = MAGW(P.w) && kind != "bash",
    ranged = !!ATK_ANIM[kind].speed;
  t.hp -= d;
  t.hb = n + 3000;
  splat(t, d);
  provoke(t);
  if (ranged && !magic) sfx(d ? "arrowhit" : "whoosh");
  if (d) {
    t.sh = n + 150;
    t.kb = { e: n + 180, dx, dy };
    if (kind == "swing" || kind == "bash" || kind == "thrust")
      fx.push({ t: "cut", x: t.x, y: t.y, s: n, e: n + 220, c: "#fff", a: Math.atan2(dy, dx) + (kind == "thrust" ? 0 : Math.PI / 2) });
    if (kind == "shoot" || kind == "crossbow")
      fx.push({ t: "stick", x: t.x, y: t.y, s: n, e: n + 450, a: Math.atan2(t.y - P.y, t.x - P.x) });
    fx.push({ t: "burst", x: t.x, y: t.y, s: n, e: n + 350, c: magic ? "#c07bff" : "#d22", r: Math.random() });
    if (magic) fx.push({ t: "ring", x: t.x, y: t.y, s: n, e: n + 300, c: "#d9b3ff", rad: 12 });
    awardCombatXp(W_.sk, d);
    if (cls == "Warrior") gainRage(10);
  } else {
    t.dodge = { e: n + 220, dx: dy ? 1 : 0, dy: dx ? -1 : 0 };
    fx.push({ t: "ring", x: t.x, y: t.y, s: n, e: n + 250, c: "#aaa", rad: 8 });
  }
  if (ranged || d) dirty = true;
  killCheck(t);
}
function skillFx(t, i) {
  const n = performance.now(),
    k = cls;
  if (k == "Mage") sfx("magic");
  setTimeout(
    () =>
      sfx(k == "Warrior" ? "hack" : k == "Ranger" ? "stab" : i == 1 ? "boom" : i == 2 ? "zap" : "magic", 1),
    350,
  );
  const C = k == "Warrior" ? "#ffb040" : k == "Ranger" ? "#7f7" : ["#6cf", "#f60", "#c07bff"][i];
  fx.push({ t: "cast", x: P.x, y: P.y, s: n, e: n + 500, c: C });
  if (k == "Warrior" && i == 2) {
    fx.push({ t: "ring", x: P.x, y: P.y, s: n + 100, e: n + 700, c: "#4f4", rad: 30 });
    return;
  }
  const s = n + 350;
  if (k == "Warrior")
    fx.push(
      { t: "slash", x: t.x, y: t.y, s, e: s + 260, c: C },
      { t: "ring", x: t.x, y: t.y, s, e: s + 300, c: C, rad: 14 + i * 8 },
    );
  else
    fx.push(
      { t: "burst", x: t.x, y: t.y, s, e: s + 450, c: C, r: Math.random() },
      { t: "ring", x: t.x, y: t.y, s, e: s + 400, c: C, rad: 12 + i * 14 },
    );
  setTimeout(() => {
    t.sh = performance.now() + 200;
  }, 350);
}
/* ==========================================================================
 * 33. GATHERING, COOKING, FARMING & ATTACK LOOP
 * Resolves the current action each time the player reaches its target.
 * ========================================================================== */
function work(a) {
  const t = a.t,
    k = a.k;
  if (t && t.x != null && (t.x != P.x || t.y != P.y)) {
    const dx = t.x - P.x,
      dy = t.y - P.y;
    P.d = Math.abs(dy) >= Math.abs(dx) ? (dy > 0 ? 0 : 1) : dx < 0 ? 2 : 3;
  }
  if (k == "take") {
    P.act = null;
    const i = gd.indexOf(t);
    if (i < 0) return;
    if (add(t.n, t.q)) {
      gd.splice(i, 1);
      msg("You pick up " + (t.q > 1 ? t.q + " " : "") + t.n.toLowerCase() + ".");
      sfx(t.n == "Coins" ? "coins" : "pickup");
    } else msg("Your bag is too full.");
    return;
  }
  if (k == "loot") {
    P.act = null;
    if (!grave || t !== grave) return;
    let added = 0;
    grave.items = grave.items.filter((it) => {
      if (add(it.n, it.q)) {
        added += it.q;
        return false;
      }
      return true;
    });
    if (added > 0) {
      msg(`You recovered ${added} item${added > 1 ? "s" : ""} from the grave.`, 1);
    }
    if (grave.items.length == 0) {
      grave = null;
    } else {
      msg(added ? "Some items remain; make room and return to the gravestone." : "Your inventory is full; items remain at the gravestone.", 1);
    }
    dirty = true;
    save();
    return;
  }
  if (k == "play") {
    P.act = null;
    if (!t || !t.fun) return;
    msg(t.funMessage);
    const now = performance.now();
    fx.push(
      { t: "burst", x: t.x, y: t.y, s: now, e: now + 650, c: t.fun, r: R() },
      { t: "ring", x: t.x, y: t.y, s: now, e: now + 550, c: t.fun, rad: 16 },
    );
    return;
  }
  if (k == "talk") {
    P.act = null;
    t.role == "shop"
      ? openShop(t)
      : t.role == "bank"
        ? openBank(t)
        : t.role == "trainer"
          ? openTrainer(t)
          : t.role == "mine"
            ? showMine()
            : dialog(t);
    return;
  }
  if (k == "smith") {
    P.act = null;
    openSmithing(t.type);
    return;
  }
  if (k == "craft") {
    P.act = null;
    openCrafting();
    return;
  }
  if (k == "mine") {
    P.act = null;
    t.type == "mineExit" ? leaveMine() : enterMine();
    return;
  }
  if (k == "plot") {
    P.act = null;
    if (!t.st) {
      const i = inv.findIndex((x) => x && x.n == "Seeds");
      if (i < 0) msg("You need seeds. Buy some at a store.");
      else {
        inv[i].q--;
        if (!inv[i].q) inv[i] = null;
        t.st = 1;
        t.g = tickN;
        dirty = true;
        msg("You plant some seeds.");
        addXp("Farming", 10);
      }
    } else if (tickN - t.g >= GROW) {
      const n = 3 + Math.floor(R() * 3) + (gear.sickle >= 0 ? 2 + gear.sickle : 0);
      add("Potato", n);
      t.st = 0;
      msg("You harvest " + n + " potatoes.");
      rollBonus("plot", 0);
      addXp("Farming", 30);
    } else msg("The potatoes are still growing.");
    return;
  }
  if (k == "forage") {
    if (full()) {
      msg("Your bag is too full.");
      P.act = null;
      return;
    }
    if (++a.w < 2) return;
    a.w = 0;
    if (R() > Math.min(0.9, 0.45 + lv("Farming") * 0.025) || !rollYield(t.item)) return;
    if (add(t.item)) {
      msg("You gather some " + t.item.toLowerCase() + ".");
      addXp("Farming", t.xp);
      t.alive = false;
      t.rt = tickN + 18;
      P.act = null;
    }
    return;
  }
  if (k == "attack") {
    if (P.cd > 0) {
      P.cd--;
      return;
    }
    const W_ = WP[P.w],
      am = AM[P.w];
    if (am && count(am) < 1) {
      msg("You are out of " + am.toLowerCase() + "! Buy more at a store.");
      P.act = null;
      return;
    }
    if (am) use(am);
    const A = lv(W_.sk);
    P.cd = W_.cd;
    const mh = 1 + Math.floor(A / 4) + gear[P.w] * 2 + W_.b,
      d = R() < 0.5 + A * 0.01 + gear[P.w] * 0.05 ? Math.floor(R() * (mh + 1)) : 0;
    startAttack(t, d, W_);
    return;
  }
  if (k == "range") {
    if (++a.w < 3) return;
    a.w = 0;
    const i = inv.findIndex((x) => x && x.n.startsWith("Raw"));
    if (i < 0) {
      msg("You have nothing left to cook.");
      P.act = null;
      return;
    }
    const b = R() < Math.max(0.05, 0.5 - lv("Cooking") * 0.03);
    const rw = inv[i].n;
    inv[i] = { n: b ? rw.replace("Raw", "Burnt") : rw.replace("Raw", "Cooked"), q: 1 };
    dirty = true;
    sfx("sizzle");
    if (b) msg("Oops! You burn the " + rw.replace("Raw ", "").toLowerCase() + ".");
    else {
      msg("You cook the " + rw.replace("Raw ", "").toLowerCase() + ".");
      addXp("Cooking", CX[rw] || 30);
    }
    return;
  }
  if (full()) {
    msg("Your bag is too full.");
    P.act = null;
    return;
  }
  const w = { tree: 4, rock: 3, fish: 4 }[k];
  if (k == "tree") sfx("chop");
  else if (k == "rock") sfx("mine");
  if (++a.w < w) return;
  a.w = 0;
  const s = { tree: "Woodcutting", rock: "Mining", fish: "Fishing" }[k],
    g_ = { tree: "axe", rock: "pick", fish: "rod" }[k];
  const d = k == "tree" ? TR[t.tier] : k == "rock" ? RK[t.tier] : null;
  const miningLevel = t.miningLevel || (d && d.l);
  if (R() > Math.max(0.1, 0.3 + (lv(s) - (miningLevel || 1)) * 0.015 + (gear[g_] - (d ? d.t : 0)) * 0.1)) return;
  if (k == "tree") {
    sfx("woodget");
    if (!rollYield(d.it)) {
      msg("You chop away but the wood is unusable.");
      return;
    }
    giveDrop(d.it, 1, false);
    msg("You get some " + d.it.toLowerCase() + ".");
    addXp(s, d.xp);
    rollBonus("tree", d.t);
    if (R() < 0.2) {
      sfx("treefall");
      t.alive = false;
      t.rt = tickN + 18 + d.t * 8;
      P.act = null;
    }
  }
  if (k == "rock") {
    if (!rollYield(t.mineOre || d.it)) {
      msg("You chip away but find no ore this time.");
      return;
    }
    // Check if mining in a mine
    if (inMine) {
      const mineOre = t.mineOre || d.it;
      giveDrop(mineOre, 1 + Math.floor(R() * 2), false);
      msg("You mine some " + mineOre.toLowerCase() + ".");
      sfx("rockbreak");
      addXp(s, t.mineXp || d.xp);
      rollBonus("rock", d.t);
      t.alive = false;
      t.rt = tickN + 12 + d.t * 5;
      if (R() < 0.3) {
        const spot = D.slice(0, 4)
          .map(([dx, dy]) => [P.x + dx, P.y + dy])
          .find(([x, y]) => !bl(x, y) && !ens.some((q) => !q.dead && q.x == x && q.y == y));
        if (spot) {
          spawnRat(...spot);
          msg("A rat scurries out of the shadows!");
        }
      }
    } else {
      // Normal rock mining
      const mineOre = t.mineOre || d.it;
      giveDrop(mineOre, 1, false);
      msg("You mine some " + mineOre.toLowerCase() + ".");
      sfx("rockbreak");
      addXp(s, t.mineXp || d.xp);
      rollBonus("rock", d.t);
      t.alive = false;
      t.rt = tickN + 9 + d.t * 5;
    }
    P.act = null;
  }
  if (k == "fish") {
    const maxTier = t.maxTier === undefined ? 3 : t.maxTier,
      el = FSH.filter((z) => lv(s) >= z.l && gear.rod >= z.t && z.t <= maxTier);
    let f = el[el.length - 1];
    while (el.length > 1 && R() < 0.4) {
      el.pop();
      f = el[el.length - 1];
    }
    if (!rollYield("Raw " + f.n)) {
      msg("A fish nibbles, but it slips away.");
      return;
    }
    giveDrop("Raw " + f.n, 1, false);
    P.catchAt = performance.now();
    msg("You catch a " + f.n + ".");
    sfx("splash");
    addXp(s, f.xp);
    rollBonus("fish", f.t);
  }
}
/* ==========================================================================
 * 34. GAME TICK (movement, AI, respawns)
 * Runs every 600 ms: player movement, enemy AI, regen and respawns.
 * ========================================================================== */
function tick() {
  if (!started || paused) return;
  tickN++;
  if (tickN % 20 == 0) save();
  P.ox = P.x;
  P.oy = P.y;
  const a = P.act;
  if (a && a.k == "take") {
    const t = a.t;
    if (!gd.includes(t)) P.act = null;
    else if (P.x == t.x && P.y == t.y) work(a);
    else {
      const p = findPath(P, (x, y) => x == t.x && y == t.y);
      if (!p) {
        msg("I can’t reach that!");
        P.act = null;
      } else {
        P.path = p;
        step(P, spd());
      }
    }
  } else if (a) {
    const t = a.t;
    if (t.alive === false || t.dead) P.act = null;
    else if (Math.abs(P.x - t.x) + Math.abs(P.y - t.y) <= rg(a)) work(a);
    else {
      const p = findPath(P, rg(a) > 1 ? goalR(t, rg(a)) : goalAdj(t));
      if (!p) {
        msg("I can’t reach that!");
        P.act = null;
      } else {
        P.path = p;
        step(P, spd());
      }
    }
  } else step(P, spd());
  const tw = inT(P.x, P.y);
  for (const q of ens) {
    q.ox = q.x;
    q.oy = q.y;
    if (q.dead) {
      if (tickN >= q.rt) {
        q.dead = false;
        q.hp = ET[q.t].hp;
        q.x = q.hx;
        q.y = q.hy;
        q.ox = q.x;
        q.oy = q.y;
      }
      continue;
    }
    const d = Math.abs(P.x - q.x) + Math.abs(P.y - q.y);
    if (q.tg && (d > 12 || tw || !!inMine != inCaveBounds(q.x, q.y))) q.tg = null;
    if (!q.tg && !tw && d <= 5 && enemyCanAggro(q.t)) provoke(q);
    if (q.tg) {
      if (ET[q.t].magic && d > 1 && d <= 6) {
        if (q.cd > 0) q.cd--;
        else {
          q.cd = 4;
          const now = performance.now(),
            spell = ET[q.t].spell,
            damage = Math.floor(R() * Math.max(1, ET[q.t].mh + 1));
          fx.push({ t: "cast", x: q.x, y: q.y, s: now, e: now + 450, c: spell });
          const targetX = P.x, targetY = P.y;
          proj.push({ a: q.x, b: q.y, c: targetX, d: targetY, e: now + 350, col: spell });
          setTimeout(() => {
            const before = P.hp;
            hurt(damage);
            if (P.hp < before) splats.push({ x: P.x, y: P.y, d: damage, e: performance.now() + 900 });
          }, 350);
        }
      } else if (d <= 1) {
        if (CFG.auto && !P.act && !P.path.length) P.act = { k: "attack", t: q, w: 0 };
        if (q.cd > 0) q.cd--;
        else {
          q.cd = 3;
          q.lg = performance.now();
          if (Math.random() < 0.5) sfx(creatureVoice(q.t));
          const hitMax = ET[q.t].mh || ET[q.t].rmh || 1;
          setTimeout(() => {
            if (!q.dead && q.tg) hurt(R() < 0.45 - DEF() * 0.02 ? Math.floor(R() * (hitMax + 1)) : 0);
          }, 130);
        }
      } else {
        const p = findPath(q, goalAdj(P), 600);
        if (p) {
          q.path = p;
          step(q, 1);
        }
      }
    } else if (Math.abs(q.x - q.hx) > 5 || Math.abs(q.y - q.hy) > 5) {
      if (R() < 0.5) {
        const p = findPath(q, (x, y) => Math.abs(x - q.hx) <= 2 && Math.abs(y - q.hy) <= 2, 900);
        if (p) {
          q.path = p;
          step(q, 1);
        } else {
          q.hx = q.x;
          q.hy = q.y;
        }
      }
    } else if (q.t == "rat") {
      // Rat AI: wander randomly
      if (R() < 0.05) {
        const [dx, dy] = D[Math.floor(R() * 4)],
          nx = q.x + dx,
          ny = q.y + dy;
        if (!bl(nx, ny)) {
          q.x = nx;
          q.y = ny;
        }
      }
    } else if (R() < 0.15) {
      const [dx, dy] = D[Math.floor(R() * 4)],
        nx = q.x + dx,
        ny = q.y + dy;
      if (!bl(nx, ny) && Math.abs(nx - q.hx) < 5 && Math.abs(ny - q.hy) < 5) {
        q.x = nx;
        q.y = ny;
      }
    }
  }
  for (const n of npcs) {
    n.ox = n.x;
    n.oy = n.y;
    if (tickN >= n.taskUntil && n.taskPool.length > 1) {
      const next = n.taskPool.filter((task) => task != n.task);
      n.task = next[Math.floor(R() * next.length)];
      n.taskUntil = tickN + 3 + Math.floor(R() * 7);
    }
    if (!n.fixed && R() < 0.12) {
      const [dx, dy] = D[Math.floor(R() * 4)],
        nx = n.x + dx,
        ny = n.y + dy;
      if (!bl(nx, ny) && Math.abs(nx - n.hx) < 4 && Math.abs(ny - n.hy) < 3) {
        n.x = nx;
        n.y = ny;
        n.d = dy > 0 ? 0 : dy < 0 ? 1 : dx < 0 ? 2 : 3;
      }
    }
  }
  objs.forEach((o) => {
    if (!o.alive && tickN >= o.rt) o.alive = true;
  });
  P.en = Math.min(100, P.en + 0.7);
  if (P.rage > 0 && performance.now() - (P.rageAt || 0) > 5000) {
    P.rage = Math.max(0, P.rage - 3);
    dirty = true;
  }
  for (let i = gd.length - 1; i >= 0; i--) if (tickN >= gd[i].u) gd.splice(i, 1);
  if (tickN % 10 == 0) {
    if (P.hp < maxHp()) {
      P.hp++;
      dirty = true;
    }
    if (P.mp < lv("Magic") * 2 + 10) {
      P.mp++;
      dirty = true;
    }
  }
  for (let i = 0; i < 3; i++)
    if (P_SK[i] > 0) {
      P_SK[i]--;
      dirty = true;
    }
  last = performance.now();
}
setInterval(tick, 600);
