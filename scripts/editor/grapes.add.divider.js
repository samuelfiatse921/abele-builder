document.getElementById("toggleMarginSizes").addEventListener("click", () => {
  const selected = grapeEditor.getSelected();

  // Check if a valid element is selected
  if (!selected) {
    if (!selectedComponent) {
      showFlashMessage(
        "Please select an element.",
        "Invalid component success",
        "error",
        5000
      );
    }
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

  // // Check if element is flex or grid
  // if (!['flex', 'grid'].includes(currentDisplay)) {
  //   alert("Selected element must have display: flex or grid.");
  //   return;
  // }

  // Get current gap and margins
  const currentGap = currentStyle.gap || "";
  const currentMarginTop =
    currentStyle["margin-top"] || currentStyle.marginTop || "";
  const currentMarginBottom =
    currentStyle["margin-bottom"] || currentStyle.marginBottom || "";

  // Toggle gap
  let newGap = "10px"; // Default small gap
  if (currentGap === "10px") {
    newGap = "30px"; // Medium gap
  } else if (currentGap === "30px") {
    newGap = "50px"; // Large gap
  } else if (currentGap === "50px") {
    newGap = ""; // No gap
  } else {
    newGap = "10px"; // Reset to small for unexpected values
  }

  // Toggle margins (same value for top and bottom)
  let newMargin = "20px"; // Default medium margin
  if (currentMarginTop === "20px" && currentMarginBottom === "20px") {
    newMargin = "40px"; // Large margin
  } else if (currentMarginTop === "40px" && currentMarginBottom === "40px") {
    newMargin = "0px"; // No margin
  } else {
    newMargin = "20px"; // Reset to medium for unexpected values
  }

  // Apply new styles
  selected.setStyle({
    ...currentStyle,
    gap: newGap,
    "margin-top": newMargin,
    "margin-bottom": newMargin,
  });
  selected.trigger("component:update"); // Notify GrapesJS of the change

  // // Update button text to show gap and margin states
  // const spacingButton = document.getElementById("toggleFlexSpacing");
  // const gapText = newGap === '' ? 'None' :
  //                 newGap === '10px' ? 'Small' :
  //                 newGap === '30px' ? 'Medium' : 'Large';
  // const marginText = newMargin === '0px' ? 'None' :
  //                   newMargin === '20px' ? 'Medium' : 'Large';
  // const nextGapText = newGap === '' ? 'Small' :
  //                    newGap === '10px' ? 'Medium' :
  //                    newGap === '30px' ? 'Large' : 'None';
  // const nextMarginText = newMargin === '0px' ? 'Medium' :
  //                       newMargin === '20px' ? 'Large' : 'None';

  // spacingButton.textContent = `Spacing: Gap ${gapText} → ${nextGapText}, Margin ${marginText} → ${nextMarginText}`;
});
