document.addEventListener("DOMContentLoaded", () => {
  const exportTemplate = document.querySelectorAll(".exportTemplate");
  const exportModal = document.getElementById("exportModal");

  exportTemplate.forEach((item) => {
    item.addEventListener("click", () => {
      exportModal.classList.remove(HIDDEN);
    });
  });

  exportModal.addEventListener("click", (e) => {
    if (e.target === exportModal) {
      exportModal.classList.add(HIDDEN);
    }
  });
});
