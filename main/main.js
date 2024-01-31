const enterUsername = document.getElementById("loginUsername");
const enterPassword = document.getElementById("loginPassword");
const sendMsgBtn = document.getElementById("messageInputBtn");
const messageText = document.getElementById("messageInputTxt");

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
firebase.initializeApp(firebaseConfig);
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

/*
const dataRef = ref(database, 'data');
set(dataRef, {
  username: 'dennis647',
  password: '1234'
});
*/


firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    console.log("User is signed in:", user.uid);
  } else {
    console.log("No user is signed in.");
  }
});

const sendMsgFunc = () => {
  var message = messageText.value;
  var timestamp = new Date().getTime();
  set(ref(database,"messages/"+timestamp), {
    message : message
  }
)};

sendMsgBtn.addEventListener("click", sendMsgFunc);