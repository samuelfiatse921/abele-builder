const HIDDEN = "editor--hidden";

const rootPath = window.location.origin; // Gets http://localhost:3000 or your domain
const cssPath = `${rootPath}/css/grapesEditing/grapeEditing.css`;

// 1) Define a small plugin that will override toolbar defaults
const customToolbarPlugin = (editor) => {
  // Get the RichTextEditor module
  const rte = editor.RichTextEditor;

  const icons = {
    clone: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="1.5" d="M6 15h-.6C4.07 15 3 13.93 3 12.6V5.4C3 4.07 4.07 3 5.4 3h7.2C13.93 3 15 4.07 15 5.4V6m-3.6 3h7.2a2.4 2.4 0 0 1 2.4 2.4v7.2a2.4 2.4 0 0 1-2.4 2.4h-7.2A2.4 2.4 0 0 1 9 18.6v-7.2A2.4 2.4 0 0 1 11.4 9"/></svg>`,
    delete: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 28 28"><path fill="#ffffff" d="M11.5 6h5a2.5 2.5 0 0 0-5 0M10 6a4 4 0 0 1 8 0h6.25a.75.75 0 0 1 0 1.5h-1.31l-1.217 14.603A4.25 4.25 0 0 1 17.488 26h-6.976a4.25 4.25 0 0 1-4.235-3.897L5.06 7.5H3.75a.75.75 0 0 1 0-1.5zM7.772 21.978a2.75 2.75 0 0 0 2.74 2.522h6.976a2.75 2.75 0 0 0 2.74-2.522L21.436 7.5H6.565zM11.75 11a.75.75 0 0 1 .75.75v8.5a.75.75 0 0 1-1.5 0v-8.5a.75.75 0 0 1 .75-.75m5.25.75a.75.75 0 0 0-1.5 0v8.5a.75.75 0 0 0 1.5 0z"/></svg>`,
    colorPicker: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g clip-path="url(#clip0_1661_1790)">
<rect y="-2" width="20" height="24" fill="url(#pattern0_1661_1790)"/>
<g filter="url(#filter0_i_1661_1790)">
<rect width="20" height="20" rx="10" fill="#0D0D0D" fill-opacity="0.01"/>
</g>
</g>
<defs>
<pattern id="pattern0_1661_1790" patternContentUnits="objectBoundingBox" width="1.2" height="1">
<use xlink:href="#image0_1661_1790" transform="scale(0.02 0.0166667)"/>
</pattern>
<filter id="filter0_i_1661_1790" x="0" y="0" width="20" height="20" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feMorphology radius="1" operator="erode" in="SourceAlpha" result="effect1_innerShadow_1661_1790"/>
<feOffset/>
<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.223529 0 0 0 0 0.298039 0 0 0 0 0.376471 0 0 0 0.15 0"/>
<feBlend mode="normal" in2="shape" result="effect1_innerShadow_1661_1790"/>
</filter>
<clipPath id="clip0_1661_1790">
<rect width="20" height="20" rx="10" fill="white"/>
</clipPath>
<image id="image0_1661_1790" width="60" height="60" preserveAspectRatio="none" xlink:href="data:image/png;base64,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"/>
</defs>
</svg>`,
    up: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="#ffffff" stroke-width="2" d="m18 15l-6-6l-6 6"/></svg>`,
    down: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="#ffffff" stroke-width="2" d="m18 9l-6 6l-6-6"/></svg>`,
    drag: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="#ffffff" d="M12 23.414L7.586 19L9 17.586l2 2V13H4.414l2 2L5 16.414L.586 12L5 7.586L6.414 9l-2 2H11V4.414l-2 2L7.586 5L12 .586L16.414 5L15 6.414l-2-2V11h6.586l-2-2L19 7.586L23.414 12L19 16.414L17.586 15l2-2H13v6.586l2-2L16.414 19z"/></svg>`,
    bold: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h7a4 4 0 0 1 0 8H6zm0 8h8a4 4 0 0 1 0 8H6z"/></svg>`,
    italic: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M10 4h8v2h-3.5l-4 12H14v2H6v-2h3.5l4-12H10z"/></svg>`,
    underline: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4v7a6 6 0 0 0 12 0V4h-2v7a4 4 0 0 1-8 0V4z"/><path d="M5 20v-2h14v2z"/></svg>`,
    strikethrough: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M5 11h14v2H5z"/><path d="M6 5h12v2H6zm0 8h12v2H6zm0 8h12v2H6z"/></svg>`,
    link: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M3.9,12a5.1,5.1 0 0 1 5.1-5.1h2v1.5h-2A3.6,3.6 0 0 0 5.4,12a3.6,3.6 0 0 0 3.6,3.6h2v1.5h-2A5.1,5.1 0 0 1 3.9,12ZM8.4,11.25h7.2v1.5H8.4v-1.5Zm6-4.65h2A5.1,5.1 0 0 1 21.6,12a5.1,5.1 0 0 1-5.1,5.1h-2v-1.5h2a3.6,3.6 0 0 0 3.6-3.6,3.6,3.6 0 0 0-3.6-3.6h-2v-1.5Z"/></svg>`,
    ul: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="4" cy="6" r="2"/><rect x="8" y="5" width="12" height="2"/><circle cx="4" cy="12" r="2"/><rect x="8" y="11" width="12" height="2"/><circle cx="4" cy="18" r="2"/><rect x="8" y="17" width="12" height="2"/></svg>`,
    ol: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><text x="2" y="8" font-size="6">1.</text><rect x="8" y="5" width="12" height="2"/><text x="2" y="14" font-size="6">2.</text><rect x="8" y="11" width="12" height="2"/><text x="2" y="20" font-size="6">3.</text><rect x="8" y="17" width="12" height="2"/></svg>`,
    toggleCase: `<svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor"><text x="2" y="15" font-size="10" font-weight="bold">A</text><text x="8" y="15" font-size="10">a</text></svg>`,
    sizeSelect: `
          <div
                      class="dropdown"
                      id="fontSizeDropDown"
                      style="width: 50px"
                    >
                      <div class="dropdown-select">
                        <span class="selected" id="fontSizeSelect">12</span>
                        <i class="dropdown-arrow"></i>
                      </div>
                      <div class="dropdown-menu">
                        <button class="dropdown-item" id="fontSize12">
                          12
                        </button>
                        <button class="dropdown-item" id="fontSize13">
                          13
                        </button>
                        <button class="dropdown-item" id="fontSize14">
                          14
                        </button>
                        <button class="dropdown-item" id="fontSize15">
                          15
                        </button>
                        <button class="dropdown-item" id="fontSize16">
                          16
                        </button>
                        <button class="dropdown-item" id="fontSize17">
                          17
                        </button>
                        <button class="dropdown-item" id="fontSize18">
                          18
                        </button>
                        <button class="dropdown-item" id="fontSize19">
                          19
                        </button>
                      </div>
                    </div>`,
    ellipsis: `
        <span id="toggleMenuBtn">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" role="img" aria-label="More">
              <title>More</title>
              <circle cx="12" cy="5.5" r="1.75" fill="currentColor"/>
              <circle cx="12" cy="12"  r="1.75" fill="currentColor"/>
              <circle cx="12" cy="18.5" r="1.75" fill="currentColor"/>
          </svg>
        </span>
        <div id="gjs-toolbar-menu" class="gjs-toolbar-menu-content">
           <a onclick="selectItemParent()" style="display: flex; gap: 4px"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="#ffffff" stroke-width="2" d="m18 15l-6-6l-6 6"/></svg>Select Parent</a>
           <a onclick="duplicateItem()" style="display: flex; gap: 4px"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="none" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="1.5" d="M6 15h-.6C4.07 15 3 13.93 3 12.6V5.4C3 4.07 4.07 3 5.4 3h7.2C13.93 3 15 4.07 15 5.4V6m-3.6 3h7.2a2.4 2.4 0 0 1 2.4 2.4v7.2a2.4 2.4 0 0 1-2.4 2.4h-7.2A2.4 2.4 0 0 1 9 18.6v-7.2A2.4 2.4 0 0 1 11.4 9"/></svg>Duplicate</a>
<!--           <a onclick="createToolbarSymbol()">Create Symbol</a>-->
           <a onclick="deleteItem()" style="display: flex; gap: 4px"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 28 28"><path fill="none" stroke="none" d="M11.5 6h5a2.5 2.5 0 0 0-5 0M10 6a4 4 0 0 1 8 0h6.25a.75.75 0 0 1 0 1.5h-1.31l-1.217 14.603A4.25 4.25 0 0 1 17.488 26h-6.976a4.25 4.25 0 0 1-4.235-3.897L5.06 7.5H3.75a.75.75 0 0 1 0-1.5zM7.772 21.978a2.75 2.75 0 0 0 2.74 2.522h6.976a2.75 2.75 0 0 0 2.74-2.522L21.436 7.5H6.565zM11.75 11a.75.75 0 0 1 .75.75v8.5a.75.75 0 0 1-1.5 0v-8.5a.75.75 0 0 1 .75-.75m5.25.75a.75.75 0 0 0-1.5 0v8.5a.75.75 0 0 0 1.5 0z"/></svg>Delete</a>
        </div>
    `,

    colorInput: `<div>
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g clip-path="url(#clip0_1661_1790)">
<rect y="-2" width="20" height="24" fill="url(#pattern0_1661_1790)"/>
<g filter="url(#filter0_i_1661_1790)">
<rect width="20" height="20" rx="10" fill="#0D0D0D" fill-opacity="0.01"/>
</g>
</g>
<defs>
<pattern id="pattern0_1661_1790" patternContentUnits="objectBoundingBox" width="1.2" height="1">
<use xlink:href="#image0_1661_1790" transform="scale(0.02 0.0166667)"/>
</pattern>
<filter id="filter0_i_1661_1790" x="0" y="0" width="20" height="20" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feMorphology radius="1" operator="erode" in="SourceAlpha" result="effect1_innerShadow_1661_1790"/>
<feOffset/>
<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.223529 0 0 0 0 0.298039 0 0 0 0 0.376471 0 0 0 0.15 0"/>
<feBlend mode="normal" in2="shape" result="effect1_innerShadow_1661_1790"/>
</filter>
<clipPath id="clip0_1661_1790">
<rect width="20" height="20" rx="10" fill="white"/>
</clipPath>
<image id="image0_1661_1790" width="60" height="60" preserveAspectRatio="none" xlink:href="data:image/png;base64,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"/>
</defs>
</svg>
    <input type="text" style="position: absolute;right:0;top:0;width:3rem;height:3rem;cursor:pointer;opacity:0;" class="gjs-field" id="textColor" title="Text Color" data-coloris /></div>`,
  };

  let isDragging = false;

  // Set dragging state on drag events
  editor.on("canvas:dragover", () => {
    isDragging = true;
  });

  editor.on("canvas:dragend", () => {
    isDragging = false;
  });

  editor.on("component:selected", () => {
    // Only run if not dragging
    if (!isDragging) {
      const selected = editor.getSelected();
      // if (!selected) return;

      // Find the RTE toolbar (class 'gjs-rte-toolbar')
      const rteToolbar = document.querySelector(".gjs-rte-toolbar");
      // if (!rteToolbar) return;

      // Get the selected component's bounding box
      const el = selected.getEl();
      const rect = el.getBoundingClientRect();

      // Define minimum size threshold for "too small" (adjust as needed)
      const minWidth = 160; // Pixels

      // Check if component is too small
      const isTooSmall = rect.width < minWidth;

      let toolbar = document.querySelector(".gjs-toolbar");

      // Reset toolbar position
      toolbar.style.position = "absolute";
      // toolbar.style.zIndex = "1000"; // Ensure it’s above other elements

      if (isTooSmall) {
        // Align to the left/top edge of the canvas
        toolbar.classList.add("toolbar-left"); // where .toolbar-left { left: 0px !important; }
        rteToolbar.classList.add("toolbar-left");
      } else {
        toolbar.classList.remove("toolbar-left");
        rteToolbar.classList.remove("toolbar-left");
      }
    }
  });

  // Clear toolbar position when component is deselected
  editor.on("component:deselected", () => {
    const rteToolbar = document.querySelector(".gjs-rte-toolbar");
    if (rteToolbar) {
      rteToolbar.style.left = "";
      rteToolbar.style.top = "";
    }
  });

  editor.on("rte:enable", (componentView) => {
    const type = componentView.model.get("type");
    if (type !== "text" && type !== "textnode") return;

    // 1) Remove unwanted built‐ins
    [
      "wrap",
      "link",
      "unorderedList",
      "orderedList",
      "toggleCase",
      "fontSize",
      "fontWeight",
      "textColor",
    ].forEach((name) => {
      if (rte.get(name)) rte.remove(name);
    });

    // 2) Re-add/link in our custom actions:
    rte.add("link", {
      icon: icons.link,
      attributes: { title: "Insert Link" },
      result: (rte) => {
        const url = prompt("Enter URL", "https://");
        url && rte.exec("createLink", url);
      },
    });

    rte.add("unorderedList", {
      icon: icons.ul,
      attributes: { title: "Unordered List" },
      result: (rte) => rte.exec("insertUnorderedList"),
    });

    rte.add("orderedList", {
      icon: icons.ol,
      attributes: { title: "Ordered List" },
      result: (rte) => rte.exec("insertOrderedList"),
    });

    rte.add("toggleCase", {
      icon: icons.toggleCase,
      attributes: { title: "Toggle Case" },
      result: (rte) => {
        const sel = rte.selection();
        if (!sel) return;
        rte.insertHTML(
          sel === sel.toUpperCase() ? sel.toLowerCase() : sel.toUpperCase()
        );
      },
    });
    rte.add("fontSize", {
      icon: icons.sizeSelect,
      attributes: { title: "Font Size" },
      result: (rte, action) => {
        const dropdown = action.btn.querySelector("#fontSizeDropDown");
        const select = dropdown.querySelector(".dropdown-select");
        const menu = dropdown.querySelector(".dropdown-menu");
        const selected = dropdown.querySelector(".selected");
        const items = dropdown.querySelectorAll(".dropdown-item");

        // Toggle dropdown menu
        const toggle = () => {
          const isOpen = menu.classList.contains("show");
          document
            .querySelectorAll(".dropdown-menu.show")
            .forEach((m) => m.classList.remove("show"));
          document
            .querySelectorAll(".dropdown-select.open")
            .forEach((s) => s.classList.remove("open"));
          if (!isOpen) {
            menu.classList.add("show");
            select.classList.add("open");
          }
        };

        // Select option and apply font size
        const selectOption = (text) => {
          selected.textContent = text;
          menu.classList.remove("show");
          select.classList.remove("open");
          const value = text.trim();
          const selectedComponent = editor.getSelected();
          if (selectedComponent && !isNaN(parseInt(value, 10))) {
            selectedComponent.setStyle({
              ...selectedComponent.getStyle(),
              "font-size": value + "px",
            });
            editor.trigger("component:update");
          }
        };

        // Remove existing listeners to prevent duplicates
        const existingToggle = select._dropdownToggle;
        if (existingToggle) select.removeEventListener("click", existingToggle);
        items.forEach((item) => {
          const existingSelect = item._dropdownSelect;
          if (existingSelect) item.removeEventListener("click", existingSelect);
        });

        // Add event listeners
        select._dropdownToggle = toggle;
        select.addEventListener("click", toggle);
        items.forEach((item) => {
          const handler = () => selectOption(item.textContent);
          item._dropdownSelect = handler;
          item.addEventListener("click", handler);
        });

        // Close dropdown on outside click
        const closeHandler = (e) => {
          if (!dropdown.contains(e.target)) {
            menu.classList.remove("show");
            select.classList.remove("open");
          }
        };
        document.removeEventListener("click", closeHandler);
        document.addEventListener("click", closeHandler, { once: true });
      },
    });

    rte.add("textColor", {
      icon: icons.colorInput,
      attributes: { title: "Text Color" },
      event: "input", // Listen for text input
      result: (rte, action) => {
        // alert("Please select a color from the input field.");
        // Find the color input field
        const color = action.btn.querySelector("input")?.value.trim();
        if (color) {
          rte.exec("styleWithCSS", true);
          rte.exec("foreColor", color);
        }
      },
    });

    // 3) Re-order: remove & re-add in exact sequence
    const seq = [
      "textColor",
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "link",
      "unorderedList",
      "orderedList",
      "toggleCase",
      "fontSize",
    ];
    const all = rte.getAll();
    seq.forEach((name) => {
      if (!all[name]) return;
      // ensure it’s at the end in the right order
      rte.remove(name);
      rte.add(name, all[name]);
    });
  });

  // 1) Move Up
  editor.Commands.add("move-sibling-up", {
    run(ed) {
      const cmp = ed.getSelected();
      if (!cmp) return;
      const parent = cmp.parent();
      // GrapesJS stores children in `parent.get('components')` which is a Backbone.Collection
      const coll = parent.get("components");
      const idx = coll.indexOf(cmp);
      if (idx > 0) {
        // remove/add **without** silent so the UI updates
        coll.remove(cmp);
        coll.add(cmp, { at: idx - 1 });
        ed.select(cmp);
      }
    },
  });

  // 2) Move Down
  editor.Commands.add("move-sibling-down", {
    run(ed) {
      const cmp = ed.getSelected();
      if (!cmp) return;
      const parent = cmp.parent();
      const coll = parent.get("components");
      const idx = coll.indexOf(cmp);
      if (idx < coll.length - 1) {
        coll.remove(cmp);
        coll.add(cmp, { at: idx + 1 });
        ed.select(cmp);
      }
    },
  });

  editor.Commands.add("canvas-zoom-in", {
    run(editor) {
      const canvas = editor.Canvas;
      let zoom = canvas.getZoom();
      zoom = Math.min(zoom + 10, 100); // Max 100%
      canvas.setZoom(zoom);
    },
  });

  editor.Commands.add("canvas-zoom-out", {
    run(editor) {
      const canvas = editor.Canvas;
      let zoom = canvas.getZoom();
      zoom = Math.max(zoom - 10, 10); // Min 10%
      canvas.setZoom(zoom);
    },
  });

  editor.Commands.add("tlb-color-picker", {
    run(editor) {
      const selected = editor.getSelected();
      if (!selected) return;

      // Remove existing picker
      const existing = document.getElementById("gjs-bg-color-picker");
      if (existing) existing.remove();

      // Get toolbar container
      const toolbar = document.querySelector(".gjs-toolbar-items");
      if (!toolbar) return;

      // Create input
      const input = document.createElement("input");
      input.type = "text";
      input.id = "gjs-bg-color-picker";
      input.setAttribute("data-coloris", "");
      input.style.position = "absolute";
      input.style.right = "0px";
      input.style.width = "200px";
      input.style.height = "0";
      input.style.padding = "0";
      input.style.backgroundColor = "#000000";
      input.style.opacity = "0";

      input.style.top = "100%";

      // Get existing background color from selected component
      const bg = selected.getStyle()["background-color"] || "#ffffff";

      // Append input
      toolbar.appendChild(input);
      input.click();
      input.value = bg;

      // 1. Update component when input changes
      input.addEventListener("input", () => {
        const val = input.value.trim();
        if (val) {
          selected.addStyle({ "background-color": val });
          editor.trigger("component:update");
        }
      });

      // 2. Update input if selection changes
      const updateInputColor = () => {
        const newSelected = editor.getSelected();
        if (!newSelected) return;
        const currentBg =
          newSelected.getStyle()["background-color"] || "#ffffff";
        input.value = currentBg;
      };

      editor.on("component:selected", updateInputColor);
    },
  });

  // List out every built-in type you want to patch
  ["default", "text", "link", "image", "video", "canvas"].forEach((type) => {
    const cmpType = editor.DomComponents.getType(type);
    if (!cmpType) return;
    const Model = cmpType.model;
    // Override the prototype so _all_ instances—past, present, future—use this toolbar

    // Model.prototype.defaults.toolbar = [
    //   {
    //     icon: icons.copy,
    //     attributes: { class: "gjs-custom-copy", title: "Copy" },
    //     command: "tlb-copy",
    //   },
    //   {
    //     icon: icons.delete,
    //     attributes: { class: "gjs-custom-del", title: "Delete" },
    //     command: "tlb-delete",
    //   },
    // ];
  });

  // Add a command to open the modal with more options
  editor.Commands.add('tlb-more-options', {
    run(editor, sender, options) {
      const toggleMenuBtn = document.querySelector("#toggleMenuBtn");
      const pagesDropdownMenu = document.getElementById("gjs-toolbar-menu");

      toggleMenuBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        pagesDropdownMenu.classList.toggle("toolbar-show");
      });

      document.addEventListener("click", (e) => {
        if (
            !pagesDropdownMenu.contains(e.target) &&
            !toggleMenuBtn.contains(e.target)
        ) {
          pagesDropdownMenu.classList.remove("toolbar-show");
        }
      });

    }
  });



  // Also patch any new components
  editor.on("component:add", (m) => {
    m.set("toolbar", [
      {
        command: "move-sibling-up",
        attributes: { class: "gjs-btn-up", title: "Move Up" },
        label: icons.up,
      },
      {
        command: "move-sibling-down",
        attributes: { class: "gjs-btn-down", title: "Move Down" },
        label: icons.down,
      },
      // built-in drag command for free positioning
      {
        command: "tlb-move",
        attributes: { class: "gjs-btn-drag", title: "Drag" },
        label: icons.drag,
      },
      // built-in drag command for free positioning
      {
        command: "tlb-clone",
        attributes: { class: "gjs-custom-clone", title: "Clone" },
        label: icons.clone,
      },
      // built-in drag command for free positioning
      {
        command: "tlb-delete",
        attributes: { class: "gjs-custom-del", title: "Delete" },
        label: icons.delete,
      },
      // Custom color picker button
      {
        command: "tlb-color-picker",
        attributes: {
          class: "gjs-btn-color-picker",
          title: "Set Background Color",
        },
        label: icons.colorPicker, // or your custom icon
      },
      {
        command: "tlb-more-options",
        attributes: {
          class: "gjs-btn-more",
          title: "More Options"
        },
        label: icons.ellipsis,
      }
    ]);
  });
};

