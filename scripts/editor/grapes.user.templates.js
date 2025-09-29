const userId = params.get('userId');

function getRequestDetails() {
    return {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    }
}

async function process_request(api_url) {
    const response = await fetch(api_url, getRequestDetails());
    const result = await response.json();

    let templates = []

    if (result.code === "00") {
        templates = result.data;
    }
    return templates;
}


async function get_user_templates() {
    const api_url = `${api_endpoint}/user/template/list?userId=${userId}`;
    return await process_request(api_url);
}

async function get_unpurchased_templates() {
    const api_url = `${api_endpoint}/template/upload/list?userId=${userId}`;
    return await process_request(api_url);
}

let unpurchased_templates = [];
let user_templates = [];

get_unpurchased_templates().then((res) => {
    unpurchased_templates = res
    const marketplaceBaseUrl = `${abele_marketplace}`;

    var parentLoadProjectEl = document.querySelector('#load-project-content-2');

    unpurchased_templates.forEach((list, index) => {
        parentLoadProjectEl.insertAdjacentHTML(
            'beforeend',
            `<div class="template_item" data-template="${list.id}">
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

function get_saved_template(parentLoadProjectEl, list, baseURL) {
    parentLoadProjectEl.insertAdjacentHTML(
        'beforeend',
        `<div class="template_item" data-template="${list.id}" style="border: 1px solid #3F3F46">
                    <div class="top">
                      <img src="${list.template}" alt="" />
            
                      <div class="template_item--overlay">
                        ${list.id === templateId ? `
                            <button class="Preview" disabled>Current Project</button>
                        ` : `
                            <button class="Preview" onclick="loadSelectedTemplate('${list.id}', '${userId}')">Select</button>
                        `}
                      </div>
                    </div>
            
                    <div class="bottom">
                      <div>
                        <h2>${list.templateName}</h2>
                      </div>
                      
                      ${list.id !== templateId ? `
                        <div onclick="prepareProjectToDelete(this, '${list.id}', '${userId}')">
                            <svg style="cursor: pointer" xmlns="http://www.w3.org/2000/svg" fill="#a7a7a7" viewBox="0 0 448 512" width="24" height="24" role="img" aria-label="Delete">
                                <title>Delete</title>
                                <path d="M135.2 17.7C139.4 7.1 149.6 0 160.8 0h126.3c11.2 0 21.4 7.1 25.6 17.7L320 32h80c13.3 0 24 10.7 24 24v16c0 6.6-5.4 12-12 12H36c-6.6 0-12-5.4-12-12V56c0-13.3 10.7-24 24-24h80l15.2-14.3zM53.2 96h341.6l-21.3 354.6A48 48 0 0 1 325.6 496H122.4a48 48 0 0 1-47.9-45.4L53.2 96z"/>
                            </svg>
                        </div>
                      ` : ''}
                  </div>`
    );
}

function loadSelectedTemplate(selectedTemplateId, userId) {
    console.log("loading selected template", selectedTemplateId, userId);
    loadProjectModal.style.display = 'none';

    saveProjectUpdate(userId, templateId).then(result => {
        console.log("saved project for template ", templateId, result );
        if (result.length > 0) {
            console.log("project saved successfully", result);
            console.log("getting user saved project using id", selectedTemplateId);
            get_user_saved_project(selectedTemplateId, true)
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

function prepareProjectToDelete(el, templateId, userId) {
    localStorage.setItem("delete-project-template-id", templateId);
    localStorage.setItem("delete-project-user-id", userId);

    const confirmDeleteProjectModal = document.getElementById('confirmDeleteProjectModal');
    confirmDeleteProjectModal.style.display = 'block';
}

get_user_templates().then((res) => {
    user_templates = res

    var parentLoadProjectEl = document.querySelector('#load-project-content-1');
    parentLoadProjectEl.innerHTML = "";
    const baseURL = window.location.origin;

    user_templates.forEach((list, index) => {
        get_saved_template(parentLoadProjectEl, list, baseURL)
    })
})

function getPayload(method, payload) {
    return {
        method: method,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    }
}

async function send_request(api_url, method, payload) {
    const response = await fetch(api_url, getPayload(method, payload));
    return await response.json();
}

function resetProject() {
    console.log("reset grape project ", templateId, userId);

    const grapejs_api_url = `${api_endpoint}/grape-js`;
    const request = {
        user_id: userId,
        template_id: templateId
    }

    send_request(grapejs_api_url, "DELETE", request).then((res) => {
        if (res.code === "00") {
            showFlashMessage("Project reverted");
            setTimeout(() => {
                location.reload();
            }, 3000);
        } else if (res.code === "01") {
            showFlashMessage(
                "Request failed",
                "Reset is allowed after template is modified",
                "error",
                5000
            );
        } else {
            showFlashMessage(
                "Request failed",
                "Request could not be processed",
                "error",
                5000
            );
        }
    });
}

