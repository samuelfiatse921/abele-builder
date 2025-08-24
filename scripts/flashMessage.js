function showFlashMessage(
  message,
  title = "",
  type = "success",
  duration = 5000,
  showButtons = false,
  event = null
) {
  const container = document.getElementById("flashContainer");

  // Create flash message element
  const flashElement = document.createElement("div");
  flashElement.className = `flash-message ${type}`;

  // Set icon based on type
  let icon;
  switch (type) {
    case "success":
      icon =
        '<svg class="flash-icon" width="24" height="24" fill="none" viewBox="0 0 24 24"  style="stroke:#10B981;fill:#fff" stroke="#10B981" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>';
      break;
    case "error":
      icon =
        '<svg class="flash-icon" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#EF4444" style="stroke:#EF4444;fill:#fff" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>';
      break;
    case "info":
      icon =
        '<svg class="flash-icon" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#3B82F6" style="stroke:#3B82F6;fill:#fff" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>';
      break;
    case "warning":
      icon =
        '<svg class="flash-icon" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#F59E0B" style="stroke:#F59E0B;fill:#fff" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>';
      break;
  }

  // Set content
  flashElement.innerHTML = `
        ${icon}
        <div class="flash-content">
          <h4 class="flash-title">${title}</h4>
          <p>${message}</p>
        </div>
        <button class="flash-close" onclick="removeFlash(this.parentElement)">
          <svg  width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        ${
          showButtons
            ? `
        <div class="flash-buttons">
          <button class="flash-button confirm">Save File</button>
          <button class="flash-button clear" style="background-color: red" onclick="removeFlash(this.parentElement.parentElement)">Don't Save</button>
        </div>
        `
            : ""
        }
      `;

  flashElement.querySelector(".confirm") &&
    flashElement
      .querySelector(".confirm")
      .addEventListener("click", event.save);
  flashElement.querySelector(".clear") &&
    flashElement.querySelector(".clear").addEventListener("click", event.clear);

  // Add to container
  container.appendChild(flashElement);

  // Trigger animation
  setTimeout(() => flashElement.classList.add("show"), 50);

  // Auto remove after duration
  if (duration) {
    setTimeout(() => removeFlash(flashElement), duration);
  }
}

function removeFlash(element) {
  element.classList.remove("show");
  setTimeout(() => element.remove(), 500);
}
