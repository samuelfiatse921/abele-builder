// /**
//  * Text Editor Functionality for GrapesJS
//  * Supports text, A, LI, H1-H6, P elements
//  * Implements text color, link, alignment, constraints, and position
//  * Aligned with style editor for two-way binding and immediate sidebar updates
//  * Includes programmatic color change detection
//  */

// // ==========================================================================
// // Shared DOM Elements and Utilities
// // ==========================================================================

// // DOM elements for color and link
// const textColorInput = document.getElementById("textColorInput");
// const textColorBadge = document.getElementById("textColorBadge");
// const linkInput = document.getElementById("btnLink");

// // Alignment, constraint, and position elements
// const textAlignmentButtons = document.querySelectorAll(
//   "#textStyleContainer .text_style_inner_container button[data-align]"
// );
// const textConstraintButtons = document.querySelectorAll(
//   "#textStyleContainer .text_style_inner_container button[data-contraint]"
// );
// const textPositionSelect = document.querySelector(
//   "#textStyleContainer .text_style_inner_container_position select"
// );

// // Function to extract numeric value from style (e.g., "10px" -> 10)
// function extractNumber(styleValue) {
//   if (!styleValue) return 0;
//   const match = styleValue.match(/(\d*\.?\d+)/);
//   return match ? parseFloat(match[0]) : 0;
// }

// // ==========================================================================
// // Component Validation and Style Utilities
// // ==========================================================================

// // Function to get the target component (text, A, LI, H1-H6, P)
// function getTextTargetComponent(selected) {
//   if (!selected || typeof selected.is !== "function") {
//     console.warn(
//       "Selected component is invalid or not a GrapesJS component:",
//       selected
//     );
//     return null;
//   }
//   if (
//     selected.is("text") ||
//     selected.is("a") ||
//     selected.is("label") ||
//     selected.is("li") ||
//     selected.is("h1") ||
//     selected.is("h2") ||
//     selected.is("h3") ||
//     selected.is("h4") ||
//     selected.is("h5") ||
//     selected.is("h6") ||
//     selected.is("p")
//   ) {
//     if (
//       typeof selected.getStyle !== "function" ||
//       typeof selected.setStyle !== "function"
//     ) {
//       console.error(
//         "Selected component does not have expected methods (getStyle/setStyle):",
//         selected
//       );
//       return null;
//     }
//     return selected;
//   }
//   console.warn("Selected component is not a supported text element:", selected);
//   return null;
// }

// // Function to validate that the selected component is a supported text element
// function validateTextComponent(selected) {
//   const target = getTextTargetComponent(selected);
//   if (!target) {
//     showFlashMessage(
//       "Please select a text, A, LI, H1-H6, or P component to apply this action.",
//       "Invalid component selected",
//       "error",
//       5000
//     );
//     return false;
//   }
//   return target;
// }

// // Function to determine the active constraint based on position properties
// function getActiveConstraint(styles) {
//   const left = styles["left"] || "auto";
//   const top = styles["top"] || "auto";
//   const transform = styles["transform"] || "none";

//   if (
//     left === "50%" &&
//     top === "50%" &&
//     transform.includes("translate(-50%, -50%)")
//   )
//     return "center";
//   if (left === "0px" && top === "0px" && transform === "none") return "left";
//   if (
//     left === "auto" &&
//     top === "0px" &&
//     transform.includes("translateX(-100%)")
//   )
//     return "right";
//   if (
//     left === "0px" &&
//     top === "auto" &&
//     transform.includes("translateY(-100%)")
//   )
//     return "down";
//   return "left";
// }

// // Function to determine the active alignment based on text-align property
// function getActiveAlignment(styles) {
//   const textAlign = styles["text-align"] || "left";
//   if (["left", "center", "right"].includes(textAlign)) {
//     return textAlign;
//   }
//   return "left";
// }

// // Debounce utility to prevent rapid event firing
// function debounce(func, wait) {
//   let timeout;
//   return function (...args) {
//     clearTimeout(timeout);
//     timeout = setTimeout(() => func.apply(this, args), wait);
//   };
// }

// // Function to update sidebar inputs based on selected component's properties
// function updateTextSidebarInputs() {
//   const selected = grapeEditor.getSelected();
//   if (selected === undefined) {
//     console.log("Selection is undefined, skipping sidebar update.");
//     return;
//   }

//   const target = getTextTargetComponent(selected);

//   if (!target) {
//     console.log("No valid text component selected, resetting sidebar.");
//     if (textColorInput) textColorInput.value = "#000000";
//     if (textColorBadge) textColorBadge.style.backgroundColor = "#000000";
//     if (linkInput) linkInput.value = "";
//     textAlignmentButtons.forEach((btn) => btn.classList.remove("active"));
//     textConstraintButtons.forEach((btn) => btn.classList.remove("active"));
//     if (textPositionSelect) textPositionSelect.value = "relative";
//     if (textAlignmentButtons[0])
//       textAlignmentButtons[0].classList.add("active");
//     if (textConstraintButtons[2])
//       textConstraintButtons[2].classList.add("active");
//     return;
//   }

