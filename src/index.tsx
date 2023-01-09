import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator} from "firebase/auth";
import {getFirestore, connectFirestoreEmulator} from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyAAm-ZWz8WXp8BYIKmYzK3pdOjATmGsTVc",
    authDomain: "sheska-cd5cb.firebaseapp.com",
    projectId: "sheska-cd5cb",
    storageBucket: "sheska-cd5cb.appspot.com",
    messagingSenderId: "83565776369",
    appId: "1:83565776369:web:79f8049a0ae0818cde8850",
    measurementId: "G-XLER2C53C1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)

// connectAuthEmulator(auth, "http://localhost:9099")
// connectFirestoreEmulator(db, 'localhost', 8080);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
