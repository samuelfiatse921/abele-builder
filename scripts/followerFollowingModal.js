document.querySelector(".more_collabo").addEventListener("click", function () {
  const container = document.querySelector(".users_modal_container");
  if (container.style.display === "none" || container.style.display === "") {
    container.style.display = "block";
  } else {
    container.style.display = "none";
  }
});
