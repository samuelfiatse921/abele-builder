class BlankEditor {
  constructor(grapeEditor) {
    this.grapeEditor = grapeEditor;
    console.log("grape js initialised")
  }

  init() {
    this.grapeEditor = grapesjs.init({
      container: "#gjs",
      plugins: [grapesjsEditor],
    });
  }

}

new BlankEditor(grapeEditor).init();
