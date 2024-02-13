const registerUsername = document.getElementById("registerUsern");
const registerPassword = document.getElementById("registerPassword");
const registerBtn = document.getElementById("registerBtn");
const registerEmail = document.getElementById("registerEmail");


// Add in firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.5.0/firebase-app.js';
import { getDatabase, ref, set, remove, onChildAdded, onChildRemoved } from 'https://www.gstatic.com/firebasejs/9.5.0/firebase-database.js';

const firebaseConfig = {
  apiKey: "AIzaSyBQZGdqHihNGbuhmwzO-rL7SH4qoElo1Vc",
  authDomain: "chatroom-8242c.firebaseapp.com",
  databaseURL: "https://chatroom-8242c-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "chatroom-8242c",
  storageBucket: "chatroom-8242c.appspot.com",
  messagingSenderId: "256590892317",
  appId: "1:256590892317:web:4917a7f2e6117cb09b65f4",
  measurementId: "G-LS8QHLL32M"
};

firebase.initializeApp(firebaseConfig);
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = firebase.auth();
const db = firebase.database();

// Registering as a new user
const registerUser = () => {
 var newUsername = registerUsername.value;
 var newUserPassword = registerPassword.value;
 var email = registerEmail.value;

 if (validate_email(email) == false){
  alert("This isn't a valid email adress");
  return
 }

  if (validateField(newUsername) == false || validateField(newUserPassword) == false) {
    alert('You need to input username & password');
    return;
  }

  // Register the user in firebase
  auth.createUserWithEmailAndPassword(email, newUserPassword)
  .then((userCredential) => {
    var user = userCredential.user;

    user.updateProfile({
      displayName: newUsername
    })
    .then(() => {

    var dbRef = db.ref();
    var userData = {
      email : email,
      newUsername : newUsername,
      lastLogin : Date.now()
    }

    dbRef.child("users/"+user.uid).set(userData);

    alert(`User has been created`);

  })
  })
  .catch(function(error) {
    var error_msg = error.message;
    alert(error_msg)
  });
  }

  // Validate if email is a valid email
const validate_email = (email) => {
  var expression = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  if (expression.test(email) == true) {
    return true;
  } else {
    return false;
  }
}

// Check if the fields have input
 const validateField = (field) => {
  if (field == null || field <= 0 ) {
    return false;
  } else {
    return true;
  }
 }

 // Button on click
 registerBtn.addEventListener("click", registerUser);