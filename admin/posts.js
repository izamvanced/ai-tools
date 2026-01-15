import { db } from "./firebase.js";
import {
  collection, addDoc, getDocs,
  updateDoc, deleteDoc, doc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ELEMENTS */
const titleEl = title;
const contentEl = content;
const statusEl = status;
const saveBtn = saveBtn;
const cancelBtn = cancelBtn;
const listEl = postList;
const searchEl = search;
const modeTitle = modeTitle;
const toastEl = toast;

let editingId = null;
let cache = [];

/* TOAST */
function toast(msg,type="success"){
  toastEl.textContent = msg;
  toastEl.className = `toast show ${type}`;
  setTimeout(()=>toastEl.className="toast",2200);
}

/* CANCEL */
cancelBtn.onclick = ()=>{
  editingId=null;
  modeTitle.textContent="➕ Create New Post";
  titleEl.value="";
  contentEl.value="";
  statusEl.value="draft";
};

/* SAVE */
saveBtn.onclick = async ()=>{
  if(!titleEl.value||!contentEl.value){
    toast("Judul & konten wajib diisi","error");
    return;
  }

  saveBtn.disabled=true;
  saveBtn.textContent="Saving…";

  const payload={
    title:titleEl.value.trim(),
    content:contentEl.value.trim(),
    status:statusEl.value,
    updatedAt:serverTimestamp()
  };

  try{
    if(editingId){
      await updateDoc(doc(db,"posts",editingId),payload);
      toast("Post diperbarui");
    }else{
      payload.createdAt=serverTimestamp();
      await addDoc(collection(db,"posts"),payload);
      toast("Post disimpan");
    }
    cancelBtn.onclick();
    load();
  }catch(e){
    console.error(e);
    toast("Gagal menyimpan","error");
  }

  saveBtn.disabled=false;
  saveBtn.textContent="Save Post";
};

/* DELETE */
window.del = async id=>{
  if(!confirm("Yakin hapus post ini?")) return;
  await deleteDoc(doc(db,"posts",id));
  toast("Post dihapus");
  load();
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
    const div=document.createElement("div");
    div.className="post-item";
    div.innerHTML=`
      <div>
        <strong>${p.title}</strong>
        <span class="badge ${p.status}">
          ${p.status.toUpperCase()}
        </span>
      </div>
      <div class="actions">
        <button onclick='edit(${JSON.stringify(p).replace(/'/g,"")},"${p.id}")'>
          Edit
        </button>
        <button style="background:#ef4444" onclick="del('${p.id}')">
          Delete
        </button>
      </div>`;
    listEl.appendChild(div);
  });
}

/* EDIT */
window.edit = (p,id)=>{
  editingId=id;
  modeTitle.textContent=`✏️ Editing: ${p.title}`;
  titleEl.value=p.title;
  contentEl.value=p.content;
  statusEl.value=p.status;
};

/* SEARCH */
searchEl.oninput=()=>{
  const q=searchEl.value.toLowerCase();
  render(cache.filter(p=>p.title.toLowerCase().includes(q)));
};

load();
