const todoListLocation = document.querySelector('#todo-lists-list');
const addButton = document.querySelector("#add-button");

const createModal = document.querySelector("#create-modal");
const createModalBody = document.querySelector("#create-modal-body");
const createModalTaskList = document.querySelector("#create-modal-task-list");
const createModalSave = document.querySelector("#create-modal-save");
const createModalTaskInput = document.querySelector("#create-modal-task-input");
const createModalNameInput = document.querySelector("#create-modal-name-input");
const createModalErrorMessage = document.querySelector("#create-modal-error-text");

const updateModal = document.querySelector("#update-modal");
const updateModalTitle = document.querySelector("#update-modal-title");
const updateModalBody = document.querySelector("#update-modal-body");
const updateModalTaskList = document.querySelector("#update-modal-task-list");
const updateModalDelete = document.querySelector("#update-modal-delete");

let newTodoTasks;
var todos;
let db;

function updateTodoListCards(){
  todoListLocation.innerHTML = '';
  const todoListCardElements = createTodoListList(todos);
  todoListCardElements.forEach(function (element) {
    todoListLocation.appendChild(element);
  });
}

todoListLocation.addEventListener("click", function (event) {
  if(!event.target.matches('div.card *')) return;
  const clickedCard = getParentViaSelector(event.target, "div.card");
  const currentTodoList = todos.filter(function (todolist) {
    return todolist.id === clickedCard.dataset.id;
  })[0];

  updateModal.dataset.todo = currentTodoList.id;
  updateModalTitle.innerText = currentTodoList.name;
  updateModalTaskList.innerHTML = "";
  createViewAndUpdateTodoList(currentTodoList).forEach(function (item) {
    updateModalTaskList.appendChild(item);
  });
  $('#update-modal').modal('show');
});

updateModalTaskList.addEventListener("click", function (event) {
  const currentTodoListElement = getParentViaSelector(event.target, "#update-modal-task-list");
  if(!currentTodoListElement) return;

  const clickedItem = getParentViaSelector(event.target, ".list-group-item");
  const todoItemCheckbox = clickedItem.querySelector("input[type=checkbox]")
  if (event.target !== todoItemCheckbox) {
    todoItemCheckbox.checked = !todoItemCheckbox.checked;
  }
  const currentTodoList = todos.filter(function (todoList) {
    return todoList.id === updateModal.dataset.todo;
  })[0];

  currentTodoList.tasks.forEach(function (task) {
    if (task.name === clickedItem.dataset.name) {
      task.done = !task.done;
    }
  });

  updateTodo(currentTodoList);
  updateElementInIndexedDatabase(currentTodoList.toObject(), db);
});

addButton.addEventListener("click", function (event) {
  createModalTaskList.innerHTML = "";
  createModalNameInput.value = "";
  $('#create-modal').modal('show');
});

createModalBody.addEventListener("click", function (event) {
  const currentTodoListElement = getParentViaSelector(event.target);
  if(!currentTodoListElement) return;
});

createModalTaskInput.addEventListener("keypress", function (event) {
  if (event.keyCode === 13 && event.target.value.trim().length > 0) {
    const task = {name: event.target.value, done: false};
    newTodoTasks.push(task);
    const taskElement = createTodoListItem(task);
    createModalTaskList.appendChild(taskElement);
    event.target.value = "";
  }
});

createModalTaskList.addEventListener("click", function (event) {
  const clickedListIttemElement = getParentViaSelector(event.target, ".list-group-item");
  if(!clickedListIttemElement) return;
  const name = clickedListIttemElement.dataset.name;
  newTodoTasks = newTodoTasks.filter(function (task) {
    return task.name !== name;
  });
  createModalTaskList.removeChild(clickedListIttemElement);
});

createModalSave.addEventListener("click", function (event) {
  const taskName  = createModalNameInput.value.trim();
  if(taskName.length === 0){
    createModalErrorMessage.innerText = "Naam mag niet leeg zijn";
    return;
  }
  if(newTodoTasks.length === 0 ){
    createModalErrorMessage.innerText = "de nieuwe todolijst moet ten miste een taak hebben;";
    return;
  }
  const todoObject = new TodoList(null, taskName, newTodoTasks);

  saveTodo(todoObject)
    .then(function (response) {
      if (response.status >= 400){
        // todo log errror to user
      }
      return response.json();
    })
    .then(function(json){
      todoObject.id = json.name;
      todos.push(todoObject);
      updateTodoListCards();
      storeInIndexedDatabase(todoObject.toObject(), db);
      $("#create-modal").modal('hide');

    })
});

updateModalDelete.addEventListener("click", function(){
  const todoListId = updateModal.dataset.todo;

  deleteTodo(todoListId)
    .then(function(response){
      $("#update-modal").modal('hide');
      if (!(response.status >= 400)) {
        todos = todos.filter(function (todo) {
          return todo.id !== todoListId;
        });
        console.log(todoListId, todos);
        updateTodoListCards();
        deleteElementInIndexedDatabase(todoListId, db)
      }
    })
});

!function main(){
  todos = [];
  newTodoTasks = [];

  openIndexedDatabase()
    .then(function (database) {
      db = database;
      return readFromIndexedDatabase(db);
    })
    .then(function(items){
      todos = items;
      createTodoListList(todos).forEach(function(item) {
        todoListLocation.appendChild(item);
      });
    });

  getTodos()
    .then(function (response) {
      if (response.status !== 200){
        // TODO show error to user
      }
      return response.json();
    })
    .then(function(json){
      const todoLists = [];
      for(const object in json){
        const todoListJson = json[object];
        const todoList = new TodoList(object, todoListJson.name, todoListJson.tasks);
        todoLists.push(todoList);
        updateElementInIndexedDatabase(todoList.toObject(), db);

      }
      todos = todoLists;
      createTodoListList(todos).forEach(function(item) {
        todoListLocation.appendChild(item);
      });


    });


  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register("/sw.js");
    })
  }
}();