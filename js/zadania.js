const form = document.querySelector('#form');
const formSection = document.querySelector('.form');
const formHeader = document.querySelector('.header');
const addNewTaskBtn = document.querySelector('#add-new-task-btn');
const filterDoneBtn = document.querySelector('#filter-done-btn');
const filterUndoneBtn = document.querySelector('#filter-undone-btn');
const removeAllBtn = document.querySelector('#remove-all-btn');
const removeFinishedBtn = document.querySelector('#remove-finished-btn');
const filtersResetBtn = document.querySelector('#filters-reset-btn');
const liToClone = document.querySelector('#li-to-clone');
const taskList = document.querySelector('#task-list');
const priorities = document.querySelector('#filter-priority');
const filterPriorityForm = document.querySelector('#filter_priority');
form.addEventListener('submit', formValidateAndSubmit);
let db; 
function generateTaskId() {
    return Date.now().toString();
  }
function parseJsonFromLS() {
  let taskArrayJSON = localStorage.getItem("todolist");
  let htmlArray = [];
  if (taskArrayJSON) {
    htmlArray = JSON.parse(taskArrayJSON);
  }
  return htmlArray;
}
function findAllBtns() {
    findShowDescrBtns();
    findCompleteTaskBtns();
    findDeleteBtns();
}

function addArrayToLS(arr) {
    let arrayJSON = JSON.stringify(arr);
    localStorage.setItem("todolist", arrayJSON);
  }
  
  function readFromDatabase(userEmail) {
    var docRef = db.collection("todolist").doc(userEmail);
  
    docRef.get().then(function (doc) {
      if (doc.exists) {
        var taskArray = doc.data().tasks || [];
        addArrayToHtml(taskArray);
        findAllBtns(); // Teraz findAllBtns jest dostępne
      } else {
        console.log("Brak dokumentu w bazie danych dla użytkownika: " + userEmail);
      }
    }).catch(function (error) {
      console.log("Błąd podczas odczytywania z bazy danych:", error);
    });
  }

function writeToDatabase(userEmail, taskArray) {
  db.collection("todolist").doc(userEmail).set({
    tasks: taskArray
  })
    .then(function () {
      console.log("Dane zapisane do bazy danych dla użytkownika: " + userEmail);
    })
    .catch(function (error) {
      console.error("Błąd podczas zapisywania do bazy danych: ", error);
    });
}

function addArrayToHtml(arr) {
  taskList.innerHTML = "";

  for (let i = 0; i < arr.length; i++) {
    addObjectToHtml(arr[i]);
  }
}
function addObjectToHtml(taskObject) {
  let liCloned = liToClone.cloneNode(true);

  liCloned.classList.remove('hidden-always');
  liCloned.removeAttribute('id');

  if (taskObject.taskDone) {
    liCloned.classList.add('done');
  }

  liCloned.querySelector('.task-name').innerText = taskObject.taskName;
  liCloned.querySelector('.task-date').innerText = taskObject.taskDate;
  liCloned.querySelector('.task-priority').innerText = taskObject.taskPriority;
  liCloned.querySelector('.task-description').innerText = taskObject.taskAbout;
  liCloned.querySelector('.task-id').innerText = taskObject.taskId;

  taskList.appendChild(liCloned);
}

function saveToDatabase(taskArray) {
    var user = firebase.auth().currentUser;
    if (user) {
      var userEmail = user.email;
  
      db.collection("todolist").doc(userEmail).set({
        tasks: taskArray
      })
      .then(function () {
        console.log("Dane zapisane do bazy danych dla użytkownika: " + userEmail);
  
        // Odśwież widok po zapisie do bazy danych
        addArrayToHtml(taskArray);
        findAllBtns();
      })
      .catch(function (error) {
        console.error("Błąd podczas zapisywania do bazy danych: ", error);
      });
    } else {
      console.log("Użytkownik niezalogowany. Nie można zapisać do bazy danych.");
    }
  }

