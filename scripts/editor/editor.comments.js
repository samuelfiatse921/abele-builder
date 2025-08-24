const comments = [
  {
    id: 789,
    name: "Maxine M. Hutchinson",
    photo:
      "https://images.unsplash.com/photo-1464863979621-258859e62245?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhdXR5JTIwcHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
    comment:
      "This concept is excellent! Let's explore it further in our next meeting and brainstorm potential implementation strategies.",
    createdAt: "2 min ago",
    likes: 3,
    replies: [
      {
        id: 238797,
        name: "Eduardo M. Mosley",
        photo:
          "https://images.unsplash.com/photo-1502323777036-f29e3972d82f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGJlYXV0eSUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D",
        comment: "We might need to consider the timeline for this project.",
        createdAt: "1 hour ago",
        likes: 1,
        replies: [],
      },
      {
        id: 576892,
        name: "Minnie D. Cuellar",
        photo:
          "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YmVhdXR5JTIwcHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
        comment: "Has anyone considered the budget implications?",
        createdAt: "32 min ago",
        likes: 1,
        replies: [],
      },
    ],
  },

  {
    id: 219,
    name: "Candice J. Robertson",
    photo:
      "https://images.unsplash.com/photo-1526888935184-a82d2a4b7e67?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzB8fGZpbmUlMjBtYWxlJTIwcHJvZmlsZSUyMHdpdGglMjBicmVhc3R8ZW58MHx8MHx8fDA%3D",
    comment: "I agree! This could be a great opportunity.",
    createdAt: "2 min ago",
    likes: 1,
    replies: [],
  },

  {
    id: 29,
    name: "Gilbert P. Moore",
    photo:
      "https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDJ8fGZpbmUlMjBtYWxlJTIwcHJvZmlsZSUyMHdpdGglMjBicmVhc3R8ZW58MHx8MHx8fDA%3D",
    comment: "Good idea. We should definitely discuss it further.",
    createdAt: "2 min ago",
    likes: 1,
    replies: [],
  },

  {
    id: 2172,
    name: "Sarah H. Edwards",
    photo:
      "https://plus.unsplash.com/premium_photo-1703382945989-abbdc339770e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Njl8fGZpbmUlMjBtYWxlJTIwcHJvZmlsZSUyMHdpdGglMjBicmVhc3R8ZW58MHx8MHx8fDA%3D",
    comment: "I have some concerns about the technical feasibility.",
    createdAt: "4 days ago",
    likes: 1,
    replies: [],
  },

  {
    id: 25453423,
    name: "Sarah H. Edwards",
    photo:
      "https://plus.unsplash.com/premium_photo-1703382945989-abbdc339770e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Njl8fGZpbmUlMjBtYWxlJTIwcHJvZmlsZSUyMHdpdGglMjBicmVhc3R8ZW58MHx8MHx8fDA%3D",
    comment: "I have some concerns about the technical feasibility.",
    createdAt: "4 days ago",
    likes: 1,
    replies: [],
  },

  {
    id: 7829,
    name: "Sarah H. Edwards",
    photo:
      "https://plus.unsplash.com/premium_photo-1703382945989-abbdc339770e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Njl8fGZpbmUlMjBtYWxlJTIwcHJvZmlsZSUyMHdpdGglMjBicmVhc3R8ZW58MHx8MHx8fDA%3D",
    comment: "I have some concerns about the technical feasibility.",
    createdAt: "4 days ago",
    likes: 1,
    replies: [],
  },

  {
    id: 677564532,
    name: "Sarah H. Edwards",
    photo:
      "https://plus.unsplash.com/premium_photo-1703382945989-abbdc339770e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Njl8fGZpbmUlMjBtYWxlJTIwcHJvZmlsZSUyMHdpdGglMjBicmVhc3R8ZW58MHx8MHx8fDA%3D",
    comment: "I have some concerns about the technical feasibility.",
    createdAt: "4 days ago",
    likes: 1,
    replies: [],
  },

  {
    id: 6574635,
    name: "Sarah H. Edwards",
    photo:
      "https://plus.unsplash.com/premium_photo-1703382945989-abbdc339770e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Njl8fGZpbmUlMjBtYWxlJTIwcHJvZmlsZSUyMHdpdGglMjBicmVhc3R8ZW58MHx8MHx8fDA%3D",
    comment: "I have some concerns about the technical feasibility.",
    createdAt: "4 days ago",
    likes: 1,
    replies: [],
  },
];
let commentsData = JSON.parse(JSON.stringify(comments));
function addUserHasLiked(comments) {
  return comments.map((comment) => {
    return {
      ...comment,
      userHasLiked: false,
      replies: addUserHasLiked(comment.replies),
    };
  });
}
commentsData = addUserHasLiked(commentsData);
const commentContainerBodyItems = document.getElementById(
  "commentContainerBodyItems"
);

