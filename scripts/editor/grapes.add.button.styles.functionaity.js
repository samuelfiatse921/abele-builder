/**
 * Button Editor Functionality for GrapesJS
 * Organized into distinct sections with comments and gaps
 * Aligned with image editor script for consistency
 */

// ==========================================================================
// Shared DOM Elements and Utilities
// ==========================================================================

// DOM elements for text input and background color
const buttonTextInput = document.getElementById("buttonText");
const buttonColorInput = document.getElementById("buttonColorInput");
const buttonColorBadge = document.getElementById("buttonColorButton");

// Padding and Margin input elements
const buttonPaddingInputs = {
  left: document.getElementById("button-padding-left"),
  top: document.getElementById("button-padding-top"),
  bottom: document.getElementById("button-padding-bottom"),
  right: document.getElementById("button-padding-right"),
};

const buttonMarginInputs = {
  left: document.getElementById("button-margin-left"),
  top: document.getElementById("button-margin-top"),
  bottom: document.getElementById("button-margin-bottom"),
  right: document.getElementById("button-margin-right"),
};

// Alignment, constraint, and position elements
const buttonAlignmentButtons = document.querySelectorAll(
  "#buttonStyleContainer .text_style_inner_container button[data-align]"
);
const buttonConstraintButtons = document.querySelectorAll(
  "#buttonStyleContainer .text_style_inner_container button[data-contraint]"
);
const buttonPositionSelect = document.querySelector(
  "#buttonStyleContainer .text_style_inner_container_position select"
);

// Function to extract numeric value from style (e.g., "10px" -> 10)
function extractNumber(styleValue) {
  if (!styleValue) return 0;
  const match = styleValue.match(/(\d+)/);
  return match ? parseInt(match[0], 10) : 0;
}

// Function to parse padding shorthand (e.g., "15px 25px" -> { top: 15, right: 25, bottom: 15, left: 25 })
function parsePaddingShorthand(padding) {
  if (!padding) return { top: 0, right: 0, bottom: 0, left: 0 };

  const values = padding.split(/\s+/).map((val) => extractNumber(val));
  let top, right, bottom, left;

  if (values.length === 1) {
    top = right = bottom = left = values[0];
  } else if (values.length === 2) {
    top = bottom = values[0];
    right = left = values[1];
  } else if (values.length === 3) {
    top = values[0];
    right = left = values[1];
    bottom = values[2];
  } else {
    top = values[0];
    right = values[1];
    bottom = values[2];
    left = values[3];
  }

  return { top, right, bottom, left };
}

// Function to parse margin shorthand (e.g., "10px 0" -> { top: 10, right: 0, bottom: 10, left: 0 })
function parseMarginShorthand(margin) {
  if (!margin) return { top: 0, right: 0, bottom: 0, left: 0 };

  const values = margin
    .split(/\s+/)
    .map((val) => (val === "auto" ? val : extractNumber(val)));
  let top, right, bottom, left;

  if (values.length === 1) {
    top = right = bottom = left = values[0];
  } else if (values.length === 2) {
    top = bottom = values[0];
    right = left = values[1];
  } else if (values.length === 3) {
    top = values[0];
    right = left = values[1];
    bottom = values[2];
  } else {
    top = values[0];
    right = values[1];
    bottom = values[2];
    left = values[3];
  }

  return { top, right, bottom, left };
}

// ==========================================================================
// Component Validation and Style Utilities
// ==========================================================================

// Function to get the target component (button only)
function getButtonTargetComponent(selected) {
  if (!selected || typeof selected.is !== "function") {
    console.warn(
      "Selected component is invalid or not a GrapesJS component:",
      selected
    );
    return null;
  }
  if (selected.is("button")) {
    if (
      typeof selected.getStyle !== "function" ||
      typeof selected.setStyle !== "function"
    ) {
      console.error(
        "Selected button component does not have expected methods (getStyle/setStyle):",
        selected
      );
      return null;
    }
    return selected;
  }
  return null;
}

// Function to validate that the selected component is a button
function validateButtonComponent(selected) {
  const target = getButtonTargetComponent(selected);
  // if (!target) {
  //   alert("Please select a button to apply this action.");
  //   return false;
  // }
  return target;
}

