const addMapStyleButton = document.getElementById("addMapStyleButton");

addMapStyleButton.addEventListener("click", (e) => {
    const searchFileNameSection = document.getElementById(
        "searchFileNameSection"
    );
    const editorToolsList = document.getElementById("editorToolsList");

    searchFileNameSection.classList.add(HIDDEN);
    editorToolsList.classList.add(HIDDEN);

    mapStyleContainer.classList.remove(HIDDEN);
});

// buttonStyleContainerHeader.addEventListener("click", (e) => {
//   const button = e.target.closest("button");

//   if (button) {
//     const { type } = button.dataset;
//     const container = document.getElementById(`buttonStyleContainer${type}`);

//     allButtonStyleHeaderButtons.forEach((btn) =>
//       btn.classList.remove("active")
//     );
//     button.classList.add("active");

//     buttonStyleContainerContainers.forEach((container) =>
//       container.classList.add(HIDDEN)
//     );
//     container.classList.remove(HIDDEN);
//   }
// });