function deleteTask() {
  let taskId = this.parentElement.parentElement.parentElement.querySelector('.task-id');
  let user = firebase.auth().currentUser;

  if (user) {
    let docRef = db.collection("todolist").doc(user.email);

    docRef.get().then(function (doc) {
      if (doc.exists) {
        let taskArray = doc.data().tasks || [];
        let newArrToDB = taskArray.filter(task => task.taskId !== taskId.innerText);
        writeToDatabase(user.email, newArrToDB);
        addArrayToHtml(newArrToDB);
      }
    }).catch(function (error) {
      console.log("Błąd podczas odczytywania z bazy danych:", error);
    });
  }
}

function findDeleteBtns() {
  let deleteTaskBtns = document.querySelectorAll('.task-delete');
  for (let i = 0; i < deleteTaskBtns.length; i++) {
    deleteTaskBtns[i].addEventListener('click', deleteTask)
  }
}


/*function markAsCompleted() {
  let taskId = this.parentElement.parentElement.parentElement.querySelector('.task-id');
  let user = firebase.auth().currentUser;

  if (user) {
    let docRef = db.collection("todolist").doc(user.email);

    docRef.get().then(function (doc) {
      if (doc.exists) {
        let taskArray = doc.data().tasks || [];
        let newArrToDB = taskArray.map(task => {
          if (task.taskId === taskId.innerText) {
            task.taskDone = !task.taskDone;
          }
          return task;
        });
        writeToDatabase(user.email, newArrToDB);
        addArrayToHtml(newArrToDB);
      }
    }).catch(function (error) {
      console.log("Błąd podczas odczytywania z bazy danych:", error);
    });
  }
}*/
function markAsCompleted() {
  let taskId = this.parentElement.parentElement.parentElement.querySelector('.task-id');
  let user = firebase.auth().currentUser;

  if (user) {
    let docRef = db.collection("todolist").doc(user.email);

    docRef.get().then(function (doc) {
      if (doc.exists) {
        let taskArray = doc.data().tasks || [];
        let newArrToDB = taskArray.map(task => {
          if (task.taskId === taskId.innerText) {
            task.taskDone = !task.taskDone;
          }
          return task;
        });
        writeToDatabase(user.email, newArrToDB);
        addArrayToHtml(newArrToDB);
      }
    }).catch(function (error) {
      console.log("Błąd podczas odczytywania z bazy danych:", error);
    });
  }
}
/*function findCompleteTaskBtns() {
  let completeTaskBtns = document.querySelectorAll('.task-complete');

  for (let j = 0; j < completeTaskBtns.length; j++) {
    completeTaskBtns[j].addEventListener('click', markAsCompleted);
  }
}*/
function findCompleteTaskBtns() {
  let completeTaskBtns = document.querySelectorAll('.task-complete');

  for (let j = 0; j < completeTaskBtns.length; j++) {
    completeTaskBtns[j].addEventListener('click', markAsCompleted);
  }
}
function showDescrPanel() {
  let taskDescrPanel = this.parentElement.parentElement.parentElement.querySelector('.task-descr-panel');
  taskDescrPanel.classList.toggle('accordion-list-active');

  if (taskDescrPanel.style.maxHeight) {
    taskDescrPanel.style.maxHeight = null;
  } else {
    taskDescrPanel.style.maxHeight = taskDescrPanel.scrollHeight + "px";
  }
}

function findShowDescrBtns() {
  let showDescrBtns = document.querySelectorAll('.task-show');

  for (let i = 0; i < showDescrBtns.length; i++) {
    showDescrBtns[i].addEventListener('click', showDescrPanel);
  }
}

