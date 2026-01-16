// posts.js — PUBLIC POSTS RENDER
// Digunakan di index.html
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
  const list = document.getElementById("postList");
  if (!list) return;

  list.innerHTML = "<p>Memuat post...</p>";

  try {
    const q = query(
      collection(db, "posts"),
      where("status", "==", "published"),
      orderBy("time", "desc"),
      limit(3) // 🔒 MAKS POST DI HALAMAN DEPAN
    );

    const snap = await getDocs(q);

    if (snap.empty) {
      list.innerHTML = "<p>Tidak ada post.</p>";
      return;
    }

    list.innerHTML = "";

    snap.forEach(doc => {
      const data = doc.data();

      const title = data.title || "(tanpa judul)";
      const content = data.content || "";

      list.innerHTML += `
        <div class="cms-post">
          <strong>${escapeHTML(title)}</strong>
          <p>${escapeHTML(content)}</p>
        </div>
      `;
    });

  } catch (err) {
    console.error("POST LOAD ERROR:", err);
    list.innerHTML = "<p>Gagal memuat post.</p>";
  }
});

/* ===============================
   UTIL — ANTI XSS SEDERHANA
================================ */
function escapeHTML(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
