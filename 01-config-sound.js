/* Oak & Iron - Config, audio context, settings button, simple sound effects (sections 01-03). Loaded in order by index.html. */

/* ==========================================================================
 * 01. CONFIG, AUDIO CONTEXT & SHORTCUTS
 * Settings object (CFG), Web Audio setup, and the $() helper.
 * ========================================================================== */
const $ = (i) => document.getElementById(i);
const CFG = Object.assign(
  { vol: 0.6, mvol: 0.4, trk: 0, gfx: 1, dn: 1, run: 1, auto: 1, names: 1, splat: 1, autopause: 1 },
  (() => {
    try {
      return JSON.parse(Store.get("pixelvale_set")) || {};
    } catch (e) {
      return {};
    }
  })(),
);
let actx = null,
  MG = null,
  MU = null;
function initAudio() {
  if (!actx) {
    actx = new (window.AudioContext || window.webkitAudioContext)();
    MG = actx.createGain();
    MG.gain.value = CFG.vol;
    MG.connect(actx.destination);
    MU = actx.createGain();
    MU.gain.value = CFG.mvol * 0.5;
    MU.connect(actx.destination);
  }
  if (actx.state === "suspended") actx.resume();
}
document.addEventListener("mousedown", initAudio);
document.addEventListener("keydown", initAudio);
document.addEventListener("touchstart", initAudio, { passive: true });
document.addEventListener("pointerdown", initAudio, { passive: true });

/* ==========================================================================
 * 02. SETTINGS BUTTON & SOUND TOGGLE
 * Yes/no style sound switch plus opening/closing the settings modal.
 * ========================================================================== */
let snd_on = true;
$("set_btn").onclick = () => {
  $("settings_modal").style.display = "flex";
};
$("cls_set").onclick = () => ($("settings_modal").style.display = "none");
$("snd_btn").onclick = () => {
  snd_on = !snd_on;
  $("snd_btn").textContent = "Sound: " + (snd_on ? "ON" : "OFF");
};
$("sv_btn_st").onclick = () => {
  save(1);
  $("settings_modal").style.display = "none";
};
$("respawn").onclick = () => {
  started = true;
  $("death").style.display = "none";
  msg("You respawn at the spawn point.", 1);
};
/* ==========================================================================
 * 03. SIMPLE SOUND EFFECTS (oscillator blips)
 * Short one-shot tones used for chopping, mining, swings, etc.
 * ========================================================================== */
function playSnd(t) {
  if (!actx || !snd_on) return;
  const ct = actx.currentTime,
    o = actx.createOscillator(),
    g = actx.createGain();
  o.connect(g);
  g.connect(MG);
  if (t == "swing") {
    o.type = "sine";
    o.frequency.setValueAtTime(200, ct);
    o.frequency.exponentialRampToValueAtTime(50, ct + 0.1);
    g.gain.setValueAtTime(0.05, ct);
    g.gain.exponentialRampToValueAtTime(0.01, ct + 0.1);
    o.start(ct);
    o.stop(ct + 0.1);
  } else if (t == "chop") {
    o.type = "square";
    o.frequency.setValueAtTime(100, ct);
    o.frequency.exponentialRampToValueAtTime(20, ct + 0.15);
    g.gain.setValueAtTime(0.1, ct);
    g.gain.exponentialRampToValueAtTime(0.01, ct + 0.15);
    o.start(ct);
    o.stop(ct + 0.15);
  } else if (t == "mine") {
    o.type = "triangle";
    o.frequency.setValueAtTime(900, ct);
    o.frequency.exponentialRampToValueAtTime(150, ct + 0.1);
    g.gain.setValueAtTime(0.08, ct);
    g.gain.exponentialRampToValueAtTime(0.01, ct + 0.1);
    o.start(ct);
    o.stop(ct + 0.1);
  } else if (t == "sword") {
    o.type = "sawtooth";
    o.frequency.setValueAtTime(300, ct);
    o.frequency.exponentialRampToValueAtTime(100, ct + 0.1);
    g.gain.setValueAtTime(0.1, ct);
    g.gain.exponentialRampToValueAtTime(0.01, ct + 0.1);
    o.start(ct);
    o.stop(ct + 0.1);
  } else if (t == "bow") {
    o.type = "triangle";
    o.frequency.setValueAtTime(400, ct);
    o.frequency.exponentialRampToValueAtTime(800, ct + 0.15);
    g.gain.setValueAtTime(0.1, ct);
    g.gain.exponentialRampToValueAtTime(0.01, ct + 0.15);
    o.start(ct);
    o.stop(ct + 0.15);
  } else if (t == "magic") {
    o.type = "sine";
    o.frequency.setValueAtTime(250, ct);
    o.frequency.exponentialRampToValueAtTime(1200, ct + 0.2);
    g.gain.setValueAtTime(0.1, ct);
    g.gain.exponentialRampToValueAtTime(0.01, ct + 0.2);
    o.start(ct);
    o.stop(ct + 0.2);
  } else if (t == "ehurt") {
    o.type = "square";
    o.frequency.setValueAtTime(150, ct);
    o.frequency.exponentialRampToValueAtTime(40, ct + 0.2);
    g.gain.setValueAtTime(0.15, ct);
    g.gain.exponentialRampToValueAtTime(0.01, ct + 0.2);
    o.start(ct);
    o.stop(ct + 0.2);
  }
}
