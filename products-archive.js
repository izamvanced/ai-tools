import { db } from "./firebase-public.js";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.getElementById("productGrid");
  if (!grid) return;

  try {
    const q = query(
      collection(db, "products"),
      where("status", "==", "active"),
      orderBy("name")
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      grid.innerHTML = "<p>Tidak ada produk.</p>";
      return;
    }

    grid.innerHTML = "";

    snapshot.forEach(doc => {
      const p = doc.data();

      grid.innerHTML += `
        <div class="card">
          <div class="product-name">${p.name}</div>
          <div class="desc">${p.summary || ""}</div>
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
