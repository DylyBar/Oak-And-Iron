/* Oak & Iron - Side panel, shop and bank, character creation (sections 35-37). Loaded in order by index.html. */

/* ==========================================================================
 * 35. SIDE PANEL UI (bag, skills, gear, quests)
 * Builds the inventory grid, skill list, gear panel and quest tab.
 * ========================================================================== */
function ui() {
  $("inv").innerHTML = inv
    .map(
      (it, i) =>
          `<div class="s${it ? " r-" + rarityId(it.n) : ""}" data-i="${i}" title="${it ? it.n + " (" + rarityOf(it.n).name + ")" : ""}" draggable="${it ? "true" : "false"}">${it ? IC[it.n] + (it.q > 1 ? "<i>" + it.q + "</i>" : "") : ""}</div>`,
    )
    .join("");
  $("sk").innerHTML =
    '<div class="k"><span>Combat level</span><b>' +
    cmb() +
    "</b></div>" +
    SK.map(
      (s) => {
        const level = lv(s),
          next = level >= MAX_SKILL_LEVEL ? "Maximum level" : `${Math.max(0, Math.ceil(xpt[level + 1] - xp[s]))} xp to level ${level + 1}`;
        return `<div class="k" title="${Math.floor(xp[s])} xp · ${next}"><span>${s}</span><b>${level}</b></div>`;
      },
    ).join("") +
    '<div class="k"><span>Total level</span><b>' +
    SK.reduce((a, s) => a + lv(s), 0) +
    "</b></div>";
  $("gr").innerHTML =
    '<div class="k"><span>Defence</span><b>' +
    DEF() +
    "</b></div>" +
    Object.keys(gear)
      .filter((k) => gear[k] >= 0)
      .map(
        (k) =>
          `<div class="k"><span>${gic(k, gear[k])} ${ARMOR_CLASS[k] ? gearName(k) : TN[gear[k]]}</span>${gearClass(k) && !canWear(k) ? `<small title="${classLock(k)}">${gearClass(k)} only</small>` : WP[k] ? (P.w == k ? "<b>Equipped</b>" : `<button data-e="${k}">Equip</button>`) : ARMOR_CLASS[k] ? "<b>Worn</b>" : ""}</div>`,
      )
      .join("");
  $("qu").innerHTML = QS.map((q) => {
    const s = qs[q.id],
      h = q.t == "kill" ? s.k : count(q.i);
    const progress = s.s == 0 ? "Available · Talk to " + q.g : s.s == 2 ? "Complete ✓" : Math.min(h, q.need) + "/" + q.need + " " + (q.t == "kill" ? "defeated" : q.i);
    return `<div class="k quest-track${trackedQuest == q.id ? " tracked" : ""}${s.s == 2 ? " quest-done" : ""}" data-quest="${q.id}" style="display:block"><b>${q.n}</b><p>${q.d}</p><div class="quest-progress">${progress}</div><small>Reward: ${q.c} coins · ${q.x[1]} ${q.x[0]} XP</small><br><small>${trackedQuest == q.id ? "★ Tracking" : "Track quest"}</small></div>`;
  }).join("");
}
function tab(n) {
  $("side").classList.remove("utility", "skills-view", "quests-view");
  $("skillsPanel").style.display = "none";
  $("questsPanel").style.display = "none";
  $("inv").style.display = n == 1 ? "grid" : "none";
  $("gr").style.display = n == 2 ? "block" : "none";
  $("t1").className = n == 1 ? "on" : "";
  $("t3").className = n == 2 ? "on" : "";
}
$("t1").onclick = () => tab(1);
$("t3").onclick = () => tab(2);
$("gr").onclick = (e) => {
  const k = e.target.dataset.e;
  if (k && !canWear(k)) msg(classLock(k) + ".");
  else if (k) {
    P.w = k;
    msg("You equip your " + GN[k].toLowerCase() + ".");
    sfx("equip");
    dirty = true;
  }
};
function showM(x, y, title, o) {
  const m = $("m");
  m.innerHTML = "";
  const h = document.createElement("div");
  h.textContent = title;
  m.appendChild(h);
  o.forEach((p) => {
    const d = document.createElement("div");
    d.textContent = p.l;
    d.onclick = () => {
      hideM();
      p.f && p.f();
    };
    m.appendChild(d);
  });
  m.style.display = "block";
  m.style.left = Math.min(x, innerWidth - 150) + "px";
  m.style.top = Math.min(y, innerHeight - 120) + "px";
}
const hideM = () => ($("m").style.display = "none");
document.addEventListener("mousedown", (e) => {
  if (!$("m").contains(e.target)) hideM();
});
const invO = (i) => {
  const it = inv[i];
  if (!it) return [];
  const o = [];
  if (FOOD[it.n]) o.push({ l: "Eat", f: () => eat(i) });
  if (POTIONS[it.n]) o.push({ l: "Drink", f: () => useItem(it.n) });
  o.push({ l: "Add to toolbar", f: () => hotbarAdd(it.n) });
  o.push(
    {
      l: "Drop",
      f: () => {
        gdrop(it.n, it.q, P.x, P.y);
        inv[i] = null;
        dirty = true;
        sfx("drop");
        msg("You drop the " + it.n.toLowerCase() + ". It will vanish in 5 minutes if left on the ground.");
      },
    },
    { l: "Cancel" },
  );
  return o;
};
let invDragFrom = -1,
  ignoreInvClickUntil = 0;
