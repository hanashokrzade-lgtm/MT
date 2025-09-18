// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "fir-feat-expl-da653",
  "appId": "1:933703929312:web:7f642c676b645b2069b2d8",
  "storageBucket": "fir-feat-expl-da653.appspot.com",
  "apiKey": "AIzaSyB-eA-p0Z0qzqpbZkp5zZ4JvO_iCgJq2s",
  "authDomain": "fir-feat-expl-da653.firebaseapp.com",
  "messagingSenderId": "933703929312"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { app };
