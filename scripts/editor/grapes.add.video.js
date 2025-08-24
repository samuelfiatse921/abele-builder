/**
 * Add Video Functionality for GrapesJS
 * Allows uploading and inserting a video into the canvas
 * Includes file size validation (max 20MB)
 * Video has controls removed and loops automatically
 * Wrapped in IIFE to prevent global namespace conflicts
 */
(function () {
  // Guard clause to prevent re-execution
  if (window.addVideoFunctionalityLoaded) {
    console.log(
      "Add Video functionality already loaded, skipping initialization."
    );
    return;
  }
  window.addVideoFunctionalityLoaded = true;

  // ==========================================================================
  // Initial Setup and Validation
  // ==========================================================================

  // Ensure grapeEditor is defined
  if (typeof grapeEditor === "undefined") {
    console.error(
      "grapeEditor is not defined. Please ensure the GrapesJS editor is initialized before loading this script."
    );
    throw new Error("grapeEditor is not defined");
  }

  // Define custom video component
  grapeEditor.Components.addType("video", {
    model: {
      defaults: {
        tagName: "video",
        attributes: {
          src: "",
          loop: true, // Enable looping
          style: "max-width: 100%; height: auto; margin: 10px 0;",
        },
      },
    },
  });

  // ==========================================================================
  // DOM Elements
  // ==========================================================================

  const videoFileInput = document.getElementById("videoFileInput");
  const videoPreview = document.getElementById("videoPreview");
  const insertSelectedVideoButton = document.getElementById(
    "insertSelectedVideo"
  );
  const deleteSelectedVideo = document.getElementById("deleteSelectedVideo");

  // ==========================================================================
  // Add Video Functionality
  // ==========================================================================

  let selectedVideoUrl = null;

  // Function to update the video preview
  function updateVideoPreview(file) {
    if (!file) return;

    // Validate file size (20MB limit = 20 * 1024 * 1024 bytes)
    const maxFileSize = 20 * 1024 * 1024; // 20MB in bytes
    if (file.size > maxFileSize) {
      showFlashMessage(
        "The video file is too large. Please upload a file smaller than 20MB.",
        "File size error",
        "error",
        5000
      );

      videoFileInput.value = ""; // Reset the input
      // Reset the preview to the default empty state
      if (videoPreview) {
        videoPreview.innerHTML =
          '<img src="./images/empty-video.png" alt="Empty Video" />';
      }
      selectedVideoUrl = null;
      return;
    }

    // Validate file type
    const validVideoTypes = ["video/mp4", "video/webm", "video/ogg"];
    if (!validVideoTypes.includes(file.type)) {
      showFlashMessage(
        "Invalid video type. Please select an MP4, WebM, or OGG file.",
        "Invalid video type",
        "error",
        5000
      );
      videoFileInput.value = ""; // Reset the input
      // Reset the preview to the default empty state
      if (videoPreview) {
        videoPreview.innerHTML =
          '<img src="./images/empty-video.png" alt="Empty Video" />';
      }
      selectedVideoUrl = null;
      return;
    }

    // Create a URL for the uploaded video file
    selectedVideoUrl = URL.createObjectURL(file);

    // Update the preview by replacing the img with a video element
    if (videoPreview) {
      videoPreview.innerHTML = ""; // Clear existing content
      const videoElement = document.createElement("video");
      videoElement.src = selectedVideoUrl;
      videoElement.loop = true; // Enable looping in preview
      videoElement.autoplay = true; // Autoplay to match looping behavior
      videoElement.style.maxWidth = "100%";
      videoElement.style.height = "auto";
      videoPreview.appendChild(videoElement);
    } else {
      console.error(
        "Video preview container not found. Please check the selector '#videoPreview'."
      );
    }
  }

  // Event listener for video file input
  if (videoFileInput) {
    videoFileInput.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (file) {
        updateVideoPreview(file);
      }
    });
  } else {
    console.error(
      "Video file input element not found. Please check the selector '#videoFileInput'."
    );
  }

  // Function to insert the video into the GrapesJS canvas
  function insertVideo() {
    if (!selectedVideoUrl) {
      showFlashMessage(
        "Please upload a video file before inserting.",
        "No video file",
        "error",
        5000
      );
      return;
    }

    const selectedComponent = grapeEditor.getSelected();

    const videoConfig = {
      type: "video",
      attributes: {
        src: selectedVideoUrl,
        loop: true, // Enable looping
        autoplay: true, // Autoplay to match looping behavior
        style: "max-width: 100%; height: auto; margin: 10px 0;",
      },
    };

    let newVideoComponent;

    if (selectedComponent && selectedComponent.components) {
      // Append inside if valid container (like div, section, etc.)
      newVideoComponent = selectedComponent.append(videoConfig);
    } else {
      // Else add to canvas root
      newVideoComponent = grapeEditor.getComponents().add(videoConfig);
    }

    grapeEditor.select(newVideoComponent);
  }

  // Event listener for the insert video button
  if (insertSelectedVideoButton) {
    insertSelectedVideoButton.addEventListener("click", () => {
      insertVideo();
    });
  } else {
    console.error(
      "Insert video button not found. Please check the selector '#insertSelectedVideo'."
    );
  }

  // ==========================================================================
  // Delete Video Functionality
  // ==========================================================================

  if (deleteSelectedVideo) {
    deleteSelectedVideo.addEventListener("click", () => {
      const selectedComponent = grapeEditor.getSelected();

      if (!selectedComponent) {
        showFlashMessage(
          "Please select a component to delete.",
          "Invalid component selected",
          "error",
          5000
        );
        return;
      }

      // Validate that the selected component is a video
      if (selectedComponent.get("type") !== "video") {
        showFlashMessage(
          "Please select a video component to delete.",
          "Invalid component selected",
          "error",
          5000
        );
        return;
      }

      selectedComponent.remove();
      console.log("Selected video component deleted:", selectedComponent);
    });
  } else {
    console.error(
      "Delete video button not found. Please check the selector '#deleteSelectedVideo'."
    );
  }
})();
