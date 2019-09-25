const LOG_PREFIX = "[Service worker] ";
self.addEventListener("install", function (event) {
  console.log(LOG_PREFIX + "is installed!", event);
});

self.addEventListener("activate", function (event) {
  console.log(LOG_PREFIX + "is activated!", event);
});
