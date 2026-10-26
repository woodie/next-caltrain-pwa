// Lets the app install as a PWA and open offline; network first, so a deploy reaches riders right away.
const CACHE = 'next-caltrain-v1'
const SHELL = [
  '/',
  '/index.html?app',
  '/script.js',
  '/style.css',
  '/manifest.webmanifest',
  '/icons/ic_NextCaltrain_56.png',
  '/icons/ic_NextCaltrain_112.png',
  '/icons/favicon-128x128.png',
]

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting()))
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)
  if (event.request.method !== 'GET' || url.origin !== self.location.origin) return
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone()
        caches.open(CACHE).then((cache) => cache.put(event.request, copy))
        return response
      })
      .catch(() => caches.match(event.request, { ignoreSearch: true }))
  )
})
