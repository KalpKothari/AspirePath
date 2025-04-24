// ✅ Import `auth` from `firebase.js`
import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ authStatus.js loaded!");

    const authLink = document.getElementById("auth-link"); // Login/Sign-Up Button
    const userIcon = document.getElementById("user-icon"); // User Icon
    const logoutBtn = document.getElementById("logout"); // Logout Button

    // ✅ Ensure profile icon is hidden by default
    if (userIcon) userIcon.classList.add("hidden");

    // ✅ Check if user is logged in
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("✅ User is logged in:", user.email);

            if (authLink) authLink.style.display = "none"; // Hide login button
            if (userIcon) userIcon.classList.remove("hidden"); // Show profile icon
            if (logoutBtn) logoutBtn.classList.remove("hidden"); // Show logout button
        } else {
            console.log("❌ No user is logged in.");

            if (authLink) authLink.style.display = "block"; // Show login button
            if (userIcon) userIcon.classList.add("hidden"); // Hide profile icon
            if (logoutBtn) logoutBtn.classList.add("hidden"); // Hide logout button
        }
    });

    // ✅ Handle Logout Click Event
    if (logoutBtn) {
        logoutBtn.addEventListener("click", async () => {
            try {
                await signOut(auth);
                console.log("✅ User logged out.");
                window.location.href = "login.html"; // Redirect to login page
            } catch (error) {
                console.error("❌ Logout Error:", error.message);
            }
        });
    }
});