function duplicateItem() {
  grapeEditor.runCommand('tlb-clone');
}

function deleteItem() {
  grapeEditor.runCommand('tlb-delete');
}

function selectItemParent() {
  grapeEditor.runCommand('select-parent');
}

// Initialize GrapesJS editor (which is the based editor for the app)
const grapeEditor = grapesjs.init({
  container: "#gjs",
  fromElement: true,
  plugins: [customToolbarPlugin, "grapesjs-zoom-plugin"],
  storageManager: false,
  avoidInlineStyle: false,
  traitManager: {
    appendTo: "#styles-content2"
  },
  layerManager: {
    appendTo: "#content3"
  },
  assetManager: {
    upload: false,
    multiUpload: false,
  },
  styleManager: {
    appendTo: "#content4",
    sectors: [
      {
        name: 'General',
        open: true,
        buildProps: ['float', 'display', 'position', 'top', 'right', 'left', 'bottom']
      },
      {
        name: 'Flex',
        open: false,
        buildProps: [
          'flex-direction', 'flex-wrap', 'justify-content',
          'align-items', 'align-content', 'order',
          'flex-basis', 'flex-grow', 'flex-shrink'
        ]
      },
      {
        name: 'Dimension',
        open: false,
        buildProps: ['width', 'height', 'max-width', 'min-height', 'margin', 'padding']
      },
      {
        name: 'Typography',
        open: false,
        buildProps: [
          'font-family', 'font-size', 'font-weight',
          'letter-spacing', 'color', 'line-height',
          'text-align', 'text-decoration', 'text-shadow'
        ]
      },
      {
        name: 'Decorations',
        open: false,
        buildProps: ['background-color', 'border-radius', 'border', 'box-shadow', 'background']
      },
      {
        name: 'Extra',
        open: false,
        buildProps: ['opacity', 'transition', 'perspective', 'transform']
      }
    ]
  },
  domComponents: {
    defaults: {
      // You can leave this empty, since our plugin takes over
      // toolbar: [],
    },
  },
  deviceManager: {
    devices: [
      {
        name: "Desktop",
        width: "",
      },
      {
        name: "Tablet",
        width: "768px",
        height: "1024px",
        widthMedia: "992px",
        margin: "auto 0",
      },
      {
        name: "Mobile",
        width: "375px",
        height: "767px",
        widthMedia: "480px",
      },
      {
        name: "MobileLandscape",
        height: "375px",
        width: "767px",
        widthMedia: "480px",
      },
    ],
  },
  panels: {
    defaults: [
      {
        id: "commands",
        buttons: [
          {
            id: "zoom-in",
            className: "fa fa-search-plus",
            attributes: { title: "Zoom In" },
            command: "canvas-zoom-in",
          },
          {
            id: "zoom-out",
            className: "fa fa-search-minus",
            attributes: { title: "Zoom Out" },
            command: "canvas-zoom-out",
          },
        ],
      },
    ],
  },
});

