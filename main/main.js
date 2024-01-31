// main.js
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.5.0/firebase-app.js';
import { getDatabase, ref, set } from 'https://www.gstatic.com/firebasejs/9.5.0/firebase-database.js';

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
export const app = initializeApp(firebaseConfig);
const database = getDatabase(app);


const dataRef = ref(database, 'data');
set(dataRef, {
  name: 'Ola Normann',
  age: 19
});

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    console.log("User is signed in:", user.uid);
  } else {
    console.log("No user is signed in.");
  }
});

// Your main.js code goes here


/*
// Get a reference to the authentication service and database

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      console.log("User is signed in:", user.uid);
    } else {
      console.log("No user is signed in.");
    }
  });



  // Sign up
  firebase.auth().createUser(userName, password)
    .then((userCredential) => {
      // User registered successfully
      var user = userCredential.user;
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.error(errorMessage);
    });

  // Sign in
  firebase.auth().userSignIn(userName, password)
    .then((userCredential) => {
      // User signed in successfully
      var user = userCredential.user;
    })

    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.error(errorMessage);
      alert('This user doesnt exist');
    });

  // Sign out
  firebase.auth().signOut().then(() => {
    // User signed out successfully
  }).catch((error) => {
    console.error(error.message);
  });


  const db = firebase.database();

  db.ref("messages").push({
    sender: userId,
    message: "Hello, Firebase!",
    timestamp: firebase.database.ServerValue.TIMESTAMP,
  });
*/