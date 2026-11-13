/* Oak & Iron - Object rendering, HUD badge, health bars (sections 43-45). Loaded in order by index.html. */

/* ==========================================================================
 * 43. OBJECT RENDERING
 * Draws resource nodes, island scenery, houses, item piles and plots.
 * ========================================================================== */
function dobj(o) {
  const x = o.x * T,
    y = o.y * T;
  if (o.type == "tree") {
    sh_(x + 12, y + 21, 10);
    F(O, x + 9, y + 11, 6, 11);
    F("#7a4a24", x + 10, y + 11, 4, 10);
    if (!o.alive) return;
    const s = Math.sin(tm / 700 + o.x) * 1;
    g.fillStyle = O;
    g.beginPath();
    g.arc(x + 12 + s, y + 5, 11, 0, 6.3);
    g.fill();
    g.fillStyle = TR[o.tier].c;
    g.beginPath();
    g.arc(x + 12 + s, y + 5, 9, 0, 6.3);
    g.fill();
    g.fillStyle = TR[o.tier].h;
    g.beginPath();
    g.arc(x + 9 + s, y + 2, 5, 0, 6.3);
    g.fill();
    if (CFG.gfx) {
      g.fillStyle = "rgba(0,0,0,.18)";
      g.beginPath();
      g.arc(x + 15 + s, y + 9, 6, 0, 6.3);
      g.fill();
      g.fillStyle = TR[o.tier].h;
      g.fillRect(x + 14 + s, y + 1, 2, 2);
      g.fillRect(x + 7 + s, y + 7, 2, 2);
    }
  } else if (o.type == "rock") {
    sh_(x + 12, y + 20, 9);
    if (o.alive) {
      F(O, x + 3, y + 7, 18, 13);
      F("#8a8a8a", x + 4, y + 8, 16, 11);
      F("#aaa", x + 6, y + 9, 8, 4);
      const oreColor = {
        "Tin ore": "#d4d8dc",
        Clay: "#dfb69a",
        "Silver ore": "#f7f7f7",
        "Gold ore": "#fff1a1",
        "Adamantite ore": "#b3e1a4",
        "Runite ore": "#f0a3b0",
        Coal: "#777",
      }[o.mineOre] || RK[o.tier].c;
      F(oreColor, x + 14, y + 13, 3, 3);
      F(oreColor, x + 7, y + 15, 3, 2);
    } else {
      F(O, x + 5, y + 14, 14, 6);
      F("#666", x + 6, y + 15, 12, 4);
    }
  } else if (o.type == "herbPatch") {
    sh_(x + 12, y + 21, 8);
    if (o.alive) {
      F("#47652e", x + 4, y + 15, 16, 5);
      F("#6e963a", x + 6, y + 10, 4, 9);
      F("#81ad45", x + 10, y + 7, 4, 12);
      F("#5e8535", x + 14, y + 11, 4, 8);
      F("#a8c85b", x + 7, y + 8, 2, 3);
      F("#d6c57a", x + 11, y + 5, 2, 3);
    } else F("#47652e", x + 6, y + 17, 12, 2);
  } else if (o.type == "berryBush") {
    sh_(x + 12, y + 21, 9);
    F(O, x + 3, y + 9, 18, 12);
    F("#3f7735", x + 4, y + 10, 16, 10);
    F("#5b9b42", x + 6, y + 7, 12, 8);
    if (o.alive) {
      F("#c83d54", x + 6, y + 11, 3, 3);
      F("#e85568", x + 13, y + 9, 3, 3);
      F("#b82c49", x + 11, y + 15, 3, 3);
    }
  } else if (o.type == "scenery") {
    if (o.style == "tree") {
      const sway = Math.sin(tm / 950 + o.x * 0.7 + o.y) * 1.5;
      sh_(x + 12, y + 22, 10);
      F("#684525", x + 9, y + 12, 7, 11);
      F("#84572f", x + 11, y + 11, 4, 10);
      F("#214d2c", x + 2 + sway, y + 3, 20, 13);
      F("#34733a", x + 4 + sway, y + 1, 16, 13);
      F("#4b8a43", x + 7 + sway, y + 2, 9, 8);
      F("#79a94f", x + 7 + sway, y + 3, 4, 3);
      F("#5e9848", x + 15 + sway, y + 7, 4, 3);
    } else if (o.style == "flowers") {
      const sway = Math.sin(tm / 360 + o.x * 2) * 1.2;
      F("#2d7b35", x + 4, y + 11, 2, 9);
      F("#3b9140", x + 10 + sway, y + 8, 2, 12);
      F("#2d7b35", x + 16 + sway, y + 12, 2, 8);
      F("#f7d75c", x + 3, y + 8, 4, 4);
      F("#f3f0d7", x + 9 + sway, y + 5, 4, 4);
      F("#ec7ca8", x + 15 + sway, y + 9, 4, 4);
    } else if (o.style == "mushrooms") {
      F("#f1e6c8", x + 5, y + 13, 3, 7);
      F("#d6af75", x + 3, y + 11, 7, 4);
      F("#f1e6c8", x + 14, y + 15, 3, 5);
      F("#a85442", x + 12, y + 13, 7, 4);
      F("#fff0d6", x + 14, y + 14, 1, 1);
    } else if (o.style == "driftwood") {
      F("#876441", x + 3, y + 15, 18, 4);
      F("#b28a5b", x + 5, y + 13, 14, 3);
      F("#684a32", x + 7, y + 17, 2, 2);
      F("#684a32", x + 17, y + 13, 2, 2);
    } else if (o.style == "crystal") {
      F("#33516d", x + 5, y + 17, 14, 4);
      F("#83c9e8", x + 7, y + 9, 4, 10);
      F("#b4efff", x + 8, y + 7, 2, 3);
      F("#5899c5", x + 13, y + 12, 4, 7);
      F("#d5f8ff", x + 14, y + 10, 2, 3);
    } else {
      F("#51483f", x + 3, y + 17, 18, 4);
      F("#777064", x + 5, y + 12, 14, 6);
      F("#8b8374", x + 8, y + 8, 8, 5);
      F("#b0a58e", x + 10, y + 9, 3, 2);
    }
  } else if (o.type == "villageProp") {
    const wood = "#704626",
      darkWood = "#422b1c",
      plank = "#aa7540",
      light = "#d1a05b";
    sh_(x + 12, y + 21, 10);
    if (o.style == "stall" || o.style == "fishStall") {
      const awning = o.style == "fishStall" ? ["#3c8294", "#e7d8b0"] : ["#b84c37", "#f0d7a4"];
      F(darkWood, x + 3, y + 9, 18, 12);
      F(plank, x + 4, y + 10, 16, 8);
      F(wood, x + 5, y + 18, 2, 4);
      F(wood, x + 17, y + 18, 2, 4);
      F(darkWood, x + 1, y + 5, 22, 5);
      for (let i = 0; i < 5; i++)
        F(awning[i % 2], x + 2 + i * 4, y + 2, 4, 5);
      F(awning[0], x + 2, y + 6, 20, 2);
      if (o.style == "fishStall") {
        F("#d5e5dc", x + 7, y + 11, 4, 3);
        F("#8fc4d2", x + 13, y + 12, 4, 3);
        F("#263b43", x + 10, y + 12, 1, 1);
        F("#263b43", x + 16, y + 13, 1, 1);
      } else {
        F("#e3b948", x + 7, y + 11, 3, 3);
        F("#62934a", x + 12, y + 12, 3, 3);
        F("#b84c37", x + 16, y + 11, 3, 3);
      }
    } else if (["cart", "produceCart", "oreCart", "fishCart"].includes(o.style)) {
      const cargo =
        o.style == "produceCart" ? "#6d9c43" : o.style == "oreCart" ? "#8b8b83" : o.style == "fishCart" ? "#7baeb1" : "#b68a50";
      F(darkWood, x + 3, y + 17, 18, 3);
      F(wood, x + 4, y + 10, 16, 8);
      F(plank, x + 5, y + 11, 14, 6);
      F(darkWood, x + 6, y + 12, 1, 5);
      F(darkWood, x + 11, y + 12, 1, 5);
      F(darkWood, x + 16, y + 12, 1, 5);
      F(cargo, x + 6, y + 7, 5, 5);
      F(cargo, x + 12, y + 6, 5, 6);
      g.fillStyle = darkWood;
      [7, 17].forEach((cx) => {
        g.beginPath();
        g.arc(x + cx, y + 19, 3, 0, Math.PI * 2);
        g.fill();
        g.fillStyle = "#b99a69";
        g.beginPath();
        g.arc(x + cx, y + 19, 1, 0, Math.PI * 2);
        g.fill();
        g.fillStyle = darkWood;
      });
      F(wood, x + 19, y + 11, 4, 2);
    } else if (o.style == "well") {
      F("#716655", x + 3, y + 13, 18, 8);
      F("#93816a", x + 5, y + 14, 14, 6);
      F("#28445a", x + 7, y + 15, 10, 4);
      F(wood, x + 4, y + 6, 3, 9);
      F(wood, x + 17, y + 6, 3, 9);
      F(darkWood, x + 3, y + 5, 18, 3);
      F(plank, x + 4, y + 3, 16, 2);
      F(wood, x + 10, y + 5, 3, 2);
      F("#d5c194", x + 11, y + 8, 1, 7);
    } else if (o.style == "windChime") {
      const sway = Math.sin(tm / 180 + o.x) * 2;
      F(wood, x + 4, y + 4, 3, 3);
      F(wood, x + 17, y + 4, 3, 3);
      F(darkWood, x + 5, y + 5, 14, 2);
      F("#d8e8d8", x + 11 + sway, y + 7, 1, 10);
      F("#9ec9be", x + 7 - sway, y + 8, 2, 7);
      F("#d4c492", x + 15 + sway, y + 9, 2, 8);
      F("#f5e3a8", x + 9, y + 17, 7, 2);
    } else if (o.style == "telescope") {
      F(darkWood, x + 10, y + 16, 3, 6);
      F(wood, x + 6, y + 20, 12, 2);
      F("#8a9da0", x + 7, y + 8, 11, 4);
      F("#c89d51", x + 5, y + 7, 3, 6);
      F("#e3bd6c", x + 16, y + 8, 3, 4);
      F("#b9dbe2", x + 8, y + 9, 7, 2);
    } else if (o.style == "campfire") {
      const flame = Math.floor(tm / 180 + o.x) % 2;
      F(darkWood, x + 5, y + 17, 14, 3);
      F(wood, x + 7, y + 15, 10, 3);
      F("#ff6b35", x + 8, y + 10 - flame, 8, 7 + flame);
      F("#ffd05a", x + 10, y + 8 + flame, 4, 7);
      F("#fff0a0", x + 11, y + 10, 2, 3);
      g.globalAlpha = 0.18 + 0.08 * Math.sin(tm / 140 + o.x);
      F("#ffb54d", x + 3, y + 6, 18, 13);
      g.globalAlpha = 1;
    } else if (o.style == "shells") {
      F("#f2c6b5", x + 4, y + 14, 5, 4);
      F("#ec8ea7", x + 6, y + 12, 2, 4);
      F("#f3e5b5", x + 10, y + 16, 6, 4);
      F("#9ed6d0", x + 12, y + 14, 2, 4);
      F("#e8bf81", x + 17, y + 13, 4, 5);
      F("#fff1d2", x + 18, y + 14, 2, 2);
    } else if (o.style == "dummy") {
      F(darkWood, x + 11, y + 10, 3, 12);
      F(wood, x + 6, y + 9, 13, 3);
      F("#b68a50", x + 7, y + 5, 11, 13);
      F("#d1a05b", x + 9, y + 7, 7, 8);
      F("#513b27", x + 10, y + 9, 2, 2);
      F("#513b27", x + 14, y + 9, 2, 2);
      F(darkWood, x + 5, y + 20, 16, 2);
    } else if (o.style == "lantern") {
      F(darkWood, x + 10, y + 8, 4, 14);
      F(wood, x + 11, y + 4, 2, 5);
      F(darkWood, x + 7, y + 3, 10, 2);
      F("#d6aa59", x + 8, y + 5, 8, 6);
      F("#ffec9e", x + 10, y + 6, 4, 4);
      F("#d6aa59", x + 7, y + 11, 10, 2);
      g.globalAlpha = 0.22 + 0.08 * Math.sin(tm / 300 + o.x);
      F("#ffdc72", x + 5, y + 3, 14, 12);
      g.globalAlpha = 1;
    } else if (o.style == "crates") {
      F(darkWood, x + 2, y + 12, 10, 9);
      F("#a67843", x + 3, y + 13, 8, 7);
      F(wood, x + 12, y + 8, 10, 13);
      F("#bd8b4e", x + 13, y + 9, 8, 11);
      F(darkWood, x + 14, y + 10, 1, 9);
      F(darkWood, x + 19, y + 10, 1, 9);
      F(darkWood, x + 13, y + 14, 8, 1);
    } else if (o.style == "bench") {
      F(darkWood, x + 4, y + 10, 16, 5);
      F(plank, x + 5, y + 11, 14, 3);
      F(wood, x + 6, y + 15, 2, 6);
      F(wood, x + 16, y + 15, 2, 6);
      F(light, x + 6, y + 11, 12, 1);
    } else if (o.style == "planter") {
      F(darkWood, x + 4, y + 14, 16, 7);
      F(plank, x + 5, y + 15, 14, 5);
      F("#513b27", x + 6, y + 14, 12, 2);
      F("#3f7735", x + 7, y + 9, 3, 6);
      F("#5b9b42", x + 11, y + 7, 3, 8);
      F("#3f7735", x + 15, y + 10, 3, 5);
      F("#e8bf55", x + 7, y + 7, 3, 3);
      F("#e989a7", x + 11, y + 5, 3, 3);
      F("#fff0d6", x + 15, y + 8, 3, 3);
    } else if (o.style == "anvil") {
      F(darkWood, x + 5, y + 18, 14, 3);
      F("#626b70", x + 7, y + 12, 10, 7);
      F("#aeb6b7", x + 5, y + 9, 14, 4);
      F("#d6dddd", x + 7, y + 7, 10, 3);
      F("#4b5357", x + 10, y + 13, 4, 2);
    } else if (o.style == "sign") {
      F(wood, x + 11, y + 10, 3, 12);
      F(darkWood, x + 3, y + 4, 19, 9);
      F(plank, x + 4, y + 5, 17, 7);
      F("#f2dfad", x + 6, y + 7, 9, 1);
      F("#f2dfad", x + 8, y + 9, 8, 1);
      F(wood, x + 7, y + 13, 11, 2);
    } else if (o.style == "netRack") {
      F(wood, x + 3, y + 5, 3, 17);
      F(wood, x + 18, y + 5, 3, 17);
      F(darkWood, x + 4, y + 5, 16, 3);
      F("#9ab6a5", x + 6, y + 9, 12, 10);
      for (let i = 0; i < 4; i++) {
        F("#5f8478", x + 6 + i * 3, y + 9, 1, 10);
        F("#5f8478", x + 6, y + 9 + i * 3, 12, 1);
      }
    } else {
      F(darkWood, x + 5, y + 5, 14, 17);
      F("#9b7041", x + 6, y + 6, 12, 15);
      F("#d0a15b", x + 6, y + 8, 12, 2);
      F("#d0a15b", x + 6, y + 17, 12, 2);
      F("#694524", x + 8, y + 10, 8, 6);
    }
  } else if (o.type == "furnace") {
    sh_(x + 12, y + 21, 10);
    F(O, x + 3, y + 8, 18, 14);
    F("#71685d", x + 4, y + 9, 16, 11);
    F("#45413c", x + 7, y + 15, 10, 7);
    F(Math.floor(tm / 180) % 2 ? "#ff9d32" : "#ffd15a", x + 9, y + 16, 6, 5);
    F("#3b3733", x + 5, y + 5, 14, 4);
    F("#8d8171", x + 8, y + 2, 8, 4);
  } else if (o.type == "anvil") {
    sh_(x + 12, y + 21, 10);
    F("#422b1c", x + 5, y + 18, 14, 3);
    F("#626b70", x + 7, y + 12, 10, 7);
    F("#aeb6b7", x + 5, y + 9, 14, 4);
    F("#d6dddd", x + 7, y + 7, 10, 3);
    F("#4b5357", x + 10, y + 13, 4, 2);
  } else if (o.type == "craftingBench") {
    sh_(x + 12, y + 21, 10);
    F("#593820", x + 3, y + 10, 18, 4);
    F("#9b6336", x + 4, y + 8, 16, 4);
    F("#d5a25e", x + 6, y + 9, 8, 1);
    F("#593820", x + 5, y + 13, 3, 8);
    F("#593820", x + 16, y + 13, 3, 8);
    F("#e6d9bb", x + 10, y + 6, 6, 2);
    F("#ad573d", x + 12, y + 7, 2, 1);
  } else if (o.type == "mineEntrance" || o.type == "mineExit") {
    sh_(x + 12, y + 21, 10);
    F(O, x + 1, y + 7, 22, 16);
    F("#71685d", x + 2, y + 7, 20, 14);
    F("#30271f", x + 5, y + 9, 14, 13);
    F("#1b1714", x + 7, y + 12, 10, 10);
    F("#d6aa59", x + 4, y + 5, 4, 3);
    F("#d6aa59", x + 16, y + 5, 4, 3);
  } else if (o.type == "range") {
    sh_(x + 12, y + 21, 10);
    F(O, x + 1, y + 5, 22, 16);
    F("#666", x + 2, y + 7, 20, 13);
    F("#333", x + 2, y + 5, 20, 3);
    F(Math.floor(tm / 150) % 2 ? "#ff8a00" : "#ffcc00", x + 7, y + 10, 10, 6);
    F("#ff4400", x + 10, y + 12, 4, 3);
  } else if (o.type == "plot") {
    F(O, x + 1, y + 4, 22, 18);
    F("#7a4f2a", x + 2, y + 5, 20, 16);
    F("#5e3b1f", x + 2, y + 9, 20, 2);
    F("#5e3b1f", x + 2, y + 15, 20, 2);
    if (o.st) {
      const r = tickN - o.g >= GROW ? 2 : tickN - o.g >= GROW / 2 ? 1 : 0;
      for (let i = 0; i < 3; i++) {
        F("#4caf50", x + 5 + i * 6, y + 11 - r * 2, 3, 4 + r * 2);
        if (r == 2) F("#e8c86a", x + 5 + i * 6, y + 8, 3, 3);
      }
    }
  } else if (o.type == "counter") {
    sh_(x + 12, y + 21, 11);
    F(O, x + 1, y + 6, 22, 14);
    F("#a0743f", x + 2, y + 7, 20, 12);
    F("#c9a66b", x + 2, y + 7, 20, 3);
    F("#ffd54f", x + 17, y + 12, 3, 3);
  } else if (o.type == "table") {
    sh_(x + 12, y + 20, 9);
    F(O, x + 2, y + 8, 20, 10);
    F("#a0743f", x + 3, y + 9, 18, 8);
    F(O, x + 4, y + 17, 3, 4);
    F(O, x + 17, y + 17, 3, 4);
  } else if (o.type == "shelf") {
    F(O, x + 3, y + 2, 18, 21);
    F("#8b5a2b", x + 4, y + 3, 16, 19);
    F("#5a3b22", x + 4, y + 10, 16, 1);
    F("#c0452f", x + 6, y + 5, 3, 4);
    F("#3a6fb5", x + 10, y + 5, 3, 4);
    F("#f2b632", x + 14, y + 5, 3, 4);
    F("#3e8e2f", x + 6, y + 13, 3, 4);
    F("#8e55c2", x + 12, y + 13, 4, 4);
  } else if (o.type == "barrel") {
    sh_(x + 12, y + 21, 8);
    F(O, x + 5, y + 4, 14, 18);
    F("#8b5a2b", x + 6, y + 5, 12, 16);
    F("#5a3b22", x + 6, y + 9, 12, 1);
    F("#5a3b22", x + 6, y + 16, 12, 1);
  } else {
    g.strokeStyle = "#d6efff";
    g.lineWidth = 1;
    g.beginPath();
    g.arc(x + 12, y + 12, 3 + ((tm / 200) % 5), 0, 6.3);
    g.stroke();
    F("#ffe9c0", x + 10 + Math.floor(Math.sin(tm / 200) * 3), y + 11, 4, 2);
  }
}

