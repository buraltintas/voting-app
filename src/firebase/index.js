// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDZJDyGk0jO0ydRccJG2RxPxBoGCVCPbWk',
  authDomain: 'vote-for-me-fea9c.firebaseapp.com',
  projectId: 'vote-for-me-fea9c',
  storageBucket: 'vote-for-me-fea9c.appspot.com',
  messagingSenderId: '479247020688',
  appId: '1:479247020688:web:0f4ed8714dcbb05ec79e15',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { app };