// Function to determine the active constraint based on position properties
function getActiveConstraint(styles) {
  const left = styles["left"] || "auto";
  const top = styles["top"] || "auto";
  const transform = styles["transform"] || "none";

  if (
    left === "50%" &&
    top === "50%" &&
    transform.includes("translate(-50%, -50%)")
  )
    return "center";
  if (left === "0px" && top === "0px" && transform === "none") return "left";
  if (
    left === "auto" &&
    top === "0px" &&
    transform.includes("translateX(-100%)")
  )
    return "right";
  if (
    left === "0px" &&
    top === "auto" &&
    transform.includes("translateY(-100%)")
  )
    return "down";
  return "left";
}

// Function to determine the active alignment based on margin properties
function getActiveAlignment(styles) {
  const marginLeft = styles["margin-left"] || styles.marginLeft || "auto";
  const marginRight = styles["margin-right"] || styles.marginRight || "auto";

  if (marginLeft === "0px" && marginRight === "auto") return "left";
  if (marginLeft === "auto" && marginRight === "0px") return "right";
  if (marginLeft === "auto" && marginRight === "auto") return "center";
  return "left";
}

// Debounce utility to prevent rapid event firing
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Function to update sidebar inputs based on selected button's properties
function updateButtonSidebarInputs() {
  const selected = grapeEditor.getSelected();
  if (selected === undefined) {
    console.log("Selection is undefined, skipping sidebar update.");
    return;
  }

  const target = getButtonTargetComponent(selected);

  if (!target) {
    if (buttonTextInput) buttonTextInput.value = "Button";
    if (buttonColorInput) buttonColorInput.value = "#007bff";
    if (buttonColorBadge) buttonColorBadge.style.backgroundColor = "#007bff";
    Object.values(buttonPaddingInputs).forEach((input) => {
      if (input) input.value = 0;
    });
    Object.values(buttonMarginInputs).forEach((input) => {
      if (input) input.value = 0;
    });
    buttonAlignmentButtons.forEach((button) =>
      button.classList.remove("active")
    );
    buttonConstraintButtons.forEach((button) =>
      button.classList.remove("active")
    );
    if (buttonPositionSelect) buttonPositionSelect.value = "relative";
    if (buttonAlignmentButtons[0])
      buttonAlignmentButtons[0].classList.add("active");
    if (buttonConstraintButtons[2])
      buttonConstraintButtons[2].classList.add("active");
    return;
  }

  const styles = target.getStyle() || {};

  // Update button text
  if (buttonTextInput) {
    buttonTextInput.value = target.get("content") || "Button";
  }

  // Update background color
  const bgColor = styles["background-color"] || "#007bff";
  if (buttonColorInput) buttonColorInput.value = bgColor;
  if (buttonColorBadge) buttonColorBadge.style.backgroundColor = bgColor;

  // Handle padding (support shorthand)
  const paddingShorthand = styles["padding"];
  let paddingValues = { top: 0, right: 0, bottom: 0, left: 0 };
  if (paddingShorthand) {
    paddingValues = parsePaddingShorthand(paddingShorthand);
  }

  Object.keys(buttonPaddingInputs).forEach((key) => {
    if (buttonPaddingInputs[key]) {
      const styleValue =
        styles[`padding-${key}`] ||
        styles[`padding${key.charAt(0).toUpperCase() + key.slice(1)}`] ||
        paddingValues[key] ||
        "0px";
      buttonPaddingInputs[key].value = extractNumber(styleValue);
    }
  });

  // Handle margin (support shorthand)
  const marginShorthand = styles["margin"];
  let marginValues = { top: 0, right: 0, bottom: 0, left: 0 };
  if (marginShorthand) {
    marginValues = parseMarginShorthand(marginShorthand);
  }

  Object.keys(buttonMarginInputs).forEach((key) => {
    if (buttonMarginInputs[key]) {
      const styleValue =
        styles[`margin-${key}`] ||
        styles[`margin${key.charAt(0).toUpperCase() + key.slice(1)}`] ||
        marginValues[key] ||
        "0px";
      const value = styleValue === "auto" ? 0 : extractNumber(styleValue);
      buttonMarginInputs[key].value = value;
    }
  });

  // Update alignment buttons
  const currentAlign = getActiveAlignment(styles);
  buttonAlignmentButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.align === currentAlign);
  });

  // Update constraint buttons
  const currentConstraint = getActiveConstraint(styles);
  buttonConstraintButtons.forEach((button) => {
    button.classList.toggle(
      "active",
      button.dataset.contraint === currentConstraint
    );
  });

  // Update position select
  const position = styles["position"] || "relative";
  if (buttonPositionSelect) buttonPositionSelect.value = position;
}

