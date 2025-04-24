import { auth, db } from '../firebase.js';
import { 
    collection, 
    getDocs,
    doc,
    deleteDoc,
    addDoc,
    serverTimestamp,
    getDoc,
    updateDoc
} from 'https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js';



document.addEventListener("DOMContentLoaded", function() {
    console.log("🔥 Script is running!");
    console.log("Profile.js Loaded");
    
    // Initialize all buttons
    initializeButtons();
    
    // Check Firebase availability
    if (auth && db) {
        console.log("Firebase is available.");
    } else {
        console.error("Firebase is not available.");
    }
});

function initializeButtons() {
    const homeButton = document.getElementById("home-button");
    const homeButtn = document.getElementById("home-buttn");
    const logoutButton = document.querySelector("#settingsMenu li:nth-child(2)");
    
    if (homeButton) {
        homeButton.addEventListener("click", () => window.location.href = "../index.html");
    }
    
    if (homeButtn) {
        homeButtn.addEventListener("click", () => window.location.href = "../index.html");
    }
    
    if (logoutButton) {
        logoutButton.addEventListener("click", handleLogout);
    }
}

function handleLogout() {
    auth.signOut().then(() => {
        sessionStorage.clear();
        alert("You have been logged out.");
        window.location.href = "../login.html";
    }).catch((error) => {
        console.error("Logout error:", error);
    });
}

console.log("from profile.js", auth, db)
// profile.js

// Add auth state listener at the top of the file
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        loadUserData(user);
    } else {
        // User is signed out
        window.location.href = "../login.html";
    }
});

// Create function to load user data
async function loadUserData(user) {
    try {
        if (!user?.uid) {
            console.error('❌ No user ID provided');
            return;
        }

        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const userData = userSnap.data();
            // Update UI with user data
            document.getElementById("displayName").textContent = userData.name || "Name not set";
            document.getElementById("displayEmail").textContent = userData.email || "Email not set";
            document.getElementById("displayPhone").textContent = userData.phone || "Phone not set";
            document.getElementById("displayLocation").textContent = userData.location || "Location not set";
            
            // Populate input fields for editing
            document.getElementById("inputName").value = userData.name || "";
            document.getElementById("inputEmail").value = userData.email || "";
            document.getElementById("inputPhone").value = userData.phone || "";
            document.getElementById("inputLocation").value = userData.location || "";

            console.log('✅ User data loaded successfully');
        } else {
            console.log("❌ No user document found!");
        }
    } catch (error) {
        console.error("❌ Error loading user data:", error);
    }
}

 // Fetch user data from Firebase (if logged in)
 const user = auth.currentUser; // Instead of firebase.auth().currentUser

 if (user) {
     // Fetch the user info from Firestore
     const userRef = db.collection("users").doc(user.uid); // Instead of firebase.firestore().collection()
     userRef.get().then((doc) => {
         if (doc.exists) {
             const userData = doc.data();
             // Display user data on the profile
             document.getElementById("displayName").textContent = userData.name || "Name not set";
             document.getElementById("displayEmail").textContent = userData.email || "Email not set";
             document.getElementById("displayPhone").textContent = userData.phone || "Phone not set";
             document.getElementById("displayLocation").textContent = userData.location || "Location not set";
             
             // Populate input fields with current user data for editing
             document.getElementById("inputName").value = userData.name || "";
             document.getElementById("inputEmail").value = userData.email || "";
             document.getElementById("inputPhone").value = userData.phone || "";
             document.getElementById("inputLocation").value = userData.location || "";
         } else {
             console.log("No such document!");
         }
     }).catch((error) => {
         console.error("Error getting document:", error);
     });
 }

// Update the save profile event listener
document.getElementById('saveProfile').addEventListener('click', async function() {
    try {
        const userId = auth.currentUser?.uid;
        if (!userId) {
            console.error('❌ No user logged in');
            return;
        }

        const userData = {
            name: document.getElementById('inputName').value,
            email: document.getElementById('inputEmail').value,
            phone: document.getElementById('inputPhone').value,
            location: document.getElementById('inputLocation').value,
            updatedAt: serverTimestamp()
        };

        // Update using v9 syntax
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, userData);

        console.log('✅ Profile updated successfully!');
        window.location.reload();
    } catch (error) {
        console.error('❌ Error updating profile:', error);
        alert('Failed to update profile!');
    }
});

// LogOut
document.addEventListener("DOMContentLoaded", function () {
const logoutButton = document.querySelector("#settingsMenu li:nth-child(2)"); // Selects "Log Out"

// Logout Functionality
logoutButton.addEventListener("click", function () {
sessionStorage.clear(); // ❌ Clears session storage (logs out user)
alert("You have been logged out.");
window.location.href = "../login.html"; // ✅ Redirect to login page
});
});

// Delete Account 
document.addEventListener("DOMContentLoaded", function () {
const deleteButton = document.querySelector("#settingsMenu li:nth-child(3)"); // Delete Account button

// Delete Account Functionality with Confirmation Popup
deleteButton.addEventListener("click", function () {
showDeletePopup(); // Show the confirmation popup
});

// Function to create and show the delete confirmation popup
function showDeletePopup() {
// Create popup overlay
const popupOverlay = document.createElement("div");
popupOverlay.id = "popupOverlay";
popupOverlay.style.position = "fixed";
popupOverlay.style.top = "0";
popupOverlay.style.left = "0";
popupOverlay.style.width = "100%";
popupOverlay.style.height = "100%";
popupOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
popupOverlay.style.display = "flex";
popupOverlay.style.alignItems = "center";
popupOverlay.style.justifyContent = "center";
popupOverlay.style.zIndex = "1000";

// Create popup box
const popupBox = document.createElement("div");
popupBox.style.background = "white";
popupBox.style.padding = "20px";
popupBox.style.borderRadius = "10px";
popupBox.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
popupBox.style.textAlign = "center";
popupBox.style.width = "320px";
popupBox.style.transform = "scale(0.9)";
popupBox.style.transition = "transform 0.3s ease-in-out";
popupBox.classList.add("shake-animation");

// Apply shake effect
setTimeout(() => {
    popupBox.style.transform = "scale(1)";
}, 100);

// Confirmation message
const message = document.createElement("p");
message.innerText = "Are you sure you want to delete your account? This action cannot be undone.";
message.style.marginBottom = "15px";

// Create "Yes, Delete" button
const confirmButton = document.createElement("button");
confirmButton.innerText = "Yes, Delete";
confirmButton.style.background = "red";
confirmButton.style.color = "white";
confirmButton.style.border = "none";
confirmButton.style.padding = "10px";
confirmButton.style.borderRadius = "5px";
confirmButton.style.marginRight = "10px";
confirmButton.style.cursor = "pointer";
confirmButton.style.transition = "transform 0.2s ease-in-out";

// Create "Cancel" button
const cancelButton = document.createElement("button");
cancelButton.innerText = "Cancel";
cancelButton.style.background = "gray";
cancelButton.style.color = "white";
cancelButton.style.border = "none";
cancelButton.style.padding = "10px";
cancelButton.style.borderRadius = "5px";
cancelButton.style.cursor = "pointer";
cancelButton.style.transition = "opacity 0.3s ease-in-out";

// Delete account action with explosion effect
confirmButton.addEventListener("click", function () {
    popupBox.style.transform = "scale(1.2)";
    setTimeout(() => {
        popupBox.style.transition = "opacity 0.5s ease-out";
        popupBox.style.opacity = "0";
        setTimeout(() => {
            localStorage.clear();
            sessionStorage.clear();
            alert("Your account has been deleted.");
            window.location.href = "../login.html";
        }, 500);
    }, 200);
});

// Cancel action with smooth slide-up effect
cancelButton.addEventListener("click", function () {
    popupBox.style.transition = "transform 0.3s ease-in-out";
    popupBox.style.transform = "translateY(-100px)";
    setTimeout(() => {
        document.body.removeChild(popupOverlay);
    }, 300);
});

// Append everything
popupBox.appendChild(message);
popupBox.appendChild(confirmButton);
popupBox.appendChild(cancelButton);
popupOverlay.appendChild(popupBox);
document.body.appendChild(popupOverlay);
}
});

