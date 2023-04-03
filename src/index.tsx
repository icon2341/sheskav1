import 'bootstrap/dist/css/bootstrap.min.css';
import { connectStorageEmulator, getStorage } from "firebase/storage";
import 'font-awesome/css/font-awesome.min.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { firebaseConfig } from './credentials';
import './index.scss';
import reportWebVitals from './reportWebVitals';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);

// connectAuthEmulator(auth, "http://localhost:9099")
// connectFirestoreEmulator(db, 'localhost', 8081);
// connectStorageEmulator(storage, "localhost", 9199);

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
