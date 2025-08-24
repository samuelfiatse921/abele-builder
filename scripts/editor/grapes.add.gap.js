document.getElementById("toggleFlexSpacing").addEventListener("click", () => {
  const selected = grapeEditor.getSelected();

  // Check if a valid element is selected
  if (!selected) {
    showFlashMessage(
      "Please select an element.",
      "Invalid component success",
      "error",
      5000
    );
    return;
  }

  const tagName = selected.get("tagName").toLowerCase();
  if (!["div", "section"].includes(tagName)) {
    showFlashMessage(
      "Please select a div or section element.",
      "Invalid component success",
      "error",
      5000
    );
    return;
  }

  // Get current display style
  const currentStyle = selected.getStyle() || {};
  const currentDisplay = currentStyle.display || "";

  // Check if element is flex or grid
  if (!["flex", "grid"].includes(currentDisplay)) {
    showFlashMessage(
      "Selected element must have display: flex or grid.",
      "Invalid component success",
      "error",
      5000
    );
    return;
  }

  // Get current gap, default to empty string if undefined
  const currentGap = currentStyle.gap || "";
  let newGap = "16px"; // Default small gap

  // Toggle between spacing sizes
  if (currentGap === "16px") {
    newGap = "50px"; // Medium gap
  } else if (currentGap === "50px") {
    newGap = "120px"; // Large gap
  } else if (currentGap === "120px") {
    newGap = ""; // No gap
  } else {
    newGap = "16px"; // Reset to small gap for unexpected values
  }

  // Apply the new gap
  selected.setStyle({ ...currentStyle, gap: newGap });
  selected.trigger("component:update"); // Notify GrapesJS of the change

  // // Update button text to show current and next state
  // const spacingButton = document.getElementById("toggleFlexSpacing");
  // if (newGap === '') {
  //   spacingButton.textContent = "Flex/Grid Spacing: None → Small";
  // } else if (newGap === '10px') {
  //   spacingButton.textContent = "Flex/Grid Spacing: Small → Medium";
  // } else if (newGap === '30px') {
  //   spacingButton.textContent = "Flex/Grid Spacing: Medium → Large";
  // } else {
  //   spacingButton.textContent = "Flex/Grid Spacing: Large → None";
  // }
});
