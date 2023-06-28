import 'bootstrap/dist/css/bootstrap.min.css';
import { connectStorageEmulator, getStorage } from "firebase/storage";
import 'font-awesome/css/font-awesome.min.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { firebaseConfig, RECAPTCHA_CONFIG, STRIPE_CONFIG } from './credentials';
import './index.scss';
import reportWebVitals from './reportWebVitals';
import app from "./fbConfig"

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import {connectFunctionsEmulator, getFunctions} from 'firebase/functions';
import {initializeAppCheck, ReCaptchaV3Provider} from "firebase/app-check";

// Initialize Firebase
// export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)
// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);

export const functions = getFunctions(app)

export const STRIPE_PUBLISHABLE_KEY = STRIPE_CONFIG.STRIPE_PUBLISHABLE_KEY

// //app check for ReCaptcha and API verification
const appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(process.env.REACT_APP_RECAPTCHA_SITE_KEY as string),
    isTokenAutoRefreshEnabled: true
})

console.log('RECAPTCHA SITE KEY', process.env.REACT_APP_RECAPTCHA_SITE_KEY)

if(process.env.REACT_APP_EMULATOR_ON === 'true') {
    console.log('EMULATOR MODE ON')
    connectAuthEmulator(auth, "http://localhost:9099")
    connectFirestoreEmulator(db, 'localhost', 8081);
    connectStorageEmulator(storage, "localhost", 9199);
    connectFunctionsEmulator(functions, 'localhost', 5001);
}

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
