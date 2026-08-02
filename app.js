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
const saveBtn = document.getElementById("saveBtn");
const status = document.getElementById("status");

const preview = document.getElementById("preview");
const copyBtn = document.getElementById("copyBtn");

let currentText = "";

onSnapshot(noteRef, (snapshot) => {

    if (!snapshot.exists()) return;

    currentText = snapshot.data().text || "";

    if (preview)
        preview.textContent = currentText;

    if (textarea && document.activeElement !== textarea)
        textarea.value = currentText;

});

if(saveBtn){

    saveBtn.onclick = async()=>{

        try{

            await setDoc(noteRef,{

                text:textarea.value,
                updatedAt:serverTimestamp()

            });

            status.textContent="✓ Kaydedildi";

            setTimeout(()=>{

                status.textContent="";

            },1500);

        }
        catch(e){

            status.textContent=e.message;

        }

    };

}

async function copy(){

    await navigator.clipboard.writeText(currentText);

    copyBtn.textContent="✓ Kopyalandı";

    setTimeout(()=>{

        copyBtn.textContent="📋 Kopyala";

    },1500);

}

if(copyBtn){

    copyBtn.onclick=copy;

}

if(preview){

    preview.onclick=copy;

}
