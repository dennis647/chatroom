const enterUsername = document.getElementById("loginUsername");
const enterPassword = document.getElementById("loginPassword");
const sendMsgBtn = document.getElementById("messageInputBtn");
const messageText = document.getElementById("messageInputTxt");
const loginBtn = document.getElementById("loginBtn");
const loginTxt = document.getElementById("loginTxt");

var sender;

// main.js
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

// Firebase configurations
firebase.initializeApp(firebaseConfig);
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = firebase.auth();
const db = firebase.database();


// Log into existing user
const loginUser = () => {

  var Email = enterUsername.value;
  var Password = enterPassword.value;

  if (validateField(Email) == false || validateField(Password) == false) {
    alert('You need to type in a username & password');
    return;
}

// Sign in with the email and password
auth.signInWithEmailAndPassword(Email, Password)
.then(function() {

  var user = auth.currentUser;

  var dbRef = db.ref("users/" + user.uid);
  dbRef.once("value")
  .then(function (snapshot) {
    var userData = snapshot.val();
    var lastLogin = userData.lastLogin;

    loginTxt.innerHTML = `Welcome, ${userData.newUsername}`;

    dbRef.update({ lastLogin: Date.now() });
  })

  .catch(function (error) {
    alert("Error fetching user data: " + error.message);
  });
})
.catch(function(error) {
  var error_msg = error.message;

  alert(error_msg)
});

}

// Function for sending messages
const sendMsgFunc = () => {
  var message = messageText.value;
  var timestamp = new Date().getTime();

  // Get the current user
  var user = auth.currentUser;

  // Check if the user is logged in
  if (user) {
    var userRef = db.ref("users/" + user.uid);
    userRef.once("value")
      .then(function(snapshot) {
        var userName = snapshot.val().newUsername;

        // Save the message with the sender's username
        set(ref(database, "messages/" + timestamp), {
          userName: userName,
          message: message
        });
      })
      .catch(function(error) {
        alert("Error fetching user data: " + error.message);
      });
  } else {
    alert("User not logged in.");
  }
};


const validateField = (field) => {
  if (field == null || field <= 0 ) {
    return false;
  } else {
    return true;
  }
 }

 // Eventslisteners for button onclicks.
sendMsgBtn.addEventListener("click", sendMsgFunc);
loginBtn.addEventListener("click", loginUser);