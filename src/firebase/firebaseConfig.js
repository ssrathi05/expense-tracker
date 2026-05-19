import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDoPweY4ZwjKKdYS-IFjReU2PD5RNIJkBg",
  authDomain: "expense-tracker-37f5e.firebaseapp.com",
  projectId: "expense-tracker-37f5e",
  storageBucket: "expense-tracker-37f5e.firebasestorage.app",
  messagingSenderId: "67734627991",
  appId: "1:67734627991:web:2a8ce474cc89cb39e2abd2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);