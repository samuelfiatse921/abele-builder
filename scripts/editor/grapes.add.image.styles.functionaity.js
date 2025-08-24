/**
 * Image Editor Functionality for GrapesJS
 * Organized into distinct sections with comments and gaps
 */

// ==========================================================================
// Shared DOM Elements and Utilities
// ==========================================================================

// Padding and Margin input elements
const paddingInputs = {
  left: document.getElementById("image-padding-left"),
  top: document.getElementById("image-padding-top"),
  bottom: document.getElementById("image-padding-bottom"),
  right: document.getElementById("image-padding-right"),
};

const marginInputs = {
  left: document.getElementById("image-margin-left"),
  top: document.getElementById("image-margin-top"),
  bottom: document.getElementById("image-margin-bottom"),
  right: document.getElementById("image-margin-right"),
};

// Alignment, constraint, and position elements
const alignmentButtons = document.querySelectorAll(
  "#imageStyleContainerStyle .text_style_inner_container button[data-align]"
);
const constraintButtons = document.querySelectorAll(
  "#imageStyleContainerStyle .text_style_inner_container button[data-contraint]"
);
const positionSelect = document.querySelector(
  "#imageStyleContainerStyle .text_style_inner_container_position select"
);

// Function to extract numeric value from style (e.g., "10px" -> 10)
function extractNumber(styleValue) {
  if (!styleValue) return 0;
  const match = styleValue.match(/(\d+)/);
  return match ? parseInt(match[0], 10) : 0;
}

// Function to get the target component (image wrapper div)
function getTargetComponent(selected) {
  if (!selected || typeof selected.is !== "function") {
    console.warn(
      "Selected component is invalid or not a GrapesJS component:",
      selected
    );
    return null;
  }
  if (selected.is("image")) {
    if (
      typeof selected.getStyle !== "function" ||
      typeof selected.setStyle !== "function" ||
      typeof selected.components !== "function"
    ) {
      console.error(
        "Selected image component does not have expected methods (getStyle/setStyle/components):",
        selected
      );
      return null;
    }
    return selected;
  }
  return null;
}

// Function to validate that the selected component is an image
function validateImageComponent(selected) {
  const target = getTargetComponent(selected);
  if (!target) {
    showFlashMessage(
      "Please select an image component.",
      "Invalid component selected",
      "error",
      5000
    );
    return false;
  }
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
  return "left"; // Default to left if ambiguous
}

// Function to determine the active alignment based on margin properties
function getActiveAlignment(styles) {
  const marginLeft = styles["margin-left"] || styles.marginLeft || "auto";
  const marginRight = styles["margin-right"] || styles.marginRight || "auto";

  if (marginLeft === "0px" && marginRight === "auto") return "left";
  if (marginLeft === "auto" && marginRight === "0px") return "right";
  if (marginLeft === "auto" && marginRight === "auto") return "center";
  return "left"; // Default to left if ambiguous
}

// Debounce utility to prevent rapid event firing
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Function to update sidebar inputs based on selected image's properties
function updateSidebarInputs() {
  const selected = grapeEditor.getSelected();
  if (selected === undefined) {
    console.log("Selection is undefined, skipping sidebar update.");
    return;
  }

  const target = getTargetComponent(selected);
  if (!target) {
    Object.values(paddingInputs).forEach((input) => {
      if (input) input.value = 0;
    });
    Object.values(marginInputs).forEach((input) => {
      if (input) input.value = 0;
    });
    alignmentButtons.forEach((button) => button.classList.remove("active"));
    constraintButtons.forEach((button) => button.classList.remove("active"));
    if (positionSelect) positionSelect.value = "relative";
    if (alignmentButtons[0]) alignmentButtons[0].classList.add("active");
    if (constraintButtons[2]) constraintButtons[2].classList.add("active");
  }

  const styles = target.getStyle() || {};

  // Update padding inputs
  Object.keys(paddingInputs).forEach((key) => {
    if (paddingInputs[key]) {
      paddingInputs[key].value = extractNumber(
        styles[`padding-${key}`] ||
          styles[`padding${key.charAt(0).toUpperCase() + key.slice(1)}`] ||
          "0px"
      );
    }
  });

  // Update margin inputs
  Object.keys(marginInputs).forEach((key) => {
    if (marginInputs[key]) {
      marginInputs[key].value = extractNumber(
        styles[`margin-${key}`] ||
          styles[`margin${key.charAt(0).toUpperCase() + key.slice(1)}`] ||
          "0px"
      );
    }
  });

  // Update alignment buttons
  const currentAlign = getActiveAlignment(styles);
  alignmentButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.align === currentAlign);
  });

  // Update constraint buttons
  const currentConstraint = getActiveConstraint(styles);
  constraintButtons.forEach((button) => {
    button.classList.toggle(
      "active",
      button.dataset.contraint === currentConstraint
    );
  });

  // Update position select
  const position = styles["position"] || "relative";
  if (positionSelect) positionSelect.value = position;
}