/* ==========================================================================
 * 44. HUD BADGE
 * Top-right player plaque: stats, HP/MP bars and combat level.
 * ========================================================================== */
function drawBadge(mh) {
  const x0 = LW - 178,
    y0 = 6,
    bx = x0 + 7,
    by = y0 + 8,
    mm = lv("Magic") * 2 + 10,
    hp = Math.max(0, P.hp),
    mp = Math.max(0, P.mp);
  F(O, x0 - 2, y0 - 2, 174, 68);
  F("#c9a050", x0, y0, 170, 64);
  F("rgba(34,22,12,.95)", x0 + 2, y0 + 2, 166, 60);
  F(O, bx - 2, by - 2, 52, 52);
  const gr = g.createLinearGradient(0, by, 0, by + 48);
  gr.addColorStop(0, "#5d93c7");
  gr.addColorStop(1, "#a8d4e8");
  g.save();
  g.beginPath();
  g.rect(bx, by, 48, 48);
  g.clip();
  F(gr, bx, by, 48, 48);
  g.translate(bx, by);
  g.scale(3, 3);
  ch(g, -4, 1, look, 0, 0);
  drawWornGear(g, -4, 1, 0);
  g.restore();
  g.strokeStyle = "#ffd54f";
  g.lineWidth = 2;
  g.strokeRect(bx - 1, by - 1, 50, 50);
  g.fillStyle = O;
  g.beginPath();
  g.arc(bx + 42, by + 42, 11, 0, 6.3);
  g.fill();
  g.fillStyle = "#ffd54f";
  g.beginPath();
  g.arc(bx + 42, by + 42, 9, 0, 6.3);
  g.fill();
  g.fillStyle = "#2b1d14";
  g.font = "bold 12px monospace";
  g.textAlign = "center";
  g.fillText(cmb(), bx + 42, by + 46);
  const nx = x0 + 64,
    bw = 98;
  g.textAlign = "left";
  g.fillStyle = "#ffd54f";
  g.font = "bold 12px monospace";
  g.fillText(pname.slice(0, 12), nx, y0 + 17);
  const br = (y, h, bg, fg, v, m, t) => {
    F(O, nx - 1, y - 1, bw + 2, h + 2);
    F(bg, nx, y, bw, h);
    F(fg, nx, y, bw * Math.max(0, Math.min(1, v / m)), h);
    g.fillStyle = "#fff";
    g.font = "bold 10px monospace";
    g.textAlign = "center";
    g.fillText(t + " " + Math.round(v) + "/" + m, nx + bw / 2, y + h - 2);
  };
  br(y0 + 23, 14, "#600", "#2ea02e", hp, mh, "HP");
  if (cls == "Warrior") br(y0 + 40, 11, "#2a0a04", "#d8421e", Math.max(0, P.rage || 0), RAGE_MAX, "RAGE");
  else br(y0 + 40, 11, "#003", "#2a6edb", mp, mm, "MP");
  F(O, nx - 1, y0 + 54, bw + 2, 6);
  F("#552", nx, y0 + 55, bw, 4);
  F("#fc3", nx, y0 + 55, (bw * P.en) / 100, 4);
  g.textAlign = "center";
}
/* ==========================================================================
 * 45. HEALTH BARS
 * Floating enemy health bar.
 * ========================================================================== */
