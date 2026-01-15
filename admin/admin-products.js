import {
  db,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp
} from "./firebase.js";

console.log("ADMIN PRODUCTS READY");

// EVENT DELEGATION (AMAN)
document.addEventListener("click", async (e) => {
  if (e.target.id === "saveProduct") {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const slug = document.getElementById("slug").value.trim();
    const summary = document.getElementById("summary").value.trim();

    if (!name || !slug) {
      alert("Nama & slug wajib diisi");
      return;
    }

    await addDoc(collection(db, "products"), {
      name,
      slug,
      summary,
      status: "active",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    alert("PRODUCT SAVED");
  }
});
