/**
 * Style Editor for GrapesJS
 * Implements styling for components with two-way binding
 * Supports background, layout, size, spacing, and border styles
 * Preserves 'auto' values for inputs if explicitly set; defaults to '0' for border-width, border-radius, padding, and margin, and 'auto' for constraints when undefined
 * Fixes two-way binding to update sidebar immediately on component selection
 * Adds programmatic change detection for background and border color inputs
 * Supports navbar and footer component styling
 * Ensures no spaces between values and units (e.g., '10px', not '10 px')
 * Handles shorthand properties for padding, margin, border, and border-radius to apply consistent values to all sides/corners
 */

// ==========================================================================
// Shared DOM Elements and Utilities
// ==========================================================================

// Background color elements
const backgroundColorInput = document.getElementById("backgroundColorInput");
const presetColors = document.querySelectorAll(".preset-color");

// Border color elements
const borderColorInput = document.getElementById("borderColorInput");
const borderColorBadge = document.getElementById("borderColorBadge");

// Alignment buttons
const elementAlignmentButtons = document.querySelectorAll(
  "#otherStyleContainerContent .text_style_inner_container button[data-align]"
);

// Constraint inputs
const constraintInputs = {
  left: document.getElementById("element-position-left"),
  top: document.getElementById("element-position-top"),
  bottom: document.getElementById("element-position-bottom"),
  right: document.getElementById("element-position-right"),
};

// Display dropdown
const displayDropdown = document.querySelector(
  "#otherStyleContainerContent #devicesDropDown"
);
const displaySelected = displayDropdown?.querySelector(".selected");
const displayItems = displayDropdown?.querySelectorAll(".dropdown-item");

// Position dropdown
const positionDropdown = document.querySelector(
  "#otherStyleContainerContent #positionDropDown"
);
const positionSelected = positionDropdown?.querySelector(".selected");
const positionItems = positionDropdown?.querySelectorAll(".dropdown-item");

// Size inputs and units
const sizeInputs = {
  width: {
    input: document.getElementById("element-size-width"),
    unit: document.querySelector("#widthDropDown #element-width-unit"),
    unitItems: document.querySelectorAll("#widthDropDown .dropdown-item"),
  },
  height: {
    input: document.getElementById("element-size-height"),
    unit: document.querySelector("#heightDropDown #element-height-unit"),
    unitItems: document.querySelectorAll("#heightDropDown .dropdown-item"),
  },
  maxWidth: {
    input: document.getElementById("element-size-max-width"),
    unit: document.querySelector("#maxWidthDropDown #element-max-width-unit"),
    unitItems: document.querySelectorAll("#maxWidthDropDown .dropdown-item"),
  },
  maxHeight: {
    input: document.getElementById("element-size-max-height"),
    unit: document.querySelector("#maxHeightDropDown #element-max-height-unit"),
    unitItems: document.querySelectorAll("#maxHeightDropDown .dropdown-item"),
  },
  minWidth: {
    input: document.getElementById("element-size-min-width"),
    unit: document.querySelector("#minWidthDropDown #element-min-width-unit"),
    unitItems: document.querySelectorAll("#minWidthDropDown .dropdown-item"),
  },
  minHeight: {
    input: document.getElementById("element-size-min-height"),
    unit: document.querySelector("#minHeightDropDown #element-min-height-unit"),
    unitItems: document.querySelectorAll("#minHeightDropDown .dropdown-item"),
  },
};

// Padding inputs
const elementPaddingInputs = {
  left: document.getElementById("element-padding-left"),
  top: document.getElementById("element-padding-top"),
  bottom: document.getElementById("element-padding-bottom"),
  right: document.getElementById("element-padding-right"),
};

// Margin inputs
const elementMarginInputs = {
  left: document.getElementById("element-margin-left"),
  top: document.getElementById("element-margin-top"),
  bottom: document.getElementById("element-margin-bottom"),
  right: document.getElementById("element-margin-right"),
};

// Border inputs
const borderStyleDropdown = document.querySelector(
  "#otherStyleContainerContent #borderStyleDropDown"
);
const borderStyleSelected = borderStyleDropdown?.querySelector("#borderStyle");
const borderStyleItems =
  borderStyleDropdown?.querySelectorAll(".dropdown-item");