function bar(e, x, y, hp, mx) {
  if (e.hb < tm) return;
  F(O, x + 3, y - 5, 18, 5);
  F("#c00", x + 4, y - 4, 16, 3);
  F("#0c0", x + 4, y - 4, (16 * Math.max(0, hp)) / mx, 3);
}
/* ==========================================================================
   ATTACK ANIMATIONS — weapon poses, projectiles in flight
   ========================================================================== */
const clamp01 = (t) => (t < 0 ? 0 : t > 1 ? 1 : t),
  ease = (t) => ((t = clamp01(t)), t * t * (3 - 2 * t)),
  lerp = (a, b, t) => a + (b - a) * t,
  nearAng = (a, ref) => {
    while (a - ref > Math.PI) a -= Math.PI * 2;
    while (ref - a > Math.PI) a += Math.PI * 2;
    return a;
  };
/* Piecewise keyframes: [[time, value], ...] with smooth easing between keys. */
function keys(k, p) {
  if (p <= k[0][0]) return k[0][1];
  for (let i = 1; i < k.length; i++)
    if (p <= k[i][0]) return lerp(k[i - 1][1], k[i][1], ease((p - k[i - 1][0]) / (k[i][0] - k[i - 1][0])));
  return k[k.length - 1][1];
}
const WLEN = { sword: 15, mace: 16, dagger: 9, spear: 24, staff: 21, wand: 13, bow: 0, xbow: 0 };
/* Returns how the player/weapon should be posed right now for the active attack. */
function attackPose(a, now, I) {
  const live = a.t && !a.t.dead,
    tx = live ? I(a.t, "x") : a.tx,
    ty = live ? I(a.t, "y") : a.ty,
    ang = Math.atan2(ty - a.y, tx - a.x),
    dist = Math.hypot(tx - a.x, ty - a.y) * T,
    sgn = Math.cos(ang) < -0.1 ? -1 : 1,
    p = clamp01((now - a.s) / (a.e - a.s)),
    hp = (a.hit - a.s) / (a.e - a.s),
    rp = (a.rel - a.s) / (a.e - a.s),
    o = { ang, sgn, p, wAng: ang, lunge: 0, ext: 0, pull: 0, glow: 0, trail: null, nocked: false, snap: 0 };
  if (a.kind == "swing" || a.kind == "bash") {
    const up = -2.3,
      k = [
        [0, -0.6],
        [hp * 0.6, up],
        [hp, 0],
        [Math.min(0.95, hp + 0.14), 0.95],
        [1, -0.6],
      ];
    o.wAng = ang + sgn * keys(k, p);
    o.lunge = 5 * Math.sin(Math.PI * clamp01((p - hp * 0.45) / (hp * 1.1)));
    if (p > hp * 0.6 && p < hp + 0.2) o.trail = { a0: ang + sgn * up, a1: o.wAng, f: p < hp ? 1 : 1 - (p - hp) / 0.2 };
  } else if (a.kind == "thrust") {
    const reach = Math.max(4, dist - 10 - (WLEN[a.w] || 12) - 6);
    o.ext = keys(
      [
        [0, 0],
        [hp * 0.6, -5],
        [hp, reach],
        [Math.min(0.95, hp + 0.12), reach],
        [1, 0],
      ],
      p
    );
    o.lunge = 3 * Math.sin(Math.PI * clamp01((p - hp * 0.5) / hp));
  } else if (a.kind == "shoot" || a.kind == "crossbow") {
    o.nocked = now < a.rel;
    o.pull = o.nocked ? ease(p / rp) : 0;
    if (!o.nocked) {
      const q = (now - a.rel) / 160;
      if (q < 1) o.snap = (1 - q) * Math.sin(q * 30) * 3;
      o.lunge = -2 * Math.max(0, 1 - (now - a.rel) / 140);
    } else o.lunge = -1.5 * o.pull;
  } else if (a.kind == "cast") {
    const up = -Math.PI / 2 + sgn * 0.45,
      back = up - sgn * 0.35,
      aim = nearAng(ang, back);
    if (now < a.rel) {
      o.wAng = lerp(up, back, ease(p / rp));
      o.glow = ease(p / rp);
    } else {
      const q = (now - a.rel) / 100;
      o.wAng = q < 1 ? lerp(back, aim, ease(q)) : lerp(aim, up, ease((p - rp) / (1 - rp) - 0.3));
      o.ext = q < 1 ? 4 * ease(q) : 4 * (1 - ease((p - rp) / (1 - rp)));
      o.glow = Math.max(0, 1 - q);
      o.lunge = 2 * Math.max(0, 1 - Math.abs(q - 1));
    }
  }
  return o;
}
function attackPivot(px, py, o, w) {
  const r = w == "bow" || w == "xbow" ? 7 : 5;
  return [px + 12 + Math.cos(o.ang) * r, py + 13 + Math.sin(o.ang) * r];
}
function drawArrowShape(g, len, tint) {
  F("#d9c08a", -len + 4, -0.5, len, 1);
  g.fillStyle = tint || "#b8bcc6";
  g.beginPath();
  g.moveTo(4, -2);
  g.lineTo(8, 0);
  g.lineTo(4, 2);
  g.fill();
  F("#c33", -len + 3, -2, 3, 1);
  F("#eee", -len + 3, 1, 3, 1);
}
function drawAttackWeapon(g, px, py, a, o, now) {
  const w = a.w,
    c = TC[Math.max(0, gear[w] || 0)] || "#ccc",
    [hx, hy] = attackPivot(px, py, o, w);
  if (o.trail && o.trail.f > 0) {
    const L = 5 + (WLEN[w] || 14) + o.lunge,
      a0 = Math.min(o.trail.a0, o.trail.a1),
      a1 = Math.max(o.trail.a0, o.trail.a1);
    g.globalAlpha = 0.45 * o.trail.f;
    g.strokeStyle = w == "staff" ? "#e2c6ff" : "#fff";
    g.lineWidth = 5;
    g.beginPath();
    g.arc(hx, hy, L, Math.max(a0, a1 - 2.2), a1);
    g.stroke();
    g.globalAlpha = 0.2 * o.trail.f;
    g.lineWidth = 3;
    g.beginPath();
    g.arc(hx, hy, L - 5, Math.max(a0, a1 - 2.2), a1);
    g.stroke();
    g.globalAlpha = 1;
  }
  g.save();
  g.translate(hx, hy);
  g.rotate(o.wAng);
  g.translate(o.ext, 0);
  if (w == "sword") {
    F("#5a3a1e", -4, -1, 4, 2);
    F("#555", 0, -3, 2, 6);
    F(O, 2, -2, 14, 4);
    F(c, 2, -1, 13, 2);
    F("#fff", 4, -1, 8, 1);
  } else if (w == "mace") {
    F("#6b4423", -3, -1, 14, 2);
    F(O, 10, -4, 8, 8);
    F(c, 11, -3, 6, 6);
  } else if (w == "dagger") {
    F("#6b4423", -3, -1, 3, 2);
    F("#555", 0, -2, 1, 4);
    F(O, 1, -2, 8, 4);
    F(c, 1, -1, 7, 2);
  } else if (w == "spear") {
    F("#6b4423", -8, -1, 26, 2);
    F(O, 18, -3, 6, 6);
    F(c, 18, -2, 5, 4);
    F(c, 23, -1, 2, 2);
  } else if (w == "staff" || w == "wand") {
    const L = w == "wand" ? 10 : 15,
      col = w == "wand" ? "#ffe97a" : "#c07bff";
    F("#6b4423", w == "wand" ? -3 : -8, -1, L + (w == "wand" ? 3 : 8), 2);
    if (o.glow > 0) {
      g.globalAlpha = 0.35 * o.glow;
      g.fillStyle = col;
      g.beginPath();
      g.arc(L + 3, 0, 3 + o.glow * 5 + Math.sin(now / 40), 0, 6.3);
      g.fill();
      g.globalAlpha = 1;
      for (let k = 0; k < 4; k++) {
        const sa = now / 120 + k * 1.57,
          sd = 12 * (1 - ((now / 300 + k / 4) % 1));
        F(col, L + 3 + Math.cos(sa) * sd - 1, Math.sin(sa) * sd - 1, 2, 2);
      }
    }
    F(O, L, -3, 6, 6);
    F(col, L + 1, -2, 4, 4);
    F("#fff", L + 2, -2, 1, 1);
  } else if (w == "bow") {
    const tipX = 1.5,
      tipY = 9.5,
      sx = tipX - o.pull * 10 + o.snap;
    g.strokeStyle = O;
    g.lineWidth = 3;
    g.beginPath();
    g.arc(-4, 0, 11, -1.05, 1.05);
    g.stroke();
    g.strokeStyle = "#9b6a35";
    g.lineWidth = 2;
    g.beginPath();
    g.arc(-4, 0, 11, -1.05, 1.05);
    g.stroke();
    g.strokeStyle = "#eee";
    g.lineWidth = 1;
    g.beginPath();
    g.moveTo(tipX, -tipY);
    g.lineTo(sx, 0);
    g.lineTo(tipX, tipY);
    g.stroke();
    if (o.nocked) {
      g.save();
      g.translate(sx + 13, 0);
      drawArrowShape(g, 16);
      g.restore();
      F("#f1c27d", sx - 2, -1.5, 3, 3);
    }
  } else if (w == "xbow") {
    const sx = 6 - (o.nocked ? 6 : o.pull * 6) + o.snap;
    F("#6b4423", -6, -1.5, 15, 3);
    F("#8b5a2b", 6, -8, 2, 16);
    g.strokeStyle = "#eee";
    g.lineWidth = 1;
    g.beginPath();
    g.moveTo(7, -8);
    g.lineTo(sx, 0);
    g.lineTo(7, 8);
    g.stroke();
    if (o.nocked) F("#ccc", 1, -0.5, 10, 1);
  }
  g.restore();
}
/* Arrows, crossbow bolts and staff orbs travel from the weapon to the (moving) target. */
function drawShots(g, now, I) {
  for (let i = shots.length - 1; i >= 0; i--) {
    const q = shots[i],
      over = q.miss ? 0.3 : 0;
    let f = (now - q.s) / (q.e - q.s);
    if (f > 1 + over) {
      shots.splice(i, 1);
      continue;
    }
    if (f < 0) continue;
    const live = q.t && !q.t.dead,
      ex0 = (live ? I(q.t, "x") : q.tx) * T + 12,
      ey0 = (live ? I(q.t, "y") : q.ty) * T + 12,
      sx0 = q.sx * T + 12,
      sy0 = q.sy * T + 13,
      ang0 = Math.atan2(ey0 - sy0, ex0 - sx0),
      lead = q.kind == "orb" ? 22 : 12,
      sx = sx0 + Math.cos(ang0) * lead,
      sy = sy0 + Math.sin(ang0) * lead + (q.kind == "orb" ? -8 : 0),
      off = q.miss ? 9 + q.r * 6 : 0,
      ex = ex0 - Math.sin(ang0) * off * (q.r > 0.5 ? 1 : -1),
      ey = ey0 + Math.cos(ang0) * off * (q.r > 0.5 ? 1 : -1),
      dist = Math.hypot(ex - sx, ey - sy),
      lift = q.kind == "arrow" ? Math.min(16, dist * 0.12) : q.kind == "bolt" ? Math.min(4, dist * 0.03) : 0,
      pos = (t) => {
        const x = lerp(sx, ex, t),
          y = lerp(sy, ey, t) - lift * Math.sin(Math.PI * Math.min(1, t)),
          wob = q.kind == "orb" ? Math.sin(t * 14 + q.r * 6) * 2 : 0;
        return [x - Math.sin(ang0) * wob, y + Math.cos(ang0) * wob];
      },
      [X, Y] = pos(f),
      [X0, Y0] = pos(Math.max(0, f - 0.04)),
      a = Math.atan2(Y - Y0, X - X0) || ang0;
    g.globalAlpha = f > 1 ? 1 - (f - 1) / over : 1;
    if (q.kind == "orb") {
      const col = q.w == "wand" ? "#ffe97a" : "#c07bff";
      for (let k = 5; k >= 1; k--) {
        const [tx, ty] = pos(Math.max(0, f - k * 0.05));
        g.globalAlpha = (0.5 / k) * (f > 1 ? 1 - (f - 1) / over : 1);
        g.fillStyle = col;
        g.beginPath();
        g.arc(tx, ty, 3.5 - k * 0.4, 0, 6.3);
        g.fill();
      }
      g.globalAlpha = f > 1 ? 1 - (f - 1) / over : 1;
      g.fillStyle = O;
      g.beginPath();
      g.arc(X, Y, 4.5, 0, 6.3);
      g.fill();
      g.fillStyle = col;
      g.beginPath();
      g.arc(X, Y, 3.5, 0, 6.3);
      g.fill();
      F("#fff", X - 1, Y - 1, 2, 2);
      if (Math.floor(now / 60) % 2) F(col, X - Math.cos(a) * 8 + (q.r - 0.5) * 6, Y - Math.sin(a) * 8 - 2, 2, 2);
    } else {
      g.save();
      g.translate(X, Y);
      g.rotate(a);
      g.globalAlpha *= 0.35;
      F("#fff", -22, -0.5, 12, 1);
      g.globalAlpha /= 0.35;
      if (q.kind == "bolt") {
        F("#6b4423", -6, -0.5, 10, 1);
        F("#aab", 4, -1, 3, 2);
      } else drawArrowShape(g, 14);
      g.restore();
    }
    g.globalAlpha = 1;
  }
}
/* Small offsets for hit knock-back, dodges and enemies lunging when they bite/strike. */
function enemyOffset(q, now) {
  let ox = 0,
    oy = 0;
  if (q.kb && q.kb.e > now) {
    const k = (q.kb.e - now) / 180;
    ox += q.kb.dx * 4 * k;
    oy += q.kb.dy * 4 * k;
  }
  if (q.dodge && q.dodge.e > now) {
    const k = Math.sin((1 - (q.dodge.e - now) / 220) * Math.PI);
    ox += q.dodge.dx * 5 * k;
    oy += q.dodge.dy * 5 * k;
  }
  if (q.lg && now - q.lg < 260) {
    const k = Math.sin(((now - q.lg) / 260) * Math.PI);
    ox += Math.sign(P.x - q.x) * 6 * k;
    oy += Math.sign(P.y - q.y) * 6 * k;
  }
  return [ox, oy];
}
/* ==========================================================================
 * BUILDING EXTERIORS
 * Each house gets a roof + front facade drawn over its interior, so nobody can see who or
 * what is inside until the player steps onto the doorway. The cover fades out while the
 * player is inside that house.
 * ========================================================================== */
