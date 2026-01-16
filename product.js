import { db } from "./firebase-public.js";
import {
  collection,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.getElementById("productGrid");
  if (!grid) return;

  try {
    const q = query(
      collection(db, "products"),
      where("status", "==", "active")
    );

    const snap = await getDocs(q);

    if (snap.empty) {
      grid.innerHTML = "<p>Tidak ada produk.</p>";
      return;
    }

    grid.innerHTML = "";

    snap.forEach(doc => {
      const p = doc.data();

      grid.innerHTML += `
        <div class="cms-card">
          <div class="cms-title">${p.name}</div>
          <div class="cms-desc">${p.summary || ""}</div>
          <a class="btn" href="./product.html?slug=${p.slug}">
            Lihat Produk
          </a>
        </div>
      `;
    });

  } catch (e) {
    console.error(e);
    grid.innerHTML = "<p>Gagal memuat produk.</p>";
  }
});