// Settings Toggle
document.getElementById('settingsButton').addEventListener('click', function() {
    document.getElementById('settingsMenu').classList.toggle('hidden');
});

// Profile Edit
document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded!");
    
    const editButton = document.getElementById("editProfile");
    const profileEdit = document.getElementById("profileEdit");

    if (!editButton) {
        console.log("Edit button NOT found!");
    } else {
        console.log("Edit button found!");
    }

    if (!profileEdit) {
        console.log("Profile edit section NOT found!");
    } else {
        console.log("Profile edit section found!");
    }

    if (editButton && profileEdit) {
        editButton.addEventListener("click", function () {
            console.log("Edit button clicked!");
            profileEdit.classList.toggle("hidden");
            console.log("Toggled 'hidden' class:", profileEdit.classList.contains("hidden"));
        });
    }
});


document.getElementById('saveProfile').addEventListener('click', function(event) {
const name = document.getElementById('inputName');
const email = document.getElementById('inputEmail');
const phone = document.getElementById('inputPhone');

const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const phoneError = document.getElementById('phoneError');

let isValid = true;

// Reset styles and hide errors
name.classList.remove('border-red-500');
email.classList.remove('border-red-500');
phone.classList.remove('border-red-500');

nameError.classList.add('hidden');
emailError.classList.add('hidden');
phoneError.classList.add('hidden');

if (!name.value.trim()) {
name.classList.add('border-red-500');
nameError.classList.remove('hidden');
isValid = false;
}
if (!email.value.trim()) {
email.classList.add('border-red-500');
emailError.classList.remove('hidden');
isValid = false;
}
if (!phone.value.trim()) {
phone.classList.add('border-red-500');
phoneError.classList.remove('hidden');
isValid = false;
}

if (!isValid) {
event.preventDefault();  // **Stops execution and prevents saving**
return;
}

// If all fields are valid, update the profile display
document.getElementById('displayName').innerText = name.value;
document.getElementById('displayEmail').innerText = email.value;
 document.getElementById('displayPhone').innerText = phone.value;
 document.getElementById('displayLocation').innerText = document.getElementById('inputLocation').value;


// Hide the edit section
  document.getElementById('profileEdit').classList.add('hidden');
});


// Image Upload
document.getElementById('imageUpload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const storageRef = firebase.storage().ref();
        const imageRef = storageRef.child('profile_images/' + file.name);

        imageRef.put(file).then(() => {
            imageRef.getDownloadURL().then((url) => {
                // Update the user's profile image URL in Firestore
                db.collection('users').doc(user.uid).update({ // Instead of firebase.firestore().collection()
                    profileImageUrl: url
                }).then(() => {
                    console.log("Profile image updated successfully!");
                    document.getElementById('profileImage').src = url; // Update profile image on the page
                }).catch((error) => {
                    console.error("Error updating profile image:", error);
                });
            });
        }).catch((error) => {
            console.error("Error uploading image:", error);
        });
    }
});

// Add this near the top of your file after imports
let currentUser = null;

// Update the DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', function() {
    console.log("🔄 Initializing profile functionality...");
    
    // Initialize all edit buttons and listeners
    initializeEditButtons();
    addSaveAboutListener();
    addSaveSkillsListener();

    // Auth state listener
    onAuthStateChanged(auth, (user) => {
        if (user) {
            currentUser = user;
            loadUserData(user);
            initializeProfileSections(user.uid);
            loadUserCertifications();
        } else {
            window.location.href = "../login.html";
        }
    });
});

// Add this function at the top level, after your imports
function initializeEditButtons() {
   // About Section - Open Edit Mode
document.getElementById('editAbout').addEventListener('click', function () {
    const aboutTextElement = document.getElementById('aboutText');
    const aboutInputElement = document.getElementById('aboutInput');
    const defaultText = "You can write about your years of experience,industry,or skills.People also talk about their achievements or previous job experiences.";

    const currentText = aboutTextElement.innerText.trim();
    aboutInputElement.value = (currentText !== defaultText) ? currentText : '';

    document.getElementById('aboutEdit').classList.remove('hidden');
});

    // Save About Button
    const saveAboutButton = document.getElementById('saveAbout');
    if (saveAboutButton) {
        saveAboutButton.addEventListener('click', async () => {
            try {
                const userId = auth.currentUser?.uid;
                if (!userId) throw new Error('No user logged in');

                const aboutInput = document.getElementById('aboutInput');
                const aboutText = aboutInput?.value.trim();
                
                // Update Firestore
                const userRef = doc(db, 'users', userId);
                await updateDoc(userRef, {
                    aboutMe: aboutText,
                    updatedAt: serverTimestamp()
                });

                // Update UI
                const aboutTextElement = document.getElementById('aboutText');
                if (aboutTextElement) aboutTextElement.innerText = aboutText;
                const aboutEditSection = document.getElementById('aboutEdit');
                aboutEditSection.classList.add('hidden');
                
                console.log('✅ About section updated');
            } catch (error) {
                console.error('❌ Error updating about:', error);
                alert(error.message);
            }
        });
    }

    // Skills Section
    const editSkillsButton = document.getElementById('editSkills');
    const skillsEditSection = document.getElementById('skillsEdit');
    const skillsContainer = document.getElementById('skillsContainer');
    const skillsInput = document.getElementById('skillsInput');
    
    if (editSkillsButton && skillsEditSection) {
        editSkillsButton.addEventListener('click', () => {
            skillsEditSection.classList.toggle('hidden');
            if (skillsInput && skillsContainer) {
                const currentSkills = Array.from(skillsContainer.children)
                    .map(skill => skill.textContent.trim())
                    .join(', ');
                skillsInput.value = currentSkills;
                skillsInput.focus();
            }
        });
    }

    // Save Skills Button
    const saveSkillsButton = document.getElementById('saveSkills');
    if (saveSkillsButton) {
        saveSkillsButton.addEventListener('click', async () => {
            try {
                const userId = auth.currentUser?.uid;
                if (!userId) throw new Error('No user logged in');

                const skillsInput = document.getElementById('skillsInput');
                const skills = skillsInput.value
                    .split(',')
                    .map(skill => skill.trim())
                    .filter(Boolean);

                // Update Firestore
                const userRef = doc(db, 'users', userId);
                await updateDoc(userRef, {
                    skills: skills,
                    updatedAt: serverTimestamp()
                });

                // Update UI
                const skillsContainer = document.getElementById('skillsContainer');
                if (skillsContainer) {
                    skillsContainer.innerHTML = '';
                    skills.forEach(skill => {
                        const skillSpan = document.createElement('span');
                        skillSpan.classList.add('bg-blue-200', 'px-3', 'py-1', 'rounded', 'mr-2', 'mb-2', 'inline-block');
                        skillSpan.textContent = skill;
                        skillsContainer.appendChild(skillSpan);
                    });
                }
                
                skillsEditSection.classList.add('hidden');
                console.log('✅ Skills updated');
            } catch (error) {
                console.error('❌ Error updating skills:', error);
                alert(error.message);
            }
        });
    }
}