let disableProjectSave = false;

grapeEditor.on('load', () => {
  const buttons = grapeEditor.DomComponents.getWrapper().find('button');
  buttons.forEach(button => {
    button.set({ stylable: false });
  });
});

const undoBtn = document.getElementById('undoBtn');
const redoBtn = document.getElementById('redoBtn');

undoBtn.addEventListener('click', function() {
  grapeEditor.UndoManager.undo();
});

redoBtn.addEventListener('click', function() {
  grapeEditor.UndoManager.redo();
});

async function get_user_template(template_id) {
  console.log("loading template ", template_id);
  const request_details = {
        method: "GET",
          headers: {
            "Content-Type": "application/json"
        }
    }

    const response = await fetch(`${api_endpoint}/template/upload/single/${template_id}`, request_details);
    const result =  await response.json();

    let user_template = []

    if (result.code === "00") {
        user_template = result.data;
    }

    return user_template;
}

const params = new URLSearchParams(window.location.search);
const templateId = params.get('templateId');
const user_id = params.get('userId');
const pages = grapeEditor.Pages;

async function get_saved_project(user_id, savedProjectTemplateId) {
  const params = new URLSearchParams({
    user_id,
    template_id: savedProjectTemplateId
  });

  const request_details = {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  }

  const response = await fetch(`${api_endpoint}/grape-js?${params}`, request_details);
  const result =  await response.json();

  let project = []

  if (result.code === "00") {
    project = result.data;
  }

  return project;
}