const borderWidthInputs = {
  left: document.getElementById("border-left-width"),
  top: document.getElementById("border-top-width"),
  bottom: document.getElementById("border-bottom-width"),
  right: document.getElementById("border-right-width"),
};

const borderRadiusInputs = {
  topLeft: document.getElementById("border-top-left-radius"),
  topRight: document.getElementById("border-top-right-radius"),
  bottomLeft: document.getElementById("border-bottom-left-radius"),
  bottomRight: document.getElementById("border-bottom-right-radius"),
};

// Track user-modified inputs per component
const modifiedInputs = new Map();

// Function to sanitize unit values to prevent spaces
function sanitizeUnit(unit) {
  const validUnits = ["px", "rem", "%"];
  const trimmedUnit = unit?.trim();
  return validUnits.includes(trimmedUnit) ? trimmedUnit : "px";
}

// Function to extract numeric value and unit from style
function extractValueAndUnit(styleValue, isConstraintOrSpacing = false) {
  if (!styleValue) {
    return isConstraintOrSpacing
      ? {
          value: isConstraintOrSpacing === "constraint" ? "auto" : "0",
          unit: isConstraintOrSpacing === "constraint" ? "" : "px",
        }
      : { value: "auto", unit: "" };
  }
  if (styleValue === "auto" || styleValue === "none") {
    return { value: styleValue, unit: "" };
  }
  const match = styleValue.match(/^(\d*\.?\d+)(px|rem|%)$/);
  return match
    ? { value: parseFloat(match[1]), unit: match[2] }
    : { value: 0, unit: "px" };
}

// Function to parse shorthand properties (padding, margin, border-width, border-radius, border)
function parseShorthand(property, type = "spacing") {
  if (!property || property === "none") {
    if (type === "border") {
      return {
        width: { top: "0px", right: "0px", bottom: "0px", left: "0px" },
        style: "none",
        color: "#000000",
      };
    }
    return {
      top: type === "spacing" ? "0px" : "auto",
      right: type === "spacing" ? "0px" : "auto",
      bottom: type === "spacing" ? "0px" : "auto",
      left: type === "spacing" ? "0px" : "auto",
    };
  }
  if (property === "auto" && type !== "border") {
    return { top: "auto", right: "auto", bottom: "auto", left: "auto" };
  }

  if (type === "border") {
    // Handle shorthand border (e.g., "2px solid #000")
    const parts = property.split(/\s+/);
    let width = "0px",
      style = "none",
      color = "#000000";

    parts.forEach((part) => {
      if (/^(\d*\.?\d+)(px|rem|%)$/.test(part)) {
        width = part;
      } else if (["solid", "dashed", "dotted", "none"].includes(part)) {
        style = part;
      } else if (/^#[0-9A-Fa-f]{6}$|^#[0-9A-Fa-f]{8}$/.test(part)) {
        color = part;
      }
    });

    return {
      width: { top: width, right: width, bottom: width, left: width },
      style,
      color,
    };
  }

  if (typeof property !== "string") {
    console.warn("Invalid shorthand property, expected string, got:", property);
    return {
      top: type === "spacing" ? "0px" : "auto",
      right: type === "spacing" ? "0px" : "auto",
      bottom: type === "spacing" ? "0px" : "auto",
      left: type === "spacing" ? "0px" : "auto",
    };
  }

  const values = property
    .trim()
    .split(/\s+/)
    .map((val) => (val === "auto" ? "auto" : val));

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
  } else if (values.length === 4) {
    top = values[0];
    right = values[1];
    bottom = values[2];
    left = values[3];
  } else {
    top = right = bottom = left = type === "spacing" ? "0px" : "auto";
  }

  return { top, right, bottom, left };
}

// Debounce utility
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// ==========================================================================
// Component Style Utilities
// ==========================================================================

// Function to get the target component
function getTargetComponent(selected) {
  if (
    !selected ||
    typeof selected.getStyle !== "function" ||
    typeof selected.setStyle !== "function"
  ) {
    console.warn("Invalid component:", selected);
    return null;
  }
  return selected;
}

// Function to determine active alignment
function getActiveAlignment(styles) {
  const marginLeft = styles["margin-left"] || "0px";
  const marginRight = styles["margin-right"] || "0px";

  if (marginLeft === "0px" && marginRight === "0px") return "left";
  if (marginLeft === "auto" && marginRight === "auto") return "center";
  if (marginLeft !== "auto" && marginRight === "0px") return "right";
  return "left";
}