// Update your DOMContentLoaded event listener
document.addEventListener("DOMContentLoaded", function() {
    console.log("🔄 Initializing profile functionality...");
    
    // Initialize all buttons and functionality
    initializeButtons();
    initializeEditButtons(); // Add this line
    
    // Auth state listener
    onAuthStateChanged(auth, (user) => {
        if (user) {
            loadUserData(user);
            initializeProfileSections(user.uid);
        } else {
            window.location.href = "../login.html";
        }
    });
});

async function initializeProfileSections(userId) {
    try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.data() || {};

        // Initialize About Me section
        const aboutText = document.getElementById('aboutText');
        const aboutInput = document.getElementById('aboutInput');
        if (aboutText && aboutInput) {
            const defaultAboutText = "Write something about yourself...";
            aboutText.innerText = userData.aboutMe || defaultAboutText;
            aboutInput.value = userData.aboutMe || defaultAboutText;
        }

        // Initialize Skills section
        const skillsContainer = document.getElementById('skillsContainer');
        if (skillsContainer && userData.skills?.length) {
            skillsContainer.innerHTML = '';
            userData.skills.forEach(skill => {
                const skillSpan = document.createElement('span');
                skillSpan.classList.add('bg-blue-200', 'px-3', 'py-1', 'rounded', 'mr-2', 'mb-2', 'inline-block');
                skillSpan.textContent = skill;
                skillsContainer.appendChild(skillSpan);
            });
        }

        console.log('✅ Profile sections initialized');
    } catch (error) {
        console.error('❌ Error initializing profile sections:', error);
    }
}

// Update your auth state listener to include this function
document.addEventListener('DOMContentLoaded', function() {
    console.log("🔄 Initializing profile functionality...");
    
    initializeEditButtons();
    addSaveAboutListener();
    addSaveSkillsListener();

    onAuthStateChanged(auth, (user) => {
        if (user) {
            currentUser = user;
            loadUserData(user);
            initializeProfileSections(user.uid); // Add this line
            loadUserCertifications();
        } else {
            window.location.href = "../login.html";
        }
    });
});


// Experience Section
document.addEventListener("DOMContentLoaded", function () {
    // Wait for auth state to be ready
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            console.error('❌ No user logged in');
            return;
        }

        const userId = user.uid;
        const experienceContainer = document.getElementById("experienceContainer");

        // Fetch experiences from Firestore
        const experiencesRef = collection(db, 'users', userId, 'experiences');
        getDocs(experiencesRef)
            .then(snapshot => {
                snapshot.forEach(doc => {
                    const experience = {
                        id: doc.id,
                        ...doc.data()
                    };
                    addExperience(experience);
                });
                console.log('✅ Experiences loaded successfully');
            })
            .catch(error => {
                console.error("❌ Error fetching experiences:", error);
            });
    });
});
        
const modal = document.getElementById("experienceModal");
const addExperienceBtn = document.getElementById("addExperience");
const closeModalBtn = document.getElementById("closeModal");
const submitExperienceBtn = document.getElementById("submitExperience");
const experienceContainer = document.getElementById("experienceContainer");
const companyInput = document.getElementById("companyName");
const companySuggestions = document.getElementById("companySuggestions");
const companyLogo = document.getElementById("companyLogo");
const employmentDropdownBtn = document.getElementById("employmentDropdownBtn");
const employmentDropdown = document.getElementById("employmentDropdown");
const experienceSkillsInput = document.getElementById("experienceSkillsInput");
const body = document.body; // For background blur


addExperienceBtn.addEventListener("click", () => modal.classList.remove("hidden"));
closeModalBtn.addEventListener("click", () => modal.classList.add("hidden"));
modal.addEventListener("click", (event) => { if (event.target === modal) modal.classList.add("hidden"); });

employmentDropdownBtn.addEventListener("click", () => employmentDropdown.classList.toggle("hidden"));
employmentDropdown.querySelectorAll("div").forEach(item => {
item.addEventListener("click", function () {
    employmentDropdownBtn.textContent = this.textContent;
    employmentDropdown.classList.add("hidden");
});
});


addExperienceBtn.addEventListener("click", () => {
modal.classList.remove("hidden"); 
modal.classList.add("modal-animation"); 

setTimeout(() => {
modal.classList.add("show-modal"); // Apply the smooth appearance effect
}, 10); // Slight delay to trigger animation properly
});

closeModalBtn.addEventListener("click", () => {
modal.classList.remove("show-modal"); // Remove visible animation
setTimeout(() => {
modal.classList.add("hidden"); // Hide after animation completes
}, 300); // Wait for the animation to finish before hiding
});


// Fetch company suggestions (without downloading images)
companyInput.addEventListener("input", async function () {
const query = this.value.trim();
if (!query) return companySuggestions.classList.add("hidden");

const url = `https://autocomplete.clearbit.com/v1/companies/suggest?query=${query}`;
const response = await fetch(url);
const companies = await response.json();

companySuggestions.innerHTML = "";
if (companies.length > 0) {
    companies.forEach(company => {
        const suggestionItem = document.createElement("div");
        suggestionItem.classList.add("p-2", "hover:bg-gray-100", "cursor-pointer", "flex", "items-center");

        const logo = document.createElement("img");
        logo.src = company.logo;
        logo.alt = company.name;
        logo.classList.add("w-8", "h-8", "mr-2");

        const name = document.createElement("span");
        name.textContent = company.name;

        suggestionItem.appendChild(logo);
        suggestionItem.appendChild(name);

        suggestionItem.addEventListener("click", function () {
companyInput.value = company.name;
companyLogo.src = company.logo || "https://via.placeholder.com/50?text=No+Logo"; // Fallback
companyLogo.classList.remove("hidden"); 
companySuggestions.classList.add("hidden");
});


        companySuggestions.appendChild(suggestionItem);
    });
    companySuggestions.classList.remove("hidden");
} else {
    companySuggestions.classList.add("hidden");
}
});

