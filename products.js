import {
  db,
  collection,
  getDocs,
  query,
  where,
  orderBy
} from "./firebase-public.js";

const grid = document.getElementById("productGrid");

if (!grid) {
  console.error("productGrid NOT FOUND");
} else {
  loadProducts();
}

async function loadProducts() {
  try {
    const q = query(
      collection(db, "products"),
      where("status", "==", "active"),
      orderBy("updatedAt", "desc")
    );

    const snap = await getDocs(q);

    grid.innerHTML = "";

    if (snap.empty) {
      grid.innerHTML = "<p>Tidak ada produk.</p>";
      return;
    }

    snap.forEach(doc => {
      const p = doc.data();

      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <div class="product-name">${p.name}</div>
        <div class="desc">${p.summary || ""}</div>
        <a class="btn" href="./product.html?slug=${p.slug}">
          Lihat Produk
        </a>
      `;

      grid.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    grid.innerHTML = "<p>Gagal memuat produk.</p>";
  }
}