// Function to update sidebar inputs (two-way binding: component to UI)
function updateSidebarInputs() {
  const selected = grapeEditor.getSelected();
  const componentId = selected ? selected.cid : null;
  const modified = modifiedInputs.get(componentId) || new Set();

  if (!selected) {
    console.log("No selection, resetting sidebar.");
    if (backgroundColorInput) backgroundColorInput.value = "#FFFFFF";
    if (borderColorInput) borderColorInput.value = "#000000";
    elementAlignmentButtons.forEach((btn) => btn.classList.remove("active"));
    elementAlignmentButtons[0]?.classList.add("active");
    Object.values(constraintInputs).forEach((input) => {
      if (input) input.value = "";
      input.placeholder = "auto";
    });
    if (displaySelected) displaySelected.textContent = "Block";
    if (positionSelected) positionSelected.textContent = "Relative";
    Object.values(sizeInputs).forEach((size) => {
      if (size.input) size.input.value = "";
      size.input.placeholder = "auto";
      if (size.unit) size.unit.textContent = "px";
    });
    Object.values(elementPaddingInputs).forEach((input) => {
      if (input) input.value = "";
      input.placeholder = "0";
    });
    Object.values(elementMarginInputs).forEach((input) => {
      if (input) input.value = "";
      input.placeholder = "0";
    });
    if (borderStyleSelected) borderStyleSelected.textContent = "None";
    Object.values(borderWidthInputs).forEach((input) => {
      if (input) input.value = "";
      input.placeholder = "0";
    });
    Object.values(borderRadiusInputs).forEach((input) => {
      if (input) input.value = "";
      input.placeholder = "0";
    });
    return;
  }

  const target = getTargetComponent(selected);
  if (!target) return;

  const classes = selected.getClasses(); // e.g. ['add-to-cart']

  const cssRules = grapeEditor.Css.getAll();
  const classStyles = {};

  classes.forEach(cls => {
    const rule = cssRules.find(r => r.getSelectorsString() === `.${cls}`);
    if (rule) Object.assign(classStyles, rule.getStyle());
  });

  const el = selected.getEl();

  // tagName is always uppercase in HTML
  if (el.tagName === 'BUTTON') {
    const style = selected.getStyle();

    // Remove only background-color
    delete style['background-color'];

    selected.setStyle(style);
  }

  const styles = classStyles || {};

  // Background color
  const bgColor = styles["background-color"] || "#FFFFFF00";
  if (backgroundColorInput) backgroundColorInput.value = bgColor;

  // Border color (from border shorthand or border-color)
  const borderShorthand = styles["border"];
  const borderParsed = parseShorthand(borderShorthand, "border");
  const borderColor =
    styles["border-color"] || borderParsed.color || "#00000000";
  if (borderColorInput) borderColorInput.value = borderColor;

  // Alignment
  const currentAlign = getActiveAlignment(styles);
  elementAlignmentButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.align === currentAlign);
  });

  // Constraints
  Object.keys(constraintInputs).forEach((key) => {
    if (constraintInputs[key]) {
      const styleValue = styles[key] || "auto";
      const inputKey = `constraint-${key}`;
      constraintInputs[key].value = modified.has(inputKey)
        ? constraintInputs[key].value
        : styleValue === "auto" || styleValue === "none"
        ? ""
        : extractValueAndUnit(styleValue, "constraint").value;
      constraintInputs[key].placeholder =
        styleValue === "auto" || styleValue === "none" ? "auto" : "";
    }
  });

  // Display
  const display = styles["display"] || "Inline Block";
  if (displaySelected)
    displaySelected.textContent =
      display.charAt(0).toUpperCase() + display.slice(1);

  // Position
  const position = styles["position"] || "Static";
  if (positionSelected)
    positionSelected.textContent =
      position.charAt(0).toUpperCase() + position.slice(1);

  // Sizes
  Object.keys(sizeInputs).forEach((key) => {
    if (sizeInputs[key].input) {
      const styleKey =
        key === "maxWidth"
          ? "max-width"
          : key === "maxHeight"
          ? "max-height"
          : key === "minWidth"
          ? "min-width"
          : key === "minHeight"
          ? "min-height"
          : key;
      const styleValue = styles[styleKey] || "auto";
      const inputKey = `size-${key}`;
      const { value, unit } = extractValueAndUnit(styleValue);
      sizeInputs[key].input.value = modified.has(inputKey)
        ? sizeInputs[key].input.value
        : styleValue === "auto"
        ? ""
        : value;
      sizeInputs[key].input.placeholder = styleValue === "auto" ? "auto" : "";
      if (sizeInputs[key].unit)
        sizeInputs[key].unit.textContent = sanitizeUnit(unit) || "px";
    }
  });

  // Padding
  const paddingShorthand = styles["padding"];
  const paddingValues = parseShorthand(paddingShorthand, "spacing");
  Object.keys(elementPaddingInputs).forEach((key) => {
    if (elementPaddingInputs[key]) {
      const styleValue =
        styles[`padding-${key}`] || paddingValues[key] || "0px";
      const inputKey = `padding-${key}`;
      elementPaddingInputs[key].value = modified.has(inputKey)
        ? elementPaddingInputs[key].value
        : styleValue === "none" || styleValue === "auto"
        ? ""
        : extractValueAndUnit(styleValue, true).value;
      elementPaddingInputs[key].placeholder =
        styleValue === "none" || styleValue === "auto" ? styleValue : "0";
    }
  });

  // Margin
  const marginShorthand = styles["margin"];
  const marginValues = parseShorthand(marginShorthand, "spacing");
  Object.keys(elementMarginInputs).forEach((key) => {
    if (elementMarginInputs[key]) {
      const styleValue = styles[`margin-${key}`] || marginValues[key] || "0px";
      const inputKey = `margin-${key}`;
      elementMarginInputs[key].value = modified.has(inputKey)
        ? elementMarginInputs[key].value
        : styleValue === "none" || styleValue === "auto"
        ? ""
        : extractValueAndUnit(styleValue, true).value;
      elementMarginInputs[key].placeholder =
        styleValue === "none" || styleValue === "auto" ? styleValue : "0";
    }
  });

  // Border style
  const borderStyle = styles["border-style"] || borderParsed.style || "none";
  if (borderStyleSelected)
    borderStyleSelected.textContent =
      borderStyle.charAt(0).toUpperCase() + borderStyle.slice(1);

  // Border width
  const borderWidthShorthand = styles["border-width"];
  const borderWidthValues = borderWidthShorthand
    ? parseShorthand(borderWidthShorthand, "spacing")
    : borderParsed.width; // Use borderParsed.width directly if no border-width
  Object.keys(borderWidthInputs).forEach((key) => {
    if (borderWidthInputs[key]) {
      const styleValue =
        styles[`border-${key}-width`] || borderWidthValues[key] || "0px";
      const inputKey = `border-width-${key}`;
      borderWidthInputs[key].value = modified.has(inputKey)
        ? borderWidthInputs[key].value
        : styleValue === "none" || styleValue === "auto"
        ? ""
        : extractValueAndUnit(styleValue, true).value;
      borderWidthInputs[key].placeholder =
        styleValue === "none" || styleValue === "auto" ? styleValue : "0";
    }
  });

  // Border radius
  const borderRadiusShorthand = styles["border-radius"];
  const borderRadiusValues = parseShorthand(borderRadiusShorthand, "spacing");
  Object.keys(borderRadiusInputs).forEach((key) => {
    if (borderRadiusInputs[key]) {
      const styleKey =
        key === "topLeft"
          ? "border-top-left-radius"
          : key === "topRight"
          ? "border-top-right-radius"
          : key === "bottomLeft"
          ? "border-bottom-left-radius"
          : "border-bottom-right-radius";
      const styleValue = styles[styleKey] || borderRadiusValues[key] || "0px";
      const inputKey = `border-radius-${key}`;
      borderRadiusInputs[key].value = modified.has(inputKey)
        ? borderRadiusInputs[key].value
        : styleValue === "none" || styleValue === "auto"
        ? ""
        : extractValueAndUnit(styleValue, true).value;
      borderRadiusInputs[key].placeholder =
        styleValue === "none" || styleValue === "auto" ? styleValue : "0";
    }
  });
}

