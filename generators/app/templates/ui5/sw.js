importScripts('webapp/libs/cache-polyfill.js');

self.addEventListener('install', function(e) {
 e.waitUntil(
   caches.open('webappCache').then(function(cache) {
     return cache.addAll([
       '/',
       '/index.html',
       '/webapp/Component.js'       
     ]);
   })
 );
});

self.addEventListener('fetch', function (event) {
    // it can be empty if you just want to get rid of that error
});