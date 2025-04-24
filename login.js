console.log("✅ login.js is running!");

// ✅ Import Firebase Auth & Firestore
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ DOM fully loaded");

    // ✅ Initialize Firebase Services
    const auth = getAuth();
    const db = getFirestore();

    // ✅ Get UI Elements
    const navCenter = document.querySelector(".nav-center");
    const registerBtn = document.getElementById("register");
    const loginBtn = document.getElementById("login");
    const container = document.getElementById("container");

    // ✅ Update UI based on authentication state
    function updateUI(user) {
        if (user) {
            console.log("✅ User is logged in:", user.email);

            // ✅ Update Navbar (Hide Login, Show Profile & Logout)
            navCenter.innerHTML = `
                <a href="#" id="profile-icon" class="profile-icon">
                    <i class="fa-solid fa-user-circle"></i> ${user.email}
                </a>
                <a href="#" id="logout-button" class="logout-button">Logout</a>
            `;

            // ✅ Logout Event Listener
            document.getElementById("logout-button").addEventListener("click", async () => {
                try {
                    await signOut(auth);
                    console.log("✅ User logged out.");
                    window.location.href = "login.html"; // Redirect to login page
                } catch (error) {
                    console.error("❌ Logout Error:", error.message);
                }
            });
        } else {
            console.log("❌ No user is logged in.");
        }
    }

    // ✅ Monitor Auth State
    onAuthStateChanged(auth, (user) => {
        updateUI(user);
    });

    // ✅ Toggle Between Login & Signup Forms
    if (registerBtn && loginBtn && container) {
        registerBtn.addEventListener("click", () => container.classList.add("active"));
        loginBtn.addEventListener("click", () => container.classList.remove("active"));
    }

    // ✅ Handle Login
    document.getElementById("login-form").addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = document.getElementById("login-email").value.trim();
        const password = document.getElementById("login-password").value.trim();

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log("✅ Login successful:", userCredential.user);
            alert("Login successful!");
            window.location.href = "index.html"; // Redirect after login
        } catch (error) {
            console.error("❌ Login Error:", error.message);
            alert(error.message);
        }
    });

    // ✅ Handle Signup
    document.getElementById("signup-form").addEventListener("submit", async (event) => {
        event.preventDefault();

        const name = document.getElementById("signup-name").value.trim();
        const email = document.getElementById("signup-email").value.trim();
        const password = document.getElementById("signup-password").value.trim();

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log("✅ Account created:", userCredential.user);
            alert("Account created successfully!");

            // ✅ Save User Info in Firestore
            await setDoc(doc(db, "users", userCredential.user.uid), {
                name: name,
                email: email
            });

            console.log("✅ User data saved in Firestore.");
            setTimeout(() => container.classList.remove("active"), 500);
        } catch (error) {
            console.error("❌ Signup Error:", error.message);
            alert(error.message);
        }
    });
});

