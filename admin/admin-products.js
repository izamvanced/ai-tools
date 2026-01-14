import {
  db,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp
} from "./firebase.js";

console.log("ADMIN PRODUCTS JS LOADED");

document.addEventListener("DOMContentLoaded", () => {
  alert("ADMIN PRODUCTS READY");

  const nameInput = document.getElementById("name");
  const slugInput = document.getElementById("slug");
  const saveBtn = document.getElementById("saveProduct");

  saveBtn.addEventListener("click", async () => {
    if (!nameInput.value || !slugInput.value) {
      alert("Nama & slug wajib");
      return;
    }

    await addDoc(collection(db, "products"), {
      name: nameInput.value,
      slug: slugInput.value,
      status: "active",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    alert("PRODUCT SAVED");
  });
});
