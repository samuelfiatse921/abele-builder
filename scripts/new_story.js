const addStoryImage = document.querySelectorAll(".add_story_image");
const uploadStory = document.getElementById("upload_story");
const storyImagesLists = document.querySelector(".add_story_images_lists");
const storyPreview = document.getElementById("current_preview--large");
const initialAddStory = document.querySelector(".add_story");
const storyPreviewContainer = document.querySelector(".add_story--preview");
const showStoryButton = document.querySelectorAll(".showAddStoryModal");

addStoryImage.forEach((btn) => {
  btn.addEventListener("click", () => {
    uploadStory.click();
  });
});

const storyImages = [];

uploadStory.addEventListener("change", (e) => {
  const files = [...e.target.files];
  let filesProcessed = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    if (!file.type.startsWith("image")) continue;

    const reader = new FileReader();
    reader.onload = function (e) {
      const url = e.target.result;
      storyImages.push(url);
      filesProcessed++;

      // Once all files are processed, update the DOM
      if (filesProcessed === files.length) {
        // update DOM
        initialAddStory.classList.add(HIDDEN);
        storyPreviewContainer.classList.remove(HIDDEN);
        storyImagesLists.classList.remove(HIDDEN);
        updateStoryActiveInterface(storyImages[0]);
        updateStoryInterfaceList(storyImages);
      }
    };
    reader.readAsDataURL(file);
  }
});

function updateStoryInterfaceList(images) {
  if (!images.length) {
    initialAddStory.classList.remove(HIDDEN);
    storyPreviewContainer.classList.add(HIDDEN);
    storyImagesLists.classList.add(HIDDEN);
    return;
  }

  storyImagesLists.innerHTML = ""; // existing content

  images.forEach((img, i) => {
    const markup = `
        <div class="add_story_images_item ${i === 0 ? "active" : ""}" data-image="${i}">
                <img src="${img}" alt="" />
                <button class="remove_item">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="#C74E5B" d="m13.41 12l4.3-4.29a1 1 0 1 0-1.42-1.42L12 10.59l-4.29-4.3a1 1 0 0 0-1.42 1.42l4.3 4.29l-4.3 4.29a1 1 0 0 0 0 1.42a1 1 0 0 0 1.42 0l4.29-4.3l4.29 4.3a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.42Z" /></svg>
                </button>
                <span class="counter">${i + 1}</span>
        </div>
        `;

    storyImagesLists.insertAdjacentHTML("beforeend", markup);
  });
}

function updateStoryActiveInterface(img) {
  storyPreview.src = img;
}

// Image Item clicked
storyImagesLists.addEventListener("click", (e) => {
  const storyItem = e.target.closest(".add_story_images_item");
  const cancelBtn = e.target.closest(".remove_item");
  const allStoryItem = document.querySelectorAll(".add_story_images_item");

  // if remove button was click
  if (cancelBtn) {
    const { image: imageIndex } = storyItem.dataset;

    storyItem.remove(); // remove element from DOM
    storyImages.splice(+imageIndex, 1); // remove image from the array
    updateStoryActiveInterface(storyImages[0]);
    updateStoryInterfaceList(storyImages);
    return;
  }

  if (storyItem) {
    const { image: imageIndex } = storyItem.dataset;
    const activateImage = storyImages[+imageIndex];

    updateStoryActiveInterface(activateImage);
    allStoryItem.forEach((item) => item.classList.remove("active"));
    storyItem.classList.add("active");
    storyItem.scrollIntoView({ behavior: "smooth" });
  }
});

// Clicked on Story overlay
const storyOverlay = document.querySelector(".story_overlay");

storyOverlay.addEventListener("click", (e) => {
  if (e.target.classList.contains("story_overlay")) {
    storyOverlay.classList.add(HIDDEN);
  }
});

///////////////////////////////////////////
///////////////////////////////////////////
///////////////////////////////////////////
///////////////////////////////////////////
///////////////////////////////////////////
///////////////////////////////////////////
///////////////////////////////////////////
//  Visibility Event
const toggleStoryVisibility = document.querySelector(".toggle_story_visibility");
const storyVisibilityOptions = document.querySelector(".visibility .visibility_options");
const visibilityLabel = document.querySelector(".visibility button>div");

toggleStoryVisibility.addEventListener("click", function () {
  const optionState = JSON.parse(storyVisibilityOptions.ariaExpanded); // JSON.parse will convert the boolean string to real boolean

  if (!optionState) {
    storyVisibilityOptions.classList.remove(HIDDEN);
    storyVisibilityOptions.ariaExpanded = "true";
  } else {
    hideVisiblityOption();
  }
});

// Option Select
storyVisibilityOptions.addEventListener("click", (e) => {
  const li = e.target.closest('[role="button"]');

  if (li) {
    const { visibility } = li.dataset;

    visibilityLabel.textContent = `${visibility[0].toUpperCase()}${visibility.slice(1)}`;
    hideVisiblityOption();
  }
});

// Outside click
document.addEventListener("click", function (e) {
  if (!e.target.closest(".visibility")) {
    hideVisiblityOption();
  }
});

function hideVisiblityOption() {
  storyVisibilityOptions.classList.add(HIDDEN);
  storyVisibilityOptions.ariaExpanded = "false";
}

function showStoryModal() {
  storyOverlay.classList.remove(HIDDEN);
}

showStoryButton.forEach((btn) => {
  btn.onclick = () => {
    storyOverlay.classList.remove(HIDDEN);

    // Hide all share overlay, if there is
    document.querySelectorAll(".share-overlay").forEach((modal) => {
      modal.classList.add(HIDDEN);
    });

    // For paper Editiing Page
    if (location.pathname === "/paper-editing.html") {
      const shareBoardOverlay = document.getElementById("share_board_overlay");
      shareBoardOverlay.classList.add(HIDDEN);
    }
  };
});

const mobileHideStoryModalBtn = document.getElementById("mobileHideStoryModalBtn");
mobileHideStoryModalBtn?.addEventListener("click", () => {
  storyOverlay.classList.add(HIDDEN);
});