function loadTemplateFile(res) {
  fetch(res[0].templateFiles.htmlFiles[0]) // full path also works if same server
      .then((res) => res.text())
      .then((html) => {
        grapeEditor.setComponents(html); // set HTML inside the editor
        pages.add({
          id: "index",
          name: "index",
          styles: "",
          component: html,
        });
      })
      .catch((err) => console.error("Error loading template:", err));
}

function get_user_saved_project(projectTemplateId = null, reloadPage=false) {
  var proTemplateId = templateId;
  if (projectTemplateId) {
    proTemplateId = projectTemplateId;
  }
  console.log("getting saved project for template ", proTemplateId)
  get_saved_project(user_id, proTemplateId).then((data) => {
    if (data.length === 0) {
      get_user_template(proTemplateId).then((res) => {
        if (res.length > 0) {
          loadTemplateFile(res)
        }
      })
    } else {
      const oldPages = grapeEditor.Pages.getAll();
      oldPages.forEach(page => {
        grapeEditor.Pages.remove(page);
      });

      const saved_project = data[0].data

      console.log("saved_project json", saved_project)

      let firstIndexPage = null;

      saved_project.forEach(result => {
        console.log("saved project result is ", result);

        if (result.name && !firstIndexPage) {
          firstIndexPage = result.name;
        }

        pages.add({
          id: result.id,
          name: result.name,
          styles: result.cssPage,
          component: result.htmlPage,
        });
      });

      console.log("pages now from saved project:", pages.getAll());

      pages.select(pages.get(firstIndexPage));
    }
    const url = new URL(window.location);
    url.searchParams.set('templateId', proTemplateId);
    window.history.replaceState({}, '', url);

    if (reloadPage) {
      window.location.reload();
    }
  });
}

