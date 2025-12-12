import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: "vingo-mern-stack.firebaseapp.com",
  projectId: "vingo-mern-stack",
  storageBucket: "vingo-mern-stack.appspot.com",
  messagingSenderId: "1081187450702",
  appId: "1:1081187450702:web:e77b405fbc0cb837e6e81f"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
