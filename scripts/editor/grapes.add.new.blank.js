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

function getRequestBodyDetails(payload) {
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload)
  }
}

async function submit_request(api_url, payload) {
  const response = await fetch(api_url, getRequestBodyDetails(payload));
  const result = await response.json();

  let saved_project = []

  if (result.code === "00") {
    saved_project = result.data;
  }
  return saved_project;
}


async function save_project(requestBody) {
  const api_url = `${api_endpoint}/grape-js`;
  return await submit_request(api_url, requestBody);
}

saveChanges.addEventListener("click", () => {
  const all_pages = pages.getAll();

  if (all_pages.length > 0) {
    const pages_to_create = []
    all_pages.forEach((page, index) => {
      if (index === 0) {
        return;
      }

      const component =  page.getMainComponent();
      const pageAttr = page.attributes;
      const htmlPage = grapeEditor.getHtml({ component });
      const cssPage = grapeEditor.getCss({ component });

      const user_pages = {
        id: pageAttr.id,
        name: pageAttr.name,
        htmlPage,
        cssPage,
      }
      console.log("user page to save ", user_pages);

      pages_to_create.push(user_pages);
    });

    if (pages_to_create.length > 0) {
      const request_body = {
        userId,
        templateId,
        data: pages_to_create,
      }

      save_project(request_body).then(result => {
        if (result.length > 0) {
          showFlashMessage(
              "Changes have been saved successfully.",
              "Changes Saved",
              "success",
              5000
          );
        } else {
          showFlashMessage(
              "Failed to save changes",
              "Internal service is currently unavailable.",
              "error",
              5000
          );
        }
      });



    }

  }
});