/*function filterPriority() {
  let taskArray = parseJsonFromLS();
  //let priorityOption = parseInt(this.value, 10); // Convert to number
	let priorityOption = document.getElementById('priorities').value;
  let filteredArray = [];

  //if (!isNaN(priorityOption)) {
   // filteredArray = taskArray.filter(el => el.taskPriority == priorityOption);
  //} else {
  //  filteredArray = taskArray;
  //}
	if (priorityOption !== "all") {
    filteredArray = taskArray.filter(el => el.taskPriority === priorityOption);
  } else {
    filteredArray = taskArray;
  }

  addArrayToHtml(filteredArray);
  findAllBtns();
  //location.reload();
}*/
function filterPriority() {
  alert("Filter Priority function called."); // Add this line

  let taskArray = parseJsonFromLS();
  let priorityOption = document.getElementById('priorities').value;
  alert("Selected Priority: " + priorityOption); // Add this line

  let filteredArray = [];

  if (priorityOption !== "all") {
    filteredArray = taskArray.filter(el => el.taskPriority === priorityOption);
  } else {
    filteredArray = taskArray;
  }

  alert("Filtered Array: " + JSON.stringify(filteredArray)); // Add this line

  addArrayToHtml(filteredArray);
  findAllBtns();
}
//priorities.addEventListener('change', filterPriority);
document.addEventListener('DOMContentLoaded', function () {
  // ... (your existing code)

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      readFromDatabase(user.email);
      console.log('Zalogowano jako: ', user.email);
    } else {
      console.log('BRAK LOGINU');
      alert('Proszę się najpierw zalogować.');
    }

    readFromDatabase(user.email); // INIT

    // Add the event listener for the priority filter here
    //document.getElementById('priorities').addEventListener('change', filterPriority);
	  let priorityFilter = document.getElementById('filter-priority');
    priorityFilter.addEventListener('change', function () {
      console.log('Priority filter changed:', priorityFilter.value);
      filterPriority();
    });
  });
});

function filterDone() {
  let taskArray = parseJsonFromLS();
  let filteredArray = [];
  taskArray.forEach(el => {
    if (el.taskDone) {
      filteredArray.push(el);
      
    }
  });
  addArrayToHtml(filteredArray);
  findAllBtns();
  filterPriorityForm.reset();
  
}

//filterDoneBtn.addEventListener('click', filterDone);

function filterUndone() {
  let taskArray = parseJsonFromLS();
  let filteredArray = [];

  taskArray.forEach(el => {
    if (!el.taskDone) {
      filteredArray.push(el);
    }
  });
  addArrayToHtml(filteredArray);
  findAllBtns();
  filterPriorityForm.reset();
}

//filterUndoneBtn.addEventListener('click', filterUndone);

function filtersReset() {
  let taskArray = parseJsonFromLS();
  addArrayToHtml(taskArray);
  findAllBtns();
  filterPriorityForm.reset();
}

filtersResetBtn.addEventListener('click', filtersReset);

function removeAllTasks() {
  var user = firebase.auth().currentUser;
  if (user) {
    writeToDatabase(user.email, []);
    addArrayToHtml([]);
  }
}

removeAllBtn.addEventListener('click', function () {
  removeAllTasks();
});

function removeFinishedTasks() {
  let taskArray = parseJsonFromLS();
  let newArrToLS = [];

  for (let i = 0; i < taskArray.length; i++) {
    if (!taskArray[i].taskDone) {
      newArrToLS.push(taskArray[i])
    }
  }

  var user = firebase.auth().currentUser;
  if (user) {
    writeToDatabase(user.email, newArrToLS);
    addArrayToHtml(newArrToLS);
  }
}

removeFinishedBtn.addEventListener('click', function () {
removeFinishedTasks();
});


function addNewTask() {
  accordion(formSection);
  accordionHeader(formHeader);
  changeBtnTxt(addNewTaskBtn);
  changeBtnClass(addNewTaskBtn);
}

addNewTaskBtn.addEventListener('click', addNewTask);

function accordion(thisSection) {
  thisSection.classList.toggle('accordion');
  thisSection.style.maxHeight = thisSection.style.maxHeight ?
    null :
    thisSection.scrollHeight + "px";
}

function accordionHeader(thisHeader) {
  thisHeader.classList.toggle('header-accordion');
}

function changeBtnTxt(btnName) {
  btnName.innerText = btnName.innerText === "Dodaj Zadanie" ?
    "Dodaj Zadanie" :
    "Dodaj Zadanie"
}

