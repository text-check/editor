import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
getFirestore,
collection,
addDoc,
query,
orderBy,
limit,
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

const db=getFirestore(app);

const saveBtn=document.getElementById("saveBtn");
const textarea=document.getElementById("message");
const messages=document.getElementById("messages");

saveBtn.onclick=async()=>{

const text=textarea.value.trim();

if(text==="") return;

await addDoc(collection(db,"messages"),{

text,
createdAt:serverTimestamp()

});

textarea.value="";

};

const q=query(
collection(db,"messages"),
orderBy("createdAt","desc"),
limit(5)
);

onSnapshot(q,(snapshot)=>{

messages.innerHTML="";

snapshot.forEach(doc=>{

const div=document.createElement("div");

div.className="card";

div.innerText=doc.data().text;

messages.appendChild(div);

});

});