// Hide company suggestions when clicking outside
document.addEventListener("click", (event) => {
if (!companyInput.contains(event.target) && !companySuggestions.contains(event.target)) {
    companySuggestions.classList.add("hidden");
}
});



// Save Experience
document.addEventListener("DOMContentLoaded", function () {
    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            console.error('❌ No user logged in');
            return;
        }

        try {
            const userId = user.uid;
            const experiencesRef = collection(db, 'users', userId, 'experiences');
            const snapshot = await getDocs(experiencesRef);
            
            // Clear existing experiences
            experienceContainer.innerHTML = '';
            
            snapshot.forEach(doc => {
                const experience = {
                    id: doc.id,
                    ...doc.data()
                };
                addExperienceToUI(experience); // Use the unified display function
            });
            
            console.log('✅ Experiences loaded successfully');
        } catch (error) {
            console.error("❌ Error fetching experiences:", error);
        }
    });
});


submitExperienceBtn.addEventListener("click", async function () {
    try {
        const jobTitle = document.getElementById("jobTitle").value.trim();
        const employmentType = employmentDropdownBtn.textContent.trim() !== "Select Employment Type" 
            ? employmentDropdownBtn.textContent.trim() 
            : "";
        const companyName = companyInput.value.trim();
        const startDate = document.getElementById("startDate").value;
        const endDate = document.getElementById("endDate").value;
        const companyLogoSrc = companyLogo.src;

        // Validate all fields
        if (!jobTitle || !employmentType || !companyName || !startDate || !endDate) {
            throw new Error("Please fill out all fields!");
        }

        const userId = auth.currentUser?.uid;
        if (!userId) throw new Error('No user logged in');

        const newExperience = {
            jobTitle,
            employmentType,
            companyName,
            startDate,
            endDate,
            companyLogo: companyLogoSrc,
            duration: calculateDuration(startDate, endDate),
            createdAt: serverTimestamp()
        };

        // Save to Firestore using v9 syntax
        const experiencesRef = collection(db, 'users', userId, 'experiences');
        const docRef = await addDoc(experiencesRef, newExperience);

        // Add ID to experience data
        newExperience.id = docRef.id;
        
        // Add to UI
        addExperienceToUI(newExperience);
        
        // Reset form and close modal
        resetForm();
        modal.classList.add('hidden');
        
        console.log('✅ Experience saved successfully!');
    } catch (error) {
        console.error('❌ Error saving experience:', error);
        alert(error.message);
    }
});

// Add this new function for adding experience to UI
function addExperienceToUI(experience) {
    const experienceItem = document.createElement("div");
    experienceItem.classList.add("mb-3", "p-4", "border", "rounded", "bg-gray-100", "flex", "items-center", "justify-between");
    experienceItem.setAttribute("data-id", experience.id);

    const formattedStartDate = formatDate(experience.startDate);
    const formattedEndDate = formatDate(experience.endDate);

    experienceItem.innerHTML = `
        <img src="${experience.companyLogo || 'https://via.placeholder.com/50?text=No+Logo'}" 
             alt="${experience.companyName}" 
             class="w-12 h-12 mr-4 rounded-full border">
        <div class="flex-grow">
            <strong class="block text-lg">${experience.jobTitle}</strong>
            <div class="text-md font-semibold">${experience.companyName} • ${experience.employmentType}</div>
            <div class="text-sm text-gray-700 mt-1">
                <strong>${formattedStartDate} - ${formattedEndDate}</strong> • ${experience.duration}
            </div>
        </div>
        <span class="cursor-pointer ml-4 text-red-500 hover:scale-110 transition">🗑️</span>
    `;

    // Add delete handler
    experienceItem.querySelector('span').addEventListener('click', async () => {
        if (confirm('Are you sure you want to delete this experience?')) {
            try {
                const userId = auth.currentUser?.uid;
                if (!userId) throw new Error('No user logged in');

                await deleteDoc(doc(db, 'users', userId, 'experiences', experience.id));
                experienceItem.remove();
                console.log('✅ Experience deleted successfully');
            } catch (error) {
                console.error('❌ Error deleting experience:', error);
                alert('Failed to delete experience');
            }
        }
    });

    experienceContainer.appendChild(experienceItem);
}


// Function to format dates (e.g., "1st Jan 2024")
function formatDate(dateString) {
const date = new Date(dateString);
if (isNaN(date)) return ""; // Handle invalid dates

const day = date.getDate();
const suffix = getDaySuffix(day);
const month = date.toLocaleString('en-US', { month: 'short' }); // Short month (Jan, Feb, etc.)
const year = date.getFullYear();

return `${day}${suffix} ${month} ${year}`;
}

// Function to get the correct suffix for a date (e.g., "1st", "2nd", "3rd")
function getDaySuffix(day) {
if (day >= 11 && day <= 13) return "th"; // Special case for 11-13
switch (day % 10) {
case 1: return "st";
case 2: return "nd";
case 3: return "rd";
default: return "th";
}
}

// Function to calculate the duration (e.g., "2 yrs 3 mos")
function calculateDuration(startDate, endDate) {
const start = new Date(startDate);
const end = new Date(endDate);
if (isNaN(start) || isNaN(end)) return ""; // Handle invalid dates

let years = end.getFullYear() - start.getFullYear();
let months = end.getMonth() - start.getMonth();

if (months < 0) {
years -= 1;
months += 12;
}

let durationText = [];
if (years > 0) durationText.push(`${years} yr${years > 1 ? "s" : ""}`);
if (months > 0) durationText.push(`${months} mo${months > 1 ? "s" : ""}`);

return durationText.join(" "); // Join with a space (e.g., "1 yr 5 mos")
}



// Function to get company logo from Clearbit API (alternative: Google search)
function getCompanyLogo(companyName) {
return `https://logo.clearbit.com/${companyName.toLowerCase().replace(/\s+/g, '')}.com`;
}

