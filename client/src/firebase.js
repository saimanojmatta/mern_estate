// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-e2de4.firebaseapp.com",
  projectId: "mern-estate-e2de4",
  storageBucket: "mern-estate-e2de4.appspot.com",
  messagingSenderId: "147407850538",
  appId: "1:147407850538:web:20261ac94f0b7bdb9dc753"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);