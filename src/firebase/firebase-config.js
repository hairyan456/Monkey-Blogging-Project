import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBxRIF50ZEHfjfVP-QXktwX8y6XDMZfzBI",
    authDomain: "monkey-blogging-7cb78.firebaseapp.com",
    projectId: "monkey-blogging-7cb78",
    storageBucket: "monkey-blogging-7cb78.appspot.com",
    messagingSenderId: "576630689190",
    appId: "1:576630689190:web:6d4d7e28f39f332a1e1367"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Init services:
export const db = getFirestore(app);
export const auth = getAuth(app);