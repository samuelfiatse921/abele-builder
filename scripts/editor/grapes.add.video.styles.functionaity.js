/**
 * Video Editor Functionality for GrapesJS
 * Structured similarly to Image functionality
 */

// ==========================================================================
// Shared DOM Elements and Utilities
// ==========================================================================

// Overlay toggle setup
const videoOverlayToggle = document.getElementById("videoOverlayToggle");
let videoOverlayState = false;

// Color input and badge (button)
const videoColorInput = document.getElementById("videoColorInput");
const videoColorBadge = document.getElementById("videoColorButton");

// Controller toggle and color
const videoControlsToggle = document.getElementById("videoControls");
const videoControlsColorInput = document.getElementById(
  "videoControlsColorInput"
);
const videoControlsColorBadge = document.getElementById("videoColorButton");

// Padding and Margin input elements
const videoPaddingInputs = {
  left: document.getElementById("video-padding-left"),
  top: document.getElementById("video-padding-top"),
  bottom: document.getElementById("video-padding-bottom"),
  right: document.getElementById("video-padding-right"),
};

const videoMarginInputs = {
  left: document.getElementById("video-margin-left"),
  top: document.getElementById("video-margin-top"),
  bottom: document.getElementById("video-margin-bottom"),
  right: document.getElementById("video-margin-right"),
};

// Alignment, constraint, and position elements
const videoAlignmentButtons = document.querySelectorAll(
  "#videoStyleContainerStyle .text_style_inner_container button[data-align]"
);
const videoConstraintButtons = document.querySelectorAll(
  "#videoStyleContainerStyle .text_style_inner_container button[data-contraint]"
);
const videoPositionSelect = document.querySelector(
  "#videoStyleContainerStyle .text_style_inner_container_position select"
);

// Utility functions (same as Image ones)
function extractNumber(styleValue) {
  if (!styleValue) return 0;
  const match = styleValue.match(/(\d+)/);
  return match ? parseInt(match[0], 10) : 0;
}

function getTargetVideoComponent(selected) {
  if (!selected || typeof selected.is !== "function") return null;
  if (selected.is("video")) {
    if (
      typeof selected.getStyle !== "function" ||
      typeof selected.setStyle !== "function"
    )
      return null;
    return selected;
  }
  return null;
}

function validateVideoComponent(selected) {
  const target = getTargetVideoComponent(selected);
  if (!target) {
    showFlashMessage(
      "Please select a video component.",
      "Invalid component success",
      "error",
      5000
    );
    return false;
  }
  return target;
}

// ==========================================================================
// Video Component Registration
// ==========================================================================

grapeEditor.Components.addType("video", {
  model: {
    defaults: {
      tagName: "video",
      style: {
        position: "relative",
        display: "block",
        width: "100%",
        height: "auto",
        "min-height": "100px",
        "z-index": "0",
        opacity: "1",
        filter: "none",
      },
      attributes: {
        controls: true, // Default to true for testing
        src: "https://www.w3schools.com/html/mov_bbb.mp4", // Placeholder video for testing
      },
    },
  },
});

// ==========================================================================
// Overlay Functionality (Filter on Video)
// ==========================================================================

function applyVideoOverlayFilter(target, color) {
  if (!target) return;

  const filterValue = color ? hexToFilter(color) : "none";
  const currentStyles = target.getStyle() || {};

  target.setStyle({
    ...currentStyles,
    filter: filterValue,
  });
  target.trigger("component:update");
}

function handleVideoOverlayToggle() {
  if (!videoOverlayToggle) return;

  const selected = grapeEditor.getSelected();
  const target = validateVideoComponent(selected);
  if (!target) return;

  videoOverlayState = videoOverlayToggle.checked;

  if (videoOverlayState) {
    if (!videoColorInput) return;
    applyVideoOverlayFilter(target, videoColorInput.value);
  } else {
    applyVideoOverlayFilter(target, null);
  }
}