$("inv").addEventListener("dragstart", (e) => {
  const slot = e.target.closest(".s");
  if (!slot || !inv[+slot.dataset.i]) {
    e.preventDefault();
    return;
  }
  invDragFrom = +slot.dataset.i;
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("text/plain", String(invDragFrom));
});
$("inv").addEventListener("dragover", (e) => {
  if (e.target.closest(".s")) e.preventDefault();
});
$("inv").addEventListener("dragenter", (e) => {
  const slot = e.target.closest(".s");
  if (slot) slot.classList.add("drag-over");
});
$("inv").addEventListener("dragleave", (e) => {
  const slot = e.target.closest(".s");
  if (slot && !slot.contains(e.relatedTarget)) slot.classList.remove("drag-over");
});
$("inv").addEventListener("drop", (e) => {
  e.preventDefault();
  const slot = e.target.closest(".s"),
    from = invDragFrom >= 0 ? invDragFrom : Number(e.dataTransfer.getData("text/plain")),
    to = slot ? +slot.dataset.i : -1;
  $("inv").querySelectorAll(".drag-over").forEach((el) => el.classList.remove("drag-over"));
  invDragFrom = -1;
  if (from < 0 || from >= inv.length || to < 0 || to >= inv.length || from == to || !inv[from]) return;
  [inv[from], inv[to]] = [inv[to], inv[from]];
  ignoreInvClickUntil = performance.now() + 500;
  dirty = true;
  save();
});
$("inv").addEventListener("dragend", () => {
  invDragFrom = -1;
  $("inv").querySelectorAll(".drag-over").forEach((el) => el.classList.remove("drag-over"));
});
$("inv").addEventListener("click", (e) => {
  if (performance.now() < ignoreInvClickUntil) return;
  const s = e.target.closest(".s");
  if (!s) return;
  const o = invO(+s.dataset.i);
  if (o.length && (o[0].l == "Eat" || o[0].l == "Drink")) o[0].f();
});
$("inv").addEventListener("contextmenu", (e) => {
  e.preventDefault();
  const s = e.target.closest(".s");
  if (!s) return;
  const i = +s.dataset.i,
    o = invO(i);
  if (o.length) showM(e.clientX, e.clientY, inv[i].n, o);
});
/* ==========================================================================
 * 36. SHOP & BANK
 * Buy/sell windows and the bank deposit/withdraw interface.
 * ========================================================================== */
