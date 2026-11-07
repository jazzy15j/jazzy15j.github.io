// Service worker for Thirty & Sparkling (served from the site root so it can
// control the page at /vegas-birthday-30, which GitHub Pages serves without a
// trailing slash). It only ever handles this app's own files and its fonts.
//
// - App pages, scripts, photos: stale-while-revalidate, so pages you've opened
//   keep working with weak signal in Las Vegas.
// - Google Fonts are cached too.
// - Google Maps, weather and venue websites are never touched: they need a live connection.

const CACHE = "vb30-cache-v1";
const APP = "/vegas-birthday-30";

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith("vb30-") && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

function handles(url) {
  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") return true;
  if (url.origin !== self.location.origin) return false;
  return url.pathname.startsWith(APP) || url.pathname.startsWith("/_next/static/");
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (!handles(url)) return;

  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(request, { ignoreSearch: request.mode !== "navigate" });
      const network = fetch(request)
        .then((res) => {
          if (res && (res.ok || res.type === "opaque")) cache.put(request, res.clone());
          return res;
        })
        .catch(() => undefined);
      if (cached) {
        event.waitUntil(network);
        return cached;
      }
      const res = await network;
      if (res) return res;
      if (request.mode === "navigate") {
        const shell = await cache.match(APP);
        if (shell) return shell;
      }
      return new Response("Offline", { status: 503, statusText: "Offline" });
    }),
  );
});
