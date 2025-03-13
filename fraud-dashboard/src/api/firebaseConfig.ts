import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDJjJUZJrMFI-1Jjs2SSRnZMCxTbDUqLXE",
  authDomain: "fraud-detection-dashboard.firebaseapp.com",
  projectId: "fraud-detection-dashboard",
  storageBucket: "fraud-detection-dashboard.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:1234567890abcdef123456",
  measurementId: "G-ABCDEFGHIJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
export default app; 