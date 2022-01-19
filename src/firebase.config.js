// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDqBqKCqDehV1KT2wCEs7qqAAFwwwRcCFI",
  authDomain: "house-marketplace-app-7aecd.firebaseapp.com",
  projectId: "house-marketplace-app-7aecd",
  storageBucket: "house-marketplace-app-7aecd.appspot.com",
  messagingSenderId: "407105408786",
  appId: "1:407105408786:web:135509b9982b32d9842dcb"
};

// Initialize Firebase
 initializeApp(firebaseConfig);
export const db = getFirestore();