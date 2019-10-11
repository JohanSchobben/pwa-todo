const VERSION = 42;
const CACHE_NAME = "todopwa-cache";
const CACHED_FILES = [
  "/",
  "/index.html",
  "/js/builder.js",
  "/js/idb.js",
  "/js/helper.js",
  "/js/network.js",
  "/js/main.js",
  "/img/plus.svg",
  "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js",
  "https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js",
  "https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
];

self.importScripts("/js/idb.js", "/js/network.js");

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

self.addEventListener("sync", function (event) {
  console.log("in syncmanager");
  if (event.tag === 'sync-todo') {
    console.log("via sync-todo");
    event.waitUntil(
      openIndexedDatabase()
        .then(function (db) {
          return readFromIndexedDatabase(db, "sync-store");
        })
        .then(function (syncActions) {

          for (const action of syncActions) {
            handleAction(action, dbcon);
          }
        })
    );
  }
});

function handleAction(action,db){
  switch (action.type) {
    case "create":
      return saveTodo(action.todo)
        .then(function (response){
          return handleSyncResponse(response)
        });
    case "update":
      return updateTodo(action.todo)
        .then(handleSyncResponse);
    case "delete":
      return delete (action.todo.id)
        .then(handleSyncResponse);

  }
}

function handleSyncResponse(response){
  console.log(response);
  if (!respone.ok) {
    return deleteElementInIndexedDatabase(action.id, db, "sync-store");
  } else {
    // todo handle error
  }
}