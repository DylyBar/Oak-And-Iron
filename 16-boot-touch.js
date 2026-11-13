/* Oak & Iron - Boot and mobile touch/long-press/pinch-zoom (sections 55-56). Loaded in order by index.html. */

/* ==========================================================================
 * 55. BOOT
 * Initial canvas fit, first UI build and the very first frame.
 * ========================================================================== */
addEventListener("resize", fitCanvas);
if (window.visualViewport) visualViewport.addEventListener("resize", fitCanvas);
ui();
draw();

/* ==========================================================================
 * 56. MOBILE TOUCH, LONG-PRESS, PINCH-ZOOM & PWA SUPPORT (iOS & Android)
 * ========================================================================== */
let menuTapMode = false;
const actModeBtn = $("act_mode_btn");
if (actModeBtn) {
  actModeBtn.onclick = () => {
    menuTapMode = !menuTapMode;
    actModeBtn.classList.toggle("menu-mode", menuTapMode);
    actModeBtn.innerHTML = UI(menuTapMode ? "menu" : "tap");
    msg(
      menuTapMode
        ? "Tap Mode: Options Menu (taps open the right-click menu)."
        : "Tap Mode: Direct Action (tap to act, long-press for menu)."
    );
  };
}

// Intercept canvas mousedown when Menu Tap Mode is active
cv.addEventListener(
  "mousedown",
  (e) => {
    if (e.button === 0 && started && menuTapMode) {
      const r = cv.getBoundingClientRect();
      const ux = ((e.clientX - r.left) / r.width) * LW,
        uy = ((e.clientY - r.top) / r.height) * LH;
      const onHud = (ux > LW - 182 && uy < 74) || overSpellBar(ux, uy) || overHotbar(ux, uy);
      if (!onHud) {
        e.stopImmediatePropagation();
        const [x, y] = tile(e);
        showM(e.clientX, e.clientY, "Choose Option", opts(x, y));
      }
    }
  },
  true
);

// Long-press & Pinch-to-Zoom on Game Canvas
let touchTimer = null,
  touchStartPos = null,
  pinchStartDist = 0,
  pinchStartZoom = 1,
  suppressNextMouse = false;

cv.addEventListener(
  "touchstart",
  (e) => {
    if (!started) return;
    if (e.touches.length === 2) {
      clearTimeout(touchTimer);
      touchTimer = null;
      const dx = e.touches[0].clientX - e.touches[1].clientX,
        dy = e.touches[0].clientY - e.touches[1].clientY;
      pinchStartDist = Math.hypot(dx, dy);
      pinchStartZoom = zoom;
      return;
    }
    if (e.touches.length === 1) {
      const t = e.touches[0];
      touchStartPos = { x: t.clientX, y: t.clientY };
      const [tx, ty] = tile(t);
      hov = { x: tx, y: ty };
      touchTimer = setTimeout(() => {
        touchTimer = null;
        suppressNextMouse = true;
        if (hotbarContext(t.clientX, t.clientY)) return;
        const [lx, ly] = tile(t);
        showM(t.clientX, t.clientY, "Choose Option", opts(lx, ly));
      }, 480);
    }
  },
  { passive: true }
);

cv.addEventListener(
  "touchmove",
  (e) => {
    if (e.touches.length === 2 && pinchStartDist > 0) {
      e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX,
        dy = e.touches[0].clientY - e.touches[1].clientY,
        dist = Math.hypot(dx, dy);
      zoom = Math.min(2.6, Math.max(0.55, pinchStartZoom * (dist / pinchStartDist)));
      return;
    }
    if (e.touches.length === 1 && touchStartPos) {
      const t = e.touches[0];
      if (Math.hypot(t.clientX - touchStartPos.x, t.clientY - touchStartPos.y) > 12) {
        clearTimeout(touchTimer);
        touchTimer = null;
      }
    }
  },
  { passive: false }
);