get_user_saved_project()

const templatePages = document.getElementById("template-pages");

grapeEditor.DomComponents.addType('button', {
  isComponent: el => el.tagName === 'BUTTON',
  model: {
    defaults: {
      tagName: 'button',
      // stylable: false, // Prevents the Style Manager from applying styles
      draggable: true,
      droppable: false,
      highlightable: false,
      editable: true,
      traits: [
        {
          type: 'text',
          name: 'content',
          label: 'Text',
        },
        'id',
        'title',
        'class',
      ],
      styles: {}
    },
  },
});

// grapeEditor.on('component:mount', (component) => {
//   if (component.get('type') === 'button') {
//     component.set({
//       hoverable: false,
//       badgable: false,
//       highlightable: false
//     });
//   }
// });

const modelDefault = {
  defaults: {
    tagName: 'div',
    draggable: true,
    droppable: true,
    highlightable: true,
    editable: true,
    layerable: true,
    selectable: true,
    hoverable: true,
    traits: [
      'id',
      'title',
      'class',
    ],
    styles: {}
  },
};

// grapeEditor.DomComponents.addType('div', {
//   isComponent: el => el.tagName === 'DIV',
//   model: modelDefault,
// });
//
// grapeEditor.DomComponents.addType('section', {
//   isComponent: el => el.tagName === 'SECTION',
//   model: modelDefault,
// });

