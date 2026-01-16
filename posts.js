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
      orderBy("time", "desc"),
      limit(3) // ⬅️ MAX POST DI HALAMAN DEPAN
    );

    const snap = await getDocs(q);

    if (snap.empty) {
      list.innerHTML = "<p>Tidak ada post.</p>";
      return;
    }

    list.innerHTML = "";

    snap.forEach(doc => {
      const p = doc.data();

      list.innerHTML += `
        <div class="cms-post">
          <strong>${p.title || "(tanpa judul)"}</strong>
          <p>${p.content || ""}</p>
        </div>
      `;
    });

  } catch (e) {
    console.error(e);
    list.innerHTML = "<p>Gagal memuat post.</p>";
  }
});
