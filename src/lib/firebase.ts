// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "studio-7643117538-ce531",
  "appId": "1:1015243920281:web:d3f61595aa3e65c57e7908",
  "storageBucket": "studio-7643117538-ce531.firebasestorage.app",
  "apiKey": "AIzaSyD6bPwUGV-CSAglHG6rUgrMg7KdEb9NBrY",
  "authDomain": "studio-7643117538-ce531.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "1015243920281"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { app };
