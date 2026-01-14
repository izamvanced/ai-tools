import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("savePost");

  if (!btn) {
    console.error("Tombol savePost tidak ditemukan");
    return;
  }

  btn.addEventListener("click", async () => {
    const title = document.getElementById("title").value.trim();
    const content = document.getElementById("content").value.trim();

    if (!title || !content) {
      alert("Judul dan konten wajib diisi");
      return;
    }

    await addDoc(collection(db, "posts"), {
      title,
      content,
      status: "draft",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    alert("Post tersimpan");

    document.getElementById("title").value = "";
    document.getElementById("content").value = "";
  });
});
