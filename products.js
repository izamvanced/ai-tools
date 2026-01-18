// products.js — PUBLIC PRODUCT RENDER
// Dipakai di index.html
// REQUIRE: firebase-public.js sudah di-load

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

      // SAFETY GUARD (biar ga error di HP)
      const name = p.name || "(Tanpa nama)";
      const summary = p.summary || "";
      const url = p.url || "#";

      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <div class="product-name">${escapeHTML(name)}</div>
        <div class="desc">${escapeHTML(summary)}</div>
        <a class="btn" href="${url}">Lihat Produk</a>
      `;

      grid.appendChild(card);
    });

  } catch (err) {
    console.error("PRODUCT LOAD ERROR:", err);
    grid.innerHTML = "<p>Gagal memuat produk.</p>";
  }
});

/* ===============================
   UTIL — ANTI XSS (AMAN DI PUBLIK)
================================ */
function escapeHTML(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
