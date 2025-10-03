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

const openProjectFileInput = document.getElementById("openProjectFileInput");

function openProjects(event, el) {
    openProjectFileInput.click(); // trigger file select
    console.log("openProjectFileInput clicked");
}

// Helper to read file as text
function readFileContent(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(e);
        reader.readAsText(file);
    });
}


openProjectFileInput.addEventListener("change", async () => {
    const files = openProjectFileInput.files;
    if (!files.length) return;

    const allowedHtmlCssTypes = ["text/html", "text/css"];

    if (files.length > 3) return;

    let uploadedHTMLList = [];
    let uploadedCSSList = [];

    for (const file of files) {
        // Check MIME type
        const fileType = file.type;

        if (![...allowedHtmlCssTypes].includes(fileType)) {
            alert("Unsupported file type: " + fileType);
            return;
        }

        const text = await readFileContent(file);

        if (fileType === "text/html") {
            uploadedHTMLList.push({"content": text, "name": file.name });
        } else if (fileType === "text/css") {
            uploadedCSSList.push({"content": text, "name": file.name })
        }
    }

    if (uploadedHTMLList.length > 0 || uploadedCSSList.length > 0) {
        saveProjectUpdate(userId, templateId).then(result => {
            console.log("saved project for template ", templateId, result );
            if (result.length > 0) {
                console.log("project saved successfully", result);
                const oldPages = grapeEditor.Pages.getAll();
                oldPages.forEach(page => {
                    grapeEditor.Pages.remove(page);
                });

                let pagesData = []

                let cssStyle = "";

                if (uploadedCSSList.length > 0) {
                    cssStyle = uploadedCSSList[0].content;
                }

                uploadedHTMLList.forEach(file => {
                    pagesData.push({
                        id: file.name.split(".")[0].trim(),
                        name: file.name.split(".")[0].trim(),
                        styles: cssStyle,
                        component: file.content
                    });
                })

                pagesData.forEach(page => {
                    pages.add(page)
                })

                pages.select(pages.get(uploadedHTMLList[0].name.split(".")[0]));

                history.pushState({}, '', `?templateId=${crypto.randomUUID()}&userId=${userId}`);

                disableProjectSave = true;
            } else {
                console.log("project could not be saved", result);
                showFlashMessage(
                    "Request failed",
                    "Project could not be loaded. Failed to save current project",
                    "error",
                    5000
                );
            }
        });


    }

    openProjectFileInput.value = ""; // reset input



});

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

const confirmDeleteProjectModal = document.getElementById('confirmDeleteProjectModal');
const cancelDeleteProjectBtn = document.querySelectorAll('.cancelDeleteProjectModalClose, .cancelDeleteProjectBtn');
const deleteProjectBtn = document.querySelector('.deleteProjectBtn');

// Close when clicking X
cancelDeleteProjectBtn.forEach(el => {
    el.addEventListener('click', () => confirmDeleteProjectModal.style.display = 'none');
});

deleteProjectBtn.addEventListener('click', () => {
    //delete action
    const templateId = localStorage.getItem("delete-project-template-id");
    const userId = localStorage.getItem("delete-project-user-id");

    const request = {
        user_id: userId,
        template_id: templateId
    }

    send_request(`${api_endpoint}/grape-js`, "DELETE", request).then((res) => {
        if (res.code === "00" || res.code === "01") {
            //delete user template
            const request_details = {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            }

            const url = `${api_endpoint}/user/template/${templateId}/from-user/${userId}`;
            fetch(url, request_details).then((res) => {
                res.json().then(result => {
                    var template_deleted = false

                    if (result.code === "00") {
                        get_user_templates().then((res) => {
                            user_templates = res

                            var parentLoadProjectEl = document.querySelector('#load-project-content-1');
                            parentLoadProjectEl.innerHTML = "";
                            const baseURL = window.location.origin;

                            user_templates.forEach((list, index) => {
                                get_saved_template(parentLoadProjectEl, list, baseURL)
                            })
                        }).then(() => {
                            get_unpurchased_templates().then((res) => {
                                unpurchased_templates = res
                                const marketplaceBaseUrl = `${abele_marketplace}`;

                                var parentLoadProjectEl = document.querySelector('#load-project-content-2');

                                unpurchased_templates.forEach((list, index) => {
                                    parentLoadProjectEl.insertAdjacentHTML(
                                        'beforeend',
                                            `<div class="template_item" data-template="${list.id}" style ="border: 1px solid #3F3F46">
                                                    <div class="top">
                                                      <img src="${list.template}" alt="" />
                                            
                                                      <div class="template_item--overlay">
                                                        <a class="Preview" href=${marketplaceBaseUrl}?templateId=${list.id} target="_blank">Preview</a>
                                                      </div>
                                                    </div>
                                            
                                                    <div class="bottom">
                                                      <div>
                                                        <h2>${list.templateName}</h2>
                                                      </div>
                                            
                                                    </div>
                                                  </div>`
                                    );
                                })
                            });
                        })
                        template_deleted = true
                    }
                    console.log("template deleted ? ", template_deleted)
                })
            });
        } else {
            showFlashMessage(
                "Request failed",
                "Request could not be processed",
                "error",
                5000
            );
        }
    });

    confirmDeleteProjectModal.style.display = 'none';
});





