// admin-posts.js — ADMIN POST MANAGER (FINAL LOCK)
// Aman untuk data lama & Android
// REQUIRE: firebase.js + auth.js sudah jalan

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

/* ===============================
   STATE
================================ */
let editId = null;

/* ===============================
   ELEMENTS
================================ */
const titleInput = document.getElementById("postTitle");
const contentInput = document.getElementById("postContent");
const statusSelect = document.getElementById("postStatus");
const saveBtn = document.getElementById("savePostBtn");
const cancelBtn = document.getElementById("cancelEditBtn");
const postList = document.getElementById("postList");
const previewBtn = document.getElementById("previewPostBtn");

/* ===============================
   LOAD POSTS
================================ */
async function loadPosts() {
  postList.innerHTML = "<p>Memuat post...</p>";

  try {
    const q = query(
      collection(db, "posts"),
      orderBy("createdAt", "desc") // 🔒 AMAN UNTUK SEMUA DATA
    );

    const snap = await getDocs(q);

    if (snap.empty) {
      postList.innerHTML = "<p>Belum ada post.</p>";
      return;
    }

    postList.innerHTML = "";

    snap.forEach(docSnap => {
      const p = docSnap.data();
      const id = docSnap.id;

      postList.innerHTML += `
        <div class="post-item">
          <div>
            <strong>${escapeHTML(p.title || "(tanpa judul)")}</strong>
            <span class="badge ${p.status === "published" ? "green" : "gray"}">
              ${p.status}
            </span>
          </div>
          <div class="actions">
            <button onclick="editPost('${id}')">Edit</button>
            <button onclick="deletePost('${id}')">Delete</button>
          </div>
        </div>
      `;
    });

  } catch (e) {
    console.error("LOAD POST ERROR:", e);
    postList.innerHTML = "<p>Gagal memuat post.</p>";
  }
}

/* ===============================
   SAVE / UPDATE POST
================================ */
saveBtn.addEventListener("click", async () => {
  const title = titleInput.value.trim();
  const content = contentInput.value.trim();
  const status = statusSelect.value;

  if (!title || !content) {
    alert("Judul dan konten wajib diisi.");
    return;
  }

  saveBtn.disabled = true;
  saveBtn.innerText = "Menyimpan...";

  try {
    if (editId) {
      // UPDATE
      await updateDoc(doc(db, "posts", editId), {
        title,
        content,
        status,
        updatedAt: serverTimestamp()
      });
    } else {
      // CREATE
      await addDoc(collection(db, "posts"), {
        title,
        content,
        status,
        createdAt: serverTimestamp(),
        time: Date.now() // 🔒 dipakai di halaman depan
      });
    }

    resetForm();
    await loadPosts();

  } catch (e) {
    console.error("SAVE ERROR:", e);
    alert("Gagal menyimpan post.");
  }

  saveBtn.disabled = false;
  saveBtn.innerText = "Save Post";
});

/* ===============================
   EDIT
================================ */
window.editPost = async (id) => {
  try {
    const snap = await getDocs(collection(db, "posts"));
    snap.forEach(d => {
      if (d.id === id) {
        const p = d.data();
        editId = id;
        titleInput.value = p.title || "";
        contentInput.value = p.content || "";
        statusSelect.value = p.status || "draft";
      }
    });
  } catch (e) {
    console.error("EDIT ERROR:", e);
  }
};

/* ===============================
   DELETE
================================ */
window.deletePost = async (id) => {
  if (!confirm("Hapus post ini?")) return;

  try {
    await deleteDoc(doc(db, "posts", id));
    await loadPosts();
  } catch (e) {
    console.error("DELETE ERROR:", e);
    alert("Gagal menghapus post.");
  }
};

/* ===============================
   PREVIEW
================================ */
previewBtn.addEventListener("click", () => {
  alert(
    "PREVIEW\n\n" +
    titleInput.value + "\n\n" +
    contentInput.value
  );
});

/* ===============================
   RESET
================================ */
cancelBtn.addEventListener("click", resetForm);

function resetForm() {
  editId = null;
  titleInput.value = "";
  contentInput.value = "";
  statusSelect.value = "draft";
}

/* ===============================
   UTIL
================================ */
function escapeHTML(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/* ===============================
   INIT
================================ */
loadPosts();
