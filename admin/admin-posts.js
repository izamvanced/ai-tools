import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  orderBy,
  query
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { db } from "./firebase.js";

let editId = null;

const titleInput   = document.getElementById("title");
const contentInput = document.getElementById("content");
const statusSelect = document.getElementById("status");
const saveBtn      = document.getElementById("saveBtn");
const postList     = document.getElementById("postList");

/* ================= LOAD POSTS ================= */
async function loadPosts() {
  postList.innerHTML = "<p>Loading…</p>";

  const q = query(
    collection(db, "posts"),
    orderBy("createdAt", "desc")
  );

  const snap = await getDocs(q);

  postList.innerHTML = "";

  snap.forEach(d => {
    const p = d.data();
    postList.innerHTML += `
      <div>
        <b>${p.title}</b> (${p.status})
        <button onclick="editPost('${d.id}')">Edit</button>
        <button onclick="deletePost('${d.id}')">Delete</button>
      </div>
    `;
  });
}

/* ================= SAVE ================= */
saveBtn.onclick = async () => {
  const title   = titleInput.value.trim();
  const content = contentInput.value.trim();
  const status  = statusSelect.value;

  if (!title || !content) {
    alert("Judul & konten wajib.");
    return;
  }

  if (editId) {
    // UPDATE
    await updateDoc(doc(db, "posts", editId), {
      title,
      content,
      status,
      updatedAt: serverTimestamp()
    });
  } else {
    // CREATE — 🔥 WAJIB ISI time
    await addDoc(collection(db, "posts"), {
      title,
      content,
      status,
      time: Date.now(),                 // KUNCI FRONTEND
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  }

  resetForm();
  loadPosts();
};

/* ================= EDIT ================= */
window.editPost = async (id) => {
  const snap = await getDocs(collection(db, "posts"));
  snap.forEach(d => {
    if (d.id === id) {
      const p = d.data();
      editId = id;
      titleInput.value   = p.title;
      contentInput.value = p.content;
      statusSelect.value = p.status;
    }
  });
};

/* ================= DELETE ================= */
window.deletePost = async (id) => {
  if (!confirm("Hapus post?")) return;
  await deleteDoc(doc(db, "posts", id));
  loadPosts();
};

/* ================= RESET ================= */
function resetForm() {
  editId = null;
  titleInput.value = "";
  contentInput.value = "";
  statusSelect.value = "draft";
}

loadPosts();
