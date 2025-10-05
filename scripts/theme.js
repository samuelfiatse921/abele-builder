const setTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  updateButtonStates(theme);
  updateFontStyles(theme);
};

const updateFontStyles = (selectedTheme) => {
  const parent = document.querySelector("#sidebarHeader");
  const otherStyleContainer = document.querySelector("#otherStyleContainer");
  if (selectedTheme === "light") {
    const children = parent.querySelectorAll("*"); // Select all descendants
    const otherStyleContainerChildren = otherStyleContainer.querySelectorAll("*"); // Select all descendants
    children.forEach(el => {
      el.style.setProperty("color", "black", "important");
      // el.style.setProperty("border-bottom", "black", "important");
    });
    otherStyleContainerChildren.forEach(el => {
      el.style.setProperty("color", "black", "important");
      // el.style.setProperty("border-bottom", "black", "important");
    });
  } else {
    const children = parent.querySelectorAll("*"); // Select all descendants
    const otherStyleContainerChildren = otherStyleContainer.querySelectorAll("*"); // Select all descendants
    children.forEach(el => {
      el.style.removeProperty("color");
      // el.style.removeProperty("border-bottom");
    });
    otherStyleContainerChildren.forEach(el => {
      el.style.removeProperty("color");
      // el.style.removeProperty("border-bottom");
    });
  }
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
