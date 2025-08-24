class Export {
  constructor(grapeEditor) {
    this.grapeEditor = grapeEditor;
    this.downloadPDF = document.getElementById("downloadPDF");
    this.downloadHTML = document.getElementById("downloadHTML");
    this.downloadPNG = document.getElementById("downloadPNG");
    this.fileNameInput = document.getElementById("fileNameInput");

    this.init();
  }

  init() {
    // Hook up buttons to export methods
    this.downloadHTML.addEventListener("click", this.exportHTML.bind(this));
    this.downloadPNG.addEventListener("click", this.exportAsImage.bind(this));
    this.downloadPDF.addEventListener("click", this.exportAsPDF.bind(this));
  }

  getFileName() {
    const name = this.fileNameInput.value.trim();
    return name ? name : "template";
  }

  downloadFile(content, filename, type) {
    const a = document.createElement("a");
    const file = new Blob([content], { type });
    a.href = URL.createObjectURL(file);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  // 1. Download HTML format
  exportHTML() {
    const html = this.grapeEditor.getHtml();
    const css = this.grapeEditor.getCss();
    const fullHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>${css}</style></head><body>${html}</body></html>`;
    this.downloadFile(fullHtml, `${this.getFileName()}.html`, "text/html");
  }

  // 2. Download as PNG image
  exportAsImage() {
    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.left = "-9999px";
    document.body.appendChild(iframe);
    iframe.contentDocument.write(this.grapeEditor.getHtml());
    iframe.contentDocument.close();

    setTimeout(() => {
      html2canvas(iframe.contentDocument.body).then((canvas) => {
        const a = document.createElement("a");
        a.href = canvas.toDataURL("image/png");
        a.download = `${this.getFileName()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        document.body.removeChild(iframe);
      });
    }, 500);
  }

  // 3. Download as PDF
  async exportAsPDF() {
    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.left = "-9999px";
    document.body.appendChild(iframe);
    iframe.contentDocument.write(this.grapeEditor.getHtml());
    iframe.contentDocument.close();

    // Wait for content to render
    setTimeout(async () => {
      const canvas = await html2canvas(iframe.contentDocument.body);
      const imgData = canvas.toDataURL("image/png");

      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`${this.getFileName()}.pdf`);

      document.body.removeChild(iframe);
    }, 500);
  }
}

// Initialize with your GrapesJS editor instance
new Export(grapeEditor);

//
// showFlashMessage("Template exported successfully", "", "success", 8000);
