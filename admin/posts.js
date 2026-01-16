<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Admin – Post Manager</title>

<style>
:root{
  --bg:#f4f7fb;
  --card:#ffffff;
  --accent:#ff8a1f;
  --text:#111;
  --success:#22c55e;
  --danger:#ef4444;
}
*{box-sizing:border-box}
body{
  margin:0;
  padding:28px 20px 60px;
  background:var(--bg);
  font-family:system-ui,-apple-system,Segoe UI,Roboto;
}
.container{max-width:820px;margin:auto}
h1{color:var(--accent)}

.card{
  background:#fff;
  border-radius:18px;
  padding:20px;
  margin-bottom:22px;
  box-shadow:0 10px 25px rgba(0,0,0,.06);
}
label{font-size:13px;font-weight:600;margin-top:10px;display:block}
input,textarea,select{
  width:100%;padding:12px;border-radius:12px;border:1px solid #ddd
}
textarea{min-height:120px}

button{
  width:100%;margin-top:12px;padding:14px;
  border:none;border-radius:14px;font-weight:700;cursor:pointer
}
.primary{background:var(--accent);color:#fff}
.secondary{background:#111;color:#fff}
.muted{background:#9ca3af;color:#fff}

.badge{
  padding:4px 10px;font-size:11px;border-radius:999px;color:#fff
}
.badge.published{background:var(--success)}
.badge.draft{background:#64748b}

.post-item{
  background:#f9fafb;border-radius:14px;padding:14px;
  margin-bottom:10px;display:flex;justify-content:space-between
}

.toast{
  position:fixed;bottom:24px;left:50%;
  transform:translateX(-50%);
  padding:12px 18px;border-radius:12px;color:#fff;
  opacity:0;transition:.3s
}
.toast.show{opacity:1}
.toast.success{background:var(--success)}
.toast.error{background:var(--danger)}
</style>
</head>

<body>
<div class="container">

<h1>Post Manager</h1>

<!-- FORM -->
<div class="card">
  <h2 id="modeTitle">➕ Create New Post</h2>

  <label>Judul *</label>
  <input id="title">

  <label>Konten *</label>
  <textarea id="content"></textarea>

  <label>Status</label>
  <select id="status">
    <option value="draft">Draft</option>
    <option value="published">Published</option>
  </select>

  <button class="primary" id="saveBtn">Save Post</button>
  <button class="muted" id="cancelBtn">Cancel Edit</button>
</div>

<!-- LIST -->
<div class="card">
  <h2>Post List</h2>
  <div id="postList"></div>
</div>

</div>

<div id="toast" class="toast"></div>

<!-- AUTH -->
<script type="module" src="./auth.js"></script>

<!-- POSTS LOGIC -->
<script type="module">
import { db } from "../firebase-public.js";
import {
  collection, addDoc, getDocs,
  updateDoc, deleteDoc, doc,
  query, orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const titleEl = document.getElementById("title");
const contentEl = document.getElementById("content");
const statusEl = document.getElementById("status");
const postList = document.getElementById("postList");
const toast = document.getElementById("toast");

let editId = null;

function toastMsg(msg,type="success"){
  toast.textContent=msg;
  toast.className=`toast show ${type}`;
  setTimeout(()=>toast.className="toast",2500);
}

/* ======================
   LOAD POSTS
====================== */
async function loadPosts(){
  postList.innerHTML="Memuat...";
  const q=query(collection(db,"posts"),orderBy("time","desc"));
  const snap=await getDocs(q);

  postList.innerHTML="";
  snap.forEach(d=>{
    const p=d.data();
    postList.innerHTML+=`
      <div class="post-item">
        <div>
          <strong>${p.title||"(tanpa judul)"}</strong><br>
          <span class="badge ${p.status}">${p.status}</span>
        </div>
        <div>
          <button onclick="editPost('${d.id}')">Edit</button>
          <button onclick="delPost('${d.id}')">Delete</button>
        </div>
      </div>
    `;
  });
}

/* ======================
   SAVE POST (FIXED)
====================== */
document.getElementById("saveBtn").onclick=async()=>{
  if(!titleEl.value||!contentEl.value){
    toastMsg("Judul & konten wajib","error");return;
  }

  const payload={
    title:titleEl.value,
    content:contentEl.value,
    status:statusEl.value,
    time:Date.now() // 🔥 KRUSIAL UNTUK HOMEPAGE
  };

  try{
    if(editId){
      await updateDoc(doc(db,"posts",editId),payload);
      toastMsg("Post diperbarui");
    }else{
      await addDoc(collection(db,"posts"),payload);
      toastMsg("Post dibuat");
    }
    reset();
    loadPosts();
  }catch(e){
    console.error(e);
    toastMsg("Gagal menyimpan","error");
  }
};

/* ======================
   EDIT / DELETE
====================== */
window.editPost=async id=>{
  const snap=await getDocs(collection(db,"posts"));
  snap.forEach(d=>{
    if(d.id===id){
      const p=d.data();
      titleEl.value=p.title||"";
      contentEl.value=p.content||"";
      statusEl.value=p.status||"draft";
      editId=id;
      document.getElementById("modeTitle").textContent="✏️ Edit Post";
    }
  });
};

window.delPost=async id=>{
  if(confirm("Hapus post ini?")){
    await deleteDoc(doc(db,"posts",id));
    toastMsg("Post dihapus");
    loadPosts();
  }
};

document.getElementById("cancelBtn").onclick=reset;

function reset(){
  editId=null;
  titleEl.value="";
  contentEl.value="";
  statusEl.value="draft";
  document.getElementById("modeTitle").textContent="➕ Create New Post";
}

loadPosts();
</script>

</body>
</html>
