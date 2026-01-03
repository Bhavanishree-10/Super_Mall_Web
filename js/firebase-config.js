// File: js/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Your specific Super Mall configuration
const firebaseConfig = {
  apiKey: "AIzaSyBK8_UyWdiEW5GiYXRk4uYHyEcN6SNi3Ns",
  authDomain: "super-mall-web-applicati-d0f9a.firebaseapp.com",
  projectId: "super-mall-web-applicati-d0f9a",
  storageBucket: "super-mall-web-applicati-d0f9a.firebasestorage.app",
  messagingSenderId: "965900328600",
  appId: "1:965900328600:web:87c433dba1360045e97aed"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };