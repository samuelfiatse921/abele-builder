/**
 * Add Button Functionality for GrapesJS with Click and Drag-and-Drop Support
 * Adds a button component via click on #addButtonButton or drag-and-drop of #addButtonStyleButton
 * Uses component:add to replace the dropped "addButtonStyleButton" text with a button
 * Automatically shows the button editor UI when a button component is selected or updated
 * Hides the button editor UI when a component is deselected
 * Wrapped in IIFE to prevent global namespace conflicts
 */
(function () {
  // Guard clause to prevent re-execution
  if (window.addButtonFunctionalityLoaded) {
    console.log(
      "Add Button functionality already loaded, skipping initialization."
    );
    return;
  }
  window.addButtonFunctionalityLoaded = true;

  // ==========================================================================
  // Initial Setup and Validation
  // ==========================================================================

  // Ensure grapeEditor is defined
  if (typeof grapeEditor === "undefined") {
    console.error(
      "grapeEditor is not defined. Please ensure the GrapesJS editor is initialized before loading this script."
    );
    throw new Error("grapeEditor is not defined");
  }

  // ==========================================================================
  // DOM Elements
  // ==========================================================================

  const buttonTextInput = document.getElementById("buttonText");
  const addButtonButton = document.getElementById("addButtonButton");
  const addButtonStyleButton = document.getElementById("addButtonStyleButton");
  const deleteSelectedButton = document.getElementById("deleteSelectedButton");

  // State to track if the element is over the canvas
  let isOverCanvas = false;

  // ==========================================================================
  // Shared Button-Adding Logic
  // ==========================================================================

  const buttonText =
    buttonTextInput.value.trim() || buttonTextInput.placeholder || "Button";

  const button = {
    model: {
      defaults: {
        tagName: "button",
        content: buttonText,
        attributes: { class: "custom-button" },
        style: {
          padding: "10px 20px",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          "background-color": "#007bff",
        },
      },
    },
  };

  const buttonConfig = {
    type: "button",
    content: buttonText,
    style: {
      "background-color": "#007bff",
      color: "#ffffff",
      "padding-left": "15px",
      "padding-top": "10px",
      "padding-bottom": "10px",
      "padding-right": "15px",
      "margin-left": "0px",
      "margin-top": "0px",
      "margin-bottom": "0px",
      "margin-right": "auto",
      position: "relative",
      display: "block",
      width: "fit-content",
      height: "fit-content",
      border: "none",
      "border-radius": "4px",
      cursor: "pointer",
      "text-align": "center",
      flex: "none",
    },
  };

  const addButtonToEditor = () => {
    let newButtonComponent;
    const selectedComponent = grapeEditor.getSelected();

    if (selectedComponent && selectedComponent.components) {
      // Fallback to selected component
      newButtonComponent = selectedComponent.append(
        grapeEditor.Component.addType("button", button)
      )[0];
    } else {
      // Fallback to canvas root
      newButtonComponent = grapeEditor
        .getComponents()
        .add(grapeEditor.Component.addType("button", button))[0];
    }

    grapeEditor.select(newButtonComponent);
  };

  // ==========================================================================
  // Add Button via Click (#addButtonButton)
  // ==========================================================================

  if (addButtonButton) {
    addButtonButton.addEventListener("click", () => {
      addButtonToEditor();
    });
  } else {
    console.error(
      "Add button element not found. Please check the selector '#addButtonButton'."
    );
  }

  // ==========================================================================
  // Add Button via Drag-and-Drop (#addButtonStyleButton)
  // ==========================================================================

  if (addButtonStyleButton) {
    // Enable drag-and-drop for the button
    addButtonStyleButton.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", "addButtonStyleButton");
      console.log("Dragging button with ID: addButtonStyleButton");
    });

    // Log dragend event
    addButtonStyleButton.addEventListener("dragend", (e) => {
      console.log("Drag ended, over canvas:", isOverCanvas);
      isOverCanvas = false; // Reset state
    });
  } else {
    console.error(
      "Add button style element not found. Please check the selector '#addButtonStyleButton'."
    );
  }

  // ==========================================================================
  // Delete Button Functionality
  // ==========================================================================

  if (deleteSelectedButton) {
    deleteSelectedButton.addEventListener("click", () => {
      const selectedComponent = grapeEditor.getSelected();

      if (!selectedComponent) {
        showFlashMessage(
          "Please select a component to delete.",
          "Invalid component success",
          "error",
          5000
        );
        return;
      }

      // Validate that the selected component is a button
      if (selectedComponent.get("type") !== "button") {
        showFlashMessage(
          "Please select a button component to delete.",
          "Invalid component success",
          "error",
          5000
        );
        return;
      }

      selectedComponent.remove();
      console.log("Selected button component deleted:", selectedComponent);
    });
  } else {
    console.error(
      "Delete button element not found. Please check the selector '#deleteSelectedButton'."
    );
  }

  // ==========================================================================
  // Track Drag-and-Drop State Using GrapesJS Events
  // ==========================================================================

  // Track drag over the canvas
  grapeEditor.on("canvas:dragover", (e) => {
    isOverCanvas = true;
  });

  // Track when dragging leaves the canvas
  grapeEditor.on("canvas:dragleave", (e) => {
    isOverCanvas = false;
    console.log("Left canvas");
  });

  // Handle component addition to replace text with button
  grapeEditor.on("component:add", (component) => {
    if (component.get("content") === "addButtonStyleButton") {
      // Get the parent component where the text was added
      component.parent().set(buttonConfig);
      component.set("content", "Button");

      // component.parent().replaceWith(buttonConfig);
    }
  });
})();
