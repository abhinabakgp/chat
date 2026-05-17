import {initializeApp}
from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js';

import {getAuth}
from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js';

import {getFirestore}
from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAtr-7b-oaFs5A6sN69mzJp6jZ6mSpWLaU",
  authDomain: "chat-app-15938.firebaseapp.com",
  projectId: "chat-app-15938",
  storageBucket: "chat-app-15938.firebasestorage.app",
  messagingSenderId: "675261403694",
  appId: "1:675261403694:web:1b4388265a2936df9d05bf",
  measurementId: "G-29LF6W4EJL"
};

const app=initializeApp(firebaseConfig);

export const auth=getAuth(app);
export const db=getFirestore(app);