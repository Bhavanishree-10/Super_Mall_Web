// File: js/auth.js
import { auth, db } from './firebase-config.js';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// --- DOM ELEMENTS ---
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const btnLogin = document.getElementById('btnLogin');
const btnRegister = document.getElementById('btnRegister');

// --- TOGGLE BUTTONS (Login <-> Register) ---
document.getElementById('goRegister').addEventListener('click', () => {
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
});

document.getElementById('goLogin').addEventListener('click', () => {
    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
});

// --- HELPER FUNCTION: Handle User ID vs Email ---
function formatEmail(input) {
    // If user types a full email (like shreeadmin@gmail.com), keep it.
    if (input.includes('@')) {
        return input;
    }
    // If user types just a name (like john123), add the fake domain
    return `${input}@supermall.com`;
}

// --- REGISTER LOGIC ---
btnRegister.addEventListener('click', async () => {
    const fullName = document.getElementById('regName').value;
    const userIdInput = document.getElementById('regId').value.trim();
    const password = document.getElementById('regPass').value;
    const confirmPass = document.getElementById('confirmPass').value;

    if (password !== confirmPass) {
        alert("Passwords do not match!");
        return;
    }

    const email = formatEmail(userIdInput);

    try {
        btnRegister.innerText = "Creating Account...";
        
        // 1. Create Account in Firebase
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 2. Save User Details to Database
        await setDoc(doc(db, "users", user.uid), {
            fullName: fullName,
            userId: userIdInput,
            email: email,
            role: "customer", // Default role
            joinedAt: new Date()
        });

        alert("Account Created Successfully!");
        
        // Redirect new registered users to the Mall (even admin, for the first time)
        window.location.href = "mall.html"; 

    } catch (error) {
        console.error("Error:", error);
        if (error.code === "auth/email-already-in-use") {
            alert("This User ID/Email is already taken.");
        } else {
            alert("Error: " + error.message);
        }
        btnRegister.innerText = "Register Now";
    }
});

// --- LOGIN LOGIC (UPDATED WITH ADMIN CHECK) ---
btnLogin.addEventListener('click', async () => {
    const userIdInput = document.getElementById('loginId').value.trim();
    const password = document.getElementById('loginPass').value;

    const email = formatEmail(userIdInput);

    try {
        btnLogin.innerText = "Checking...";
        
        // 1. Sign in
        await signInWithEmailAndPassword(auth, email, password);
        
        // 2. ADMIN CHECK
        // If the email is EXACTLY your admin email
        if (email.toLowerCase() === "shreeadmin@gmail.com") {
            
            alert("Welcome Admin Shree!");
            window.location.href = "admin.html"; // Go to Admin Panel
            
        } else {
            
            // For everyone else
            window.location.href = "mall.html"; // Go to Mall
        }

    } catch (error) {
        console.error("Error:", error);
        alert("Invalid ID or Password");
        btnLogin.innerText = "Login";
    }
});


    // Push a new state so the "Back" button has nowhere to go but here
    history.pushState(null, null, location.href);
    window.onpopstate = function () {
        history.go(1);
    };
