// admin-posts.js
// POST MANAGER — CREATE / EDIT / DELETE
// FIXED: time field ALWAYS updated (biar muncul di homepage)

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

/* =========================
   ELEMENTS
========================= */
const form = document.getElementById("postForm");
const titleInput = document.getElementById("postTitle");
const contentInput = document.getElementById("postContent");
const statusInput = document.getElementById("postStatus");
const postList = document.getElementById("postList");
const cancelBtn = document.getElementById("cancelEdit");

let editingId = null;

/* =========================
   LOAD POSTS
========================= */
async function loadPosts() {
  postList.innerHTML = "<p>Memuat post...</p>";

  try {
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

    snap.forEach(docSnap => {
      const p = docSnap.data();
      const id = docSnap.id;

      postList.innerHTML += `
        <div class="post-item">
          <div>
            <strong>${p.title || "(tanpa judul)"}</strong>
            <span class="badge ${p.status}">
              ${p.status}
            </span>
          </div>
          <div class="actions">
            <button data-edit="${id}">Edit</button>
            <button data-del="${id}">Delete</button>
          </div>
        </div>
      `;
    });

  } catch (err) {
    console.error(err);
    postList.innerHTML = "<p>Gagal memuat post.</p>";
  }
}

/* =========================
   SAVE POST (CREATE / EDIT)
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

  try {
    if (editingId) {
      // UPDATE POST
      await updateDoc(doc(db, "posts", editingId), {
        title,
        content,
        status,
        time: Date.now() // 🔥 WAJIB
      });
    } else {
      // CREATE POST
      await addDoc(collection(db, "posts"), {
        title,
        content,
        status,
        time: Date.now() // 🔥 WAJIB
      });
    }

    resetForm();
    loadPosts();

  } catch (err) {
    console.error(err);
    alert("Gagal menyimpan post.");
  }
});

/* =========================
   CLICK HANDLER (EDIT / DELETE)
========================= */
postList.addEventListener("click", async (e) => {
  const editId = e.target.dataset.edit;
  const delId = e.target.dataset.del;

  if (editId) {
    const snap = await getDocs(collection(db, "posts"));
    snap.forEach(d => {
      if (d.id === editId) {
        const p = d.data();
        editingId = editId;
        titleInput.value = p.title || "";
        contentInput.value = p.content || "";
        statusInput.value = p.status || "draft";
      }
    });
  }

  if (delId) {
    if (confirm("Hapus post ini?")) {
      await deleteDoc(doc(db, "posts", delId));
      loadPosts();
    }
  }
});

/* =========================
   CANCEL EDIT
========================= */
cancelBtn.addEventListener("click", () => {
  resetForm();
});

/* =========================
   RESET FORM
========================= */
function resetForm() {
  editingId = null;
  form.reset();
}

/* =========================
   INIT
========================= */
loadPosts();
