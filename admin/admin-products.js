console.log("ADMIN PRODUCTS JS LOADED");

document.addEventListener("DOMContentLoaded", () => {
  alert("DOM READY");

  const btn = document.getElementById("saveProduct");
  console.log("BUTTON:", btn);

  btn.addEventListener("click", () => {
    alert("SAVE BUTTON CLICKED");
  });
});