// Debounced version of updateButtonSidebarInputs
const debouncedUpdateButtonSidebarInputs = debounce(
  updateButtonSidebarInputs,
  50
);

// Update sidebar and manage UI visibility when a component is selected, deselected, or added
// Commented out to match imageEditor.js structure
grapeEditor.on("component:selected", () => {
  console.log("Button component:selected event fired");
  debouncedUpdateButtonSidebarInputs();
});

grapeEditor.on("component:deselected", () => {
  console.log("Button component:deselected event fired");
  debouncedUpdateButtonSidebarInputs();
});

grapeEditor.on("component:add", (component) => {
  console.log("Button component:add event fired");
  if (getButtonTargetComponent(component)) {
    debouncedUpdateButtonSidebarInputs();
  }
});

grapeEditor.on("component:style:update", (component) => {
  console.log("Button component:style:update event fired");
  if (getButtonTargetComponent(component)) {
    debouncedUpdateButtonSidebarInputs();
  }
});

// ==========================================================================
// Two-Way Binding for Button Text
// ==========================================================================

// Function to update the button text in the editor
function updateButtonText(target, text) {
  const targetComponent = validateButtonComponent(target);
  if (!targetComponent) return;

  targetComponent.set("content", text);
  targetComponent.trigger("component:update");
}

// Event listener for text input changes (two-way binding)
if (buttonTextInput) {
  buttonTextInput.addEventListener("input", () => {
    const newText = buttonTextInput.value;
    const selected = grapeEditor.getSelected();
    const target = validateButtonComponent(selected);
    if (!target) return;
    updateButtonText(target, newText);
  });
} else {
  console.error(
    "Button text input element not found. Please check the selector '#buttonText'."
  );
}

// ==========================================================================
// Background Color Functionality
// ==========================================================================

// Function to apply the background color to the selected button
function applyButtonBackgroundColor(target, color) {
  const targetComponent = validateButtonComponent(target);
  if (!targetComponent) return;

  const currentStyles = targetComponent.getStyle() || {};
  targetComponent.setStyle({
    ...currentStyles,
    "background-color": color,
  });
  targetComponent.trigger("component:update");
}

// Function to handle background color input changes
function handleButtonColorInputChange(newColor) {
  if (!newColor || !/^#[0-9A-Fa-f]{6}$/.test(newColor)) {
    console.warn(
      `Invalid color format: ${newColor}. Please use a valid hex color (e.g., #FF4C4C).`
    );
    return;
  }

  if (buttonColorBadge) {
    buttonColorBadge.style.backgroundColor = newColor;
  } else {
    console.error("Button color badge element not found.");
  }

  const selected = grapeEditor.getSelected();
  const target = validateButtonComponent(selected);
  if (!target) return;

  applyButtonBackgroundColor(target, newColor);
}

// Background color input event handlers
if (buttonColorInput) {
  buttonColorInput.addEventListener("input", () => {
    const newColor = buttonColorInput.value;
    handleButtonColorInputChange(newColor);
  });

  buttonColorInput.addEventListener("change", () => {
    const newColor = buttonColorInput.value;
    handleButtonColorInputChange(newColor);
  });
} else {
  console.error(
    "Button color input element not found. Please check the selector '#buttonColorInput'."
  );
}

if (buttonColorInput) {
  // Store the original descriptor
  const originalDescriptor = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    "value"
  );

  // Override the 'value' property
  Object.defineProperty(buttonColorInput, "value", {
    set: function (newValue) {
      // Only trigger if the value actually changes
      if (this.value !== newValue) {
        originalDescriptor.set.call(this, newValue); // Set the new value
        console.log("Programmatic change detected:", newValue);
        handleButtonColorInputChange(newValue); // Your handler
      }
    },
    get: function () {
      return originalDescriptor.get.call(this); // Keep original getter
    },
  });
}

