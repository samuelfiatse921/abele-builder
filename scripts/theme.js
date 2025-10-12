const setTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  updateButtonStates(theme);
  updateFontStyles(theme);
};

const updateFontStyles = (selectedTheme) => {
  const parent = document.querySelector("#sidebarHeader");
  const otherStyleContainer = document.querySelector("#otherStyleContainer");
  const uploadBtn = document.querySelector(".upload-btn");
  const shareBtn = document.querySelector("button.share > span");
  const previewBtn= document.querySelectorAll(".Preview");

  if (selectedTheme === "light") {
    const children = parent.querySelectorAll("*"); // Select all descendants
    const otherStyleContainerChildren = otherStyleContainer.querySelectorAll("*"); // Select all descendants

    children.forEach(el => {
      el.style.setProperty("color", "black", "important");
    });
    otherStyleContainerChildren.forEach(el => {
      el.style.setProperty("color", "black", "important");
    });
    uploadBtn.style.setProperty("color", "white", "important");
    shareBtn.style.setProperty("color", "white", "important");
    previewBtn.forEach(el => {
      el.addEventListener("mouseenter", function() {
        el.style.setProperty("color", "white", "important");
      });
    });

    setTimeout(() => {
      const pageListBtn= document.querySelectorAll(".page-list");
      const pagesDropdownLink= document.querySelectorAll(".pages-dropdown-link");

      pageListBtn.forEach(el => {
        el.addEventListener("mouseenter", function() {
          const h2Element = el.querySelector("h2");
          const spanElement = el.querySelectorAll("span > svg > circle");
          h2Element.style.setProperty("color", "white", "important");
          spanElement.forEach(el => {
            el.style.setProperty("color", "white", "important");
          })
        });
        el.addEventListener("mouseleave", function() {
          const h2Element = el.querySelector("h2");
          const spanElement = el.querySelector("span > svg");
          h2Element.style.setProperty("color", "black", "important");
          spanElement.style.setProperty("color", "black", "important");
        });
      })
      pagesDropdownLink.forEach(el => {
        el.addEventListener("mouseenter", function() {
          el.style.setProperty("color", "white", "important");
        });
        el.addEventListener("mouseleave", function() {
          el.style.setProperty("color", "black", "important");
        });
      })
    }, 4000)
  } else {
    const children = parent.querySelectorAll("*"); // Select all descendants
    const otherStyleContainerChildren = otherStyleContainer.querySelectorAll("*"); // Select all descendants
    const pageListBtn= document.querySelectorAll(".page-list");

    children.forEach(el => {
      el.style.removeProperty("color");
    });
    otherStyleContainerChildren.forEach(el => {
      el.style.removeProperty("color");
    });
    pageListBtn.forEach(el => {
      el.addEventListener("mouseenter", function() {
        const h2Element = el.querySelector("h2");
        const spanElement = el.querySelectorAll("span > svg > circle");
        h2Element.style.setProperty("color", "white", "important");
        spanElement.forEach(el => {
          el.style.setProperty("color", "white", "important");
        })
      });
      el.addEventListener("mouseleave", function() {
        const h2Element = el.querySelector("h2");
        const spanElement = el.querySelectorAll("span > svg > circle");
        h2Element.style.setProperty("color", "#9A9A9C", "important");
        spanElement.forEach(el => {
          el.style.setProperty("color", "#9A9A9C", "important");
        })
      });
    })
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
