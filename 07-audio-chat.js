/* Oak & Iron - Procedural audio engine, chat/XP helpers, NPC dialog data (sections 24-26). Loaded in order by index.html. */

/* ==========================================================================
 * 24. PROCEDURAL AUDIO ENGINE
 * Buffer-noise and tone synthesis behind sfx() / sfxW().
 * ========================================================================== */
function noise(d, fr, q, v, ty, dl = 0) {
  const n = Math.floor(actx.sampleRate * d),
    b = actx.createBuffer(1, n, actx.sampleRate),
    a = b.getChannelData(0);
  for (let i = 0; i < n; i++) a[i] = (Math.random() * 2 - 1) * (1 - i / n);
  const so = actx.createBufferSource(),
    fl = actx.createBiquadFilter(),
    gn = actx.createGain();
  so.buffer = b;
  fl.type = ty || "bandpass";
  fl.frequency.value = fr;
  fl.Q.value = q;
  gn.gain.value = v;
  so.connect(fl);
  fl.connect(gn);
  gn.connect(MG);
  so.start(actx.currentTime + dl);
}
function tone(ty, f1, f2, d, v, dl = 0) {
  const ct = actx.currentTime + dl,
    o = actx.createOscillator(),
    gn = actx.createGain();
  o.type = ty;
  o.frequency.setValueAtTime(f1, ct);
  o.frequency.exponentialRampToValueAtTime(f2, ct + d);
  gn.gain.setValueAtTime(v, ct);
  gn.gain.exponentialRampToValueAtTime(0.001, ct + d);
  o.connect(gn);
  gn.connect(MG);
  o.start(ct);
  o.stop(ct + d);
}
function sfx(t, hit) {
  if (!actx || !MG || !snd_on) return;
  if (t == "hack") {
    noise(0.12, 2200, 1.2, 0.5);
    tone("sawtooth", 320, 90, 0.12, 0.12);
    if (hit) {
      tone("square", 1400, 700, 0.06, 0.06, 0.04);
      noise(0.07, 900, 2, 0.3, "lowpass");
    }
  } else if (t == "stab") {
    noise(0.08, 3500, 0.8, 0.4, "highpass");
    tone("triangle", 500, 150, 0.08, 0.1);
    if (hit) tone("square", 900, 500, 0.05, 0.05, 0.03);
  } else if (t == "blunt") {
    noise(0.1, 400, 0.8, 0.5, "lowpass");
    tone("sine", 140, 45, 0.18, 0.3);
  } else if (t == "magic") {
    [0, 1, 2, 3].forEach((i) => tone("sine", 700 + i * 330, 900 + i * 400, 0.25, 0.06, i * 0.045));
    tone("triangle", 200, 1400, 0.3, 0.05);
  } else if (t == "zap") {
    tone("square", 900, 200, 0.2, 0.07);
    tone("sawtooth", 1500, 300, 0.12, 0.04, 0.05);
    noise(0.1, 5000, 1, 0.1, "highpass");
  } else if (t == "boom") {
    tone("sine", 160, 35, 0.4, 0.4);
    noise(0.3, 300, 0.7, 0.4, "lowpass");
  } else if (t == "whoosh") {
    noise(0.16, 1200, 0.6, 0.22);
    noise(0.1, 2600, 1.5, 0.12, "bandpass", 0.05);
  } else if (t == "bowdraw") {
    tone("sawtooth", 70, 120, 0.38, 0.035);
    noise(0.3, 1800, 6, 0.05);
  } else if (t == "twang") {
    tone("triangle", 260, 120, 0.22, 0.14);
    tone("sine", 520, 300, 0.12, 0.05);
    noise(0.12, 4200, 1, 0.12, "highpass");
  } else if (t == "arrowhit") {
    noise(0.06, 700, 1.2, 0.4, "lowpass");
    tone("square", 220, 90, 0.06, 0.06);
  } else if (t == "chop") {
    noise(0.09, 550, 1, 0.6, "lowpass");
    tone("triangle", 190, 70, 0.12, 0.22);
    noise(0.05, 3000, 2, 0.15, "bandpass", 0.02);
  } else if (t == "woodget") {
    noise(0.18, 1500, 3, 0.25, "bandpass");
    tone("triangle", 330, 160, 0.15, 0.08, 0.04);
  } else if (t == "treefall") {
    tone("sawtooth", 140, 60, 0.6, 0.05);
    noise(0.5, 900, 4, 0.12, "bandpass");
    tone("sine", 90, 30, 0.5, 0.45, 0.55);
    noise(0.45, 260, 0.8, 0.5, "lowpass", 0.55);
  } else if (t == "mine") {
    tone("square", 1700, 1250, 0.07, 0.07);
    tone("triangle", 2600, 2300, 0.22, 0.06);
    noise(0.06, 5000, 1, 0.2, "highpass");
    noise(0.18, 500, 0.8, 0.25, "lowpass", 0.04);
  } else if (t == "rockbreak") {
    noise(0.4, 350, 0.7, 0.55, "lowpass");
    [0, 1, 2, 3].forEach((i) => noise(0.05, 1800 + i * 400, 3, 0.12, "bandpass", 0.08 + i * 0.07));
    tone("sine", 110, 40, 0.3, 0.25);
  } else if (t == "splash") {
    noise(0.35, 1400, 0.7, 0.35);
    noise(0.2, 3500, 1, 0.12, "highpass", 0.08);
    tone("sine", 600, 1100, 0.08, 0.04, 0.02);
  } else if (t == "door") {
    tone("sawtooth", 180, 260, 0.28, 0.04);
    tone("sawtooth", 260, 150, 0.22, 0.03, 0.26);
    noise(0.12, 300, 0.8, 0.45, "lowpass", 0.42);
    tone("sine", 95, 50, 0.15, 0.3, 0.42);
  } else if (t == "step") {
    const f = { grass: [900, 0.06], dirt: [600, 0.09], wood: [420, 0.14], stone: [1500, 0.08] }[hit] || [700, 0.08];
    noise(0.05, f[0], 1.2, f[1], "bandpass");
    if (hit == "wood") tone("sine", 160, 90, 0.05, 0.05);
  } else if (t == "pickup") {
    tone("triangle", 520, 780, 0.07, 0.07);
    noise(0.05, 2500, 2, 0.06, "bandpass");
  } else if (t == "coins") {
    [0, 1, 2].forEach((i) => {
      tone("square", 2400 + i * 350, 2100 + i * 300, 0.05, 0.035, i * 0.06);
      tone("sine", 3600 + i * 200, 3300, 0.09, 0.03, i * 0.06);
    });
  } else if (t == "drop") {
    noise(0.08, 500, 1, 0.3, "lowpass");
    tone("sine", 200, 120, 0.08, 0.08);
  } else if (t == "equip") {
    noise(0.12, 2000, 1.2, 0.15);
    tone("square", 1200, 900, 0.06, 0.04, 0.06);
    tone("triangle", 1800, 1500, 0.12, 0.04, 0.08);
  } else if (t == "eat") {
    [0, 0.11, 0.22].forEach((d) => noise(0.06, 1200, 2, 0.25, "bandpass", d));
  } else if (t == "drink") {
    [0, 0.08, 0.16].forEach((d, i) => tone("sine", 420 + i * 120, 640 + i * 160, 0.07, 0.05, d));
  } else if (t == "levelup") {
    [523, 659, 784, 1047].forEach((f, i) => tone("triangle", f, f * 1.01, 0.22, 0.08, i * 0.09));
    tone("sine", 1568, 1570, 0.4, 0.05, 0.36);
  } else if (t == "hurt") {
    tone("sawtooth", 230, 120, 0.16, 0.08);
    noise(0.1, 700, 1.5, 0.15);
  } else if (t == "block") {
    tone("square", 1100, 800, 0.05, 0.05);
    noise(0.05, 3000, 2, 0.1, "bandpass");
  } else if (t == "death") {
    tone("sawtooth", 300, 60, 0.9, 0.08);
    tone("sine", 200, 40, 1.1, 0.12, 0.1);
  } else if (t == "edie") {
    noise(0.25, 400, 0.8, 0.35, "lowpass");
    tone("triangle", 260, 60, 0.3, 0.1);
  } else if (t == "hammer") {
    [0, 0.25].forEach((d) => {
      tone("square", 1500, 1300, 0.05, 0.08, d);
      tone("triangle", 3100, 2900, 0.35, 0.05, d);
      noise(0.04, 6000, 1, 0.15, "highpass", d);
    });
  } else if (t == "sizzle") {
    noise(0.6, 5000, 0.5, 0.12, "highpass");
  } else if (t == "craft") {
    noise(0.15, 1800, 1, 0.15);
    noise(0.1, 900, 1.5, 0.15, "bandpass", 0.15);
  } else if (t == "cluck") {
    [0, 0.12].forEach((d) => tone("square", 900, 600, 0.07, 0.05, d));
  } else if (t == "moo") {
    tone("sawtooth", 140, 110, 0.6, 0.07);
    tone("sine", 280, 220, 0.6, 0.04);
  } else if (t == "baa") {
    [0, 1, 2, 3, 4].forEach((i) => tone("sawtooth", 380 - i * 6, 360 - i * 6, 0.08, 0.05, i * 0.08));
  } else if (t == "squeak") {
    tone("sine", 2400, 3200, 0.06, 0.05);
    tone("sine", 2600, 3400, 0.05, 0.04, 0.09);
  } else if (t == "squelch") {
    noise(0.18, 350, 3, 0.4, "lowpass");
    tone("sine", 180, 400, 0.12, 0.08);
  } else if (t == "growl") {
    tone("sawtooth", 95, 70, 0.4, 0.08);
    noise(0.35, 300, 2, 0.2, "lowpass");
  } else if (t == "hiss") {
    noise(0.3, 4500, 1, 0.15, "highpass");
  } else if (t == "rattle") {
    [0, 1, 2, 3].forEach((i) => noise(0.03, 2500, 4, 0.2, "bandpass", i * 0.05));
  } else if (t == "grunt") {
    tone("sawtooth", 170, 110, 0.15, 0.07);
    noise(0.08, 600, 2, 0.1);
  }
}
const surfaceAt = (x, y) => {
  const k = TY[y * W + x];
  return inMine ? "stone" : k == 8 || k == 9 ? "wood" : k == 4 ? "dirt" : "grass";
};
const creatureVoice = (t) => {
  const n = ((ET[t] && ET[t].n) || t).toLowerCase();
  return /chicken/.test(n)
    ? "cluck"
    : /\bcow/.test(n)
      ? "moo"
      : /sheep/.test(n)
        ? "baa"
        : /\brat\b/.test(n)
          ? "squeak"
          : /slime/.test(n)
            ? "squelch"
            : /spider|snake|scorpion/.test(n)
              ? "hiss"
              : /skeleton|bone|crab/.test(n)
                ? "rattle"
                : /wolf|bear|boar|dog|troll|ogre|dragon|drake|beast/.test(n)
                  ? "growl"
                  : /wisp/.test(n)
                    ? "magic"
                    : /golem/.test(n)
                      ? "boom"
                      : "grunt";
};
/* Footsteps for every tile walked, plus a door sound when stepping through a doorway. */
let wasInHouse = null;
function playerMoved(n) {
  sfx("step", surfaceAt(P.x, P.y));
  if (n > 1) setTimeout(() => sfx("step", surfaceAt(P.x, P.y)), 300);
  const h = houseAt(P.x, P.y);
  if (!!h != !!wasInHouse) sfx("door");
  wasInHouse = h;
}
function sfxW(d, dl) {
  const w = P.w,
    ty =
      w == "sword"
        ? "hack"
        : w == "dagger" || w == "spear"
          ? "stab"
          : w == "mace"
            ? "blunt"
            : w == "staff"
              ? "zap"
              : w == "wand"
                ? "magic"
                : null;
  if (ty) setTimeout(() => sfx(ty, d > 0), MAGW(w) ? 0 : dl);
  else playSnd("bow");
}
/* ==========================================================================
 * 25. CHAT, XP & EATING HELPERS
 * Chat log output, XP awards and food consumption.
 * ========================================================================== */
