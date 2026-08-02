import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
  getFirestore,
  doc,
  setDoc,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBO33H0nxCOXNuXCAF8Lu_GphV_hqXPn4w",
  authDomain: "text-editor-1eaa1.firebaseapp.com",
  projectId: "text-editor-1eaa1",
  storageBucket: "text-editor-1eaa1.firebasestorage.app",
  messagingSenderId: "253493624403",
  appId: "1:253493624403:web:8bcbdd54b6809b435a90a6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const textarea = document.getElementById("message");
const saveBtn = document.getElementById("saveBtn");

const noteRef = doc(db, "shared", "note");

// Firestore'daki notu sürekli dinle
onSnapshot(noteRef, (snapshot) => {
  if (snapshot.exists()) {
    textarea.value = snapshot.data().text || "";
  } else {
    textarea.value = "";
  }
});

// Kaydet
saveBtn.onclick = async () => {
  await setDoc(noteRef, {
    text: textarea.value,
    updatedAt: serverTimestamp()
  });

  alert("Kaydedildi.");
};
