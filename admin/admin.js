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

document.addEventListener("DOMContentLoaded", () => {
  const saveBtn = document.getElementById("savePost");
  const postList = document.getElementById("postList");

  async function loadPosts() {
    postList.innerHTML = "Loading...";
    const q = query(
      collection(db, "posts"),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);
    postList.innerHTML = "";

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const div = document.createElement("div");
      div.className = "post";

      const color =
        data.status === "published" ? "#16a34a" : "#eab308";

      div.innerHTML = `
        <strong>${data.title}</strong><br>
        <small>Status:
          <span style="color:${color}">
            ${data.status}
          </span>
        </small><br><br>
        <button data-id="${docSnap.id}" data-status="${data.status}">
          ${data.status === "published" ? "Set Draft" : "Publish"}
        </button>
      `;

      div.querySelector("button").addEventListener("click", async (e) => {
        const id = e.target.dataset.id;
        const current = e.target.dataset.status;
        const next = current === "published" ? "draft" : "published";

        await updateDoc(doc(db, "posts", id), {
          status: next,
          updatedAt: serverTimestamp()
        });

        loadPosts();
      });

      postList.appendChild(div);
    });
  }

  saveBtn.addEventListener("click", async () => {
    const title = document.getElementById("title").value.trim();
    const content = document.getElementById("content").value.trim();

    if (!title || !content) {
      alert("Judul & konten wajib diisi");
      return;
    }

    await addDoc(collection(db, "posts"), {
      title,
      content,
      status: "draft",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    document.getElementById("title").value = "";
    document.getElementById("content").value = "";

    loadPosts();
  });

  loadPosts();
});
