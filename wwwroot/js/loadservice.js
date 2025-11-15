if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", onServiceLoad);
} else {
   onServiceLoad();
}

async function getCsrfToken() {
    const response = await fetch("/api/get-csrf-token");
    if (!response.ok) throw new Error("CSRF token fetch failed");
    const data = await response.json();
    return data.token;
}

async function onServiceLoad() {
    const form = document.getElementById("license-form");

    window.onSubmit = function (captchaToken) {
        // Start async operation and reset reCAPTCHA when done
        performService(captchaToken).then(() => {
            try {
                grecaptcha.reset();
            }
            catch (error) {
                console.warn("Captcha reset failed:", error);
            }
        });
    };

    // Optional: prevent native form submission just in case
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        grecaptcha.execute(); // trigger invisible CAPTCHA
    });
}

async function performService(captchaToken) {
    try {
        const csrfToken = await getCsrfToken();

        // Example payload — build from your form
        const serviceData = {                
        };

        const response = await fetch("/api/service", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": csrfToken,
                "X-Captcha-Token": captchaToken
            },
            body: JSON.stringify(serviceData)
        });

        if (response.ok) {
            const loginResult = await login();
            if (!loginResult) {
                alert("Login failed !");
                return;
            }

            console.log("Service logged successfully!");

            const html = await loginResult.text();
            updateContent(html, 'target');
            console.log("Activation loaded successfully!");

        } else {
            alert("Service error: " + response.statusText);
        }
    } catch (err) {
        console.error("Submit failed:", err);
        alert("An error occurred. See console for details.");
        throw err; // Re-throw so .catch() in onSubmit can handle it
    }
}
