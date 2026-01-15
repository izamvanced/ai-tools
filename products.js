alert("PRODUCTS.JS EXECUTED");

document.addEventListener("DOMContentLoaded", () => {
  alert("DOM READY FROM PRODUCTS.JS");

  const el = document.getElementById("productGrid");
  if (!el) {
    alert("productGrid NOT FOUND");
    return;
  }

  el.innerHTML = "<p>PRODUCT GRID FOUND ✅</p>";
});
