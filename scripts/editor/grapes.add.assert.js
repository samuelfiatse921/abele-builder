const assetsGrid = document.getElementById('asset-manager');

// /templateSearchName
let debounceTimeout;
const searchAsset = document.querySelector("#search-asset");
searchAsset.addEventListener("input", function(e) {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
        assetsGrid.innerHTML = '';
        const searchTerm = e.target.value;
        get_user_assets(searchTerm).then((res) => {
            populateFetchedAssets(res)
        })
    }, 500); // wait 500ms after user stops typing
})

// Add image to canvas
function addImageToCanvas(asset) {
    const selected = grapeEditor.getSelected();

    const image_url = api_endpoint.replace("/api/v1", "");

    const src = image_url + asset.filePath

    if (selected) {
        // Add to selected component
        selected.append(`<img src="${src}" alt="${asset.fileName}" style="max-width: 100%; height: auto;">`);
    }
}

function addVideoToCanvas(asset) {
    const selected = grapeEditor.getSelected();

    const image_url = api_endpoint.replace("/api/v1", "");

    const src = image_url + asset.filePath

    const videoConfig = {
        type: "video",
        attributes: {
            src: src,
            loop: true, // Enable looping
            autoplay: true, // Autoplay to match looping behavior
            style: "max-width: 100%; height: auto; margin: 10px 0;",
        },
    };

    if (selected) {
        // Add to selected component
        selected.append(videoConfig);
    }
}

async function get_user_assets(asset_name = "") {
    const request_details = {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }

    const api_url = `${api_endpoint}/asset/list?page=1&size=20&user_id=${user_id}&asset_name=${asset_name}`;
    const response = await fetch(api_url, request_details);
    const result =  await response.json();

    let user_assets = []

    console.log("user assets result", result);

    if (result.code === "00") {
        user_assets = result.data;
    }

    return user_assets;
}



function getFileTypeFromName(fileName) {
    if (!fileName) return "unknown";

    const ext = fileName.split(".").pop().toLowerCase();

    const imageExts = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
    const videoExts = ["mp4", "mov", "avi", "mkv", "webm", "flv"];

    if (imageExts.includes(ext)) {
        return "image";
    } else if (videoExts.includes(ext)) {
        return "video";
    } else {
        return "other";
    }
}

async function deleteUserAsset(el, asset_id) {
    const request_payload = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    }

    const url = `${api_endpoint}/asset/${asset_id}/from-user/${user_id}`;
    fetch(url, request_payload).then((res) => {
        res.json().then((resp) => {
            var asset_deleted = false

            if (resp.code === "00") {
                userAssets = resp.data;
                asset_deleted = true;
            }
            console.log(`user asset deleted ? ${asset_deleted}`);

            assetsGrid.innerHTML = '';

            get_user_assets().then((res) => {
                populateFetchedAssets(res)
            })
        });
    });
}

