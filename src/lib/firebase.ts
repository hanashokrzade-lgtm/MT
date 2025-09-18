// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";

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

// Initialize Firebase using a singleton pattern
function getFirebaseApp(): FirebaseApp {
    if (!getApps().length) {
        return initializeApp(firebaseConfig);
    }
    return getApp();
}

export const app = getFirebaseApp();
