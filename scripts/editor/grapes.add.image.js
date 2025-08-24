const mediaPreview = document.getElementById("mediaPreview");
const imageFileInput = document.getElementById("imageFileInput");
const deleteSelectedImage = document.getElementById("deleteImage");
const insertSelectedImage = document.getElementById("insertSelectedImage");
const deleteSelectedImageFromCanvas = document.getElementById(
  "deleteSelectedImage"
);
let selectedImage = "";

//////////////////////////////////// Image Handling Utilities
const ImageUtils = {
  // Process image file for preview and storage
  processImageFile: (file) => {
    if (!file) return false;

    // Validate file type (must be an image)
    if (!file.type.startsWith("image/")) {
      showFlashMessage(
        "Invalid file type. Please select a valid image file (e.g., PNG, JPEG).",
        "Invalid file type",
        "error",
        5000
      );
      return false;
    }

    // Validate file size (20MB limit = 20 * 1024 * 1024 bytes)
    const maxSize = 20 * 1024 * 1024;
    if (file.size > maxSize) {
      showFlashMessage(
        "File size exceeds 20MB limit. Please select a smaller image.",
        "File size error",
        "error",
        5000
      );
      return false;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target.result;
      localStorage.setItem("selectedImage", url);
      selectedImage = url;
      ImageUtils.displayImagePreview(url);
    };
    reader.readAsDataURL(file);
    return true;
  },

  // Display image preview
  displayImagePreview: (url) => {
    mediaPreview.innerHTML = "";
    const img = document.createElement("img");
    img.src = url;
    img.style.maxWidth = "100%";
    img.style.height = "100%";
    img.style.position = "absolute";
    mediaPreview.appendChild(img);
  },

  // Create image component for GrapesJS
  createImageComponent: (imageUrl) => ({
    type: "image",
    tagName: "img",
    attributes: { src: imageUrl, alt: "Inserted Image" },
    style: {
      display: "block",
      width: "100%",
      height: "auto",
      "min-height": "100px",
      margin: "10px 0",
    },
    selectable: true,
    hoverable: true,
  }),
};

//////////////////////////////////// Event Handlers
const EventHandlers = {
  handleDragEvents: () => {
    // Prevent default behaviors for drag events
    ["dragover", "dragleave", "drop"].forEach((eventName) => {
      mediaPreview.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
      });
    });

    // Add visual cue when a file is dragged over
    mediaPreview.addEventListener("dragover", () => {
      mediaPreview.classList.add("dragover");
    });

    mediaPreview.addEventListener("dragleave", () => {
      mediaPreview.classList.remove("dragover");
    });

    // Handle the drop event
    mediaPreview.addEventListener("drop", (e) => {
      mediaPreview.classList.remove("dragover");
      ImageUtils.processImageFile(e.dataTransfer.files[0]);
    });
  },

  handleImageSelection: () => {
    imageFileInput.addEventListener("input", (e) => {
      ImageUtils.processImageFile(e.target.files[0]);
    });
  },

  handleImageDeletion: () => {
    deleteSelectedImage.addEventListener("click", () => {
      selectedImage = "";
      mediaPreview.innerHTML = `<img src="./images/empty-image.png" alt="Empty Images" />`;
    });
  },

  handleImageInsertion: () => {
    const insertImage = () => {
      if (!selectedImage) {
        showFlashMessage(
          "Please select or upload an image before inserting.",
          "Image not selected",
          "error",
          5000
        );
        return;
      }

      const selectedComponent = grapeEditor.getSelected();
      const rootWrapper = grapeEditor.getWrapper();
      let targetComponent = rootWrapper; // Default to root wrapper

      // Check if the selected component is a div or section
      if (selectedComponent) {
        const tagName = selectedComponent.get("tagName")?.toLowerCase();
        if (tagName === "div" || tagName === "section") {
          targetComponent = selectedComponent;
        }
      }

      // Create and append the image component directly
      const imageComponent = ImageUtils.createImageComponent(selectedImage);
      targetComponent.append(imageComponent);
    };

    mediaPreview.addEventListener("click", insertImage);
    insertSelectedImage.addEventListener("click", insertImage);
  },

  handleImageDeletionFromCanvas: () => {
    deleteSelectedImageFromCanvas.addEventListener("click", () => {
      const selectedComponent = grapeEditor.getSelected();

      if (!selectedComponent) {
        showFlashMessage(
          "Please select a component to delete.",
          "Invalid component success",
          "error",
          5000
        );
        return;
      }

      // Validate that the selected component is an image
      if (selectedComponent.get("type") !== "image") {
        showFlashMessage(
          "Please select an image component to delete.",
          "Invalid component success",
          "error",
          5000
        );
        return;
      }

      selectedComponent.remove();
      console.log("Selected image component deleted:", selectedComponent);
    });
  },
};

//////////////////////////////////// Initialize
EventHandlers.handleDragEvents();
EventHandlers.handleImageSelection();
EventHandlers.handleImageDeletion();
EventHandlers.handleImageInsertion();
EventHandlers.handleImageDeletionFromCanvas();
