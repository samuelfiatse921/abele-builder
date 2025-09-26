/**
 * Text Editor Functionality for GrapesJS
 * Enables bold, italic, uppercase, UL, OL, font family, font size, text color, text alignment, and link formatting with two-way binding
 * Uses document.queryCommandState for inline formatting state detection
 * Implements a live preview of the formatted text in a sample text area (div)
 * Automatically shows the text editor sidebar when a text component is selected
 * Supports click and drag-and-drop for adding text and headings
 * Organized into distinct sections with comments and gaps
 * Wrapped in IIFE to prevent global namespace conflicts
 * Tracks font size, font family, text color, and text alignment via textContent of span elements or input value with debounced interval
 * Tracks text alignment via button states
 * Adds link functionality with URL prompt
 */
(function () {
  // Guard clause to prevent re-execution
  if (window.textEditorFunctionalitiesLoaded) {
    console.log(
      "Text Editor functionalities already loaded, skipping initialization."
    );
    return;
  }
  window.textEditorFunctionalitiesLoaded = true;

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
  // Shared DOM Elements
  // ==========================================================================

  const addTextButton = document.getElementById("addTextButton");
  const addHeadingButton = document.getElementById("addHeadingButton");
  const searchFileNameSection = document.getElementById(
    "searchFileNameSection"
  );
  const editorToolsList = document.getElementById("editorToolsList");
  const textStyleContainer = document.getElementById("textStyleContainer");
  const textStyleContainerHeader = document.getElementById(
    "textStyleContainerHeader"
  );
  const allTextStyleHeaderButtons = textStyleContainer
    ? textStyleContainer.querySelectorAll("button")
    : [];
  const textStyleContainerContainers = document.querySelectorAll(
    ".text_style_container_container"
  );

  // Formatting buttons
  const btnBold = document.getElementById("btnBold");
  const btnItalic = document.getElementById("btnItalic");
  const btnUppercase = document.getElementById("btnUppercase");
  const btnUL = document.getElementById("btnUL");
  const btnOL = document.getElementById("btnOL");
  const btnLink = document.getElementById("btnLink");

  // Text alignment buttons
  const textAlignButtons = document.querySelectorAll("button[data-text-align]");

  // Font-related spans and input
  const fontSizeSelect = document.getElementById("fontSizeSelect");
  const fontFamilySelect = document.getElementById("fontFamilySelect");
  const textColorInput = document.getElementById("textColorInput");

  // Sample text preview element
  const sampleText = document.getElementById("sampleText");

  const TEXT_TAGS = ["P", "SPAN", "H1", "H2", "H3", "H4", "H5", "H6"];

  // Validate DOM elements
  if (!addTextButton)
    console.error(
      "Add text button not found. Please check the selector '#addTextButton'."
    );
  if (!addHeadingButton)
    console.error(
      "Add heading button not found. Please check the selector '#addHeadingButton'."
    );
  if (!searchFileNameSection)
    console.error(
      "Search file name section not found. Please check the selector '#searchFileNameSection'."
    );
  if (!editorToolsList)
    console.error(
      "Editor tools list not found. Please check the selector '#editorToolsList'."
    );
  if (!textStyleContainer)
    console.error(
      "Text style container not found. Please check the selector '#textStyleContainer'."
    );
  if (!textStyleContainerHeader)
    console.error(
      "Text style container header not found. Please check the selector '#textStyleContainerHeader'."
    );
  if (allTextStyleHeaderButtons.length === 0)
    console.warn("No buttons found in text style container header.");
  if (textStyleContainerContainers.length === 0)
    console.warn(
      "No text style container containers found. Please check the selector '.text_style_container_container'."
    );
  if (!btnBold)
    console.error(
      "Bold button not found. Please check the selector '#btnBold'."
    );
  if (!btnItalic)
    console.error(
      "Italic button not found. Please check the selector '#btnItalic'."
    );
  if (!btnUppercase)
    console.error(
      "Uppercase button not found. Please check the selector '#btnUppercase'."
    );
  if (!btnUL)
    console.error("UL button not found. Please check the selector '#btnUL'.");
  if (!btnOL)
    console.error("OL button not found. Please check the selector '#btnOL'.");
  if (!btnLink)
    console.error(
      "Link button not found. Please check the selector '#btnLink'."
    );
  if (textAlignButtons.length === 0)
    console.warn(
      "No text alignment buttons found. Please check the selector 'button[data-text-align]'."
    );
  if (!fontSizeSelect)
    console.error(
      "Font size span not found. Please check the selector '#fontSizeSelect'."
    );
  if (!fontFamilySelect)
    console.error(
      "Font family span not found. Please check the selector '#fontFamilySelect'."
    );
  if (!textColorInput)
    console.error(
      "Text color input not found. Please check the selector '#textColorInput'."
    );
  if (!sampleText)
    console.error(
      "Sample text preview element not found. Please check the selector '#sampleText'."
    );

  // State to track if the element is over the canvas
  let isOverCanvas = false;

  // State to track last known values of font size, font family, and text color
  let lastFontSize = fontSizeSelect ? fontSizeSelect.textContent : "12";
  let lastFontFamily = fontFamilySelect
    ? fontFamilySelect.textContent
    : "Inter";
  let lastTextColor = textColorInput ? textColorInput.value : "#000000";

  // ==========================================================================
  // Utility Functions
  // ==========================================================================

  function isTextComponent(component) {
    if (!component) return false;
    const tag = (
      component.get("tagName") ||
      component.getEl()?.tagName ||
      ""
    ).toUpperCase();
    return (
      component.is("text") ||
      component.is("textnode") ||
      TEXT_TAGS.includes(tag)
    );
  }

  function isValidContainer(component) {
    if (!component) return false;
    const tag = (component.get("tagName") || "").toUpperCase();
    return tag === "DIV" || tag === "SECTION";
  }

  function showEditTextPanel() {
    if (searchFileNameSection)
      searchFileNameSection.classList.add("editor--hidden");
    if (editorToolsList) editorToolsList.classList.add("editor--hidden");
    if (textStyleContainer)
      textStyleContainer.classList.remove("editor--hidden");
  }

  function hideEditTextPanel() {
    if (searchFileNameSection)
      searchFileNameSection.classList.remove("editor--hidden");
    if (editorToolsList) editorToolsList.classList.remove("editor--hidden");
    if (textStyleContainer) textStyleContainer.classList.add("editor--hidden");
  }

  // ==========================================================================
  // Formatting State Detection
  // ==========================================================================

  // Function to check the formatting state of the selected text using document.queryCommandState
  function getFormattingStates(component) {
    if (!component || !isTextComponent(component)) {
      return {
        isBold: false,
        isItalic: false,
        isUnorderedList: false,
        isOrderedList: false,
        isUppercase: false,
        isLink: false,
        fontFamily: "Inter",
        fontSize: "12",
        textColor: "#000000",
        textAlign: "left",
      };
    }

    // Extract the current content
    let currentContent =
      component.getEl().innerHTML || component.get("content") || "";
    if (!currentContent) {
      console.warn(
        "No content found in the selected text component. Using default content."
      );
      currentContent = " ";
    }

    // Create a temporary contenteditable element to check formatting states
    const tempDiv = document.createElement("div");
    tempDiv.contentEditable = "true";
    tempDiv.style.position = "absolute";
    tempDiv.style.left = "-9999px"; // Move off-screen to avoid visual flicker
    tempDiv.innerHTML = currentContent;
    document.body.appendChild(tempDiv);

    // Select all content in the temporary element
    const range = document.createRange();
    range.selectNodeContents(tempDiv);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    // Check formatting states using document.queryCommandState
    const formattingStates = {
      isBold: document.queryCommandState("bold"),
      isItalic: document.queryCommandState("italic"),
      isUnorderedList: document.queryCommandState("insertUnorderedList"),
      isOrderedList: document.queryCommandState("insertOrderedList"),
      isLink: document.queryCommandState("createLink"),
      isUppercase: false,
      fontFamily: "Inter",
      fontSize: "12",
      textColor: "#000000",
      textAlign: "left",
    };

    // Clean up
    document.body.removeChild(tempDiv);
    selection.removeAllRanges();

    // Check uppercase, font family, font size, text color, and text align by inspecting the component's style
    const styles = component.getStyle() || {};
    formattingStates.isUppercase = styles["text-transform"] === "uppercase";
    formattingStates.fontFamily = styles["font-family"] || "Inter";
    formattingStates.fontSize = styles["font-size"]
      ? parseInt(styles["font-size"], 10).toString()
      : "12";
    formattingStates.textColor = styles["color"] || "#000000";
    formattingStates.textAlign = styles["text-align"] || "left";

    return formattingStates;
  }

  // Function to update all button states and input/span elements based on the selected text's formatting
  function updateButtonStates() {
    const selected = grapeEditor.getSelected();
    const states = getFormattingStates(selected);

    // Update inline formatting buttons
    if (btnBold) {
      if (states.isBold) {
        btnBold.classList.add("active");
      } else {
        btnBold.classList.remove("active");
      }
    }
    if (btnItalic) {
      if (states.isItalic) {
        btnItalic.classList.add("active");
      } else {
        btnItalic.classList.remove("active");
      }
    }
    if (btnUppercase) {
      if (states.isUppercase) {
        btnUppercase.classList.add("active");
      } else {
        btnUppercase.classList.remove("active");
      }
    }
    if (btnUL) {
      if (states.isUnorderedList) {
        btnUL.classList.add("active");
      } else {
        btnUL.classList.remove("active");
      }
    }
    if (btnOL) {
      if (states.isOrderedList) {
        btnOL.classList.add("active");
      } else {
        btnOL.classList.remove("active");
      }
    }
    if (btnLink) {
      if (states.isLink) {
        btnLink.classList.add("active");
      } else {
        btnLink.classList.remove("active");
      }
    }

    // Update text alignment buttons
    textAlignButtons.forEach((button) => {
      const align = button.dataset.textAlign;
      button.classList.toggle("active", align === states.textAlign);
    });

    // Update font-related spans and text color input
    if (fontFamilySelect) {
      fontFamilySelect.textContent = states.fontFamily || "Inter";
      lastFontFamily = fontFamilySelect.textContent; // Update last known value
    }
    if (fontSizeSelect) {
      fontSizeSelect.textContent = states.fontSize || "12";
      lastFontSize = fontSizeSelect.textContent; // Update last known value
    }
    if (textColorInput) {
      textColorInput.value = states.textColor || "#000000";
      lastTextColor = textColorInput.value; // Update last known value
    }
  }

  // Function to update the sample text preview
  function updateSampleTextPreview() {
    const selected = grapeEditor.getSelected();
    if (!sampleText) return;

    if (selected && isTextComponent(selected)) {
      // Get the formatted HTML content of the selected component
      const formattedContent =
        selected.getEl().innerHTML || selected.get("content") || "";
      // Apply the component's styles (e.g., text-transform, font-family, font-size, color, text-align) to the preview
      const styles = selected.getStyle() || {};
      sampleText.innerHTML = formattedContent;
      Object.assign(sampleText.style, {
        textTransform: styles["text-transform"] || "none",
        fontFamily: styles["font-family"] || "Inter",
        fontSize: styles["font-size"] || "12px",
        color: styles["color"] || "#000000",
        textAlign: styles["text-align"] || "left",
        bold: styles["font-weight"] || "normal",
      });
    } else {
      // Clear the preview if no text component is selected
      sampleText.innerHTML = "";
      sampleText.style = {}; // Reset styles
    }
  }

  // ==========================================================================
  // Add Text Functionality (Click and Drag-and-Drop)
  // ==========================================================================

  if (addTextButton) {
    // Click handler
    addTextButton.addEventListener("click", () => {
      let selected = grapeEditor.getSelected();
      const wrapper = grapeEditor.getWrapper();

      if (selected && isTextComponent(selected)) {
        grapeEditor.select(selected); // Ensure focus
        console.log(
          "Selected text component:",
          selected,
          "Text style container classes:",
          textStyleContainer?.classList
        );
        showEditTextPanel();
        updateButtonStates(); // Update button states and inputs/spans on selection
        updateSampleTextPreview(); // Update the sample text preview
      } else {
        // Determine the target component
        let targetComponent = wrapper; // Default to root wrapper
        if (selected) {
          if (isValidContainer(selected)) {
            targetComponent = selected; // Use selected div or section
          } else {
            // Traverse up to find a valid parent
            let parent = selected.parent();
            while (parent && parent !== wrapper) {
              if (isValidContainer(parent)) {
                targetComponent = parent;
                break;
              }
              parent = parent.parent();
            }
          }
        }

        // Add new text component to the target
        const newText = targetComponent.append({
          type: "text",
          tagName: "p",
          content: "New Text",
          editable: true,
        })[0];
        grapeEditor.select(newText);
        showEditTextPanel();
        updateButtonStates(); // Update button states and inputs/spans for new text
        updateSampleTextPreview(); // Update the sample text preview
      }
    });

    // Enable drag-and-drop for the text button
    addTextButton.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", "addTextButton");
      console.log("Dragging text button with ID: addTextButton");
    });

    // Log dragend event
    addTextButton.addEventListener("dragend", (e) => {
      console.log("Drag ended for text button, over canvas:", isOverCanvas);
      isOverCanvas = false; // Reset state
    });
  }

  // ==========================================================================
  // Add Heading Functionality (Click and Drag-and-Drop)
  // ==========================================================================

  if (addHeadingButton) {
    function applyFormattingWithExecCommand(text, command, value = null) {
      // Create a temporary contenteditable div
      const tempDiv = document.createElement("div");
      tempDiv.contentEditable = true;
      tempDiv.innerText = text;
      document.body.appendChild(tempDiv);

      // Focus the div and select its content
      tempDiv.focus();
      const range = document.createRange();
      range.selectNodeContents(tempDiv);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);

      // Apply formatting with document.execCommand
      try {
        if (value) {
          document.execCommand(command, false, value);
        } else {
          document.execCommand(command, false, null);
        }
      } catch (e) {
        console.error(
          `Failed to execute document.execCommand('${command}'):`,
          e
        );
        // Fallback: return the plain text wrapped in the equivalent HTML tag
        if (command === "bold") return `<b>${text}</b>`;
        if (command === "italic") return `<i>${text}</i>`;
        if (command === "createLink") return `<a href="${value}">${text}</a>`;
        return text; // Return unformatted text as a last resort
      }

      // Get the formatted HTML
      const formattedHtml = tempDiv.innerHTML;

      // Clean up
      document.body.removeChild(tempDiv);
      sel.removeAllRanges();

      return formattedHtml;
    }

    // Click handler
    addHeadingButton.addEventListener("click", () => {
      let selected = grapeEditor.getSelected();
      const wrapper = grapeEditor.getWrapper();

      if (selected && isTextComponent(selected)) {
        grapeEditor.select(selected); // Ensure focus
        console.log(
          "Selected heading component:",
          selected,
          "Text style container classes:",
          textStyleContainer?.classList
        );
        showEditTextPanel();
        updateButtonStates(); // Update button states and inputs/spans on selection
        updateSampleTextPreview(); // Update the sample text preview
      } else {
        // Determine the target component
        let targetComponent = wrapper; // Default to root wrapper
        if (selected) {
          if (isValidContainer(selected)) {
            targetComponent = selected; // Use selected div or section
          } else {
            // Traverse up to find a valid parent
            let parent = selected.parent();
            while (parent && parent !== wrapper) {
              if (isValidContainer(parent)) {
                targetComponent = parent;
                break;
              }
              parent = parent.parent();
            }
          }
        }

        // Add new text component to the target (start as paragraph)
        const newHeading = targetComponent.append({
          type: "text",
          tagName: "h1",
          content: applyFormattingWithExecCommand("New Heading", "bold"), // Apply bold formatting
          editable: true,
        })[0];
        grapeEditor.select(newHeading);
        showEditTextPanel();
        updateButtonStates(); // Update button states and inputs/spans for new heading
        updateSampleTextPreview(); // Update the sample text preview
      }
    });

    // Enable drag-and-drop for the heading button
    addHeadingButton.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", "addHeadingButton");
      console.log("Dragging heading button with ID: addHeadingButton");
    });

    // Log dragend event
    addHeadingButton.addEventListener("dragend", (e) => {
      console.log("Drag ended for heading button, over canvas:", isOverCanvas);
      isOverCanvas = false; // Reset state
    });
  }

  // ==========================================================================
  // Formatting Functionality
  // ==========================================================================

  function applyFormatting(command, value = null) {
    const selected = grapeEditor.getSelected();

    if (!selected || !isTextComponent(selected)) {
      showFlashMessage(
        "Please select a text component to edit.",
        "Invalid component success",
        "error",
        5000
      );
      return;
    }

    // Ensure the component is editable
    selected.set("editable", true);

    // Handle style-based formatting (uppercase, font-family, font-size, color, text-align)
    if (
      command === "uppercase" ||
      command === "font-family" ||
      command === "font-size" ||
      command === "color" ||
      command === "text-align" ||
      command === "bold" ||
      command === "italic"
    ) {
      const currentStyles = selected.getStyle() || {};
      if (command === "uppercase") {
        if (currentStyles["text-transform"] === "uppercase") {
          selected.setStyle({ ...currentStyles, "text-transform": "none" });
        } else {
          selected.setStyle({
            ...currentStyles,
            "text-transform": "uppercase",
          });
        }
      } else if (command === "font-family") {
        selected.setStyle({ ...currentStyles, "font-family": value });
      } else if (command === "font-size") {
        selected.setStyle({ ...currentStyles, "font-size": value + "px" });
      } else if (command === "color") {
        selected.setStyle({ ...currentStyles, color: value });
      } else if (command === "text-align") {
        selected.setStyle({ ...currentStyles, "text-align": value });
      } else if (command === "bold") {
        selected.setStyle({ ...currentStyles, "font-weight": "bold" });
      } else if (command === "italic") {
        selected.setStyle({ ...currentStyles, "font-style": "italic" });
      }
      updateButtonStates();
      updateSampleTextPreview();
      return;
    }

    // Extract the current content (including HTML formatting) for inline formatting
    let currentContent =
      selected.getEl().innerHTML || selected.get("content") || "";
    if (!currentContent) {
      console.warn(
        "No content found in the selected text component. Using default content."
      );
      currentContent = " ";
    }

    // Create a temporary contenteditable element to apply inline formatting
    const tempDiv = document.createElement("div");
    tempDiv.contentEditable = "true";
    tempDiv.style.position = "absolute";
    tempDiv.style.left = "-9999px"; // Move off-screen to avoid visual flicker
    tempDiv.innerHTML = currentContent;
    document.body.appendChild(tempDiv);

    // Select all content in the temporary element
    const range = document.createRange();
    range.selectNodeContents(tempDiv);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    // Apply formatting using document.execCommand
    try {
      if (command === "createLink" || command === "unlink") {
        document.execCommand(command, false, value);
      } else {
        document.execCommand(command, false, null);
      }
    } catch (error) {
      console.error(
        `Failed to apply formatting with command '${command}':`,
        error
      );

      showFlashMessage(
        `Failed to apply ${command} formatting. This feature may not be supported in your browser.`,
        "Invalid component success",
        "error",
        5000
      );
    }

    // Get the updated content
    const updatedContent = tempDiv.innerHTML;

    // Clean up: remove the temporary element
    document.body.removeChild(tempDiv);
    selection.removeAllRanges();

    // Insert the updated content back into the component
    selected.set("content", updatedContent);

    // Update button states and sample text preview after applying formatting
    updateButtonStates();
    updateSampleTextPreview();
  }

  // Function to apply text alignment
  function applyTextAlign(align) {
    const selected = grapeEditor.getSelected();
    if (!selected || !isTextComponent(selected)) {
      showFlashMessage(
        "Please select a text component to align.",
        "Invalid component",
        "error",
        5000
      );
      return;
    }
    applyFormatting("text-align", align);
  }

  // Bold
  if (btnBold) {
    btnBold.addEventListener("click", () => {
      applyFormatting("bold");
    });
  }

  // Italic
  if (btnItalic) {
    btnItalic.addEventListener("click", () => {
      applyFormatting("italic");
    });
  }

  // Uppercase
  if (btnUppercase) {
    btnUppercase.addEventListener("click", () => {
      applyFormatting("uppercase");
    });
  }

  // Unordered List (UL)
  if (btnUL) {
    btnUL.addEventListener("click", () => {
      applyFormatting("insertUnorderedList");
    });
  }

  // Ordered List (OL)
  if (btnOL) {
    btnOL.addEventListener("click", () => {
      applyFormatting("insertOrderedList");
    });
  }

  // Link
  if (btnLink) {
    btnLink.addEventListener("click", () => {
      const selected = grapeEditor.getSelected();
      if (!selected || !isTextComponent(selected)) {
        showFlashMessage(
          "Please select a text component to add a link.",
          "Invalid component success",
          "error",
          5000
        );
        return;
      }

      // Check if the selected text is already a link
      const states = getFormattingStates(selected);
      if (states.isLink) {
        // Remove the link
        applyFormatting("unlink");
      } else {
        // Prompt for URL
        const modal = document.getElementById("urlModal");
        const cancelBtn = document.getElementById("cancelBtn");
        const okBtn = document.getElementById("okBtn");

        modal.style.display = "flex";

        // Close modal
        cancelBtn.addEventListener("click", () => {
          modal.style.display = "none";
          urlInput.value = "";
        });

        // OK button (get URL value)
        okBtn.addEventListener("click", () => {
          const url = urlInput.value.trim();
          if (url && url.trim()) {
            // Validate URL (basic check)
            try {
              new URL(url); // Throws if invalid
              applyFormatting("createLink", url);
              showFlashMessage(
                  "",
                  "URL Applied",
                  "success",
                  5000
              );
              modal.style.display = "none";
            } catch (e) {
              modal.style.display = "none";
              showFlashMessage(
                  "Invalid URL. Please enter a valid URL starting with http:// or https://.",
                  "Invalid URL",
                  "error",
                  5000
              );
            }
          } else if (url == null) {
            modal.style.display = "none";
            showFlashMessage(
                "No URL provided. Link not added.",
                "No URL",
                "info",
                5000
            );
          }
          urlInput.value = "";
        });

        // Close modal if clicked outside content
        window.addEventListener("click", (e) => {
          if (e.target === modal) {
            modal.style.display = "none";
            urlInput.value = "";
          }
        });
      }
    });
  }

  // Text Alignment
  textAlignButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const align = button.dataset.textAlign;
      applyTextAlign(align);
      textAlignButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
    });
  });

  // Font Size, Font Family, and Text Color via interval check
  if (fontSizeSelect && fontFamilySelect && textColorInput) {
    setInterval(() => {
      const currentFontSize = fontSizeSelect.textContent;
      const currentFontFamily = fontFamilySelect.textContent;
      const currentTextColor = textColorInput.value;

      // Check for font size change
      if (
        currentFontSize !== lastFontSize &&
        !isNaN(parseInt(currentFontSize, 10))
      ) {
        applyFormatting("font-size", currentFontSize);
        console.log("Font size changed to:", currentFontSize);
        lastFontSize = currentFontSize;
      }

      // Check for font family change
      if (currentFontFamily !== lastFontFamily && currentFontFamily) {
        applyFormatting("font-family", currentFontFamily);
        console.log("Font family changed to:", currentFontFamily);
        lastFontFamily = currentFontFamily;
      }

      // Check for text color change
      if (currentTextColor !== lastTextColor && currentTextColor) {
        applyFormatting("color", currentTextColor);
        console.log("Text color changed to:", currentTextColor);
        lastTextColor = currentTextColor;
      }
    }, 500); // Check every 500ms
  } else {
    console.error(
      "Font size, font family, or text color elements not found. Please check selectors '#fontSizeSelect', '#fontFamilySelect', and '#textColorInput'."
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

  // Handle component addition to replace text with text or heading component
  grapeEditor.on("component:add", (component) => {
    console.log("Component added, content:", component.get("content"));
    if (component.get("content") === "addTextButton") {
      const selected = grapeEditor.getSelected();
      const wrapper = grapeEditor.getWrapper();

      // Determine the target component
      let targetComponent = wrapper; // Default to root wrapper
      if (selected) {
        if (isValidContainer(selected)) {
          targetComponent = selected; // Use selected div or section
        } else {
          // Traverse up to find a valid parent
          let parent = selected.parent();
          while (parent && parent !== wrapper) {
            if (isValidContainer(parent)) {
              targetComponent = parent;
              break;
            }
            parent = parent.parent();
          }
        }
      }

      // Define the text component configuration
      const textConfig = {
        type: "text",
        tagName: "p",
        content: "New Text",
        editable: true,
      };

      // Replace the text component with the new text component
      console.log("Replacing 'addTextButton' with text component");
      component.replaceWith(textConfig);
      grapeEditor.select(component);
      showEditTextPanel();
      updateButtonStates();
      updateSampleTextPreview();
    } else if (component.get("content") === "addHeadingButton") {
      const selected = grapeEditor.getSelected();
      const wrapper = grapeEditor.getWrapper();

      // Determine the target component
      let targetComponent = wrapper; // Default to root wrapper
      if (selected) {
        if (isValidContainer(selected)) {
          targetComponent = selected; // Use selected div or section
        } else {
          // Traverse up to find a valid parent
          let parent = selected.parent();
          while (parent && parent !== wrapper) {
            if (isValidContainer(parent)) {
              targetComponent = parent;
              break;
            }
            parent = parent.parent();
          }
        }
      }

      // Define the heading component configuration
      const headingConfig = {
        type: "text",
        tagName: "h1",
        content: applyFormattingWithExecCommand("New Heading", "bold"), // Apply bold formatting
        editable: true,
      };

      // Replace the text component with the new heading component
      console.log("Replacing 'addHeadingButton' with heading component");
      component.replaceWith(headingConfig);
      grapeEditor.select(component);
      applyFormatting("formatBlock", "h1");
      showEditTextPanel();
      updateButtonStates();
      updateSampleTextPreview();
    }
  });

  // Update button states, sample text preview, and show/hide sidebar on selection or content change
  grapeEditor.on("component:selected", () => {
    const selected = grapeEditor.getSelected();
    if (selected && isTextComponent(selected)) {
      showEditTextPanel(); // Show the text editor sidebar
    }
    updateButtonStates();
    updateSampleTextPreview();
  });

  grapeEditor.on("component:deselected", () => {
    hideEditTextPanel(); // Hide the text editor sidebar
    updateButtonStates();
    updateSampleTextPreview();
  });

  grapeEditor.on("component:update", () => {
    const selected = grapeEditor.getSelected();
    if (selected && isTextComponent(selected)) {
      showEditTextPanel(); // Ensure the sidebar remains visible if a text component is still selected
    }
    updateButtonStates();
    updateSampleTextPreview();
  });
})();
