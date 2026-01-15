<script type="module" src="./posts.js"></script>
import { db } from "./firebase-public.js";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

console.log("POSTS.JS LOADED");

document.addEventListener("DOMContentLoaded", async () => {
  console.log("POSTS DOM READY");

  const postList = document.getElementById("postList");
  if (!postList) {
    console.log("postList element NOT FOUND");
    return;
  }

  postList.innerHTML = "<p>Loading post...</p>";

  try {
    const q = query(
      collection(db, "posts"),
      where("status", "==", "published"),
      orderBy("updatedAt", "desc")
    );

    const snapshot = await getDocs(q);
    console.log("POST FOUND:", snapshot.size);

    if (snapshot.empty) {
      postList.innerHTML = "<p>Tidak ada post.</p>";
      return;
    }

    postList.innerHTML = "";

    snapshot.forEach(doc => {
      const data = doc.data();

      // 🔒 FILTER DATA RUSAK
      if (!data.title || !data.content) {
        console.log("SKIP INVALID POST:", doc.id);
        return;
      }

      postList.innerHTML += `
        <div class="post-item">
          <h3>${data.title}</h3>
          <p>${data.content}</p>
        </div>
      `;
    });

  } catch (err) {
    console.error("ERROR LOAD POSTS:", err);
    postList.innerHTML = "<p>Gagal memuat post.</p>";
  }
});
