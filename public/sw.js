// This is the service worker for the PWA

const CACHE_NAME = "saxophone-app-v1"

// Liste des ressources à mettre en cache immédiatement
const PRECACHE_RESOURCES = [
  "./",
  "./index.html",
  "./offline.html",
  "./manifest.json",
  "./logo.png",
  "./icons/icon-192x192.png",
  "./icons/icon-512x512.png",
  "./icons/apple-touch-icon.png",
]

// Installation du service worker
self.addEventListener("install", (event) => {
  console.log("[ServiceWorker] Install")
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("[ServiceWorker] Pre-caching resources")
        return cache.addAll(PRECACHE_RESOURCES)
      })
      .then(() => {
        console.log("[ServiceWorker] Skip waiting")
        return self.skipWaiting()
      })
      .catch((err) => {
        console.error("[ServiceWorker] Pre-cache error:", err)
      }),
  )
})

// Activation du service worker
self.addEventListener("activate", (event) => {
  console.log("[ServiceWorker] Activate")
  // Nettoyer les anciens caches
  event.waitUntil(
    caches
      .keys()
      .then((keyList) => {
        return Promise.all(
          keyList.map((key) => {
            if (key !== CACHE_NAME) {
              console.log("[ServiceWorker] Removing old cache", key)
              return caches.delete(key)
            }
          }),
        )
      })
      .then(() => {
        console.log("[ServiceWorker] Claiming clients")
        return self.clients.claim()
      }),
  )
})

// Stratégie de mise en cache : Network First, puis cache
self.addEventListener("fetch", (event) => {
  // Ignorer les requêtes non GET
  if (event.request.method !== "GET") return

  // Ignorer les requêtes de Chrome Extension
  if (event.request.url.includes("chrome-extension://")) return

  // Ignorer les requêtes analytics
  if (event.request.url.includes("analytics") || event.request.url.includes("gtag")) return

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Vérifier si la réponse est valide
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response
        }

        // Mettre en cache la réponse
        const responseToCache = response.clone()
        caches
          .open(CACHE_NAME)
          .then((cache) => {
            cache.put(event.request, responseToCache)
          })
          .catch((err) => {
            console.error("[ServiceWorker] Cache put error:", err)
          })

        return response
      })
      .catch(() => {
        // Si la requête échoue, essayer de récupérer depuis le cache
        return caches
          .match(event.request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse
            }

            // Si la ressource n'est pas dans le cache, retourner la page offline
            return caches.match("./offline.html")
          })
          .catch((err) => {
            console.error("[ServiceWorker] Cache match error:", err)
            // En dernier recours, retourner une réponse vide
            return new Response("Network error happened", {
              status: 408,
              headers: { "Content-Type": "text/plain" },
            })
          })
      }),
  )
})
