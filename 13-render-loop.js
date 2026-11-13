/* Oak & Iron - Main render loop (sections 46-46). Loaded in order by index.html. */

/* ==========================================================================
 * 46. MAIN RENDER LOOP
 * Camera, world pass, entities, particles, HUD and hotbar; loops via requestAnimationFrame.
 * ========================================================================== */
function draw() {
  const now = (tm = performance.now()),
    p = Math.min(1, (now - last) / 600),
    I = (e, k) => e["o" + k] + (e[k] - e["o" + k]) * p;
  g.imageSmoothingEnabled = false;
  const px = I(P, "x") * T,
    py = I(P, "y") * T;
  const s = sc(),
    vw = cv.width / s,
    vh = cv.height / s;
  camx = Math.max(0, Math.min(W * T - vw, px + 12 - vw / 2));
  camy = Math.max(0, Math.min(H * T - vh, py + 12 - vh / 2));
  camx |= 0;
  camy |= 0;
  g.setTransform(s, 0, 0, s, -camx * s, -camy * s);
  const x0 = (camx / T) | 0,
    y0 = (camy / T) | 0,
    ents = [];
  for (let y = y0; y <= y0 + Math.ceil(vh / T); y++)
    for (let x = x0; x <= x0 + Math.ceil(vw / T); x++)
      if (x >= 0 && y >= 0 && x < W && y < H) {
        dt(x, y);
        const o = og[y * W + x];
        if (o && (!inMine || inCaveBounds(x, y))) ents.push([y, () => dobj(o)]);
      }
  gd.forEach((i) => {
    if (i.x < x0 - 1 || i.x > x0 + vw / T + 1 || i.y < y0 - 1 || i.y > y0 + vh / T + 1) return;
    ents.push([
      i.y - 0.5,
      () => {
        if (i.u - tickN < 50 && Math.floor(now / 250) % 2) return;
        const x = i.x * T,
          y = i.y * T,
          b = Math.sin(now / 300 + i.x) * 1.5;
        sh_(x + 12, y + 20, 6);
        g.globalAlpha = 0.5 + 0.3 * Math.sin(now / 250 + i.y);
        F("#ffe97a", x + 10, y + 4, 4, 1);
        F("#ffe97a", x + 12, y + 2, 1, 5);
        g.globalAlpha = 1;
        g.textAlign = "center";
        g.imageSmoothingEnabled = false;
        if (SC[i.n]) g.drawImage(SC[i.n], x + 2, y + 1 - b, 20, 20);
        else {
          g.drawImage(SC.Crate, x + 2, y + 2 - b, 20, 20);
        }
        if (i.q > 1) {
          g.font = "bold 9px monospace";
          g.fillStyle = "#ff0";
          g.fillText(i.q, x + 12, y + 23);
        }
      },
    ]);
  });
  // Render gravestone if player died
  if (grave) {
    ents.push([
      grave.y - 0.6,
      () => {
        g.globalAlpha = 0.8;
        g.fillStyle = "#b08d5c";
        g.fillRect((grave.x * T) + 6, (grave.y * T) + 6, T - 12, T - 12);
        g.globalAlpha = 1;
        g.strokeStyle = "#8b754e";
        g.lineWidth = 3;
        g.beginPath();
        g.arc((grave.x * T) + T / 2, (grave.y * T) + T / 2, T / 3, 0, Math.PI * 2);
        g.stroke();
        g.fillStyle = "#faa";
        g.font = "bold 11px serif";
        g.textAlign = "center";
        g.drawImage(SC.Grave, grave.x * T + 2, grave.y * T + 2, 20, 20);
        if (grave.items.length > 0) {
          g.fillStyle = "#fff";
          g.font = "9px monospace";
          g.fillText(`×${grave.items.length}`, (grave.x * T) + T / 2, (grave.y * T) + T / 2 + 16);
        }
      },
    ]);
  }
  if (mark && mark.e > now) {
    g.strokeStyle = "#ff0";
    g.lineWidth = 2;
    const x = mark.x * T,
      y = mark.y * T;
    g.beginPath();
    g.moveTo(x + 6, y + 6);
    g.lineTo(x + 18, y + 18);
    g.moveTo(x + 18, y + 6);
    g.lineTo(x + 6, y + 18);
    g.stroke();
  }
  npcs.forEach((n) => {
    if (!!n.cave != inMine) return;
    const x = I(n, "x") * T,
      y = I(n, "y") * T;
    ents.push([
      n.y,
      () => {
        const frame =
          n.task == "idle" || n.task == "look" ? 0 : (Math.floor(now / 170) % 4) + 1;
        ch(g, x, y, n.look, n.d, frame);
        if (n.task == "practice" && n.kind == "warrior") {
          const dx = x + 27,
            dy = y + 7,
            swing = Math.sin(now / 220) * 5;
          F("#6b4423", dx + 5, dy + 3, 3, 13);
          F("#b88954", dx, dy + 2, 13, 8);
          F("#8b5a2b", dx + 2, dy - 1, 9, 7);
          F("#6b4423", x + 17, y + 11, 2, 8);
          g.strokeStyle = "#d6dbe0";
          g.lineWidth = 2;
          g.beginPath();
          g.moveTo(x + 18, y + 12);
          g.lineTo(x + 24 + swing, y + 7);
          g.stroke();
          g.strokeStyle = "rgba(255,220,130,.75)";
          g.beginPath();
          g.arc(x + 20, y + 12, 8, -1.1 + swing * 0.02, 0.5 + swing * 0.02);
          g.stroke();
        } else if (n.task == "practice" && n.kind == "ranger") {
          const tx = x + 32,
            ty = y + 8,
            fire = Math.sin(now / 620) > 0.45;
          g.strokeStyle = "#704626";
          g.lineWidth = 2;
          g.beginPath();
          g.arc(tx, ty, 7, 0, Math.PI * 2);
          g.stroke();
          g.strokeStyle = "#b84c37";
          g.beginPath();
          g.arc(tx, ty, 4, 0, Math.PI * 2);
          g.stroke();
          F("#f4d15b", tx - 1, ty - 1, 2, 2);
          g.strokeStyle = "#8b5a2b";
          g.lineWidth = 2;
          g.beginPath();
          g.arc(x + 18, y + 12, 8, -1.2, 1.2);
          g.stroke();
          if (fire) {
            g.strokeStyle = "#e8e0c0";
            g.beginPath();
            g.moveTo(x + 20, y + 11);
            g.lineTo(tx - 7, ty);
            g.stroke();
          }
        } else if (n.task == "practice" && n.kind == "mage") {
          const tx = x + 27,
            ty = y + 8,
            pulse = 2 + Math.sin(now / 180) * 1.5;
          g.strokeStyle = "rgba(164,110,255,.85)";
          g.lineWidth = 2;
          g.beginPath();
          g.arc(tx, ty, 7 + pulse, 0, Math.PI * 2);
          g.stroke();
          F("#c07bff", tx - 2, ty - 2, 4, 4);
          F("#fff", tx - 1, ty - 1, 2, 2);
          F("#ffe97a", x + 17, y + 9, 3, 3);
          F("#9ceaff", x + 21, y + 5, 2, 2);
        } else if (n.task == "wave") {
          F("#f5d0a9", x + 17, y + (Math.sin(now / 140) > 0 ? 2 : 5), 3, 3);
          F("#f5d0a9", x + 20, y + (Math.sin(now / 140) > 0 ? 0 : 4), 2, 2);
        } else if (n.task == "read") {
          F("#704626", x + 18, y + 10, 5, 4);
          F("#f0dfb2", x + 19, y + 11, 4, 2);
          F("#9c4937", x + 21, y + 11, 1, 2);
        } else if (n.task == "work" || n.task == "tidy") {
          const bob = Math.sin(now / 130) * 2;
          F("#8b5a2b", x + 18, y + 8 + bob, 2, 11);
          F(n.task == "work" ? "#b9b9b4" : "#c8a05a", x + 16, y + 7 + bob, 6, 3);
          if (n.task == "work") F("#ddd", x + 16, y + 6 + bob, 2, 2);
        }
        if (CFG.names) {
          g.fillStyle = "#fff";
          g.font = "bold 10px monospace";
          g.textAlign = "center";
          g.strokeStyle = O;
          g.lineWidth = 3;
          g.strokeText(n.n, x + 12, y - 6);
          g.fillText(n.n, x + 12, y - 6);
        }
        const qq = QS.find((z) => z.g == n.n && qs[z.id].s == 1) || QS.find((z) => z.g == n.n && qs[z.id].s == 0);
        if (qq) {
          g.fillStyle = "#ffd54f";
          g.font = "bold 16px monospace";
          g.fillText(qs[qq.id].s ? "?" : "!", x + 12, y - 16);
        }
      },
    ]);
  });
  const visiblePlayerLevel = cmb();
  ens.forEach((q) => {
    if (q.dead || (inMine != inCaveBounds(q.x, q.y))) return;
    const [eox, eoy] = enemyOffset(q, now),
      x = I(q, "x") * T + eox + (q.sh > now ? Math.sin(now / 20) * 2 : 0),
      y = I(q, "y") * T + eoy,
      E = ET[q.t],
      b = Math.abs(Math.sin(now / 200 + q.hx)) * 2;
    ents.push([
      q.y,
      () => {
        sh_(x + 12, y + 21, 8);
        if (q.t == "chicken") {
          const hop = Math.sin(now / 170 + q.hx) > 0 ? 1 : 0;
          F(O, x + 5, y + 13 - hop, 14, 8);
          F(E.c, x + 6, y + 12 - hop, 12, 7);
          F(E.c, x + 13, y + 6 - hop, 7, 7);
          F("#d85548", x + 15, y + 4 - hop, 3, 3);
          F("#e3a23d", x + 19, y + 9 - hop, 4, 2);
          F("#20201d", x + 17, y + 8 - hop, 1, 1);
          F("#b58b3e", x + 8, y + 19, 2, 4);
          F("#b58b3e", x + 15, y + 19, 2, 4);
        } else if (q.t == "cow") {
          F(O, x + 2, y + 8, 20, 13);
          F(E.c, x + 3, y + 9, 17, 10);
          F("#76583f", x + 6, y + 10, 4, 4);
          F("#76583f", x + 14, y + 15, 4, 3);
          F(E.c, x + 17, y + 5, 6, 8);
          F("#d9b7a3", x + 19, y + 10, 5, 4);
          F(O, x + 19, y + 7, 1, 1);
          F(O, x + 23, y + 7, 1, 1);
          F("#ddd2bd", x + 18, y + 3, 2, 3);
          F("#ddd2bd", x + 22, y + 3, 2, 3);
          F(O, x + 5, y + 19, 3, 4);
          F(O, x + 15, y + 19, 3, 4);
        } else if (q.t == "sheep") {
          F(O, x + 3, y + 9, 18, 12);
          F(E.c, x + 4, y + 8, 16, 12);
          F(E.c, x + 17, y + 8, 7, 8);
          F("#222", x + 19, y + 10, 1, 1);
          F("#222", x + 22, y + 10, 1, 1);
          F(O, x + 6, y + 19, 3, 4);
          F(O, x + 15, y + 19, 3, 4);
          F("#fff", x + 6, y + 6, 4, 4);
          F("#fff", x + 12, y + 5, 4, 4);
        } else if (q.t == "slime") {
          F(O, x + 3, y + 9 - b, 18, 12 + b);
          F(E.c, x + 4, y + 10 - b, 16, 10 + b);
          F("#9af0a4", x + 6, y + 11 - b, 5, 3);
          F(O, x + 8, y + 14, 2, 3);
          F(O, x + 14, y + 14, 2, 3);
        } else if (q.t == "rat") {
          F(O, x + 3, y + 11, 18, 9);
          F(E.c, x + 5, y + 12, 14, 7);
          F(E.c, x + 7, y + 8, 8, 6);
          F("#d6a5a5", x + 7, y + 6, 3, 3);
          F("#d6a5a5", x + 13, y + 6, 3, 3);
          F("#f55", x + 9, y + 10, 2, 2);
          F("#f55", x + 14, y + 10, 2, 2);
          F("#d6a5a5", x + 19, y + 16, 5, 2);
        } else if (q.t == "wolf") {
          F(O, x + 2, y + 10, 20, 10);
          F(E.c, x + 4, y + 9, 15, 10);
          F(E.c, x + 13, y + 4, 9, 8);
          F(E.c, x + 17, y + 1, 4, 6);
          F("#e3d8c8", x + 19, y + 8, 4, 3);
          F("#e84a4a", x + 18, y + 6, 2, 2);
          F(O, x + 5, y + 18, 3, 5);
          F(O, x + 15, y + 18, 3, 5);
        } else if (q.t == "crab") {
          F(O, x + 4, y + 9, 16, 11);
          F(E.c, x + 5, y + 10, 14, 8);
          F(E.c, x + 1, y + 7, 5, 5);
          F(E.c, x + 18, y + 7, 5, 5);
          F("#fff", x + 8, y + 9, 3, 3);
          F("#fff", x + 14, y + 9, 3, 3);
          F(O, x + 9, y + 10, 1, 2);
          F(O, x + 15, y + 10, 1, 2);
          F(E.c, x + 3, y + 18, 2, 4);
          F(E.c, x + 9, y + 18, 2, 4);
          F(E.c, x + 15, y + 18, 2, 4);
          F(E.c, x + 20, y + 18, 2, 4);
        } else if (q.t == "skeleton") {
          F(O, x + 7, y + 2, 10, 8);
          F(E.c, x + 8, y + 3, 8, 6);
          F(O, x + 9, y + 5, 2, 2);
          F(O, x + 14, y + 5, 2, 2);
          F(E.c, x + 11, y + 10, 3, 9);
          F(E.c, x + 5, y + 11, 14, 2);
          F(O, x + 6, y + 14, 12, 2);
          F(E.c, x + 7, y + 18, 3, 5);
          F(E.c, x + 14, y + 18, 3, 5);
          F("#8b754e", x + 19, y + 9, 2, 13);
          F("#ddd", x + 18, y + 7, 4, 4);
        } else if (q.t == "scorpion") {
          F(O, x + 5, y + 12, 13, 8);
          F(E.c, x + 6, y + 13, 11, 6);
          F(E.c, x + 1, y + 8, 7, 6);
          F(E.c, x + 16, y + 8, 7, 6);
          F(E.c, x + 16, y + 4, 4, 5);
          F(E.c, x + 18, y + 1, 3, 5);
          F("#ffe27a", x + 9, y + 14, 2, 2);
          F("#ffe27a", x + 14, y + 14, 2, 2);
          F(E.c, x + 7, y + 19, 2, 4);
          F(E.c, x + 14, y + 19, 2, 4);
        } else if (q.t == "basaltGolem") {
          F(O, x + 3, y + 6, 18, 16);
          F(E.c, x + 4, y + 7, 16, 14);
          F("#8b8379", x + 7, y + 4, 10, 5);
          F("#ff9d4d", x + 8, y + 11, 2, 3);
          F("#ff9d4d", x + 14, y + 11, 2, 3);
          F(O, x + 7, y + 19, 4, 4);
          F(O, x + 14, y + 19, 4, 4);
        } else if (q.t == "stormDrake") {
          F(E.c, x + 1, y + 7, 8, 8);
          F(E.c, x + 15, y + 7, 8, 8);
          F(O, x + 7, y + 8, 12, 12);
          F(E.c, x + 8, y + 9, 10, 10);
          F(E.c, x + 10, y + 4, 7, 7);
          F("#f4e58a", x + 11, y + 7, 2, 2);
          F("#f4e58a", x + 15, y + 7, 2, 2);
          F(E.c, x + 5, y + 18, 3, 5);
          F(E.c, x + 17, y + 18, 3, 5);
        } else if (q.t == "voidKnight") {
          F(O, x + 6, y + 4, 12, 18);
          F(E.c, x + 7, y + 5, 10, 15);
          F("#d8a8ff", x + 9, y + 8, 2, 2);
          F("#d8a8ff", x + 14, y + 8, 2, 2);
          F("#b8b2bc", x + 19, y + 8, 2, 14);
          F("#e3e1e6", x + 18, y + 6, 4, 3);
          F(O, x + 7, y + 19, 4, 5);
          F(O, x + 14, y + 19, 4, 5);
        } else if (q.t == "mossheart") {
          const pulse = Math.sin(now / 180) > 0 ? 1 : 0;
          F("rgba(132,206,91,.22)", x - 5, y - 5, 34, 34);
          F("#263b24", x + 1, y + 3, 24, 23);
          F("#527d3d", x + 3, y + 4, 20, 20);
          F("#83a957", x + 5, y + 2, 16, 8);
          F("#9dc66a", x + 8, y + 4, 5, 3);
          F("#d5c77a", x + 7, y + 12, 3 + pulse, 3);
          F("#d5c77a", x + 15, y + 12, 3 + pulse, 3);
          F("#694b2e", x + 3, y + 20, 6, 6); F("#694b2e", x + 17, y + 20, 6, 6);
          F("#3b5d30", x - 1, y + 8, 5, 11); F("#3b5d30", x + 20, y + 7, 5, 12);
        } else if (q.t == "cindermaw") {
          const flare = Math.floor(now / 180) % 2;
          F("rgba(255,95,45,.24)", x - 6, y - 7, 36, 36);
          F("#49251f", x + 1, y + 4, 24, 22); F("#a8472e", x + 3, y + 4, 20, 19);
          F("#e4773c", x + 5, y + 2, 16, 8); F("#ffd17a", x + 7, y + 11, 4, 3); F("#ffd17a", x + 15, y + 11, 4, 3);
          F("#3c2420", x + 7, y + 19, 4, 7); F("#3c2420", x + 16, y + 19, 4, 7);
          if (flare) { F("#ff9a45", x + 1, y + 1, 3, 5); F("#ff9a45", x + 21, y + 1, 3, 5); }
        } else if (q.t == "tempest") {
          const wing = Math.sin(now / 150) * 2;
          F("rgba(126,220,255,.22)", x - 9, y - 8, 42, 38);
          F("#315d78", x - 5, y + 6 + wing, 13, 10); F("#315d78", x + 16, y + 6 - wing, 13, 10);
          F("#25465e", x + 3, y + 4, 18, 20); F("#4b91b2", x + 5, y + 5, 14, 17);
          F("#a6efff", x + 8, y + 9, 3, 3); F("#a6efff", x + 15, y + 9, 3, 3);
          F("#d6f7ff", x + 10, y + 17, 5, 3); F("#315d78", x + 6, y + 21, 5, 5); F("#315d78", x + 16, y + 21, 5, 5);
        } else if (ET[q.t].magic) {
          const robe = E.c,
            glow = ET[q.t].spell,
            bob = Math.sin(now / 170 + q.hx) > 0 ? 1 : 0;
          F(O, x + 6, y + 5 - bob, 12, 17);
          F(robe, x + 7, y + 6 - bob, 10, 14);
          F(glow, x + 8, y + 7 - bob, 2, 3);
          F(glow, x + 14, y + 7 - bob, 2, 3);
          F("#eee3c6", x + 9, y + 8 - bob, 2, 2);
          F("#eee3c6", x + 14, y + 8 - bob, 2, 2);
          F(O, x + 7, y + 13 - bob, 10, 2);
          F(glow, x + 11, y + 13 - bob, 2, 3);
          F("#684a35", x + 19, y + 4, 2, 18);
          F(glow, x + 18, y + 2, 4, 4);
          F("#fff", x + 19, y + 3, 2, 2);
          if (Math.floor(now / 260) % 2 == 0) {
            F(glow, x + 3, y + 8 - bob, 2, 2);
            F(glow, x + 20, y + 11 - bob, 2, 2);
          }
        } else {
          F(O, x + 4, y + 2, 16, 19);
          F("#384c2a", x + 5, y + 11, 14, 9);
          F(E.c, x + 5, y + 3, 14, 9);
          F(E.c, x + 2, y + 5, 3, 4);
          F(E.c, x + 19, y + 5, 3, 4);
          F("#f22", x + 8, y + 7, 3, 2);
          F("#f22", x + 14, y + 7, 3, 2);
        }
        const aggro = q.tg == P || enemyCanAggro(q.t, visiblePlayerLevel),
          label = `${E.boss ? "★ " : ""}${E.n} · Lv ${E.lv}`,
          labelY = y - (E.boss ? 24 : 16);
        g.font = E.boss ? "bold 10px monospace" : "bold 9px monospace";
        g.textAlign = "center";
        g.textBaseline = "alphabetic";
        g.lineWidth = 2;
        g.strokeStyle = O;
        g.fillStyle = aggro ? "#ff6258" : "#8fe078";
        g.strokeText(label, x + 12, labelY - 7);
        g.fillText(label, x + 12, labelY - 7);
        if (E.boss) {
          const bw = 34, bx = x - 5, by = y - 5;
          F("#241711", bx - 1, by - 1, bw + 2, 5);
          F("#a53c32", bx, by, bw, 3);
          F("#f0bd59", bx, by, Math.max(0, bw * q.hp / E.hp), 3);
        } else bar(q, x, y, q.hp, E.hp);
        if (q.ag > now) {
          const k = 1 - (q.ag - now) / 1100,
            jy = labelY - 18 - Math.abs(Math.sin(k * Math.PI * 3)) * 4;
          g.font = "bold 14px monospace";
          g.textAlign = "center";
          g.lineWidth = 3;
          g.strokeStyle = O;
          g.fillStyle = "#ff3b30";
          g.strokeText("!", x + 12, jy);
          g.fillText("!", x + 12, jy);
        }
      },
    ]);
  });
  const mvd = Math.abs(P.x - P.ox) + Math.abs(P.y - P.oy),
    run = mvd > 1,
    fr = mvd ? (Math.floor(now / (run ? 85 : 140)) % 4) + 1 : 0,
    pa_ = P.act,
    PK =
      !mvd &&
      pa_ &&
      pa_.t &&
      Math.abs(P.x - pa_.t.x) + Math.abs(P.y - pa_.t.y) <= rg(pa_) &&
      { tree: "axe", rock: "pick", fish: "rod", attack: P.w }[pa_.k],
    gq = PK == "axe" || PK == "pick" ? clamp01((now - last) / 600) : -1;
  if (gq >= 0) ents.push([Math.max(P.y, pa_.t.y) + 0.1, () => drawGatherBits(g, pa_, gq, PK)]);
  ents.push([
    P.y,
    () => {
      const atk = P.atk && now < P.atk.e && P.atk.w == P.w ? P.atk : null,
        pose = atk && attackPose(atk, now, I),
        hurtK = P.hurtAt ? clamp01(1 - (now - P.hurtAt) / 180) : 0,
        bump = gq >= 0 ? 2 * Math.sin(Math.PI * clamp01((gq - 0.02) / 0.25)) : 0,
        lx = (pose ? Math.cos(pose.ang) * pose.lunge : 0) + [0, 0, -1, 1][P.d] * bump + Math.sin(now / 12) * 1.5 * hurtK,
        ly = (pose ? Math.sin(pose.ang) * pose.lunge : 0) + [1, -1, 0, 0][P.d] * bump,
        bob = walkBob(fr, run),
        carried = !pose && PK != P.w,
        behind = P.d != 1;
      if (run) drawRunDust(g, px, py, P.d, now);
      if (carried && behind) drawCarried(g, px + lx, py + ly - bob, P.d, P.w);
      if (hurtK) g.filter = `brightness(${1 + hurtK * 1.4})`;
      ch(g, px + lx, py + ly, look, P.d, fr, run);
      drawWornGear(g, px + lx, py + ly - bob, P.d);
      g.filter = "none";
      if (carried && !behind) drawCarried(g, px + lx, py + ly - bob, P.d, P.w);
      if (pose) drawAttackWeapon(g, px + lx, py + ly, atk, pose, now);
      if (PK == "rod") drawFishing(g, px, py, pa_, now, I);
      else if (PK && !pose) drawHeldTool(g, px + lx, py + ly, PK, P.d, gq, now);
      bar(P, px, py, P.hp, maxHp());
    },
  ]);
  ents.sort((a, b) => a[0] - b[0]).forEach((e) => e[1]());
  drawHouseCovers(now);
  for (let i = fx.length - 1; i >= 0; i--) {
    const f = fx[i];
    if (f.e < now) {
      fx.splice(i, 1);
      continue;
    }
    if (now < f.s) continue;
    const p = (now - f.s) / (f.e - f.s),
      X = f.x * T + 12,
      Y = f.y * T + 12;
    g.globalAlpha = 1 - p;
    if (f.t == "cut") {
      const len = 24 * ease(p * 3),
        ca = Math.cos(f.a),
        sa = Math.sin(f.a);
      g.lineCap = "round";
      g.strokeStyle = "#b11";
      g.lineWidth = 4 * (1 - p) + 1;
      g.beginPath();
      g.moveTo(X - (ca * len) / 2 + 1, Y - (sa * len) / 2 + 1);
      g.lineTo(X + (ca * len) / 2 + 1, Y + (sa * len) / 2 + 1);
      g.stroke();
      g.strokeStyle = f.c;
      g.lineWidth = 2 * (1 - p) + 1;
      g.beginPath();
      g.moveTo(X - (ca * len) / 2, Y - (sa * len) / 2);
      g.lineTo(X + (ca * len) / 2, Y + (sa * len) / 2);
      g.stroke();
      g.lineCap = "butt";
    } else if (f.t == "stick") {
      g.save();
      g.translate(X - Math.cos(f.a) * 3, Y - Math.sin(f.a) * 3);
      g.rotate(f.a);
      drawArrowShape(g, 10);
      g.restore();
    } else if (f.t == "slash") {
      g.strokeStyle = f.c;
      g.lineWidth = 3;
      g.beginPath();
      g.arc(X, Y, 11, -1.2 + p * 2.4, -0.2 + p * 2.4);
      g.stroke();
    } else if (f.t == "burst") {
      for (let k = 0; k < 8; k++) {
        const a = k * 0.785 + f.r,
          d = 4 + p * 14,
          z = 4 * (1 - p) + 1;
        F(f.c, X + Math.cos(a) * d - 2, Y + Math.sin(a) * d - 2, z, z);
      }
    } else if (f.t == "ring") {
      g.strokeStyle = f.c;
      g.lineWidth = 3;
      g.beginPath();
      g.arc(X, Y, 4 + p * f.rad, 0, 6.3);
      g.stroke();
    } else {
      g.strokeStyle = f.c;
      g.lineWidth = 2;
      g.beginPath();
      g.ellipse(X, Y + 8, 12, 5, 0, 0, 6.3);
      g.stroke();
      for (let k = 0; k < 4; k++) {
        const a = p * 6 + k * 1.57;
        F(f.c, X + Math.cos(a) * 12 - 1, Y + 8 + Math.sin(a) * 5 - p * 20, 3, 3);
      }
    }
    g.globalAlpha = 1;
  }
  drawShots(g, now, I);
  for (let i = proj.length - 1; i >= 0; i--) {
    const q = proj[i],
      f = 1 - (q.e - now) / 350;
    if (f > 1) {
      proj.splice(i, 1);
      continue;
    }
    const X = (q.a + (q.c - q.a) * f) * T + 12,
      Y = (q.b + (q.d - q.b) * f) * T + 12;
    const tc = q.sk
      ? { Warrior: "#ffb040", Ranger: "#9f9", Mage: "#6cf" }[q.sk]
      : q.k == "bow"
        ? "#e8e0c0"
        : q.col || "#c07bff";
    for (let k = 1; k < 5; k++) {
      const ff = Math.max(0, f - k * 0.05);
      g.globalAlpha = 0.5 / k;
      F(tc, (q.a + (q.c - q.a) * ff) * T + 10, (q.b + (q.d - q.b) * ff) * T + 10, 5, 5);
    }
    g.globalAlpha = 1;
    if (q.sk) {
      if (q.sk == "Warrior") {
        if (q.si == 0)
          F("#ccc", X - 8, Y - 4, 16, 8); // Bash
        else if (q.si == 1) {
          g.fillStyle = "#f22";
          g.beginPath();
          g.arc(X, Y, 12, 0, Math.PI);
          g.fill();
        } // Cleave
        else {
          F("#fa0", X - 10, Y - 10, 20, 20);
        } // Enrage
      } else if (q.sk == "Ranger") {
        if (q.si == 0) F("#0f0", X - 3, Y - 3, 6, 6);
        else if (q.si == 1) {
          F("#ff0", X - 8, Y - 8, 16, 16);
          F("#fff", X - 4, Y - 4, 8, 8);
        } else {
          F("#888", X - 6, Y - 20 + f * 30, 4, 12);
          F("#888", X + 2, Y - 10 + f * 30, 4, 12);
        }
      } else if (q.sk == "Mage") {
        if (q.si == 0) F("#0cf", X - 8, Y - 8, 16, 16);
        else if (q.si == 1) {
          g.fillStyle = "#f40";
          g.beginPath();
          g.arc(X, Y, 8 + f * 8, 0, 6.3);
          g.fill();
        } else {
          g.strokeStyle = "#c07bff";
          g.lineWidth = 4;
          g.beginPath();
          g.arc(X, Y, 4 + f * 16, 0, 6.3);
          g.stroke();
        }
      }
    } else {
      g.fillStyle = q.k == "bow" ? "#e8e0c0" : q.col || "#c07bff";
      g.fillRect(X - 3, Y - 3, q.k == "bow" ? 6 : 5, q.k == "bow" ? 2 : 5);
    }
  }
  g.font = "bold 11px monospace";
  g.textAlign = "center";
  for (let i = splats.length - 1; i >= 0; i--) {
    const s = splats[i];
    if (s.e < now) {
      splats.splice(i, 1);
      continue;
    }
    const x = s.x * T + 12,
      y = s.y * T + 6;
    if (!CFG.splat) continue;
    F(s.d ? "#d22" : "#2a6edb", x - 7, y - 8, 14, 13);
    g.fillStyle = "#fff";
    g.fillText(s.d, x, y + 3);
  }
  for (let i = fl.length - 1; i >= 0; i--) {
    const f = fl[i];
    if (f.e < now) {
      fl.splice(i, 1);
      continue;
    }
    g.fillStyle = "#ff0";
    g.fillText(f.t, f.x * T + 12 - camx, f.y * T - camy - (1200 - (f.e - now)) / 40);
  }

  // Level up text rendering
  for (let i = lvl_up.length - 1; i >= 0; i--) {
    const l = lvl_up[i];
    if (l.e < now) {
      lvl_up.splice(i, 1);
      continue;
    }
    const f = 1 - (l.e - now) / 2500,
      y_off = Math.sin(f * Math.PI) * 20 + f * 30;
    g.font = "bold 24px monospace";
    g.textAlign = "center";
    g.lineWidth = 4;
    g.strokeStyle = "#000";
    g.strokeText("LEVEL UP!", px + 12, py - 10 - y_off);
    g.fillStyle = "#ffd54f";
    g.fillText("LEVEL UP!", px + 12, py - 10 - y_off);
  }

  const ph = (now / 1000 / 240 + 0.05) % 1,
    dk = Math.max(0, 0.5 - 0.5 * Math.cos(ph * 6.283) - 0.5) * 2 * CFG.dn,
    S = cv.width / LW;
  if (inMine) {
    const caveS = cv.width / LW,
      screenX = (px + 12 - camx) * caveS,
      screenY = (py + 12 - camy) * caveS;
    g.setTransform(caveS, 0, 0, caveS, 0, 0);
    F("rgba(5,4,8,.58)", 0, 0, LW, LH);
    const caveLight = g.createRadialGradient(screenX / caveS, screenY / caveS, 30, screenX / caveS, screenY / caveS, 250);
    caveLight.addColorStop(0, "rgba(228,190,124,.12)");
    caveLight.addColorStop(1, "rgba(4,3,7,.38)");
    F(caveLight, 0, 0, LW, LH);
  }
  g.setTransform(S, 0, 0, S, 0, 0);
  if (dk > 0) F("rgba(15,25,70," + (dk * 0.5).toFixed(2) + ")", 0, 0, LW, LH);
  if (CFG.gfx) {
    const vg = g.createRadialGradient(LW / 2, LH / 2, LH * 0.4, LW / 2, LH / 2, LH * 0.95);
    vg.addColorStop(0, "rgba(0,0,0,0)");
    vg.addColorStop(1, "rgba(12,6,0,.4)");
    F(vg, 0, 0, LW, LH);
    if (dk > 0.15)
      for (let i = 0; i < 16; i++) {
        const a = 0.4 + 0.6 * Math.sin(now / 400 + i * 2),
          x = hs(i, 3) * LW + Math.sin(now / 1300 + i) * 22,
          y = hs(i, 7) * LH + Math.cos(now / 1700 + i) * 18;
        g.globalAlpha = Math.min(1, dk) * a;
        F("#ffe97a", x, y, 3, 3);
        g.globalAlpha *= 0.3;
        F("#ffe97a", x - 2, y - 2, 7, 7);
        g.globalAlpha = 1;
      }
  }
  if (hov.x >= 0) {
    const o = opts(hov.x, hov.y)[0];
    if (o.l != "Cancel") {
      g.textAlign = "left";
      g.font = "bold 12px monospace";
      g.fillStyle = O;
      g.fillText(o.l, 9, 19);
      g.fillStyle = "#fff";
      g.fillText(o.l, 8, 18);
    }
    g.strokeStyle = "rgba(255,255,255,.6)";
    g.lineWidth = 2;
    g.strokeRect(
      (hov.x * T - camx) * zoom + 0.5,
      (hov.y * T - camy) * zoom + 0.5,
      T * zoom - 1,
      T * zoom - 1,
    );
  }

  const tw = inMine ? { n: "Oak & Iron Mine" } : inT(P.x, P.y),
    hr = Math.floor((6 + ph * 24) % 24),
    mh = maxHp();
  g.textAlign = "left";
  g.font = "bold 12px monospace";
  g.fillStyle = "rgba(30,20,10,.75)";
  g.fillRect(6, 28, 175, 38);
  g.fillStyle = "#ffd54f";
  g.fillText(tw ? tw.n : "Wilderness", 12, 43);
  g.fillStyle = "#fff";
  g.fillText(hr + ":00", 12, 59);
  g.imageSmoothingEnabled = false;
  g.drawImage(SC.Coins, 54, 49, 13, 13);
  g.fillText(count("Coins") + "  CB " + cmb(), 72, 59);

  const cb_sk = ["Hitpoints", "Attack", "Ranged", "Magic", "Defence"].includes(P.lst_s)
    ? P.lst_s
    : CL[cls].s;
  const sk_sk = ["Woodcutting", "Mining", "Fishing", "Cooking", "Farming"].includes(P.lst_s)
    ? P.lst_s
    : "Woodcutting";
  const xp_pct = (s) => {
    const L = lv(s);
    return L == MAX_SKILL_LEVEL
      ? 1
      : Math.max(0, Math.min(1, (xp[s] - xpt[L]) / (xpt[L + 1] - xpt[L])));
  };
  F("rgba(30,20,10,.75)", 6, 74, 160, 20);
  F("#a33", 8, 76, 156 * xp_pct(cb_sk), 16);
  g.fillStyle = "#fff";
  g.fillText("CBT: " + cb_sk.slice(0, 3), 12, 88);
  F("rgba(30,20,10,.75)", 6, 98, 160, 20);
  F("#3a3", 8, 100, 156 * xp_pct(sk_sk), 16);
  g.fillStyle = "#fff";
  g.fillText("SKL: " + sk_sk.slice(0, 3), 12, 112);

  drawBadge(mh);
  const AK = P.act && { tree: "axe", rock: "pick", fish: "rod", attack: P.w }[P.act.k];
  if (AM[P.w]) {
    F("rgba(30,20,10,.75)", 6, 122, 120, 16);
    g.textAlign = "left";
    g.fillStyle = "#fff";
    g.font = "bold 12px monospace";
    g.fillText(AM[P.w] + ": " + count(AM[P.w]), 12, 134);
    g.textAlign = "center";
  }

  g.font = "bold 12px monospace";
  g.fillStyle = "#ffd54f";
  const SR = spellRect();
  g.fillText("Spell Bar", LW / 2, SR.stY - 8);
  const sks = CL_SKILLS[cls];
  const bW = SR.bW,
    bH = SR.bH,
    gap = SR.gap,
    stX = SR.stX,
    stY = SR.stY;
  for (let i = 0; i < 3; i++) {
    const S = sks[i],
      L = S.lv,
      levelMet = lv(CL[cls].s) >= L,
      learned = learnedSkills[cls][i],
      unl = levelMet && learned,
      px = stX + i * (bW + gap);
    F("rgba(40,28,16,.88)", px, stY, bW, bH);
    g.strokeStyle = unl ? (P_SK[i] == 0 ? "#ffd54f" : "#888") : "#444";
    g.lineWidth = 2;
    g.strokeRect(px + 1, stY + 1, bW - 2, bH - 2);
    g.fillStyle = unl ? "#fff" : "#666";
    g.font = "10px monospace";
    g.fillText(S.n, px + bW / 2, stY + 21);
    if (!levelMet) g.fillText("Lv" + L, px + bW / 2, stY + 11);
    else if (!learned) g.fillText("Learn", px + bW / 2, stY + 11);
    else if (P_SK[i] > 0) {
      F("rgba(0,0,0,.5)", px, stY, bW, bH);
      g.fillStyle = "#fff";
      g.fillText(Math.ceil(P_SK[i] * 0.6) + "s", px + bW / 2, stY + 12);
    } else if (cls == "Mage" || cls == "Ranger") {
      g.fillStyle = "#0cf";
      g.font = "9px monospace";
      g.fillText(S.m * 4 + "MP", px + bW / 2, stY + 32);
    } else if (cls == "Warrior" && RAGE_COST[i]) {
      g.fillStyle = (P.rage || 0) >= RAGE_COST[i] ? "#ff8a4a" : "#a05030";
      g.font = "9px monospace";
      g.fillText(RAGE_COST[i] + "R", px + bW / 2, stY + 32);
    }
  }
  drawHotbar();
  if (dirty) {
    ui();
    dirty = false;
  }
  requestAnimationFrame(draw);
}
