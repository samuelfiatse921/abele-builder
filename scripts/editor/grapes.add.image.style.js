const imageButton = document.getElementById("imageButton");
const imageStyleContainer = document.getElementById("imageStyleContainer");
const imageStyleContainerHeader = document.getElementById(
  "imageStyleContainerHeader"
);
const allImageStyleContainerHeaderButtons =
  imageStyleContainer.querySelectorAll("button");
const imageStyleContainerContainers = document.querySelectorAll(
  ".image_style_container_item"
);

imageButton.addEventListener("click", () => showImageEditorUI());

// imageStyleContainerHeader.addEventListener("click", (e) => {
//   const button = e.target.closest("button");

//   if (button) {
//     const { type } = button.dataset;
//     const container = document.getElementById(`imageStyleContainer${type}`);

//     allImageStyleContainerHeaderButtons.forEach((btn) =>
//       btn.classList.remove("active")
//     );
//     button.classList.add("active");

//     imageStyleContainerContainers.forEach((container) =>
//       container.classList.add(HIDDEN)
//     );
//     container.classList.remove(HIDDEN);
//   }
// });
