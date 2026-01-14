import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDIts39eYziTvJUVAvun91dIZRNjRO8Qes",
  authDomain: "ai-tools-library-ac10c.firebaseapp.com",
  projectId: "ai-tools-library-ac10c",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);





