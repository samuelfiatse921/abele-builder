/**
 * Add Section Tool Functionality for GrapesJS with Click and Drag-and-Drop Support
 * Adds a single-column section to the canvas with text components via click or drag-and-drop
 * Applies initial formatting to text using document.execCommand
 * Wrapped in IIFE to prevent global namespace conflicts
 * WARNING: document.execCommand is deprecated and may not work in modern browsers.
 */
(function () {
  // Guard clause to prevent re-execution
  if (window.addSectionToolFunctionalityLoaded) {
    console.log(
      "Add Section Tool functionality already loaded, skipping initialization."
    );
    return;
  }
  window.addSectionToolFunctionalityLoaded = true;

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
  // Text Formatting Function
  // ==========================================================================

  function applyFormattingWithExecCommand(text, command, value = null) {
    const tempDiv = document.createElement("div");
    tempDiv.contentEditable = true;
    tempDiv.innerText = text;
    document.body.appendChild(tempDiv);

    tempDiv.focus();
    const range = document.createRange();
    range.selectNodeContents(tempDiv);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);

    try {
      if (value) {
        document.execCommand(command, false, value);
      } else {
        document.execCommand(command, false, null);
      }
    } catch (e) {
      console.error(`Failed to execute document.execCommand('${command}'):`, e);
      if (command === "bold") return `<b>${text}</b>`;
      if (command === "italic") return `<i>${text}</i>`;
      return text;
    }

    const formattedHtml = tempDiv.innerHTML;
    document.body.removeChild(tempDiv);
    sel.removeAllRanges();

    return formattedHtml;
  }

  // ==========================================================================
  // Component Configurations
  // ==========================================================================

  const componentConfigs = {
    column: {
      type: "column",
      tagName: "div",
      attributes: { class: "column" },
      components: [
        {
          type: "text",
          tagName: "h2",
          content: applyFormattingWithExecCommand("Column Title", "bold"),
          attributes: { class: "column-title" },
          editable: true,
        },
        {
          type: "text",
          tagName: "p",
          content: applyFormattingWithExecCommand("Column content here"),
          attributes: { class: "column-content" },
          editable: true,
        },
      ],
      style: {
        flex: "1",
        padding: "10px",
        "border-radius": "4px",
        position: "relative",
      },
    },
  };

  // Define component type in GrapesJS
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
      id: "column-block",
      label: "Single Column",
      type: "column",
      category: "Layout",
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

  const addSectionTool = document.getElementById("addSectionTool");

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
  // Add Column via Click and Drag-and-Drop
  // ==========================================================================

  if (addSectionTool) {
    // Click event
    addSectionTool.addEventListener("click", () => {
      console.log("Click event triggered on #addSectionTool");
      addComponentToEditor("column");
    });

    // Drag-and-drop events
    addSectionTool.setAttribute("draggable", true);
    addSectionTool.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", "addSectionTool");
      console.log("Dragging section tool with ID: addSectionTool");
    });

    addSectionTool.addEventListener("dragend", () => {
      console.log("Drag ended for section tool, over canvas:", isOverCanvas);
      isOverCanvas = false;
    });
  } else {
    console.error(
      "Add section tool element not found. Please check the selector '#addSectionTool'."
    );
  }

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

  // Handle component addition to replace dropped text with column
  grapeEditor.on("component:add", (component) => {
    const content = component.get("content") || "";
    if (content === "addSectionTool") {
      console.log(
        "Replacing dropped text 'addSectionTool' with column component"
      );
      const parent = component.parent();
      if (parent && typeof parent.append === "function") {
        const newComponent = parent.replaceWith(componentConfigs.column)[0];
        component.remove();
        if (newComponent) {
          setTimeout(() => {
            newComponent.set("editable", false);
            newComponent.set("type", componentConfigs.column.type);
            grapeEditor.select(newComponent);
          }, 100); // Delay selection to ensure the component is fully added
        } else {
          console.error("Failed to append column component");
        }
      } else {
        console.error("Parent component is invalid or lacks append method");
      }
    }
  });

  console.log("Single Column components loaded successfully!");
})();
