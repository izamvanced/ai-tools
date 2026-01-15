import { db } from "./firebase-public.js";
import { collection, getDocs } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.getElementById("productGrid");
  const snap = await getDocs(collection(db, "products"));

  grid.innerHTML = `<p>JUMLAH PRODUCTS: ${snap.size}</p>`;
});
