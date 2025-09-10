const assetsBtn = document.getElementById('assetsmanager');
const assetsGrid = document.getElementById('asset-manager');

// Add image to canvas
function addImageToCanvas(asset) {
    const selected = grapeEditor.getSelected();

    if (selected) {
        // Add to selected component
        selected.append(`<img src="${asset.src}" alt="${asset.name}" style="max-width: 100%; height: auto;">`);
    } else {
        // Add to canvas
        grapeEditor.addComponents(`<img src="${asset.src}" alt="${asset.name}" style="max-width: 300px; height: auto; margin: 20px;">`);
    }
}

// Populate assets grid
function populateAssets() {
    assetsGrid.innerHTML = '';

    sampleAssets.forEach(asset => {
        const assetElement = document.createElement('div');
        assetElement.className = 'asset-item';
        assetElement.draggable = true;
        assetElement.innerHTML = `
                    <img src="${asset.src}" alt="${asset.name}">
                    <span>${asset.name}</span>
                `;

        // Add drag and drop functionality
        assetElement.addEventListener('dragstart', function(e) {
            this.classList.add('dragging');
            e.dataTransfer.setData('text/plain', JSON.stringify({
                type: 'image',
                src: asset.src,
                alt: asset.name
            }));
        });

        assetElement.addEventListener('dragend', function() {
            this.classList.remove('dragging');
        });

        // Add click to add functionality
        assetElement.addEventListener('click', function() {
            addImageToCanvas(asset);
        });

        assetsGrid.appendChild(assetElement);
    });
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