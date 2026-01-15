import { db } from "./firebase-public.js";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

console.log("POSTS JS LOADED");

document.addEventListener("DOMContentLoaded", async () => {
  const list = document.getElementById("postList");
  if (!list) return;

  try {
    const q = query(
      collection(db, "posts"),
      where("status", "==", "published"),
      orderBy("title")
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      list.innerHTML = "<p>Belum ada post.</p>";
      return;
    }

    list.innerHTML = "";

    snapshot.forEach(doc => {
      const p = doc.data();

      const item = document.createElement("div");
      item.className = "post-item";

      item.innerHTML = `
        <h3>${p.title}</h3>
        <p>${p.content}</p>
      `;

      list.appendChild(item);
    });

  } catch (err) {
    console.error(err);
    list.innerHTML = "<p>Gagal memuat post.</p>";
  }
});
