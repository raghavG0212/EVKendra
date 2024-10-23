// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "voting-system-b5ad3.firebaseapp.com",
  projectId: "voting-system-b5ad3",
  storageBucket: "voting-system-b5ad3.appspot.com",
  messagingSenderId: "25711088648",
  appId: "1:25711088648:web:3f5c240c7bc3a08796adbd",
  measurementId: "G-1RWYLKQKJ0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
