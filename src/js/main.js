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

let newTodoTasks = [];


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
  const todoItemCheckbox = clickedItem.querySelector("input[type=checkbox]");
  todoItemCheckbox.checked = !todoItemCheckbox.checked;
  const currentTodoList = todos.filter(function (todoList) {
    return todoList.id === updateModal.dataset.todo;
  })[0];

  currentTodoList.tasks.forEach(function (task) {
    if (task.name === clickedItem.dataset.name) {
      task.done = !task.done;
    }
  });

  updateTodo(currentTodoList)
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
  const newTodo = new TodoList(Date.now().toString(), taskName, newTodoTasks);
  todos.push(newTodo);
  $("#create-modal").modal('hide');
  updateTodoListCards();
  saveTodo(newTodo);
});

updateModalDelete.addEventListener("click", function(){
  const todoListId = updateModal.dataset.todo;
  todos = todos.filter(function (todo) {
    return todo.id !==todoListId;
  });
  updateTodoListCards();
  $("#update-modal").modal('hide');
  deleteTodo(todoListId);
});
















var todos = [];


fetch('/static/config.json')
  .then(function (res) {
    return res.json();
  })
  .then(function (config) {
    firebase.initializeApp(config);
    return getTodos();
  })
  .then(function (data) {
    const value = data.val();
    const gottenTodos = [];
    for (const obj in value){
      const currentObject = value[obj];
      const todolist = new TodoList(currentObject.id, currentObject.name, currentObject.tasks);
      gottenTodos.push(todolist);
    }
    todos = gottenTodos;
    createTodoListList(todos).forEach(function(item) {
      todoListLocation.appendChild(item);
    });
  });