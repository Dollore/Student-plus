function toggleRating(index, rating) {

  const user = firebase.auth().currentUser;

  if (user) {
    const userEmail = user.email;
    const noteDocRef = notes.db.collection("NOTES").doc(userEmail).collection("userNotes").doc(index.toString());

    noteDocRef.update({
      rating: rating,
    })
      .then(() => {
        console.log("Ocena zmieniona pomyślnie.");
        notes.refresh();
      })
      .catch(error => {
        console.error("Błąd zmiany oceny. ", error);
      });
  } else {
    console.error('Brak zalogowania.');
  }
};
function generateUniqueId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

let nextNoteId = 0;  // Lokalny licznik.
function deleteNote (uniqueId) {
  const user = firebase.auth().currentUser;

  if (user) {
    const userEmail = user.email;

    notes.db.collection("NOTES").doc(userEmail).collection("userNotes").where("uniqueId", "==", uniqueId).get()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            doc.ref.delete()
              .then(() => {
                console.log("Pomyślnie usunięto notatkę.");
                notes.refresh();
              })
              .catch(error => {
                console.error("Błąd usuwania notatek. ", error);
              });
          });
        } else {
          console.log("Brak takiej notatki.");
        }
      })
      .catch(error => {
        console.error("Błąd! ", error);
      });
  } else {
    console.error('Brak zalogowania.');
  }
};


let notes = {
  data: null,
  db: null,
  flagEdit: 0,
  editIndex: -1,

  getNotes: function () {
    const user = firebase.auth().currentUser;
  
    if (user) {
      const userEmail = user.email;
  
      return notes.db.collection("NOTES").doc(userEmail).collection("userNotes").get()
        .then((querySnapshot) => {
          const notesArr = [];
          querySnapshot.forEach((doc) => {
            notesArr.push(doc.data());
          });
  
          return notesArr;
        })
        .catch((error) => {
          console.error("Błąd odczytu notatek. ", error);
          return [];
        });
    } else {
      console.error('Brak zalogowania.');
      return [];
    }
  },

  refresh: function () {
    const user = firebase.auth().currentUser;
  
    if (user) {
      const userEmail = user.email;
  
      // Fetch notatki
      notes.db.collection("NOTES").doc(userEmail).collection("userNotes").get()
        .then((querySnapshot) => {
          const updatedNotes = [];
          querySnapshot.forEach((doc) => {
            updatedNotes.push(doc.data());
          });
  
          notes.display(updatedNotes);
          for (let i = 0; i < updatedNotes.length; i++) {
            const deleteBtn = document.getElementById(`deleteBtn-${i}`);
            if (deleteBtn) {
              deleteBtn.addEventListener("click", () => deleteNote(i));
            }
          }
        })
        .catch((error) => {
          console.error("Błąd odczytu notatek. ", error);
        });
    } else {
      console.error('Brak zalogowania.');
    }
  },

  init: async function () {
    // czyszczenie przed inicjacją
    let addBtn = document.getElementById("addBtn");
    //let clearBtn = document.getElementById("clearAll");
    addBtn.style.backgroundColor = "#005a37";
    addBtn.style.color = "white";
    //clearBtn.style.backgroundColor = "red";
    //clearBtn.style.color = "white";
    //clearBtn.addEventListener("click", (e) => {
    //this.refresh();
    //})
    ;

    
    let initialNotes = await notes.getNotes();
    notes.display(initialNotes);

    // DODAWANIE DO FIRESTORE
    addBtn.addEventListener("click", function (e) {
      document.getElementById("addTxt").value =
        CKEDITOR.instances["addTxt"].getData();

        const noteTitle = document.getElementById("addTitle").value;
        if (noteTitle !== "") {
          if (document.getElementById("addTxt").value !== "") {
            if (notes.editIndex !== -1) {
              notes.updateNote(
                notes.editIndex,
                document.getElementById("addTxt").value,
                noteTitle
              );
              notes.editIndex = -1;
            } else {
              notes.saveNoteWithTitle(noteTitle, document.getElementById("addTxt").value);
            }
            document.getElementById("addTxt").value = "";
            document.getElementById("addTitle").value = "";
            CKEDITOR.instances["addTxt"].setData("");
          }
        }
      });
    notes.loadNotesFromFirestore();
  },



  loadNotesFromFirestore: function () {
    const user = firebase.auth().currentUser;

    if (user) {
      const userEmail = user.email;
      const notesCollectionRef = notes.db.collection("NOTES").doc(userEmail).collection("userNotes");

      notesCollectionRef.get()
        .then((querySnapshot) => {
          let notesArr = [];
          querySnapshot.forEach((doc) => {
            notesArr.push(doc.data());
          });

          notes.display(notesArr);
        })
        .catch((error) => {
          console.error("Błąd 666. ", error);
        });
    } else {
      console.error('Brak zalogowania.');
    }
  },



  // ... :)
  
  saveNoteWithTitle: function (title, content) {
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

  const user = firebase.auth().currentUser;

  if (user) {
    const userEmail = user.email;

    const uniqueId = generateUniqueId(); // generowanie unikalnego ID.
    const noteId = nextNoteId++;

    const noteDocRef = notes.db.collection("NOTES").doc(userEmail).collection("userNotes").doc(noteId.toString());
    noteDocRef.set({
      title,
      content,
      lastUpdated,
      rating: 0,
      uniqueId,
    })
      .then(() => {
        console.log("Notatka zapisana pomyślnie.");
        notes.refresh();
      })
      .catch(error => {
        console.error("Błąd odczytu. ", error);
      });
  } else {
    console.error('Brak zalogowania.');
  }
},

  display: function (notes) {
    
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
          <button id="deleteBtn-${note.uniqueId}" onclick="deleteNote('${note.uniqueId}')" class="btn btn-danger">Usuń notatkę</button>
        </div>
        <div class="card-footer text-muted" style="font: italic;">
          Ostatnia edycja: ${note.lastUpdated} - Ocena: ${note.rating || 0}
        </div>
      </div>`;
      i++;
    });
    console.log("Received notes:", notes);
    let notesElm = document.getElementById("notes");
    if (i > 0) notesElm.innerHTML = html;
    else
      notesElm.innerHTML = `Nie ma żadnych notatek. Dodaj nowe by je wyświetlić.`;
    return;
  },


  updateNote: function (noteId, newBody, newTitle) {
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

    let notesArr = notes.getNotes();
    notesArr[noteId].content = newBody;
    notesArr[noteId].title = newTitle;
    notesArr[noteId].lastUpdated = lastUpdated;
    notesArr[noteId].rating = rating;

    const user = firebase.auth().currentUser;

    if (user) {
      const userEmail = user.email;

      // Update
      const noteDocRef = notes.db.collection("NOTES").doc(userEmail).collection("userNotes").doc(noteId.toString());
      noteDocRef.update({
        title: newTitle,
        content: newBody,
        lastUpdated, rating
      })
        .then(() => {
          localStorage.setItem("notes", JSON.stringify(notesArr));
          notes.display(notesArr);
        })
        .catch(error => {
          console.error("Błąd aktualizacji notatki. ", error);
        });
    } else {
      console.error('Brak zalogowania.');
    }
  },
  

};

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
  notes.db = firebase.firestore();

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log('Zalogowano jako: ', user.email);
    } else {
      console.log('Brak zalogowania.');
      alert('Proszę się najpierw zalogować.');
    }

    notes.init(); // Init
  });
};