function openShop(n) {
  const s = $("shop");
  let h = '<div class="box"><h2>' + n.n + "’s Store</h2><p>" + IC["Coins"] + " " + count("Coins") + "</p>";
  for (const k of SHP[n.kind || "gen"].g) {
    const t = gear[k],
      lock = !canWear(k) ? `<small class="why">${gearClass(k)} only</small>` : "";
    h +=
      t < 3
        ? `<div class="k"><span>${gic(k, t + 1)} ${gearName(k, t + 1)} <small>(Lv ${REQ[t + 1]} ${SKF[k]})</small>${lock}</span><button data-b="${k}"${lock ? ' class="locked" title="' + classLock(k) + '"' : ""}>${PR[t + 1]} ${IC.Coins}</button></div>`
        : `<div class="k"><span>${gic(k, t)} ${gearName(k, t)}</span><b>MAX</b></div>`;
  }
  for (const [nm, pr, q] of SHP[n.kind || "gen"].i)
    h += `<div class="k"><span>${IC[nm]} ${nm} ×${q}</span><button data-i="${nm}">${pr} ${IC.Coins}</button></div>`;
  h += "<h3>Sell</h3>";
  for (const x in SELL) {
    const q = count(x);
    if (q)
      h += `<div class="k"><span>${IC[x]} ${x} ×${q}</span><button data-s="${x}">${q * SELL[x]} ${IC.Coins}</button></div>`;
  }
  s.innerHTML = h + '<button id="sx">Close</button></div>';
  s.style.display = "flex";
  s._n = n;
}
$("shop").onclick = (e) => {
  const b = e.target.dataset;
  if (e.target.id == "sx" || e.target == $("shop")) return ($("shop").style.display = "none");
  const bk = e.target.closest("[data-bq],[data-bd],[data-bw],[data-bda]"),
    sh = $("shop");
  if (bk && sh._n && sh._n.role == "bank") {
    const d = bk.dataset,
      amt = BANK_QTY.find((z) => z[0] == sh._bq)[1];
    if (d.bq) sh._bq = d.bq;
    else if (d.bda) {
      let c = 0;
      [...new Set(inv.filter(Boolean).map((i) => i.n))].forEach((n) => (c += bankDeposit(n, Infinity)));
      if (c) msg("You deposit your bag into the bank.");
    } else if (d.bd !== undefined) {
      const it = inv[+d.bd];
      if (it) bankDeposit(it.n, amt);
    } else if (d.bw) bankWithdraw(d.bw, amt);
    if (!d.bq) sfx("pickup");
    dirty = true;
    save();
    openBank(sh._n);
    return;
  }
  const classChoice = e.target.closest("[data-class-choice]");
  if (classChoice) {
    const trainer = $("shop")._n,
      targetClass = classChoice.dataset.classChoice;
    if (targetClass == "no") {
      $("shop").style.display = "none";
      return;
    }
    const nextClass = { warrior: "Warrior", ranger: "Ranger", mage: "Mage" }[trainer.kind];
    if (!nextClass) return;
    cls = nextClass;
    const weapon = CL[cls].w;
    if (gear[weapon] < 0) gear[weapon] = 0;
    P.w = weapon;
    P.act = null;
    P.path = [];
    P_SK.fill(0);
    msg("You are now a " + cls + ". Your levels and learned abilities are preserved.", 1);
    save();
    dirty = true;
    openTrainer(trainer);
    return;
  }
  const learnButton = e.target.closest("[data-learn-ability]");
  if (learnButton) {
    const trainer = $("shop")._n,
      abilityIndex = Number(learnButton.dataset.learnAbility),
      trainerClass = { warrior: "Warrior", ranger: "Ranger", mage: "Mage" }[trainer.kind],
      ability = CL_SKILLS[trainerClass]?.[abilityIndex];
    if (!ability || trainerClass != cls) {
      msg("This trainer teaches " + (trainerClass || "specialist") + " abilities.");
    } else if (learnedSkills[cls][abilityIndex]) {
      msg("You have already learned " + ability.n + ".");
    } else if (lv(CL[cls].s) < ability.lv) {
      msg("You need level " + ability.lv + " " + CL[cls].s + " to learn " + ability.n + ".");
    } else {
      learnedSkills[cls][abilityIndex] = true;
      msg("You learned " + ability.n + "! It is ready on your spell bar.", 1);
      save();
    }
    dirty = true;
    openTrainer(trainer);
    return;
  }
  if (b.b) {
    const k = b.b,
      p = PR[gear[k] + 1];
    if (!canWear(k)) msg(classLock(k).replace("this", "that") + ".");
    else if (gear[k] >= 3) msg("You already own the best " + GN[k].toLowerCase() + ".");
    else if (lv(SKF[k]) < REQ[gear[k] + 1])
      msg("You need level " + REQ[gear[k] + 1] + " " + SKF[k] + " for that.");
    else if (spend(p)) {
      gear[k]++;
      sfx("coins");
      sfx("equip");
      msg("You buy " + (ARMOR_TN[k] ? "and put on " : "") + aOrAn(gearName(k)) + " " + gearName(k) + ".", 1);
    } else msg("You can’t afford that.");
  }
  if (b.i) {
    const it = SHP[$("shop")._n.kind || "gen"].i.find((z) => z[0] == b.i);
    if (it) {
      if (spend(it[1])) {
        add(it[0], it[2]);
        sfx("coins");
      }
      else msg("You can’t afford that.");
    }
  }
  if (b.s) {
    let c = 0;
    inv.forEach((it, i) => {
      if (it && it.n == b.s) {
        c += it.q * SELL[b.s];
        inv[i] = null;
      }
    });
    add("Coins", c);
    msg("You sell your " + b.s.toLowerCase() + " for " + c + " coins.", 1);
  }
  if (b.s) {
    const trainer = SHP[$("shop")._n.kind];
    if (trainer) {
      const item = trainer.i.find((z) => z[0] == b.s);
      if (item) {
        const [name, price, reqLevel] = item;
        const playerLv = lv(SKF[name] || "Attack");
        if (playerLv < reqLevel) {
          msg("You need level " + reqLevel + " " + name + " to learn this ability.", 1);
        } else if (spend(price)) {
          msg("You learned " + name + "!", 1);
        } else msg("You can’t afford that.");
      }
    }
  }
  dirty = true;
  const nn = $("shop")._n;
  nn.role == "bank" ? openBank(nn) : openShop(nn);
};
/* The bank is one shared vault: every banker on the island opens the same storage. */
const BANK_SLOTS = 96,
  BANK_QTY = [
    ["1", 1],
    ["5", 5],
    ["10", 10],
    ["All", Infinity],
  ],
  fmtQ = (q) => (q >= 100000 ? Math.floor(q / 1000) + "k" : q);
