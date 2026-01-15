import { db } from "./firebase-public.js";

alert("PRODUCTS.JS + FIREBASE IMPORT OK");

document.addEventListener("DOMContentLoaded", () => {
  alert("DOM READY WITH FIREBASE");

  const grid = document.getElementById("productGrid");
  grid.innerHTML = "<p>Firebase import sukses ✅</p>";
});
