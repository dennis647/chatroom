// Get elements
const enterUsername = document.getElementById("loginUsername");
const enterPassword = document.getElementById("loginPassword");
const sendMsgBtn1 = document.getElementById(`messageInputBtnchatroom1`);
const sendMsgBtn2 = document.getElementById(`messageInputBtnchatroom2`);
const loginBtn = document.getElementById("loginBtn");
const loginTxt = document.getElementById("loginTxt");
const logoutBtn = document.getElementById("logoutBtn");
const chatroomsList = document.getElementById("chatroomsList");

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

  const Email = enterUsername.value;
  const Password = enterPassword.value;

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

// Select chatroom
const switchChatroom = (chatroomId) => {
  const chatrooms = document.querySelectorAll('.chatroom');
  chatrooms.forEach((chatroom) => {
    chatroom.style.display = 'none';
  });
  
  // Check if there is an element with the class 'active-chatroom'
  const activeChatroom = chatroomsList.querySelector('.active-chatroom');
  if (activeChatroom) {
    activeChatroom.classList.remove('active-chatroom');
  }
  
  const selectedChatroom = document.getElementById(chatroomId);
  selectedChatroom.style.display = 'block';
  chatroomsList.querySelector(`[data-chatroom="${chatroomId}"]`).classList.add('active-chatroom');
};


// Function for sending messages
const sendMsgFunc = (chatroomId) => {
  const messageText = document.getElementById(`messageInputTxt${chatroomId}`);
  var message = messageText.value;
  var timestamp = new Date().getTime();

  // Retrieve the username from DB
  if (auth.currentUser) {
    var userRef = db.ref("users/" + auth.currentUser.uid);
    userRef.once("value")
      .then(function (snapshot) {
        var userName = snapshot.val().newUsername;
        const messageContainer = document.getElementById(`messageContainer${chatroomId}`);

        // Create a message div
        var messageElement = document.createElement("div");
        messageElement.textContent = `${userName}: ${message}`;
        messageElement.classList.add("sendMessage-bubble", "user-message");

        messageContainer.appendChild(messageElement);

        // Save the message 
        set(ref(database, `messages/${chatroomId}/` + timestamp), {
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



// Reciving messages
const receiveMsgFunc = (chatroomId) => {
  var messageElement = document.createElement("div");

  const messagesRef = ref(database, `messages/${chatroomId}/`);
  onChildAdded(messagesRef, (snapshot) => {
    var messageData = snapshot.val();
    var userName = messageData.userName;
    var message = messageData.message;

    messageElement.textContent = `${userName}: ${message}`;
    messageElement.classList.add("reciveMessage-bubble");

    const messageContainer = document.getElementById(`messageContainer${chatroomId}`);
    messageContainer.appendChild(messageElement);
  });
};


// Update UI based on the user's login state
auth.onAuthStateChanged((user) => {
  updateUI(user);
  if (user) {
    const messagesRef1 = ref(database, "messages/chatroom1/");
    onChildAdded(messagesRef1, () => receiveMsgFunc("chatroom1"));

    const messagesRef2 = ref(database, "messages/chatroom2/");
    onChildAdded(messagesRef2, () => receiveMsgFunc("chatroom2"));
  }
});


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
loginBtn.addEventListener("click", loginUser);
logoutBtn.addEventListener("click", logoutUser);

sendMsgBtn1.addEventListener("click", () => {
  const activeChatroomId = document.querySelector('.active-chatroom')?.getAttribute('data-chatroom'); // Added nullish coalescing operator
  if (activeChatroomId) {
    sendMsgFunc(activeChatroomId);
  } else {
    console.error('No active chatroom found');
  }
});

sendMsgBtn2.addEventListener("click", () => {
  const activeChatroomId = document.querySelector('.active-chatroom')?.getAttribute('data-chatroom'); // Added nullish coalescing operator
  if (activeChatroomId) {
    sendMsgFunc(activeChatroomId);
  } else {
    console.error('No active chatroom found');
  }
});

chatroomsList.addEventListener('click', (event) => {
  if (event.target.classList.contains('chatroomBtn')) {
    const chatroomId = event.target.dataset.chatroom;
    switchChatroom(chatroomId);
    receiveMsgFunc(chatroomId);
  }
});