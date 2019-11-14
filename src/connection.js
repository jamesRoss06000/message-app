require('dotenv').config();

export const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_DOMAIN,
  databaseURL: "https://message-app-2f7b3.firebaseio.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJEDT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
  appId: "1:318418595733:web:100410dda5ec1bc75c909c",
  measurementId: "G-KH72VESE32"
};