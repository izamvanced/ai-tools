import { initializeApp } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc
} from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDIts39eYziTvJUVAvun91dIZRNjRO8Qes",
  authDomain: "ai-tools-library-ac10c.firebaseapp.com",
  projectId: "ai-tools-library-ac10c"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const list = document.getElementById("postAdminList");

const loadPosts = async () => {
  list.innerHTML = "Loading…";

  const snap = await getDocs(collection(db, "posts"));
  list.innerHTML = "";

  snap.forEach(d => {
    const data = d.data();
    const status = data.status || "draft";

    const wrap = document.createElement("div");
    wrap.className = "post";

    wrap.innerHTML = `
      <h3>${data.title || "(tanpa judul)"}</h3>
      <div class="status">Status: <b>${status}</b></div>
      <button class="${status === "published" ? "draft" : "publish"}">
        ${status === "published" ? "Jadikan Draft" : "Publish"}
      </button>
    `;

    wrap.querySelector("button").onclick = async () => {
      const newStatus = status === "published" ? "draft" : "published";
      await updateDoc(doc(db, "posts", d.id), {
        status: newStatus,
        updatedAt: new Date()
      });
      loadPosts();
    };

    list.appendChild(wrap);
  });
};

loadPosts();
