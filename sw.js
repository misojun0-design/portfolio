var CACHE = 'pf-v3';
self.addEventListener('install', function(e) {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(function(c) {
      return c.addAll(['/index.html', '/manifest.json', '/icon-192.png', '/icon-512.png']).catch(function(){});
    })
  );
});
self.addEventListener('activate', function(e) {
  self.clients.claim();
  e.waitUntil(caches.keys().then(function(ks) {
    return Promise.all(ks.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));
  }));
});
self.addEventListener('fetch', function(e) {
  if(e.request.method!=='GET') return;
  e.respondWith(
    fetch(e.request).then(function(r) {
      if(r&&r.status===200) {
        var clone=r.clone();
        caches.open(CACHE).then(function(c){c.put(e.request,clone);});
      }
      return r;
    }).catch(function() {
      return caches.match(e.request).then(function(c){return c||caches.match('/index.html');});
    })
  );
});
