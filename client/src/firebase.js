// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

//old
/* const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'mern-blog-b327f.firebaseapp.com',
  projectId: 'mern-blog-b327f',
  storageBucket: 'mern-blog-b327f.appspot.com',
  messagingSenderId: '699397991367',
  appId: '1:699397991367:web:88ff565ef72a182d6b87e2',
}; */
/* const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "reddit-clone-3136d.firebaseapp.com",
  projectId: "reddit-clone-3136d",
  storageBucket: "reddit-clone-3136d.appspot.com",
  messagingSenderId: "1067161397327",
  appId: "1:1067161397327:web:670c2adb7f6a2ff346a23a",
}; */
const firebaseConfig = {
  apiKey: "AIzaSyDUvxFA7Vv_FHmhzmxLsWs-Iw5BNdpHFuw",
  authDomain: "mern-blog-1c1f6.firebaseapp.com",
  projectId: "mern-blog-1c1f6",
  storageBucket: "mern-blog-1c1f6.appspot.com",
  messagingSenderId: "916742751526",
  appId: "1:916742751526:web:3c028738af122cfece6de7",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
