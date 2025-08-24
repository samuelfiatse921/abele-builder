class Dropdown {
  constructor(element) {
    this.dropdown = element;
    this.select = element.querySelector(".dropdown-select");
    this.menu = element.querySelector(".dropdown-menu");
    this.selected = element.querySelector(".selected");
    this.items = element.querySelectorAll(".dropdown-item");

    this.select.addEventListener("click", () => this.toggle());
    this.items.forEach((item) => {
      item.addEventListener("click", () => this.selectOption(item.textContent));
    });
  }

  toggle() {
    const isOpen = this.menu.classList.contains("show");
    // Close all other dropdowns
    document.querySelectorAll(".dropdown-menu.show").forEach((menu) => {
      menu.classList.remove("show");
    });
    document.querySelectorAll(".dropdown-select.open").forEach((select) => {
      select.classList.remove("open");
    });
    // Toggle current dropdown
    if (!isOpen) {
      this.menu.classList.add("show");
      this.select.classList.add("open");
    }
  }

  selectOption(text) {
    const activeItem = Array.from(this.items).find((item) =>
      item.classList.contains("active")
    );

    this.selected.textContent = activeItem?.textContent || text;
    this.menu.classList.remove("show");
    this.select.classList.remove("open");
  }
}

// Initialize all dropdowns
document.querySelectorAll(".dropdown").forEach((dropdown) => {
  new Dropdown(dropdown);
});

// Close all dropdowns when clicking outside
document.addEventListener("click", function (event) {
  if (!event.target.closest(".dropdown")) {
    document.querySelectorAll(".dropdown-menu.show").forEach((menu) => {
      menu.classList.remove("show");
    });
    document.querySelectorAll(".dropdown-select.open").forEach((select) => {
      select.classList.remove("open");
    });
  }
});
