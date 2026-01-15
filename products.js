import { db } from "./firebase-public.js";
import { collection, getDocs } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.getElementById("productGrid");

  if (!grid) {
    document.body.innerHTML += "<p>❌ productGrid TIDAK DITEMUKAN</p>";
    return;
  }

  grid.innerHTML = "<p>Loading products…</p>";

  try {
    const snap = await getDocs(collection(db, "products"));

    grid.innerHTML = `<p>JUMLAH PRODUK: ${snap.size}</p>`;

  } catch (e) {
    grid.innerHTML = "<p>❌ ERROR FIRESTORE PRODUK</p>";
  }
});