function renderComments(comments, parentElement) {
  parentElement.innerHTML = "";

  comments.forEach((comment) => {
    const commentElement = document.createElement("div");
    commentElement.dataset.id = comment.id;
    commentElement.classList.add("comment_container_body_item");

    // Only show reply button if there are replies
    const replyButtonHTML =
      comment.replies.length > 0
        ? `<button class="comment_container_body_item_reply_button">
           <span>Reply (${comment.replies.length})</span>
         </button>`
        : "";

    commentElement.innerHTML = `
      <div class="comment_container_body_item_header">
        <img src="${comment.photo}" alt="${comment.name}" />
        <h4>${comment.name}</h4>
        <span>${comment.createdAt}</span>
      </div>

      <div class="comment_container_body_item_content">
        <p>${comment.comment}</p>
      </div>

      <div class="comment_container_body_item_footer">
        <button class="comment-l-group">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path fill="none" stroke="#8991A0" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.731 3.25a2.09 2.09 0 0 0-1.982 1.464l-.802 2.491a2 2 0 0 1-.442.76a9.5 9.5 0 0 0-1.528 2.218h-.652a2.25 2.25 0 0 0-1.243-.856c-.289-.078-.617-.077-.998-.077h-.168c-.38 0-.71 0-.998.077a2.25 2.25 0 0 0-1.591 1.59c-.078.29-.077.618-.077 1v6.167c0 .38 0 .71.077.998a2.25 2.25 0 0 0 1.59 1.591c.29.078.618.078 1 .077h.167c.38 0 .71 0 .998-.077a2.25 2.25 0 0 0 1.289-.923H15c1.341 0 2.256-.058 2.984-.367a3.87 3.87 0 0 0 1.58-1.24c.465-.618.68-1.426.999-2.622l.04-.148l.691-2.367l.01-.03c.16-.534.293-.98.37-1.35c.078-.379.116-.764.015-1.15a2.35 2.35 0 0 0-.992-1.382c-.339-.219-.717-.296-1.098-.331c-.367-.034-.823-.034-1.364-.034h-2.302c.533-1.695.358-3.066.07-3.977c-.333-1.058-1.342-1.502-2.221-1.502zm-4.98 15v-6.334l-.001-.233h1.182l.294-.636a8 8 0 0 1 1.38-2.064c.35-.377.611-.828.77-1.319l.8-2.49a.59.59 0 0 1 .555-.424h.051c.45 0 .714.21.791.454c.246.779.424 2.15-.416 3.959a.75.75 0 0 0 .68 1.066h3.364c.584 0 .97 0 1.26.027c.285.027.38.072.421.098c.171.11.3.287.356.5c.015.058.027.177-.034.47c-.06.296-.175.68-.347 1.254l-.002.005l-.698 2.386l-.002.008c-.377 1.413-.523 1.91-.79 2.265a2.37 2.37 0 0 1-.967.76c-.409.173-1.026.248-2.398.248zm-3.445-7.475c.071-.019.18-.025.694-.025c.513 0 .623.006.694.025a.75.75 0 0 1 .53.53c.02.072.026.182.026.695v6c0 .513-.006.623-.025.694a.75.75 0 0 1-.53.53c-.072.02-.182.026-.695.026s-.623-.006-.694-.026a.75.75 0 0 1-.53-.53c-.02-.071-.026-.18-.026-.694v-6c0-.513.007-.623.026-.694a.75.75 0 0 1 .53-.53"/></svg>
          <span class="count-likes">${comment.likes || ""}</span>
        </button>
        <button class="add_comment_to_comment">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path fill="none" stroke="#8991A0" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m6.825 12l2.9 2.9q.3.3.288.7t-.313.7q-.3.275-.7.288t-.7-.288l-4.6-4.6q-.3-.3-.3-.7t.3-.7l4.6-4.6q.275-.275.688-.275T9.7 5.7q.3.3.3.713t-.3.712L6.825 10H16q2.075 0 3.538 1.463T21 15v3q0 .425-.288.713T20 19t-.712-.288T19 18v-3q0-1.25-.875-2.125T16 12z"/></svg>
        </button>
        ${replyButtonHTML}
        <button class="comment_container_body_item_like_button ${
          comment.userHasLiked ? "active" : ""
        }">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path fill="none" stroke="#8991A0" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 10v12m8-16.12L14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88"/></svg>
        </button>
      </div>
      
      <div class="reply_to_comment ${HIDDEN}">
        <div class="reply_to_comment_tools_wrapper">
          <div spellcheck="false" contenteditable="true">Add a reply...</div>
          <button class="commentReplyInputWithEmoji"></button>
          <button class="commentReplyInputWithGift"></button>
        </div>
        <button class="add_new_reply_comment">Add</button>
      </div>
    `;

    parentElement.appendChild(commentElement);

    if (comment.replies.length > 0) {
      const repliesContainer = document.createElement("div");
      repliesContainer.classList.add("comment_reply_container_item", HIDDEN);
      repliesContainer.dataset.parentId = comment.id;
      commentElement.appendChild(repliesContainer);
      renderComments(comment.replies, repliesContainer);
    }
  });
}

