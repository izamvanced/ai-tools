import { db } from "./firebase.js";
import {
  collection, addDoc, getDocs,
  updateDoc, deleteDoc, doc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const titleEl = title;
const contentEl = content;
const statusEl = status;
const saveBtnEl = saveBtn;
const cancelBtnEl = cancelBtn;
const previewBtnEl = previewBtn;
const listEl = postList;
const searchEl = search;
const modeTitleEl = modeTitle;
const toastEl = toast;

let editingId = null;
let cache = [];

const toastMsg = (m,t="success")=>{
  toastEl.textContent = m;
  toastEl.className = `toast show ${t}`;
  setTimeout(()=>toastEl.className="toast",2200);
};

/* CANCEL */
cancelBtnEl.onclick = ()=>{
  editingId=null;
  modeTitleEl.textContent="➕ Create New Post";
  titleEl.value="";
  contentEl.value="";
  statusEl.value="draft";
};

/* PREVIEW */
previewBtnEl.onclick = ()=>{
  if(!titleEl.value){
    toastMsg("Judul belum diisi","error"); return;
  }
  const html = `
    <html><head><title>Preview</title></head>
    <body style="font-family:system-ui;padding:20px">
      <h1>${titleEl.value}</h1>
      <div>${contentEl.value.replace(/\n/g,"<br>")}</div>
    </body></html>`;
  const blob = new Blob([html],{type:"text/html"});
  window.open(URL.createObjectURL(blob),"_blank");
};

/* SAVE */
saveBtnEl.onclick = async ()=>{
  if(!titleEl.value||!contentEl.value){
    toastMsg("Judul & konten wajib diisi","error"); return;
  }

  saveBtnEl.disabled=true;
  saveBtnEl.textContent="Saving…";

  const payload={
    title:titleEl.value.trim(),
    content:contentEl.value.trim(),
    status:statusEl.value,
    updatedAt:serverTimestamp()
  };

  try{
    if(editingId){
      await updateDoc(doc(db,"posts",editingId),payload);
      toastMsg("Post diperbarui");
    }else{
      payload.createdAt=serverTimestamp();
      await addDoc(collection(db,"posts"),payload);
      toastMsg("Post disimpan");
    }
    cancelBtnEl.onclick();
    await load();
  }catch(e){
    console.error(e);
    toastMsg("Gagal menyimpan","error");
  }

  saveBtnEl.disabled=false;
  saveBtnEl.textContent="Save Post";
};

/* DELETE */
window.del = async id=>{
  if(!confirm("Yakin hapus post ini?")) return;
  await deleteDoc(doc(db,"posts",id));
  toastMsg("Post dihapus");
  load();
};

/* EDIT */
window.edit = (p,id)=>{
  editingId=id;
  modeTitleEl.textContent=`✏️ Editing: ${p.title}`;
  titleEl.value=p.title;
  contentEl.value=p.content;
  statusEl.value=p.status;
};

/* LOAD */
async function load(){
  const snap=await getDocs(collection(db,"posts"));
  cache=snap.docs.map(d=>({id:d.id,...d.data()}));
  render(cache);
}

/* RENDER */
function render(arr){
  listEl.innerHTML="";
  arr.forEach(p=>{
    const d=document.createElement("div");
    d.className="post-item";
    d.innerHTML=`
      <div>
        <strong>${p.title}</strong>
        <span class="badge ${p.status}">${p.status.toUpperCase()}</span>
      </div>
      <div class="actions">
        <button onclick='edit(${JSON.stringify(p).replace(/'/g,"")},"${p.id}")'>
          Edit
        </button>
        <button style="background:#ef4444" onclick="del('${p.id}')">
          Delete
        </button>
      </div>`;
    listEl.appendChild(d);
  });
}

/* SEARCH */
searchEl.oninput = ()=>{
  const q = searchEl.value.toLowerCase();
  render(cache.filter(p=>p.title.toLowerCase().includes(q)));
};

load();
