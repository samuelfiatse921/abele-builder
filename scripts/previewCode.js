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

  const beautify = window.html_beautify || window.js_beautify;

  const showPreviewCode = () => {
    const html = grapeEditor.getHtml();
    const css = grapeEditor.getCss({ avoidProtected: true });
    const language = selectedDisplay.innerText.trim();

    let content = "";

    if (beautify) {
      if (language === "HTML") {
        content = beautify.html(html, {
          indent_size: 2,
          indent_char: " ",
          max_preserve_newlines: 2,
          preserve_newlines: true,
          extra_liners: ["head", "body", "/html"],
        });
      } else if (language === "CSS") {
        content = beautify.css(css, {
          indent_size: 2,
          indent_char: " ",
        });
      }
    } else {
      content =
        language === "HTML"
          ? html.replace(/></g, ">\n<")
          : css.replace(/}/g, "}\n").replace(/;/g, ";\n  ");
    }

    let preElement = codeContent.querySelector("pre");
    if (!preElement) {
      preElement = document.createElement("pre");
      codeContent.appendChild(preElement);
    }

    preElement.innerText = content;
    previewCodeModal.style.display = "flex";
  };

  previewCodeButton.addEventListener("click", showPreviewCode);

  previewCodeCloseButton.addEventListener("click", () => {
    previewCodeModal.style.display = "none";
  });

  dropdownItems.forEach((item) => {
    item.addEventListener("click", () => {
      selectedDisplay.textContent = item.id === "CSS" ? "CSS" : "HTML";
      if (previewCodeModal.style.display === "flex") {
        showPreviewCode();
      }
    });
  });

  // ✅ Close modal when clicking outside preview_code_wrapper
  previewCodeModal.addEventListener("click", (e) => {
    if (!previewWrapper.contains(e.target)) {
      previewCodeModal.style.display = "none";
    }
  });
})();
