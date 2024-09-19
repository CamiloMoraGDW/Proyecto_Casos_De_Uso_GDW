import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

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

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);
const firestore = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
export default firebaseApp;
export { db, storage, firestore, auth };