function addExperience(jobTitle, employmentType, companyName, startDate, endDate, companyLogoSrc) {
    const experienceItem = document.createElement("div");
    experienceItem.classList.add("mb-3", "p-4", "border", "rounded", "bg-gray-100", "flex", "items-center", "justify-between");

    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);
    const duration = calculateDuration(startDate, endDate);

    // Create company logo element
    const logoImg = document.createElement("img");
    logoImg.src = companyLogoSrc || "https://via.placeholder.com/50?text=No+Logo";
    logoImg.alt = companyName;
    logoImg.classList.add("w-12", "h-12", "mr-4", "rounded-full", "border");

    const experienceDetails = document.createElement("div");
    experienceDetails.classList.add("flex-grow");
    experienceDetails.innerHTML = `
        <strong class="block text-lg">${jobTitle}</strong>
        <div class="text-md font-semibold">${companyName} • ${employmentType}</div>
        <div class="text-sm text-gray-700 mt-1">
            <strong>${formattedStartDate} - ${formattedEndDate}</strong> • ${duration}
        </div>
    `;

    // Create Delete Icon
    const deleteIcon = document.createElement("span");
    deleteIcon.innerHTML = "🗑️"; // Trash bin emoji
    deleteIcon.classList.add("cursor-pointer", "ml-4", "text-red-500", "transition", "duration-300");

    // Add event listener for deleting experience from Firestore and page
    deleteIcon.addEventListener("click", function () {
        const experienceId = experienceItem.getAttribute("data-id"); // Get the Firestore document ID

        const userId = auth.currentUser.uid; // Get current user ID
        db.collection('users').doc(userId).collection('experiences').doc(experienceId).delete() // Instead of firebase.firestore().collection()
            .then(() => {
                console.log("Experience deleted successfully!");
                experienceItem.remove(); // Remove experience from the UI
            })
            .catch(error => {
                console.error("Error deleting experience:", error);
            });
    });

    experienceItem.appendChild(logoImg);
    experienceItem.appendChild(experienceDetails);
    experienceItem.appendChild(deleteIcon);

    experienceContainer.appendChild(experienceItem);
}


// Function to reset form fields
function resetForm() {
document.getElementById("jobTitle").value = ""; // Clear job title
companyInput.value = ""; // Clear company name input
document.getElementById("companyLogo").src = ""; // Remove logo image
document.getElementById("companyLogo").classList.add("hidden"); // Hide logo
document.getElementById("startDate").value = ""; // Clear start date
document.getElementById("endDate").value = ""; // Clear end date
companySuggestions.innerHTML = ""; // Clear company suggestions

// Reset employment type dropdown
employmentDropdownBtn.textContent = "Select Employment Type"; // Set it back to default
}


// Declare at top level
let addCertificationBtn;

// Then update your initialization code

// Replace all certification-related DOMContentLoaded event listeners with this one
document.addEventListener("DOMContentLoaded", function() {
    console.log("🔄 Initializing certification functionality...");
    
    // Get DOM elements
    const certificationModal = document.getElementById("certification-modal");
    const certificationModalBox = document.getElementById("certificationModalBox");
    addCertificationBtn = document.getElementById("addCertification");
    
    if (!addCertificationBtn) {
        console.error("❌ Add Certification button not found!");
        return;
    }

    // Add click handler
    addCertificationBtn.addEventListener("click", () => {
        if (certificationModal) {
            certificationModal.classList.remove("hidden");
            setTimeout(() => {
                if (certificationModalBox) {
                    certificationModalBox.classList.add("scale-100", "opacity-100");
                }
            }, 10);
        }
    });

    // Initialize media handlers
    initializeMediaHandlers();

    // Load certifications if user is logged in
    onAuthStateChanged(auth, (user) => {
        if (user) {
            loadUserCertifications();
        }
    });

    // Initialize close button
    const closeCertificationModalBtn = document.getElementById("closeCertificationModal");
    if (closeCertificationModalBtn) {
        closeCertificationModalBtn.addEventListener("click", () => {
            certificationModal.classList.add("hidden");
            certificationModalBox.classList.remove("scale-100", "opacity-100");
            resetCertificationModal();
        });
    }

    // Initialize submit button
    const submitCertificationBtn = document.getElementById("submitCertification");
    if (submitCertificationBtn) {
        submitCertificationBtn.addEventListener("click", async () => {
            try {
                const certificationData = {
                    certificationName: document.getElementById("certificationName").value.trim(),
                    organizationName: document.getElementById("organizationName").value.trim(),
                    issueDate: document.getElementById("issueDate").value,
                    expirationDate: document.getElementById("noExpiry").checked ? 
                        "Present" : document.getElementById("expirationDate").value,
                    organizationLogo: document.getElementById("organizationLogo").src || null
                };

                const userId = auth.currentUser?.uid;
                if (!userId) throw new Error('No user logged in');

                const certificationsRef = collection(db, 'users', userId, 'certifications');
                const docRef = await addDoc(certificationsRef, {
                    ...certificationData,
                    createdAt: serverTimestamp()
                });

                addCertificationToUI({
                    id: docRef.id,
                    ...certificationData
                });

                certificationModal.classList.add("hidden");
                resetCertificationModal();
                console.log('✅ Certification saved successfully');
            } catch (error) {
                console.error('❌ Error saving certification:', error);
                alert('Failed to save certification');
            }
        });
    }
});

// Function to close certification modal
function closeCertificationModal(modal, modalBox) {
    if (modalBox) modalBox.classList.remove("scale-100", "opacity-100");
    if (modal) {
        setTimeout(() => {
            modal.classList.add("hidden");
            resetCertificationModal();
        }, 300);
    }
}

// Function to handle organization suggestions
async function handleOrganizationSuggestions(query, suggestionsElement, logoElement) {
    if (!query) {
        suggestionsElement.classList.add("hidden");
        return;
    }

    try {
        // Option 1: Use fetch with no-cors mode (limited functionality)
        const response = await fetch(`https://autocomplete.clearbit.com/v1/companies/suggest?query=${query}`, {
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Option 2: Use a proxy service
        /* 
        const response = await fetch(`/api/company-search?query=${query}`);
        */

        // Option 3: Use local fallback if CORS fails
        if (!response.ok) {
            console.warn("❌ CORS issue detected, using local fallback");
            suggestionsElement.innerHTML = `
                <div class="p-2 text-gray-500">
                    Enter company name manually
                </div>
            `;
            suggestionsElement.classList.remove("hidden");
            return;
        }

        const companies = await response.json();
        updateOrganizationSuggestions(companies, suggestionsElement, logoElement);
    } catch (error) {
        console.error("❌ Error fetching organization suggestions:", error);
        // Show fallback UI
        suggestionsElement.innerHTML = `
            <div class="p-2 text-gray-500">
                Unable to fetch suggestions. Please enter company name manually.
            </div>
        `;
        suggestionsElement.classList.remove("hidden");
    }
}

// Function to update organization suggestions in UI
function updateOrganizationSuggestions(companies, suggestionsElement, logoElement) {
    suggestionsElement.innerHTML = "";
    
    if (companies.length > 0) {
        companies.forEach(company => {
            const suggestionItem = createSuggestionItem(company, logoElement, suggestionsElement);
            suggestionsElement.appendChild(suggestionItem);
        });
        suggestionsElement.classList.remove("hidden");
    } else {
        suggestionsElement.classList.add("hidden");
    }
}

// Function to reset certification modal
function resetCertificationModal() {
    const elements = {
        certificationName: "",
        organizationName: "",
        issueDate: "",
        expirationDate: "",
        mediaInput: "",
        noExpiry: false
    };

    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            if (typeof value === "boolean") {
                element.checked = value;
            } else {
                element.value = value;
            }
        }
    });

    // Reset additional elements
    const organizationLogo = document.getElementById("organizationLogo");
    if (organizationLogo) {
        organizationLogo.src = "";
        organizationLogo.classList.add("hidden");
    }

    const mediaPreviewContainer = document.getElementById("mediaPreviewContainer");
    if (mediaPreviewContainer) {
        mediaPreviewContainer.innerHTML = "";
    }
}

