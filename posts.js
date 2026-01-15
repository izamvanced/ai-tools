import {
  db,
  collection,
  getDocs
} from "./firebase-public.js";

const list = document.getElementById("postList");

if (!list) {
  console.error("postList NOT FOUND");
} else {
  loadPosts();
}

async function loadPosts() {
  const snap = await getDocs(collection(db, "posts"));
  list.innerHTML = "";

  snap.forEach(doc => {
    const p = doc.data();
    if (p.status !== "published") return;

    const div = document.createElement("div");
    div.className = "post-item";
    div.innerHTML = `
      <h3>${p.title}</h3>
      <p>${p.content}</p>
    `;
    list.appendChild(div);
  });
}