// Initialize badge color on load
if (buttonColorInput && buttonColorBadge) {
  buttonColorBadge.style.backgroundColor = buttonColorInput.value;
} else {
  console.error(
    "Button color input or badge element not found. Please check the selectors '#buttonColorInput' and '#buttonColorButton'."
  );
}

// ==========================================================================
// Padding and Margin Functionality with Two-Way Binding
// ==========================================================================

// Function to apply padding and margin to the selected button
function applyButtonPaddingMargin(target) {
  const targetComponent = validateButtonComponent(target);
  if (!targetComponent) return;

  const currentStyles = targetComponent.getStyle() || {};

  // Helper function to get the current or input value for a property
  const getCurrentOrInputValue = (input, styleKey) => {
    const inputValue = input ? parseInt(input.value, 10) : null;
    const styleValue = currentStyles[styleKey]
      ? extractNumber(currentStyles[styleKey])
      : 0;
    return inputValue !== null && !isNaN(inputValue) ? inputValue : styleValue;
  };

  const newStyles = {
    ...currentStyles,
    "padding-left": `${getCurrentOrInputValue(
      buttonPaddingInputs.left,
      "padding-left"
    )}px`,
    "padding-top": `${getCurrentOrInputValue(
      buttonPaddingInputs.top,
      "padding-top"
    )}px`,
    "padding-bottom": `${getCurrentOrInputValue(
      buttonPaddingInputs.bottom,
      "padding-bottom"
    )}px`,
    "padding-right": `${getCurrentOrInputValue(
      buttonPaddingInputs.right,
      "padding-right"
    )}px`,
    "margin-left": `${getCurrentOrInputValue(
      buttonMarginInputs.left,
      "margin-left"
    )}px`,
    "margin-top": `${getCurrentOrInputValue(
      buttonMarginInputs.top,
      "margin-top"
    )}px`,
    "margin-bottom": `${getCurrentOrInputValue(
      buttonMarginInputs.bottom,
      "margin-bottom"
    )}px`,
    "margin-right": `${getCurrentOrInputValue(
      buttonMarginInputs.right,
      "margin-right"
    )}px`,
  };

  targetComponent.setStyle(newStyles);
  targetComponent.trigger("component:update");
  targetComponent.trigger("change:style");
}

// Padding and margin event listeners (sidebar → component)
Object.values(buttonPaddingInputs).forEach((input, index) => {
  if (input) {
    input.addEventListener("input", () => {
      const selected = grapeEditor.getSelected();
      const target = validateButtonComponent(selected);
      if (!target) return;
      applyButtonPaddingMargin(target);
    });
  } else {
    console.error(
      `Padding input for direction ${
        Object.keys(buttonPaddingInputs)[index]
      } not found.`
    );
  }
});

Object.values(buttonMarginInputs).forEach((input, index) => {
  if (input) {
    input.addEventListener("input", () => {
      const selected = grapeEditor.getSelected();
      const target = validateButtonComponent(selected);
      if (!target) return;
      applyButtonPaddingMargin(target);
    });
  } else {
    console.error(
      `Margin input for direction ${
        Object.keys(buttonMarginInputs)[index]
      } not found.`
    );
  }
});

// ==========================================================================
// Alignment Functionality
// ==========================================================================

