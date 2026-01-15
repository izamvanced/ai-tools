import { initializeApp } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDIts39eYziTvJUVAvun91dIZRNjRO8Qes",
  authDomain: "ai-tools-library-ac10c.firebaseapp.com",
  projectId: "ai-tools-library-ac10c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ===== LOGIN PAGE =====
const loginBtn = document.getElementById("loginBtn");
if (loginBtn) {
  loginBtn.onclick = async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const error = document.getElementById("error");
    error.textContent = "";

    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "./posts.html";
    } catch (e) {
      error.textContent = "Login gagal";
    }
  };
}

// ===== PROTECT ADMIN PAGES =====
onAuthStateChanged(auth, user => {
  const isLoginPage = location.pathname.includes("login.html");

  if (!user && !isLoginPage) {
    window.location.href = "./login.html";
  }
});

// ===== LOGOUT (OPTIONAL) =====
window.adminLogout = async () => {
  await signOut(auth);
  window.location.href = "./login.html";
};
