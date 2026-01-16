// admin/posts.js
// POST MANAGER — CREATE / EDIT / DELETE
// SINGLE SOURCE OF TRUTH: field `time`

import { db } from "/ai-tools/firebase-public.js";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* =========================
   ELEMENTS
========================= */
const titleEl   = document.getElementById("title");
const contentEl = document.getElementById("content");
const statusEl  = document.getElementById("status");
const postList  = document.getElementById("postList");
const toast     = document.getElementById("toast");
const modeTitle = document.getElementById("modeTitle");
const saveBtn   = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");

let editId = null;

/* =========================
   TOAST
========================= */
function showToast(msg, type = "success") {
  toast.textContent = msg;
  toast.className = `toast show ${type}`;
  setTimeout(() => (toast.className = "toast"), 2500);
}

/* =========================
   LOAD POSTS (ADMIN)
========================= */
async function loadPosts() {
  postList.innerHTML = "Memuat post...";

  try {
    const q = query(
      collection(db, "posts"),
      orderBy("time", "desc")
    );

    const snap = await getDocs(q);
    postList.innerHTML = "";

    if (snap.empty) {
      postList.innerHTML = "<p>Tidak ada post.</p>";
      return;
    }

    snap.forEach(d => {
      const p = d.data();

      postList.innerHTML += `
        <div class="post-item">
          <div>
            <strong>${p.title || "(tanpa judul)"}</strong><br>
            <span class="badge ${p.status}">${p.status}</span>
          </div>
          <div class="actions">
            <button data-edit="${d.id}">Edit</button>
            <button data-del="${d.id}">Delete</button>
          </div>
        </div>
      `;
    });

  } catch (err) {
    console.error("LOAD ERROR:", err);
    postList.innerHTML = "<p>Gagal memuat post.</p>";
  }
}

/* =========================
   SAVE POST (CREATE / EDIT)
========================= */
saveBtn.addEventListener("click", async () => {
  if (!titleEl.value || !contentEl.value) {
    showToast("Judul & konten wajib diisi", "error");
    return;
  }

  const now = Date.now();

  const payload = {
    title: titleEl.value.trim(),
    content: contentEl.value.trim(),
    status: statusEl.value,
    time: now // 🔒 KRUSIAL UNTUK HOMEPAGE
  };

  try {
    if (editId) {
      await updateDoc(doc(db, "posts", editId), payload);
      showToast("Post diperbarui");
    } else {
      await addDoc(collection(db, "posts"), payload);
      showToast("Post dibuat");
    }

    resetForm();
    loadPosts();

  } catch (err) {
    console.error("SAVE ERROR:", err);
    showToast("Gagal menyimpan post", "error");
  }
});

/* =========================
   CLICK HANDLER (EDIT / DELETE)
========================= */
postList.addEventListener("click", async (e) => {
  const edit = e.target.dataset.edit;
  const del  = e.target.dataset.del;

  if (edit) {
    const snap = await getDocs(collection(db, "posts"));
    snap.forEach(d => {
      if (d.id === edit) {
        const p = d.data();
        editId = edit;
        titleEl.value   = p.title || "";
        contentEl.value = p.content || "";
        statusEl.value  = p.status || "draft";
        modeTitle.textContent = "✏️ Edit Post";
      }
    });
  }

  if (del) {
    if (confirm("Hapus post ini?")) {
      await deleteDoc(doc(db, "posts", del));
      showToast("Post dihapus");
      loadPosts();
    }
  }
});

/* =========================
   RESET
========================= */
cancelBtn.addEventListener("click", resetForm);

function resetForm() {
  editId = null;
  titleEl.value = "";
  contentEl.value = "";
  statusEl.value = "draft";
  modeTitle.textContent = "➕ Create New Post";
}

/* =========================
   INIT
========================= */
loadPosts();