const clearTouch = () => {
  clearTimeout(touchTimer);
  touchTimer = null;
  pinchStartDist = 0;
};
cv.addEventListener("touchend", clearTouch, { passive: true });
cv.addEventListener("touchcancel", clearTouch, { passive: true });

cv.addEventListener(
  "mousedown",
  (e) => {
    if (suppressNextMouse) {
      suppressNextMouse = false;
      e.stopImmediatePropagation();
      e.preventDefault();
    }
  },
  true
);

// Inventory Touch Support: Long-Press for Drop/Eat Menu & Touch-Drag Swap
let invTouchTimer = null,
  invTouchSlot = -1,
  invTouchStart = null;
$("inv").addEventListener(
  "touchstart",
  (e) => {
    const s = e.target.closest(".s");
    if (!s || e.touches.length !== 1) return;
    const i = +s.dataset.i;
    if (!inv[i]) return;
    const t = e.touches[0];
    invTouchSlot = i;
    invTouchStart = { x: t.clientX, y: t.clientY };
    invTouchTimer = setTimeout(() => {
      invTouchTimer = null;
      ignoreInvClickUntil = performance.now() + 600;
      const o = invO(i);
      if (o.length) showM(t.clientX, t.clientY, inv[i].n, o);
    }, 450);
  },
  { passive: true }
);

$("inv").addEventListener(
  "touchmove",
  (e) => {
    if (!invTouchStart || e.touches.length !== 1) return;
    const t = e.touches[0];
    if (Math.hypot(t.clientX - invTouchStart.x, t.clientY - invTouchStart.y) > 10) {
      clearTimeout(invTouchTimer);
      invTouchTimer = null;
    }
  },
  { passive: true }
);

$("inv").addEventListener(
  "touchend",
  (e) => {
    clearTimeout(invTouchTimer);
    if (invTouchSlot >= 0 && invTouchStart && e.changedTouches.length === 1) {
      const t = e.changedTouches[0];
      if (Math.hypot(t.clientX - invTouchStart.x, t.clientY - invTouchStart.y) > 18) {
        const targetEl = document.elementFromPoint(t.clientX, t.clientY),
          toSlotEl = targetEl && targetEl.closest("#inv .s");
        if (toSlotEl) {
          const to = +toSlotEl.dataset.i;
          if (to >= 0 && to < inv.length && to !== invTouchSlot && inv[invTouchSlot]) {
            [inv[invTouchSlot], inv[to]] = [inv[to], inv[invTouchSlot]];
            ignoreInvClickUntil = performance.now() + 500;
            dirty = true;
            save();
          }
        }
      }
    }
    invTouchSlot = -1;
    invTouchStart = null;
  },
  { passive: true }
);
/* Fill every [data-ic] element with its pixel-art icon (replaces the old emoji). */
document.querySelectorAll("[data-ic]").forEach((el) => el.insertAdjacentHTML("afterbegin", UI(el.dataset.ic, el.dataset.big ? "uic big" : "uic")));

const dodgeBtn = $("dodge_btn");
if (dodgeBtn) {
  dodgeBtn.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    tryDodge();
  });
}


/* Compact bottom-right action menu */
(() => {
  const root = document.getElementById("quickMenu");
  const toggle = document.getElementById("quickMenuToggle");
  const items = document.getElementById("quickMenuItems");
  if (!root || !toggle || !items) return;
  const setOpen = (open) => {
    root.dataset.open = open ? "true" : "false";
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close game menu" : "Open game menu");
    toggle.title = open ? "Close menu" : "Game menu";
    items.setAttribute("aria-hidden", String(!open));
  };
  toggle.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    setOpen(root.dataset.open !== "true");
  });
  items.addEventListener("click", (event) => {
    const action = event.target.closest("button");
    if (action) setOpen(false);
  });
  document.addEventListener("pointerdown", (event) => {
    if (root.dataset.open === "true" && !root.contains(event.target)) setOpen(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setOpen(false);
  });
  setOpen(false);
})();