// Debounced version of updateSidebarInputs
const debouncedUpdateSidebarInputs = debounce(updateSidebarInputs, 50);

// Update sidebar when a component is selected or deselected
grapeEditor.on("component:selected", () => {
  console.log("component:selected event fired");
  debouncedUpdateSidebarInputs();
});

grapeEditor.on("component:deselected", () => {
  console.log("component:deselected event fired");
  debouncedUpdateSidebarInputs();
});

// ==========================================================================
// Padding and Margin Functionality
// ==========================================================================

// Function to apply padding and margin to the selected image
function applyPaddingMargin(target) {
  if (
    !target ||
    typeof target.getStyle !== "function" ||
    typeof target.setStyle !== "function"
  ) {
    console.error("Invalid target for applying padding and margin:", target);
    return;
  }

  const currentStyles = target.getStyle() || {};

  target.setStyle({
    ...currentStyles,
    "padding-left": `${paddingInputs.left?.value || 0}px`,
    "padding-top": `${paddingInputs.top?.value || 0}px`,
    "padding-bottom": `${paddingInputs.bottom?.value || 0}px`,
    "padding-right": `${paddingInputs.right?.value || 0}px`,
    "margin-top": `${marginInputs.top?.value || 0}px`,
    "margin-bottom": `${marginInputs.bottom?.value || 0}px`,
  });

  target.trigger("component:update");
}

// Padding and margin event listeners
Object.values(paddingInputs).forEach((input, index) => {
  if (input) {
    input.addEventListener("input", () => {
      const selected = grapeEditor.getSelected();
      const target = validateImageComponent(selected);
      if (!target) return;
      applyPaddingMargin(target);
    });
  } else {
    console.error(
      `Padding input for direction ${
        Object.keys(paddingInputs)[index]
      } not found.`
    );
  }
});

Object.values(marginInputs).forEach((input, index) => {
  if (input) {
    input.addEventListener("input", () => {
      const selected = grapeEditor.getSelected();
      const target = validateImageComponent(selected);
      if (!target) return;
      applyPaddingMargin(target);
    });
  } else {
    console.error(
      `Margin input for direction ${
        Object.keys(marginInputs)[index]
      } not found.`
    );
  }
});

// ==========================================================================
// Alignment Functionality
// ==========================================================================

// Function to apply alignment to the selected image
function applyAlignment(target, align) {
  if (
    !target ||
    typeof target.getStyle !== "function" ||
    typeof target.setStyle !== "function"
  ) {
    console.error("Invalid target for applying alignment:", target);
    return;
  }

  const currentStyles = target.getStyle() || {};

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

  target.setStyle({
    ...currentStyles,
    display: "block",
    "margin-left": marginLeft,
    "margin-right": marginRight,
  });

  target.trigger("component:update");
}

// Alignment event listeners
alignmentButtons.forEach((button, index) => {
  if (button) {
    button.addEventListener("click", () => {
      const align = button.dataset.align;
      const selected = grapeEditor.getSelected();
      const target = validateImageComponent(selected);
      if (!target) return;
      applyAlignment(target, align);
      alignmentButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
    });
  } else {
    console.error(`Alignment button at index ${index} not found.`);
  }
});

// ==========================================================================
// Constraints Functionality
// ==========================================================================

// Function to apply constraint to the selected image
function applyConstraint(target, constraint) {
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
        position: currentStyles["position"] || "relative",
        left: "0px",
        right: "auto",
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

  target.setStyle({
    ...currentStyles,
    ...positionStyles,
  });

  target.trigger("component:update");
}

// Constraint event listeners
constraintButtons.forEach((button, index) => {
  if (button) {
    button.addEventListener("click", () => {
      const constraint = button.dataset.contraint;
      const selected = grapeEditor.getSelected();
      const target = validateImageComponent(selected);
      if (!target) return;
      applyConstraint(target, constraint);
      constraintButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
    });
  } else {
    console.error(`Constraint button at index ${index} not found.`);
  }
});

// ==========================================================================
// Position Functionality
// ==========================================================================

// Function to apply position to the selected image
function applyPosition(target, position) {
  if (
    !target ||
    typeof target.getStyle !== "function" ||
    typeof target.setStyle !== "function"
  ) {
    console.error("Invalid target for applying position:", target);
    return;
  }

  const currentStyles = target.getStyle() || {};

  target.setStyle({
    ...currentStyles,
    position: position,
  });

  target.trigger("change:style");
  updateSidebarInputs();
}

// Position event listener
if (positionSelect) {
  positionSelect.addEventListener("change", () => {
    const position = positionSelect.value;
    const selected = grapeEditor.getSelected();
    const target = validateImageComponent(selected);
    if (!target) return;
    applyPosition(target, position);
  });
} else {
  console.error(
    "Position select element not found. Please check the selector '#imageStyleContainerStyle .text_style_inner_container_position select'."
  );
}
