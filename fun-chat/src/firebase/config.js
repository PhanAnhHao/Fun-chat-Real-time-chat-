import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBac2mzibYl9prLdspkm0CbJ8gFlcSLqrI",
    authDomain: "fun-chat-6ea38.firebaseapp.com",
    projectId: "fun-chat-6ea38",
    storageBucket: "fun-chat-6ea38.firebasestorage.app",
    messagingSenderId: "176673826171",
    appId: "1:176673826171:web:1cd294297056cd57f809de",
    measurementId: "G-Q691DVJMW9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);
const db = getFirestore(app);

export { db, auth, analytics };