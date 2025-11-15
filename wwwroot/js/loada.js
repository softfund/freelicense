if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", wireActivationHandler);
} else {
    wireActivationHandler();
}

function wireActivationHandler() {
    var form = document.getElementById("activate-form");
    if (!form) return;
    form.addEventListener("submit", async function (e) {
        e.preventDefault();
        try {
            var formData = new FormData(form);
            var action = formData.get("action");
            alert(action);
            var token = localStorage.getItem("jwt");
            var headers = token ? { "Authorization": "Bearer " + token } : {};
            if (action === "register") {
                var resp = await fetch("/api/activate/uk", { method: "POST", headers: headers, body: formData });
                if (!resp.ok) {
                    var params = new URLSearchParams();
                    formData.forEach(function (v, k) { params.append(k, v); });
                    resp = await fetch("/api/activate/uk?" + params.toString(), { headers: headers });
                }
                if (!resp.ok) { alert("Не вдалося виконати активацію."); return; }
                var result = await resp.json();
                var codeInput = document.getElementById("activationCode");
                if (codeInput) { codeInput.disabled = false; codeInput.value = result.activationCode || ""; }
            }
            if (action === "download") {
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
        } catch (err) {
            console.error(err);
            alert("Сталася помилка під час активації.");
        }
    });
}