
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyC9Xyevfuy0MDFSazuQfZ2o9gMAPkmVlzI",
    authDomain: "criollitos-37c55.firebaseapp.com",
    projectId: "criollitos-37c55",
    storageBucket: "criollitos-37c55.firebasestorage.app",
    messagingSenderId: "389045014204",
    appId: "1:389045014204:web:d4c4cfbc5ee77d9c96cab9"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
