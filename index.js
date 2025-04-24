// ✅ Import Firebase Modules
import { auth } from "./firebase.js"; // Import Firebase Authentication

document.addEventListener("DOMContentLoaded", function () {
    const authLink = document.getElementById("auth-link"); // Login/Sign-Up Button
    const userIcon = document.getElementById("user-icon"); // User Icon
    const logoutBtn = document.getElementById("logout"); // Logout Button

    // ✅ Use Firebase Auth State Listener
    auth.onAuthStateChanged((user) => {
        if (user) {
            // User is logged in
            if (authLink) authLink.style.display = "none";
            if (userIcon) userIcon.style.display = "block";
        } else {
            // User is NOT logged in
            if (authLink) authLink.style.display = "block";
            if (userIcon) userIcon.style.display = "none";
        }
    });

    // 🔴 Logout Functionality
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            auth.signOut().then(() => {
                alert("Logged out successfully!");
                window.location.href = "login.html"; // Redirect to login page
            }).catch(error => {
                console.error("Logout Error:", error);
            });
        });
    }

    // 🔍 Handle User Profile Click
    if (userIcon) {
        userIcon.addEventListener("click", function () {
            window.location.href = "dashboard/profile.html"; // Ensure this page exists
        });
    }
});

// ✅ Job Search Suggestions
const jobSuggestions = [
    { title: "Web Developer", company: "Google", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
    { title: "Frontend Developer", company: "Meta", logo: "https://upload.wikimedia.org/wikipedia/commons/b/b2/Meta_Platforms_Inc._logo.svg" },
    { title: "Backend Developer", company: "Netflix", logo: "https://upload.wikimedia.org/wikipedia/commons/6/69/Netflix_logo.svg" },
    { title: "Full Stack Developer", company: "Apple", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" },
    { title: "Software Engineer", company: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" },
    { title: "AI Engineer", company: "OpenAI", logo: "https://upload.wikimedia.org/wikipedia/commons/8/80/OpenAI_Logo.svg" },
    { title: "Machine Learning Engineer", company: "Tesla", logo: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Tesla_Motors.svg" },
    { title: "Data Analyst", company: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
    { title: "Business Analyst", company: "SAP", logo: "https://upload.wikimedia.org/wikipedia/commons/5/59/SAP_2011_logo.svg" },
    { title: "Data Scientist", company: "IBM", logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg" }
];

// 🔎 Show Search Suggestions
function showSuggestions(query) {
    const dropdown = document.getElementById("suggestions-dropdown");
    if (!dropdown) return; // Ensure dropdown exists

    dropdown.innerHTML = ""; // Clear previous results

    // 🔹 Prevent empty searches from displaying results
    if (!query || query.trim().length === 0) {
        dropdown.style.display = "none";
        return;
    }

    const filteredJobs = jobSuggestions.filter(job =>
        job.title.toLowerCase().includes(query.toLowerCase())
    );

    if (filteredJobs.length === 0) {
        dropdown.style.display = "none";
        return;
    }

    dropdown.style.display = "block";

    filteredJobs.forEach(job => {
        const jobElement = document.createElement("div");
        jobElement.classList.add("job-suggestion");
        jobElement.innerHTML = `
            <img src="${job.logo}" alt="${job.company}" class="company-logo">
            <span>${job.title} - ${job.company}</span>
        `;
        jobElement.onclick = () => {
            const searchInput = document.getElementById("job-search");
            if (searchInput) {
                searchInput.value = job.title;
                dropdown.style.display = "none";
            }
        };
        dropdown.appendChild(jobElement);
    });
}

// 🔍 Hide dropdown when clicking outside
document.addEventListener("click", function(event) {
    const dropdown = document.getElementById("suggestions-dropdown");
    const searchInput = document.getElementById("job-search");
    
    if (dropdown && searchInput && !dropdown.contains(event.target) && event.target !== searchInput) {
        dropdown.style.display = "none";
    }
});
