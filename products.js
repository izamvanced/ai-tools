import { db } from "./firebase-public.js";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const grid = document.getElementById("productGrid");

async function loadProducts() {
  try {
    const q = query(
      collection(db, "products"),
      where("status", "==", "active")
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      grid.innerHTML = "<p>Tidak ada produk.</p>";
      return;
    }

    grid.innerHTML = "";

    snapshot.forEach(doc => {
      const p = doc.data();

      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <div class="product-name">${p.name}</div>
        <div class="desc">${p.summary || ""}</div>
        <a class="btn" href="product.html?slug=${p.slug}">
          Lihat Produk
        </a>
      `;

      grid.appendChild(card);
    });

  } catch (err) {
    console.error("LOAD PRODUCTS ERROR:", err);
    grid.innerHTML = "<p>Gagal memuat produk.</p>";
  }
}

document.addEventListener("DOMContentLoaded", loadProducts);
