// File: js/user-profile.js
import { auth, db } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let currentUserUID = null;

// 1. Listen for Login
onAuthStateChanged(auth, async (user) => {
    if (user) {
        currentUserUID = user.uid;
        loadUserProfile(user.uid);
    } else {
        // Not logged in? Send to login page
        window.location.href = "index.html";
    }
});

// 2. Load User Data from Firestore
async function loadUserProfile(uid) {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        
        // Fill Text
        document.getElementById('profileName').innerText = data.fullName || "User";
        document.getElementById('profileEmail').innerText = data.email || data.userId;

        // Fill Image (If exists in DB, use it. Else default)
        if (data.profilePicBase64) {
            document.getElementById('profileImgDisplay').src = data.profilePicBase64;
        }
    }
}

// 3. Handle Image Upload (Convert to Base64 & Save)
const imgInput = document.getElementById('imgInput');
imgInput.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        // Limit size (optional, good practice for Firestore storage)
        if(file.size > 1048576) { // 1MB limit
            alert("Image is too large! Please choose an image under 1MB.");
            return;
        }

        const reader = new FileReader();
        reader.onload = async function(e) {
            const base64String = e.target.result;
            
            // A. Update UI immediately
            document.getElementById('profileImgDisplay').src = base64String;

            // B. Save to Firebase Firestore
            if(currentUserUID) {
                try {
                    const userRef = doc(db, "users", currentUserUID);
                    await updateDoc(userRef, {
                        profilePicBase64: base64String
                    });
                    alert("Profile Image Saved!");
                } catch (err) {
                    console.error("Error saving image:", err);
                    alert("Failed to save image.");
                }
            }
        };
        reader.readAsDataURL(file);
    }
});

// 4. Global Window Functions (for HTML onclicks)
window.openProfile = () => {
    document.getElementById('profileModal').style.display = 'flex';
};

window.closeProfile = () => {
    document.getElementById('profileModal').style.display = 'none';
};

window.logoutUser = () => {
    signOut(auth).then(() => {
        // Use 'replace' to prevent going back
        window.location.replace("index.html");
    });
};