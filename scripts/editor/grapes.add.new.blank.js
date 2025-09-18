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

async function saveProjectUpdate(userId, projectTemplateId) {
  console.log("saving template update using id", projectTemplateId);
  const all_pages = grapeEditor.Pages.getAll();

  if (all_pages.length > 0) {
    const currentPage = grapeEditor.Pages.getSelected(); // remember which page is active

    const pages_to_create = []

    for (const [_, page] of all_pages.entries()) {
      grapeEditor.Pages.select(page);

      const pageAttr = page.attributes;
      const htmlPage = grapeEditor.getHtml();
      const cssPage = grapeEditor.getCss();

      const user_pages = {
        id: pageAttr.id,
        name: pageAttr.name,
        htmlPage,
        cssPage,
      }

      pages_to_create.push(user_pages);
    }

    if (pages_to_create.length > 0) {
      const request_body = {
        userId,
        templateId: projectTemplateId,
        data: pages_to_create,
      }

      return await save_project(request_body)
    }

    grapeEditor.Pages.select(currentPage);
  }
}

saveChanges.addEventListener("click", () => {
  saveProjectUpdate(userId, templateId).then(result => {
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
});
