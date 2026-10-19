
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.FIREBASE_AUTH_KEY ,
  authDomain: "intervieueiq.firebaseapp.com",
  projectId: "intervieueiq",
  storageBucket: "intervieueiq.firebasestorage.app",
  messagingSenderId: "337548832964",
  appId: "1:337548832964:web:083f89dc693cf8c08d1991"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider()

export {auth , provider}