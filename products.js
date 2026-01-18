// products.js — PUBLIC PRODUCT RENDER
// Digunakan di index.html

import { db } from "/ai-tools/firebase-public.js";
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

  grid.innerHTML = "<p>Memuat produk...</p>";

  try {
    const q = query(
      collection(db, "products"),
      where("status", "==", "active"),
      where("featured", "==", true),
      orderBy("time", "desc"),
      limit(3) // 🔒 BATAS PRODUK DI HALAMAN DEPAN
    );

    const snap = await getDocs(q);

    if (snap.empty) {
      grid.innerHTML = "<p>Belum ada produk.</p>";
      return;
    }

    grid.innerHTML = "";

    snap.forEach(doc => {
      const p = doc.data();

      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <div class="product-name">${p.name}</div>
        <div class="desc">${p.summary || ""}</div>
        <a class="btn" href="${p.url || "#"}">Lihat Produk</a>
      `;

      grid.appendChild(card);
    });

  } catch (err) {
    console.error("PRODUCT LOAD ERROR:", err);
    grid.innerHTML = "<p>Gagal memuat produk.</p>";
  }
});
