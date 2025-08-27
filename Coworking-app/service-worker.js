// service-worker.js
self.addEventListener("install", event => {
  console.log("Service Worker installato");
});

self.addEventListener("fetch", event => {
  // Al momento lasciamo passare tutto in rete
});
