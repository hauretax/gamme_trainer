// This is the service worker with the combined offline experience (Offline page + Offline copy of pages)

const CACHE = "saxophone-app-offline"

// Install stage sets up the offline page in the cache and opens a new cache
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(["/offline.html", "/", "/icons/icon-192x192.png"])))
})

// If any fetch fails, it will show the offline page.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // If request was successful, add result to cache
        event.waitUntil(updateCache(event.request, response.clone()))
        return response
      })
      .catch((error) => {
        // If network request fails, try to get it from cache
        return fromCache(event.request).catch(() => {
          // If both fail, show a generic fallback:
          return caches.match("/offline.html")
        })
      }),
  )
})

function fromCache(request) {
  return caches.open(CACHE).then((cache) =>
    cache.match(request).then((matching) => {
      if (!matching || matching.status === 404) {
        return Promise.reject("no-match")
      }
      return matching
    }),
  )
}

function updateCache(request, response) {
  return caches.open(CACHE).then((cache) => cache.put(request, response))
}
