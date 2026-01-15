document.addEventListener("DOMContentLoaded", () => {
  const postList = document.getElementById("postList");
  postList.innerHTML = `
    <div class="post-item">
      <h3>TEST POST</h3>
      <p>Ini test tanpa Firebase</p>
    </div>
  `;
});
