import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBH_hYQz4zbQpz0C8KScU1y3czXvuc7FpI",
    authDomain: "dockxyyy.firebaseapp.com",
    projectId: "dockxyyy",
    storageBucket: "dockxyyy.firebasestorage.app",
    messagingSenderId: "735358760743",
    appId: "1:735358760743:web:91404ac2d779fc5cab9b02",
    measurementId: "G-S82E8GG9V2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth,db };

