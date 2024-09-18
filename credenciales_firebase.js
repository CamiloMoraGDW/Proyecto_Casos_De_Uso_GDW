// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBP3EKr2L0W-Dm3kCeu8w9uSASGIlAm3sg",
  authDomain: "godoworks-30051.firebaseapp.com",
  databaseURL: "https://godoworks-30051.firebaseio.com",
  projectId: "godoworks-30051",
  storageBucket: "godoworks-30051.appspot.com",
  messagingSenderId: "99759435518",
  appId: "1:99759435518:web:7571526d80b5960ff7ffaf",
  measurementId: "G-MH3X0CDWQ2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
