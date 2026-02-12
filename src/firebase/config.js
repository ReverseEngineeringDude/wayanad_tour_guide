import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyCSpfQQF1YcSUS8EArmCGWpOxvLotnn3DI",
    authDomain: "webatt-f8aec.firebaseapp.com",
    projectId: "webatt-f8aec",
    storageBucket: "webatt-f8aec.firebasestorage.app",
    messagingSenderId: "209147481922",
    appId: "1:209147481922:web:fb4198fc5155103f6ac2db",
    measurementId: "G-PGT20MR3TX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
