const CACHE_NAME = "minigpt-cache-v1";
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/main.js",
  "/service-worker.js",
  "https://cdn.jsdelivr.net/npm/@xenova/transformers/dist/transformers.min.js"
];

self.addEventListener("install", (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener("fetch", (evt) => {
  evt.respondWith(
    caches.match(evt.request).then((response) => {
      return response || fetch(evt.request);
    })
  );
});
