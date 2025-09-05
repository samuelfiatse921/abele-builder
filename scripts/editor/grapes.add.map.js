/**
 * Add Button Functionality for GrapesJS with Click and Drag-and-Drop Support
 * Adds a button component via click on #addButtonButton or drag-and-drop of #addMapStyleButton
 * Uses component:add to replace the dropped "addMapStyleButton" text with a button
 * Automatically shows the button editor UI when a button component is selected or updated
 * Hides the button editor UI when a component is deselected
 * Wrapped in IIFE to prevent global namespace conflicts
 */
(function () {
    // Guard clause to prevent re-execution
    if (window.addMapFunctionalityLoaded) {
        console.log(
            "Add Map functionality already loaded, skipping initialization."
        );
        return;
    }
    window.addMapFunctionalityLoaded = true;
    // ==========================================================================
    // Initial Setup and Validation
    // ==========================================================================

    // Ensure grapeEditor is defined
    if (typeof grapeEditor === "undefined") {
        console.error(
            "grapeEditor is not defined. Please ensure the GrapesJS editor is initialized before loading this script."
        );
        throw new Error("grapeEditor is not defined");
    }

    // ==========================================================================
    // DOM Elements
    // ==========================================================================

    const addMapButton = document.getElementById("addMapButton");
    const deleteSelectedButton = document.getElementById("deleteSelectedMap");

    console.log("add map button", addMapButton);

    // State to track if the element is over the canvas
    let isOverCanvas = false;

    // ==========================================================================
    // Shared Button-Adding Logic
    // ==========================================================================

    const get_map_coordinates = () => {
        const map_cordi = document.getElementById("mapLatLongText").value;

        let coordinates = map_cordi.split(",");

        let lat = 5.6037;
        let lng = -0.1870;

        if (coordinates.length > 1) {
            lat = coordinates[0];
            lng = coordinates[1];
        }

        return {
            "data-lat": lat,
            "data-lng": lng
        };
    }

    const button = {
        isComponent: el => el.classList && el.classList.contains("leaflet-map"),
        model: {
            defaults: {
                tagName: "div",
                classes: ["leaflet-map"],
                style: { height: "300px", width: "100%" },
                droppable: false,
                editable: false,
                script: function () {
                    const lat = parseFloat(this.getAttribute("data-lat"));
                    const lng = parseFloat(this.getAttribute("data-lng"));

                    const init = () => {
                        const map = L.map(this).setView([lat, lng], 12);
                        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                            attribution: "© OpenStreetMap contributors"
                        }).addTo(map);

                        setTimeout(() => map.invalidateSize(), 200);
                    };

                    if (typeof L !== "undefined") {
                        init();
                    } else {
                        // inject Leaflet CSS/JS inside the iframe
                        const script = document.createElement("script");
                        script.src = "https://unpkg.com/leaflet/dist/leaflet.js";
                        script.onload = init;
                        document.body.appendChild(script);

                        const link = document.createElement("link");
                        link.rel = "stylesheet";
                        link.href = "https://unpkg.com/leaflet/dist/leaflet.css";
                        document.head.appendChild(link);
                    }
                }
            }
        }
    };

    grapeEditor.DomComponents.addType("leaflet-map",button)

    // // ==========================================================================
    // // Add Button via Click (#addButtonButton)
    // // ==========================================================================

    if (addMapButton) {
        addMapButton.setAttribute("draggable", true);

        addMapButton.addEventListener("dragstart", (e) => {
            console.log("Dragging map tool with ID: addMapButton");
            // Instead of passing just the ID, pass the actual component definition
            const dataLat = get_map_coordinates()["data-lat"];
            const dataLng = get_map_coordinates()["data-lng"];

            const mapComponent = {
                type: 'leaflet-map',
                attributes: {
                    'data-lat': dataLat,  // Default coordinates - update as needed
                    'data-lng': dataLng
                }
            };

            // Set both formats for compatibility
            e.dataTransfer.setData('text/plain', JSON.stringify(mapComponent));
            e.dataTransfer.setData('text/html', `<div class="leaflet-map" data-lat=${dataLat} data-lng=${dataLng}></div>`);
        });

        addMapButton.addEventListener("dragend", (e) => {
            isOverCanvas = false;
        });
    }

    //
    // // ==========================================================================
    // // Delete Button Functionality
    // // ==========================================================================
    //
    if (deleteSelectedButton) {
        deleteSelectedButton.addEventListener("click", () => {
            const selectedComponent = grapeEditor.getSelected();

            if (!selectedComponent) {
                showFlashMessage(
                    "Please select a component to delete.",
                    "Invalid component success",
                    "error",
                    5000
                );
                return;
            }

            // Validate that the selected component is a button
            if (selectedComponent.get("type") !== "button") {
                showFlashMessage(
                    "Please select a button component to delete.",
                    "Invalid component success",
                    "error",
                    5000
                );
                return;
            }

            selectedComponent.remove();
            console.log("Selected button component deleted:", selectedComponent);
        });
    } else {
        console.error(
            "Delete button element not found. Please check the selector '#deleteSelectedButton'."
        );
    }
    //
    // // ==========================================================================
    // // Track Drag-and-Drop State Using GrapesJS Events
    // // ==========================================================================
    //
    // // Track drag over the canvas
    grapeEditor.on("canvas:dragover", (e) => {
        isOverCanvas = true;
    });

    // Track when dragging leaves the canvas
    grapeEditor.on("canvas:dragleave", (e) => {
        isOverCanvas = false;
        console.log("Left canvas");
    });
})();