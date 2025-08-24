/**
 *
 *
 * Following & Followers Modal
 *
 *
 */
const followerShareBtn = document.querySelector(".share_follower--tab");
const followingShareBtn = document.querySelector(".share_following--tab");
const followModal = document.getElementById("followingsFollowersModal");
const followingModalManualCancel = document.getElementById("followingModalManualCancel");

// Show
followerShareBtn?.addEventListener("click", showGlobalFollowingModal);
followingShareBtn?.addEventListener("click", showGlobalFollowingModal);

// Hide Modal
followModal.addEventListener("click", (e) => {
  if (e.target.id === "followingsFollowersModal") {
    hideGlobalFollowingModal();
  }
});
followingModalManualCancel.addEventListener("click", hideGlobalFollowingModal);

function showGlobalFollowingModal() {
  followModal.classList.remove(HIDDEN);
}

function hideGlobalFollowingModal() {
  followModal.classList.add(HIDDEN);
}
/**
 *
 *
 *
 *
 *
 *
 *
 */
const followerBtn = document.querySelector(".follow_modal_header_switch_button button:first-child");
const followingBtn = document.querySelector(".follow_modal_header_switch_button button:last-child");
const followerTab = document.querySelector(".follow_users .followings");
const followingTab = document.querySelector(".follow_users .followers");
const followRowButtons = document.querySelectorAll(".follow_modal_row button");

followerBtn.addEventListener("click", () => followTabHandler.call(followerBtn, "remove", "add"));
followingBtn.addEventListener("click", () => followTabHandler.call(followingBtn, "add", "remove"));

function followTabHandler(tab1, tab2) {
  document.querySelectorAll(".follow_modal_header_switch_button button").forEach((btn) => btn.classList.remove("active"));
  this.classList.add("active");

  followerTab.classList[tab1](HIDDEN);
  followingTab.classList[tab2](HIDDEN);
}

followRowButtons.forEach((btn) =>
  btn.addEventListener("click", (e) => {
    if (!btn.classList.contains("active")) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  })
);

/**
 *
 *
 *
 *
 * Selecting Event
 *
 *
 *
 *
 *
 *
 */

// Following and Followers Modal Tab
const followContainer = document.querySelector(".follow_users");
const followBtn = document.querySelector(".follow_modal_header_switch_button");
const followersContainer = document.querySelector(".follow_users .followers");
const followingsContainer = document.querySelector(".follow_users .followings");

// switching Tab
followBtn.addEventListener("click", function (e) {
  const followingBtn = followBtn.querySelector(".following--btn");
  const followersBtn = followBtn.querySelector(".followers--btn");

  if (!e.target.classList.contains("following--btn")) {
    followersBtn.classList.add("follow_active--btn");
    followingBtn.classList.remove("follow_active--btn");
    followingsContainer.classList.add(HIDDEN);
    followersContainer.classList.remove(HIDDEN);
  } else {
    followersBtn.classList.remove("follow_active--btn");
    followingBtn.classList.add("follow_active--btn");
    followingsContainer.classList.remove(HIDDEN);
    followersContainer.classList.add(HIDDEN);
  }
});

// selecting user when dom is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  const followRows = document.querySelectorAll(".follow_modal_row");

  followRows.forEach((row) => {
    row.addEventListener("click", (e) => {
      const selected = e.target.closest(".follow_modal_row").querySelector(".checkbox");
      const selectedBtn = selected?.querySelector(".selected");
      const unSelectedBtn = selected?.querySelector(".unselected");

      // if one of the two icon is not defined
      if (!selectedBtn || !unSelectedBtn) return;

      if (!selectedBtn.classList.contains(HIDDEN)) {
        selectedBtn.classList.add(HIDDEN);
        unSelectedBtn.classList.remove(HIDDEN);
      } else {
        selectedBtn.classList.remove(HIDDEN);
        unSelectedBtn.classList.add(HIDDEN);
      }
    });
  });
});
