

function getTodos(){
   return firebase.database().ref('todos').once('value');
}

function saveTodo(todoList){
  firebase.database().ref('todos/'+todoList.id).set(todoList.toObject());
}

function deleteTodo(id){
  firebase.database().ref('todos/'+id).set(null);
}

function updateTodo(todoList){
  firebase.database().ref('todos/'+todoList.id).update(todoList.toObject());
}