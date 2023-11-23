document.getElementById("new-list-form").addEventListener("submit", function (event) {
  event.preventDefault();

  var newListName = document.getElementById("new-list-input").value;

  if (newListName.trim() !== "") {
      var newList = document.createElement("div");
      newList.classList.add("task-list");

      var newTaskForm = document.createElement("form");
      var newTaskFormId = "new-task-form-" + Date.now();
      newTaskForm.id = newTaskFormId;

      var newListHeader = document.createElement("h2");
      newListHeader.textContent = newListName;
      newList.appendChild(newListHeader);

      newTaskForm.innerHTML += '<input type="submit" id="new-task-submit" value="Dodaj Zadanie!">';
      newList.appendChild(newTaskForm);

      var newTaskContainer = document.createElement("div");
      var newTaskContainerId = "tasks-" + Date.now();
      newTaskContainer.id = newTaskContainerId;
      newList.appendChild(newTaskContainer);

      document.querySelector(".main").appendChild(newList);

      addNewTaskListener(newTaskFormId, newTaskContainerId);
  } else {
      alert("Wprowadź nazwę listy!");
  }
});

function addNewTaskListener(formId, containerId) {
  document.getElementById(formId).addEventListener("submit", function (event) {
      event.preventDefault();

      var newTaskName = "Nowe zadanie";

      if (newTaskName.trim() !== "") {
          var newTask = document.createElement("div");
          newTask.classList.add("task");

          var newTaskInput = document.createElement("input");
          newTaskInput.type = "text";
          newTaskInput.classList.add("text");
          newTaskInput.value = newTaskName;
          newTaskInput.readOnly = true;

          // Przypisz style bezpośrednio do nowego zadania
          newTask.style.backgroundColor = "#ddd";
          newTask.style.color = "white";
          newTask.style.padding = "1rem";
          newTask.style.borderRadius = "1rem";
          newTask.style.marginBottom = "1rem";
          // Dodaj więcej stylów według potrzeb

          var newTaskActions = document.createElement("div");
          newTaskActions.classList.add("actions");
          newTaskActions.innerHTML = '<button class="edit">Edytuj</button><button class="delete">Usuń</button>';

          newTask.appendChild(newTaskInput);
          newTask.appendChild(newTaskActions);

          document.getElementById(containerId).appendChild(newTask);
      } else {
          alert("Wprowadź nazwę zadania!");
      }
  });
}

document.addEventListener("click", function (event) {
  if (event.target.classList.contains("edit")) {
      var taskElement = event.target.closest(".task");
      var textInput = taskElement.querySelector(".text");
      textInput.readOnly = false;
      textInput.focus();
  }

  if (event.target.classList.contains("delete")) {
      var taskElement = event.target.closest(".task");
      taskElement.remove();
  }
});
