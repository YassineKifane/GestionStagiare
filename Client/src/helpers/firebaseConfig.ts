// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import 'firebase/storage';
import { getStorage} from "firebase/storage";



const firebaseConfig = {
  apiKey: "AIzaSyDnyhwW4Cl6vh--gmz9sNAmvVqAVzR6VMA",
  authDomain: "ocp-app-1c50a.firebaseapp.com",
  projectId: "ocp-app-1c50a",
  storageBucket: "ocp-app-1c50a.appspot.com",
  messagingSenderId: "707784505358",
  appId: "1:707784505358:web:262a6c49584ae1c593245f",
  measurementId: "G-NX9RDSS336"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const storage = getStorage();

