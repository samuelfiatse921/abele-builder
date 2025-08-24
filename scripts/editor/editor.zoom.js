/**
 * Zoom functionality for GrapesJS editor with zoom level display
 * Matches original working code with 10% increments (10%–200%)
 * Updates zoom level in #zoomValue element
 * Compatible with light/dark theme system
 */

// Declarations
const canvas = grapeEditor.Canvas; // GrapesJS Canvas module
let currentZoom = canvas.getZoom(); // Current zoom as percentage (default: 100)
const zoomStep = 10; // Zoom increment (10%)
const minZoom = 10; // Minimum zoom (10%)
const maxZoom = 200; // Maximum zoom (200%)
const zoomDisplay = document.getElementById("zoomValue"); // Zoom level display

// Initialize zoom display
if (zoomDisplay) {
  zoomDisplay.textContent = `${currentZoom}%`; // Set initial zoom
} else {
  console.warn("Zoom display element (#zoomValue) not found.");
}

// Zoom-in event listener
document.getElementById("zoom-in").addEventListener("click", () => {
  currentZoom = Math.min(currentZoom + zoomStep, maxZoom); // Max 200%
  canvas.setZoom(currentZoom); // Set zoom as percentage
  if (zoomDisplay) {
    zoomDisplay.textContent = `${currentZoom}%`; // Update display
  }
});

// Zoom-out event listener
document.getElementById("zoom-out").addEventListener("click", () => {
  currentZoom = Math.max(currentZoom - zoomStep, minZoom); // Min 10%
  canvas.setZoom(currentZoom); // Set zoom as percentage
  if (zoomDisplay) {
    zoomDisplay.textContent = `${currentZoom}%`; // Update display
  }
});
