import { db } from "./firebase-public.js";
import {
  collection,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async () => {
  const postList = document.getElementById("postList");
  if (!postList) return;

  postList.innerHTML = "<p>Loading post...</p>";

  try {
    const q = query(
      collection(db, "posts"),
      where("status", "==", "published")
    );

    const snap = await getDocs(q);

    if (snap.empty) {
      postList.innerHTML = "<p>Tidak ada post.</p>";
      return;
    }

    postList.innerHTML = "";

    snap.forEach(doc => {
      const d = doc.data();

      // FILTER KETAT (ANTI DATA RUSAK)
      if (!d.title || !d.content) return;

      postList.innerHTML += `
        <div class="post-item">
          <h3>${d.title}</h3>
          <p>${d.content}</p>
        </div>
      `;
    });

  } catch (e) {
    postList.innerHTML = "<p>Gagal memuat post.</p>";
  }
});
