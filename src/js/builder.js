function TodoList(id, name, tasks){
  this.id = id;
  this.name = name;
  this.tasks = tasks;

  this.donePercentage = function(){
    var completed = this.tasks.filter(function(task){
      return task.done
    }).length;
    var total = tasks.length;
    return 100 / total * completed;
  };

  this.toObject = function () {
    return {
      id: this.id,
      name: this.name,
      tasks: this.tasks.map(function (task) {
        return {name: task.name, done: task.done};
      })
    }
  }
}

// this is a comment

/*
 * this is a multiline comment
 */

function createTodoListList(todoLists){
  return todoLists.map(function(todolist, index){
    const card = createTodoListCard(todolist);
    card.dataset.id = todolist.id;

    if (!(index == 0 || index == todolist.length - 1)){
      card.className += " my-2";
    }
    return card;
  });
}

function createTodoListCard(todoList) {
  const cardTitle = document.createElement('div');
  cardTitle.className = "card-title";
  cardTitle.innerText = todoList.name;

  const cardSubTitle = document.createElement("span");
  cardSubTitle.className = "card-subtitle";
  cardSubTitle.innerText = "deze kaart heeft " + todoList.tasks.length + " taken";

  const cardBody = document.createElement("div");
  cardBody.className = "card-body";
  cardBody.appendChild(cardTitle);
  cardBody.appendChild(cardSubTitle);

  const card = document.createElement("div");
  card.className = "card col-11 col-md-12";
  card.appendChild(cardBody);

  return card;
}

function createViewAndUpdateTodoList(todoList){
  return todoList.tasks.map(function(task){
    return createViewListItem(task);
  });
}

function  createTodoList() {
  const list = document.createElement("ul");
  list.className = "list-group list-group-flush";
  return list;
}

function createViewListItem(task){
  const listItem = createTodoListItem(task);
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.done;

  listItem.innerText = task.name;
  listItem.appendChild(checkbox);
  return listItem;
}

function createTodoListItem(task) {
  const listItem = document.createElement("li");
  listItem.className = "list-group-item d-flex justify-content-between align-items-center";
  listItem.innerText = task.name;
  listItem.dataset.name = task.name;
  return listItem;
}

