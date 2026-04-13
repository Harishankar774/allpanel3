const CACHE_NAME = 'allpanel-v1'
const urlsToCache = ['/', '/home', '/crash', '/weather', '/teenpatti', '/matka', '/lucky6', '/lucky7', '/poker', '/baccarat', '/roulette']

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  )
})

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  )
})