grapeEditor.on('page', () => {
  const pages = grapeEditor.Pages;
  console.log("no. pages is ", pages.getAll());

  templatePages.innerHTML = "";

  const allPages = pages.getAll();

  allPages.forEach(page => {
    const pageName = page.get('name');
    const pageId = page.get('id');

    if (pageName) {
      const pageElement = document.createElement('div');
      pageElement.style.display = "block";
      pageElement.style.width = "100%";
      pageElement.style.borderBottom = "1px solid #282B30";

      pageElement.innerHTML = `
        <div id="${pageId}" class="page-list" onclick="loadPage(this)">
          <h2 id="${pageName}">${pageName}</h2>
          <div class="pages-dropdown">
            <span onclick="togglePagesDropdown(event, this, '${pageName}')">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" role="img" aria-label="More">
                <title>More</title>
                <circle cx="12" cy="5.5" r="1.75" fill="currentColor"/>
                <circle cx="12" cy="12"  r="1.75" fill="currentColor"/>
                <circle cx="12" cy="18.5" r="1.75" fill="currentColor"/>
              </svg>
            </span>
            <div id="pages-dropdown-menu-${pageName}" class="pages-dropdown-content">
               <a href="#" onclick="editPageName(this)">Edit</a>
               <a href="#" onclick="duplicatePage('${pageName}')">Duplicate</a>
               <a onclick="shareSinglePage('${pageName}')">Share</a>
               <a href="#" onclick="deletePage('${pageName}')">Delete</a>
            </div>
          </div>
        </div>
      `;
      templatePages.appendChild(pageElement);
    }
  });
});

