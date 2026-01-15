import { db } from "./firebase.js";
import {
  collection, addDoc, getDocs,
  updateDoc, deleteDoc, doc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ELEMENTS */
const nameEl = name;
const slugEl = slug;
const summaryEl = summary;
const imagesEl = images;
const statusEl = status;
const saveBtn = saveBtn;
const cancelBtn = cancelBtn;
const listEl = productList;
const searchEl = search;
const modeTitle = modeTitle;
const toastEl = toast;
const genPath = document.getElementById("genPath");
const imgFile = document.getElementById("imgFile");

let editingId = null;
let cache = [];

/* TOAST */
function toast(msg,type="success"){
  toastEl.textContent = msg;
  toastEl.className = `toast show ${type}`;
  setTimeout(()=>toastEl.className="toast",2200);
}

/* IMAGE HELPER */
genPath.onclick = ()=>{
  if(!slugEl.value||!imgFile.value) return;
  imagesEl.value = `/assets/products/${slugEl.value}/${imgFile.value}`;
};

/* CANCEL */
cancelBtn.onclick = ()=>{
  editingId=null;
  modeTitle.textContent="➕ Create New Product";
  nameEl.value=slugEl.value=summaryEl.value=imagesEl.value="";
  statusEl.value="draft";
};

/* SAVE */
saveBtn.onclick = async ()=>{
  if(!nameEl.value||!slugEl.value||!summaryEl.value){
    toast("Field wajib belum lengkap","error");
    return;
  }

  if(statusEl.value==="active" && !imagesEl.value){
    if(!confirm("Produk belum punya gambar. Tetap aktifkan?")) return;
  }

  saveBtn.disabled=true;
  saveBtn.textContent="Saving…";

  const payload={
    name:nameEl.value.trim(),
    slug:slugEl.value.trim(),
    summary:summaryEl.value.trim(),
    images:imagesEl.value.split("\n").filter(Boolean),
    status:statusEl.value,
    updatedAt:serverTimestamp()
  };

  try{
    if(editingId){
      await updateDoc(doc(db,"products",editingId),payload);
      toast("Produk diperbarui");
    }else{
      payload.createdAt=serverTimestamp();
      await addDoc(collection(db,"products"),payload);
      toast("Produk disimpan");
    }
    cancelBtn.onclick();
    load();
  }catch(e){
    console.error(e);
    toast("Gagal menyimpan","error");
  }

  saveBtn.disabled=false;
  saveBtn.textContent="Save Product";
};

/* DELETE */
window.del = async id=>{
  if(!confirm("Yakin hapus produk ini?")) return;
  await deleteDoc(doc(db,"products",id));
  toast("Produk dihapus");
  load();
};

/* LOAD */
async function load(){
  const snap=await getDocs(collection(db,"products"));
  cache=snap.docs.map(d=>({id:d.id,...d.data()}));
  render(cache);
}

/* RENDER */
function render(arr){
  listEl.innerHTML="";
  arr.forEach(p=>{
    const div=document.createElement("div");
    div.className="product-item";
    div.innerHTML=`
      <div>
        <strong>${p.name}</strong>
        <span class="badge ${p.status}">${p.status.toUpperCase()}</span>
      </div>
      <div class="actions">
        <button onclick='edit(${JSON.stringify(p).replace(/'/g,"")},"${p.id}")'>Edit</button>
        <button style="background:#ef4444" onclick="del('${p.id}')">Delete</button>
      </div>`;
    listEl.appendChild(div);
  });
}

/* EDIT */
window.edit = (p,id)=>{
  editingId=id;
  modeTitle.textContent=`✏️ Editing: ${p.name}`;
  nameEl.value=p.name;
  slugEl.value=p.slug;
  summaryEl.value=p.summary;
  imagesEl.value=(p.images||[]).join("\n");
  statusEl.value=p.status;
};

/* SEARCH */
searchEl.oninput=()=>{
  const q=searchEl.value.toLowerCase();
  render(cache.filter(p=>p.name.toLowerCase().includes(q)));
};

load();    } else {
      await addDoc(collection(db, "products"), {
        ...payload,
        createdAt: serverTimestamp()
      });
    }

    showToast("Produk berhasil disimpan", "success");
    resetForm();
    loadProducts();

  } catch (e) {
    console.error(e);
    showToast("Gagal menyimpan produk", "error");
  }

  setButtonState(saveBtn, "idle", "Save Product");
};

/* ===== RESET ===== */
function resetForm() {
  editingId = null;
  nameInput.value = "";
  slugInput.value = "";
  summaryInput.value = "";
  imagesInput.value = "";
  statusInput.value = "inactive";
  preview.innerHTML = "";
  modeEl.textContent = "➕ Create New Product";
}

/* INIT */
loadProducts();
