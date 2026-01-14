import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

document.getElementById("savePost").onclick = async () => {
  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;

  await addDoc(collection(db, "posts"), {
    title,
    content,
    status: "draft",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  alert("Post tersimpan");
};
