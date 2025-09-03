/**
 * Centralized Sidebar Manager for GrapesJS
 * Manages sidebar visibility based on the selected component
 * Ensures only one sidebar is visible at a time
 */

// ==========================================================================
// UI Visibility Utilities
// ==========================================================================

function showEditorUI(container) {
  if (container) container.classList.remove("editor--hidden");
  else console.error("Editor UI container not found:", container);
}

function hideEditorUI(container) {
  if (container) container.classList.add("editor--hidden");
}

function hideOtherEditorUIs(currentEditorId) {
  const allEditorContainers = [
    {
      id: "buttonStyleContainer",
      element: document.getElementById("buttonStyleContainer"),
    },
    {
      id: "mapStyleContainer",
      element: document.getElementById("mapStyleContainer"),
    },
    {
      id: "textStyleContainer",
      element: document.getElementById("textStyleContainer"),
    },
    {
      id: "imageStyleContainer",
      element: document.getElementById("imageStyleContainer"),
    },
    {
      id: "iconsStyleContainer",
      element: document.getElementById("iconsStyleContainer"),
    },
    {
      id: "videoStyleContainer",
      element: document.getElementById("videoStyleContainer"),
    },
  ];

  allEditorContainers.forEach(({ id, element }) => {
    if (id !== currentEditorId && element) hideEditorUI(element);
  });
}

function showDefaultUI() {
  const searchFileNameSection = document.getElementById(
    "searchFileNameSection"
  );
  const editorToolsList = document.getElementById("editorToolsList");
  if (searchFileNameSection)
    searchFileNameSection.classList.remove("editor--hidden");
  if (editorToolsList) editorToolsList.classList.remove("editor--hidden");
}

// ==========================================================================
// Text Editor
// ==========================================================================

function getTextTargetComponent(selected) {
  if (!selected) return null;

  const tag = selected.get("tagName")?.toLowerCase();
  const textTags = [
    "p",
    "a",
    "A",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "span",
    "strong",
    "em",
  ];

  if (textTags.includes(tag)) {
    if (
      typeof selected.getStyle === "function" &&
      typeof selected.setStyle === "function"
    ) {
      return selected;
    }
  }

  return null;
}

function manageTextEditorUIVisibility(selected) {
  const textStyleContainer = document.getElementById("textStyleContainer");
  const target = getTextTargetComponent(selected);

  if (target) {
    showEditorUI(textStyleContainer);
    hideOtherEditorUIs("textStyleContainer");
  } else {
    hideEditorUI(textStyleContainer);
  }
}

// ==========================================================================
// Icon Editor
// ==========================================================================

function showIconEditorUI() {
  const iconsStyleContainer = document.getElementById("iconsStyleContainer");
  hideEditorUI(document.getElementById("searchFileNameSection"));
  hideEditorUI(document.getElementById("editorToolsList"));
  showEditorUI(iconsStyleContainer);
  hideOtherEditorUIs("iconsStyleContainer");
}

function hideIconEditorUI() {
  hideEditorUI(document.getElementById("iconsStyleContainer"));
}

// ==========================================================================
// Other Editor
// ==========================================================================

function showOtherEditorUI() {
  hideEditorUI(document.getElementById("searchFileNameSection"));
  hideEditorUI(document.getElementById("editorToolsList"));
}

// ==========================================================================
// Image Editor
// ==========================================================================

function showImageEditorUI(src = "") {
  const imageStyleContainer = document.getElementById("imageStyleContainer");
  hideEditorUI(document.getElementById("searchFileNameSection"));
  hideEditorUI(document.getElementById("editorToolsList"));
  showEditorUI(imageStyleContainer);
  hideOtherEditorUIs("imageStyleContainer");

  if (src && typeof handleCurrentSelectedImage === "function") {
    handleCurrentSelectedImage(src);
  }
}

function hideImageEditorUI() {
  hideEditorUI(document.getElementById("imageStyleContainer"));
}

// ==========================================================================
// Button Editor
// ==========================================================================

function showButtonEditorUI() {
  const buttonStyleContainer = document.getElementById("buttonStyleContainer");
  hideEditorUI(document.getElementById("searchFileNameSection"));
  hideEditorUI(document.getElementById("editorToolsList"));
  showEditorUI(buttonStyleContainer);
  hideOtherEditorUIs("buttonStyleContainer");
}

function showMapEditorUI() {
  const buttonStyleContainer = document.getElementById("mapStyleContainer");
  hideEditorUI(document.getElementById("searchFileNameSection"));
  hideEditorUI(document.getElementById("editorToolsList"));
  showEditorUI(buttonStyleContainer);
  hideOtherEditorUIs("mapStyleContainer");
}

function hideButtonEditorUI() {
  hideEditorUI(document.getElementById("buttonStyleContainer"));
}

function hideMapEditorUI()  {
  hideEditorUI(document.getElementById("mapStyleContainer"));
}

// ==========================================================================
// Video Editor
// ==========================================================================

function showVideoEditorUI(src = "") {
  const videoStyleContainer = document.getElementById("videoStyleContainer");
  hideEditorUI(document.getElementById("searchFileNameSection"));
  hideEditorUI(document.getElementById("editorToolsList"));
  showEditorUI(videoStyleContainer);
  hideOtherEditorUIs("videoStyleContainer");

  if (src && typeof handleCurrentSelectedVideo === "function") {
    handleCurrentSelectedVideo(src);
  }
}

function hideVideoEditorUI() {
  hideEditorUI(document.getElementById("videoStyleContainer"));
}

// ==========================================================================
// Central Sidebar Controller
// ==========================================================================

function manageSidebarVisibility() {
  // Hide all sidebars
  hideIconEditorUI();
  hideImageEditorUI();
  hideButtonEditorUI();
  hideMapEditorUI();
  hideVideoEditorUI();
  // hideOtherEditorUI();
  hideEditorUI(document.getElementById("textStyleContainer"));

  const selected = grapeEditor.getSelected();

  if (!selected) {
    showDefaultUI();
    return;
  }

  // Handle text-related tags
  if (getTextTargetComponent(selected)) {
    manageTextEditorUIVisibility(selected);
    return;
  }

  const type = selected.get("type")?.toLowerCase();

  switch (type) {
    case "image":
      showImageEditorUI(selected.get("src"));
      break;
    case "video":
      showVideoEditorUI(selected.get("src"));
      break;
    case "button":
      showButtonEditorUI();
      break;
    case "icon":
      showIconEditorUI();
    case "map":
      showMapEditorUI();
      break;
    default:
      showDefaultUI();
      break;
  }
}

// ==========================================================================
// Event Hook
// ==========================================================================

grapeEditor.on("component:select", () => {
  manageSidebarVisibility();
});
