const canUseSyncManager = ("serviceWorker" in navigator && "syncManager" in window);

function getParentViaSelector(element, selector){
  if(!element){
    return undefined;
  }
  else if(element.matches(selector)){
    return element;
  }
  return getParentViaSelector(element.parentElement, selector);
}


function syncAction(action, db) {
  console.log("in syncaction");
  return storeInIndexedDatabase(action, db, "sync-store")
    .then(function () {
      return navigator.serviceWorker.ready;
    })
    .then(function (swreg) {
      swreg.sync.register("sync-todo");
    });
}