const buildingSignFor = (town, houseIndex) => {
  const occupants = (LN[town.n] || []).filter((a) => a[4] === houseIndex && !(a[1] === "trainer" && ["warrior", "ranger", "mage"].includes(a[3])));
  const labels = occupants.map((a) => {
    if (a[1] === "bank") return "BANK";
    if (a[3] === "gen") return "GENERAL STORE";
    if (a[3] === "arm") return "ARMOURY";
    if (a[3] === "wpn") return "WEAPON SHOP";
    if (a[3] === "farm") return "SUPPLY STORE";
    if (a[3] === "fish") return "FISH MARKET";
    if (a[1] === "trainer" && a[3] === "smith") return "SMITHY";
    if (a[1] === "shop") return "TRADING POST";
    return "VILLAGER'S HOME";
  });
  return labels.find((label) => label !== "VILLAGER'S HOME") || labels[0] || "VILLAGER'S HOME";
};
const HOUSES = TW.flatMap((t, ti) => t.h.map((o, i) => ({ x: t.x + o, y: houseY(t), c: (i + ti * 2) % RCOL.length, sign: buildingSignFor(t, i), a: 1 }))),
  houseAt = (x, y) =>
    !inMine && HOUSES.find((h) => x > h.x && x < h.x + 6 && y >= h.y + 2 && y <= h.y + 7 && (y < h.y + 7 || x == h.x + 3)),
  hiddenAt = (x, y) => {
    const h = houseAt(x, y);
    return !!h && h !== houseAt(P.x, P.y);
  },
  shadeHex = (c, f) => {
    const n = parseInt(c.slice(1), 16),
      m = (v) => Math.max(0, Math.min(255, Math.round(f < 0 ? v * (1 + f) : v + (255 - v) * f)));
    return "#" + ((1 << 24) | (m(n >> 16) << 16) | (m((n >> 8) & 255) << 8) | m(n & 255)).toString(16).slice(1);
  },
  HOUSE_WALL = ["#e3c79a", "#d8c6a2", "#cdb997", "#e7d4b7", "#dfc99b", "#c8c0a3", "#d8b89a", "#c7c9d1"],
  HOUSE_WOOD = ["#7a4a24", "#63452e", "#63452e", "#744331", "#72502f", "#41645c", "#69412c", "#48566f"],
  HOUSE_CURTAIN = ["#b33a3a", "#3a6fb5", "#4f8f3a", "#8e55c2", "#c08a2d", "#2f7c78", "#a0522d", "#596b9a"];
