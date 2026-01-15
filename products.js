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
  const grid = document.getElementById("productGrid");
  if (!grid) return;

  try {
    const q = query(
      collection(db, "products"),
      where("status", "==", "active"),
      orderBy("name"),
      limit(3)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      grid.innerHTML = "<p>Tidak ada produk.</p>";
      return;
    }

    grid.innerHTML = "";

    snapshot.forEach(doc => {
      const data = doc.data();

      grid.innerHTML += `
        <div class="card">
          <div class="product-name">${data.name || "(Tanpa nama)"}</div>
          <div class="desc">
            ${data.summary || ""}
          </div>
          <a class="btn"
             href="./product.html?slug=${data.slug}">
            Lihat Produk
          </a>
        </div>
      `;
    });

  } catch (err) {
    console.error(err);
    grid.innerHTML = "<p>Gagal memuat produk.</p>";
  }
});
