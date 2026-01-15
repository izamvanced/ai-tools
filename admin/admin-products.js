import {
  db, collection, addDoc, serverTimestamp
} from "./firebase.js";

document.addEventListener("click", async (e) => {
  if (e.target.id !== "saveProduct") return;

  const name = document.getElementById("name").value.trim();
  const slug = document.getElementById("slug").value.trim();
  const summary = document.getElementById("summary").value.trim();

  if (!name || !slug) {
    alert("Nama & slug wajib");
    return;
  }

  await addDoc(collection(db, "products"), {
    name,
    slug,
    summary,
    featured: true,
    status: "active",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  // reset ringan
  document.getElementById("name").value = "";
  document.getElementById("slug").value = "";
  document.getElementById("summary").value = "";
});
