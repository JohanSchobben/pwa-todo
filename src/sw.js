const CACHE_NAME = "todopwa";
const CACHED_FILES = [
  "/",
  "index.html",
  "/static/config.json",
  "/js/builder.js",
  "/js/firebase.js",
  "/js/helper.js",
  "/js/main.js",
  "/img/plus.svg",
  "https://code.jquery.com/jquery-3.3.1.slim.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js",
  "https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js",
  "https://www.gstatic.com/firebasejs/6.6.2/firebase-app.js",
  "https://www.gstatic.com/firebasejs/6.6.2/firebase-database.js",
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

self.addEventListener("activate", function (event) {
  console.log(LOG_PREFIX + "is activated!", event);
});

self.addEventListener("fetch", function (event) {
  caches.match(event.request).then(function(response) {
    return response || fetch(event.request);
  });
});