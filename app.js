
/* =====================================
   FIRESTORE REST API
   PROJECT: text-editor-new
===================================== */

const PROJECT_ID = "text-editor-new";

const API_KEY = "AIzaSyC_OwRDRacM80qvexCP_SzHU4UHUrga2XA";

const DOCUMENT_URL =
    `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/shared/note`;

const API_URL =
    `${DOCUMENT_URL}?key=${encodeURIComponent(API_KEY)}`;


/* HTML ELEMENTS */

const textarea = document.getElementById("message");
const saveBtn = document.getElementById("saveBtn");
const refreshBtn = document.getElementById("refreshBtn");
const copyBtn = document.getElementById("copyBtn");
const status = document.getElementById("status");


/* STATUS */

function showStatus(message) {
    status.textContent = message;
}


/* API RESPONSE */

async function checkResponse(response) {

    if (response.ok) return;

    let message = `HTTP ${response.status}`;

    try {
        const data = await response.json();
        message = data.error?.message || message;
    } catch (error) {}

    throw new Error(message);
}


/* =====================================
   LOAD TEXT
===================================== */

async function loadText() {

    try {

        refreshBtn.disabled = true;
        refreshBtn.textContent = "⏳ Yükleniyor...";

        const response = await fetch(API_URL, {
            method: "GET",
            cache: "no-store"
        });

        if (response.status === 404) {

            const errorData = await response.clone().json().catch(() => ({}));
            const errorMessage = errorData.error?.message || "";

            if (errorMessage.toLowerCase().includes("document")) {
                textarea.value = "";
                showStatus("Henüz kayıtlı metin yok");
                return;
            }
        }

        await checkResponse(response);

        const data = await response.json();

        textarea.value =
            data.fields?.text?.stringValue || "";

        showStatus("✓ Metin yüklendi");

    }

    catch (error) {

        console.error("LOAD ERROR:", error);

        showStatus("⚠ Yükleme hatası: " + error.message);

    }

    finally {

        refreshBtn.disabled = false;
        refreshBtn.textContent = "🔄 Yenile";

    }

}


/* =====================================
   SAVE TEXT
===================================== */

async function saveText() {

    try {

        saveBtn.disabled = true;
        saveBtn.textContent = "⏳ Kaydediliyor...";

        const url = new URL(DOCUMENT_URL);

        url.searchParams.set("key", API_KEY);

        url.searchParams.append(
            "updateMask.fieldPaths",
            "text"
        );

        url.searchParams.append(
            "updateMask.fieldPaths",
            "updatedAt"
        );

        const response = await fetch(url.toString(), {

            method: "PATCH",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                fields: {

                    text: {
                        stringValue: textarea.value
                    },

                    updatedAt: {
                        timestampValue: new Date().toISOString()
                    }

                }

            })

        });

        await checkResponse(response);

        showStatus("✓ Başarıyla kaydedildi");

    }

    catch (error) {

        console.error("SAVE ERROR:", error);

        showStatus("⚠ Kaydetme hatası: " + error.message);

    }

    finally {

        saveBtn.disabled = false;
        saveBtn.textContent = "💾 Kaydet";

    }

}


/* =====================================
   COPY TEXT
===================================== */

async function copyText() {

    try {

        await navigator.clipboard.writeText(textarea.value);

        copyBtn.textContent = "✓ Kopyalandı";

        setTimeout(() => {

            copyBtn.textContent = "📋 Kopyala";

        }, 1500);

    }

    catch (error) {

        console.error("COPY ERROR:", error);

        showStatus("⚠ Kopyalama başarısız");

    }

}


/* =====================================
   BUTTON EVENTS
===================================== */

saveBtn.addEventListener("click", saveText);

refreshBtn.addEventListener("click", loadText);

copyBtn.addEventListener("click", copyText);


/* =====================================
   INITIAL LOAD
===================================== */

loadText();
