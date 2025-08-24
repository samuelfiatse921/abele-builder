// Add a button or trigger to clear the editor with confirmation
const clearEditorButton = document.getElementById("newBlankWrapper");
const saveChanges = document.getElementById("saveChanges");

if (clearEditorButton) {
  clearEditorButton.addEventListener("click", () => {
    const wrapper = grapeEditor.getWrapper();
    if (wrapper) {
      // Check if there are any components
      const hasContent = wrapper.components().length > 0;

      if (hasContent) {
        // Show confirmation dialog

        function createNewBlank() {
          console.log("Editor cleared and reset to blank state.");
          // Offer to save
          saveEditorContent();
          // Proceed to clear after save
          clearEditor();
        }

        showFlashMessage(
          "You have unsaved content. Do you want to save your progress before clearing?",
          "Changes Not Saved",
          "info",
          50000,
          true,
          { save: createNewBlank, clear: clearEditor }
        );
      } else {
        // No content, clear directly
        clearEditor();
      }
    } else {
      console.error("Wrapper component not found.");
    }
  });
} else {
  console.error(
    'Clear editor button not found. Please add a button with id="clearEditorButton".'
  );
}

// Function to save editor content
function saveEditorContent() {
  const html = grapeEditor.getHtml();
  const css = grapeEditor.getCss();
  const fullContent = `<!DOCTYPE html><html><head><style>${css}</style></head><body>${html}</body></html>`;

  const blob = new Blob([fullContent], { type: "text/html" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `editor-content-${Date.now()}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
  console.log("Editor content saved as HTML file.");
}

// Function to clear the editor
function clearEditor() {
  const wrapper = grapeEditor.getWrapper();
  if (wrapper) {
    wrapper.components().reset();
    console.log("Editor cleared and reset to blank state.");
  }
}

saveChanges.addEventListener("click", () => {
  showFlashMessage(
    "Changes have been saved suvccessfully.",
    "Changes Saved",
    "success",
    5000
  );
});
