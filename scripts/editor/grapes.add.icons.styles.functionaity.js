/**
 * Icon Editor Functionality for GrapesJS
 * Organized into distinct sections with comments and gaps
 */

// ==========================================================================
// Shared DOM Elements and Utilities
// ==========================================================================

// UI container for the icon editor
const iconsStyleContainer = document.getElementById("iconsStyleContainer");

// DOM elements for size and color
const iconSizeCustom = document.getElementById("iconSizeCustom");
const iconColorInput = document.getElementById("iconColorInput");
const iconColorBadge = document.getElementById("iconColorBadge");

// Padding and Margin input elements
const iconPaddingInputs = {
  left: document.getElementById("icon-padding-left"),
  top: document.getElementById("icon-padding-top"),
  bottom: document.getElementById("icon-padding-bottom"),
  right: document.getElementById("icon-padding-right"),
};

const iconMarginInputs = {
  left: document.getElementById("icon-margin-left"),
  top: document.getElementById("icon-margin-top"),
  bottom: document.getElementById("icon-margin-bottom"),
  right: document.getElementById("icon-margin-right"),
};

const iconConstraintButtons = document.querySelectorAll(
  "#iconsStyleContainer .text_style_inner_container_contraints button"
);
const iconPositionSelect = document.querySelector(
  "#iconsStyleContainer .text_style_inner_container_position select"
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

function getIconTargetComponent(selected) {
  if (!selected || typeof selected.is !== "function") {
    return null;
  }
  if (selected.is("icon")) {
    if (
      typeof selected.getStyle !== "function" ||
      typeof selected.setStyle !== "function"
    ) {
      console.error(
        "Selected icon component does not have expected methods (getStyle/setStyle):",
        selected
      );
      return null;
    }
    return selected;
  }
  return null;
}

function validateIconComponent(selected, showAlert = true) {
  const target = getIconTargetComponent(selected);
  if (!target && showAlert) {
    showFlashMessage(
      "Please select an icon to apply this action.",
      "Invalid component selected",
      "error",
      5000
    );
  }
  return target;
}

function getActiveConstraint(styles) {
  const left = styles["left"] || "auto";
  const top = styles["top"] || "auto";
  const right = styles["right"] || "auto";
  const bottom = styles["bottom"] || "auto";
  const transform = styles["transform"] || "none";
  const position = styles["position"] || "relative";

  console.log("Checking constraint with styles:", styles);

  if (position === "absolute" || position === "fixed") {
    if (
      left === "50%" &&
      top === "50%" &&
      transform.includes("translate(-50%, -50%)")
    )
      return "center";
    if (
      left === "0px" &&
      top === "0px" &&
      transform === "none" &&
      right === "auto" &&
      bottom === "auto"
    )
      return "left";
    if (
      right === "0px" &&
      top === "0px" &&
      transform.includes("translateX(-100%)") &&
      left === "auto"
    )
      return "right";
    if (
      left === "0px" &&
      bottom === "0px" &&
      transform.includes("translateY(-100%)") &&
      top === "auto"
    )
      return "down";
    if (
      left === "0px" &&
      top === "0px" &&
      transform === "none" &&
      bottom === "auto" &&
      right === "auto" &&
      position === "relative"
    )
      return "up";
  } else if (position === "relative") {
    if (left === "0px" && top === "0px" && transform === "none") return "up";
    if (left === "0px" && bottom === "0px" && transform === "none")
      return "down";
  }
  return "left"; // Default fallback
}

// ==========================================================================
// Two-Way Binding for Icon Styles
// ==========================================================================

function updateIconSidebarInputs() {
  const selected = grapeEditor.getSelected();
  console.log("Updating sidebar inputs for selected:", selected);
  if (selected === undefined) {
    console.log("Selection is undefined, skipping sidebar update.");
    return;
  }

  const target = getIconTargetComponent(selected);

  if (!target) {
    if (iconSizeCustom) iconSizeCustom.value = "24";
    if (iconColorInput) iconColorInput.value = "#000000";
    if (iconColorBadge) iconColorBadge.style.backgroundColor = "#000000";
    Object.values(iconPaddingInputs).forEach((input) => {
      if (input) input.value = 0;
    });
    Object.values(iconMarginInputs).forEach((input) => {
      if (input) input.value = 0;
    });
    iconConstraintButtons.forEach((button) =>
      button.classList.remove("active")
    );
    if (iconPositionSelect) iconPositionSelect.value = "relative";

    if (iconConstraintButtons[0])
      iconConstraintButtons[0].classList.add("active");
    return;
  }

  const styles = target.getStyle() || {};

  // Update size
  if (iconSizeCustom) {
    const fontSize = extractNumber(styles["font-size"] || "24px");
    const sizes = { small: 16, medium: 24, large: 32, extraLarge: 48 };
    let closestSize = "medium"; // Default to medium if no match
    let minDiff = Infinity;
    for (const [sizeName, sizeValue] of Object.entries(sizes)) {
      const diff = Math.abs(sizeValue - fontSize);
      if (diff < minDiff) {
        minDiff = diff;
        closestSize = sizeName;
      }
    }
    if (fontSize in sizes) {
      iconSizeCustom.value = "";
    } else {
      iconSizeCustom.value = fontSize > 0 ? fontSize : "";
    }
  }

  // Update color
  const color = styles["color"] || "#000000";
  if (iconColorInput) iconColorInput.value = color;
  if (iconColorBadge) iconColorBadge.style.backgroundColor = color;

  // Update padding
  const paddingShorthand = styles["padding"];
  let paddingValues = { top: 0, right: 0, bottom: 0, left: 0 };
  if (paddingShorthand) {
    paddingValues = parsePaddingShorthand(paddingShorthand);
  }

  Object.keys(iconPaddingInputs).forEach((key) => {
    if (iconPaddingInputs[key]) {
      const styleValue =
        styles[`padding-${key}`] ||
        styles[`padding${key.charAt(0).toUpperCase() + key.slice(1)}`] ||
        paddingValues[key] ||
        "0px";
      iconPaddingInputs[key].value = extractNumber(styleValue);
    }
  });

  // Update margin
  const marginShorthand = styles["margin"];
  let marginValues = { top: 0, right: 0, bottom: 0, left: 0 };
  if (marginShorthand) {
    marginValues = parseMarginShorthand(marginShorthand);
  }

  Object.keys(iconMarginInputs).forEach((key) => {
    if (iconMarginInputs[key]) {
      const styleValue =
        styles[`margin-${key}`] ||
        styles[`margin${key.charAt(0).toUpperCase() + key.slice(1)}`] ||
        marginValues[key] ||
        "0px";
      const value = styleValue === "auto" ? 0 : extractNumber(styleValue);
      iconMarginInputs[key].value = value;
    }
  });

  // Update constraint buttons
  const currentConstraint = getActiveConstraint(styles);
  console.log("Detected active constraint:", currentConstraint);
  iconConstraintButtons.forEach((button) => {
    button.classList.toggle(
      "active",
      button.dataset.contraint === currentConstraint
    );
  });

  // Update position select
  const position = styles["position"] || "relative";
  if (iconPositionSelect) iconPositionSelect.value = position;
}

// Add event listeners to ensure two-way binding
grapeEditor.on("component:selected", () => {
  const selected = grapeEditor.getSelected();
  // manageIconEditorUIVisibility(selected);
  updateIconSidebarInputs();
});

grapeEditor.on("component:deselected", () => {
  // manageIconEditorUIVisibility(null);
  updateIconSidebarInputs();
});

grapeEditor.on("component:add", (component) => {
  if (getIconTargetComponent(component)) {
    // manageIconEditorUIVisibility(component);
    updateIconSidebarInputs();
  }
});

grapeEditor.on("component:style:update", (component) => {
  if (getIconTargetComponent(component)) {
    console.log("Style transform detected, updating sidebar:", component);
    updateIconSidebarInputs();
  }
});

// ==========================================================================
// Icon Styling: Size Functionality
// ==========================================================================

function applyIconSize(target, customSize) {
  const targetComponent = validateIconComponent(target);
  if (!targetComponent) return;

  const sizeMapping = {
    small: 16,
    medium: 24,
    large: 32,
    extraLarge: 48,
  };
  const size = customSize > 0 ? customSize : sizeMapping.medium || 24;

  const currentStyles = targetComponent.getStyle() || {};
  targetComponent.setStyle({
    ...currentStyles,
    "font-size": `${size}px`,
  });
  targetComponent.trigger("change:style");
  targetComponent.trigger("component:update");
  updateIconSidebarInputs(); // Sync sidebar immediately
  console.log("Applied font-size:", size);
}

if (iconSizeCustom) {
  iconSizeCustom.addEventListener("input", () => {
    const customSize = parseInt(iconSizeCustom.value, 10) || 0;
    const selected = grapeEditor.getSelected();
    applyIconSize(selected, customSize);
  });
} else {
  console.error(
    "Icon size custom input element not found. Please check the selector '#iconSizeCustom'."
  );
}

// ==========================================================================
// Icon Styling: Color Functionality
// ==========================================================================

function applyIconColor(target, color) {
  const targetComponent = validateIconComponent(target);
  if (!targetComponent) return;

  const currentStyles = targetComponent.getStyle() || {};
  targetComponent.setStyle({
    ...currentStyles,
    color: color,
  });
  targetComponent.trigger("change:style");
  targetComponent.trigger("component:update");
  updateIconSidebarInputs(); // Sync sidebar immediately
  console.log("Applied color:", color);
}

function handleIconColorInputChange(newColor) {
  if (!newColor || !/^#[0-9A-Fa-f]{6}$/.test(newColor)) {
    console.warn(
      `Invalid color format: ${newColor}. Please use a valid hex color (e.g., #000000).`
    );
    return;
  }

  if (iconColorBadge) {
    iconColorBadge.style.backgroundColor = newColor;
  }
  const selected = grapeEditor.getSelected();
  applyIconColor(selected, newColor);
}

if (iconColorInput) {
  iconColorInput.addEventListener("input", () => {
    const newColor = iconColorInput.value;
    handleIconColorInputChange(newColor);
  });

  iconColorInput.addEventListener("change", () => {
    const newColor = iconColorInput.value;
    handleIconColorInputChange(newColor);
  });
} else {
  console.error(
    "Icon color input element not found. Please check the selector '#iconColorInput'."
  );
}

if (iconColorInput && iconColorBadge) {
  iconColorBadge.style.backgroundColor = iconColorInput.value;
}

// ==========================================================================
// Icon Styling: Padding and Margin Functionality
// ==========================================================================

function applyIconPaddingMargin(target) {
  if (
    !target ||
    typeof target.getStyle !== "function" ||
    typeof target.setStyle !== "function"
  ) {
    console.error("Invalid target for applying padding and margin:", target);
    return;
  }

  const currentStyles = target.getStyle() || {};

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
      iconPaddingInputs.left,
      "padding-left"
    )}px`,
    "padding-top": `${getCurrentOrInputValue(
      iconPaddingInputs.top,
      "padding-top"
    )}px`,
    "padding-bottom": `${getCurrentOrInputValue(
      iconPaddingInputs.bottom,
      "padding-bottom"
    )}px`,
    "padding-right": `${getCurrentOrInputValue(
      iconPaddingInputs.right,
      "padding-right"
    )}px`,
    "margin-left": `${getCurrentOrInputValue(
      iconMarginInputs.left,
      "margin-left"
    )}px`,
    "margin-top": `${getCurrentOrInputValue(
      iconMarginInputs.top,
      "margin-top"
    )}px`,
    "margin-bottom": `${getCurrentOrInputValue(
      iconMarginInputs.bottom,
      "margin-bottom"
    )}px`,
    "margin-right": `${getCurrentOrInputValue(
      iconMarginInputs.right,
      "margin-right"
    )}px`,
  };

  target.setStyle(newStyles);
  target.trigger("change:style");
  target.trigger("component:update");
  updateIconSidebarInputs(); // Sync sidebar immediately
  console.log("Applied padding/margin:", newStyles);
}

Object.values(iconPaddingInputs).forEach((input, index) => {
  if (input) {
    input.addEventListener("input", () => {
      const selected = grapeEditor.getSelected();
      const target = validateIconComponent(selected);
      if (!target) return;
      applyIconPaddingMargin(target);
    });
  } else {
    console.error(
      `Padding input for direction ${
        Object.keys(iconPaddingInputs)[index]
      } not found.`
    );
  }
});

Object.values(iconMarginInputs).forEach((input, index) => {
  if (input) {
    input.addEventListener("input", () => {
      const selected = grapeEditor.getSelected();
      const target = validateIconComponent(selected);
      if (!target) return;
      applyIconPaddingMargin(target);
    });
  } else {
    console.error(
      `Margin input for direction ${
        Object.keys(iconMarginInputs)[index]
      } not found.`
    );
  }
});

// ==========================================================================
// Icon Styling: Constraints Functionality
// ==========================================================================

function applyIconConstraint(target, constraint) {
  if (
    !target ||
    typeof target.getStyle !== "function" ||
    typeof target.setStyle !== "function"
  ) {
    console.error("Invalid target for applying constraint:", target);
    return;
  }

  const currentStyles = target.getStyle() || {};

  let positionStyles;
  switch (constraint) {
    case "left":
      positionStyles = {
        left: "0px",
        right: "auto",
        // bottom: "auto",
        // top: "0px",
      };
      break;
    case "right":
      positionStyles = {
        left: "auto",
        right: "0px",
        // top: "0px",
        // bottom: "auto",
      };
      break;
    case "up":
      positionStyles = {
        // left: "0px",
        // right: "auto",
        top: "0px",
        bottom: "auto",
      };
      break;
    case "down":
      positionStyles = {
        // left: "0px",
        // right: "auto",
        top: "auto",
        bottom: "0px",
      };
      break;
    case "center":
    default:
      positionStyles = {
        left: "50%",
        top: "50%",
        right: "auto",
        bottom: "auto",
        transform: "translate(-50%, -50%)",
      };
      break;
  }

  const newStyles = {
    ...currentStyles,
    ...positionStyles,
  };

  target.setStyle(newStyles);
  // target.trigger("change:style");
  target.trigger("component:update");
  updateIconSidebarInputs(); // Sync sidebar immediately
}

iconConstraintButtons.forEach((button, index) => {
  if (button) {
    button.addEventListener("click", () => {
      const constraint = button.dataset.contraint;
      const selected = grapeEditor.getSelected();
      const target = validateIconComponent(selected);
      if (!target) return;
      applyIconConstraint(target, constraint);
      iconConstraintButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
    });
  } else {
    console.error(`Constraint button at index ${index} not found.`);
  }
});

// ==========================================================================
// Icon Styling: Position Functionality
// ==========================================================================

function applyIconPosition(target, position) {
  if (
    !target ||
    typeof target.getStyle !== "function" ||
    typeof target.setStyle !== "function"
  ) {
    console.error("Invalid target for applying position:", target);
    return;
  }

  const currentStyles = target.getStyle() || {};

  const newStyles = {
    ...currentStyles,
    position: position,
  };

  target.setStyle(newStyles);
  target.trigger("change:style");
  target.trigger("component:update");
  updateIconSidebarInputs(); // Sync sidebar immediately
  console.log("Applied position:", position);
}

if (iconPositionSelect) {
  iconPositionSelect.addEventListener("change", () => {
    const position = iconPositionSelect.value;
    const selected = grapeEditor.getSelected();
    const target = validateIconComponent(selected);
    if (!target) return;
    applyIconPosition(target, position);
  });
} else {
  console.error(
    "Position select element not found. Please check the selector '#iconsStyleContainer .text_style_inner_container_position select'."
  );
}
