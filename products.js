import { db } from "./firebase-public.js";
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

console.log("PRODUCTS JS LOADED");

document.addEventListener("DOMContentLoaded", async () => {
  console.log("PRODUCTS DOM READY");

  const grid = document.getElementById("productGrid");
  grid.innerHTML = "<p>Querying products...</p>";

  const snapshot = await getDocs(collection(db, "products"));

  console.log("PRODUCT COUNT:", snapshot.size);

  if (snapshot.empty) {
    grid.innerHTML = "<p>Products collection kosong.</p>";
    return;
  }

  grid.innerHTML = "";

  snapshot.forEach(doc => {
    const data = doc.data();
    grid.innerHTML += `
      <div class="card">
        <div class="product-name">${data.name}</div>
        <div class="desc">${data.summary || ""}</div>
      </div>
    `;
  });
});
