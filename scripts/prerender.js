// Generates real static HTML files for every route so search engines and
// AI crawlers (which mostly don't execute JavaScript) see actual content
// instead of an empty <div id="root"></div> shell.
//
// Runs after `vite build` and after the SSR bundle has been built to
// dist-ssr/entry-server.js. See package.json "build" script.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const distDir = path.join(root, "dist");
const ssrEntry = path.join(root, "dist-ssr", "entry-server.js");

// Must match the domain your site is actually served from, since sitemap
// URLs have to live on the same host as the sitemap file itself, or Google
// rejects the sitemap. Confirmed live host: www.secretmenubuilder.com
const SITE_URL = "https://www.secretmenubuilder.com";

// One entry per real URL on the site. Keep this in sync with public/sitemap.xml.
const routes = [
  {
    url: "/",
    title: "Secret Menu Builder | Build Your Hidden Menu Order",
    description:
      "Build your exact secret menu order for the West Coast burger chain you love. Pick your patties, cheese, bun style, toppings, fries, and drink — get the exact words to say at the window.",
  },
  {
    url: "/blog",
    title: "The Secret Menu Blog | Secret Menu Builder",
    description:
      "Guides, deep dives, and ordering tips for the hidden menu: Animal Style, the Flying Dutchman, secret drinks, and more.",
  },
  {
    url: "/blog/animal-style-explained",
    title: "Animal Style, Explained: What's Actually in It and How to Order It Right",
    description:
      "It's the most famous secret menu item in fast food. Here's exactly what goes into it, why mustard-grilled patties taste different, and the best way to order it.",
  },
  {
    url: "/blog/flying-dutchman-guide",
    title: "The Flying Dutchman: The Ultimate Low-Carb Order Hidden in Plain Sight",
    description:
      "Two patties. Two slices of cheese. No bun, no lettuce, no tomato. The Flying Dutchman is the simplest and most misunderstood item on the hidden menu.",
  },
  {
    url: "/blog/secret-drinks-guide",
    title: "Every Secret Drink You Can Order: Floats, Neapolitan Shakes, Arnold Palmers and More",
    description:
      "The shakes are made with real ice cream. The sodas are standard. But combine them in the right way and you unlock a drink menu that most customers don't know exists.",
  },
  {
    url: "/about",
    title: "About This Site | Secret Menu Builder",
    description:
      "An independent fan-built tool for exploring the hidden menu. Not affiliated with, endorsed by, or connected to any restaurant chain.",
  },
  {
    url: "/privacy",
    title: "Privacy Policy | Secret Menu Builder",
    description: "Privacy policy for Secret Menu Builder, including information on advertising and cookies.",
  },
];

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function main() {
  if (!fs.existsSync(ssrEntry)) {
    console.error(`SSR bundle not found at ${ssrEntry}. Run the SSR build step first.`);
    process.exit(1);
  }
  if (!fs.existsSync(distDir)) {
    console.error(`Client build not found at ${distDir}. Run "vite build" first.`);
    process.exit(1);
  }

  const { render } = await import(pathToFileUrl(ssrEntry));
  const template = fs.readFileSync(path.join(distDir, "index.html"), "utf-8");

  for (const route of routes) {
    const appHtml = render(route.url);

    let html = template;

    // Swap in per-page <title>
    html = html.replace(/<title>.*?<\/title>/s, `<title>${escapeHtml(route.title)}</title>`);

    // Swap in per-page meta description
    html = html.replace(
      /<meta name="description" content=".*?" \/>/s,
      `<meta name="description" content="${escapeHtml(route.description)}" />`
    );

    // Add canonical link right after description if not already present
    const canonicalTag = `<link rel="canonical" href="${SITE_URL}${route.url === "/" ? "/" : route.url}" />`;
    if (!html.includes('rel="canonical"')) {
      html = html.replace(
        /<meta name="description" content=".*?" \/>/s,
        (match) => `${match}\n    ${canonicalTag}`
      );
    }

    // Inject the prerendered app markup into the root div
    html = html.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);

    const outDir =
      route.url === "/" ? distDir : path.join(distDir, route.url.replace(/^\//, ""));
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, "index.html"), html);
    console.log(`Prerendered ${route.url} -> ${path.relative(root, path.join(outDir, "index.html"))}`);
  }

  // Clean up the intermediate SSR bundle; it's not needed in the deployed output.
  fs.rmSync(path.join(root, "dist-ssr"), { recursive: true, force: true });
}

function pathToFileUrl(p) {
  return "file://" + p.replace(/\\/g, "/");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
