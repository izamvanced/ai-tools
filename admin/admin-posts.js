// admin-posts.js — FINAL FIXED VERSION
// SINGLE SOURCE OF TRUTH: field `time`

import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { db } from "./firebase.js";

const form = document.getElementById("postForm");
const titleInput = document.getElementById("postTitle");
const contentInput = document.getElementById("postContent");
const statusInput = document.getElementById("postStatus");
const postList = document.getElementById("postList");
const cancelBtn = document.getElementById("cancelEdit");

let editingId = null;

/* =========================
   LOAD POSTS (ADMIN)
========================= */
async function loadPosts() {
  postList.innerHTML = "<p>Memuat post...</p>";

  const q = query(
    collection(db, "posts"),
    orderBy("time", "desc")
  );

  const snap = await getDocs(q);

  if (snap.empty) {
    postList.innerHTML = "<p>Tidak ada post.</p>";
    return;
  }

  postList.innerHTML = "";

  snap.forEach(d => {
    const p = d.data();
    postList.innerHTML += `
      <div class="post-item">
        <strong>${p.title || "(tanpa judul)"}</strong>
        <span class="badge ${p.status}">${p.status}</span>
        <button data-edit="${d.id}">Edit</button>
        <button data-del="${d.id}">Delete</button>
      </div>
    `;
  });
}

/* =========================
   SAVE (CREATE / EDIT)
========================= */
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = titleInput.value.trim();
  const content = contentInput.value.trim();
  const status = statusInput.value;

  if (!title || !content) {
    alert("Judul dan konten wajib diisi.");
    return;
  }

  const payload = {
    title,
    content,
    status,
    time: Date.now() // 🔒 WAJIB
  };

  try {
    if (editingId) {
      await updateDoc(doc(db, "posts", editingId), payload);
    } else {
      await addDoc(collection(db, "posts"), payload);
    }

    resetForm();
    loadPosts();

  } catch (err) {
    console.error("SAVE ERROR:", err);
    alert("Gagal menyimpan post.");
  }
});

/* =========================
   EDIT / DELETE
========================= */
postList.addEventListener("click", async (e) => {
  if (e.target.dataset.edit) {
    const id = e.target.dataset.edit;
    const snap = await getDocs(collection(db, "posts"));
    snap.forEach(d => {
      if (d.id === id) {
        const p = d.data();
        editingId = id;
        titleInput.value = p.title || "";
        contentInput.value = p.content || "";
        statusInput.value = p.status || "draft";
      }
    });
  }

  if (e.target.dataset.del) {
    if (confirm("Hapus post ini?")) {
      await deleteDoc(doc(db, "posts", e.target.dataset.del));
      loadPosts();
    }
  }
});

cancelBtn.addEventListener("click", resetForm);

function resetForm() {
  editingId = null;
  form.reset();
}

loadPosts();