function togglePagesDropdown(event, _, pageName) {
  event.stopPropagation(); // prevent click from bubbling to window
  const pagesDropdownMenu = document.getElementById(`pages-dropdown-menu-${pageName}`);
  pagesDropdownMenu.classList.toggle("pages-dropdown-show");

  window.addEventListener("click", () => {
    pagesDropdownMenu.classList.remove("pages-dropdown-show");
  });
}

// DOM elements for dimension inputs
const dimensionXInput = document.getElementById("dimensionX");
const dimensionYInput = document.getElementById("dimensionY");

// Function to update canvas dimensions
function updateCanvasDimensions(width, height) {
  grapeEditor.setDevice("desktop");

  document.querySelector(".gjs-frame-wrapper").style.width = width + "px";
  document.querySelector(".gjs-frame-wrapper").style.height = height + "px";
  document.querySelector(".gjs-frame-wrapper").style.margin = "auto 0";
}

// Two-way binding for dimension inputs
if (dimensionXInput && dimensionYInput) {
  console.log(dimensionXInput, dimensionYInput);
  // Update inputs when device changes
  grapeEditor.on("change:device", (device) => {
    setTimeout(() => {
      let deviceWidth = window.getComputedStyle(
        document.querySelector(".gjs-frame-wrapper")
      ).width;
      let deviceHeight = window.getComputedStyle(
        document.querySelector(".gjs-frame-wrapper")
      ).height;

      dimensionXInput.value = parseInt(deviceWidth) || "";
      dimensionYInput.value = parseInt(deviceHeight) || "";
    }, 300);
  });

  // Update canvas when inputs change
  dimensionXInput.addEventListener("input", (e) => {
    const width = e.target.value.trim() || "1240";
    updateCanvasDimensions(width, dimensionYInput.value || "556");
  });

  dimensionYInput.addEventListener("input", (e) => {
    const height = e.target.value.trim() || "556";
    updateCanvasDimensions(dimensionXInput.value || "1240", height);
  });

  // Initialize inputs with current device dimensions
  const initialDevice = grapeEditor.getDevice();
  dimensionXInput.value = parseInt(initialDevice.width) || "1240";
  dimensionYInput.value = parseInt(initialDevice.height) || "556";
} else {
  console.error(
    "Dimension inputs not found. Please check IDs 'dimensionX' and 'dimensionY'."
  );
}

