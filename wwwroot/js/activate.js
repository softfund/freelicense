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

/*
async function onActivateLoad() {
    let form = document.getElementById("activate-form");
    if (!form)
        form = document.getElementById("download-form");
    if (!form)
        return;

    window.onActivate = function (captchaToken) {
        // Start async operation - no reCAPTCHA reset needed for activation
        const formData = new FormData(form);
        var action = formData.get("action");

        if (action === "register") {
            performActivation(formData, captchaToken).then(() => {
                try {
                    // grecaptcha.reset();
                }
                catch (error) {
                    console.warn("Captcha reset failed:", error);
                }
            });
        }

        if (action === "download") {
            performDownload(formData, captchaToken).then(() => {
                try {
                    // grecaptcha.reset();
                }
                catch (error) {
                    console.warn("Captcha reset failed:", error);
                }
            });
        }
    };

    // Prevent native form submission and trigger reCAPTCHA
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        onActivate();
        //  grecaptcha.execute(); don't use captcha
    });
}
*/
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
            alert("Не вдалося виконати активацію. Status: " + response.status);
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
        console.error("Activation error:", err);
        alert("Сталася помилка під час активації.");
        throw err; // Re-throw so .catch() in onActivate can handle it
    }
}

async function performDownload(form, captchaToken) {
    try {
        const jwt = localStorage.getItem("jwt");
        // console.log("JWT token:", jwt ? "present" : "missing");
        const headers = jwt ? { "Authorization": "Bearer " + jwt } : {};
        var resp = await fetch("/api/download?version=${version}", { method: "POST", headers: headers, body: formData });
        if (!resp.ok) { alert("Не вдалося завантажити програму."); return; }
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "${version}.zip"; // your file name
        a.click();
        URL.revokeObjectURL(url);
    }
    catch (err) {
        console.error("Download error:", err);
        alert("Сталася помилка під час завантаження.");
        throw err; // Re-throw so .catch() in onActivate can handle it
    }
}

