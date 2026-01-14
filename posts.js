import { db } from "./firebase-public.js";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("posts");

  container.innerHTML = "Loading...";

  const q = query(
    collection(db, "posts"),
    where("status", "==", "published"),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);
  container.innerHTML = "";

  if (snapshot.empty) {
    container.innerHTML = "<p>Belum ada konten.</p>";
    return;
  }

  snapshot.forEach((doc) => {
    const data = doc.data();
    const article = document.createElement("article");

    article.style.borderBottom = "1px solid #e5e7eb";
    article.style.padding = "16px 0";

    article.innerHTML = `
      <h2>${data.title}</h2>
      <p>${data.content}</p>
    `;

    container.appendChild(article);
  });
});
