import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("savePost");

  btn.addEventListener("click", async () => {
    const title = document.getElementById("title").value.trim();
    const content = document.getElementById("content").value.trim();

    if (!title || !content) {
      alert("Judul & konten wajib diisi");
      return;
    }

    try {
      await addDoc(collection(db, "posts"), {
        title,
        content,
        status: "draft",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      document.getElementById("title").value = "";
      document.getElementById("content").value = "";
      alert("Post tersimpan (draft)");
    } catch (err) {
      alert("Gagal menyimpan post");
      console.error(err);
    }
  });
});
