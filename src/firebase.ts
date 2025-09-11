
import { initializeApp, getApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

interface FirebaseServices {
    app: FirebaseApp;
    auth: Auth;
    db: Firestore;
}

// This function fetches the config and initializes Firebase.
// It's designed to run only once.
const getFirebaseServices = async (): Promise<FirebaseServices> => {
  if (getApps().length) {
    const app = getApp();
    return { app, auth: getAuth(app), db: getFirestore(app) };
  }

  const response = await fetch('/.netlify/functions/get-firebase-config');
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error("Failed to fetch Firebase config:", errorText);
    throw new Error(`Could not initialize Firebase. Please check server configuration. Details: ${errorText}`);
  }
  
  const firebaseConfig = await response.json();

  if (!firebaseConfig.apiKey) {
    throw new Error("Firebase API key is missing in config from server. The application cannot start.");
  }
  
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  
  return { app, auth, db };
};

// We create a promise that resolves with the initialized services.
// Any part of the app that needs Firebase can await this promise.
export const firebaseServicesPromise = getFirebaseServices();