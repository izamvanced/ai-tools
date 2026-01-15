/* ================================
   PRODUCTS (PUBLIC FRONTEND)
   File: /products.js
================================ */

import { db } from "./firebase-public.js";
import {
  collection,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

console.log("PRODUCTS.JS LOADED");

document.addEventListener("DOMContentLoaded", loadProducts);

async function loadProducts() {
  console.log("LOAD PRODUCTS RUNNING");

  const grid = document.getElementById("productGrid");

  if (!grid) {
    console.error("❌ productGrid element NOT FOUND");
    return;
  }

  try {
    const q = query(
      collection(db, "products"),
      where("status", "==", "active")
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.warn("⚠️ No active products found");
      grid.innerHTML = "<p>Tidak ada produk.</p>";
      return;
    }

    grid.innerHTML = "";

    snapshot.forEach(doc => {
      const data = doc.data();

      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <div class="product-name">${data.name || "Untitled Product"}</div>
        <div class="desc">${data.summary || ""}</div>
        <a class="btn" href="product.html?slug=${data.slug}">
          Lihat Produk
        </a>
      `;

      grid.appendChild(card);
    });

    console.log("✅ PRODUCTS RENDERED:", snapshot.size);

  } catch (err) {
    console.error("🔥 LOAD PRODUCTS ERROR:", err);
    grid.innerHTML = "<p>Gagal memuat produk.</p>";
  }
}
