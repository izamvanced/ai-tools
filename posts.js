alert("POSTS JS EXECUTED");
import { db } from "./firebase-public.js";
import { collection, getDocs } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

console.log("POSTS JS LOADED");

document.addEventListener("DOMContentLoaded", async () => {
  console.log("POSTS DOM READY");

  const postList = document.getElementById("postList");
  if (!postList) {
    postList.innerHTML = "postList tidak ditemukan";
    return;
  }

  const snapshot = await getDocs(collection(db, "posts"));

  console.log("TOTAL POSTS:", snapshot.size);

  if (snapshot.empty) {
    postList.innerHTML = "<p>TIDAK ADA DATA</p>";
    return;
  }

  postList.innerHTML = "";

  snapshot.forEach(doc => {
    const d = doc.data();
    postList.innerHTML += `
      <div class="post-item">
        <h3>${d.title || "(tanpa judul)"}</h3>
        <p>${d.content || "(tanpa konten)"}</p>
      </div>
    `;
  });
});
