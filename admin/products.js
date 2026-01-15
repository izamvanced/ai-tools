import { db } from "./firebase.js";
import {
  collection, addDoc, getDocs, updateDoc, deleteDoc, doc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const nameEl=name, slugEl=slug, summaryEl=summary, imagesEl=images, statusEl=status;
const saveBtnEl=saveBtn, cancelBtnEl=cancelBtn, listEl=productList, searchEl=search;
const modeTitleEl=modeTitle, toastEl=toast, genPathEl=genPath, imgFileEl=imgFile;
const previewBtnEl=previewBtn;

let editingId=null, cache=[];

const toast=(m,t="success")=>{
  toastEl.textContent=m; toastEl.className=`toast show ${t}`;
  setTimeout(()=>toastEl.className="toast",2200);
};

genPathEl.onclick=()=>{
  if(!slugEl.value||!imgFileEl.value) return;
  imagesEl.value=`/assets/products/${slugEl.value}/${imgFileEl.value}`;
};

cancelBtnEl.onclick=()=>{
  editingId=null; modeTitleEl.textContent="➕ Create New Product";
  nameEl.value=slugEl.value=summaryEl.value=imagesEl.value="";
  statusEl.value="draft";
};

previewBtnEl.onclick=()=>{
  if(!slugEl.value){ toast("Slug belum diisi","error"); return; }
  window.open(`../product.html?slug=${slugEl.value}`,"_blank");
};

saveBtnEl.onclick=async()=>{
  if(!nameEl.value||!slugEl.value||!summaryEl.value){
    toast("Field wajib belum lengkap","error"); return;
  }
  if(statusEl.value==="active" && !imagesEl.value){
    if(!confirm("Produk belum punya gambar. Tetap aktifkan?")) return;
  }
  saveBtnEl.disabled=true; saveBtnEl.textContent="Saving…";
  const payload={
    name:nameEl.value.trim(), slug:slugEl.value.trim(),
    summary:summaryEl.value.trim(),
    images:imagesEl.value.split("\n").filter(Boolean),
    status:statusEl.value, updatedAt:serverTimestamp()
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
    cancelBtnEl.onclick(); await load();
  }catch(e){ console.error(e); toast("Gagal menyimpan","error"); }
  saveBtnEl.disabled=false; saveBtnEl.textContent="Save Product";
};

window.del=async(id)=>{
  if(!confirm("Yakin hapus produk ini?")) return;
  await deleteDoc(doc(db,"products",id)); toast("Produk dihapus"); load();
};

window.edit=(p,id)=>{
  editingId=id; modeTitleEl.textContent=`✏️ Editing: ${p.name}`;
  nameEl.value=p.name; slugEl.value=p.slug; summaryEl.value=p.summary;
  imagesEl.value=(p.images||[]).join("\n"); statusEl.value=p.status;
};

async function load(){
  const snap=await getDocs(collection(db,"products"));
  cache=snap.docs.map(d=>({id:d.id,...d.data()})); render(cache);
}
function render(arr){
  listEl.innerHTML="";
  arr.forEach(p=>{
    const d=document.createElement("div"); d.className="product-item";
    d.innerHTML=`
      <div>
        <strong>${p.name}</strong>
        <span class="badge ${p.status}">${p.status.toUpperCase()}</span>
      </div>
      <div class="actions">
        <button onclick='edit(${JSON.stringify(p).replace(/'/g,"")},"${p.id}")'>Edit</button>
        <button style="background:#ef4444" onclick="del('${p.id}')">Delete</button>
      </div>`;
    listEl.appendChild(d);
  });
}
searchEl.oninput=()=>render(cache.filter(p=>p.name.toLowerCase().includes(searchEl.value.toLowerCase())));
load();
