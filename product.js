import { db } from "./firebase-public.js";
import {
  collection,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

function getSlug() {
  const params = new URLSearchParams(window.location.search);
  return params.get("slug");
}

document.addEventListener("DOMContentLoaded", async () => {
  const slug = getSlug();
  if (!slug) return;

  const q = query(
    collection(db, "products"),
    where("slug", "==", slug),
    where("status", "==", "active")
  );

  const snapshot = await getDocs(q);
  if (snapshot.empty) return;

  const data = snapshot.docs[0].data();

  document.title = `${data.name} – AI Tools Library`;
  document.getElementById("productName").textContent = data.name;
  document.getElementById("productSummary").textContent = data.summary || "";

  const imageWrap = document.getElementById("productImages");
  (data.images || []).forEach(src => {
    const img = document.createElement("img");
    img.src = src;
    img.loading = "lazy";
    imageWrap.appendChild(img);
  });
});
