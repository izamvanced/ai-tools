import { db } from "./firebase-public.js";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async () => {
  const list = document.getElementById("postList");
  if (!list) return;

  try {
    const q = query(
      collection(db, "posts"),
      where("status", "==", "published"),
      orderBy("title"),
      limit(3)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      list.innerHTML = "<p>Tidak ada post.</p>";
      return;
    }

    list.innerHTML = "";

    snapshot.forEach(doc => {
      const data = doc.data();
      list.innerHTML += `
        <div class="post-item">
          <h3>${data.title || "(tanpa judul)"}</h3>
          <p>${data.content || ""}</p>
        </div>
      `;
    });

  } catch (err) {
    console.error(err);
    list.innerHTML = "<p>Gagal memuat post.</p>";
  }
});
