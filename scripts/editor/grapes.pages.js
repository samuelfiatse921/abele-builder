var pageCount = 1;
var pageDuplicateCount = 1;

const addPageButton = document.getElementById('addPageButton');

addPageButton.addEventListener('click', event => {
    const pageName = `Page ${pageCount}`;
    const pageElement = document.createElement('div');
    const pageList = document.createElement('div');
    pageList.className = 'page-list';

    const pageH2Element = document.createElement('h2');
    pageH2Element.textContent = pageName;

    const pageDropDown = document.createElement('div');
    pageDropDown.className = 'pages-dropdown';

    const span = document.createElement('span');
    span.addEventListener('click', event => {
        togglePagesDropdown(event, this, pageName)
    })
    span.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" role="img" aria-label="More">
            <title>More</title>
            <circle cx="12" cy="5.5" r="1.75" fill="currentColor"/>
            <circle cx="12" cy="12"  r="1.75" fill="currentColor"/>
            <circle cx="12" cy="18.5" r="1.75" fill="currentColor"/>
        </svg>
    `;

    const pageDropDownMenu = document.createElement('div');
    pageDropDownMenu.className = "pages-dropdown-content";
    pageDropDownMenu.id = `pages-dropdown-menu-${pageName}`;
    pageDropDownMenu.innerHTML = `
       <a href="#" onclick="editPageName(this)">Edit</a>
       <a href="#" onclick="duplicatePage('${pageName}')">Duplicate</a>
       <a href="#">Share</a>
       <a href="#" onclick="deletePage('${pageName}')">Delete</a>
    `;

    pageList.appendChild(pageH2Element);
    pageDropDown.appendChild(span);
    pageDropDown.appendChild(pageDropDownMenu);
    pageList.appendChild(pageDropDown);
    pageElement.appendChild(pageList);

    pageElement.style.display = "block";
    pageElement.style.width = "100%";
    pageElement.style.borderBottom = "1px solid #282B30";

    pages.add({
        id: pageName,
        name: pageName,
        styles: "",
        component: `<div>${pageName}</div>`,
    });
    pages.select(pages.get(pageName));

    pageCount++;
});

function loadPage(e) {
    const pageName = e.querySelector('h2');
    console.log(pageName.innerHTML);
    pages.select(pageName.innerHTML);
}

function deletePage(pageName) {
    pages.remove(pageName);
}

function duplicatePage(pageName) {
    const duplicatedPageName = `${pageName} Copy ${pageDuplicateCount}`;
    // Get the HTML/CSS code from the page component
    const page = pages.get(pageName);
    const component = page.getMainComponent();
    const htmlPage = grapeEditor.getHtml({ component });

    pages.add({
        id: duplicatedPageName,
        name: duplicatedPageName,
        styles: "",
        component: `${htmlPage}`,
    });
    pages.select(pages.get(duplicatedPageName));
}

function editPageName(e) {
    const parent = e.closest('.page-list');
    // Find the h2 inside that parent
    const pageName = parent.querySelector('h2');
    const oldPageName = pageName.innerText;

    pageName.contentEditable = true;
    pageName.focus();
    // Optional: highlight all text
    const sel = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(pageName);
    sel.removeAllRanges();
    sel.addRange(range);

    pageName.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            console.log("completed editing. the name is ", e.target.textContent)
            e.preventDefault();           // Prevent new line
            pageName.contentEditable = false;    // Lock editing
            const newPageName = e.target.textContent;

            // Get the HTML/CSS code from the page component
            const page = pages.get(oldPageName);
            const component = page.getMainComponent();
            const htmlPage = grapeEditor.getHtml({ component });

            pages.remove(oldPageName)
            pages.add({
                id: newPageName,
                name: newPageName,
                styles: "",
                component: htmlPage,
            });
            pages.select(newPageName);
        }
    });

}

var sharePage = "";

function getDeploymentLink(requestBody, requestUrl) {
    const request_details = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody),
    }

    fetch(requestUrl, request_details).then(response => {
        response.json().then(result => {
            if (result.code === "00") {
                const deployment_link = result.data[0]
                localStorage.setItem("deployment_link", deployment_link);
                document.getElementById("template-link").textContent = deployment_link;
            }
        })
    });
}

function shareSinglePage(pageName) {
    sharePage = pageName;
    followingShareModal.classList.remove(HIDDEN);

    const templateInputName = document.getElementById("fileNameInput");
    const templateName = templateInputName.value;

    const request = {
        templateName: templateName,
        templateId,
        userId,
        page: sharePage
    }
    getDeploymentLink(request,`${api_endpoint}/vercel/deployment/single-file`);
}

function shareEntirePage() {
    followingShareModal.classList.remove(HIDDEN);

    const templateInputName = document.getElementById("fileNameInput");
    const templateName = templateInputName.value;

    const request = {
        templateName: templateName,
        templateId,
        userId,
    }
    getDeploymentLink(request,`${api_endpoint}/vercel/deployment/entire-project`);
}

function copyAndShare(deploymentLink) {
    navigator.clipboard.writeText(deploymentLink).then((res) => {
        const shareLinkModal = document.getElementById("shareLinkModal");
        shareLinkModal.style.display = "flex";
        shareLinkModal.style.zIndex = "99999";
    });
}

const shareLinkModal = document.getElementById("shareLinkModal");
const shareLinkConfirmedBtn = document.getElementById("shareLinkConfirmedBtn");

// Close modal
shareLinkConfirmedBtn.addEventListener("click", () => {
    shareLinkModal.style.display = "none";
});

const disableProjectModal = document.getElementById("disabledSaveProjectModal");
const disableProjectConfirmedBtn = document.getElementById("disabledSaveProjectConfirmedBtn");

// Close modal
disableProjectConfirmedBtn.addEventListener("click", () => {
    disableProjectModal.style.display = "none";
});

function shareTemplate(platform) {
    const pageText = encodeURIComponent(document.title);
    const deploymentLink = localStorage.getItem("deployment_link");
    const builderPageUrl = encodeURIComponent(deploymentLink);

    let platform_url = ""

    if (platform === "whatsapp") {
        platform_url = `https://wa.me/?text=${pageText}%20${builderPageUrl}`
    } else if (platform === "twitter") {
        platform_url = `https://twitter.com/intent/tweet?text=${pageText}&url=${builderPageUrl}`
    } else if (platform === "facebook") {
        platform_url = `https://www.facebook.com/sharer/sharer.php?u=${builderPageUrl}`;
    } else if (platform === "telegram") {
        platform_url = `https://t.me/share/url?url=${builderPageUrl}&text=${pageText}`
    } else if (platform === "instagram" || platform === "snapchat") {
        return copyAndShare(deploymentLink);
    }

    window.open(platform_url,
        "_blank",
        "width=600,height=400"
    );
}






