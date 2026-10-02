
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
const copyBtn = document.getElementById("copyBtn");
const status = document.getElementById("status");


let currentText = "";


/* FIREBASE'DEN METNİ DİNLE */

onSnapshot(noteRef, (snapshot) => {

    if (!snapshot.exists()) {
        return;
    }

    currentText = snapshot.data().text || "";

    /*
     * Kullanıcı şu anda textarea'ya yazmıyorsa
     * Firebase'deki güncel metni göster.
     */
    if (document.activeElement !== textarea) {
        textarea.value = currentText;
    }

});


/* KAYDET */

saveBtn.addEventListener("click", async () => {

    try {

        saveBtn.disabled = true;
        saveBtn.textContent = "⏳ Kaydediliyor...";

        const text = textarea.value;

        await setDoc(noteRef, {

            text: text,
            updatedAt: serverTimestamp()

        });

        currentText = text;

        status.textContent = "✓ Kaydedildi";

        setTimeout(() => {
            status.textContent = "";
        }, 1500);

    }

    catch (error) {

        console.error(error);

        status.textContent = "⚠ Bir hata oluştu";

    }

    finally {

        saveBtn.disabled = false;
        saveBtn.textContent = "💾 Kaydet";

    }

});


/* KOPYALA */

copyBtn.addEventListener("click", async () => {

    try {

        await navigator.clipboard.writeText(textarea.value);

        copyBtn.textContent = "✓ Kopyalandı";

        setTimeout(() => {

            copyBtn.textContent = "📋 Kopyala";

        }, 1500);

    }

    catch (error) {

        console.error(error);

        status.textContent = "⚠ Kopyalama başarısız";

    }

});
