import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import {
  showToast,
  setButtonState,
  renderStatusBadge
} from "./shared-ui.js";

/* ===== STATE ===== */
let editingId = null;

/* ===== ELEMENTS ===== */
const nameInput = document.getElementById("name");
const slugInput = document.getElementById("slug");
const summaryInput = document.getElementById("summary");
const imagesInput = document.getElementById("images");
const statusInput = document.getElementById("status");
const saveBtn = document.getElementById("saveBtn");
const listEl = document.getElementById("productList");
const modeEl = document.getElementById("modeIndicator");

/* IMAGE HELPER */
const imgFile = document.getElementById("imgFile");
const imgResult = document.getElementById("imgResult");
const genBtn = document.getElementById("genImage");
const preview = document.getElementById("imagePreview");

/* ===== IMAGE HELPER ===== */
genBtn.addEventListener("click", () => {
  if (!slugInput.value || !imgFile.value) {
    imgResult.textContent = "❌ Slug & file wajib";
    return;
  }
  const path = `/assets/products/${slugInput.value}/${imgFile.value}`;
  imgResult.textContent = path;
  navigator.clipboard.writeText(path);
});

/* PREVIEW */
imagesInput.addEventListener("input", () => {
  preview.innerHTML = "";
  imagesInput.value
    .split("\n")
    .map(v => v.trim())
    .filter(Boolean)
    .forEach(src => {
      const img = document.createElement("img");
      img.src = src;
      img.style.maxWidth = "120px";
      img.style.marginRight = "6px";
      img.onerror = () => img.style.opacity = ".3";
      preview.appendChild(img);
    });
});

/* ===== LOAD PRODUCTS ===== */
async function loadProducts() {
  listEl.innerHTML = "Loading...";
  const snap = await getDocs(collection(db, "products"));
  listEl.innerHTML = "";

  snap.forEach(d => {
    const data = d.data();
    const div = document.createElement("div");
    div.className = "list-item";
    div.innerHTML = `<strong>${data.name}</strong>`;
    div.appendChild(renderStatusBadge(data.status || "inactive"));

    div.onclick = () => loadToForm(d.id, data);
    listEl.appendChild(div);
  });
}

/* ===== LOAD TO FORM ===== */
function loadToForm(id, d) {
  editingId = id;
  nameInput.value = d.name || "";
  slugInput.value = d.slug || "";
  summaryInput.value = d.summary || "";
  imagesInput.value = (d.images || []).join("\n");
  statusInput.value = d.status || "inactive";

  modeEl.textContent = `✏️ Editing: ${d.name}`;
  imagesInput.dispatchEvent(new Event("input"));
}

/* ===== SAVE ===== */
saveBtn.onclick = async () => {
  if (!nameInput.value || !slugInput.value || !summaryInput.value) {
    showToast("Field wajib belum lengkap", "error");
    return;
  }

  const payload = {
    name: nameInput.value.trim(),
    slug: slugInput.value.trim(),
    summary: summaryInput.value.trim(),
    images: imagesInput.value.split("\n").filter(Boolean),
    status: statusInput.value,
    updatedAt: serverTimestamp()
  };

  setButtonState(saveBtn, "loading", "Saving...");

  try {
    if (editingId) {
      await updateDoc(doc(db, "products", editingId), payload);
    } else {
      await addDoc(collection(db, "products"), {
        ...payload,
        createdAt: serverTimestamp()
      });
    }

    showToast("Produk berhasil disimpan", "success");
    resetForm();
    loadProducts();

  } catch (e) {
    console.error(e);
    showToast("Gagal menyimpan produk", "error");
  }

  setButtonState(saveBtn, "idle", "Save Product");
};

/* ===== RESET ===== */
function resetForm() {
  editingId = null;
  nameInput.value = "";
  slugInput.value = "";
  summaryInput.value = "";
  imagesInput.value = "";
  statusInput.value = "inactive";
  preview.innerHTML = "";
  modeEl.textContent = "➕ Create New Product";
}

/* INIT */
loadProducts();
