/**
 * Add Navbar and Footer Components Functionality for GrapesJS with Click and Drag-and-Drop Support
 * Adds navbar and footer components via click or drag-and-drop of #addNavbarButton and #addFooterButton
 * Navbar uses a grid layout similar to footer, with responsive stacking on mobile
 * Both use solid color (#2c3e50) and embedded styles for editor compatibility
 * Styles are simple and editable in GrapesJS
 * Wrapped in IIFE to prevent global namespace conflicts
 */
(function () {
  // Guard clause to prevent re-execution
  if (window.addHeaderFooterFunctionalityLoaded) {
    console.log(
      "Header and Footer functionality already loaded, skipping initialization."
    );
    return;
  }
  window.addHeaderFooterFunctionalityLoaded = true;

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
    navbar: {
      type: "modern-navbar",
      tagName: "nav",
      attributes: { class: "modern-navbar" },
      style: {
        "background-color": "#2c3e50",
        color: "white",
        "box-sizing": "border-box",
        width: "100%",
        position: "sticky",
        top: "0",
        "z-index": "1000",
      },
      css: {
        "@media (max-width: 768px)": {
          padding: "15px",
          "text-align": "center",
          height: "80px",
          overflow: "hidden",
        },
      },
      components: [
        {
          tagName: "div",
          attributes: { class: "navbar-container" },
          style: {
            "max-width": "95%",
            margin: "0 auto",
            padding: "20px",
            "box-sizing": "border-box",
          },
          css: {
            "@media (max-width: 768px)": {
              padding: "15px",
            },
          },
          components: [
            {
              tagName: "div",
              attributes: { class: "navbar-content" },
              style: {
                display: "grid",
                "grid-template-columns": "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "40px",
              },
              css: {
                "@media (max-width: 768px)": {
                  "grid-template-columns": "1fr",
                  "text-align": "center",
                  gap: "20px",
                },
              },
              components: [
                {
                  tagName: "div",
                  attributes: { class: "navbar-brand" },
                  components: [
                    {
                      tagName: "a",
                      type: "text",
                      attributes: { href: "#", class: "brand-link" },
                      content: "Company Logo",
                      editable: true,
                      style: {
                        "font-size": "24px",
                        "font-weight": "bold",
                        color: "#3498db",
                        "text-decoration": "none",
                        "margin-bottom": "10px",
                      },
                      css: {
                        "@media (max-width: 768px)": {
                          "font-size": "20px",
                        },
                      },
                    },
                  ],
                },
                {
                  tagName: "div",
                  attributes: { class: "navbar-nav" },
                  components: [
                    {
                      tagName: "ul",
                      attributes: { class: "nav-links" },
                      style: {
                        "list-style": "none",
                        padding: "0",
                        margin: "0",
                        display: "flex",
                        gap: "20px",
                      },
                      css: {
                        "@media (max-width: 768px)": {
                          display: "flex",
                          "flex-direction": "column",
                          gap: "10px",
                        },
                      },
                      components: [
                        {
                          tagName: "li",
                          style: { "margin-bottom": "8px" },
                          components: [
                            {
                              tagName: "a",
                              type: "text",
                              attributes: { href: "#", class: "nav-link" },
                              content: "Home",
                              editable: true,
                              style: {
                                color: "#bdc3c7",
                                "text-decoration": "none",
                                "font-weight": "500",
                              },
                            },
                          ],
                        },
                        {
                          tagName: "li",
                          style: { "margin-bottom": "8px" },
                          components: [
                            {
                              tagName: "a",
                              type: "text",
                              attributes: { href: "#", class: "nav-link" },
                              content: "About",
                              editable: true,
                              style: {
                                color: "#bdc3c7",
                                "text-decoration": "none",
                                "font-weight": "500",
                              },
                            },
                          ],
                        },
                        {
                          tagName: "li",
                          style: { "margin-bottom": "8px" },
                          components: [
                            {
                              tagName: "a",
                              type: "text",
                              attributes: { href: "#", class: "nav-link" },
                              content: "Services",
                              editable: true,
                              style: {
                                color: "#bdc3c7",
                                "text-decoration": "none",
                                "font-weight": "500",
                              },
                            },
                          ],
                        },
                        {
                          tagName: "li",
                          style: { "margin-bottom": "8px" },
                          components: [
                            {
                              tagName: "a",
                              type: "text",
                              attributes: { href: "#", class: "nav-link" },
                              content: "Contact",
                              editable: true,
                              style: {
                                color: "#bdc3c7",
                                "text-decoration": "none",
                                "font-weight": "500",
                              },
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    footer: {
      type: "modern-footer",
      tagName: "footer",
      attributes: { class: "modern-footer" },
      style: {
        "background-color": "#2c3e50",
        color: "white",
        "margin-top": "auto",
        "box-sizing": "border-box",
        width: "100%",
      },
      css: {
        "@media (max-width: 768px)": {
          padding: "15px",
        },
      },
      components: [
        {
          tagName: "div",
          attributes: { class: "footer-container" },
          style: {
            "max-width": "95%",
            margin: "0 auto",
            padding: "50px 20px 20px",
            "box-sizing": "border-box",
          },
          css: {
            "@media (max-width: 768px)": {
              padding: "30px 15px 15px",
            },
          },
          components: [
            {
              tagName: "div",
              attributes: { class: "footer-content" },
              style: {
                display: "grid",
                "grid-template-columns": "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "40px",
                "margin-bottom": "40px",
              },
              css: {
                "@media (max-width: 768px)": {
                  "grid-template-columns": "1fr",
                  "text-align": "center",
                  gap: "30px",
                },
              },
              components: [
                {
                  tagName: "div",
                  attributes: { class: "footer-section" },
                  components: [
                    {
                      tagName: "h3",
                      type: "text",
                      attributes: { class: "footer-title" },
                      content: "Your Company",
                      editable: true,
                      style: {
                        "font-size": "24px",
                        "margin-bottom": "15px",
                        color: "#3498db",
                      },
                      css: {
                        "@media (max-width: 768px)": {
                          "font-size": "20px",
                        },
                      },
                    },
                    {
                      tagName: "p",
                      type: "text",
                      attributes: { class: "footer-description" },
                      content: "Building amazing experiences for the web.",
                      editable: true,
                      style: {
                        color: "#bdc3c7",
                        "line-height": "1.6",
                        "margin-bottom": "20px",
                      },
                    },
                  ],
                },
                {
                  tagName: "div",
                  attributes: { class: "footer-section" },
                  components: [
                    {
                      tagName: "h4",
                      type: "text",
                      attributes: { class: "footer-subtitle" },
                      content: "Quick Links",
                      editable: true,
                      style: {
                        "font-size": "18px",
                        "margin-bottom": "15px",
                        color: "#ecf0f1",
                      },
                      css: {
                        "@media (max-width: 768px)": {
                          "font-size": "16px",
                        },
                      },
                    },
                    {
                      tagName: "ul",
                      attributes: { class: "footer-links" },
                      style: {
                        "list-style": "none",
                        padding: "0",
                        margin: "0",
                      },
                      components: [
                        {
                          tagName: "li",
                          style: { "margin-bottom": "8px" },
                          components: [
                            {
                              tagName: "a",
                              type: "text",
                              attributes: { href: "#", class: "footer-link" },
                              content: "Home",
                              editable: true,
                              style: {
                                color: "#bdc3c7",
                                "text-decoration": "none",
                              },
                            },
                          ],
                        },
                        {
                          tagName: "li",
                          style: { "margin-bottom": "8px" },
                          components: [
                            {
                              tagName: "a",
                              type: "text",
                              attributes: { href: "#", class: "footer-link" },
                              content: "About",
                              editable: true,
                              style: {
                                color: "#bdc3c7",
                                "text-decoration": "none",
                              },
                            },
                          ],
                        },
                        {
                          tagName: "li",
                          style: { "margin-bottom": "8px" },
                          components: [
                            {
                              tagName: "a",
                              type: "text",
                              attributes: { href: "#", class: "footer-link" },
                              content: "Services",
                              editable: true,
                              style: {
                                color: "#bdc3c7",
                                "text-decoration": "none",
                              },
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  tagName: "div",
                  attributes: { class: "footer-section" },
                  components: [
                    {
                      tagName: "h4",
                      type: "text",
                      attributes: { class: "footer-subtitle" },
                      content: "Contact Info",
                      editable: true,
                      style: {
                        "font-size": "18px",
                        "margin-bottom": "15px",
                        color: "#ecf0f1",
                      },
                      css: {
                        "@media (max-width: 768px)": {
                          "font-size": "16px",
                        },
                      },
                    },
                    {
                      tagName: "p",
                      type: "text",
                      content: "Email: info@yourcompany.com",
                      editable: true,
                      style: {
                        color: "#bdc3c7",
                        "line-height": "1.6",
                        "margin-bottom": "20px",
                      },
                    },
                    {
                      tagName: "p",
                      type: "text",
                      content: "Phone: (555) 123-4567",
                      editable: true,
                      style: {
                        color: "#bdc3c7",
                        "line-height": "1.6",
                        "margin-bottom": "20px",
                      },
                    },
                  ],
                },
              ],
            },
            {
              tagName: "div",
              attributes: { class: "footer-bottom" },
              style: {
                "border-top": "1px solid #34495e",
                "padding-top": "20px",
                display: "flex",
                "justify-content": "space-between",
                "align-items": "center",
                "flex-wrap": "wrap",
                gap: "20px",
                "box-sizing": "border-box",
              },
              css: {
                "@media (max-width: 768px)": {
                  "flex-direction": "column",
                  "text-align": "center",
                  gap: "15px",
                },
              },
              components: [
                {
                  tagName: "p",
                  type: "text",
                  attributes: { class: "footer-copyright" },
                  content: "© 2025 Your Company. All rights reserved.",
                  editable: true,
                  style: {
                    color: "#95a5a6",
                    margin: "0",
                  },
                },
                {
                  tagName: "div",
                  attributes: { class: "footer-social" },
                  style: {
                    display: "flex",
                    gap: "15px",
                  },
                  components: [
                    {
                      tagName: "a",
                      type: "text",
                      attributes: {
                        href: "#",
                        class: "social-link",
                        "aria-label": "Facebook",
                      },
                      content: "📘",
                      editable: true,
                      style: {
                        display: "inline-block",
                        width: "40px",
                        height: "40px",
                        "background-color": "#34495e",
                        "border-radius": "50%",
                        "text-align": "center",
                        "line-height": "40px",
                        "text-decoration": "none",
                        color: "white",
                      },
                    },
                    {
                      tagName: "a",
                      type: "text",
                      attributes: {
                        href: "#",
                        class: "social-link",
                        "aria-label": "Twitter",
                      },
                      content: "🐦",
                      editable: true,
                      style: {
                        display: "inline-block",
                        width: "40px",
                        height: "40px",
                        "background-color": "#34495e",
                        "border-radius": "50%",
                        "text-align": "center",
                        "line-height": "40px",
                        "text-decoration": "none",
                        color: "white",
                      },
                    },
                    {
                      tagName: "a",
                      type: "text",
                      attributes: {
                        href: "#",
                        class: "social-link",
                        "aria-label": "LinkedIn",
                      },
                      content: "💼",
                      editable: true,
                      style: {
                        display: "inline-block",
                        width: "40px",
                        height: "40px",
                        "background-color": "#34495e",
                        "border-radius": "50%",
                        "text-align": "center",
                        "line-height": "40px",
                        "text-decoration": "none",
                        color: "white",
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  };

  // Define component types in GrapesJS
  Object.entries(componentConfigs).forEach(([type, config]) => {
    grapeEditor.Components.addType(type, {
      model: {
        defaults: {
          tagName: config.tagName,
          attributes: config.attributes || {},
          components: config.components || [],
          style: config.style || {},
          css: config.css || {},
        },
      },
    });
  });

  // Define hamburger line styles (kept for compatibility, though not used)
  grapeEditor.CssComposer.addRules(`
    .hamburger-line {
      width: 25px;
      height: 3px;
      background-color: white;
      margin: 3px 0;
      border-radius: 2px;
    }
  `);

  // ==========================================================================
  // Create Draggable Blocks
  // ==========================================================================

  grapeEditor.Blocks.add("modern-navbar-block", {
    label: "Modern Navbar",
    content: { type: "modern-navbar" },
    category: "Layout",
    attributes: { class: "gjs-block-navbar" },
    select: true,
  });

  grapeEditor.Blocks.add("modern-footer-block", {
    label: "Modern Footer",
    content: { type: "modern-footer" },
    category: "Layout",
    attributes: { class: "gjs-block-footer" },
    select: true,
  });

  // ==========================================================================
  // DOM Elements
  // ==========================================================================

  const buttonIds = ["addNavbarButton", "addFooterButton"];

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
        const newComponent = parent.append(componentConfigs[type])[0];
        component.remove();
        if (newComponent) {
          grapeEditor.select(newComponent);
        } else {
          console.error(`Failed to append ${type} component`);
        }
      } else {
        console.error("Parent component is invalid or lacks append method");
      }
    }
  });

  console.log("Modern Navbar and Footer components loaded successfully!");
})();
