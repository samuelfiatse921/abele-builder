const addPageButton = document.getElementById('addPageButton');

addPageButton.addEventListener('click', event => {
    const pageElement = document.createElement('div');

    const pageList = document.createElement('div');
    pageList.className = 'page-list';

    const pageH2Element = document.createElement('h2');
    pageH2Element.contentEditable = true;
    pageH2Element.textContent = 'Enter page name';

    const span = document.createElement('span');
    span.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" role="img" aria-label="Edit page">
            <title>Edit page</title>
            <!-- page -->
            <path d="M4 2h9l6 6v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z"
                  stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/>
            <!-- folded corner -->
            <path d="M13 2v6h6" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/>
            <!-- pencil -->
            <path d="M14.2 8.8l1.9 1.9-7.1 7.1-2.2.6.6-2.2 7.1-7.1z"
                  stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round" fill="none"/>
            <path d="M16.1 6.9c.4-.4 1-.4 1.4 0l.6.6c.4.4.4 1 0 1.4l-1.9-1.9z" fill="currentColor"/>
        </svg>
    `;

    pageList.appendChild(pageH2Element);
    pageList.appendChild(span);
    pageElement.appendChild(pageList);

    pageElement.style.display = "block";
    pageElement.style.width = "100%";
    pageElement.style.borderBottom = "1px solid #282B30";

    // Focus and select the text immediately
    pageH2Element.focus();
    document.getSelection().selectAllChildren(pageH2Element);

    pageH2Element.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            console.log("completed editing. the name is ", e.target.textContent)
            e.preventDefault();           // Prevent new line
            pageH2Element.contentEditable = false;    // Lock editing
            const pageName = e.target.textContent;
            pages.add({
                id: pageName,
                name: pageName,
                styles: "",
                component: `<div>${pageName}</div>`,
            });
            pages.select(pageName);
        }
    });

    // Double-click to edit again
    pageH2Element.addEventListener('dblclick', () => {
        pageH2Element.contentEditable = true;
        pageH2Element.focus();
        // Optional: highlight all text
        const sel = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(pageH2Element);
        sel.removeAllRanges();
        sel.addRange(range);
    });

    templatePages.appendChild(pageElement);
});

function loadPage(e) {
    console.log(e);
    const pageName = e.querySelector('h2');
    console.log(pageName.innerHTML);
    pages.select(pageName.innerHTML);

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
            pages.select("new page name - ", newPageName);
        }
    });

}


