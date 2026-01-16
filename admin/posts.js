// admin/posts.js
// FINAL VERSION — ANTI POST TIDAK MUNCUL
// REQUIRE: firebase.js (ADMIN) sudah load db + auth

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

/* =====================
   STATE
===================== */
let editingId = null;

/* =====================
   ELEMENTS
===================== */
const titleInput   = document.getElementById("title");
const contentInput = document.getElementById("content");
const statusInput  = document.getElementById("status");
const saveBtn      = document.getElementById("saveBtn");
const cancelBtn    = document.getElementById("cancelBtn");
const postList     = document.getElementById("postList");
const modeTitle    = document.getElementById("modeTitle");

/* =====================
   LOAD POSTS (ADMIN LIST)
===================== */
async function loadPosts() {
  postList.innerHTML = "<p>Loading posts…</p>";

  const q = query(
    collection(db, "posts"),
    orderBy("createdAt", "desc")
  );

  const snap = await getDocs(q);

  if (snap.empty) {
    postList.innerHTML = "<p>Belum ada post.</p>";
    return;
  }

  postList.innerHTML = "";

  snap.forEach(d => {
    const p = d.data();

    const badge =
      p.status === "published"
        ? `<span style="color:green">published</span>`
        : `<span style="color:#888">draft</span>`;

    postList.innerHTML += `
      <div class="post-item">
        <div>
          <strong>${p.title || "(tanpa judul)"}</strong><br>
          <small>${badge}</small>
        </div>
        <div class="actions">
          <button onclick="editPost('${d.id}')">Edit</button>
          <button onclick="removePost('${d.id}')">Delete</button>
        </div>
      </div>
    `;
  });
}

/* =====================
   SAVE (CREATE / UPDATE)
===================== */
saveBtn.addEventListener("click", async () => {
  const title   = titleInput.value.trim();
  const content = contentInput.value.trim();
  const status  = statusInput.value;

  if (!title || !content) {
    alert("Judul dan konten wajib diisi.");
    return;
  }

  // PAYLOAD WAJIB — FRONTEND SAFE
  const payload = {
    title,
    content,
    status,
    time: Date.now(),                // 🔥 KUNCI AGAR MUNCUL DI DEPAN
    updatedAt: serverTimestamp()
  };

  try {
    if (editingId) {
      // UPDATE
      await updateDoc(doc(db, "posts", editingId), payload);
    } else {
      // CREATE
      await addDoc(collection(db, "posts"), {
        ...payload,
        createdAt: serverTimestamp()
      });
    }

    resetForm();
    loadPosts();

  } catch (err) {
    console.error("SAVE ERROR:", err);
    alert("Gagal menyimpan post.");
  }
});

/* =====================
   EDIT
===================== */
window.editPost = async (id) => {
  const snap = await getDocs(collection(db, "posts"));

  snap.forEach(d => {
    if (d.id === id) {
      const p = d.data();
      editingId = id;

      titleInput.value   = p.title || "";
      contentInput.value = p.content || "";
      statusInput.value  = p.status || "draft";

      modeTitle.textContent = "✏️ Edit Post";
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });
};

/* =====================
   DELETE
===================== */
window.removePost = async (id) => {
  if (!confirm("Hapus post ini?")) return;
  await deleteDoc(doc(db, "posts", id));
  loadPosts();
};

/* =====================
   RESET FORM
===================== */
function resetForm() {
  editingId = null;
  titleInput.value = "";
  contentInput.value = "";
  statusInput.value = "published"; // 👈 DEFAULT AGAR LANGSUNG TAMPIL
  modeTitle.textContent = "➕ Create New Post";
}

/* =====================
   CANCEL EDIT
===================== */
cancelBtn.addEventListener("click", () => {
  resetForm();
});

/* =====================
   INIT
===================== */
resetForm();
loadPosts();
