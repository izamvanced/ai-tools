import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let editingPostId = null;

const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const statusInput = document.getElementById("status");
const saveBtn = document.getElementById("savePost");
const postList = document.getElementById("postList");
const editInfo = document.getElementById("editInfo");

/* =====================
   LOAD POSTS
===================== */
async function loadPosts(){
  postList.innerHTML = "Loading…";

  const q = query(
    collection(db, "posts"),
    orderBy("updatedAt", "desc")
  );

  const snap = await getDocs(q);
  postList.innerHTML = "";

  snap.forEach(docSnap=>{
    const data = docSnap.data();
    const div = document.createElement("div");
    div.className = "post-item";

    div.innerHTML = `
      <strong>${data.title}</strong><br>
      <small>${data.status}</small>
    `;

    div.onclick = () => loadToForm(docSnap.id, data);
    postList.appendChild(div);
  });
}

/* =====================
   LOAD TO FORM
===================== */
function loadToForm(id, data){
  editingPostId = id;
  titleInput.value = data.title || "";
  contentInput.value = data.content || "";
  statusInput.value = data.status || "draft";
  editInfo.style.display = "block";
  window.scrollTo({top:0,behavior:"smooth"});
}

/* =====================
   SAVE POST
===================== */
saveBtn.addEventListener("click", async ()=>{
  const title = titleInput.value.trim();
  const content = contentInput.value.trim();
  const status = statusInput.value;

  if(!title || !content){
    alert("Judul dan konten wajib diisi");
    return;
  }

  const payload = {
    title,
    content,
    status,
    updatedAt: serverTimestamp()
  };

  if(editingPostId){
    await updateDoc(doc(db,"posts",editingPostId), payload);
    editingPostId = null;
    editInfo.style.display = "none";
  }else{
    await addDoc(collection(db,"posts"), {
      ...payload,
      createdAt: serverTimestamp()
    });
  }

  titleInput.value = "";
  contentInput.value = "";
  statusInput.value = "draft";

  loadPosts();
});

/* =====================
   INIT
===================== */
loadPosts();
