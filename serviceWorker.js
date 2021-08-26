// This service worker allows the app to open faster, be installable and work
// offline. This is achieved by caching all required files. The strategy used
// is called "cache then network": we serve cached files and then check for
// updates. Updated files will be used the next time user refreshes or
// relaunches the app.

const CACHE_NAME = "app";
const ASSETS_TO_CACHE = [
  "/",
  "/script.js",
  "/style.css",
  "/manifest.json",
  "/icons/vector.svg",
  "/icons/192.png",
  "/icons/512.png",
  "/icons/192-maskable.png",
  "/icons/512-maskable.png",
];

self.addEventListener("install", (event) => {
  // Keep the service worker in the "installing" state until assets are cached.
  event.waitUntil(cacheAssets());
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Respond with a cached asset. We assume everything is cached, therefore
  // every resource has to be listed in ASSETS_TO_CACHE, else this will fail.
  event.respondWith(fromCache(request));

  // Don't kill the service worker until the cache is updated.
  event.waitUntil(updateCache(request));
});

async function cacheAssets() {
  const cache = await caches.open(CACHE_NAME);
  await cache.addAll(ASSETS_TO_CACHE);
}

async function fromCache(request) {
  const cache = await caches.open(CACHE_NAME);
  const matching = await cache.match(request);
  if (!matching) throw new Error("Resource not cached");
  return matching;
}

async function updateCache(request) {
  const cache = await caches.open(CACHE_NAME);
  const response = await fetch(request);
  cache.put(request, response);
}