function msg(t, hl) {
  const d = document.createElement("div");
  d.textContent = t;
  if (hl) d.style.color = "#1a4fd0";
  $("chat").appendChild(d);
  $("chat").scrollTop = 1e5;
}
function addXp(s, n) {
  if (!Number.isFinite(n) || n <= 0 || !Object.hasOwn(xp, s) || xp[s] >= XP_CAP) return;
  const b = lv(s),
    awarded = Math.min(n, XP_CAP - xp[s]);
  xp[s] += awarded;
  P.lst_s = s;
  fl.push({ x: P.x, y: P.y, t: "+" + Math.round(awarded) + " " + s.slice(0, 2), e: performance.now() + 1200 });
  if (lv(s) > b) {
    msg("Congratulations! Your " + s + " level is now " + lv(s) + ".", 1);
    lvl_up.push({ e: performance.now() + 2500 });
    sfx("levelup");
  }
  dirty = true;
}
function awardCombatXp(skill, damage) {
  if (damage <= 0) return;
  addXp(skill, damage * 2.67);
  addXp("Defence", damage * 1.33);
  addXp("Hitpoints", damage * 1.33);
}
function eat(i) {
  const it = inv[i];
  if (!it || !FOOD[it.n]) return;
  it.q--;
  if (!it.q) inv[i] = null;
  P.hp = Math.min(maxHp(), P.hp + FOOD[it.n]);
  msg("You eat the food. It heals some health.");
  sfx("eat");
  dirty = true;
}
/* ==========================================================================
 * 26. NPC DIALOG DATA
 * Dialogue trees per town and the conversation state.
 * ========================================================================== */