function bankDeposit(n, amt) {
  amt = Math.min(amt, count(n));
  if (amt <= 0) return 0;
  if (!(n in bank) && Object.keys(bank).length >= BANK_SLOTS) {
    msg("Your bank is full.");
    return 0;
  }
  consumeItem(n, amt);
  bank[n] = (bank[n] || 0) + amt;
  return amt;
}
function bankWithdraw(n, amt) {
  amt = Math.min(amt, bank[n] || 0);
  let got = 0;
  if (STK.includes(n)) {
    if (amt > 0 && add(n, amt)) got = amt;
  } else while (got < amt && add(n)) got++;
  if (got) {
    bank[n] -= got;
    if (!bank[n]) delete bank[n];
  } else if (amt > 0) msg("Your bag is full.");
  return got;
}
function openBank(n) {
  const s = $("shop"),
    q = s._bq || "All",
    keys = Object.keys(bank),
    slot = (attrs, name, qty) =>
      `<div class="bslot${name ? " r-" + rarityId(name) : " empty"}" ${attrs} title="${name ? name + " ×" + qty : ""}">${name ? (IC[name] || "") + (qty > 1 || STK.includes(name) ? "<i>" + fmtQ(qty) + "</i>" : "") : ""}</div>`;
  s._bq = q;
  let h = `<div class="box bank-box"><h2>${n && n.n ? n.n + "’s Bank" : "Bank"}</h2><p>One vault shared by every banker on the island · ${keys.length}/${BANK_SLOTS} slots used</p>`;
  h += '<div class="bank-qty">Amount: ' + BANK_QTY.map(([l]) => `<button data-bq="${l}"${l == q ? ' class="on"' : ""}>${l}</button>`).join("") + "</div>";
  h += '<h3>Bank <small>(click an item to withdraw)</small></h3><div class="bank-grid">';
  const cells = Math.max(14, Math.ceil(keys.length / 7) * 7);
  for (let i = 0; i < cells; i++) h += keys[i] ? slot(`data-bw="${keys[i]}"`, keys[i], bank[keys[i]]) : slot("", null);
  h += '</div><h3>Your bag <small>(click an item to deposit)</small></h3><div class="bank-grid">';
  inv.forEach((it, i) => (h += it ? slot(`data-bd="${i}"`, it.n, it.q) : slot("", null)));
  h += '</div><button data-bda="1">Deposit entire bag</button> ';
  s.innerHTML = h + '<button id="sx">Close</button></div>';
  s.style.display = "flex";
  s._n = n;
}
const SMELT_RECIPES = [
  { n: "Bronze bar", req: 1, needs: [["Copper ore", 1], ["Tin ore", 1]], xp: 6.2 },
  { n: "Iron bar", req: 15, needs: [["Iron ore", 1]], xp: 12.5 },
  { n: "Steel bar", req: 30, needs: [["Iron ore", 1], ["Coal", 2]], xp: 17.5 },
  { n: "Silver bar", req: 20, needs: [["Silver ore", 1]], xp: 13.7 },
  { n: "Gold bar", req: 40, needs: [["Gold ore", 1]], xp: 22.5 },
  { n: "Mithril bar", req: 50, needs: [["Mithril ore", 1], ["Coal", 4]], xp: 25 },
  { n: "Adamantite bar", req: 70, needs: [["Adamantite ore", 1], ["Coal", 6]], xp: 37.5 },
  { n: "Runite bar", req: 85, needs: [["Runite ore", 1], ["Coal", 8]], xp: 50 },
];
const FORGE_RECIPES = [
  { n: "Bronze sword", slot: "sword", tier: 0, req: 5, needs: [["Bronze bar", 2]], xp: 12.4 },
  { n: "Bronze helmet", slot: "helm", tier: 0, req: 5, needs: [["Bronze bar", 2]], xp: 12.4 },
  { n: "Iron sword", slot: "sword", tier: 1, req: 15, needs: [["Iron bar", 3]], xp: 37.5 },
  { n: "Iron platebody", slot: "body", tier: 1, req: 15, needs: [["Iron bar", 5]], xp: 62.5 },
  { n: "Steel sword", slot: "sword", tier: 2, req: 30, needs: [["Steel bar", 4]], xp: 70 },
  { n: "Steel shield", slot: "shield", tier: 2, req: 30, needs: [["Steel bar", 3]], xp: 52.5 },
  { n: "Mithril sword", slot: "sword", tier: 3, req: 50, needs: [["Mithril bar", 5]], xp: 125 },
  { n: "Mithril platebody", slot: "body", tier: 3, req: 50, needs: [["Mithril bar", 8]], xp: 200 },
];
const CRAFT_RECIPES = [
  { n: "Leather", out: "Leather", qty: 1, req: 1, needs: [["Cowhide", 1]], xp: 25 },
  { n: "Bowstring", out: "Bowstring", qty: 1, req: 1, needs: [["Wool", 2]], xp: 15 },
  { n: "Leather armor", slot: "leather", tier: 0, req: 10, needs: [["Leather", 3]], xp: 35 },
  { n: "Hard leather armor", slot: "leather", tier: 1, req: 20, needs: [["Leather", 5]], xp: 60 },
  { n: "Studded leather armor", slot: "leather", tier: 2, req: 35, needs: [["Leather", 6], ["Iron bar", 2]], xp: 95 },
  { n: "Dragonhide armor", slot: "leather", tier: 3, req: 50, needs: [["Leather", 10], ["Mithril bar", 2]], xp: 160 },
  { n: "Apprentice robe", slot: "robe", tier: 0, req: 5, needs: [["Wool", 6], ["Runes", 2]], xp: 30 },
  { n: "Adept robe", slot: "robe", tier: 1, req: 20, needs: [["Wool", 8], ["Runes", 10]], xp: 60 },
  { n: "Mystic robe", slot: "robe", tier: 2, req: 35, needs: [["Wool", 10], ["Runes", 25]], xp: 95 },
  { n: "Archmage robe", slot: "robe", tier: 3, req: 50, needs: [["Wool", 12], ["Runes", 50]], xp: 160 },
  { n: "Leather cowl", slot: "cowl", tier: 0, req: 8, needs: [["Leather", 2]], xp: 25 },
  { n: "Hard leather cowl", slot: "cowl", tier: 1, req: 18, needs: [["Leather", 3]], xp: 45 },
  { n: "Studded cowl", slot: "cowl", tier: 2, req: 33, needs: [["Leather", 4], ["Iron bar", 1]], xp: 75 },
  { n: "Dragonhide cowl", slot: "cowl", tier: 3, req: 48, needs: [["Leather", 6], ["Mithril bar", 1]], xp: 120 },
  { n: "Leather vambraces", slot: "vamb", tier: 0, req: 6, needs: [["Leather", 1]], xp: 20 },
  { n: "Hard leather vambraces", slot: "vamb", tier: 1, req: 16, needs: [["Leather", 2]], xp: 40 },
  { n: "Studded vambraces", slot: "vamb", tier: 2, req: 31, needs: [["Leather", 3], ["Iron bar", 1]], xp: 70 },
  { n: "Dragonhide vambraces", slot: "vamb", tier: 3, req: 46, needs: [["Leather", 5], ["Mithril bar", 1]], xp: 110 },
  { n: "Apprentice hat", slot: "hat", tier: 0, req: 3, needs: [["Wool", 3], ["Runes", 1]], xp: 20 },
  { n: "Adept hat", slot: "hat", tier: 1, req: 18, needs: [["Wool", 4], ["Runes", 5]], xp: 45 },
  { n: "Mystic hat", slot: "hat", tier: 2, req: 33, needs: [["Wool", 5], ["Runes", 12]], xp: 75 },
  { n: "Archmage hat", slot: "hat", tier: 3, req: 48, needs: [["Wool", 6], ["Runes", 25]], xp: 120 },
  { n: "Apprentice boots", slot: "mboots", tier: 0, req: 1, needs: [["Wool", 2], ["Runes", 1]], xp: 15 },
  { n: "Adept boots", slot: "mboots", tier: 1, req: 16, needs: [["Wool", 3], ["Runes", 4]], xp: 40 },
  { n: "Mystic boots", slot: "mboots", tier: 2, req: 31, needs: [["Wool", 4], ["Runes", 10]], xp: 70 },
  { n: "Archmage boots", slot: "mboots", tier: 3, req: 46, needs: [["Wool", 5], ["Runes", 20]], xp: 110 },
  { n: "Shortbow", slot: "bow", req: 5, needs: [["Bowstring", 1], ["Logs", 3]], xp: 25 },
  { n: "Feathered arrows ×15", out: "Arrows", qty: 15, req: 1, needs: [["Feathers", 5], ["Logs", 1]], xp: 12 },
  { n: "Minor health potion", out: "Minor health potion", qty: 1, req: 3, needs: [["Grimy guam", 1], ["Redberries", 2]], xp: 20 },
  { n: "Health potion", out: "Health potion", qty: 1, req: 15, needs: [["Grimy guam", 2], ["Redberries", 4]], xp: 45 },
  { n: "Greater health potion", out: "Greater health potion", qty: 1, req: 40, needs: [["Grimy guam", 4], ["Redberries", 8], ["Uncut sapphire", 1]], xp: 90 },
  { n: "Minor mana potion", out: "Minor mana potion", qty: 1, req: 5, needs: [["Grimy guam", 1], ["Runes", 2]], xp: 20 },
  { n: "Mana potion", out: "Mana potion", qty: 1, req: 20, needs: [["Grimy guam", 2], ["Runes", 6]], xp: 45 },
  { n: "Greater mana potion", out: "Greater mana potion", qty: 1, req: 45, needs: [["Grimy guam", 4], ["Runes", 15], ["Uncut emerald", 1]], xp: 90 },
  { n: "Stamina potion", out: "Stamina potion", qty: 1, req: 8, needs: [["Grimy guam", 1], ["Potato", 2]], xp: 25 },
];
const aOrAn = (w) => (/^[aeiou]/i.test(w) ? "an" : "a");
const hasMaterials = (r) => r.needs.every(([n, q]) => count(n) >= q);
const materialText = (r) => r.needs.map(([n, q]) => `${q} ${n}`).join(" + ");
const missingText = (r) =>
  r.needs
    .filter(([n, q]) => count(n) < q)
    .map(([n, q]) => `${q - count(n)} more ${n.toLowerCase()}`)
    .join(" and ");
