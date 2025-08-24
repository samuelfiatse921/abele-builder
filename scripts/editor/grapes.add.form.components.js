/**
 * Add Form Components Functionality for GrapesJS with Click and Drag-and-Drop Support
 * Adds form-related components (form, label, input, textarea, select, checkbox, radio, button) via click or drag-and-drop
 * Form uses white background (#ffffff); all inputs default to display: block
 * Form components stack vertically on mobile
 * Styles are embedded in component configurations for tool compatibility
 * Wrapped in IIFE to prevent global namespace conflicts
 */
(function () {
  // Guard clause to prevent re-execution
  if (window.addFormFunctionalityLoaded) {
    console.log("Form functionality already loaded, skipping initialization.");
    return;
  }
  window.addFormFunctionalityLoaded = true;

  // ==========================================================================
  // Initial Setup and Validation
  // ==========================================================================

  if (typeof grapeEditor === "undefined") {
    console.error(
      "grapeEditor is not defined. Please ensure the GrapesJS editor is initialized."
    );
    throw new Error("grapeEditor is not defined");
  }

  // ==========================================================================
  // Component Configurations
  // ==========================================================================

  const componentConfigs = {
    form: {
      type: "modern-form",
      tagName: "form",
      attributes: { class: "modern-form", action: "#", method: "POST" },
      style: {
        "background-color": "#ffffff",
        padding: "20px",
        "border-radius": "4px",
        "box-sizing": "border-box",
        "max-width": "1200px",
        margin: "0 auto",
      },
      css: {
        "@media (max-width: 768px)": {
          "text-align": "center",
          padding: "15px",
        },
      },
      components: [
        {
          tagName: "div",
          attributes: { class: "form-content" },
          style: {
            display: "grid",
            "grid-template-columns": "repeat(1, 1fr)",
            gap: "4px",
          },
          css: {
            "@media (max-width: 768px)": {
              "grid-template-columns": "1fr",
              "text-align": "center",
            },
          },
          components: [
            {
              tagName: "div",
              style: {
                "margin-bottom": "24px",
              },
              attributes: { class: "form-group" },
              components: [
                {
                  type: "label",
                  tagName: "label",
                  content: "First Name",
                  editable: true,
                  style: {
                    display: "block",
                    "margin-bottom": "5px",
                    "font-weight": "500",
                    "font-size": "18px",
                    color: "#2c3e50",
                  },
                  attributes: { for: "first-name" },
                  css: {
                    "@media (max-width: 768px)": {
                      "font-size": "16px",
                    },
                  },
                },
                {
                  type: "input",
                  tagName: "input",
                  style: {
                    display: "block",
                    padding: "10px",
                    "border-radius": "4px",
                    border: "1px solid #34495e",
                    "background-color": "#f8f9fa",
                    color: "#2c3e50",
                    width: "100%",
                    "box-sizing": "border-box",
                    "font-size": "16px",
                  },
                  attributes: {
                    type: "text",
                    id: "first-name",
                    placeholder: "Enter first name",
                    value: "John",
                  },
                  css: {
                    "@media (max-width: 768px)": {
                      width: "100%",
                    },
                  },
                },
              ],
            },
            {
              tagName: "div",
              attributes: { class: "form-group" },
              style: {
                "margin-bottom": "24px",
              },
              components: [
                {
                  type: "label",
                  tagName: "label",
                  content: "Last Name",
                  editable: true,
                  style: {
                    display: "block",
                    "margin-bottom": "5px",
                    "font-weight": "500",
                    "font-size": "18px",
                    color: "#2c3e50",
                  },
                  attributes: { for: "last-name" },
                  css: {
                    "@media (max-width: 768px)": {
                      "font-size": "16px",
                    },
                  },
                },
                {
                  type: "input",
                  tagName: "input",
                  style: {
                    display: "block",
                    padding: "10px",
                    "border-radius": "4px",
                    border: "1px solid #34495e",
                    "background-color": "#f8f9fa",
                    color: "#2c3e50",
                    width: "100%",
                    "box-sizing": "border-box",
                    "font-size": "16px",
                  },
                  attributes: {
                    type: "text",
                    id: "last-name",
                    placeholder: "Enter last name",
                    value: "Doe",
                  },
                  css: {
                    "@media (max-width: 768px)": {
                      width: "100%",
                    },
                  },
                },
              ],
            },
            {
              tagName: "div",
              attributes: { class: "form-group" },
              style: {
                display: "flex",
                "justify-content": "flex-start",
                "margin-bottom": "24px",
              },
              css: {
                "@media (max-width: 768px)": {
                  "justify-content": "center",
                },
              },
              components: [
                {
                  type: "button",
                  tagName: "button",
                  content: "Submit",
                  editable: true,
                  style: {
                    display: "block",
                    "background-color": "#34495e",
                    color: "white",
                    padding: "10px 20px",
                    "border-radius": "4px",
                    border: "none",
                    cursor: "pointer",
                    "font-size": "16px",
                    "font-weight": "500",
                  },
                  attributes: { type: "submit" },
                },
              ],
            },
          ],
        },
      ],
    },
    label: {
      type: "text",
      tagName: "label",
      content: "Label",
      editable: true,
      style: {
        display: "block",
        "margin-bottom": "5px",
        "font-weight": "500",
        "font-size": "18px",
        color: "#2c3e50",
      },
      attributes: { for: "input-field" },
      css: {
        "@media (max-width: 768px)": {
          "font-size": "16px",
        },
      },
    },
    input: {
      type: "input",
      tagName: "input",
      style: {
        display: "block",
        padding: "10px",
        "border-radius": "4px",
        border: "1px solid #34495e",
        "background-color": "#f8f9fa",
        color: "#2c3e50",
        width: "100%",
        "box-sizing": "border-box",
        "font-size": "16px",
      },
      attributes: {
        type: "text",
        placeholder: "Enter text",
        value: "Default Text",
      },
      css: {
        "@media (max-width: 768px)": {
          width: "100%",
        },
      },
    },
    textarea: {
      type: "textarea",
      tagName: "textarea",
      content: "",
      style: {
        display: "block",
        padding: "10px",
        "border-radius": "4px",
        border: "1px solid #34495e",
        "background-color": "#f8f9fa",
        color: "#2c3e50",
        width: "100%",
        height: "100px",
        "box-sizing": "border-box",
        "font-size": "16px",
      },
      attributes: {
        placeholder: "Enter text",
      },
      css: {
        "@media (max-width: 768px)": {
          width: "100%",
        },
      },
    },
    select: {
      type: "select",
      tagName: "select",
      content: `
        <option value="">Select an option</option>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
      `,
      style: {
        display: "block",
        padding: "10px",
        "border-radius": "4px",
        border: "1px solid #34495e",
        "background-color": "#f8f9fa",
        color: "#2c3e50",
        width: "100%",
        "box-sizing": "border-box",
        "font-size": "16px",
      },
      css: {
        "@media (max-width: 768px)": {
          width: "100%",
        },
      },
    },
    checkbox: {
      type: "checkbox",
      tagName: "input",
      style: {
        display: "block",
        margin: "10px 0",
        width: "20px",
        height: "20px",
        "background-color": "#f8f9fa",
        border: "1px solid #34495e",
      },
      attributes: {
        type: "checkbox",
      },
    },
    radio: {
      type: "radio",
      tagName: "input",
      style: {
        display: "block",
        margin: "10px 0",
        width: "20px",
        height: "20px",
        "background-color": "#f8f9fa",
        border: "1px solid #34495e",
      },
      attributes: {
        type: "radio",
        name: "radio-group",
      },
    },
    button: {
      type: "button",
      tagName: "button",
      content: "Button",
      editable: true,
      style: {
        display: "block",
        "background-color": "#34495e",
        color: "white",
        padding: "10px 20px",
        "border-radius": "4px",
        border: "none",
        cursor: "pointer",
        "font-size": "16px",
        "font-weight": "500",
      },
      attributes: { type: "button" },
    },
  };

  // Define component types in GrapesJS
  Object.entries(componentConfigs).forEach(([type, config]) => {
    grapeEditor.Components.addType(type, {
      model: {
        defaults: {
          tagName: config.tagName,
          content: config.content || "",
          style: config.style || {},
          attributes: config.attributes || {},
          components: config.components || [],
          css: config.css || {},
        },
      },
    });
  });

  // ==========================================================================
  // Create Draggable Blocks
  // ==========================================================================

  const blocks = [
    {
      id: "modern-form-block",
      label: "Modern Form",
      type: "form",
      category: "Form",
    },
    {
      id: "modern-label-block",
      label: "Form Label",
      type: "label",
      category: "Form",
    },
    {
      id: "modern-input-block",
      label: "Text Input",
      type: "input",
      category: "Form",
    },
    {
      id: "modern-textarea-block",
      label: "Textarea",
      type: "textarea",
      category: "Form",
    },
    {
      id: "modern-select-block",
      label: "Select Dropdown",
      type: "select",
      category: "Form",
    },
    {
      id: "modern-checkbox-block",
      label: "Checkbox",
      type: "checkbox",
      category: "Form",
    },
    {
      id: "modern-radio-block",
      label: "Radio Button",
      type: "radio",
      category: "Form",
    },
    {
      id: "modern-button-block",
      label: "Button",
      type: "button",
      category: "Form",
    },
  ];

  blocks.forEach((block) => {
    grapeEditor.Blocks.add(block.id, {
      label: block.label,
      content: { type: block.type },
      category: block.category,
      attributes: { class: `gjs-block-${block.type}` },
      select: true,
    });
  });

  // ==========================================================================
  // DOM Elements
  // ==========================================================================

  const buttonIds = [
    "addFormButton",
    "addLabelButton",
    "addInputButton",
    "addTextareaButton",
    "addSelectButton",
    "addCheckboxButton",
    "addRadioButton",
    "addButtonButton",
  ];

  const buttons = buttonIds.reduce((acc, id) => {
    const button = document.getElementById(id);
    if (!button) {
      console.error(
        `Button element not found. Please check the selector '#${id}'.`
      );
    }
    acc[id] = button;
    return acc;
  }, {});

  // ==========================================================================
  // State for Drag-and-Drop
  // ==========================================================================

  let isOverCanvas = false;

  // ==========================================================================
  // Shared Component-Adding Logic
  // ==========================================================================

  const addComponentToEditor = (type, targetComponent = null) => {
    const config = componentConfigs[type];
    if (!config) {
      console.error(`No configuration found for component type: ${type}`);
      return;
    }

    let newComponent;
    const selectedComponent = grapeEditor.getSelected();

    if (targetComponent && typeof targetComponent.append === "function") {
      newComponent = targetComponent.append(config)[0];
    } else if (
      selectedComponent &&
      typeof selectedComponent.append === "function"
    ) {
      newComponent = selectedComponent.append(config)[0];
    } else {
      newComponent = grapeEditor.getComponents().add(config);
    }

    if (newComponent) {
      grapeEditor.select(newComponent);
    } else {
      console.error(`Failed to add ${type} component`);
    }
  };

  // ==========================================================================
  // Add Components via Click and Drag-and-Drop
  // ==========================================================================

  Object.entries(buttons).forEach(([id, button]) => {
    if (button) {
      const type = id.replace("add", "").replace("Button", "").toLowerCase();
      // Click event
      button.addEventListener("click", () => {
        console.log(`Click event triggered on #${id}`);
        addComponentToEditor(type);
      });
      // Drag-and-drop events
      button.setAttribute("draggable", true);
      button.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", id);
        console.log(`Dragging component with ID: ${id}`);
      });
      button.addEventListener("dragend", () => {
        console.log(`Drag ended for ${id}, over canvas: ${isOverCanvas}`);
        isOverCanvas = false;
      });
    }
  });

  // ==========================================================================
  // Track Drag-and-Drop State Using GrapesJS Events
  // ==========================================================================

  grapeEditor.on("canvas:dragover", () => {
    isOverCanvas = true;
  });

  grapeEditor.on("canvas:dragleave", () => {
    isOverCanvas = false;
    console.log("Left canvas");
  });

  // Handle component addition to replace dropped text with the corresponding component
  grapeEditor.on("component:add", (component) => {
    const content = component.get("content") || "";
    const type = Object.keys(componentConfigs).find((key) =>
      content.includes(`add${key.charAt(0).toUpperCase() + key.slice(1)}Button`)
    );
    if (type && component.get("type") !== type) {
      console.log(`Replacing dropped text '${content}' with ${type} component`);
      const parent = component.parent();
      if (parent && typeof parent.append === "function") {
        const newComponent = parent.replaceWith(componentConfigs[type])[0];
        component.remove();
        if (newComponent) {
          setTimeout(() => {
            // newComponent.set("editable", false);
            // newComponent.set("type", componentConfigs[type].type);

            grapeEditor.select(newComponent);
          }, 100); // Delay selection to ensure the component is fully added
        } else {
          console.error(`Failed to append ${type} component`);
        }
      } else {
        console.error("Parent component is invalid or lacks append method");
      }
    }
  });

  console.log("Modern Form components loaded successfully!");
})();
