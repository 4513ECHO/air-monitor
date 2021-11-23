import { datetime, sanitize, tag } from "./deps.ts";
import { getAmedas } from "./api.ts";
import { Amedas } from "./types.ts";
import { renderCSS } from "./render_css.ts";

export function renderHtml(location: string): string | null {
  const amedas: Amedas | null = getAmedas(location);
  if (amedas === null) {
    return null;
  }
  return "<!DOCTYPE html>" +
    tag("html", renderHtmlHead(amedas), renderHtmlBody(amedas));
}

function renderHtmlHead(amedas: Amedas): string {
  const viewport = "width=device-width,initial-scale=1.0";
  const title = `${amedas.info.kjName} | Sky Monitor`;

  return tag(
    "head",
    { prefix: "og:http://ogp.me/ns#" },
    tag("meta", { charset: "utf-8" }),
    tag("meta", { name: "viewport", content: viewport }),
    tag("meta", { property: "og:title", content: sanitize(title) }),
    tag("title", sanitize(title)),
    tag("style", sanitize(renderCSS())),
  );
}

interface HtmlTemplete {
  header?: string;
  aside?: string;
  article?: string;
}

function renderHtmlTemplete(templete: HtmlTemplete): string {
  const { header, aside, article } = templete;
  return tag(
    "body",
    tag(
      "header",
      tag("h1", { id: "title" }, "Sky Monitor"),
      header || "",
    ),
    tag(
      "main",
      tag("aside", aside || ""),
      tag("article", article || ""),
      tag("div", { id: "page_top" }, ""),
    ),
    tag(
      "footer",
      tag("a", { href: "https://github.com/4513ECHO/" }, "GitHub"),
      tag("a", { href: "https://deno.com/deploy" }, "Deno Deploy"),
    ),
  );
}

function renderHtmlBody(amedas: Amedas): string {
  return renderHtmlTemplete({
    aside: [
      tag(
        "h3",
        { id: "time" },
        datetime().toZonedTime("Asia/Tokyo").format("YYYY/MM/dd HH:00:00"),
      ),
      tag("hr"),
      tag("h2", { id: "location" }, sanitize(amedas.info.kjName)),
    ].join(""),
    article: [
      tag(
        "section",
        { id: "temp" },
        tag("h3", `${amedas.data.temp[0]}℃`),
      ),
      tag(
        "section",
        { id: "humidity" },
        tag("h3", `${amedas.data.humidity[0]}%`),
      ),
      tag(
        "section",
        { id: "pressure" },
        tag("h3", `${amedas.data.pressure[0]}hPa`),
      ),
    ].join(""),
  });
}
