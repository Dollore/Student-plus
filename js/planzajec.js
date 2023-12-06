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
          console.log('Zalogowano jako: ', user.email);
          document.getElementById("contentContainer").style.visibility = "visible";
          document.getElementById("groupSelect").removeAttribute("disabled");
          loadSchedule(); // INIT
        } else {
          // brak usera
          console.log('BRAK LOGINU');
          alert('Proszę się najpierw zalogować.');
        }
      });
  };
  
  function loadSchedule() {
    var selectedGroup = document.getElementById("groupSelect").value;
    var scheduleBody = document.getElementById("scheduleBody");
  
    scheduleBody.innerHTML = "";
  
    var scheduleRef = db.collection("SCHEDULE").doc(selectedGroup);
  
    scheduleRef.get().then(function (doc) {
      if (doc.exists) {
        var scheduleData = doc.data();
  
        for (var hour = 6; hour <= 22; hour++) {
          var row = document.createElement("tr");
  
          var hourCell = document.createElement("td");
          hourCell.textContent = hour + ":00";
          row.appendChild(hourCell);
  
          var saturdayCell = document.createElement("td");
          var sundayCell = document.createElement("td");
  
          if (scheduleData["Sobota"] && scheduleData["Sobota"][hour.toString()]) {
            var classes = scheduleData["Sobota"][hour.toString()];
  
            if (classes.duration) {
              // Jeżeli zajęcia trwają kilka godzin, dodaj informacje do komórek
              var endHour = hour + classes.duration;
              saturdayCell.innerHTML = formatClassInfo(classes.name, hour, endHour);
            } else {
              saturdayCell.innerHTML = formatClassInfo(classes.name);
            }
          }
  
          if (scheduleData["Niedziela"] && scheduleData["Niedziela"][hour.toString()]) {
            var classes = scheduleData["Niedziela"][hour.toString()];
            if (classes.duration) {
              // Jeżeli zajęcia trwają kilka godzin, dodaj informacje do komórek
              var endHour = hour + classes.duration;
              sundayCell.innerHTML = formatClassInfo(classes.name);
            } else {
              sundayCell.innerHTML = formatClassInfo(classes.name);
            }
          }
  
          row.appendChild(saturdayCell);
          row.appendChild(sundayCell);
  
          scheduleBody.appendChild(row);
        }
      } else {
        console.log("Plan zajęć dla grupy " + selectedGroup + " nie został znaleziony.");
      }
    }).catch(function (error) {
      console.log("Błąd podczas pobierania planu zajęć:", error);
    });
  }
  
  function formatClassInfo(name) {
    var classType = getClassType(name);
    var color = getColorForClassType(classType);
  
    var formattedInfo = `<span style="color: ${color}">${name}</span>`;
  
    return formattedInfo;
  }
  
  function getClassType(className) {
    if (className.includes("[WYKŁ]")) {
      return "WYKŁ";
    } else if (className.includes("[LAB]")) {
      return "LAB";
    } else if (className.includes("[PROJ]")) {
      return "PROJ";
    } else {
      return ""; 
    }
  }
  
  function getColorForClassType(classType) {
    switch (classType) {
      case "WYKŁ":
        return "rgb(0, 114, 89)";
      case "LAB":
        return "rgb(0, 68, 255)";
      case "PROJ":
        return "rgb(53, 0, 88)";
      default:
        return "black"; 
    }
  }