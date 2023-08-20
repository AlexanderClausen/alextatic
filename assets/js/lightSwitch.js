document.addEventListener("DOMContentLoaded", function() {
    let currentTheme = localStorage.getItem("theme");

    // If there's no theme in localStorage, use system preference
    if (!currentTheme) {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            currentTheme = 'dark';
        } else {
            currentTheme = 'light';
        }
    }

    if (currentTheme === "dark") {
        document.body.classList.add("dark-mode");
    } else {
        document.body.classList.remove("dark-mode");
    }

    document.getElementById("lightSwitch").addEventListener("click", function() {
        document.body.classList.toggle("dark-mode");

        let theme = "light";
        if (document.body.classList.contains("dark-mode")) {
            theme = "dark";
        }

        localStorage.setItem("theme", theme);
    });
});