/* Why a recipe can't be made right now (empty string = ready). Shown on the button and in chat. */
function recipeBlock(r, skill, isSmelt) {
  if (r.slot && !canWear(r.slot)) return classLock(r.slot);
  if (lv(skill) < r.req) return `Needs ${skill} level ${r.req}`;
  if (r.slot && gear[r.slot] >= (r.tier || 0) && (r.tier !== undefined || gear[r.slot] >= 0))
    return `You already have ${r.tier !== undefined ? "an equal or better" : "a"} ${GN[r.slot].toLowerCase()}`;
  if (!hasMaterials(r)) return `Need ${missingText(r)}`;
  if (!r.slot && !(STK.includes(r.out || r.n) && inv.some((i) => i && i.n == (r.out || r.n))) && !inv.includes(null) && !r.needs.some(([n, q]) => count(n) == q))
    return "Your bag is full";
  return "";
}
const recipeBtn = (r, i, key, skill, isSmelt) => {
  const why = recipeBlock(r, skill, isSmelt),
    icon = IC[r.out || r.n] || (r.slot ? gic(r.slot, r.tier !== undefined ? r.tier : 0) : "");
  return `<button class="recipe${why ? " locked" : ""}" data-${key}="${i}">${icon} ${r.n}<small>Requires ${skill} ${r.req} · ${materialText(r)} · ${r.xp} XP</small><small class="why">${why ? "Can't make yet: " + why : "Ready to make"}</small></button>`;
};
function craftRecipe(recipe) {
  const why = recipeBlock(recipe, "Crafting");
  if (why) {
    msg("You can't make that: " + why.toLowerCase() + ".");
    return;
  }
  recipe.needs.forEach(([n, q]) => consumeItem(n, q));
  sfx("craft");
  if (recipe.slot) {
    gear[recipe.slot] = recipe.tier !== undefined ? recipe.tier : Math.max(0, gear[recipe.slot]);
    msg("You craft and equip " + aOrAn(recipe.n) + " " + recipe.n.toLowerCase() + ".", 1);
  } else {
    if (!add(recipe.out, recipe.qty)) groundDrop(recipe.out, recipe.qty);
    msg("You craft " + recipe.qty + " " + recipe.out.toLowerCase() + ".", 1);
  }
  addXp("Crafting", recipe.xp);
  dirty = true;
  openCrafting();
}
function smithRecipe(recipe, isSmelt) {
  const why = recipeBlock(recipe, "Smithing", isSmelt);
  if (why) {
    msg("You can't make that: " + why.toLowerCase() + ".");
    return;
  }
  recipe.needs.forEach(([n, q]) => consumeItem(n, q));
  sfx("hammer");
  if (isSmelt) {
    if (!add(recipe.n)) groundDrop(recipe.n, 1);
    msg("You smelt a " + recipe.n.toLowerCase() + ".");
  } else {
    gear[recipe.slot] = recipe.tier;
    msg("You forge and equip a " + recipe.n.toLowerCase() + ".", 1);
  }
  addXp("Smithing", recipe.xp);
  dirty = true;
  openSmithing(isSmelt ? "furnace" : "anvil");
}
function openSmithing(type) {
  const smelting = type == "furnace",
    recipes = smelting ? SMELT_RECIPES : FORGE_RECIPES,
    panel = $("smithing");
  let html = `<div class="box"><h2>${smelting ? "Smelt Ore" : "Forge Equipment"}</h2><p>Smithing level ${lv("Smithing")} · ${Math.floor(xp.Smithing)} XP</p>`;
  recipes.forEach((r, i) => (html += recipeBtn(r, i, "recipe", "Smithing", smelting)));
  panel.innerHTML = html + '<button id="smithClose">Close</button></div>';
  panel.style.display = "flex";
  panel._smelting = smelting;
  panel._crafting = false;
}
function openCrafting() {
  const panel = $("smithing");
  let html = `<div class="box"><h2>Leatherworking, Tailoring, Fletching & Potions</h2><p>Crafting level ${lv("Crafting")} · ${Math.floor(xp.Crafting)} XP</p>`;
  CRAFT_RECIPES.forEach((r, i) => (html += recipeBtn(r, i, "craft", "Crafting")));
  panel.innerHTML = html + '<button id="smithClose">Close</button></div>';
  panel.style.display = "flex";
  panel._crafting = true;
}
$("smithing").onclick = (e) => {
  if (e.target == $("smithing") || e.target.id == "smithClose") {
    $("smithing").style.display = "none";
    return;
  }
  const craftButton = e.target.closest("[data-craft]");
  if (craftButton) {
    craftRecipe(CRAFT_RECIPES[Number(craftButton.dataset.craft)]);
    return;
  }
  const button = e.target.closest("[data-recipe]");
  if (!button) return;
  const recipes = $("smithing")._smelting ? SMELT_RECIPES : FORGE_RECIPES;
  smithRecipe(recipes[Number(button.dataset.recipe)], $("smithing")._smelting);
};
function showMine() {
  const s = $("shop");
  let h = '<div class="box"><h2>Mine</h2>';
  h += "<p>Delve into the caves to mine ore veins and watch for rats.</p>";
  h += '<button id="enterMine">Enter mine</button> <button id="sx">Close</button></div>';
  s.innerHTML = h + "";
  s.style.display = "flex";
  $("enterMine").onclick = enterMine;
}
function openTrainer(n) {
  const s = $("shop");
  const trainerClass = { warrior: "Warrior", ranger: "Ranger", mage: "Mage" }[n.kind];
  let h = `<div class="box"><h2>${n.n}’s Training</h2>`;
  if (!trainerClass) {
    h += "<p>Practice your craft at the mines, furnace, and anvil to gain Smithing experience.</p>";
  } else if (cls != trainerClass) {
    h += `<p>You are currently a ${cls}. Would you like to switch to ${trainerClass}?</p>`;
    h += `<p>Your skill levels and learned ${trainerClass} abilities will be kept.</p>`;
    h += `<button data-class-choice="yes">Yes, switch to ${trainerClass}</button> `;
    h += '<button data-class-choice="no">No, stay ' + cls + "</button>";
  } else {
    const skill = CL[trainerClass].s;
    h += `<p>${trainerClass} abilities · ${skill} level ${lv(skill)}</p>`;
    CL_SKILLS[trainerClass].slice(0, 3).forEach((ability, index) => {
      const learned = learnedSkills[trainerClass][index],
        unlocked = lv(skill) >= ability.lv,
        state = learned ? "Learned" : !unlocked ? `Requires ${skill} ${ability.lv}` : "Learn ability";
      h += `<div class="k"><span><b>${ability.n}</b><small>Level ${ability.lv} · Cooldown ${ability.cd * 0.6}s${ability.m ? ` · ${ability.m * 4} MP` : ""}</small></span><button data-learn-ability="${index}" ${learned || !unlocked ? "disabled" : ""}>${state}</button></div>`;
    });
  }
  s.innerHTML =
    h +
    (trainerClass && cls != trainerClass ? "</div>" : '<button id="sx">Close</button></div>');
  s.style.display = "flex";
  s._n = n;
}
/* ==========================================================================
 * 37. CHARACTER CREATION
 * Customisation categories, live preview and the class picker.
 * ========================================================================== */
