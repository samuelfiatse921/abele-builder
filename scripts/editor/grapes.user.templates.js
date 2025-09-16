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

get_user_templates().then((res) => {
    user_templates = res

    var parentLoadProjectEl = document.querySelector('#load-project-content-1');
    const baseURL = window.location.origin;

    user_templates.forEach((list, index) => {
        parentLoadProjectEl.insertAdjacentHTML(
            'beforeend',
            `<div class="template_item" data-template="${list.id}">
                    <div class="top">
                      <img src="${list.template}" alt="" />
            
                      <div class="template_item--overlay">
                        ${list.id === templateId ? `
                            <button class="Preview" disabled>Current Project</button>
                        ` : `
                            <a class="Preview" href=${baseURL}?templateId=${list.id}&userId=${userId} target="_blank">Select</a>
                        `}
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
})