function handleVideoColorInputChange(newColor) {
  if (!/^#[0-9A-Fa-f]{6}$/.test(newColor)) return;

  if (videoColorBadge) {
    videoColorBadge.style.backgroundColor = newColor;
  }

  const selected = grapeEditor.getSelected();
  const target = validateVideoComponent(selected);
  if (!target) return;

  if (videoOverlayState) {
    applyVideoOverlayFilter(target, newColor);
  }
}

// Overlay events
if (videoOverlayToggle) {
  videoOverlayToggle.addEventListener("change", handleVideoOverlayToggle);
}

if (videoColorInput) {
  videoColorInput.addEventListener("input", () =>
    handleVideoColorInputChange(videoColorInput.value)
  );
  videoColorInput.addEventListener("change", () =>
    handleVideoColorInputChange(videoColorInput.value)
  );
}

// Initialize badge color
if (videoColorInput && videoColorBadge) {
  videoColorBadge.style.backgroundColor = videoColorInput.value;
}

// ==========================================================================
// Controller Functionality
// ==========================================================================

function applyVideoControls(target, enable) {
  if (!target) return;

  const attributes = target.getAttributes() || {};
  console.log("Current attributes before update:", attributes);

  // Update the controls attribute
  if (enable) {
    target.setAttributes({
      ...attributes,
      controls: "", // Set as empty string for boolean attribute in HTML
    });
  } else {
    // Remove the controls attribute
    const { controls, ...remainingAttributes } = attributes;
    target.setAttributes(remainingAttributes);
  }

  console.log("Updated attributes:", target.getAttributes());

  // Force re-render by triggering a change
  target.trigger("change:attributes");
  target.trigger("component:update");

  // Additional check: Log the DOM element to confirm the attribute change
  const view = target.getView();
  if (view && view.el) {
    console.log("DOM element after update:", view.el.outerHTML);
  }
}

function handleVideoControlsToggle() {
  if (!videoControlsToggle) {
    console.error("Video controls toggle element not found.");
    return;
  }

  const selected = grapeEditor.getSelected();
  const target = validateVideoComponent(selected);
  if (!target) return;

  const enableControls = videoControlsToggle.checked;
  console.log("Toggling video controls to:", enableControls);
  applyVideoControls(target, enableControls);

  // Update controller color if controls are enabled
  if (enableControls && videoControlsColorInput) {
    applyVideoControlsColor(target, videoControlsColorInput.value);
  } else {
    applyVideoControlsColor(target, null); // Reset color if controls are disabled
  }
}

function applyVideoControlsColor(target, color) {
  if (!target) return;

  const currentStyles = target.getStyle() || {};
  const filterValue = color
    ? `sepia(0.5) hue-rotate(${hexToHue(color)}deg)`
    : "none";

  target.setStyle({
    ...currentStyles,
    "--video-controls-filter": filterValue,
  });
  target.trigger("component:update");
}

function handleVideoControlsColorInputChange(newColor) {
  if (!/^#[0-9A-Fa-f]{6}$/.test(newColor)) {
    console.warn(
      `Invalid color format: ${newColor}. Please use a valid hex color (e.g., #FF4C4C).`
    );
    return;
  }

  if (videoControlsColorBadge) {
    videoControlsColorBadge.style.backgroundColor = newColor;
  }

  const selected = grapeEditor.getSelected();
  const target = validateVideoComponent(selected);
  if (!target) return;

  if (videoControlsToggle && videoControlsToggle.checked) {
    applyVideoControlsColor(target, newColor);
  }
}

// Controller events
if (videoControlsToggle) {
  videoControlsToggle.addEventListener("change", handleVideoControlsToggle);
}

if (videoControlsColorInput) {
  videoControlsColorInput.addEventListener("input", () =>
    handleVideoControlsColorInputChange(videoControlsColorInput.value)
  );
  videoControlsColorInput.addEventListener("change", () =>
    handleVideoControlsColorInputChange(videoControlsColorInput.value)
  );
}

// Initialize badge color
if (videoControlsColorInput && videoControlsColorBadge) {
  videoControlsColorBadge.style.backgroundColor = videoControlsColorInput.value;
}

// Helper function to convert hex to hue for filter effect
function hexToHue(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return 0;
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  const delta = max - min;
  let hue = 0;

  if (delta === 0) hue = 0;
  else if (max === r) hue = ((g - b) / delta) % 6;
  else if (max === g) hue = (b - r) / delta + 2;
  else hue = (r - g) / delta + 4;

  hue = Math.round(hue * 60);
  if (hue < 0) hue += 360;

  return hue;
}

// ==========================================================================
// Padding and Margin Functionality
// ==========================================================================

function applyVideoPaddingMargin(target) {
  if (!target) return;

  const currentStyles = target.getStyle() || {};

  target.setStyle({
    ...currentStyles,
    "padding-left": `${videoPaddingInputs.left?.value || 0}px`,
    "padding-top": `${videoPaddingInputs.top?.value || 0}px`,
    "padding-bottom": `${videoPaddingInputs.bottom?.value || 0}px`,
    "padding-right": `${videoPaddingInputs.right?.value || 0}px`,
    "margin-top": `${videoMarginInputs.top?.value || 0}px`,
    "margin-bottom": `${videoMarginInputs.bottom?.value || 0}px`,
  });

  target.trigger("component:update");
}

Object.values(videoPaddingInputs).forEach((input) => {
  if (input) {
    input.addEventListener("input", () => {
      const selected = grapeEditor.getSelected();
      const target = validateVideoComponent(selected);
      if (!target) return;
      applyVideoPaddingMargin(target);
    });
  }
});

Object.values(videoMarginInputs).forEach((input) => {
  if (input) {
    input.addEventListener("input", () => {
      const selected = grapeEditor.getSelected();
      const target = validateVideoComponent(selected);
      if (!target) return;
      applyVideoPaddingMargin(target);
    });
  }
});

// ==========================================================================
// Alignment Functionality
// ==========================================================================

function applyVideoAlignment(target, align) {
  if (!target) return;

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

videoAlignmentButtons.forEach((button) => {
  if (button) {
    button.addEventListener("click", () => {
      const align = button.dataset.align;
      const selected = grapeEditor.getSelected();
      const target = validateVideoComponent(selected);
      if (!target) return;
      applyVideoAlignment(target, align);
      videoAlignmentButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
    });
  }
});

// ==========================================================================
// Constraints Functionality
// ==========================================================================

function applyVideoConstraint(target, constraint) {
  if (!target) return;

  const currentStyles = target.getStyle() || {};

  let positionStyles;
  switch (constraint) {
    case "left":
      positionStyles = {
        position: currentStyles["position"] || "relative",
        left: "0px",
        right: "auto",
        top: "0px",
        bottom: "auto",
        transform: "none",
      };
      break;
    case "right":
      positionStyles = {
        position: currentStyles["position"] || "relative",
        left: "auto",
        right: "0px",
        top: "0px",
        bottom: "auto",
        transform: "translateX(-100%)",
      };
      break;
    case "up":
      positionStyles = {
        position: currentStyles["position"] || "relative",
        left: "0px",
        right: "auto",
        top: "0px",
        bottom: "auto",
        transform: "none",
      };
      break;
    case "down":
      positionStyles = {
        position: currentStyles["position"] || "relative",
        left: "0px",
        right: "auto",
        top: "auto",
        bottom: "0px",
        transform: "translateY(-100%)",
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

videoConstraintButtons.forEach((button) => {
  if (button) {
    button.addEventListener("click", () => {
      const constraint = button.dataset.contraint;
      const selected = grapeEditor.getSelected();
      const target = validateVideoComponent(selected);
      if (!target) return;
      applyVideoConstraint(target, constraint);
      videoConstraintButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
    });
  }
});

// ==========================================================================
// Position Functionality
// ==========================================================================

function applyVideoPosition(target, position) {
  if (!target) return;

  const currentStyles = target.getStyle() || {};

  target.setStyle({
    ...currentStyles,
    position: position,
  });

  target.trigger("change:style");
}

if (videoPositionSelect) {
  videoPositionSelect.addEventListener("change", () => {
    const position = videoPositionSelect.value;
    const selected = grapeEditor.getSelected();
    const target = validateVideoComponent(selected);
    if (!target) return;
    applyVideoPosition(target, position);
  });
}

// ==========================================================================
// File Size Validation (Example)
// ==========================================================================

function validateVideoFileSize(fileInput) {
  const MAX_SIZE_MB = 50; // example: 50MB
  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > MAX_SIZE_MB) {
      showFlashMessage(
        `The selected video is too large! Maximum allowed size is ${MAX_SIZE_MB}MB.`,
        "Invalid file size",
        "error",
        5000
      );

      fileInput.value = ""; // clear the input
      return false;
    }
  }
  return true;
}
