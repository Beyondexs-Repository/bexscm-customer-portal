const fallbackTheme = {
  background: "#cffafe",
  accent: "#0891b2",
  foreground: "#164e63",
  label: "Seafood",
};

const categoryThemes = {
  "Baked Goods": {
    background: "#fef3c7",
    accent: "#b45309",
    foreground: "#422006",
    label: "Bakery",
  },
  Beef: {
    background: "#fee2e2",
    accent: "#991b1b",
    foreground: "#450a0a",
    label: "Beef",
  },
  Beverages: {
    background: "#dbeafe",
    accent: "#1d4ed8",
    foreground: "#172554",
    label: "Drinks",
  },
  "Canned Goods": {
    background: "#e5e7eb",
    accent: "#4b5563",
    foreground: "#111827",
    label: "Canned",
  },
  Chicken: {
    background: "#ffedd5",
    accent: "#c2410c",
    foreground: "#431407",
    label: "Chicken",
  },
  Dairy: {
    background: "#e0f2fe",
    accent: "#0369a1",
    foreground: "#0c4a6e",
    label: "Dairy",
  },
  "Deli Meats": {
    background: "#ffe4e6",
    accent: "#be123c",
    foreground: "#4c0519",
    label: "Deli",
  },
  "Dry Goods": {
    background: "#f5f5f4",
    accent: "#78716c",
    foreground: "#292524",
    label: "Pantry",
  },
  Eggs: {
    background: "#fefce8",
    accent: "#ca8a04",
    foreground: "#422006",
    label: "Eggs",
  },
  "French Fries": {
    background: "#fef9c3",
    accent: "#d97706",
    foreground: "#451a03",
    label: "Fries",
  },
  "Lamb & Veal": {
    background: "#ede9fe",
    accent: "#6d28d9",
    foreground: "#2e1065",
    label: "Lamb",
  },
  "Lard & Oils": {
    background: "#fef3c7",
    accent: "#a16207",
    foreground: "#422006",
    label: "Oils",
  },
  "Packaging & Non Food Items": {
    background: "#ecfeff",
    accent: "#0e7490",
    foreground: "#164e63",
    label: "Supplies",
  },
  Pork: {
    background: "#fce7f3",
    accent: "#be185d",
    foreground: "#500724",
    label: "Pork",
  },
  "Processed Meat": {
    background: "#fed7aa",
    accent: "#9a3412",
    foreground: "#431407",
    label: "Meats",
  },
  Produce: {
    background: "#dcfce7",
    accent: "#15803d",
    foreground: "#14532d",
    label: "Produce",
  },
  Seafood: {
    background: "#cffafe",
    accent: "#0891b2",
    foreground: "#164e63",
    label: "Seafood",
  },
  Soups: {
    background: "#fee2e2",
    accent: "#dc2626",
    foreground: "#450a0a",
    label: "Soups",
  },
  "Specialty Meats": {
    background: "#fae8ff",
    accent: "#a21caf",
    foreground: "#4a044e",
    label: "Specialty",
  },
  "Spices & Sauces": {
    background: "#ffedd5",
    accent: "#ea580c",
    foreground: "#431407",
    label: "Sauces",
  },
  Tortillas: {
    background: "#fef3c7",
    accent: "#92400e",
    foreground: "#422006",
    label: "Tortillas",
  },
  Turkey: {
    background: "#e2e8f0",
    accent: "#475569",
    foreground: "#0f172a",
    label: "Turkey",
  },
};

function escapeSvgText(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function getCategoryTheme(categoryName) {
  return categoryThemes[String(categoryName ?? "").trim()] ?? fallbackTheme;
}

export function getCategoryPlaceholderImage(categoryName) {
  const resolvedCategory = categoryName || "Seafood";
  const theme = getCategoryTheme(resolvedCategory);
  const label = escapeSvgText(theme.label || resolvedCategory);
  const categoryText = escapeSvgText(resolvedCategory);

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 520">
      <rect width="720" height="520" fill="${theme.background}"/>
      <circle cx="598" cy="86" r="112" fill="${theme.accent}" opacity="0.14"/>
      <circle cx="94" cy="438" r="148" fill="${theme.accent}" opacity="0.12"/>
      <path d="M100 338 C190 248 280 398 372 300 S556 210 636 316" fill="none" stroke="${theme.accent}" stroke-width="20" stroke-linecap="round" opacity="0.24"/>
      <rect x="92" y="96" width="536" height="328" rx="34" fill="#ffffff" opacity="0.58"/>
      <rect x="132" y="136" width="456" height="248" rx="28" fill="${theme.accent}" opacity="0.10"/>
      <text x="360" y="250" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="58" font-weight="700" fill="${theme.foreground}">${label}</text>
      <text x="360" y="304" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="600" fill="${theme.foreground}" opacity="0.72">${categoryText}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
