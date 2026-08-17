// public/sw.js
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  // Passthrough simples — não faz cache, só precisa existir para o Chrome
  // considerar o app instalável como PWA completo.
  event.respondWith(fetch(event.request));
});