function drawHouseExterior(h, X, Y, now) {
  const roof = RCOL[h.c],
    rl = shadeHex(roof, 0.18),
    rd = shadeHex(roof, -0.25),
    rdd = shadeHex(roof, -0.5),
    wall = HOUSE_WALL[h.c],
    wood = HOUSE_WOOD[h.c],
    beam = "#4f321d",
    W7 = 7 * T,
    fy = Y + 4.5 * T,
    by = Y + 8 * T;
  // ground shadow
  F("rgba(0,0,0,.22)", X + 2, by - 1, W7 - 4, 4);
  // facade
  F(wall, X, fy, W7, by - fy);
  F(shadeHex(wall, -0.08), X, fy + 30, W7, 1);
  F("#7d7468", X, by - 8, W7, 8);
  for (let i = 0; i < 8; i++) F("#9a9184", X + 2 + i * 21 + (i % 2) * 4, by - 7, 15, 3);
  F(beam, X, fy, W7, 5);
  F(beam, X, fy, 6, by - fy - 8);
  F(beam, X + W7 - 6, fy, 6, by - fy - 8);
  F(beam, X + 2.5 * T - 3, fy, 5, by - fy - 8);
  F(beam, X + 4.5 * T - 2, fy, 5, by - fy - 8);
  F(beam, X + 6, fy + 36, 2.5 * T - 9, 4);
  F(beam, X + 4.5 * T + 3, fy + 36, 2.5 * T - 9, 4);
  // lit windows with curtains and flower boxes
  const glow = 0.85 + 0.15 * Math.sin(now / 400 + h.x);
  [X + T + 2, X + 5 * T + 2].forEach((wx, wi) => {
    const wy = fy + 10;
    F(O, wx - 3, wy - 3, 26, 26);
    F(wood, wx - 2, wy - 2, 24, 24);
    F(`rgba(255,${190 + 20 * glow | 0},100,1)`, wx, wy, 20, 20);
    F("#fff1c4", wx + 2, wy + 2, 6, 6);
    F(HOUSE_CURTAIN[(h.c + wi) % 8], wx, wy, 5, 20);
    F(HOUSE_CURTAIN[(h.c + wi) % 8], wx + 15, wy, 5, 20);
    F(wood, wx + 9, wy, 2, 20);
    F(wood, wx, wy + 9, 20, 2);
    F("#6b4226", wx - 3, wy + 22, 26, 5);
    F("#3f7a2e", wx - 2, wy + 20, 24, 3);
    for (let k = 0; k < 5; k++) F(["#e0475b", "#ffd54f", "#f39bd0", "#ffffff", "#e0475b"][(k + h.c) % 5], wx - 1 + k * 5, wy + 18, 3, 3);
  });
  // door, arch, step and lantern
  const dx = X + 3 * T + 1,
    dy = fy + 46,
    dh = by - 8 - dy;
  F("#8a8073", dx - 4, dy - 4, 30, dh + 4);
  F("#8a8073", dx, dy - 7, 22, 3);
  F(O, dx - 1, dy - 1, 24, dh + 1);
  F(wood, dx, dy, 22, dh);
  F(shadeHex(wood, -0.3), dx + 7, dy, 1, dh);
  F(shadeHex(wood, -0.3), dx + 14, dy, 1, dh);
  F("#2b2b2b", dx, dy + 4, 10, 2);
  F("#2b2b2b", dx, dy + dh - 7, 10, 2);
  F("#f2b632", dx + 17, dy + (dh >> 1), 2, 3);
  F("#a39a8c", dx - 5, by - 4, 32, 4);
  F("#2b2b2b", dx + 28, dy - 6, 2, 5);
  F("#3a3a3a", dx + 26, dy - 2, 6, 9);
  F(`rgba(255,200,90,${0.6 + 0.3 * Math.sin(now / 170 + h.y)})`, dx + 27, dy - 1, 4, 7);
  // Exterior sign identifies each shop or service building at a glance.
  const signText = h.sign || "VILLAGER'S HOME";
  g.save();
  g.fillStyle = "#4a2d19";
  g.fillRect(X + 2.05 * T, fy + 25, 2.9 * T, 19);
  g.fillStyle = "#c99a55";
  g.fillRect(X + 2.05 * T + 2, fy + 27, 2.9 * T - 4, 15);
  g.strokeStyle = "#593719";
  g.lineWidth = 2;
  g.strokeRect(X + 2.05 * T + 1, fy + 26, 2.9 * T - 2, 17);
  g.fillStyle = "#382416";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = "bold 8px monospace";
  g.fillText(signText, X + 3.5 * T, fy + 34.5, 2.75 * T - 6);
  g.restore();
  // roof
  const rt = Y - 8,
    rb = fy + 2;
  for (let r = 0, yy = rt; yy < rb; r++, yy += 9) {
    F(r % 2 ? roof : shadeHex(roof, -0.06), X - 6, yy, W7 + 12, Math.min(9, rb - yy));
    F(rl, X - 6, yy, W7 + 12, 1);
    for (let sx = X - 6 + (r % 2 ? 7 : 0); sx < X + W7 + 6; sx += 14) F(rd, sx, yy, 1, Math.min(9, rb - yy));
    if (yy + 8 < rb) F(rd, X - 6, yy + 8, W7 + 12, 1);
  }
  F("rgba(0,0,0,.10)", X + W7 / 2, rt, W7 / 2 + 6, rb - rt);
  F(rdd, X - 7, rt - 3, W7 + 14, 5);
  F(rl, X - 7, rt - 3, W7 + 14, 1);
  F(rdd, X - 7, rt, 3, rb - rt);
  F(rdd, X + W7 + 4, rt, 3, rb - rt);
  F(rdd, X - 7, rb - 2, W7 + 14, 3);
  F("rgba(0,0,0,.3)", X, rb + 1, W7, 4);
  // dormer window
  const mx = X + W7 / 2 - 12,
    my = Y + 38;
  F(rdd, mx - 4, my - 8, 32, 6);
  F(rd, mx, my - 12, 24, 5);
  F(wall, mx, my - 2, 24, 22);
  F(O, mx + 6, my + 2, 12, 13);
  F(`rgba(255,${185 + 25 * glow | 0},95,1)`, mx + 7, my + 3, 10, 11);
  F(wood, mx + 11, my + 3, 2, 11);
  // chimney with smoke
  const cx = X + (h.c % 2 ? 5.3 * T : 0.7 * T);
  F("#6e4b3a", cx, Y - 22, 16, 30);
  F("#5a3b2d", cx, Y - 14, 16, 1);
  F("#5a3b2d", cx, Y - 6, 16, 1);
  F("#5a3b2d", cx + 7, Y - 22, 1, 8);
  F("#4a3329", cx - 2, Y - 25, 20, 4);
  for (let i = 0; i < 3; i++) {
    const p = (now / 1800 + i / 3) % 1,
      s = 6 + p * 8;
    F(`rgba(225,225,225,${0.4 * (1 - p)})`, cx + 5 + Math.sin(p * 6 + i) * 5 - s / 4, Y - 30 - p * 34, s, s);
  }
}
function drawHouseCovers(now) {
  if (inMine) return;
  const ph = houseAt(P.x, P.y),
    vw = cv.width / sc(),
    vh = cv.height / sc();
  for (const h of HOUSES) {
    const target = h === ph ? 0 : 1;
    h.a += (target - h.a) * 0.15;
    if (Math.abs(h.a - target) < 0.02) h.a = target;
    const X = h.x * T,
      Y = h.y * T;
    if (h.a <= 0 || X + 7 * T + 10 < camx || X - 10 > camx + vw || Y + 8 * T < camy || Y - 70 > camy + vh) continue;
    g.globalAlpha = h.a;
    drawHouseExterior(h, X, Y, now);
    g.globalAlpha = 1;
  }
}
/* ==========================================================================
 * CHARACTER ACTION ANIMATIONS
 * Held tools with a tick-synced chop/mine swing, impact chips and sparks, a full
 * fishing cast, weapons carried on the back while walking, and running dust.
 * ========================================================================== */