const CAT = [
  ["Skin", "s", SKIN],
  ["Hair style", "hs", ["1", "2", "3", "4"]],
  ["Hair color", "hc", HC],
  ["Shirt", "sh", SH],
  ["Pants", "pa", PA],
];
function pv() {
  const c = $("pv").getContext("2d");
  c.clearRect(0, 0, 96, 96);
  c.imageSmoothingEnabled = false;
  c.save();
  c.scale(4, 4);
  ch(c, 0, 3, look, 0, 0);
  c.restore();
}
/* First-character guided introduction. Shown only after a fresh character is created. */
const TUTORIAL_STEPS = [
  { title: "Welcome to Oak & Iron!", body: "Your adventure begins in Oakhaven. Explore the islands, gather supplies, meet the locals, train your skills and grow stronger. This short guide shows you the basics." },
  { title: "Move and explore", body: "On a computer, click or tap a tile in the world to walk there. On a phone or tablet, tap the ground. Explore nearby paths and towns, and use the map button whenever you need help finding your way." },
  { title: "Interact with the world", body: "Click an NPC, creature, resource or object to interact with it. Right-click on desktop, or long-press on touchscreens, to open the options menu when you need a specific action." },
  { title: "Meet the townsfolk", body: "Talk to NPCs to learn about the world, find services and discover quests. Quest givers are your best guide to new areas and useful rewards." },
  { title: "Accept and track quests", body: "Open the Quests panel to review your objectives and progress. Choose a quest to track it; the map can help point you toward its target. Complete objectives and return to the quest giver for your reward." },
  { title: "Gather, craft and grow", body: "Collect resources such as trees, ore and fish. Use your supplies to support your adventure and improve your skills. Different regions contain different resources, so explore when you are ready for a challenge." },
  { title: "Combat and survival", body: "Approach an enemy and choose Attack. Watch your health and choose opponents carefully: enemy camps have different danger levels. Eat or prepare supplies when needed, and retreat if a fight is too tough." },
  { title: "Your character and gear", body: "Use the Character, Skills, Inventory and Gear controls to check your progress, manage items and equip better equipment. Training skills unlocks stronger ways to gather and fight." },
  { title: "Save and set out!", body: "Save your progress with the Save button or through Settings. Your journey is yours to shape—start with nearby quests, learn the basics, then venture farther across the archipelago. Good luck, adventurer!" }
];
let tutorialIndex = 0;
function showTutorial() {
  let modal = $("tutorial_modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "tutorial_modal";
    modal.className = "ov tutorial-overlay";
    modal.innerHTML = '<div class="box tutorial-box" role="dialog" aria-modal="true" aria-labelledby="tutorialTitle"><div class="tutorial-kicker">YOUR FIRST ADVENTURE</div><div class="tutorial-progress" id="tutorialProgress"></div><h2 id="tutorialTitle"></h2><p id="tutorialBody"></p><div class="tutorial-actions"><button id="tutorialBack">Back</button><button id="tutorialSkip">Skip</button><button id="tutorialNext">Next</button></div></div>';
    document.body.appendChild(modal);
    $("tutorialBack").onclick = () => { tutorialIndex = Math.max(0, tutorialIndex - 1); renderTutorialStep(); };
    $("tutorialNext").onclick = () => {
      if (tutorialIndex < TUTORIAL_STEPS.length - 1) { tutorialIndex++; renderTutorialStep(); }
      else finishTutorial();
    };
    $("tutorialSkip").onclick = finishTutorial;
  }
  tutorialIndex = 0;
  renderTutorialStep();
  modal.style.display = "flex";
}
function renderTutorialStep() {
  const step = TUTORIAL_STEPS[tutorialIndex];
  $("tutorialTitle").textContent = step.title;
  $("tutorialBody").textContent = step.body;
  $("tutorialProgress").textContent = `STEP ${tutorialIndex + 1} OF ${TUTORIAL_STEPS.length}`;
  $("tutorialBack").disabled = tutorialIndex === 0;
  $("tutorialNext").textContent = tutorialIndex === TUTORIAL_STEPS.length - 1 ? "Start playing" : "Next";
}
function finishTutorial() {
  const modal = $("tutorial_modal");
  if (modal) modal.style.display = "none";
  tutorialDone = true;
  save();
  msg("Tutorial complete. Your adventure awaits!", 1);
}

