var firebaseConfig = {
	apiKey: "AIzaSyBSWWSlqBNKg9ZBq5w1YwB-Yypa7_qeCJ0",
	authDomain: "student-25aa2.firebaseapp.com",
	projectId: "student-25aa2",
	storageBucket: "student-25aa2.appspot.com",
	messagingSenderId: "487092803105",
	appId: "1:487092803105:web:55d7a9c30709a04701f560",
	measurementId: "G-7P8N9VR2N6"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  const loginForm = document.querySelector('.login form');
  const registerForm = document.querySelector('.register form');

  // Handle login form submission
  loginForm.addEventListener('submit', function (event) {
	event.preventDefault();

	const email = loginForm.querySelector('input[type="email"]').value;
	const password = loginForm.querySelector('input[type="password"]').value;

	// Sign in with email and password
	firebase.auth().signInWithEmailAndPassword(email, password)
	  .then(function () {
		
		
		console.log("Sign in successful!");
	  })
	  .catch(function (error) {
		console.error("Sign in failed:", error.message);
	  });
  });

  // Handle register form submission
  registerForm.addEventListener('submit', function (event) {
	event.preventDefault();

	const email = registerForm.querySelector('input[type="email"]').value;
	const password = registerForm.querySelector('input[type="password"]').value;

	// Create a new user with email and password
	firebase.auth().createUserWithEmailAndPassword(email, password)
	  .then(function () {
		console.log("User registered successfully!");
	  })
	  .catch(function (error) {
		console.error("Registration failed:", error.message);
	  });
  });
  const wrapper = document.querySelector('.wrapper');
  const loginLink = document.querySelector('.login-link');
  const registerLink = document.querySelector('.register-link');

  registerLink.addEventListener('click', function () {
	wrapper.classList.add('active');
  });

  loginLink.addEventListener('click', function () {
	wrapper.classList.remove('active');
  });

  firebase.auth().onAuthStateChanged(function (user) {
	const userStatusContainer = document.getElementById('userStatus');
	const userEmailContainer = document.getElementById('userEmail');
	const logoutLink = document.getElementById('logoutLink');
	const loginStatusDiv = document.getElementById('loginStatus');
	const afterLoginProcess = document.getElementById('sidebarId');
	

	if (user) {
	  // User is signed in
	  userStatusContainer.textContent = 'Zalogowano jako:';
	  userEmailContainer.textContent = user.email;
	  
	  // Show the login status div
	  loginStatusDiv.style.visibility = 'visible';
	  loginStatusDiv.style.display = 'block';

	  // Show the logout link
	  logoutLink.style.display = 'block';

	  // Hide the wrapper
	  wrapper.style.display = 'none';
	  afterLoginProcess.style.display = 'block';
	} else {
	  // No user is signed in
	  userStatusContainer.textContent = '';
	  userEmailContainer.textContent = '';

	  // Hide the login status div
	  loginStatusDiv.style.display = 'none';

	  // Hide the logout link
	  logoutLink.style.display = 'none';

	  // Show the wrapper
	  wrapper.style.display = 'flex';
	  afterLoginProcess.style.display = 'none';
	}
  });

  // Function to logout the user
  function logoutUser() {
	firebase.auth().signOut().then(function () {
	  // Sign-out successful.
	  console.log('User signed out');
	}).catch(function (error) {
	  // An error happened.
	  console.error('Error during logout:', error);
	});
  }
  function openForgotPasswordForm() {
	document.getElementById('forgotPasswordForm').style.display = 'block';
}
  function forgotPassword() {
	var email = document.getElementById('email').value;

	if (email) {
		firebase.auth().sendPasswordResetEmail(email)
			.then(() => {
				// Email reset link sent!
				console.log('Link do resetowania hasła wysłany na adres e-mail.');
				// Możesz dodać dodatkową obsługę, taką jak ukrycie formularza po wysłaniu linku
				document.getElementById('forgotPasswordForm').style.display = 'none';
				alert('Link do resetowania hasła wysłany na adres e-mail.');
			})
			.catch((error) => {
				console.error('Błąd podczas wysyłania linku do resetowania hasła:', error);
			});
	} else {
		console.log('Nie podano adresu e-mail.');
		alert('Nie podano adresu e-mail.');
	}
}
