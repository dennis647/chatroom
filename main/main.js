// Get elements
const enterUsername = document.getElementById("loginUsername");
const enterPassword = document.getElementById("loginPassword");
const sendMsgBtn = document.getElementById("messageInputBtn");
const messageText = document.getElementById("messageInputTxt");
const loginBtn = document.getElementById("loginBtn");
const loginTxt = document.getElementById("loginTxt");
const messageContainer = document.getElementById("messageContainer");
const logoutBtn = document.getElementById("logoutBtn");

// Firebase config
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

// Firebase 
firebase.initializeApp(firebaseConfig);
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = firebase.auth();
const db = firebase.database();


// Function for logging into existing user
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

  // Retrive user from db
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

  if (auth.currentUser) {
    // Retrieve the username from DB
    var userRef = db.ref("users/" + auth.currentUser.uid);
    userRef.once("value")
      .then(function (snapshot) {
        var userName = snapshot.val().newUsername;

        // Create a message div
        var messageElement = document.createElement("div");
        messageElement.textContent = `${userName}: ${message}`;
        messageElement.classList.add("sendMessage-bubble", "user-message");

        messageContainer.appendChild(messageElement);

        // Save the message 
        set(ref(database, "messages/" + timestamp), {
          userName: userName,
          message: message
        });
      })
      .catch(function (error) {
        alert("Error fetching user data: " + error.message);
      });
  } else {
    alert("User not logged in.");
  }
};


auth.onAuthStateChanged((user) => {
  // Update UI based on the user's login state
  updateUI(user);
  messageContainer.innerHTML = "";

  if (user) {
    const messagesRef = ref(database, "messages/");
    onChildAdded(messagesRef, receiveMsgFunc);
  }
});

// Reciving messages
const receiveMsgFunc = (snapshot) => {
  var messageData = snapshot.val();
  var userName = messageData.userName;
  var message = messageData.message;

  // Create recived msg div
  var messageElement = document.createElement("div");
  messageElement.textContent = `${userName}: ${message}`;
  messageElement.classList.add("reciveMessage-bubble");

  messageContainer.appendChild(messageElement);
};

// Logout current user
const logoutUser = () => {
  auth.signOut()
    .then(() => {
      alert("User logged out successfully.");
    })
    .catch((error) => {
      alert("Error logging out: " + error.message);
    });
};


// Check if user is logged in or not
const updateUI = (user) => {
  if (user) {
    // If the user is already logged in
    var userRef = db.ref("users/" + user.uid);

    userRef.once("value")
      .then(function (snapshot) {
        var userData = snapshot.val();

        loginTxt.innerHTML = `Welcome back, ${userData.newUsername}`;
        logoutBtn.style.display="";

        userRef.update({ lastLogin: Date.now() });
      })
      .catch(function (error) {
        alert("Error fetching user data: " + error.message);
      });
  } else {
    // If the user wasn't already logged in
    loginTxt.innerHTML = "Not logged in";
    logoutBtn.style.display='none';
  }
};
auth.onAuthStateChanged((user) => {
  updateUI(user);
});

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
logoutBtn.addEventListener("click", logoutUser);