const elementDebouncedUpdateSidebarInputs = debounce(updateSidebarInputs, 50);

// Event listeners for component changes
grapeEditor.on("component:selected", (component) => {
  console.log("Component:selected event fired for:", component);
  updateSidebarInputs(); // Immediate update without debounce
});

grapeEditor.on("component:deselected", () => {
  console.log("Component:deselected event fired");
  modifiedInputs.clear(); // Clear modified inputs on deselection
  updateSidebarInputs();
});

grapeEditor.on("component:add", (component) => {
  console.log("Component:add event fired for:", component);
  if (getTargetComponent(component)) {
    elementDebouncedUpdateSidebarInputs();
  }
});

grapeEditor.on("component:style:update", (component) => {
  console.log("Component:style:update event fired for:", component);
  if (getTargetComponent(component)) {
    elementDebouncedUpdateSidebarInputs();
  }
});

// ==========================================================================
// Background and Border Color Functionality
// ==========================================================================

function applyBackgroundColor(target, color) {
  if (!target) return;
  const currentStyles = target.getStyle() || {};
  target.setStyle({ ...currentStyles, "background-color": color });
  target.trigger("component:update");
}

function applyBorderStyles(target, updates = {}) {
  if (!target) return;
  const currentStyles = target.getStyle() || {};
  const borderShorthand = currentStyles["border"];
  const borderParsed = parseShorthand(borderShorthand, "border");

  const newStyles = {
    ...currentStyles,
    "border-style":
      updates["border-style"] ||
      currentStyles["border-style"] ||
      borderParsed.style ||
      "none",
    "border-color":
      updates["border-color"] ||
      currentStyles["border-color"] ||
      borderParsed.color ||
      "#000000",
    "border-left-width": borderWidthInputs.left?.value
      ? `${borderWidthInputs.left.value}px`
      : currentStyles["border-left-width"] || borderParsed.width.left || "0px",
    "border-top-width": borderWidthInputs.top?.value
      ? `${borderWidthInputs.top.value}px`
      : currentStyles["border-top-width"] || borderParsed.width.top || "0px",
    "border-bottom-width": borderWidthInputs.bottom?.value
      ? `${borderWidthInputs.bottom.value}px`
      : currentStyles["border-bottom-width"] ||
        borderParsed.width.bottom ||
        "0px",
    "border-right-width": borderWidthInputs.right?.value
      ? `${borderWidthInputs.right.value}px`
      : currentStyles["border-right-width"] ||
        borderParsed.width.right ||
        "0px",
    "border-top-left-radius": borderRadiusInputs.topLeft?.value
      ? `${borderRadiusInputs.topLeft.value}px`
      : currentStyles["border-top-left-radius"] || "0px",
    "border-top-right-radius": borderRadiusInputs.topRight?.value
      ? `${borderRadiusInputs.topRight.value}px`
      : currentStyles["border-top-right-radius"] || "0px",
    "border-bottom-left-radius": borderRadiusInputs.bottomLeft?.value
      ? `${borderRadiusInputs.bottomLeft.value}px`
      : currentStyles["border-bottom-left-radius"] || "0px",
    "border-bottom-right-radius": borderRadiusInputs.bottomRight?.value
      ? `${borderRadiusInputs.bottomRight.value}px`
      : currentStyles["border-bottom-right-radius"] || "0px",
  };

  target.setStyle(newStyles);
  target.trigger("component:update");
}