// Helper function to find comment by ID
function findCommentById(comments, id) {
  for (const comment of comments) {
    if (comment.id === id) return comment;
    if (comment.replies.length > 0) {
      const found = findCommentById(comment.replies, id);
      if (found) return found;
    }
  }
  return null;
}

// Helper function to find parent comment
function findParentComment(element) {
  return element.closest(".comment_container_body_item");
}
// Helper function to hide all reply inputs
function hideAllReplyInputs() {
  document.querySelectorAll(".reply_to_comment").forEach((input) => {
    input.classList.add(HIDDEN);
  });
}

// Update event listener for commentContainerBodyItems
commentContainerBodyItems.addEventListener("click", (e) => {
  // Show reply input when arrow button is clicked
  if (e.target.closest(".add_comment_to_comment")) {
    hideAllReplyInputs();
    const commentElement = findParentComment(e.target);
    const replyInput = commentElement.querySelector(".reply_to_comment");
    replyInput.classList.remove(HIDDEN);
    console.log("hoo");
  }

  // Toggle replies visibility
  if (e.target.closest(".comment_container_body_item_reply_button")) {
    const commentElement = findParentComment(e.target);
    const repliesContainer = commentElement.querySelector(
      ".comment_reply_container_item"
    );
    if (repliesContainer) {
      repliesContainer.classList.toggle(HIDDEN);
      console.log("Replies toggled");
    }
  }

  // Like functionality
  if (e.target.closest(".comment_container_body_item_like_button")) {
    const commentElement = findParentComment(e.target);
    const commentId = parseInt(commentElement.dataset.id);
    const comment = findCommentById(commentsData, commentId);
    const likeButton = commentElement.querySelector(
      ".comment_container_body_item_like_button"
    );
    const likesCount = commentElement.querySelector(".count-likes");

    if (likeButton.classList.contains("active")) {
      likeButton.classList.remove("active");
      comment.likes--;
      comment.userHasLiked = false;
    } else {
      likeButton.classList.add("active");
      comment.likes++;
      comment.userHasLiked = true;
    }

    likesCount.textContent = comment.likes || "";
  }

  // Add new reply
  if (e.target.closest(".add_new_reply_comment")) {
    const addReplyButton = e.target.closest(".add_new_reply_comment");
    const replyInput = addReplyButton.closest(".reply_to_comment");
    const editableDiv = replyInput.querySelector('[contenteditable="true"]');
    const text = editableDiv.textContent.trim();

    if (text && text !== "Add a reply...") {
      const commentElement = findParentComment(replyInput);
      const commentId = parseInt(commentElement.dataset.id);
      const parentComment = findCommentById(commentsData, commentId);

      const newReply = {
        id: Date.now(),
        name: "You",
        photo:
          "https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
        comment: text,
        createdAt: "Just now",
        likes: 0,
        userHasLiked: false,
        replies: [],
      };

      parentComment.replies.push(newReply);
      renderComments(commentsData, commentContainerBodyItems);
      editableDiv.textContent = "Add a reply...";
      replyInput.classList.add(HIDDEN);
    }
  }
});

// Add event listeners for editable div
commentContainerBodyItems.addEventListener("focusin", (e) => {
  if (e.target.matches('.reply_to_comment [contenteditable="true"]')) {
    if (e.target.textContent === "Add a reply...") {
      e.target.textContent = "";
    }
  }
});

commentContainerBodyItems.addEventListener("focusout", (e) => {
  if (e.target.matches('.reply_to_comment [contenteditable="true"]')) {
    if (!e.target.textContent.trim()) {
      e.target.textContent = "Add a reply...";
    }
  }
});

// Hide reply inputs when clicking outside
// document.addEventListener("click", (e) => {
//   if (
//     !e.target.closest(".reply_to_comment") &&
//     !e.target.closest(".comment_container_body_item_reply_button")
//   ) {
//     hideAllReplyInputs();
//   }
// });

// Initialize the comments
renderComments(comments, commentContainerBodyItems);

/**
 *
 *
 *
 *
 *
 */

const commentContainerFooterInput = document.getElementById(
  "commentContainerFooterInput"
);
const commentContainerFooterButton = document.getElementById(
  "commentContainerFooterButton"
);

// commentContainerFooterInput.addEventListener("input", () => {
//   if (commentContainerFooterInput.value) {
//     commentContainerFooterButton.style.display = "block";
//   } ele {
//     comentContainerFooterButton.style.display = "none";
//   }
// });

const commentContainerCloseButton = document.getElementById(
  "commentContainerCloseButton"
);
const commentContainer = document.getElementById("commentContainer");

commentContainerCloseButton.addEventListener(
  "click",
  hideAsideCommentContainer
);

const commentContainerOpenButton = document.getElementById(
  "commentContainerOpenButton"
);
commentContainerOpenButton.addEventListener("click", showAsideCommentContainer);

/**
 *
 *
 *
 *
 *
 *
 */
