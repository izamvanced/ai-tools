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
let editingPostId = null;

/* =====================
   ELEMENTS
===================== */
const titleInput = document.getElementById("title");
const slugInput = document.getElementById("slug");
const excerptInput = document.getElementById("excerpt");
const contentInput = document.getElementById("content");
const imagesInput = document.getElementById("images");
const statusInput = document.getElementById("status");

const saveBtn = document.getElementById("savePost");
const postList = document.getElementById("postList");
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
  const paths = imagesInput.value.split("\n").map(p => p.trim()).filter(Boolean);

  paths.forEach(src => {
    const img = document.createElement("img");
    img.src = src;
    img.loading = "lazy";
    img.onerror = () => (img.style.opacity = "0.3");
    preview.appendChild(img);
  });
});

/* =====================
   LOAD POSTS
===================== */
async function loadPosts() {
  postList.innerHTML = "Loading...";
  const q = query(collection(db, "posts"), orderBy("updatedAt", "desc"));
  const snapshot = await getDocs(q);

  postList.innerHTML = "";

  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const div = document.createElement("div");
    div.className = "item";

    div.innerHTML = `
      <strong>${data.title}</strong><br>
      <small>${data.status} • ${data.slug}</small>
    `;

    div.addEventListener("click", () => loadPostToForm(docSnap.id, data));
    postList.appendChild(div);
  });
}

/* =====================
   LOAD POST TO FORM
===================== */
function loadPostToForm(id, data) {
  editingPostId = id;

  titleInput.value = data.title || "";
  slugInput.value = data.slug || "";
  excerptInput.value = data.excerpt || "";
  contentInput.value = data.content || "";
  imagesInput.value = (data.images || []).join("\n");
  statusInput.value = data.status || "draft";

  editIndicator.classList.remove("hidden");
  imagesInput.dispatchEvent(new Event("input"));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* =====================
   SAVE POST
===================== */
saveBtn.addEventListener("click", async () => {
  const title = titleInput.value.trim();
  const slug = slugInput.value.trim();
  const excerpt = excerptInput.value.trim();
  const content = contentInput.value.trim();
  const status = statusInput.value;

  const images = imagesInput.value.split("\n").map(p => p.trim()).filter(Boolean);

  if (!title || !slug) {
    alert("Judul dan slug wajib diisi");
    return;
  }

  const payload = {
    title,
    slug,
    excerpt,
    content,
    images,
    status,
    updatedAt: serverTimestamp()
  };

  if (editingPostId) {
    await updateDoc(doc(db, "posts", editingPostId), payload);
    editingPostId = null;
    editIndicator.classList.add("hidden");
  } else {
    await addDoc(collection(db, "posts"), {
      ...payload,
      createdAt: serverTimestamp()
    });
  }

  titleInput.value = "";
  slugInput.value = "";
  excerptInput.value = "";
  contentInput.value = "";
  imagesInput.value = "";
  statusInput.value = "draft";
  preview.innerHTML = "";
  result.textContent = "";

  loadPosts();
});

/* =====================
   INIT
===================== */
loadPosts();