function applyPaddingMargin(target) {
  if (!target) return;
  const currentStyles = target.getStyle() || {};
  const paddingShorthand = currentStyles["padding"];
  const marginShorthand = currentStyles["margin"];
  const paddingValues = parseShorthand(paddingShorthand, "spacing");
  const marginValues = parseShorthand(marginShorthand, "spacing");

  const newStyles = {
    ...currentStyles,
    "padding-left": elementPaddingInputs.left?.value
      ? `${elementPaddingInputs.left.value}px`
      : currentStyles["padding-left"] || paddingValues.left || "0px",
    "padding-top": elementPaddingInputs.top?.value
      ? `${elementPaddingInputs.top.value}px`
      : currentStyles["padding-top"] || paddingValues.top || "0px",
    "padding-bottom": elementPaddingInputs.bottom?.value
      ? `${elementPaddingInputs.bottom.value}px`
      : currentStyles["padding-bottom"] || paddingValues.bottom || "0px",
    "padding-right": elementPaddingInputs.right?.value
      ? `${elementPaddingInputs.right.value}px`
      : currentStyles["padding-right"] || paddingValues.right || "0px",
    "margin-left": elementMarginInputs.left?.value
      ? `${elementMarginInputs.left.value}px`
      : currentStyles["margin-left"] || marginValues.left || "0px",
    "margin-top": elementMarginInputs.top?.value
      ? `${elementMarginInputs.top.value}px`
      : currentStyles["margin-top"] || marginValues.top || "0px",
    "margin-bottom": elementMarginInputs.bottom?.value
      ? `${elementMarginInputs.bottom.value}px`
      : currentStyles["margin-bottom"] || marginValues.bottom || "0px",
    "margin-right": elementMarginInputs.right?.value
      ? `${elementMarginInputs.right.value}px`
      : currentStyles["margin-right"] || marginValues.right || "0px",
  };

  target.setStyle(newStyles);
  target.trigger("component:update");
}

