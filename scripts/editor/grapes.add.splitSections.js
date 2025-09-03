/**
 * Add Triple Section Functionality for GrapesJS with Click and Drag-and-Drop Support
 * Adds a section with columns via click or drag-and-drop of #addSplitSectionTool
 * Ensures dropped component is replaced with a section (type: default, tagName: section)
 * Wrapped in IIFE to prevent global namespace conflicts
 */
(function () {
    // Guard clause to prevent re-execution
    if (window.addSplitSectionFunctionalityLoaded) {
        console.log(
            "Add Split Section functionality already loaded, skipping initialization."
        );
        return;
    }
    window.addSplitSectionFunctionalityLoaded = true;

    // ==========================================================================
    // Initial Setup and Validation
    // ==========================================================================

    if (typeof grapeEditor === "undefined") {
        console.error(
            "grapeEditor is not defined. Please ensure the GrapesJS editor is initialized."
        );
        throw new Error("grapeEditor is not defined");
    }

    // ==========================================================================
    // Component Configurations
    // ==========================================================================

    const componentConfigs = {
        section: {
            type: "default",
            tagName: "section",
            attributes: { class: "triple-sections" },
            style: {
                display: "flex",
                "flex-direction": "row",
                gap: "20px",
                "flex-wrap": "wrap",
                "box-sizing": "border-box",
            },
            css: {
                "@media (max-width: 768px)": {
                    "flex-direction": "column",
                    gap: "10px",
                },
            },
            components: [
                {
                    type: "default",
                    tagName: "div",
                    attributes: { class: "column" },
                    components: [
                        {
                            type: "text",
                            tagName: "h2",
                            content: "Column Title",
                            editable: true,
                            attributes: { class: "gjs-text" },
                        },
                        {
                            type: "text",
                            tagName: "p",
                            content: "Column content here",
                            editable: true,
                            attributes: { class: "gjs-text" },
                        },
                    ],
                    style: {
                        flex: "1",
                        padding: "10px",
                        "border-radius": "4px",
                        position: "relative",
                        "min-width": "200px",
                        "box-sizing": "border-box",
                    },
                    css: {
                        "@media (max-width: 768px)": {
                            width: "100%",
                            "min-width": "auto",
                        },
                    },
                },
                {
                    type: "default",
                    tagName: "div",
                    attributes: { class: "column" },
                    components: [
                        {
                            type: "text",
                            tagName: "h2",
                            content: "Column Title",
                            editable: true,
                            attributes: { class: "gjs-text" },
                        },
                        {
                            type: "text",
                            tagName: "p",
                            content: "Column content here",
                            editable: true,
                            attributes: { class: "gjs-text" },
                        },
                    ],
                    style: {
                        flex: "2",
                        padding: "10px",
                        "border-radius": "4px",
                        position: "relative",
                        "min-width": "400px",
                        "box-sizing": "border-box",
                    },
                    css: {
                        "@media (max-width: 768px)": {
                            width: "200%",
                            "min-width": "auto",
                        },
                    },
                },
            ],
        },
    };


    // Define component type in GrapesJS
    Object.entries(componentConfigs).forEach(([type, config]) => {
        grapeEditor.Components.addType(type, {
            model: {
                defaults: {
                    tagName: config.tagName,
                    content: config.content || "",
                    style: config.style || {},
                    attributes: config.attributes || {},
                    components: config.components || [],
                    css: config.css || {},
                },
            },
        });
    });

    // ==========================================================================
    // Create Draggable Blocks
    // ==========================================================================

    const blocks = [
        {
            id: "split-sections-block",
            label: "Split Sections",
            type: "section",
            category: "Layout",
        },
    ];

    blocks.forEach((block) => {
        grapeEditor.Blocks.add(block.id, {
            label: block.label,
            content: { type: block.type },
            category: block.category,
            attributes: { class: `gjs-block-${block.type}` },
            select: true,
        });
    });

    // ==========================================================================
    // DOM Elements
    // ==========================================================================

    const addSplitSectionTool = document.getElementById(
        "addSplitSectionTool"
    );

    // ==========================================================================
    // State for Drag-and-Drop
    // ==========================================================================

    let isOverCanvas = false;

    // ==========================================================================
    // Shared Component-Adding Logic
    // ==========================================================================

    const addComponentToEditor = (type, targetComponent = null) => {
        const config = componentConfigs[type];
        if (!config) {
            console.error(`No configuration found for component type: ${type}`);
            return;
        }

        let newComponent;
        const selectedComponent = grapeEditor.getSelected();

        if (targetComponent && typeof targetComponent.append === "function") {
            newComponent = targetComponent.append(config)[0];
        } else if (
            selectedComponent &&
            typeof selectedComponent.append === "function"
        ) {
            newComponent = selectedComponent.append(config)[0];
        } else {
            newComponent = grapeEditor.getComponents().add(config);
        }

        if (newComponent) {
            grapeEditor.select(newComponent);
        } else {
            console.error(`Failed to add ${type} component`);
        }
    };

    // ==========================================================================
    // Add Section via Click and Drag-and-Drop
    // ==========================================================================

    if (addSplitSectionTool) {
        // Click event
        addSplitSectionTool.addEventListener("click", () => {
            console.log("Click event triggered on #addSplitSectionTool");
            addComponentToEditor("section");
        });

        // Drag-and-drop events
        addSplitSectionTool.setAttribute("draggable", true);
        addSplitSectionTool.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text/plain", "addSplitSectionTool");
            console.log("Dragging section tool with ID: addSplitSectionTool");
        });

        addSplitSectionTool.addEventListener("dragend", () => {
            console.log("Drag ended for section tool, over canvas:", isOverCanvas);
            isOverCanvas = false;
        });
    } else {
        console.error(
            "Add split section tool element not found. Please check the selector '#addSplitSectionTool'."
        );
    }

    // ==========================================================================
    // Track Drag-and-Drop State Using GrapesJS Events
    // ==========================================================================

    grapeEditor.on("canvas:dragover", () => {
        isOverCanvas = true;
    });

    grapeEditor.on("canvas:dragleave", () => {
        isOverCanvas = false;
        console.log("Left canvas");
    });

    // Handle component addition to replace dropped text with section
    grapeEditor.on("component:add", (component) => {
        const content = component.get("content") || "";
        if (content === "addSplitSectionTool") {
            console.log(
                "Replacing dropped text 'addSplitSectionTool' with section component"
            );
            const parent = component.parent();
            if (parent && typeof parent.append === "function") {
                const newComponent = parent.replaceWith(componentConfigs.section)[0];
                component.remove();
                if (newComponent) {
                    setTimeout(() => {
                        newComponent.set("editable", false);
                        newComponent.set("type", componentConfigs.section.type);
                        grapeEditor.select(newComponent);
                    }, 100); // Delay selection to ensure the component is fully added
                } else {
                    console.error("Failed to append section component");
                }
            } else {
                console.error("Parent component is invalid or lacks append method");
            }
        }
    });

    console.log("Split Section components loaded successfully!");
})();
