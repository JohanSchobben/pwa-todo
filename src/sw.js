const VERSION = 9;
const CACHE_NAME = "todopwa-cache";
const CACHED_FILES = [
  "/",
  "index.html",
  "/static/config.json",
  "/js/builder.js",
  "/js/firebase.js",
  "/js/helper.js",
  "/js/network.js",
  "/js/main.js",
  "/img/plus.svg",
  "/js/firebase-app.js",
  "/js/firebase-database.js",
  "https://code.jquery.com/jquery-3.3.1.slim.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js",
  "https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js",
  "https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
];

self.addEventListener("install", function (event) {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then(function (cache) {
          return cache.addAll(CACHED_FILES);
        })
    );
});

self.addEventListener("fetch", function (event) {

  if (/^https:\/\/todo-afstuderen/.test(event.request.url)){
    event.respondWith(fetch(event.request));
    return;
  }
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request)
        .then(function (res) {
          return caches.open(CACHE_NAME)
            .then(function (cache) {
              cache.put(event.request.url, res.clone());
              return res;
            });
        })
      })
  )
});