function applyConstraints(target) {
  if (!target) return;
  const currentStyles = target.getStyle() || {};
  const newStyles = {
    ...currentStyles,
    left: constraintInputs.left?.value
      ? `${constraintInputs.left.value}px`
      : currentStyles.left || "auto",
    top: constraintInputs.top?.value
      ? `${constraintInputs.top.value}px`
      : currentStyles.top || "auto",
    bottom: constraintInputs.bottom?.value
      ? `${constraintInputs.bottom.value}px`
      : currentStyles.bottom || "auto",
    right: constraintInputs.right?.value
      ? `${constraintInputs.right.value}px`
      : currentStyles.right || "auto",
  };

  target.setStyle(newStyles);
  target.trigger("component:update");
}

function handleColorChange(newColor, isBorder = false) {
  if (
    !newColor ||
    !(/^#[0-9A-Fa-f]{6}$/.test(newColor) || /^#[0-9A-Fa-f]{8}$/.test(newColor))
  ) {
    console.warn(`Invalid color format: ${newColor}`);
    return;
  }

  const selected = grapeEditor.getSelected();
  const target = getTargetComponent(selected);
  if (target) {
    if (isBorder) {
      applyBorderStyles(target, { "border-color": newColor });
    } else {
      applyBackgroundColor(target, newColor);
    }
  }
}

// Override value property for backgroundColorInput
if (backgroundColorInput) {
  const originalDescriptor = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    "value"
  );
  Object.defineProperty(backgroundColorInput, "value", {
    set: function (newValue) {
      if (this.value !== newValue) {
        originalDescriptor.set.call(this, newValue);
        console.log("Programmatic background color change detected:", newValue);
        handleColorChange(newValue, false);
      }
    },
    get: function () {
      return originalDescriptor.get.call(this);
    },
  });
  backgroundColorInput.addEventListener("input", () => {
    console.log("Manual background color input:", backgroundColorInput.value);
    handleColorChange(backgroundColorInput.value, false);
  });
  backgroundColorInput.addEventListener("change", () => {
    console.log("Manual background color input:", backgroundColorInput.value);
    handleColorChange(backgroundColorInput.value, false);
  });
}

// Override value property for borderColorInput
if (borderColorInput) {
  const originalDescriptor = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    "value"
  );
  Object.defineProperty(borderColorInput, "value", {
    set: function (newValue) {
      if (this.value !== newValue) {
        originalDescriptor.set.call(this, newValue);
        console.log("Programmatic border color change detected:", newValue);
        handleColorChange(newValue, true);
      }
    },
    get: function () {
      return originalDescriptor.get.call(this);
    },
  });
  borderColorInput.addEventListener("input", () => {
    console.log("Manual border color input:", borderColorInput.value);
    handleColorChange(borderColorInput.value, true);
  });
  borderColorInput.addEventListener("change", () => {
    console.log("Manual border color input:", borderColorInput.value);
    handleColorChange(borderColorInput.value, true);
  });
}

presetColors.forEach((preset) => {
  preset.addEventListener("click", () => {
    const color = preset.dataset.color;
    const isBorderPreset = preset
      .closest(".color-picker-panel")
      ?.contains(borderColorInput);
    const input = isBorderPreset ? borderColorInput : backgroundColorInput;
    if (input) input.value = color; // Triggers the overridden setter
  });
});

// ==========================================================================
// Alignment Functionality
// ==========================================================================

