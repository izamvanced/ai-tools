// products.js — PUBLIC PRODUCTS RENDER
// Dipakai di index.html
// REQUIRE: firebase-public.js sudah diload lebih dulu

import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { db } from "./firebase-public.js";

document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.getElementById("productGrid");
  if (!grid) return;

  grid.innerHTML = "<p>Memuat produk...</p>";

  try {
    const q = query(
      collection(db, "products"),
      where("status", "==", "active"),   // ⬅️ SESUAI DATA LO
      orderBy("time", "desc"),           // ⬅️ FIELD SUDAH ADA
      limit(3)                           // 🔒 MAKS PRODUK DI DEPAN
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
        <div class="card">
          <div class="product-name">${p.name || "(tanpa nama)"}</div>
          <div class="desc">${p.summary || ""}</div>
          <a class="btn" href="${p.url || "#"}">Lihat Produk</a>
        </div>
      `;
    });

  } catch (err) {
    console.error("PRODUCT LOAD ERROR:", err);
    grid.innerHTML = "<p>Gagal memuat produk.</p>";
  }
});
