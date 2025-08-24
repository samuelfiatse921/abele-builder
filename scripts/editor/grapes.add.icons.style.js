// Sample of icons
const dummyIcons = [
  {
    category: "duotone",
    icon: '<iconify-icon icon="mdi:account"></iconify-icon>',
  },
  {
    category: "filled",
    icon: '<iconify-icon icon="mdi:folder"></iconify-icon>',
  },
  {
    category: "line",
    icon: '<iconify-icon icon="mdi:delete"></iconify-icon>',
  },
  {
    category: "duotone",
    icon: '<iconify-icon icon="mdi:home"></iconify-icon>',
  },
  {
    category: "filled",
    icon: '<iconify-icon icon="mdi:heart"></iconify-icon>',
  },
  {
    category: "line",
    icon: '<iconify-icon icon="mdi:download"></iconify-icon>',
  },
  {
    category: "duotone",
    icon: '<iconify-icon icon="mdi:settings"></iconify-icon>',
  },
  {
    category: "filled",
    icon: '<iconify-icon icon="mdi:lock"></iconify-icon>',
  },
  { category: "line", icon: '<iconify-icon icon="mdi:edit"></iconify-icon>' },
  {
    category: "duotone",
    icon: '<iconify-icon icon="mdi:email"></iconify-icon>',
  },
  {
    category: "filled",
    icon: '<iconify-icon icon="mdi:phone"></iconify-icon>',
  },
  {
    category: "line",
    icon: '<iconify-icon icon="mdi:filter"></iconify-icon>',
  },
  {
    category: "duotone",
    icon: '<iconify-icon icon="mdi:alert"></iconify-icon>',
  },
  {
    category: "filled",
    icon: '<iconify-icon icon="mdi:wifi"></iconify-icon>',
  },
  {
    category: "line",
    icon: '<iconify-icon icon="mdi:arrow-right"></iconify-icon>',
  },
  {
    category: "duotone",
    icon: '<iconify-icon icon="mdi:camera"></iconify-icon>',
  },
  {
    category: "filled",
    icon: '<iconify-icon icon="mdi:star"></iconify-icon>',
  },
  {
    category: "line",
    icon: '<iconify-icon icon="mdi:arrow-left"></iconify-icon>',
  },
  {
    category: "duotone",
    icon: '<iconify-icon icon="mdi:calendar"></iconify-icon>',
  },
  {
    category: "filled",
    icon: '<iconify-icon icon="mdi:user"></iconify-icon>',
  },
  { category: "line", icon: '<iconify-icon icon="mdi:plus"></iconify-icon>' },
  {
    category: "duotone",
    icon: '<iconify-icon icon="mdi:chart-bar"></iconify-icon>',
  },
  {
    category: "filled",
    icon: '<iconify-icon icon="mdi:map"></iconify-icon>',
  },
  {
    category: "line",
    icon: '<iconify-icon icon="mdi:minus"></iconify-icon>',
  },
  {
    category: "duotone",
    icon: '<iconify-icon icon="mdi:check"></iconify-icon>',
  },
  {
    category: "filled",
    icon: '<iconify-icon icon="mdi:menu"></iconify-icon>',
  },
  {
    category: "line",
    icon: '<iconify-icon icon="mdi:magnify"></iconify-icon>',
  },
  {
    category: "duotone",
    icon: '<iconify-icon icon="mdi:clock"></iconify-icon>',
  },
  {
    category: "filled",
    icon: '<iconify-icon icon="mdi:upload"></iconify-icon>',
  },
  {
    category: "line",
    icon: '<iconify-icon icon="mdi:share-variant"></iconify-icon>',
  },
];

const allIconsStyleContainerHeaderButtons =
  iconsStyleContainer?.querySelectorAll("button");
const iconsStyleContainerContainers = document.querySelectorAll(
  ".icons_style_container_item"
);

if (iconsStyleContainerHeader) {
  iconsStyleContainerHeader.addEventListener("click", (e) => {
    const button = e.target.closest("button");

    if (button) {
      const { type } = button.dataset;
      const container = document.getElementById(`iconsStyleContainer${type}`);

      allIconsStyleContainerHeaderButtons?.forEach((btn) =>
        btn.classList.remove("active")
      );
      button.classList.add("active");

      iconsStyleContainerContainers?.forEach((container) =>
        container.classList.add(HIDDEN)
      );
      container?.classList.remove(HIDDEN);
    }
  });
} else {
  console.error("Icons style container header not found.");
}

// Render dummy icons and attach click listeners
function renderDummyIcons(data) {
  if (!iconsListSelectButtons) {
    console.error("Icons list select buttons container not found.");
    return;
  }

  iconsListSelectButtons.innerHTML = "";

  data.forEach(({ icon }) => {
    const iconElement = document.createElement("button");
    iconElement.classList.add("icon-button");
    iconElement.innerHTML = icon;
    iconElement.addEventListener("click", () => {
      grapeEditor.runCommand("insert-icon", { iconHtml: icon });
    });
    iconsListSelectButtons.appendChild(iconElement);
  });
}

renderDummyIcons(dummyIcons);
