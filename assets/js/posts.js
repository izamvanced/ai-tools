import { db } from "/admin/firebase-public.js";
import {
  collection,
  getDocs,
  query,
  where,
  limit
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.getElementById("postGrid");
  if (!grid) return;

  try {
    const q = query(
      collection(db, "posts"),
      where("status", "==", "published"),
      limit(5)
    );

    const snap = await getDocs(q);

    if (snap.empty) {
      grid.innerHTML =
        "<p style='text-align:center'>Belum ada update.</p>";
      return;
    }

    grid.innerHTML = "";

    snap.forEach(doc => {
      const p = doc.data();

      grid.innerHTML += `
        <div class="card">
          <strong>${p.title || "(tanpa judul)"}</strong>
          <p style="margin-top:6px;color:#555">
            ${(p.content || "").slice(0,120)}
          </p>
        </div>
      `;
    });

  } catch (err) {
    console.error("POST ERROR:", err);
    grid.innerHTML =
      "<p style='text-align:center'>Gagal memuat post.</p>";
  }
});