// Add this function after your imports but before the event listeners
async function saveCertificationToFirebase(certificationData) {
    try {
        const userId = auth.currentUser?.uid;
        if (!userId) throw new Error('No user logged in');

        const certificationsRef = collection(db, 'users', userId, 'certifications');
        const docRef = await addDoc(certificationsRef, {
            ...certificationData,
            createdAt: serverTimestamp()
        });

        console.log('✅ Certification saved to Firebase');
        return docRef.id;
    } catch (error) {
        console.error('❌ Error saving to Firebase:', error);
        throw error;
    }
}

// Then update your submit button event listener
submitCertificationBtn.addEventListener("click", async function () {
    try {
        const certificationData = {
            certificationName: document.getElementById("certificationName").value.trim(),
            organizationName: organizationInput.value.trim(),
            issueDate: formatMonthYear(document.getElementById("issueDate").value),
            expirationDate: document.getElementById("noExpiry").checked ? 
                "Present" : formatMonthYear(document.getElementById("expirationDate").value),
            organizationLogo: organizationLogo.src || "https://via.placeholder.com/50?text=No+Logo"
        };

        // Validate
        if (!certificationData.certificationName || !certificationData.organizationName || !certificationData.issueDate) {
            throw new Error("Please fill out all required fields!");
        }

        // Save to Firebase
        const certId = await saveCertificationToFirebase(certificationData);
        
        // Add to UI with the document ID
        addCertificationToUI({ 
            id: certId, 
            ...certificationData 
        });

        // Close modal and reset
        certificationModal.classList.add("hidden");
        resetCertificationModal();
        console.log('✅ Certification saved successfully');
    } catch (error) {
        console.error('❌ Error saving certification:', error);
        alert(error.message);
    }
});

//Certification and License

const closeCertificationModalBtn = document.getElementById("closeCertificationModal");
const submitCertificationBtn = document.getElementById("submitCertification");
const certificationContainer = document.getElementById("certificationContainer");
const organizationInput = document.getElementById("organizationName");
const organizationSuggestions = document.getElementById("organizationSuggestions");
const organizationLogo = document.getElementById("organizationLogo");

// 🔴 Close modal
closeCertificationModalBtn.addEventListener("click", closeCertificationModal);

// 🟡 Fetch organization suggestions (auto-complete)
organizationInput.addEventListener("input", async function () {
const query = this.value.trim();
if (!query) return organizationSuggestions.classList.add("hidden");

try {
    const url = `https://autocomplete.clearbit.com/v1/companies/suggest?query=${query}`;
    const response = await fetch(url);
    const companies = await response.json();

    organizationSuggestions.innerHTML = "";
    if (companies.length > 0) {
        companies.forEach(company => {
            const suggestionItem = document.createElement("div");
            suggestionItem.classList.add("p-2", "hover:bg-gray-100", "cursor-pointer", "flex", "items-center");

            const logo = document.createElement("img");
            logo.src = company.logo;
            logo.alt = company.name;
            logo.classList.add("w-8", "h-8", "mr-2");

            const name = document.createElement("span");
            name.textContent = company.name;

            suggestionItem.appendChild(logo);
            suggestionItem.appendChild(name);

            suggestionItem.addEventListener("click", function () {
                organizationInput.value = company.name;
                organizationLogo.src = company.logo || "https://via.placeholder.com/50?text=No+Logo";
                organizationLogo.classList.remove("hidden");
                organizationSuggestions.classList.add("hidden");
            });

            organizationSuggestions.appendChild(suggestionItem);
        });
        organizationSuggestions.classList.remove("hidden");
    } else {
        organizationSuggestions.classList.add("hidden");
    }
} catch (error) {
    console.error("Error fetching organization data:", error);
}
});

// 🟢 Save Certification with formatted dates
submitCertificationBtn.addEventListener("click", async function () {
    const certificationData = {
        certificationName: document.getElementById("certificationName").value.trim(),
        organizationName: organizationInput.value.trim(),
        issueDate: formatMonthYear(document.getElementById("issueDate").value),
        expirationDate: document.getElementById("noExpiry").checked ? 
            "Present" : formatMonthYear(document.getElementById("expirationDate").value),
        organizationLogo: organizationLogo.src || "https://via.placeholder.com/50?text=No+Logo"
    };

    if (!certificationData.certificationName || !certificationData.organizationName || !certificationData.issueDate) {
        alert("Please fill out all required fields!");
        return;
    }

    try {
        const certId = await saveCertificationToFirebase(certificationData);
        if (certId) {
            addCertificationToUI({ id: certId, ...certificationData });
            closeCertificationModal();
            resetCertificationModal();
        }
    } catch (error) {
        console.error("❌ Error saving certification:", error);
        alert("Failed to save certification. Please try again.");
    }
});

// Replace the existing loadUserCertifications function (around line 1011)
// Replace the existing loadUserCertifications function
async function loadUserCertifications() {
    try {
        const userId = auth.currentUser?.uid;
        if (!userId) {
            console.error('❌ No user logged in');
            return;
        }

        const container = document.getElementById('certificationContainer');
        if (!container) {
            console.error('❌ Certification container not found');
            return;
        }
        container.innerHTML = '';

        const certificationsRef = collection(db, 'users', userId, 'certifications');
        const querySnapshot = await getDocs(certificationsRef);
        
        querySnapshot.forEach((doc) => {
            const certification = {
                id: doc.id,
                ...doc.data()
            };
            addCertificationToUI(certification);
        });

        console.log('✅ Certifications loaded successfully');
    } catch (error) {
        console.error("❌ Error loading certifications:", error);
    }
}

// Load saved data on refresh
document.addEventListener("DOMContentLoaded", function () {
const certifications = JSON.parse(localStorage.getItem("certifications")) || [];
certifications.forEach(cert => addCertificationToUI(cert.certificationName, cert.organizationName, cert.issueDate, cert.expirationDate, cert.organizationLogoSrc));
});


// ✅ Function to format "YYYY-MM" into "MMM YYYY"
function formatMonthYear(dateString) {
if (!dateString) return "";
const [year, month] = dateString.split("-");
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
return `${months[parseInt(month, 10) - 1]} ${year}`;
}

