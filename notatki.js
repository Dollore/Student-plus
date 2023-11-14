let flagEdit = 0;
let editIndex = -1;

// czyszczenie przed inicjacją
let addBtn = document.getElementById("addBtn");
let clearBtn = document.getElementById("clearAll");
addBtn.style.backgroundColor = "#005a37";
addBtn.style.color = "white";
clearBtn.style.backgroundColor = "red";
clearBtn.style.color = "white";
clearBtn.addEventListener("click", (e) => {
  window.location.reload();
});

let initialNotes = getNotes();
display(initialNotes);

// DODAWANIE DO LOCAL JSON
addBtn.addEventListener("click", function (e) {
  document.getElementById("addTxt").value =
    CKEDITOR.instances["addTxt"].getData(); // odczyt danych z edytora

  const noteTitle = document.getElementById("addTitle").value;
  if (noteTitle !== "") {
    if (document.getElementById("addTxt").value !== "") {
      if (editIndex !== -1) {
        updateNote(
          editIndex,
          document.getElementById("addTxt").value,
          noteTitle
        );
        editIndex = -1;
      } else {
        saveNoteWithTitle(noteTitle, document.getElementById("addTxt").value);
      }

      let notes = getNotes();
      display(notes);
      document.getElementById("addTxt").value = "";
      document.getElementById("addTitle").value = "";
      CKEDITOR.instances["addTxt"].setData("");
    }
  }
});

// FUNKCJA ODCZYTU DANYCH Z LOCAL JSON
function display(notes) {
  let i = 1;
  let html = "";
  notes.forEach(function (note, index) {
    let starIcons = "";
    for (let i = 1; i <= 5; i++) {
      if (i <= note.rating) {
        starIcons += `<i id="star-${index}-${i}" class="fas fa-star" onclick="toggleRating(${index}, ${i})" style="color: #005a37;"></i>`;
      } else {
        starIcons += `<i id="star-${index}-${i}" class="far fa-star" onclick="toggleRating(${index}, ${i})" style="color: gray;"></i>`;
      }
    }

    html += `
      <div class="noteCard my-2 mx-2 card" content="centre" style="width:100%;" >
              <div class="card-body" id="note-card">
                  <h5 class="card-title">${note.title}</h5>
                  <p class="card-text">${note.content}</p>
                  <div class="rating">
                    ${starIcons}
                  </div>
                  <button id="${index}" onclick="deleteNote(${index})" class="btn btn-danger">Usuń notatkę</button>
                  <button id="${index}" onclick="editNote(${index})" class="btn btn-info">Edytuj notatkę</button>
              </div>
                  <div class="card-footer text-muted" style="font: italic;">
                  Ostatnia edycja: ${note.lastUpdated} - Ocena: ${note.rating || 0}
              </div>
          </div>`;
    i++;
  });
  let notesElm = document.getElementById("notes");
  if (i > 0) notesElm.innerHTML = html;
  else
    notesElm.innerHTML = `Nie ma żadnych notatek. Dodaj nowe by je wyświetlić.`;
  return;
}

// FUNKCJA DODAWANIA DATY OSTATNIEGO ZAPISU
function updateNote(noteId, newBody, newTitle) {
  var d = new Date(Date.now());
  var lastUpdated =
    d.getDate() +
    "." +
    (d.getMonth() + 1) +
    "." +
    d.getFullYear() +
    "," +
    d.getHours() +
    ":" +
    d.getMinutes();

  let notes = getNotes();
  notes[noteId].content = newBody;
  notes[noteId].title = newTitle;
  notes[noteId].lastUpdated = lastUpdated;
  localStorage.setItem("notes", JSON.stringify(notes));
}

// FUNKCJA DODAWANIA OCENY
function toggleRating(index, rating) {
  let notes = getNotes();
  notes[index].rating = rating;
  localStorage.setItem("notes", JSON.stringify(notes));
  display(notes);
}

// FUNKCJA EDYTOWANIA NOTATEK
function editNote(index) {
  const notes = getNotes();
  const crrntNote = notes[index];
  document.getElementById("addTitle").value = crrntNote.title;
  document.getElementById("addTxt").value = crrntNote.content;
  CKEDITOR.instances["addTxt"].setData(crrntNote.content);
  editIndex = index;
}

// FUNKCJA USUWANIA NOTATEK
function deleteNote(index) {
  let notes = getNotes();
  notes.splice(index, 1);
  localStorage.setItem("notes", JSON.stringify(notes));
  display(notes);
}

function replaceButtonText(buttonId, text) {
  if (document.getElementById) {
    var button = document.getElementById(buttonId);
    if (button) {
      if (button.childNodes[0]) {
        button.childNodes[0].nodeValue = text;
      } else if (button.value) {
        button.value = text;
      } else {
        button.innerHTML = text;
      }
    }
  }
}

let search = document.getElementById("searchTxt");
search.addEventListener("input", function () {
  let inputVal = search.value.toLowerCase();
  let notes = getNotes();
  let filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(inputVal)
  );
  display(filteredNotes);
});

// ZAPIS DO LOCAL JSON
function saveNoteWithTitle(title, content) {
  var d = new Date(Date.now());
  var lastUpdated =
    d.getDate() +
    "." +
    (d.getMonth() + 1) +
    "." +
    d.getFullYear() +
    "," +
    d.getHours() +
    ":" +
    d.getMinutes();
  let notes = getNotes();
  notes.push({
    title,
    content,
    lastUpdated,
    rating: 0, // inicjacja oceny
  });
  localStorage.setItem("notes", JSON.stringify(notes));
}
// ODCZYTYWANIE Z LOCAL JSON
function getNotes() {
  const notesStr = localStorage.getItem("notes");
  return notesStr ? JSON.parse(notesStr) : [];
}