// /**
//  * Text Editor Functionality for GrapesJS
//  * Enables bold, italic, uppercase, UL, OL, font family, font size, and font weight formatting with two-way binding
//  * Uses document.queryCommandState for inline formatting state detection
//  * Implements a live preview of the formatted text in a sample text area (div)
//  * Automatically shows the text editor sidebar when a text component is selected
//  * Organized into distinct sections with comments and gaps
//  * Wrapped in IIFE to prevent global namespace conflicts
//  */
// (function () {
//   // Guard clause to prevent re-execution
//   if (window.textEditorFunctionalitiesLoaded) {
//     console.log(
//       "Text Editor functionalities already loaded, skipping initialization."
//     );
//     return;
//   }
//   window.textEditorFunctionalitiesLoaded = true;

//   // ==========================================================================
//   // Initial Setup and Validation
//   // ==========================================================================

//   // Ensure grapeEditor is defined
//   if (typeof grapeEditor === "undefined") {
//     console.error(
//       "grapeEditor is not defined. Please ensure the GrapesJS editor is initialized before loading this script."
//     );
//     throw new Error("grapeEditor is not defined");
//   }

//   // ==========================================================================
//   // Shared DOM Elements
//   // ==========================================================================

//   const addHeadingButton = document.getElementById("addHeadingButton");

//   // ==========================================================================
//   // Add Heading Functionality
//   // ==========================================================================

// })();
