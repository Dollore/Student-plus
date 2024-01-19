var cal = {
  sMon: true,
  data: null,
  sDay: 0, sMth: 0, sYear: 0,
  months: [
    "Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec",
    "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"
  ],
  days: ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota", "Niedziela"],
  hMth: null, hYear: null,
  hWrap: null,
  hFormWrap: null, hForm: null,
  hfDate: null, hfTxt: null, hfDel: null,
  db: null,

  init: function () {
    cal.sMon = true; // Zaczynaj poniedziałkiem - FORCE
    cal.hMth = document.getElementById("calMonth");
    cal.hYear = document.getElementById("calYear");
    cal.hWrap = document.getElementById("calWrap");
    cal.hFormWrap = document.getElementById("calForm");
    cal.hForm = cal.hFormWrap.querySelector("form");
    cal.hfDate = document.getElementById("evtDate");
    cal.hfTxt = document.getElementById("evtTxt");
    cal.hfDel = document.getElementById("evtDel");
  
    let now = new Date(), nowMth = now.getMonth();
    cal.hYear.value = parseInt(now.getFullYear());
    for (let i = 0; i < 12; i++) {
      let opt = document.createElement("option");
      opt.value = i;
      opt.innerHTML = cal.months[i];
      if (i == nowMth) { opt.selected = true; }
      cal.hMth.appendChild(opt);
    }
  
    cal.hMth.onchange = cal.draw;
    cal.hYear.onchange = cal.draw;
    cal.hForm.onsubmit = cal.save;
    document.getElementById("evtClose").onclick = () => cal.hFormWrap.close();
    cal.hfDel.onclick = cal.del;
  
    cal.draw(); // INIT kalendarza
  },

  pshift: function (forward) {
    cal.sMth = parseInt(cal.hMth.value);
    cal.sYear = parseInt(cal.hYear.value);
    if (forward) { cal.sMth++; } else { cal.sMth--; }
    if (cal.sMth > 11) { cal.sMth = 0; cal.sYear++; }
    if (cal.sMth < 0) { cal.sMth = 11; cal.sYear--; }
    cal.hMth.value = cal.sMth;
    cal.hYear.value = cal.sYear;
    cal.draw();
  },

  draw: function () {
    cal.sMth = parseInt(cal.hMth.value);
    cal.sYear = parseInt(cal.hYear.value);
    let daysInMth = new Date(cal.sYear, cal.sMth + 1, 0).getDate(),
      startDay = new Date(cal.sYear, cal.sMth, 1).getDay(),
      endDay = new Date(cal.sYear, cal.sMth, daysInMth).getDay(),
      now = new Date(),
      nowMth = now.getMonth(),
      nowYear = parseInt(now.getFullYear()),
      nowDay = cal.sMth == nowMth && cal.sYear == nowYear ? now.getDate() : null;

    cal.hWrap.innerHTML = `<div class="calHead"></div>
    <div class="calBody">
      <div class="calRow"></div>
    </div>`;

    let wrap = cal.hWrap.querySelector(".calHead");
    for (let d of cal.days) {
      let cell = document.createElement("div");
      cell.className = "calCell";
      cell.innerHTML = d;
      wrap.appendChild(cell);
    }

    wrap = cal.hWrap.querySelector(".calBody");
    let row = cal.hWrap.querySelector(".calRow");
    let squares = [];
    if (cal.sMon && startDay != 1) {
      let blanks = startDay == 0 ? 7 : startDay;
      for (let i = 1; i < blanks; i++) { squares.push("b"); }
    }
    if (!cal.sMon && startDay != 0) {
      for (let i = 0; i < startDay; i++) { squares.push("b"); }
    }

    for (let i = 1; i <= daysInMth; i++) { squares.push(i); }

    if (cal.sMon && endDay != 0) {
      let blanks = endDay == 6 ? 1 : 7 - endDay;
      for (let i = 0; i < blanks; i++) { squares.push("b"); }
    }
    if (!cal.sMon && endDay != 6) {
      let blanks = endDay == 0 ? 6 : 6 - endDay;
      for (let i = 0; i < blanks; i++) { squares.push("b"); }
    }

    for (let i = 0; i < squares.length; i++) {
      let cell = document.createElement("div");
      cell.className = "calCell";
      if (nowDay == squares[i]) { cell.classList.add("calToday"); }
      if (squares[i] == "b") { cell.classList.add("calBlank"); }
      else {
        cell.innerHTML = `<div class="cellDate">${squares[i]}</div>`;
        const userEmail = firebase.auth().currentUser.email;
        const dayDocRef = cal.db.collection(userEmail).doc(cal.hYear.value).collection(cal.hMth.value).doc(squares[i].toString());
  
        // CHECK LOGINU
        if (firebase.auth().currentUser) {
          // ZALOGOWANY - POBIERZ DANE
          dayDocRef.get().then((dayDoc) => {
            if (dayDoc.exists) {
              const eventData = dayDoc.data().event;
              if (eventData) {
                cell.innerHTML += "<div class='evt'>" + eventData + "</div>";
              }
            }
          });
  
          (function (day) {
            cell.onclick = function () { cal.show(day); };
          })(squares[i]);
        } else {
          // BRAK LOGINU - nie można klikać
          cell.innerHTML = `<div class="cellDate noUser">${squares[i]}</div>`;
          cell.classList.add("noUser");
          cell.onclick = null; // Nieklikalny
        }
      }
      row.appendChild(cell);
  
      if (i != (squares.length - 1) && i != 0 && (i + 1) % 7 == 0) {
        row = document.createElement("div");
        row.className = "calRow";
        wrap.appendChild(row);
      }
    }
  },

  show: function (day) {
    const userEmail = firebase.auth().currentUser.email;
    cal.hForm.reset();
    cal.sDay = day;
    cal.hfDate.value = `${cal.sDay} ${cal.months[cal.sMth]} ${cal.sYear}`;
    const dayDocRef = cal.db.collection(userEmail).doc(cal.hYear.value).collection(cal.hMth.value).doc(cal.sDay.toString());
    dayDocRef.get().then((dayDoc) => {
      if (dayDoc.exists) {
        cal.hfTxt.value = dayDoc.data().event;
        cal.hfDel.classList.remove("hide");
      } else {
        cal.hfDel.classList.add("hide");
      }
      cal.hFormWrap.show();
    });
  },

  save: function () {
    const user = firebase.auth().currentUser;
    const userEmail = firebase.auth().currentUser.email;

    if (user) {
      // Zalogowany
      const userEmail = user.email;

      const dayDocRef = cal.db.collection(userEmail).doc(cal.hYear.value).collection(cal.hMth.value).doc(cal.sDay.toString());
      dayDocRef.set({
        event: cal.hfTxt.value,
        user: userEmail,
      })
        .then(() => {
          cal.draw();
          cal.hFormWrap.close();
        })
        .catch(error => {
          console.error("Błąd! ", error);
        });
    } else {
      // Brak zalogowanego usera
      console.error('Brak loginu');
    }

    return false;
  },

  del: function () {
    const userEmail = firebase.auth().currentUser.email;
    const dayDocRef = cal.db.collection(userEmail).doc(cal.hYear.value).collection(cal.hMth.value).doc(cal.sDay.toString());
    if (confirm("Usunąć wydarzenie?")) {
      dayDocRef.delete()
        .then(() => {
          cal.draw();
          cal.hFormWrap.close();
        })
        .catch(error => {
          console.error("Error deleting document: ", error);
        });
    }
  }
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
  cal.db = firebase.firestore();

    // check usera
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        // user zalogowany
        console.log('Zalogowano jako: ', user.email);
      } else {
        // brak usera
        console.log('BRAK LOGINU');
        alert('Proszę się najpierw zalogować.');
      }
  
      cal.init(); // INIT
    });

  cal.init();
};