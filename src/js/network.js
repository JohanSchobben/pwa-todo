const URL = "https://todo-afstuderen.firebaseio.com/todos";

function getTodos() {
  return fetch(URL + ".json");
}

function saveTodo(todoList){
  return fetch(URL + ".json", {
    method: "POST",
    body: JSON.stringify(todoList),
    header: {
      "Content-Type": "application/json"
    }
  });
}

function updateTodo(todoList) {
  return fetch(URL + "/" + todoList.id + ".json", {
    method: "PUT",
    body: JSON.stringify(todoList),
    header: {
      "Content-Type": "application/json"
    }
  })
}

function deleteTodo(id) {
  return fetch(URL + "/" + id + ".json", {
    method: "PUT",
    body: JSON.stringify(null)
  });
}



