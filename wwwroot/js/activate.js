// Run when ready
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initForms);
} else {
    initForms();
}

function initForms() {
    const toggler = document.getElementById("toggle-placeholder");
    if (toggler) {
        toggler.style.display = "none";
    }

    const activateForm = document.getElementById("activate-form");
    const downloadForm = document.getElementById("download-form");

    if (activateForm)
        bindForm(activateForm, "register");

    if (downloadForm)
        bindForm(downloadForm, "download");
}

/* -----------------------------------------
   Binds submit handler to each form
----------------------------------------- */
function bindForm(form, actionName) {

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const formData = new FormData(form);
        formData.set("action", actionName);

        if (actionName === "register") {
            performActivation(formData, null);
        }

        if (actionName === "download") {
            performDownload(formData, null);
        }
    });
}

async function performActivation(formData, captchaToken) {
    try {        
        const jwt = localStorage.getItem("jwt");
        // console.log("JWT token:", jwt ? "present" : "missing");
        const headers = jwt ? { "Authorization": "Bearer " + jwt } : {};
        // console.log("Sending activation request to /api/activate/uk");
        
        const response = await fetch("/api/activate/uk", {
            method: "POST",
            headers: headers,
            body: formData
        });
        
        console.log("Activation response status:", response.status);


        if (!response.ok) {
            const errorText = await response.text();
            console.error("Activation failed:", response.status, errorText);

            // Handle unauthorized (session expired, no token, etc.)
            if (response.status === 401) {
                window.location.href = "/";   // ⬅️ Redirect to home page
                alert("Час підтвердити ліцензійнй умови.");
            }
            else
            {
                alert("Сталася помилка під час активації. Статус: " + response.status);
            }

            return;
        }
        
        const result = await response.json();
        const codeInput = document.getElementById("activationCode");
        if (codeInput) {
            codeInput.disabled = false;
            codeInput.value = result.activationCode || "";
        }

        console.log("Activation successful!");
        
    } catch (err) {
        throw err; // Re-throw so .catch() in onActivate can handle it
    }
}

async function performDownload(formData, captchaToken) {
    try {
        const jwt = localStorage.getItem("jwt");
        // console.log("JWT token:", jwt ? "present" : "missing");
        const headers = jwt ? { "Authorization": "Bearer " + jwt } : {};
        const version = document.getElementById("version").value.trim();  

        const downloadUrl = `/api/download/uk?version=${encodeURIComponent(version)}`;

        var resp = await fetch(downloadUrl, { method: "GET", headers: headers });
        if (!resp.ok)
        {   
            const errorText = await resp.text();
            console.error("Activation failed:", resp.status, errorText);

            // Handle unauthorized (session expired, no token, etc.)
            if (resp.status === 401) {
                alert("Час підтвердити ліцензійні умови.");
                window.location.href = "/";   // ⬅️ Redirect to home page
            }
            else
            {
                alert("Сталася помилка під час завантаження.");
            }

            return;
        }
        
        const blob = await resp.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${version}.zip`; // your file name
        a.click();
        URL.revokeObjectURL(url);
    }
    catch (err) {
        console.error("Download error:", err);
        throw err; // Re-throw so .catch() in onActivate can handle it
    }
}