function applyAlignment(target, align) {
  if (!target) return;
  const currentStyles = target.getStyle() || {};
  let marginLeft, marginRight;
  switch (align) {
    case "left":
      marginLeft = "0px";
      marginRight = "0px";
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
      marginRight = "0px";
  }

  const newStyles = {
    ...currentStyles,
    display: currentStyles.display || "block",
    "margin-left": marginLeft,
    "margin-right": marginRight,
    float: "none",
  };

  const parent = target.parent();
  if (parent) {
    const parentStyles = parent.getStyle() || {};
    if (!parentStyles.width || parentStyles.width === "auto") {
      parent.setStyle({
        ...parentStyles,
        width: "100%",
        display: parentStyles.display || "block",
      });
    }
  }

  target.setStyle(newStyles);
  target.trigger("component:update");
  target.view.render();
}

elementAlignmentButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const align = button.dataset.align;
    const selected = grapeEditor.getSelected();
    const componentId = selected ? selected.cid : null;
    if (componentId) {
      const modified = modifiedInputs.get(componentId) || new Set();
      modified.add("margin-left").add("margin-right");
      modifiedInputs.set(componentId, modified);
    }
    const target = getTargetComponent(selected);
    if (target) {
      applyAlignment(target, align);
      elementAlignmentButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
    }
  });
});

// ==========================================================================
// Constraint Functionality
// ==========================================================================

Object.values(constraintInputs).forEach((input, index) => {
  if (input) {
    input.addEventListener("input", () => {
      const selected = grapeEditor.getSelected();
      const componentId = selected ? selected.cid : null;
      if (componentId) {
        const modified = modifiedInputs.get(componentId) || new Set();
        modified.add(`constraint-${Object.keys(constraintInputs)[index]}`);
        modifiedInputs.set(componentId, modified);
      }
      const target = getTargetComponent(selected);
      if (target) applyConstraints(target);
    });
  } else {
    console.error(
      `Constraint input for direction ${
        Object.keys(constraintInputs)[index]
      } not found.`
    );
  }
});

// ==========================================================================
// Display Functionality
// ==========================================================================

function applyDisplay(target, display) {
  if (!target) return;
  const currentStyles = target.getStyle() || {};
  const newStyles = { ...currentStyles, display: display.toLowerCase() };
  target.setStyle(newStyles);
  target.trigger("component:update");
}

displayItems.forEach((item) => {
  item.addEventListener("click", () => {
    const display = item.textContent;
    if (displaySelected) displaySelected.textContent = display;
    const selected = grapeEditor.getSelected();
    const target = getTargetComponent(selected);
    if (target) applyDisplay(target, display);
  });
});

// ==========================================================================
// Position Functionality
// ==========================================================================

function applyPosition(target, position) {
  if (!target) return;
  const currentStyles = target.getStyle() || {};
  const newStyles = { ...currentStyles, position: position.toLowerCase() };
  target.setStyle(newStyles);
  target.trigger("component:update");
}

positionItems.forEach((item) => {
  item.addEventListener("click", () => {
    const position = item.textContent;
    if (positionSelected) positionSelected.textContent = position;
    const selected = grapeEditor.getSelected();
    const target = getTargetComponent(selected);
    if (target) applyPosition(target, position);
  });
});

// ==========================================================================
// Sizes Functionality
// ==========================================================================

function applySizes(target) {
  if (!target) return;

  // Helper to get value + unit safely
  const getValueWithUnit = (inputObj, defaultValue) => {
    const value = inputObj.input?.value;
    const unit = sanitizeUnit(inputObj.unit?.textContent);
    return value ? `${value}${unit}` : defaultValue;
  };

  const currentStyles = {
    ...(target.getStyle() || {}),
  };

  const newStyles = {
    ...currentStyles,
    width: getValueWithUnit(sizeInputs.width, currentStyles.width || "auto"),
    height: getValueWithUnit(sizeInputs.height, currentStyles.height || "auto"),
    "max-width": getValueWithUnit(
      sizeInputs.maxWidth,
      currentStyles["max-width"] || "none"
    ),
    "max-height": getValueWithUnit(
      sizeInputs.maxHeight,
      currentStyles["max-height"] || "none"
    ),
    "min-width": getValueWithUnit(
      sizeInputs.minWidth,
      currentStyles["min-width"] || "0px"
    ),
    "min-height": getValueWithUnit(
      sizeInputs.minHeight,
      currentStyles["min-height"] || "0px"
    ),
  };

  target.setStyle(newStyles);
  target.trigger("component:update");
}

