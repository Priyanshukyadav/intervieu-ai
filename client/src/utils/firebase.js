
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
const apiKey = import.meta.env.VITE_FIREBASE_APIKEY?.trim();

if (!apiKey || apiKey.toLowerCase().includes("add your firebase key")) {
  throw new Error(
    "Firebase is not configured. Set VITE_FIREBASE_APIKEY in client/.env to the Web API key from your Firebase project."
  );
}

const firebaseConfig = {
  apiKey,
  authDomain: "multiagent-290d8.firebaseapp.com", 
  projectId: "multiagent-290d8",
  storageBucket: "multiagent-290d8.firebasestorage.app",
  messagingSenderId: "1063914743858",
  appId: "1:1063914743858:web:50126614dba38d895bb42b",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider()

export {auth , provider}