import * as firebase from 'firebase';

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: 'AIzaSyAzr246UYDDWhCIYLlnkwMME30zqx7rtJQ',
  authDomain: 'user-oranoss-chjtic.firebaseapp.com',
  databaseURL: 'https://user-oranoss-chjtic.firebaseio.com',
  projectId: 'user-oranoss-chjtic',
  storageBucket: 'user-oranoss-chjtic.appspot.com',
  messagingSenderId: '1065029003332',
  appId: '1:1065029003332:web:c56ee0f0627e97d4543411'
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
