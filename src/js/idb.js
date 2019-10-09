
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

const DB_NAME = "todo-db";
const DB_VERSION = 1;

function openIndexedDatabase(databaseName = DB_NAME, databaseVersion = DB_VERSION){
  return new Promise(function(resolve){
    let firstEventDone = false;
    const request = window.indexedDB.open(databaseName, databaseVersion);
    request.onupgradeneeded = function(event){
      const connection = event.target.result;
      const todoObjectStore = connection.createObjectStore("todo-store", {keyPath: "id"});
      todoObjectStore.createIndex("todoindex", "id", {unique: true});
      if (firstEventDone) {
        db = request.result;
        resolve(db);
      } else {
        firstEventDone = true;
      }
    };

    request.onsuccess = function (event) {
      db = request.result;
      if (firstEventDone) {
        resolve(db);
      } else {
        firstEventDone = true;
      }
    };
  })
}

function readFromIndexedDatabase(db, objectStore = "todo-store"){
  return new Promise(function (resolve) {
    const objectStore = db.transaction(objectStore, "readwrite")
      .objectStore(objectStore);

    objectStore.openCursor().onsuccess = function (event) {
      let cursor = event.target.result;
      const storedTodos = [];

      if (cursor){
        const todoList = new TodoList(cursor.key, cursor.value.name, cursor.value.tasks);
        storedTodos.push(todoList);
        cursor.continue();
      } else {
        resolve(storedTodos);

      }

    };
  });
}


function storeInIndexedDatabase(data, db, objectStore = "todo-store"){
  return new Promise(function (resolve, reject){
    const request = db.transaction(objectStore, "readwrite")
      .objectStore(objectStore)
      .add(data);

    request.onsuccess = function(event){
      resolve(event);
    };

    request.onerror = function(event) {
      reject(event);
    }
  });
}

function updateElementInIndexedDatabase(data, db, objectStore = "todo-store"){
  return new Promise(function (resolve, reject) {
    const request = db.transaction(objectStore, "readwrite")
      .objectStore(objectStore)
      .put(data);

    request.onsuccess = function (event) {
      resolve(data)
    };

    request.onerror = function (event) {
      reject(event);
    };
  })
}

function deleteElementInIndexedDatabase(id, db, objectStore = "todo-store"){
  return new Promise(function (resolve, reject) {
    const request = db.transaction(objectStore, "readwrite")
      .objectStore(objectStore)
      .delete(id);

    request.onsuccess = function(event){
      resolve(event);
    };

    request.onerror = function(event) {
      reject(event);
    };

  });
}