// Replace the existing addCertificationToUI function
function addCertificationToUI(certification) {
    if (!certification?.id) {
        console.error('❌ Invalid certification data:', certification);
        return;
    }

    const certificationSection = document.getElementById("certificationContainer");
    if (!certificationSection) {
        console.error('❌ Certification container not found');
        return;
    }

    const certificationItem = document.createElement("div");
    certificationItem.classList.add(
        "p-3", "border", "rounded", "bg-gray-100", 
        "flex", "items-center", "justify-between", "gap-6"
    );
    certificationItem.setAttribute("data-cert-id", certification.id);

    // Create the HTML structure
    certificationItem.innerHTML = `
        <img src="${certification.organizationLogo || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyBAMAAADsEZWCAAAAG1BMVEXMzMyWlpacnJyqqqrFxcWxsbGjo6O3t7e+vr6He3KoAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAK0lEQVQ4jWNgQAOMjAwo0EBEOkpgEWVAASOqCGoJKAwYkAMiAo0CBoaRBgAKNwMd5/ofsgAAAABJRU5ErkJggg=='}" 
             alt="${certification.organizationName}" 
             class="w-14 h-14 rounded-full border">
        <div class="text-left flex-1">
            <strong class="text-lg">${certification.certificationName}</strong><br>
            <span class="text-gray-600">${certification.organizationName}</span><br>
            <span class="text-gray-500">${certification.issueDate} - ${certification.expirationDate}</span>
        </div>
        <button class="delete-cert-btn text-red-500 hover:text-red-700 transition-colors">
            <span class="text-2xl">🗑️</span>
        </button>
    `;

    // Add delete handler using proper event delegation
    const deleteBtn = certificationItem.querySelector('.delete-cert-btn');
    deleteBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!confirm('Are you sure you want to delete this certification?')) {
            return;
        }

        try {
            const userId = auth.currentUser?.uid;
            if (!userId) throw new Error('No user logged in');

            // Get certification ID from the parent element
            const certId = certificationItem.getAttribute('data-cert-id');
            if (!certId) throw new Error('Certification ID not found');

            // Delete from Firestore
            const certRef = doc(db, 'users', userId, 'certifications', certId);
            await deleteDoc(certRef);

            // Remove from UI
            certificationItem.remove();
            console.log('✅ Certification deleted successfully');
        } catch (error) {
            console.error('❌ Error deleting certification:', error);
            alert('Failed to delete certification. Please try again.');
        }
    });

    certificationSection.appendChild(certificationItem);
}

// Create Certification Item (Flexbox Row)
const certificationItem = document.createElement("div");
certificationItem.classList.add(
"p-3", "border", "rounded", "bg-gray-100", 
"flex", "items-center", "justify-between", "gap-6"  // Ensures even spacing
);

// Organization Logo (First)
const logoImg = document.createElement("img");
logoImg.src = organizationLogoSrc || "https://via.placeholder.com/50?text=No+Logo";
logoImg.classList.add("w-14", "h-14", "rounded-full", "border");

// Certification Details (Second)
const details = document.createElement("div");
details.classList.add("text-left", "flex-1");  // Ensures alignment & spacing
details.innerHTML = `
<strong>${certificationName}</strong><br>
<span class="text-gray-600">${organizationName}</span><br>
<span class="text-gray-500">${issueDate} - ${expirationDate}</span>
`;

// Media Display (Third - Right After Details)
const mediaContainer = document.createElement("div");
mediaContainer.classList.add("w-24", "h-24", "flex-shrink-0");  // Fixed size for consistency

if (mediaSrc && mediaType.startsWith("image")) {
const mediaElement = document.createElement("img");
mediaElement.src = mediaSrc;
mediaElement.alt = "Certification Image";
mediaElement.classList.add("w-full", "h-full", "object-cover", "rounded-md");
mediaContainer.appendChild(mediaElement);
} else if (mediaSrc && mediaType === "application/pdf") {
const pdfElement = document.createElement("a");
pdfElement.href = mediaSrc;
pdfElement.target = "_blank";
pdfElement.textContent = "📄 View PDF";
pdfElement.classList.add("text-blue-600", "underline");
mediaContainer.appendChild(pdfElement);
}

// Delete Button (Far Right, Alone)
const deleteIcon = document.createElement("span");
deleteIcon.innerHTML = "🗑️";
deleteIcon.classList.add("cursor-pointer", "text-red-500", "ml-auto", "transition-transform", "hover:scale-110");

// Delete Functionality
deleteIcon.addEventListener("click", function() {
    // Remove from Firestore and UI
    const userId = auth.currentUser?.uid;
    const certId = certificationItem.getAttribute("data-cert-id");
    
    if (userId && certId) {
        db.collection('users').doc(userId).collection('certifications').doc(certId).delete()
            .then(() => {
                certificationItem.remove();
                console.log("Certification deleted successfully!");
            })
            .catch((error) => {
                console.error("Error deleting certification:", error);
            });
    }
});

// Append elements in correct order
certificationSection.appendChild(certificationItem);
certificationItem.appendChild(logoImg);       // Logo
certificationItem.appendChild(details);       // Info
certificationItem.appendChild(mediaContainer); // Image/PDF
certificationItem.appendChild(deleteIcon);    // Delete Button

// Reset media section
const mediaInput = document.getElementById("mediaInput");
if (mediaInput) mediaInput.value = "";

// Reset media preview container
const mediaPreviewContainer = document.getElementById("mediaPreviewContainer");
if (mediaPreviewContainer) mediaPreviewContainer.innerHTML = "";

// Hide selected file text and show placeholder
const selectedFile = document.getElementById("selectedFile");
const mediaPlaceholder = document.getElementById("mediaPlaceholder");

if (selectedFile) selectedFile.classList.add("hidden");
if (mediaPlaceholder) mediaPlaceholder.classList.remove("hidden");

// Hide suggestions if visible
if (organizationSuggestions) organizationSuggestions.classList.add("hidden");

// Reset all form fields
resetFormFields();


function resetFormFields() {
    const fields = {
        "certificationName": "",
        "organizationName": "",
        "issueDate": "",
        "expirationDate": "",
        "noExpiry": false
    };

    Object.entries(fields).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            if (typeof value === "boolean") {
                element.checked = value;
            } else {
                element.value = value;
            }
        }
    });

    // Reset organization logo
    const organizationLogo = document.getElementById("organizationLogo");
    if (organizationLogo) {
        organizationLogo.src = "";
        organizationLogo.classList.add("hidden");
    }

    // Disable/enable expiration date based on noExpiry checkbox
    const expirationDate = document.getElementById("expirationDate");
    if (expirationDate) {
        expirationDate.disabled = false;
    }
}

