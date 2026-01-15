import { db } from "/admin/firebase-public.js";
import {
  collection,
  getDocs,
  query,
  where,
  limit
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.getElementById("productGrid");
  if (!grid) return;

  try {
    const q = query(
      collection(db, "products"),
      where("status", "==", "active"),
      limit(6)
    );

    const snap = await getDocs(q);

    if (snap.empty) {
      grid.innerHTML = "<p style='text-align:center'>Belum ada produk.</p>";
      return;
    }

    grid.innerHTML = "";

    snap.forEach(doc => {
      const p = doc.data();

      grid.innerHTML += `
        <div class="card">
          <div class="product-name">${p.name || "(tanpa nama)"}</div>
          <div class="desc">${p.summary || ""}</div>
          <a class="btn" href="/products/${p.slug}.html">
            Lihat Produk
          </a>
        </div>
      `;
    });

  } catch (err) {
    console.error("PRODUCT ERROR:", err);
    grid.innerHTML =
      "<p style='text-align:center'>Gagal memuat produk.</p>";
  }
});
