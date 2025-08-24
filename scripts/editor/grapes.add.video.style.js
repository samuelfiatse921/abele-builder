// ==========================
// Setup DOM Elements
// ==========================
const videoButton = document.getElementById("videoButton");
const videoStyleContainer = document.getElementById("videoStyleContainer");
const videoStyleContainerHeader = document.getElementById(
  "videoStyleContainerHeader"
);
const allVideoStyleContainerHeaderButtons =
  videoStyleContainer.querySelectorAll("button");
const videoStyleContainerContainers = document.querySelectorAll(
  ".video_style_container_item"
);

const videoPreview = document.getElementById("videoPreview");
const videoFileInput = document.getElementById("videoFileInput");
const deleteSelectedVideo = document.getElementById("deleteSelectedVideo");
const insertSelectedVideo = document.getElementById("insertSelectedVideo");

let selectedVideoUrl = null;
const validVideoTypes = ["video/mp4", "video/webm", "video/ogg"];
const maxVideoFileSize = 20 * 1024 * 1024; // 20MB
// const HIDDEN = "editor--hidden"; // Assuming you already have this globally

// ==========================
// Event Listeners for Main Video Button (show editor UI)
// ==========================
videoButton.addEventListener("click", () => showVideoEditorUI());

// ==========================
// Event Listener for Header Buttons (switch sections)
// // ==========================
// videoStyleContainerHeader.addEventListener("click", (e) => {
//   const button = e.target.closest("button");

//   if (button) {
//     const { type } = button.dataset;
//     const container = document.getElementById(`videoStyleContainer${type}`);

//     allVideoStyleContainerHeaderButtons.forEach((btn) =>
//       btn.classList.remove("active")
//     );
//     button.classList.add("active");

//     videoStyleContainerContainers.forEach((container) =>
//       container.classList.add(HIDDEN)
//     );
//     container.classList.remove(HIDDEN);
//   }
// });

// ==========================
// Process Video File
// ==========================
function processVideoFile(file) {
  if (!file) return;

  // Validate type
  if (!validVideoTypes.includes(file.type)) {
    showFlashMessage(
      "Invalid video type. Please select an MP4, WebM, or OGG file.",
      "Invalid video type",
      "error",
      5000
    );
    resetVideoPreview();
    return;
  }

  // Validate size
  if (file.size > maxVideoFileSize) {
    showFlashMessage(
      "Video size exceeds 20MB limit. Please select a smaller video.",
      "Invalid video size",
      "error",
      5000
    );
    resetVideoPreview();
    return;
  }

  // Create preview
  selectedVideoUrl = URL.createObjectURL(file);
  handleCurrentSelectedVideo(selectedVideoUrl);
}

// ==========================
// Update Video Preview
// ==========================
function handleCurrentSelectedVideo(url) {
  videoPreview.innerHTML = "";
  const videoElement = document.createElement("video");
  videoElement.src = url;
  videoElement.loop = true;
  videoElement.autoplay = true;
  videoElement.muted = true;
  videoElement.style.maxWidth = "100%";
  videoElement.style.height = "auto";
  videoElement.style.position = "absolute";
  videoPreview.appendChild(videoElement);
}

// ==========================
// Reset Video Preview
// ==========================
function resetVideoPreview() {
  selectedVideoUrl = null;
  videoPreview.innerHTML = `<img src="./images/empty-video.png" alt="Empty Video" />`;
  if (videoFileInput) {
    videoFileInput.value = ""; // Reset input
  }
}

// ==========================
// Event Listeners for File Input and Delete
// ==========================
videoFileInput.addEventListener("input", (e) => {
  const file = e.target.files[0];
  processVideoFile(file);
});

deleteSelectedVideo.addEventListener("click", () => {
  resetVideoPreview();
});

// ==========================
// Insert Video Into GrapesJS
// ==========================
insertSelectedVideo.addEventListener("click", handleSelectedVideoInsertion);
videoPreview.addEventListener("click", handleSelectedVideoInsertion);

function handleSelectedVideoInsertion() {
  if (selectedVideoUrl) {
    const selectedComponent = grapeEditor.getSelected();

    if (selectedComponent) {
      console.log("Selected component:", selectedComponent.getEl());
      console.log("Selected component type:", selectedComponent.get("type"));
      console.log(
        "Selected component tagName:",
        selectedComponent.get("tagName")
      );
      console.log(
        "Selected component classes:",
        selectedComponent.getClasses()
      );

      if (
        !selectedComponent.is("text") &&
        !selectedComponent.is("image") &&
        !selectedComponent.is("video")
      ) {
        const isValidContainer =
          selectedComponent.get("tagName") === "div" ||
          selectedComponent.get("type") === "default";
        const rootWrapper = grapeEditor.getWrapper();

        if (isValidContainer && selectedComponent !== rootWrapper) {
          console.log(
            "Appending video to selected component:",
            selectedComponent.getEl()
          );
          selectedComponent.append({
            type: "video",
            tagName: "video",
            attributes: {
              src: selectedVideoUrl,
              loop: true,
              autoplay: true,
              muted: true,
            },
            style: { width: "100%", height: "auto" },
          });
        } else {
          let targetComponent = selectedComponent;
          let parent = targetComponent.parent();
          while (parent && parent !== rootWrapper) {
            console.log(
              "Checking parent:",
              parent.getEl(),
              "Type:",
              parent.get("type"),
              "TagName:",
              parent.get("tagName")
            );
            if (
              (parent.get("tagName") === "div" ||
                parent.get("type") === "default") &&
              !parent.is("text") &&
              !parent.is("image") &&
              !parent.is("video")
            ) {
              targetComponent = parent;
              break;
            }
            parent = parent.parent();
          }

          if (targetComponent !== rootWrapper) {
            console.log(
              "Appending video to target component:",
              targetComponent.getEl()
            );
            targetComponent.append({
              type: "video",
              tagName: "video",
              attributes: {
                src: selectedVideoUrl,
                loop: true,
                autoplay: true,
                muted: true,
              },
              style: { width: "100%", height: "auto" },
            });
          } else {
            console.log("No suitable container found.");
            showFlashMessage(
              "Please select a valid div or section to insert the video. The root editor cannot be used directly.",
              "Invalid component selected",
              "error",
              5000
            );
          }
        }
      } else {
        showFlashMessage(
          "Please select a valid container or section to insert the video.",
          "Invalid component selected",
          "error",
          5000
        );
      }
    } else {
      showFlashMessage(
        "Please select a section in the editor before inserting the video.",
        "Invalid component selected",
        "error",
        5000
      );
    }
  } else {
    showFlashMessage(
      "Please select or upload a video.",
      "Invalid component selected",
      "error",
      5000
    );
  }
}
