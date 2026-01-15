// products.js
import {
  db,
  collection,
  getDocs,
  query,
  where
} from "./firebase-public.js";

// Ambil container grid di index
const grid = document.getElementById("productGrid");

// Guard: kalau halaman bukan index / grid tidak ada
if (!grid) {
  console.warn("productGrid not found. products.js skipped.");
} else {
  loadProducts();
}

async function loadProducts() {
  try {
    const q = query(
      collection(db, "products"),
      where("status", "==", "active")
    );

    const snapshot = await getDocs(q);
    grid.innerHTML = "";

    if (snapshot.empty) {
      grid.innerHTML = "<p>Belum ada produk.</p>";
      return;
    }

    snapshot.forEach(doc => {
      const p = doc.data();

      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <div class="product-name">${p.name}</div>
        <div class="desc">${p.summary || ""}</div>
        <a class="btn" href="/ai-tools/product.html?slug=${p.slug}">
          Lihat Produk
        </a>
      `;

      grid.appendChild(card);
    });
  } catch (err) {
    console.error("Failed to load products:", err);
    grid.innerHTML = "<p>Gagal memuat produk.</p>";
  }
}
