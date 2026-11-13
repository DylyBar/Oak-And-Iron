/* Oak & Iron offline cache. Bump VERSION together with GAME_VERSION in js/00-platform.js. */
const VERSION = "oak-1.9.0";
const FILES = [
  "./",
  "index.html",
  "css/style.css",
  ...[
    "00-platform", "01-config-sound", "02-world", "03-data", "04-sprites", "05-item-art", "06-drops", "07-audio-chat",
    "08-entities", "09-actions", "10-ui-panels", "11-render-base", "12-render-objects", "13-render-loop",
    "14-save-controls", "15-music-menus", "15b-hotbar", "16-boot-touch",
  ].map((f) => "js/" + f + ".js"),
];
self.addEventListener("install", (e) =>
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(FILES)).then(() => self.skipWaiting())),
);
self.addEventListener("activate", (e) =>
  e.waitUntil(
    caches
      .keys()
      .then((ks) => Promise.all(ks.filter((k) => k != VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  ),
);
/* Network first so updates arrive immediately; cached copy when offline. */
self.addEventListener("fetch", (e) => {
  if (e.request.method != "GET" || new URL(e.request.url).origin != location.origin) return;
  e.respondWith(
    fetch(e.request, { cache: "no-cache" })
      .then((r) => {
        const copy = r.clone();
        if (r.ok) caches.open(VERSION).then((c) => c.put(e.request, copy));
        return r;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true })),
  );
});
