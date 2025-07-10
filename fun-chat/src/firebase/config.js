import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";

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

if (window.location.hostname === 'localhost') {
    connectAuthEmulator(auth, 'http://localhost:9099');
    connectFirestoreEmulator(db, 'localhost', 8080);
}
export { db, auth, analytics };