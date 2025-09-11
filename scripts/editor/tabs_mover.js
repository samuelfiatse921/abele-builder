const tabs = document.querySelectorAll(".tab");
const contents = document.querySelectorAll(".tab-content, .pages-tab-content");

tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        // remove active from all
        tabs.forEach(t => t.classList.remove("active"));
        contents.forEach(c => c.classList.remove("active"));

        // add active to clicked tab + its content
        tab.classList.add("active");
        document.getElementById("content" + tab.dataset.tab).classList.add("active");
    });
});

const stylestabs = document.querySelectorAll(".styles-tab");
const stylescontents = document.querySelectorAll(".styles-tab-content");

stylestabs.forEach(tab => {
    tab.addEventListener("click", () => {
        // remove active from all
        stylestabs.forEach(t => t.classList.remove("active"));
        stylescontents.forEach(c => c.classList.remove("active"));

        // add active to clicked tab + its content
        tab.classList.add("active");
        document.getElementById("styles-content" + tab.dataset.tab).classList.add("active");
    });
});
