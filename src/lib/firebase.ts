import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, enableMultiTabIndexedDbPersistence, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Enable persistence
enableMultiTabIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    // Multiple tabs open, persistence can only be enabled in one tab at a time.
    console.warn('Firestore persistence failed: Multiple tabs open');
  } else if (err.code === 'unimplemented') {
    // The current browser does not support all of the features required to enable persistence
    console.warn('Firestore persistence is not supported by this browser');
  }
});

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const logout = () => signOut(auth);

// Test connection safely on startup with a retry limit and without blocking false-positive console errors
async function testConnection() {
  let retries = 3;
  while (retries > 0) {
    try {
      await getDocFromServer(doc(db, 'courses', 'init_test'));
      break; // Successfully reached firestore database nodes
    } catch (error) {
      if (error instanceof Error && error.message.includes('the client is offline')) {
        retries--;
        if (retries === 0) {
          console.warn("Firebase connection status: Client is currently operating in offline/cached stance.");
        } else {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } else {
        // Any permission or other errors should not result in offline check fail
        break;
      }
    }
  }
}
testConnection();
