const setTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  updateButtonStates(theme);
};

const updateButtonStates = (selectedTheme) => {
  const buttons = document.querySelectorAll(".dropdown-item");
  buttons.forEach((button) => {
    button.classList.toggle("active", button.id === `theme-${selectedTheme}`);
  });
};

const getPreferredTheme = () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) return savedTheme;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

document
  .getElementById("theme-auto")
  .addEventListener("click", () => setTheme("auto"));
document.getElementById("theme-light").addEventListener("click", () => {
  setTheme("light");
  Coloris({
    themeMode: "light",
    alpha: true,
  });
});
document.getElementById("theme-dark").addEventListener("click", () => {
  setTheme("dark");
  Coloris({
    themeMode: "dark",
    alpha: true,
  });
});

// Initialize theme
setTheme(getPreferredTheme());

// Listen for system theme changes when in auto mode
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (e) => {
    if (localStorage.getItem("theme") === "auto") {
      setTheme(e.matches ? "dark" : "light");
      Coloris({
        themeMode: e.matches ? "dark" : "light",
        alpha: true,
      });
    }
  });
