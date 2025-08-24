/**
 * Add Icon Functionality for GrapesJS
 * Regenerated for adding an icon component to the canvas
 * Automatically shows the icon editor UI when an icon component is selected or updated
 * Hides the icon editor UI when a component is deselected
 * Wrapped in IIFE to prevent global namespace conflicts
 */

// Sample of icons

(function () {
  // Guard clause to prevent re-execution
  if (window.addIconFunctionalityLoaded) {
    console.log(
      "Add Icon functionality already loaded, skipping initialization."
    );
    return;
  }
  window.addIconFunctionalityLoaded = true;

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

  // Ensure Iconify is loaded (add this to your HTML if not present)
  // <script src="https://code.iconify.design/3/3.0.1/iconify.min.js"></script>
  if (typeof window.Iconify === "undefined") {
    console.warn(
      "Iconify library is not loaded. Icons may not render correctly. Please include <script src='https://code.iconify.design/3/3.0.1/iconify.min.js'></script> in your HTML."
    );
  }

  // Define icon component with increased size and proper structure
  grapeEditor.DomComponents.addType("icon", {
    model: {
      defaults: {
        tagName: "div",
        attributes: { class: "gjs-icon-container" },
        components: [
          {
            tagName: "span",
            attributes: { class: "gjs-icon" },
            content: "",
            hoverable: false,
            highlightable: false,
            selectable: false,
            style: {
              "z-index": "1", // Icon content behind parent
              "pointer-events": "none", // Prevent mouse interactions
              width: "100%",
              height: "100%",
              "line-height": "0",
            },
          },
        ],
        editable: false,
        droppable: false,
        resizable: false,
        style: {
          "font-size": "24px",
          display: "inline-block",
          "vertical-align": "middle",
          "z-index": "2", // Parent div has higher z-index for selection
          position: "relative",
          width: "fit-content",
          height: "fit-content",
          "line-height": "0",
        },
      },
    },
    view: {
      onRender({ el, model }) {
        const iconSpan = el.querySelector(".gjs-icon");
        if (iconSpan) {
          const iconHtml = model.get("iconHtml") || "";
          console.log("Rendering icon with content:", iconHtml);

          if (iconHtml) {
            iconSpan.innerHTML = iconHtml;

            // If Iconify is available, trigger a scan to render the icon
            if (typeof window.Iconify !== "undefined" && window.Iconify.scan) {
              window.Iconify.scan(el);
            } else {
              // Fallback: display a placeholder or raw content
              if (!iconSpan.innerHTML.includes("iconify-icon")) {
                iconSpan.innerHTML = "[Icon Placeholder]";
                iconSpan.style.color = "red"; // Visual indication of failure
              }
            }
          } else {
            iconSpan.innerHTML = "[No Icon Content]";
            iconSpan.style.color = "red";
          }
        } else {
          console.error("Icon span (.gjs-icon) not found in component.");
        }
      },
    },
  });

  // ==========================================================================
  // DOM Elements
  // ==========================================================================

  const addIconsButton = document.getElementById("addIconsButton");
  const deleteSelectedIcon = document.getElementById("deleteSelectedIcon");
  const iconsStyleContainer = document.getElementById("iconsStyleContainer");
  const iconsStyleContainerHeader = document.getElementById(
    "iconsStyleContainerHeader"
  );
  const allIconsStyleContainerHeaderButtons =
    iconsStyleContainer?.querySelectorAll("button");
  const iconsStyleContainerContainers = document.querySelectorAll(
    ".icons_style_container_item"
  );
  const iconsListSelectButtons = document.getElementById(
    "iconsListSelectButtons"
  );

  // ==========================================================================
  // Add Icon Functionality
  // ==========================================================================

  // Command to insert icon with container logic
  grapeEditor.Commands.add("insert-icon", {
    run(editor, sender, { iconHtml }) {
      const selected = editor.getSelected();
      const wrapper = editor.getWrapper();

      if (!wrapper) return;

      if (selected) {
        // Ensure the selected component is a container-type element
        if (!selected.is("text") && !selected.is("image")) {
          // Check if the selected component is a valid container (div, section, or default type)
          const isValidContainer =
            selected.get("tagName") === "div" ||
            selected.get("tagName") === "section" ||
            selected.get("type") === "default";

          if (isValidContainer && selected !== wrapper) {
            const newComponent = selected.append({
              type: "icon",
              iconHtml: iconHtml, // Store iconHtml in the model
              components: [
                {
                  tagName: "span",
                  attributes: { class: "gjs-icon" },
                  content: iconHtml,
                  hoverable: false,
                  highlightable: false,
                  selectable: false,
                  style: {
                    "z-index": "1", // Icon content behind parent
                    "pointer-events": "none", // Prevent mouse interactions
                    width: "100%",
                    height: "100%",
                  },
                },
              ],
            })[0];

            // Verify the icon was added
            const children = selected.components();
            const lastChild = children.at(children.length - 1);
            console.log("Inserted icon component:", lastChild.toHTML());
            editor.select(lastChild);
          } else {
            // Traverse up to find a suitable parent
            let targetComponent = selected;
            let parent = targetComponent.parent();
            while (parent && parent !== wrapper) {
              if (
                (parent.get("tagName") === "div" ||
                  parent.get("tagName") === "section" ||
                  parent.get("type") === "default") &&
                !parent.is("text") &&
                !parent.is("image")
              ) {
                targetComponent = parent;
                break;
              }
              parent = parent.parent();
            }

            if (targetComponent !== wrapper) {
              const newComponent = targetComponent.append({
                type: "icon",
                iconHtml: iconHtml, // Store iconHtml in the model
                components: [
                  {
                    tagName: "span",
                    attributes: { class: "gjs-icon" },
                    content: iconHtml,
                    hoverable: false,
                    highlightable: false,
                    selectable: false,
                    style: {
                      "z-index": "1", // Icon content behind parent
                      "pointer-events": "none", // Prevent mouse interactions
                      width: "100%",
                      height: "100%",
                    },
                  },
                ],
              })[0];

              const children = targetComponent.components();
              const lastChild = children.at(children.length - 1);
              console.log("Inserted icon component:", lastChild.toHTML());
              editor.select(lastChild);
            } else {
              showFlashMessage(
                "Please select a valid div or section to insert the icon. The root editor cannot be used directly.",
                "Invalid component selected",
                "error",
                5000
              );
              return;
            }
          }
        } else {
          showFlashMessage(
            "Please select a valid container or section to insert the icon.",
            "Invalid component selected",
            "error",
            5000
          );
          return;
        }
      } else {
        showFlashMessage(
          "Please select a section in the editor before inserting the icon.",
          "Invalid component selected",
          "error",
          5000
        );

        return;
      }

      // Hide the icon panel after insertion
      if (iconsStyleContainer) {
        iconsStyleContainer.classList.add("editor--hidden");
        const searchFileNameSection = document.getElementById(
          "searchFileNameSection"
        );
        const editorToolsList = document.getElementById("editorToolsList");
        searchFileNameSection?.classList.remove("editor--hidden");
        editorToolsList?.classList.remove("editor--hidden");
      }
    },
  });

  function renderDummyIcons(data) {
    if (!iconsListSelectButtons) {
      console.error("Icons list select buttons container not found.");
      return;
    }

    iconsListSelectButtons.innerHTML = "";

    data.forEach(({ icon }) => {
      const iconElement = document.createElement("button");
      iconElement.classList.add("icon-button");
      iconElement.setAttribute("draggable", "true");
      iconElement.innerHTML = icon;
      iconElement.addEventListener("click", () => {
        grapeEditor.runCommand("insert-icon", { iconHtml: icon });
      });

      iconElement.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", "addIconButton," + icon);
        console.log("Dragging button with ID: addIconButton" + icon);
      });

      iconsListSelectButtons.appendChild(iconElement);
    });

    // Trigger Iconify scan on the buttons to ensure they render in the UI
    if (typeof window.Iconify !== "undefined" && window.Iconify.scan) {
      window.Iconify.scan(iconsListSelectButtons);
    }
  }

  grapeEditor.on("component:add", (component) => {
    if (component.get("content").split(",")[0] === "addIconButton") {
      // Get the parent component where the text was added
      // const parentComponent = component.getParent();
      component.parent().set({
        type: "text",
        tagName: "icon",
        attributes: { type: "icon" },
        style: {
          "font-size": "24px",
          padding: "0px",
          width: "fit-content",
          height: "fit-content",
        },
        content: "",
        hoverable: true,
        highlightable: true,
        selectable: true,
      });

      component.replaceWith(
        grapeEditor.runCommand("insert-icon", {
          iconHtml: component.get("content").split(",")[1],
        })
      );
    }
  });

  renderDummyIcons(dummyIcons);

  if (addIconsButton) {
    addIconsButton.addEventListener("click", (e) => {
      const searchFileNameSection = document.getElementById(
        "searchFileNameSection"
      );
      const editorToolsList = document.getElementById("editorToolsList");
      const iconsStyleContainer = document.getElementById(
        "iconsStyleContainer"
      );

      if (searchFileNameSection)
        searchFileNameSection.classList.add("editor--hidden");
      if (editorToolsList) editorToolsList.classList.add("editor--hidden");
      if (iconsStyleContainer)
        iconsStyleContainer.classList.remove("editor--hidden");
    });
  } else {
    console.error("Add icons button not found.");
  }

  if (deleteSelectedIcon) {
    deleteSelectedIcon.addEventListener("click", () => {
      const selectedComponent = grapeEditor.getSelected();

      if (!selectedComponent) {
        showFlashMessage(
          "Please select an icon to delete.",
          "Invalid component selected",
          "error",
          5000
        );
        return;
      }

      // Validate that the selected component is an icon
      if (selectedComponent.get("type") !== "icon") {
        showFlashMessage(
          "Please select an icon component to delete.",
          "Invalid component selected",
          "error",
          5000
        );
        return;
      }

      selectedComponent.remove();
      console.log("Selected icon component deleted:", selectedComponent);
    });
  } else {
    console.error(
      "Delete icon element not found. Please check the selector '#deleteSelectedIcon'."
    );
  }

  if (iconsStyleContainerHeader) {
    iconsStyleContainerHeader.addEventListener("click", (e) => {
      const button = e.target.closest("button");

      if (button) {
        const { type } = button.dataset;
        const container = document.getElementById(`iconsStyleContainer${type}`);

        allIconsStyleContainerHeaderButtons?.forEach((btn) =>
          btn.classList.remove("active")
        );
        button.classList.add("active");

        iconsStyleContainerContainers?.forEach((container) =>
          container.classList.add("editor--hidden")
        );
        container?.classList.remove("editor--hidden");
      }
    });
  } else {
    console.error("Icons style container header not found.");
  }
})();
