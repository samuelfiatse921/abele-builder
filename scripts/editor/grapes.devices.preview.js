class PreviewApp {
  constructor(grapeEditor) {
    this.grapeEditor = grapeEditor;
    this.canvasContainer = this.grapeEditor.Canvas.getElement();
    this.currentMode = "desktop"; // Track the current mode

    // Editing mode buttons
    this.desktopButton = document.getElementById("desktopButton");
    this.tabletButton = document.getElementById("tabletButton");
    this.mobileButton = document.getElementById("mobileButton");
    this.mobileLandscapeButton = document.getElementById(
      "mobileLandscapeButton"
    );
    this.deviceSize = document.getElementById("deviceSize");

    // Preview mode buttons
    this.desktopPreviewButton = document.getElementById("desktopPreviewButton");
    this.tabletPreviewButton = document.getElementById("tabletPreviewButton");
    this.mobilePreviewButton = document.getElementById("mobilePreviewButton");
    this.mobileLandscapePreviewButton = document.getElementById(
      "mobileLandscapePreviewButton"
    );
    this.fullScreenPreviewButton = document.getElementById(
      "fullScreenPreviewButton"
    );

    this.previewMenuButton = document.getElementById("previewMenuButton");

    this.previewScreenPreviewButton = document.getElementById(
      "previewScreenPreviewButton"
    );
    // Sidebar & navigation
    this.previewTemplateDesign = document.getElementById(
      "previewTemplateDesign"
    );
    this.editorSidebar = document.getElementsByClassName("editorSidebar");
    this.previewNavigation = document.getElementById("previewNavigation");
    this.topBar = document.getElementById("topBar");
    this.previewMenuButton = document.getElementById("previewMenuButton");

    document.addEventListener("DOMContentLoaded", () => this.init());
  }

  init() {
    if (typeof this.grapeEditor === "undefined") {
      console.error("grapeEditor is not defined. Initialize GrapesJS first.");
      throw new Error("grapeEditor is not defined");
    }

    if (!this.canvasContainer) {
      console.error("GrapesJS canvas container not found.");
      return;
    }

    this.bindPreviewButtons();
    this.bindSidebarToggle();

    // Default to desktop
    this.toggleActiveButton("desktop");
  }

  bindPreviewButtons() {
    this.fullScreenPreviewButton.addEventListener("click", () => {
      this.onModeClick("desktop");
      this.grapeEditor.setDevice("Desktop");
      previewNavigation.style.display = "none";
      topBar.style.display = "none";
      fullScreenPreviewButton.classList.add("active");
      previewScreenPreviewButton.style.display = "block";
      this.togglePreview(true);
    });

    this.previewScreenPreviewButton.addEventListener("click", () => {
      this.onModeClick("desktop");
      this.grapeEditor.setDevice("Desktop");
      previewNavigation.style.display = "flex";
      topBar.style.display = "none";
      previewScreenPreviewButton.classList.add("active");
      previewScreenPreviewButton.style.display = "none";
      this.togglePreview(true);
    });

    this.previewMenuButton.addEventListener("click", () => {
      this.togglePreview(false);
    });

    this.desktopPreviewButton.addEventListener("click", () => {
      this.onModeClick("desktop");
      this.grapeEditor.setDevice("Desktop");
      previewScreenPreviewButton.style.display = "none";
      this.togglePreview(true);
    });

    this.tabletPreviewButton.addEventListener("click", () => {
      this.onModeClick("tablet");
      this.grapeEditor.setDevice("Tablet");
      previewScreenPreviewButton.style.display = "none";
      this.togglePreview(true);
    });

    this.mobilePreviewButton.addEventListener("click", () => {
      this.onModeClick("mobile");
      this.grapeEditor.setDevice("Mobile");
      previewScreenPreviewButton.style.display = "none";
      this.togglePreview(true);
    });

    this.mobileLandscapePreviewButton.addEventListener("click", () => {
      this.onModeClick("mobileLandscape");
      this.grapeEditor.setDevice("MobileLandscape");
      previewScreenPreviewButton.style.display = "none";
      this.togglePreview(true);
    });

    // Editing Device Sizes
    this.desktopButton.addEventListener("click", () => {
      this.onModeClick("desktop");
      this.grapeEditor.setDevice("Desktop");
    });

    this.tabletButton.addEventListener("click", () => {
      this.onModeClick("tablet");
      this.grapeEditor.setDevice("Tablet");
    });

    this.mobileButton.addEventListener("click", () => {
      this.onModeClick("mobile");
      this.grapeEditor.setDevice("Mobile");
    });

    this.mobileLandscapeButton.addEventListener("click", () => {
      this.onModeClick("mobileLandscape");
      this.grapeEditor.setDevice("MobileLandscape");
    });
  }

  onModeClick(mode) {
    this.togglePreview(false);
    this.currentMode = mode; // Update the current mode
    this.toggleActiveButton(mode);
    this.deviceSize.textContent = mode.charAt(0).toUpperCase() + mode.slice(1);
  }

  bindSidebarToggle() {
    this.previewTemplateDesign?.addEventListener("click", () => {
      // this.editorSidebar.forEach((sidebar) => sidebar.classList.add(HIDDEN));
      this.editorSidebar[0].classList.add(HIDDEN);
      this.editorSidebar[1].classList.add(HIDDEN);

      this.previewNavigation.style.display = "flex";
      this.topBar.style.display = "none";
      this.togglePreview(true);
    });

    this.previewMenuButton?.addEventListener("click", () => {
      this.previewNavigation.style.display = "none";
      this.topBar.style.display = "flex";
      // this.editorSidebar.forEach((sidebar) => sidebar.classList.remove(HIDDEN));
      this.editorSidebar[0].classList.remove(HIDDEN);
      this.editorSidebar[1].classList.remove(HIDDEN);

      this.togglePreview(false);
      // this.grapeEditor.setDevice("Desktop");
    });
  }

  toggleActiveButton(mode) {
    const btnMap = {
      desktop: [this.desktopPreviewButton, this.desktopButton],
      tablet: [this.tabletPreviewButton, this.tabletButton],
      mobile: [this.mobilePreviewButton, this.mobileButton],
      mobileLandscape: [
        this.mobileLandscapePreviewButton,
        this.mobileLandscapeButton,
      ],
    };
    Object.entries(btnMap).forEach(([key, btn]) => {
      if (btn)
        btn.forEach((button) =>
          button.classList.toggle("active", key === mode)
        );
    });
  }

  togglePreview(disablePointerEvents = false) {
    let toolbar = document.querySelector(".gjs-toolbar");
    let deviceFrame = document.querySelector(".gjs-frame");
    let deviceWrapper = document.querySelector(".gjs-frame-wrapper");

    if (toolbar) {
      disablePointerEvents
        ? toolbar.classList.add("preview")
        : toolbar.classList.remove("preview");
    }

    if (deviceFrame) {
      disablePointerEvents
        ? deviceFrame.classList.add("preview")
        : deviceFrame.classList.remove("preview");
    }

    if (deviceWrapper) {
      disablePointerEvents
        ? deviceWrapper.classList.add("preview")
        : deviceWrapper.classList.remove("preview");
    }

    let selectionOutline = document.querySelector(".gjs-selected");
    if (selectionOutline) {
      disablePointerEvents
        ? selectionOutline.classList.add("preview")
        : selectionOutline.classList.remove("preview");
    }

    const canvas = grapeEditor.Canvas;
    disablePointerEvents ? canvas.setZoom(70) : canvas.setZoom(100);
    // GrapesJS Canvas module

    this.grapeEditor.runCommand(disablePointerEvents ? "preview" : "preview");
    this.grapeEditor.Canvas.getBody().style.pointerEvents = disablePointerEvents
      ? "none"
      : "auto";
    this.grapeEditor.Canvas.getBody().style.userSelect = disablePointerEvents
      ? "none"
      : "auto";
    document.querySelector(".gjs-off-prv").style.display = "none";
  }
}

new PreviewApp(grapeEditor);
