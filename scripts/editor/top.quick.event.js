document.addEventListener("DOMContentLoaded", () => {
  // Share Template
  const shareTemplate = document.querySelectorAll(".shareTemplate");

  shareTemplate.forEach((item) => {
    item.addEventListener("click", showGlobalShareFollowingModal);
  });

  // File Name Edit Button
  const fileNameEditButton = document.getElementById("fileNameEditButton");
  const fileNameInput = document.getElementById("fileNameInput");

  fileNameEditButton.addEventListener("click", () => {
    const isSelected = fileNameEditButton.getAttribute("aria-selected");

    if (isSelected === "true") {
      fileNameEditButton.setAttribute("aria-selected", "false");
      fileNameInput.disabled = true;
      fileNameInput.blur();
    } else {
      fileNameEditButton.setAttribute("aria-selected", "true");
      fileNameInput.disabled = false;
      fileNameInput.focus();
      fileNameInput.select();
    }
  });

  fileNameInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      fileNameEditButton.click();
    }
  });

  // editingMenuButton
  const editingMenuButton = document.getElementById("editingMenuButton");

  editingMenuButton.addEventListener("click", () => {
    document.querySelectorAll(".editing_tools_container").forEach((item) => {
      item.classList.add(HIDDEN);
    });

    toggleNewBlankWrapper(false);
    document.getElementById("editorToolsList").classList.remove(HIDDEN);
  });
});
