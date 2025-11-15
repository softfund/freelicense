document.querySelectorAll(".tab").forEach(tab => {
        tab.addEventListener("click", () => {
            // Switch active tab
            document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            // Switch active content
            const target = tab.dataset.target;
            document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
            document.getElementById(target).classList.add("active");
        });
});
