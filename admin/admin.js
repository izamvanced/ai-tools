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

/* ========= STATE ========= */
let editingPostId = null;

/* ========= FORM ELEMENTS ========= */
const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const imagesInput = document.getElementById("images");
const saveBtn = document.getElementById("savePost");
const postList = document.getElementById("postList");
const editIndicator = document.getElementById("editIndicator");

/* ========= IMAGE PREVIEW ========= */
const preview = document.getElementById("imagePreview");
imagesInput.addEventListener("input", () => {
  preview.innerHTML = "";
  const paths = imagesInput.value.split("\n").map(p => p.trim()).filter(Boolean);

  paths.forEach(src => {
    const img = document.createElement("img");
    img.src = src;
    img.style.maxWidth = "100%";
    img.style.marginTop = "8px";
    img.onerror = () => img.style.opacity = "0.3";
    preview.appendChild(img);
  });
});

/* ========= LOAD POSTS ========= */
async function loadPosts() {
  postList.innerHTML = "Loading...";
  const q = query(collection(db, "posts"), orderBy("updatedAt", "desc"));
  const snapshot = await getDocs(q);

  postList.innerHTML = "";

  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const div = document.createElement("div");

    div.style.border = "1px solid #1e293b";
    div.style.padding = "10px";
    div.style.marginBottom = "8px";
    div.style.borderRadius = "6px";
    div.style.cursor = "pointer";
    div.style.opacity = data.status === "draft" ? "0.7" : "1";

    div.innerHTML = `
      <strong>${data.title}</strong><br>
      <small>Status: ${data.status}</small>
    `;

    div.addEventListener("click", () => loadPostToForm(docSnap.id, data));
    postList.appendChild(div);
  });
}

/* ========= LOAD POST TO FORM ========= */
function loadPostToForm(id, data) {
  editingPostId = id;

  titleInput.value = data.title;
  contentInput.value = data.content;
  imagesInput.value = (data.images || []).join("\n");
  editIndicator.style.display = "block";

  imagesInput.dispatchEvent(new Event("input"));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ========= SAVE (ADD / UPDATE) ========= */
saveBtn.addEventListener("click", async () => {
  const title = titleInput.value.trim();
  const content = contentInput.value.trim();
  const images = imagesInput.value.split("\n").map(p => p.trim()).filter(Boolean);

  if (!title || !content) {
    alert("Judul & konten wajib diisi");
    return;
  }

  if (editingPostId) {
    // UPDATE
    await updateDoc(doc(db, "posts", editingPostId), {
      title,
      content,
      images,
      updatedAt: serverTimestamp()
    });

    editingPostId = null;
    editIndicator.style.display = "none";
  } else {
    // ADD NEW
    await addDoc(collection(db, "posts"), {
      title,
      content,
      images,
      status: "draft",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  }

  titleInput.value = "";
  contentInput.value = "";
  imagesInput.value = "";
  preview.innerHTML = "";

  loadPosts();
});

/* ========= INIT ========= */
loadPosts();
