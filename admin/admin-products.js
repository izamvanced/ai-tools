import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

  try {
    await navigator.clipboard.writeText(path);
    result.textContent = `Copied: ${path}`;
  } catch {
    alert("Gagal copy ke clipboard");
  }
});

/* =====================
   IMAGE PREVIEW
===================== */
imagesInput.addEventListener("input", () => {
  preview.innerHTML = "";

  const paths = imagesInput.value
    .split("\n")
    .map(p => p.trim())
    .filter(Boolean);

  paths.forEach(src => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = "preview";
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
  const q = query(collection(db, "products"), orderBy("updatedAt", "desc"));
  const snapshot = await getDocs(q);

  productList.innerHTML = "";

  snapshot.forEach(docSnap => {
    const data = docSnap.data();

    const div = document.createElement("div");
    div.className = "item";

    div.innerHTML = `
      <strong>${data.name}</strong><br>
      <small>
        ${data.category || "no category"} •
        ${data.status} •
        ${data.featured ? "featured" : "normal"}
      </small>
    `;

    div.addEventListener("click", () => loadProductToForm(docSnap.id, data));
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
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* =====================
   SAVE PRODUCT
===================== */
saveBtn.addEventListener("click", async () => {
  const name = nameInput.value.trim();
  const slug = slugInput.value.trim();
  const category = categoryInput.value.trim();
  const summary = summaryInput.value.trim();
  const featured = featuredInput.checked;
  const status = statusInput.value;

  const images = imagesInput.value
    .split("\n")
    .map(p => p.trim())
    .filter(Boolean);

  if (!name || !slug) {
    alert("Nama dan slug wajib diisi");
    return;
  }

  const payload = {
    name,
    slug,
    category,
    summary,
    images,
    featured,
    status,
    updatedAt: serverTimestamp()
  };

  if (editingProductId) {
    // UPDATE
    await updateDoc(doc(db, "products", editingProductId), payload);
    editingProductId = null;
    editIndicator.classList.add("hidden");
  } else {
    // ADD NEW
    await addDoc(collection(db, "products"), {
      ...payload,
      createdAt: serverTimestamp()
    });
  }

  // RESET FORM
  nameInput.value = "";
  slugInput.value = "";
  categoryInput.value = "";
  summaryInput.value = "";
  imagesInput.value = "";
  featuredInput.checked = false;
  statusInput.value = "active";
  preview.innerHTML = "";
  result.textContent = "";

  loadProducts();
});

/* =====================
   INIT
===================== */
loadProducts();
