var database = firebase.database();

database.ref('data').set({
  name: 'Ola Normann',
  age: 19
});

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