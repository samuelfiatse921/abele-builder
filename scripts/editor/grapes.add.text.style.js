/**
 * Text Style UI Functionality for GrapesJS
 * Handles showing/hiding the text style container and toggling between style containers
 * Mirrors the button style UI logic for consistency
 */

// Define the hidden class constant

// DOM elements for the text style UI
const addTextStyleButton = document.getElementById("addTextStyleButton");
const textStyleContainer = document.getElementById("textStyleContainer");
const textStyleContainerHeader = document.getElementById(
  "textStyleContainerHeader"
);
const allTextStyleHeaderButtons = textStyleContainer.querySelectorAll("button");
const textStyleContainerContainers = document.querySelectorAll(
  ".text_style_container_container_text"
);

// Event listener to toggle between different text style containers
textStyleContainerHeader.addEventListener("click", (e) => {
  const button = e.target.closest("button");
});