// Media handling
document.addEventListener("DOMContentLoaded", function() {
    const mediaInput = document.getElementById("mediaInput");
    const mediaPlaceholder = document.getElementById("mediaPlaceholder");
    const mediaPreviewContainer = document.getElementById("mediaPreviewContainer");

    if (mediaPlaceholder && mediaInput) {
        mediaPlaceholder.addEventListener("click", () => mediaInput.click());
    }

    if (mediaInput) {
        mediaInput.addEventListener("change", handleFileSelection);
    }
});

function handleFileSelection(event) {
    const files = event.target.files;
    const mediaPreviewContainer = document.getElementById("mediaPreviewContainer");
    
    if (!files.length || !mediaPreviewContainer) return;

    mediaPreviewContainer.innerHTML = "";
    
    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = e => createPreviewElement(e.target.result, file.type, mediaPreviewContainer);
        reader.readAsDataURL(file);
    });

    // Hide placeholder if files are selected
    const mediaPlaceholder = document.getElementById("mediaPlaceholder");
    if (mediaPlaceholder && mediaPreviewContainer.children.length > 0) {
        mediaPlaceholder.style.display = "none";
    }
}

function createPreviewElement(fileUrl, fileType, container) {
    const previewElement = document.createElement("div");
    previewElement.classList.add("preview-item");

    if (fileType.startsWith("image")) {
        const img = document.createElement("img");
        img.src = fileUrl;
        img.classList.add("w-20", "h-20", "rounded-md");
        previewElement.appendChild(img);
    } else if (fileType === "application/pdf") {
        const link = document.createElement("a");
        link.href = fileUrl;
        link.textContent = "View PDF";
        link.target = "_blank";
        link.classList.add("text-blue-600", "underline");
        previewElement.appendChild(link);
    }

    container.appendChild(previewElement);
}

// Update the delete certification function
async function deleteCertification(certId) {
    try {
        const userId = auth.currentUser?.uid;
        if (!userId) {
            console.error('❌ No user logged in');
            return;
        }

        const certRef = doc(db, 'users', userId, 'certifications', certId);
        await deleteDoc(certRef);
        console.log("✅ Certification deleted successfully!");
    } catch (error) {
        console.error("❌ Error deleting certification:", error);
        throw error;
    }
}

// Initialize certifications if user is logged in
onAuthStateChanged(auth, (user) => {
    if (user) {
        loadUserCertifications();
    }
});

// In your DOMContentLoaded event listener
document.addEventListener("DOMContentLoaded", () => {
    // Initialize certifications if user is logged in
    onAuthStateChanged(auth, (user) => {
        if (user) {
            loadUserCertifications();
        }
    });

    initializeCertificationModal();
});

// Single DOMContentLoaded event listener for certifications
document.addEventListener("DOMContentLoaded", function() {
    console.log("🔄 Initializing certification functionality...");
    
    // Initialize button first
    addCertificationBtn = document.getElementById("addCertificationToUI");
    if (!addCertificationBtn) {
        console.error("❌ Add Certification button not found!");
        return;
    }

    // Get other DOM elements
    const certificationModal = document.getElementById("certificationModal");
    const certificationModalBox = document.getElementById("certificationModalBox");
    const closeCertificationModalBtn = document.getElementById("closeCertificationModal");
    const submitCertificationBtn = document.getElementById("submitCertification");

    // Add click handler to button
    addCertificationBtn.addEventListener("click", () => {
        if (certificationModal) {
            certificationModal.classList.remove("hidden");
            setTimeout(() => {
                if (certificationModalBox) {
                    certificationModalBox.classList.add("scale-100", "opacity-100");
                }
            }, 10);
        }
    });

    // Initialize auth state listener
    onAuthStateChanged(auth, (user) => {
        if (user) {
            loadUserCertifications();
        }
    });

    // Initialize other functionality
    initializeMediaHandlers();
    initializeModalHandlers();
});

// Separate function for media initialization
function initializeMediaHandlers() {
    const mediaInput = document.getElementById("mediaInput");
    const mediaPlaceholder = document.getElementById("mediaPlaceholder");
    
    if (mediaPlaceholder && mediaInput) {
        mediaPlaceholder.addEventListener("click", () => mediaInput.click());
    }

    if (mediaInput) {
        mediaInput.addEventListener("change", handleFileSelection);
    }
}

// Separate function for modal handlers
function initializeModalHandlers() {
    const closeCertificationModalBtn = document.getElementById("closeCertificationModal");
    if (closeCertificationModalBtn) {
        closeCertificationModalBtn.addEventListener("click", () => {
            const modal = document.getElementById("certificationModal");
            const modalBox = document.getElementById("certificationModalBox");
            closeCertificationModal(modal, modalBox);
        });
    }
}

document.addEventListener("DOMContentLoaded", function() {
    console.log("🔄 Initializing certification functionality...");
    
    // Initialize button first
    addCertificationBtn = document.getElementById("addCertificationToUI");
    if (!addCertificationBtn) {
        console.error("❌ Add Certification button not found!");
        return;
    }

    // Initialize certification modal
    const certificationModal = document.getElementById("certificationModal");
    const certificationModalBox = document.getElementById("certificationModalBox");

    // Add click handler to button
    addCertificationBtn.addEventListener("click", () => {
        if (certificationModal) {
            certificationModal.classList.remove("hidden");
            setTimeout(() => {
                if (certificationModalBox) {
                    certificationModalBox.classList.add("scale-100", "opacity-100");
                }
            }, 10);
        }
    });

    // Initialize other functionality
    initializeMediaHandlers();
    initializeModalHandlers();

    // Initialize auth state listener
    onAuthStateChanged(auth, (user) => {
        if (user) {
            loadUserCertifications();
        }
    });
});

// Add the missing function definition
function initializeCertificationModal() {
    const certificationModal = document.getElementById("certification-modal");
    const certificationModalBox = document.getElementById("certificationModalBox");
    const addCertificationBtn = document.getElementById("addCertificationToUI");
    
    if (!addCertificationBtn) {
        console.error("❌ Add Certification button not found!");
        return;
    }

    addCertificationBtn.addEventListener("click", () => {
        if (certificationModal) {
            certificationModal.classList.remove("hidden");
            setTimeout(() => {
                if (certificationModalBox) {
                    certificationModalBox.classList.add("scale-100", "opacity-100");
                }
            }, 10);
        }
    });
}

// Single DOMContentLoaded event listener
document.addEventListener("DOMContentLoaded", function() {
    // Initialize certification modal first
    initializeCertificationModal();

    // Initialize other functionality
    initializeMediaHandlers();
    initializeModalHandlers();

    // Initialize auth state listener
    onAuthStateChanged(auth, (user) => {
        if (user) {
            loadUserCertifications();
        }
    });
});

// In your backend server (e.g., Express)
app.get('/api/company-search', async (req, res) => {
    const query = req.query.query;
    try {
        const response = await fetch(`https://autocomplete.clearbit.com/v1/companies/suggest?query=${query}`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});