import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ========= IMAGE PATH HELPER ========= */
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

/* ========= IMAGE PREVIEW ========= */
const imagesInput = document.getElementById("images");
const preview = document.getElementById("imagePreview");

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
    img.onerror = () => img.style.opacity = "0.3";
    preview.appendChild(img);
  });
});

/* ========= SAVE POST ========= */
document.getElementById("savePost").addEventListener("click", async () => {
  const title = document.getElementById("title").value.trim();
  const content = document.getElementById("content").value.trim();

  const images = imagesInput.value
    .split("\n")
    .map(p => p.trim())
    .filter(Boolean);

  if (!title || !content) {
    alert("Judul & konten wajib diisi");
    return;
  }

  await addDoc(collection(db, "posts"), {
    title,
    content,
    images,
    status: "draft",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  document.getElementById("title").value = "";
  document.getElementById("content").value = "";
  imagesInput.value = "";
  preview.innerHTML = "";
  result.textContent = "";

  alert("Post tersimpan (draft)");
});
