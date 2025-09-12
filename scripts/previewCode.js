(function () {
  if (window.addHtmlDisplayFunctionalityLoaded) return;
  window.addHtmlDisplayFunctionalityLoaded = true;

  if (typeof grapeEditor === "undefined") {
    console.error("grapeEditor is not defined.");
    return;
  }

  const previewCodeButton = document.getElementById("previewCodeButton");
  const previewCodeModal = document.getElementById("previewCodeModal");
  const codeContent = document.getElementById("codeContent");
  const previewCodeCloseButton = document.getElementById(
    "previewCodeCloseButton"
  );
  const selectedDisplay = document.getElementById("language");
  const dropdownItems = document.querySelectorAll(".dropdown-item");
  const previewWrapper = document.querySelector(".preview_code_wrapper");

  if (
    !previewCodeButton ||
    !previewCodeModal ||
    !codeContent ||
    !previewCodeCloseButton ||
    !selectedDisplay ||
    !previewWrapper
  ) {
    console.error("Essential elements not found.");
    return;
  }

  const showPreviewCode = () => {
    const html = grapeEditor.getHtml();
    const css = grapeEditor.getCss({ avoidProtected: true });
    const language = selectedDisplay.innerText.trim();

    let content = "";
    let langClassName = "";

    if (language === "HTML") {
      langClassName = "language-html";
      content = html_beautify(html, {
        indent_size: 2,
        indent_char: " ",
        max_preserve_newlines: 2,
        preserve_newlines: true,
        extra_liners: ["head", "body", "/html"],
      });
    } else if (language === "CSS") {
      langClassName = "language-css";
      content = css_beautify(css, {
        indent_size: 2,
        indent_char: " ",
      });
    }

    let preElement = codeContent.querySelector("pre");
    if (!preElement) {
      preElement = document.createElement("pre");
      preElement.className = langClassName;
      codeContent.appendChild(preElement);
    }

    preElement.innerHTML = escapeHTML(content);
    previewCodeModal.style.display = "flex";

    hljs.highlightElement(preElement);
  };

  // 1) Escape function (function declaration — hoisted and safe)
  function escapeHTML(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
  }

  previewCodeButton.addEventListener("click", showPreviewCode);

  previewCodeCloseButton.addEventListener("click", () => {
    previewCodeModal.style.display = "none";
    codeContent.querySelector("pre").remove();
  });

  dropdownItems.forEach((item) => {
    item.addEventListener("click", () => {
      selectedDisplay.textContent = item.id === "CSS" ? "CSS" : "HTML";
      if (previewCodeModal.style.display === "flex") {
        codeContent.querySelector("pre").remove();
        showPreviewCode();
      }
    });
  });

  // ✅ Close modal when clicking outside preview_code_wrapper
  previewCodeModal.addEventListener("click", (e) => {
    if (!previewWrapper.contains(e.target)) {
      previewCodeModal.style.display = "none";
      codeContent.querySelector("pre").remove();
    }
  });
})();
