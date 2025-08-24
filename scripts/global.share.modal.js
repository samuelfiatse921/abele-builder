/**
 *
 *
 *
 * Following Share Modal
 *
 *
 */

const showFollowingShareModalBtns = document.querySelectorAll(
  ".show-following-share-modal-btn"
);
const followingShareModal = document.getElementById("followingShareMdal");
const followingShareModalManualCancel = document.getElementById(
  "followingShareModalManualCancel"
);

// Show Modal
showFollowingShareModalBtns.forEach((btn) => {
  btn.addEventListener("click", showGlobalShareFollowingModal);
});

// Hide Modal
followingShareModal.addEventListener("click", (e) => {
  if (e.target.id === "followingShareMdal") {
    hideGlobalShareFollowingModal();
  }
});
followingShareModalManualCancel.addEventListener(
  "click",
  hideGlobalShareFollowingModal
);

function showGlobalShareFollowingModal() {
  followingShareModal.classList.remove(HIDDEN);
}

function hideGlobalShareFollowingModal() {
  followingShareModal.classList.add(HIDDEN);
}

/**
 *
 *
 *
 *
 * Clipboard Listener
 *
 *
 *
 */

const followingShareClipboardBtn = document.getElementById(
  "followingShareClipboardBtn"
);

followingShareClipboardBtn.addEventListener("click", function () {
  const URLText =
    this.closest(".clipboard").querySelector(".text-to-copy").textContent;
  const copyPending = this.querySelector("#share_copy_icon");
  const copySuccess = this.querySelector("#share_copy_success");

  navigator.clipboard.writeText(URLText).then(() => {
    copyPending.classList.add(HIDDEN);
    copySuccess.classList.remove(HIDDEN);

    setTimeout(() => {
      copyPending.classList.remove(HIDDEN);
      copySuccess.classList.add(HIDDEN);
    }, 2000);
  });
});
