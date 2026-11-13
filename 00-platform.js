/* Oak & Iron - Platform layer: version, storage adapter, error reporting, pause/resume and
 * offline cache. Loaded first so every later script can use it.
 * Desktop/mobile wrappers (Electron, Capacitor, Steam) can set window.OakPlatform.storage =
 * { get(k), set(k, v), remove(k) } before the game loads to replace browser storage, and can
 * call OakPlatform.pause() / resume() / save() from their app lifecycle events. */
const GAME_VERSION = "1.9.0",
  SAVE_VERSION = 2;
window.OakPlatform = window.OakPlatform || {};

/* ---------- Storage: external adapter > localStorage > in-memory fallback ---------- */
const Store = (() => {
  const mem = {};
  let ls = null;
  try {
    localStorage.setItem("__oak_t", "1");
    localStorage.removeItem("__oak_t");
    ls = localStorage;
  } catch (e) {}
  const ext = () => OakPlatform.storage;
  return {
    get(k) {
      try {
        const x = ext();
        if (x) return x.get(k);
        return ls ? ls.getItem(k) : k in mem ? mem[k] : null;
      } catch (e) {
        return null;
      }
    },
    set(k, v) {
      const x = ext();
      if (x) return x.set(k, v);
      if (ls) ls.setItem(k, v);
      else mem[k] = v;
      return true;
    },
    remove(k) {
      try {
        const x = ext();
        if (x) return x.remove(k);
        if (ls) ls.removeItem(k);
        delete mem[k];
      } catch (e) {}
    },
    persistent: () => !!(ext() || ls),
  };
})();

/* ---------- Error reporting ---------- */
const errLog = [];
function copyText(s, ok) {
  (navigator.clipboard ? navigator.clipboard.writeText(s) : Promise.reject()).then(ok, () =>
    prompt("Copy this text:", s),
  );
}
function errorReport() {
  return [
    "Oak & Iron " + GAME_VERSION + " (save v" + SAVE_VERSION + ")",
    navigator.userAgent,
    location.protocol,
    ...errLog.map((e) => `${e.t} ×${e.n} ${e.where}\n${e.msg}\n${e.stack}`),
  ].join("\n\n");
}
function showErrorBox(entry) {
  if (!document.body) return addEventListener("DOMContentLoaded", () => showErrorBox(entry));
  let b = document.getElementById("errbox");
  if (!b) {
    b = document.createElement("div");
    b.id = "errbox";
    b.className = "ov";
    b.innerHTML =
      '<div class="box"><h2>Something went wrong</h2><p>The game hit an error. Your progress is autosaved. ' +
      'Please copy the report and send it to the developer.</p><pre id="errmsg"></pre>' +
      '<button id="err_copy">Copy report</button> <button id="err_go">Keep playing</button> <button id="err_reload">Reload</button></div>';
    document.body.appendChild(b);
    b.querySelector("#err_copy").onclick = () =>
      copyText(errorReport(), () => (b.querySelector("#err_copy").textContent = "Copied!"));
    b.querySelector("#err_go").onclick = () => (b.style.display = "none");
    b.querySelector("#err_reload").onclick = () => location.reload();
  }
  b.querySelector("#errmsg").textContent =
    entry.msg + (entry.where ? " (" + entry.where + ")" : "") + (entry.stack ? "\n" + entry.stack.split("\n").slice(0, 4).join("\n") : "");
  b.style.display = "flex";
}
function reportError(err, where) {
  const msgTxt = String((err && err.message) || err),
    last = errLog[errLog.length - 1];
  if (last && last.msg == msgTxt && last.where == (where || "")) {
    last.n++;
    return;
  }
  const entry = { t: new Date().toISOString(), n: 1, where: where || "", msg: msgTxt, stack: (err && err.stack) || "" };
  errLog.push(entry);
  if (errLog.length > 20) errLog.shift();
  console.error("[Oak & Iron]", entry);
  showErrorBox(entry);
}
addEventListener(
  "error",
  (e) => {
    const t = e.target;
    if (t && t !== window && (t.src || t.href)) return reportError(new Error("Failed to load " + (t.src || t.href)), "resource");
    if (e.error || e.message)
      reportError(e.error || e.message, e.filename ? e.filename.split("/").pop() + ":" + e.lineno : "");
  },
  true,
);
addEventListener("unhandledrejection", (e) => reportError(e.reason, "promise"));

/* ---------- Pause & resume ---------- */
let paused = false;
function setPaused(on) {
  on = !!on;
  if (on == paused) return;
  paused = on;
  if (on) {
    try {
      if (started) save();
    } catch (e) {}
    if (actx && actx.state == "running") actx.suspend();
  } else if (actx && actx.state == "suspended") actx.resume();
  let o = document.getElementById("pausebox");
  if (!o) {
    o = document.createElement("div");
    o.id = "pausebox";
    o.className = "ov";
    o.innerHTML = '<div class="box"><h2>Paused</h2><p>Click, tap or press any key to resume.</p></div>';
    o.onpointerdown = (e) => {
      e.preventDefault();
      setPaused(false);
    };
    document.body.appendChild(o);
  }
  o.style.display = on ? "flex" : "none";
}
document.addEventListener("visibilitychange", () => {
  if (!document.hidden || !started) return;
  if (CFG.autopause) setPaused(true);
  else
    try {
      save();
    } catch (e) {}
});
addEventListener("pagehide", () => {
  try {
    if (started) save();
  } catch (e) {}
});
addEventListener(
  "keydown",
  (e) => {
    if (!paused) return;
    e.stopImmediatePropagation();
    e.preventDefault();
    setPaused(false);
  },
  true,
);
Object.assign(OakPlatform, {
  pause: () => started && setPaused(true),
  resume: () => setPaused(false),
  save: () => started && save(),
  version: GAME_VERSION,
});

/* ---------- Offline cache (web builds served over http/https) ---------- */
if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol))
  addEventListener("load", () =>
    navigator.serviceWorker.register("sw.js").catch((e) => console.warn("Offline cache unavailable:", e)),
  );
