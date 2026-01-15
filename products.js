alert("STEP 1: products.js LOADED");

import { db } from "./firebase-public.js";
alert("STEP 2: firebase-public.js OK");

import {
  collection,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

alert("STEP 3: Firestore SDK OK");

document.addEventListener("DOMContentLoaded", async () => {
  alert("STEP 4: DOM READY");

  const grid = document.getElementById("productGrid");
  if (!grid) {
    alert("❌ productGrid NOT FOUND");
    return;
  }

  alert("STEP 5: productGrid FOUND");

  try {
    const q = query(
      collection(db, "products"),
      where("status", "==", "active")
    );

    alert("STEP 6: QUERY CREATED");

    const snapshot = await getDocs(q);

    alert("STEP 7: QUERY DONE, docs = " + snapshot.size);

    if (snapshot.empty) {
      grid.innerHTML = "<p>Tidak ada produk.</p>";
      return;
    }

    grid.innerHTML = "";

    snapshot.forEach(doc => {
      const p = doc.data();

      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `
        <div class="product-name">${p.name}</div>
        <div class="desc">${p.summary || ""}</div>
      `;
      grid.appendChild(div);
    });

    alert("STEP 8: RENDER DONE");

  } catch (e) {
    alert("🔥 ERROR: " + e.message);
  }
});
