// ✅ Import Firebase Modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-storage.js";

// ✅ Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyApUQ8M7eKDtlI2dxrdxfThg8SWq6YfBEM",
    authDomain: "aspirepath-ba35b.firebaseapp.com",
    projectId: "aspirepath-ba35b",
    storageBucket: "aspirepath-ba35b.appspot.com",
    messagingSenderId: "746266885309",
    appId: "1:746266885309:web:0d9718383c10817c314bd4"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// ✅ Export `auth`, `db`, and `storage`
export { auth, db, storage };

console.log("✅ Firebase initialized successfully!");
