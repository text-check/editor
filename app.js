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

const noteRef = doc(db, "shared", "note");

const textarea = document.getElementById("message");
const preview = document.getElementById("preview");
const saveBtn = document.getElementById("saveBtn");
const copyBtn = document.getElementById("copyBtn");
const status = document.getElementById("status");

let currentText = "";

onSnapshot(noteRef, (snapshot) => {

    if (!snapshot.exists()) return;

    currentText = snapshot.data().text || "";

    preview.textContent = currentText;

    if (document.activeElement !== textarea) {
        textarea.value = currentText;
    }

});

saveBtn.onclick = async () => {

    try{

        await setDoc(noteRef,{

            text:textarea.value,
            updatedAt:serverTimestamp()

        });

        status.textContent="✓ Kaydedildi";

        setTimeout(()=>{

            status.textContent="";

        },2000);

    }
    catch(e){

        status.textContent=e.message;

    }

};

copyBtn.onclick = async()=>{

    await navigator.clipboard.writeText(currentText);

    copyBtn.textContent="✓ Kopyalandı";

    setTimeout(()=>{

        copyBtn.textContent="📋 Kopyala";

    },1500);

};

preview.onclick = ()=>copyBtn.click();
