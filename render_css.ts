export function css(
  selectorName: string,
  propertys: Record<string, string | number>,
  pseudoElements?: Record<string, Record<string, string | number>>,
): string {
  if (!selectorName) {
    throw new Error("selectorName is empty");
  }

  const pseudo = pseudoElements
    ? Object.entries(pseudoElements).map(
      ([name, props]) => {
        Object.entries(props).map(
          ([key, val]) => `${key.replaceAll("_", "-")}:${val}`,
        ).join(";");
        return `${selectorName}::${name.replaceAll("_", "-")}{${props}};`;
      },
    ).join(";")
    : "";

  return `${selectorName}{${
    Object.entries(propertys).map(
      ([key, val]) => `${key.replaceAll("_", "-")}:${val}`,
    ).join(";")
  }};${pseudo}`;
}

export function px(value: number): string {
  return `${value}px`;
}

export function em(value: number): string {
  return `${value}em`;
}

export function rem(value: number): string {
  return `${value}rem`;
}

export function renderCSS(): string {
  return [
    css("body", { background_color: "#111111", color: "azure" }),
    css("a", { color: "inherit" }),
    css("article", { display: "flex" }),
  ].join("");
}
