// SAVE POST (CREATE / EDIT)
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = titleInput.value.trim();
  const content = contentInput.value.trim();
  const status = statusInput.value;

  if (!title || !content) {
    alert("Judul dan konten wajib diisi.");
    return;
  }

  const now = Date.now(); // 🔥 SATU SUMBER WAKTU

  try {
    if (editingId) {
      // UPDATE POST
      await updateDoc(doc(db, "posts", editingId), {
        title,
        content,
        status,
        time: now // 🔒 WAJIB
      });
    } else {
      // CREATE POST
      await addDoc(collection(db, "posts"), {
        title,
        content,
        status,
        time: now // 🔒 WAJIB
      });
    }

    resetForm();
    loadPosts();

  } catch (err) {
    console.error(err);
    alert("Gagal menyimpan post.");
  }
});