//   const styles = target.getStyle() || {};
//   console.log("Updating sidebar for component:", target.get("type"), styles);

//   const content = target.get("content") || "";
//   const linkMatch = content.match(/<a\s+href="([^"]+)".*?>(.*?)<\/a>/i);
//   const currentLink = linkMatch ? linkMatch[1] : "";

//   if (textColorInput) textColorInput.value = styles["color"] || "#000000";
//   if (textColorBadge)
//     textColorBadge.style.backgroundColor = styles["color"] || "#000000";
//   if (linkInput) linkInput.value = currentLink;

//   const currentAlign = getActiveAlignment(styles);
//   textAlignmentButtons.forEach((btn) =>
//     btn.classList.toggle("active", btn.dataset.align === currentAlign)
//   );

//   const currentConstraint = getActiveConstraint(styles);
//   textConstraintButtons.forEach((btn) =>
//     btn.classList.toggle("active", btn.dataset.contraint === currentConstraint)
//   );

//   const position = styles["position"] || "relative";
//   if (textPositionSelect) textPositionSelect.value = position;
// }

// // Debounced version for less frequent updates
// const debouncedUpdateTextSidebarInputs = debounce(updateTextSidebarInputs, 50);

// // Update sidebar when a component is selected or deselected
// grapeEditor.on("component:selected", (component) => {
//   console.log(
//     "Text component:selected event fired for:",
//     component.get("type")
//   );
//   updateTextSidebarInputs(); // Immediate update without debounce
// });

// grapeEditor.on("component:deselected", () => {
//   console.log("Text component:deselected event fired");
//   updateTextSidebarInputs(); // Immediate update without debounce
// });

// grapeEditor.on("component:add", (component) => {
//   console.log("Text component:add event fired for:", component.get("type"));
//   if (getTextTargetComponent(component)) {
//     debouncedUpdateTextSidebarInputs();
//   }
// });

// grapeEditor.on("component:style:update", (component) => {
//   console.log(
//     "Text component:style:update event fired for:",
//     component.get("type")
//   );
//   if (getTextTargetComponent(component)) {
//     debouncedUpdateTextSidebarInputs();
//   }
// });

// // ==========================================================================
// // Text Color Functionality
// // ==========================================================================

// // Function to apply the text color to the selected component
// function applyTextColor(target, color) {
//   const targetComponent = validateTextComponent(target);
//   if (!targetComponent) return;

//   const currentStyles = targetComponent.getStyle() || {};
//   targetComponent.setStyle({
//     ...currentStyles,
//     color: color,
//   });
//   targetComponent.trigger("component:update");
// }

// // Function to handle text color input changes
// function handleTextColorInputChange(newColor) {
//   alert(`Text color changed to: ${newColor}`);
//   console.log("Text color input changed:", newColor);
//   if (!newColor || !/^#[0-9A-Fa-f]{6}$/.test(newColor)) {
//     console.warn(
//       `Invalid color format: ${newColor}. Please use a valid hex color (e.g., #FF4C4C).`
//     );
//     return;
//   }

//   if (textColorBadge) textColorBadge.style.backgroundColor = newColor;

//   const selected = grapeEditor.getSelected();
//   const target = validateTextComponent(selected);
//   if (!target) return;

//   applyTextColor(target, newColor);
// }

// // Text color input event handler
// if (textColorInput) {
//   // Store the original descriptor
//   const originalDescriptor = Object.getOwnPropertyDescriptor(
//     HTMLInputElement.prototype,
//     "value"
//   );

//   // Override the 'value' property
//   Object.defineProperty(textColorInput, "value", {
//     set: function (newValue) {
//       if (this.value !== newValue) {
//         originalDescriptor.set.call(this, newValue);
//         console.log("Programmatic text color change detected:", newValue);
//         handleTextColorInputChange(newValue);
//       }
//     },
//     get: function () {
//       return originalDescriptor.get.call(this);
//     },
//   });

//   textColorInput.addEventListener("input", () => {
//     console.log("Manual text color input:", textColorInput.value);
//     handleTextColorInputChange(textColorInput.value);
//   });
// } else {
//   console.error(
//     "Text color input element not found. Please check the selector '#textColorInput'."
//   );
// }

// // ==========================================================================
// // Link Functionality
// // ==========================================================================

// // Function to apply a link to the selected component
// function applyTextLink(target, url) {
//   const targetComponent = validateTextComponent(target);
//   if (!targetComponent) return;

//   const content = targetComponent.get("content") || "";
//   const linkMatch = content.match(/<a\s+href="([^"]+)".*?>(.*?)<\/a>/i);
//   let newContent;