const AXE_K = [
    [0, -1.2],
    [0.07, 1.3],
    [0.2, 1.05],
    [0.55, -0.6],
    [1, -1.2],
  ],
  PICK_K = [
    [0, -1.7],
    [0.08, 1.5],
    [0.22, 1.25],
    [0.6, -0.9],
    [1, -1.7],
  ],
  ROD_K = [
    [0, -1.05],
    [0.35, -2.3],
    [0.55, -0.35],
    [0.8, -1.0],
    [1, -0.87],
  ];
function drawHeldTool(g, px, py, K, d, gq, now) {
  const c = TC[Math.max(0, gear[K] || 0)];
  g.save();
  if (d == 2) {
    g.translate(2 * (px + 12), 0);
    g.scale(-1, 1);
  }
  const hx = px + 16,
    hy = py + 14,
    rot = gq >= 0 ? keys(K == "pick" ? PICK_K : AXE_K, gq) : Math.sin(now / 300) * 0.08;
  g.translate(hx, hy);
  g.rotate(rot);
  g.translate(-hx, -hy);
  const x = px + 18,
    y = py + 6 + (gq >= 0 ? 0 : Math.sin(now / 300));
  if (K == "axe") {
    F(O, x - 1, y - 5, 4, 17);
    F("#7a5230", x, y - 4, 2, 15);
    F(O, x - 5, y - 8, 7, 8);
    F(c, x - 4, y - 7, 5, 6);
    F("#f2f2f2", x - 5, y - 7, 1, 6);
  } else if (K == "pick") {
    F(O, x - 1, y - 5, 4, 17);
    F("#7a5230", x, y - 4, 2, 15);
    F(O, x - 7, y - 8, 16, 4);
    F(c, x - 6, y - 7, 14, 2);
    F(c, x - 7, y - 6, 2, 2);
    F(c, x + 7, y - 6, 2, 2);
  } else if (K == "sword") {
    F(O, x - 1, y - 8, 4, 14);
    F(c, x, y - 7, 2, 12);
    F("#555", x - 2, y + 5, 6, 2);
  } else if (K == "spear") {
    F("#6b4423", x, y - 12, 2, 22);
    F(c, x - 1, y - 16, 4, 5);
  } else if (K == "bow") {
    F("#8b5a2b", x + 1, y - 8, 2, 16);
    F("#8b5a2b", x - 1, y - 8, 2, 2);
    F("#8b5a2b", x - 1, y + 6, 2, 2);
    F("#ddd", x - 1, y - 6, 1, 12);
  } else if (K == "dagger") {
    F(O, x, y - 4, 4, 9);
    F(c, x + 1, y - 3, 2, 7);
    F("#555", x - 1, y + 4, 6, 1);
    F("#6b4423", x + 1, y + 5, 2, 3);
  } else if (K == "mace") {
    F("#6b4423", x, y - 6, 2, 18);
    F(O, x - 3, y - 12, 8, 8);
    F(c, x - 2, y - 11, 6, 6);
  } else if (K == "wand") {
    F("#6b4423", x, y - 6, 2, 14);
    F("#ffe97a", x - 1, y - 9, 4, 3);
    F("#fff", x, y - 8, 2, 1);
  } else if (K == "xbow") {
    F("#6b4423", x - 2, y - 2, 8, 3);
    F("#8b5a2b", x + 2, y - 8, 2, 12);
    F("#ddd", x + 3, y - 8, 1, 12);
  } else if (K == "staff") {
    F("#6b4423", x, y - 8, 2, 18);
    F("#c07bff", x - 1, y - 12, 4, 4);
    g.globalAlpha = 0.35 + 0.25 * Math.sin(now / 200);
    F("#e6c7ff", x - 2, y - 13, 6, 6);
    g.globalAlpha = 1;
  }
  g.restore();
}
function drawGatherBits(g, a, q, K) {
  if (q < 0.06 || q > 0.5) return;
  const p = (q - 0.06) / 0.44,
    cx = (a.t.x * T + 12) * 0.7 + (P.x * T + 12) * 0.3,
    cy = a.t.y * T + (K == "axe" ? 12 : 10);
  for (let i = 0; i < 6; i++) {
    const an = -Math.PI / 2 + (i - 2.5) * 0.5 + (i % 2 ? 0.2 : -0.2),
      sp = 10 + ((i * 37) % 7),
      x = cx + Math.cos(an) * sp * p,
      y = cy + Math.sin(an) * sp * p * 0.8 + p * p * 16;
    g.globalAlpha = 1 - p;
    if (K == "axe") F(i % 2 ? "#e0bd84" : "#8b5a2b", x, y, 2, 2);
    else if (i < 3) F(p < 0.4 ? "#fff3a0" : "#b5ab9c", x, y, p < 0.4 ? 2 : 1, p < 0.4 ? 2 : 1);
    else F("#8a8279", x, y, 3, 3);
  }
  if (K == "pick" && p < 0.3) {
    g.globalAlpha = 1 - p / 0.3;
    F("#fff", cx - 1, cy - 5, 2, 10);
    F("#fff", cx - 5, cy - 1, 10, 2);
    F("#ffe97a", cx - 2, cy - 2, 4, 4);
  }
  g.globalAlpha = 1;
}
function drawRunDust(g, px, py, d, now) {
  const bx = [0, 0, 1, -1][d],
    by = [-1, 1, 0, 0][d];
  for (let k = 0; k < 3; k++) {
    const p = (now / 320 + k / 3) % 1,
      s = 2 + p * 3;
    g.globalAlpha = 0.4 * (1 - p);
    F("#d8c9a8", px + 12 + bx * (5 + p * 9) - s / 2 + (k - 1) * 2, py + 20 + by * (3 + p * 6) - p * 3 - s / 2, s, s);
  }
  g.globalAlpha = 1;
}
function drawCarried(g, px, py, d, w) {
  const c = TC[Math.max(0, gear[w] || 0)];
  g.save();
  if (w == "mace" || w == "dagger" || w == "wand") {
    g.translate(px + (d == 2 ? 6 : 17), py + 14);
    g.rotate(d == 2 ? 0.35 : -0.35);
    if (w == "mace") {
      F("#6b4423", -1, 0, 2, 9);
      F(O, -3, 7, 6, 5);
      F(c, -2, 8, 4, 3);
    } else if (w == "dagger") {
      F("#4a3220", -2, 0, 4, 7);
      F("#555", -2, -1, 4, 1);
      F("#6b4423", -1, -4, 2, 3);
    } else {
      F("#6b4423", -1, 0, 2, 9);
      F("#ffe97a", -1, -2, 2, 2);
    }
  } else {
    g.translate(px + 12, py + 11);
    g.rotate(d == 2 ? 0.75 : -0.75);
    if (w == "sword") {
      F(O, -3, -7, 6, 18);
      F("#4a3220", -2, -6, 4, 16);
      F("#9a9a9a", -2, 9, 4, 2);
      F("#555", -4, -8, 8, 2);
      F("#6b4423", -1, -12, 2, 4);
      F("#f2b632", -1, -13, 2, 1);
    } else if (w == "spear") {
      F("#6b4423", -1, -16, 2, 30);
      F(O, -2, -21, 4, 6);
      F(c, -1, -20, 2, 4);
    } else if (w == "staff") {
      F("#6b4423", -1, -14, 2, 28);
      F(O, -3, -19, 6, 6);
      F("#c07bff", -2, -18, 4, 4);
      F("#fff", -1, -17, 1, 1);
    } else if (w == "bow") {
      F("#6e4526", -6, -8, 4, 13);
      F("#e8e0c0", -6, -10, 1, 2);
      F("#c94f4f", -5, -11, 1, 3);
      F("#e8e0c0", -4, -10, 1, 2);
      g.strokeStyle = "#8b5a2b";
      g.lineWidth = 2;
      g.beginPath();
      g.arc(-2, 0, 12, -1.15, 1.15);
      g.stroke();
      g.strokeStyle = "#ddd";
      g.lineWidth = 1;
      g.beginPath();
      g.moveTo(-2 + 12 * Math.cos(-1.15), 12 * Math.sin(-1.15));
      g.lineTo(-2 + 12 * Math.cos(1.15), 12 * Math.sin(1.15));
      g.stroke();
    } else if (w == "xbow") {
      F("#6b4423", -1, -8, 2, 14);
      F("#8b5a2b", -6, -7, 12, 2);
      F("#ddd", -6, -5, 12, 1);
    }
  }
  g.restore();
}
function drawFishing(g, px, py, a, now, I) {
  if (P._fa !== a) {
    P._fa = a;
    P._fs = now;
  }
  const cp = clamp01((now - P._fs) / 800),
    mir = P.d == 2,
    hx = px + (mir ? 8 : 16),
    hy = py + 14,
    wx = I(a.t, "x") * T + 12,
    wy = I(a.t, "y") * T + 12,
    nib = (now / 2600 + (a.t.x % 7) / 7) % 1 < 0.07,
    ck = P.catchAt && now - P.catchAt < 700 ? (now - P.catchAt) / 700 : -1,
    ring = (x, y, rx, ry, al) => {
      g.strokeStyle = `rgba(255,255,255,${al})`;
      g.lineWidth = 1;
      g.beginPath();
      g.ellipse(x, y, rx, ry, 0, 0, 6.283);
      g.stroke();
    },
    line = (x0, y0, x1, y1, col, wd) => {
      g.strokeStyle = col;
      g.lineWidth = wd;
      g.beginPath();
      g.moveTo(x0, y0);
      g.lineTo(x1, y1);
      g.stroke();
    };
  let ang = cp < 1 ? keys(ROD_K, cp) : -0.87 + Math.sin(now / 340) * 0.05 + (nib ? 0.14 : 0);
  if (ck >= 0)
    ang = keys(
      [
        [0, -0.87],
        [0.15, -1.9],
        [0.6, -1.6],
        [1, -0.87],
      ],
      ck,
    );
  if (mir) ang = Math.PI - ang;
  const ca = Math.cos(ang),
    sa = Math.sin(ang),
    tx = hx + ca * 20,
    ty = hy + sa * 20;
  g.lineCap = "round";
  line(hx, hy, tx, ty, O, 3.2);
  line(hx, hy, tx, ty, "#a0703f", 2);
  line(hx, hy, hx + ca * 5, hy + sa * 5, "#3a2414", 2.4);
  g.lineCap = "butt";
  F("#9a9a9a", hx + ca * 6 - 1, hy + sa * 6 - 1, 3, 3);
  let bx = wx,
    by = wy + Math.sin(now / 340 + 1) * 1.2 + (nib ? 3 : 0),
    inWater = true;
  if (cp < 0.45) {
    bx = tx;
    by = ty + 4;
    inWater = false;
  } else if (cp < 0.8) {
    const t = (cp - 0.45) / 0.35;
    bx = tx + (wx - tx) * t;
    by = ty + (wy - ty) * t - Math.sin(Math.PI * t) * 22;
    inWater = false;
  }
  g.strokeStyle = "rgba(240,236,220,.9)";
  g.lineWidth = 1;
  g.beginPath();
  g.moveTo(tx, ty);
  g.quadraticCurveTo((tx + bx) / 2, Math.max(ty, by) + (inWater ? 8 : 2), bx, by);
  g.stroke();
  if (inWater) {
    for (let k = 0; k < 2; k++) {
      const rp = (now / 1500 + k / 2) % 1;
      ring(bx, by + 1, 3 + rp * 8, 1.2 + rp * 3, (1 - rp) * 0.5);
    }
    if (nib) ring(bx, by + 1, 6, 2.5, 0.8);
    const sp = clamp01((now - P._fs - 640) / 400);
    if (sp < 1) {
      ring(bx, by + 1, 2 + sp * 12, 1 + sp * 5, 1 - sp);
      g.globalAlpha = 1 - sp;
      for (let k = 0; k < 4; k++) F("#dff4ff", bx - 6 + k * 4, by - sp * 10 * (1 - Math.abs(k - 1.5) / 3) + sp * sp * 8, 1, 2);
      g.globalAlpha = 1;
    }
  }
  F(O, bx - 2, by - 3, 5, 6);
  F("#d0453b", bx - 1, by - 2, 3, 2);
  F("#f3eee0", bx - 1, by, 3, 2);
  if (ck >= 0) {
    const fx = wx + (hx - wx) * ck,
      fy = wy + (hy - 6 - wy) * ck - Math.sin(Math.PI * ck) * 30;
    if (ck < 0.3) ring(wx, wy + 1, 4 + ck * 30, 2 + ck * 12, 1 - ck / 0.3);
    g.save();
    g.translate(fx, fy);
    g.rotate(ck * 9);
    F(O, -5, -2, 10, 5);
    F("#b9d3e0", -4, -1, 7, 3);
    F("#7fa6bb", -4, 1, 7, 1);
    F(O, 4, -3, 3, 7);
    F("#7fa6bb", 5, -2, 1, 5);
    F("#222", -3, -1, 1, 1);
    g.restore();
  }
}