function buildCC() {
  $("cc").innerHTML =
    '<div class="box"><h2>Create your character</h2><canvas id="pv" width="96" height="96"></canvas><input id="nm" value="' +
    pname +
    '" maxlength="12"><div id="op"></div><div id="cl"></div><div class="row"><button id="bk">Back</button><button id="rb">Random</button><button id="go">Start</button></div></div>';
  const op = $("op");
  if (!started) {
    const cl = $("cl");
    cl.innerHTML = "<h3>Class</h3>";
    Object.keys(CL).forEach((k) => {
      const b = document.createElement("button");
      b.textContent = k;
      b.style.outline = cls == k ? "3px solid #ffd54f" : "none";
      b.onclick = () => {
        cls = k;
        [...cl.querySelectorAll("button")].forEach((x) => (x.style.outline = "none"));
        b.style.outline = "3px solid #ffd54f";
        $("cd").textContent = CL[k].d;
      };
      cl.appendChild(b);
    });
    cl.insertAdjacentHTML(
      "beforeend",
      '<p id="cd" style="font-size:12px;margin:4px">' + CL[cls].d + "</p>",
    );
  }
  CAT.forEach(([lab, key, arr]) => {
    const r = document.createElement("div");
    r.className = "row";
    r.innerHTML = '<span style="width:76px;font-size:12px;text-align:left">' + lab + "</span>";
    arr.forEach((v, i) => {
      const b = document.createElement("button");
      b.className = "sw" + (look[key] == i ? " on" : "");
      if (key == "hs") b.textContent = v;
      else b.style.background = v;
      b.onclick = () => {
        look[key] = i;
        [...r.children].forEach((c) => c.classList.remove("on"));
        b.classList.add("on");
        pv();
      };
      r.appendChild(b);
    });
    op.appendChild(r);
  });
  $("rb").onclick = () => {
    look = {
      s: Math.floor(R() * 5),
      hs: Math.floor(R() * 4),
      hc: Math.floor(R() * 6),
      sh: Math.floor(R() * 6),
      pa: Math.floor(R() * 4),
    };
    buildCC();
  };
  $("go").onclick = () => {
    pname = $("nm").value || "Hero";
    $("cc").style.display = "none";
    if (!started) {
      const c = CL[cls];
      gear[c.w] = 0;
      P.w = c.w;
      if (AM[c.w]) add(AM[c.w], 40);
      add("Seeds", 5);
      P.hp = maxHp();
      started = true;
      dirty = true;
      save();
      msg("Welcome to Oak & Iron, " + pname + "! Left-click to act, right-click for options.");
      msg(
        "Explore the archipelago: each region has different resources and creatures. Higher-tier resources and tougher enemies lie in the eastern and mountainous regions.",
      );
      if (!tutorialDone) showTutorial();
    }
  };
  $("bk").onclick = () => {
    $("cc").style.display = "none";
    if (!started) showTitle();
  };
  pv();
}
buildCC();