//   if (url) {
//     const textContent = linkMatch
//       ? linkMatch[2]
//       : content.replace(/<\/?[^>]+(>|$)/g, "");
//     newContent = `<a href="${url}">${textContent}</a>`;
//   } else {
//     newContent = linkMatch
//       ? linkMatch[2]
//       : content.replace(/<\/?[^>]+(>|$)/g, "");
//   }

//   targetComponent.set("content", newContent);
//   targetComponent.trigger("component:update");
// }

// // Event listener for link input changes
// if (linkInput) {
//   linkInput.addEventListener("input", () => {
//     const newUrl = linkInput.value;
//     const selected = grapeEditor.getSelected();
//     const target = validateTextComponent(selected);
//     if (!target) return;
//     applyTextLink(target, newUrl);
//   });
// } else {
//   console.error(
//     "Link input element not found. Please check the selector '#btnLink'."
//   );
// }

// // ==========================================================================
// // Alignment Functionality
// // ==========================================================================

// // Function to apply alignment to the selected component
// function applyTextAlignment(target, align) {
//   const targetComponent = validateTextComponent(target);
//   if (!targetComponent) return;

//   const currentStyles = targetComponent.getStyle() || {};
//   const newStyles = {
//     ...currentStyles,
//     "text-align": align,
//   };

//   targetComponent.setStyle(newStyles);
//   targetComponent.trigger("component:update");
// }

// // Alignment event listeners
// textAlignmentButtons.forEach((button, index) => {
//   if (button) {
//     button.addEventListener("click", () => {
//       const align = button.dataset.align;
//       const selected = grapeEditor.getSelected();
//       const target = validateTextComponent(selected);
//       if (!target) return;
//       applyTextAlignment(target, align);
//       textAlignmentButtons.forEach((btn) => btn.classList.remove("active"));
//       button.classList.add("active");
//     });
//   } else {
//     console.error(`Alignment button at index ${index} not found.`);
//   }
// });

// // ==========================================================================
// // Constraint Functionality
// // ==========================================================================

// // Function to apply constraint to the selected component
// function applyTextConstraint(target, constraint) {
//   const targetComponent = validateTextComponent(target);
//   if (!targetComponent) return;

//   const currentStyles = targetComponent.getStyle() || {};
//   let newStyles;

//   switch (constraint) {
//     case "center":
//       newStyles = {
//         ...currentStyles,
//         position: "absolute",
//         left: "50%",
//         top: "50%",
//         transform: "translate(-50%, -50%)",
//       };
//       break;
//     case "left":
//       newStyles = {
//         ...currentStyles,
//         position: "absolute",
//         left: "0px",
//         top: "0px",
//         transform: "none",
//       };
//       break;
//     case "right":
//       newStyles = {
//         ...currentStyles,
//         position: "absolute",
//         left: "auto",
//         top: "0px",
//         right: "0px",
//         transform: "translateX(-100%)",
//       };
//       break;
//     case "down":
//       newStyles = {
//         ...currentStyles,
//         position: "absolute",
//         left: "0px",
//         top: "auto",
//         bottom: "0px",
//         transform: "translateY(-100%)",
//       };
//       break;
//     default:
//       newStyles = {
//         ...currentStyles,
//         position: "relative",
//         left: "auto",
//         top: "auto",
//         transform: "none",
//       };
//   }

//   targetComponent.setStyle(newStyles);
//   targetComponent.trigger("component:update");
// }

// // Constraint event listeners
// textConstraintButtons.forEach((button, index) => {
//   if (button) {
//     button.addEventListener("click", () => {
//       const constraint = button.dataset.contraint;
//       const selected = grapeEditor.getSelected();
//       const target = validateTextComponent(selected);
//       if (!target) return;
//       applyTextConstraint(target, constraint);
//       textConstraintButtons.forEach((btn) => btn.classList.remove("active"));
//       button.classList.add("active");
//     });
//   } else {
//     console.error(`Constraint button at index ${index} not found.`);
//   }
// });

// // ==========================================================================
// // Position Functionality
// // ==========================================================================

// // Function to apply position to the selected component
// function applyTextPosition(target, position) {
//   const targetComponent = validateTextComponent(target);
//   if (!targetComponent) return;

//   const currentStyles = targetComponent.getStyle() || {};
//   const newStyles = {
//     ...currentStyles,
//     position: position,
//   };

//   targetComponent.setStyle(newStyles);
//   targetComponent.trigger("component:update");
// }

// // Position event listener
// if (textPositionSelect) {
//   textPositionSelect.addEventListener("change", () => {
//     const position = textPositionSelect.value;
//     const selected = grapeEditor.getSelected();
//     const target = validateTextComponent(selected);
//     if (!target) return;
//     applyTextPosition(target, position);
//   });
// } else {
//   console.error(
//     "Position select element not found. Please check the selector '#textStyleContainer .text_style_inner_container_position select'."
//   );
// }

// // Initialize badge color
// if (textColorInput && textColorBadge) {
//   textColorBadge.style.backgroundColor = textColorInput.value;
// }
