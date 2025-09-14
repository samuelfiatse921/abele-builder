const modal = document.getElementById('about-project-modal');
const openBtn = document.getElementById('aboutProjectBtn');
const closeBtn = document.querySelector('.about-project-modal-close');

// Open modal
openBtn.addEventListener('click', () => {
    const select = document.querySelector(".show");
    select.classList.remove("show");

    modal.style.display = 'block';
});

// Close when clicking X
closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

const loadProjectModal = document.getElementById('load-project-modal');
const loadProjectCloseBtn = document.querySelector('.load-project-modal-close');

function loadProjects(event, el) {
    const select = document.querySelector(".show");
    select.classList.remove("show");

    loadProjectModal.style.display = 'block';
}

loadProjectCloseBtn.addEventListener('click', () => {
    loadProjectModal.style.display = 'none';
});

// Close when clicking outside modal content
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    } else if (e.target === loadProjectModal) {
        loadProjectModal.style.display = 'none';
    }
});