// Function to apply alignment to the selected button
function applyButtonAlignment(target, align) {
  const targetComponent = validateButtonComponent(target);
  if (!targetComponent) return;

  const currentStyles = targetComponent.getStyle() || {};

  let marginLeft, marginRight;
  switch (align) {
    case "left":
      marginLeft = "0px";
      marginRight = "auto";
      break;
    case "center":
      marginLeft = "auto";
      marginRight = "auto";
      break;
    case "right":
      marginLeft = "auto";
      marginRight = "0px";
      break;
    default:
      marginLeft = "0px";
      marginRight = "auto";
  }

  // Ensure the button is positioned correctly for alignment
  const newStyles = {
    ...currentStyles,
    display: "block",
    "margin-left": marginLeft,
    "margin-right": marginRight,
    float: "none", // Reset any float properties that might interfere
    position: currentStyles.position || "relative", // Ensure position is not interfering
  };

  // Ensure the parent container supports alignment
  const parent = targetComponent.parent();
  if (parent) {
    const parentStyles = parent.getStyle() || {};
    if (!parentStyles.width || parentStyles.width === "auto") {
      parent.setStyle({
        ...parentStyles,
        width: "100%", // Ensure the parent has a defined width for margins to work
        display: parentStyles.display || "block", // Ensure the parent is a block element
      });
      console.log(
        "Set parent width to 100% to enable alignment:",
        parentStyles
      );
    }
  } else {
    console.warn("Parent component not found for button:", targetComponent);
  }

  // console.log(`Applying alignment ${align} with styles:`, newStyles);
  targetComponent.setStyle(newStyles);
  targetComponent.trigger("component:update");
  targetComponent.trigger("change:style");
  // Force a re-render if needed
  targetComponent.view.render();
}

// Alignment event listeners
buttonAlignmentButtons.forEach((button, index) => {
  if (button) {
    button.addEventListener("click", () => {
      const align = button.dataset.align;
      const selected = grapeEditor.getSelected();
      const target = validateButtonComponent(selected);
      if (!target) return;
      applyButtonAlignment(target, align);
      buttonAlignmentButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
    });
  } else {
    console.error(`Alignment button at index ${index} not found.`);
  }
});

// ==========================================================================
// Constraints Functionality
// ==========================================================================

// Function to apply constraint to the selected button
function applyButtonConstraint(target, constraint) {
  const targetComponent = validateButtonComponent(target);
  if (!targetComponent) return;

  const currentStyles = targetComponent.getStyle() || {};

  let positionStyles;
  switch (constraint) {
    case "left":
      positionStyles = {
        position: currentStyles["position"] || "relative",
        left: "0px",
        right: "auto",
        transform: "none",
      };
      break;
    case "right":
      positionStyles = {
        position: currentStyles["position"] || "relative",
        left: "auto",
        right: "0px",
      };
      break;
    case "up":
      positionStyles = {
        position: currentStyles["position"] || "relative",
        top: "0px",
        bottom: "auto",
        transform: "none",
      };
      break;
    case "down":
      positionStyles = {
        position: currentStyles["position"] || "relative",
        top: "auto",
        bottom: "0px",
      };
      break;
    case "center":
    default:
      positionStyles = {
        position: currentStyles["position"] || "relative",
        left: "50%",
        right: "auto",
        top: "50%",
        bottom: "auto",
        transform: "translate(-50%, -50%)",
      };
      break;
  }

  const newStyles = {
    ...currentStyles,
    ...positionStyles,
  };

  targetComponent.setStyle(newStyles);
  targetComponent.trigger("component:update");
}

// Constraint event listeners
buttonConstraintButtons.forEach((button, index) => {
  if (button) {
    button.addEventListener("click", () => {
      const constraint = button.dataset.contraint;
      const selected = grapeEditor.getSelected();
      const target = validateButtonComponent(selected);
      if (!target) return;
      applyButtonConstraint(target, constraint);
      buttonConstraintButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
    });
  } else {
    console.error(`Constraint button at index ${index} not found.`);
  }
});

// ==========================================================================
// Position Functionality
// ==========================================================================

// Function to apply position to the selected button
function applyButtonPosition(target, position) {
  const targetComponent = validateButtonComponent(target);
  if (!targetComponent) return;

  const currentStyles = targetComponent.getStyle() || {};

  const newStyles = {
    ...currentStyles,
    position: position,
  };

  targetComponent.setStyle(newStyles);
  targetComponent.trigger("change:style");
  updateButtonSidebarInputs();
}

// Position event listener
if (buttonPositionSelect) {
  buttonPositionSelect.addEventListener("change", () => {
    const position = buttonPositionSelect.value;
    const selected = grapeEditor.getSelected();
    const target = validateButtonComponent(selected);
    if (!target) return;
    applyButtonPosition(target, position);
  });
} else {
  console.error(
    "Position select element not found. Please check the selector '#buttonStyleContainer .text_style_inner_container_position select'."
  );
}
