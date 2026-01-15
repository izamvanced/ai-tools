// product.js
import {
  db,
  collection,
  getDocs,
  query,
  where
} from "./firebase-public.js";

// Ambil slug dari URL
function getSlug() {
  const params = new URLSearchParams(window.location.search);
  return params.get("slug");
}

document.addEventListener("DOMContentLoaded", loadProduct);

async function loadProduct() {
  const slug = getSlug();
  if (!slug) {
    console.warn("No slug provided.");
    return;
  }

  try {
    const q = query(
      collection(db, "products"),
      where("slug", "==", slug),
      where("status", "==", "active")
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.warn("Product not found.");
      return;
    }

    const data = snapshot.docs[0].data();

    // Update title
    document.title = `${data.name} – AI Tools Library`;

    // Render content
    const nameEl = document.getElementById("productName");
    const summaryEl = document.getElementById("productSummary");
    const imagesEl = document.getElementById("productImages");

    if (nameEl) nameEl.textContent = data.name;
    if (summaryEl) summaryEl.textContent = data.summary || "";

    if (imagesEl) {
      imagesEl.innerHTML = "";
      (data.images || []).forEach(src => {
        const img = document.createElement("img");
        img.src = src;
        img.loading = "lazy";
        imagesEl.appendChild(img);
      });
    }
  } catch (err) {
    console.error("Failed to load product:", err);
  }
}
