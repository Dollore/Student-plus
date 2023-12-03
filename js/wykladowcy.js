 function loadTeachersFromFirestore() {
    const teachersList = document.getElementById('teachersList');
  
    const teachersCollection = firebase.firestore().collection("teachers");
  
    teachersCollection.get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // Dla każdego dokumentu
          const teacherData = doc.data();
          const listItem = document.createElement('li');
          listItem.innerHTML = `
            <img src="${teacherData.image}" />
            <div class="details">
              <span class="name"><i class="fa fa-user"></i> ${teacherData.name}</span>
              <span class="title1"><i class="fa fa-id-card"></i> ${teacherData.title}</span>
              <span class="title2"><i class="fa fa-folder"></i> ${teacherData.subject} </span>
              <span class="title3"><i class="fa fa-info-circle"></i> ${teacherData.description} </span>
              <a class="phone"><i class="fa fa-phone"></i> ${teacherData.phone} </a>
              <a class="email"><i class="fa fa-envelope-open"></i> ${teacherData.email}</a>
            </div>
          `;
          teachersList.appendChild(listItem);
        });
      })
      .catch(error => {
        console.error("Błąd wczytywania. ", error);
      });
  }


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
  
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        console.log('Zalogowano jako: ', user.email);
        loadTeachersFromFirestore();
      } else {
        console.log('Brak logowania.');
        alert('Proszę się najpierw zalogować.');
      }
    });
  }
  