Object.entries(sizeInputs).forEach(([key, value], index) => {
  if (value.input) {
    value.input.addEventListener("input", () => {
      const selected = grapeEditor.getSelected();
      const componentId = selected ? selected.cid : null;
      if (componentId) {
        const modified = modifiedInputs.get(componentId) || new Set();
        modified.add(`size-${key}`);
        modifiedInputs.set(componentId, modified);
      }
      const target = getTargetComponent(selected);
      if (target) applySizes(target);
    });
  } else {
    console.error(`Size input for ${key} not found.`);
  }
  value.unitItems.forEach((item) => {
    item.addEventListener("click", () => {
      if (value.unit) value.unit.textContent = sanitizeUnit(item.textContent);
      const selected = grapeEditor.getSelected();
      const componentId = selected ? selected.cid : null;
      if (componentId) {
        const modified = modifiedInputs.get(componentId) || new Set();
        modified.add(`size-${key}`);
        modifiedInputs.set(componentId, modified);
      }
      const target = getTargetComponent(selected);
      if (target) applySizes(target);
    });
  });
});

// ==========================================================================
// Padding and Margin Functionality
// ==========================================================================

Object.entries(elementPaddingInputs).forEach(([key, input], index) => {
  if (input) {
    input.addEventListener("input", () => {
      const selected = grapeEditor.getSelected();
      const componentId = selected ? selected.cid : null;
      if (componentId) {
        const modified = modifiedInputs.get(componentId) || new Set();
        modified.add(`padding-${key}`);
        modifiedInputs.set(componentId, modified);
      }
      const target = getTargetComponent(selected);
      if (target) applyPaddingMargin(target);
    });
  } else {
    console.error(`Padding input for direction ${key} not found.`);
  }
});

Object.entries(elementMarginInputs).forEach(([key, input], index) => {
  if (input) {
    input.addEventListener("input", () => {
      const selected = grapeEditor.getSelected();
      const componentId = selected ? selected.cid : null;
      if (componentId) {
        const modified = modifiedInputs.get(componentId) || new Set();
        modified.add(`margin-${key}`);
        modifiedInputs.set(componentId, modified);
      }
      const target = getTargetComponent(selected);
      if (target) applyPaddingMargin(target);
    });
  } else {
    console.error(`Margin input for direction ${key} not found.`);
  }
});

// ==========================================================================
// Border Styles Functionality
// ==========================================================================

if (borderStyleDropdown) {
  borderStyleItems.forEach((item) => {
    item.addEventListener("click", () => {
      const style = item.textContent.toLowerCase();
      if (borderStyleSelected)
        borderStyleSelected.textContent = item.textContent;
      const selected = grapeEditor.getSelected();
      const target = getTargetComponent(selected);
      if (target) applyBorderStyles(target, { "border-style": style });
    });
  });
}

Object.entries(borderWidthInputs).forEach(([key, value], index) => {
  if (value) {
    value.addEventListener("input", () => {
      const selected = grapeEditor.getSelected();
      const componentId = selected ? selected.cid : null;
      if (componentId) {
        const modified = modifiedInputs.get(componentId) || new Set();
        modified.add(`border-width-${key}`);
        modifiedInputs.set(componentId, modified);
      }
      const target = getTargetComponent(selected);
      if (target) applyBorderStyles(target);
    });
  } else {
    console.error(`Border width input for direction ${key} not found.`);
  }
});

Object.entries(borderRadiusInputs).forEach(([key, value], index) => {
  if (value) {
    value.addEventListener("input", () => {
      const selected = grapeEditor.getSelected();
      const componentId = selected ? selected.cid : null;
      if (componentId) {
        const modified = modifiedInputs.get(componentId) || new Set();
        modified.add(`border-radius-${key}`);
        modifiedInputs.set(componentId, modified);
      }
      const target = getTargetComponent(selected);
      if (target) applyBorderStyles(target);
    });
  } else {
    console.error(`Border radius input for direction ${key} not found.`);
  }
});

// Initialize badge colors
if (backgroundColorInput) {
  backgroundColorInput.style.backgroundColor = backgroundColorInput.value;
}
if (borderColorInput && borderColorBadge) {
  borderColorBadge.style.backgroundColor = borderColorInput.value;
}