const LN = {
  Oakhaven: [
    [
      "Mayor Elric",
      "talk",
      [
        "Welcome to Oakhaven! Goblins roam the rocky hills, so bring a good sword.",
        "Better tools make the work faster. Visit Bram’s store.",
      ],
    ],
    ["Bram", "shop", ["Looking to upgrade your gear? Take a look."], "gen", 0],
    [
      "Lila",
      "talk",
      ["Cook your catch at the stove in the plaza.", "The fishing spots by the shore are lovely at dusk."],
      undefined,
      1,
      1,
      3,
    ],
    ["Banker Rue", "bank", ["Your goods are safe with me."], undefined, 2],
    ["Hilda", "shop", ["Armor and blades, forged fresh."], "arm", 3],
    ["Warrior Trench", "trainer", ["Learn Bash (Lv 2)", "Learn Cleave (Lv 5)", "Learn Enrage (Lv 10)"], "warrior", 2, 1, 3],
    ["Ranger Veil", "trainer", ["Learn Rapid (Lv 2)", "Learn Snipe (Lv 5)", "Learn Volley (Lv 10)"], "ranger", 2, 2, 4],
    ["Mage Lyris", "trainer", ["Learn Ice (Lv 2)", "Learn Fire (Lv 5)", "Learn Nova (Lv 10)"], "mage", 2, 3, 3],
    ["Smith Ron", "trainer", ["Learn Smithing (Lv 3)"], "smith", 1],
    ["Scholar Amara", "talk", ["The arcane energies in this region are unstable. We must understand them."], undefined, 4],
    ["Captain Joss", "talk", ["Goblins have been sighted east of the town. Stay vigilant, adventurer."], undefined, 5],
    ["Warden Hale", "talk", ["A sturdy watchtower keeps the forest roads safe."], undefined, 0],
    ["Scout Rowan", "talk", ["I patrol the treeline. The wolves are getting bolder."], undefined, 0],
  ],
  Willowbrook: [
    ["Fern", "talk", ["The forests around here are full of good timber."], undefined, 0],
    ["Old Tom", "shop", ["I buy anything you can carry!"], "farm", 1],
    ["Ada", "talk", ["I'm keeping the Willowbrook storehouse stocked."], undefined, 0, 1, 4],
    ["Banker Wyn", "bank", ["Your vault is the same at every bank on the island."]],
    ["Prospector Nia", "talk", ["The deeper seams hold coal and better ore."], undefined, 0],
    ["Gravekeeper Moss", "talk", ["Keep your lantern lit near the old ruins."], undefined, 0],
  ],
  Stonebridge: [
    ["Garrick", "talk", ["Rocks near the mountains hold ore. Bring a good pickaxe."], undefined, 0],
    ["Mina", "shop", ["Slimes are harmless, mostly. Goblins, not so much."], "wpn", 1],
    ["Brogan", "talk", ["The forge is always hungry for good iron ore."], undefined, 0, 1, 4],
    ["Banker Odo", "bank", ["Ore, bars, coins — I'll keep them safe."]],
  ],
  Seaview: [
    [
      "Captain Joss",
      "talk",
      ["Nothing beats fishing at sunrise.", "Follow the roads to find all four settlements."],
      undefined,
      0,
    ],
    ["Pearl", "shop", ["Fresh fish fetches a fair price."], "fish", 1],
    ["Fia", "talk", ["The festival cooks are looking for a fresh catch."], undefined, 0, 1, 4],
    ["Banker Marisol", "bank", ["Deposit your catch before the tide takes it."]],
    ["Harbor Cook Sella", "talk", ["The festival banquet will be the finest Seaview has seen."], undefined, 0],
    ["Delver Orin", "talk", ["The caverns are no place for an unprepared adventurer."], undefined, 0],
    ["Keeper Elowen", "talk", ["The ancient grove still holds a little magic."], undefined, 0],
  ],
};