// Collapse sidebar
const collapseSidebar = document.getElementById("collapseSidebar");
const editorSidebar = document.getElementById("editorSidebar");
const collapseSidebarRight = document.getElementById("collapseSidebarRight");
const editorSidebarRight = document.getElementById("editorSidebarRight");
const sidebarStylesGroup = document.getElementsByClassName(
  "sidebar_styles_group"
);

collapseSidebar.addEventListener("click", function () {
  const isSidebarCollapsed = this.getAttribute("aria-expanded") === "true";

  collapseSidebar.setAttribute("aria-expanded", !isSidebarCollapsed);
  editorSidebar.classList.toggle("active");
});

collapseSidebarRight.addEventListener("click", function () {
  const isSidebarCollapsed = this.getAttribute("aria-expanded") === "true";

  collapseSidebarRight.setAttribute("aria-expanded", !isSidebarCollapsed);
  editorSidebarRight.classList.toggle("active");
});

function showAsideCommentContainer() {
  const editorSidebarContainer = document.getElementById(
    "editorSidebarContainer"
  );
  const commentContainer = document.getElementById("commentContainer");

  editorSidebarContainer.classList.add(HIDDEN);
  commentContainer.classList.remove(HIDDEN);
}

function hideAsideCommentContainer() {
  const editorSidebarContainer = document.getElementById(
    "editorSidebarContainer"
  );
  const commentContainer = document.getElementById("commentContainer");

  commentContainer.classList.add(HIDDEN);
  editorSidebarContainer.classList.remove(HIDDEN);
}

function toggleNewBlankWrapper(hide = true) {
  const newBlankWrapper = document.getElementById("newBlankWrapper");
  newBlankWrapper.classList[hide ? "add" : "remove"](HIDDEN);
}

for (let i = 0; i < sidebarStylesGroup.length; i++) {
  let toggler = sidebarStylesGroup[i].querySelector(".header");
  toggler &&
    toggler.addEventListener("click", () => {
      sidebarStylesGroup[i].classList.toggle("closed");
    });
}

const userlogout = document.querySelector(".logout");
userlogout.addEventListener("click", () => {
  window.location.href = abele_marketplace
})