function populateFetchedAssets(res) {
    if (res.length > 0) {
        res.forEach(asset => {
            const fileName = asset.fileName;
            const filePath = asset.filePath;
            const fileType = getFileTypeFromName(fileName);

            const assetElement = document.createElement('div');
            assetElement.className = 'asset-item';
            assetElement.draggable = true;
            assetElement.style.cursor = 'pointer';

            let dataTransfer = null;

            const image_url = api_endpoint.replace("/api/v1", "");

            const src = image_url + filePath

            if (fileType === 'image') {
                assetElement.innerHTML = `
                        <div class="template_item" style="width: 170px; height: 120px; border: 1px solid #3F3F46"  data-template="${asset.id}">
                            <div class="top">
                              <img src="${src}" width="200" height="150" alt="${fileName}" />
                    
                              <div class="template_item--overlay">
                                <button class="Preview" >Select</button>
                              </div>
                            </div>
                    
                            <div class="bottom">
                              <div>
                                <h2>${fileName.slice(0, 10)}...</h2>
                              </div>
                                <div onclick="deleteUserAsset(this, '${asset.id}')">
                                    <svg style="cursor: pointer" xmlns="http://www.w3.org/2000/svg" fill="#a7a7a7" viewBox="0 0 448 512" width="15" height="15" role="img" aria-label="Delete">
                                        <title>Delete</title>
                                        <path d="M135.2 17.7C139.4 7.1 149.6 0 160.8 0h126.3c11.2 0 21.4 7.1 25.6 17.7L320 32h80c13.3 0 24 10.7 24 24v16c0 6.6-5.4 12-12 12H36c-6.6 0-12-5.4-12-12V56c0-13.3 10.7-24 24-24h80l15.2-14.3zM53.2 96h341.6l-21.3 354.6A48 48 0 0 1 325.6 496H122.4a48 48 0 0 1-47.9-45.4L53.2 96z"/>
                                    </svg>
                                </div>
                            </div>
                          </div>`

                dataTransfer = {
                    type: fileType,
                    src: src,
                    alt: filePath,
                }
            } else {
                assetElement.innerHTML = `
                        <div class="template_item" style="width: 170px; height: 120px; border: 1px solid #3F3F46" data-template="${asset.id}">
                        <div class="top">
                            <video style="" >
                                <source src="${src}" type="video/mp4"/>
                                Your browser does not support the video tag.
                            </video>

                            <div class="template_item--overlay">
                                <a class="Preview">Select</a>
                            </div>
                        </div>

                        <div class="bottom">
                            <div>
                                <h2>${fileName.slice(0, 10)}...</h2>
                            </div>
                            <div onclick="deleteUserAsset(this, '${asset.id}')">
                            <svg style="cursor: pointer" xmlns="http://www.w3.org/2000/svg" fill="#a7a7a7" viewBox="0 0 448 512" width="15" height="15" role="img" aria-label="Delete">
                                <title>Delete</title>
                                <path d="M135.2 17.7C139.4 7.1 149.6 0 160.8 0h126.3c11.2 0 21.4 7.1 25.6 17.7L320 32h80c13.3 0 24 10.7 24 24v16c0 6.6-5.4 12-12 12H36c-6.6 0-12-5.4-12-12V56c0-13.3 10.7-24 24-24h80l15.2-14.3zM53.2 96h341.6l-21.3 354.6A48 48 0 0 1 325.6 496H122.4a48 48 0 0 1-47.9-45.4L53.2 96z"/>
                            </svg>
                        </div>
                        </div>
                    </div>
                    `;
                dataTransfer = {
                    type: fileType,
                    src: src,
                    alt: filePath,
                }
            }

            // Add drag and drop functionality
            assetElement.addEventListener('dragstart', function (e) {
                this.classList.add('dragging');
                if (fileType === 'image') {
                    e.dataTransfer.setData('text/plain', JSON.stringify(dataTransfer));
                } else {
                    const selectedComponent = grapeEditor.getSelected();

                    const videoConfig = {
                        type: "video",
                        attributes: {
                            src: src,
                            loop: true, // Enable looping
                            autoplay: true, // Autoplay to match looping behavior
                            style: "max-width: 100%; height: auto; margin: 10px 0;",
                        },
                    };

                    let newVideoComponent;

                    if (selectedComponent && selectedComponent.components) {
                        // Append inside if valid container (like div, section, etc.)
                        newVideoComponent = selectedComponent.append(videoConfig);
                    } else {
                        // Else add to canvas root
                        newVideoComponent = grapeEditor.getComponents().add(videoConfig);
                    }

                    grapeEditor.select(newVideoComponent);
                }
            });

            assetElement.addEventListener('dragend', function() {
                this.classList.remove('dragging');
            });

            // Add click to add functionality
            assetElement.addEventListener('click', function() {
                if (fileType === 'image') {
                    addImageToCanvas(asset);
                } else {
                    addVideoToCanvas(asset);
                }
            });

            assetsGrid.appendChild(assetElement);
        });
    } else {
        assetsGrid.innerHTML = "No assets found"
        assetsGrid.style.fontSize = "0.9rem";
    }
}

// Populate assets grid
function populateAssets() {
    assetsGrid.innerHTML = '';

    get_user_assets().then((res) => {
        populateFetchedAssets(res)
    })
}

// Initialize assets
populateAssets();

const canvasInit = grapeEditor.Canvas.getElement();

// canvasInit.addEventListener('dragover', function(e) {
//   e.preventDefault();
// });

canvasInit.addEventListener('drop', function(e) {
    e.preventDefault();

    try {
        const data = JSON.parse(e.dataTransfer.getData('text/plain'));
        if (data.type === 'image') {
            const rect = canvasInit.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            grapeEditor.addComponents(`
                        <img src="${data.src}" alt="${data.alt}" 
                             style="position: absolute; left: ${x}px; top: ${y}px; max-width: 200px; height: auto;">
                    `);
        }
    } catch (error) {
        console.error('Error handling drop:', error);
    }
});

const am = grapeEditor.AssetManager;
const fileInput = document.getElementById("customAssetFileInput");

document.getElementById("uploadAssetBtn").addEventListener("click", () => {
    fileInput.click(); // trigger file select
});

async function readFileAsDataURL (file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);

        reader.readAsDataURL(file);
    });
}

fileInput.addEventListener("change", async () => {
    const files = fileInput.files;
    if (!files.length) return;

    const allowedImageTypes = ["image/jpg", "image/jpeg", "image/png", "image/gif", "image/webp"];
    const allowedVideoTypes = ["video/mp4", "video/webm", "video/avi", "video/mpeg", "video/quicktime"];

    if (files.length > 1) return;

    for (const file of files) {
        // Check MIME type
        if (![...allowedImageTypes, ...allowedVideoTypes].includes(file.type)) {
            alert("Unsupported file type: " + file.type);
            return;
        }

        // Detect category
        const fileType = file.type.startsWith("image/") ? "image" : "video";
        console.log("File selected:", file.name, "Type:", fileType);

        // Send to FastAPI
        const formData = new FormData();
        formData.append("file", file);

        try {
            const api_url = `${api_endpoint}/asset/upload/${user_id}`
            const res = await fetch(api_url, {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            console.log("API response:", data);
        } catch (err) {
            console.error("Upload failed:", err);
        }

        populateAssets();
        fileInput.value = ""; // reset input
    }
});

