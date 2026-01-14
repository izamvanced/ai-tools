import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

console.log("ADMIN PRODUCTS JS LOADED");

document.addEventListener("DOMContentLoaded", () => {

  /* =====================
     STATE
  ===================== */
  let editingProductId = null;

  /* =====================
     ELEMENTS
  ===================== */
  const nameInput = document.getElementById("name");
  const slugInput = document.getElementById("slug");
  const categoryInput = document.getElementById("category");
  const summaryInput = document.getElementById("summary");
  const imagesInput = document.getElementById("images");
  const featuredInput = document.getElementById("featured");
  const statusInput = document.getElementById("status");

  const saveBtn = document.getElementById("saveProduct");
  const productList = document.getElementById("productList");
  const editIndicator = document.getElementById("editIndicator");
  const preview = document.getElementById("imagePreview");

  /* =====================
     IMAGE PATH HELPER
  ===================== */
  const folderInput = document.getElementById("imageFolder");
  const fileInput = document.getElementById("imageFile");
  const copyBtn = document.getElementById("copyImagePath");
  const result = document.getElementById("pathResult");

  copyBtn.addEventListener("click", async () => {
    const folder = folderInput.value.trim().replace(/^\/|\/$/g, "");
    const file = fileInput.value.trim();

    if (!folder || !file) {
      alert("Folder dan nama file wajib diisi");
      return;
    }

    const path = `/assets/${folder}/${file}`;
    await navigator.clipboard.writeText(path);
    result.textContent = `Copied: ${path}`;
  });

  /* =====================
     IMAGE PREVIEW
  ===================== */
  imagesInput.addEventListener("input", () => {
    preview.innerHTML = "";

    imagesInput.value
      .split("\n")
      .map(p => p.trim())
      .filter(Boolean)
      .forEach(src => {
        const img = document.createElement("img");
        img.src = src;
        img.loading = "lazy";
        img.onerror = () => (img.style.opacity = "0.3");
        preview.appendChild(img);
      });
  });

  /* =====================
     LOAD PRODUCTS
  ===================== */
  async function loadProducts() {
    productList.innerHTML = "Loading...";
    const snapshot = await getDocs(collection(db, "products"));
    productList.innerHTML = "";

    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      const div = document.createElement("div");
      div.className = "item";

      div.innerHTML = `
        <strong>${data.name}</strong><br>
        <small>${data.category || "-"} • ${data.status}</small>
      `;

      div.addEventListener("click", () =>
        loadProductToForm(docSnap.id, data)
      );

      productList.appendChild(div);
    });
  }

  /* =====================
     LOAD PRODUCT TO FORM
  ===================== */
  function loadProductToForm(id, data) {
    editingProductId = id;

    nameInput.value = data.name || "";
    slugInput.value = data.slug || "";
    categoryInput.value = data.category || "";
    summaryInput.value = data.summary || "";
    imagesInput.value = (data.images || []).join("\n");
    featuredInput.checked = !!data.featured;
    statusInput.value = data.status || "active";

    editIndicator.classList.remove("hidden");
    imagesInput.dispatchEvent(new Event("input"));
  }

  /* =====================
     SAVE PRODUCT
  ===================== */
  saveBtn.addEventListener("click", async () => {
    if (!nameInput.value || !slugInput.value) {
      alert("Nama dan slug wajib diisi");
      return;
    }

    const payload = {
      name: nameInput.value.trim(),
      slug: slugInput.value.trim(),
      category: categoryInput.value.trim(),
      summary: summaryInput.value.trim(),
      images: imagesInput.value.split("\n").filter(Boolean),
      featured: featuredInput.checked,
      status: statusInput.value,
      updatedAt: serverTimestamp()
    };

    if (editingProductId) {
      await updateDoc(doc(db, "products", editingProductId), payload);
      editingProductId = null;
      editIndicator.classList.add("hidden");
    } else {
      await addDoc(collection(db, "products"), {
        ...payload,
        createdAt: serverTimestamp()
      });
    }

    loadProducts();
    alert("Product saved");
  });

  loadProducts();
});