function changeBtnClass(btnName) {
  btnName.classList.toggle("btn-dark-blue");
  btnName.classList.toggle("btn-light-blue");
}

function accordionClose(thisSection) {
  thisSection.classList.toggle('accordion');
  thisSection.style.maxHeight = null;
}

// ----- schowanie formularza po walidacji -----
function closeForm() {
  accordionClose(formSection);
  accordionHeader(formHeader);
  changeBtnTxt(addNewTaskBtn);
  changeBtnClass(addNewTaskBtn);
}
document.getElementById('form-submit-btn').addEventListener('click', formValidateAndSubmit);
// ----- walidacja -----
function formValidateAndSubmit(event) {
  event.preventDefault();

  console.log("Before retrieving field values");

  let taskNameInput = document.getElementById('form-task');
  let taskDateInput = document.getElementById('form-date');
  let taskPriorityInputs = document.querySelectorAll('input[name="form-priority"]:checked');
  let taskDescriptionInput = document.getElementById('form-description');

  if (!taskNameInput || !taskDateInput || !taskPriorityInputs.length || !taskDescriptionInput) {
    console.error("Some form fields do not exist or are not filled in.");
    return;
  }

  let taskName = taskNameInput.value;
  let taskDate = taskDateInput.value;
  let taskPriority = taskPriorityInputs[0].value; // Get the value of the checked radio button
  let taskAbout = taskDescriptionInput.value;

  console.log("Before creating a new task");

  let newTask = {
    taskName: taskName,
    taskDate: taskDate,
    taskPriority: taskPriority,
    taskAbout: taskAbout,
    taskId: generateTaskId(),
    taskDone: false,
  };

  // Retrieve the current tasks from the database
  const currentUser = firebase.auth().currentUser;

  if (currentUser) {
    const docRef = db.collection("todolist").doc(currentUser.email);
    docRef.get().then(function (doc) {
      if (doc.exists) {
        const taskArray = doc.data().tasks || [];

        // Add the new task to the in-memory array
        taskArray.push(newTask);

        // Save the updated tasks to the database
        docRef.set({
          tasks: taskArray
        });

        // Retrieve the updated tasks from the database and display them
        readFromDatabase(currentUser.email);
      }
    }).catch(function (error) {
      console.log("Error reading from the database:", error);
    });
  }
}
/*
window.onload = function () {
  var firebaseConfig = {
    apiKey: "AIzaSyBSWWSlqBNKg9ZBq5w1YwB-Yypa7_qeCJ0",
    authDomain: "student-25aa2.firebaseapp.com",
    projectId: "student-25aa2",
    storageBucket: "student-25aa2.appspot.com",
    messagingSenderId: "487092803105",
    appId: "1:487092803105:web:55d7a9c30709a04701f560",
    measurementId: "G-7P8N9VR2N6"
  };

  firebase.initializeApp(firebaseConfig);
  db = firebase.firestore();

  // check usera
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // user zalogowany
      addSampleTaskToDatabase(user.email);
      readFromDatabase(user.email);
      console.log('Zalogowano jako: ', user.email);
    } else {
      // brak usera
      console.log('BRAK LOGINU');
      alert('Proszę się najpierw zalogować.');
    }

    readFromDatabase(user.email); // INIT
  });
};
*/
function addSampleTaskToDatabase(userEmail) {
    var docRef = db.collection("todolist").doc(userEmail);
  
    var sampleTask = {
      taskName: "Przykładowe zadanie",
      taskDate: "2023-12-14",
      taskPriority: "1",
      taskAbout: "Opis przykładowego zadania",
      taskId: generateTaskId(),
      taskDone: false,
    };
  
    docRef.set({
      tasks: [sampleTask]
    })
    .then(function () {
      console.log("Przykładowe zadanie dodane do bazy danych dla użytkownika: " + userEmail);
    })
    .catch(function (error) {
      console.error("Błąd podczas dodawania przykładowego zadania do bazy danych: ", error);
    });
  }
