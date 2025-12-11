import {
  writeFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
} from "fs";
import { resolve, join, relative, parse, sep } from "path";
import matter from "gray-matter";

export function generateLinkGraph(srcPath: string) {
  console.log("\n 📦 Generating link graph...");

  const contentDir = srcPath;
  const publicDir = join(contentDir, "public");

  // Validate content directory exists
  if (!existsSync(contentDir)) {
    console.log(` 🔴 Content directory missing (check srcDir): ${contentDir}`);
    return;
  }

  // Ensure public directory exists
  if (!existsSync(publicDir)) {
    mkdirSync(publicDir, { recursive: true });
  }

  // Get all markdown files
  console.log(` 📂 Scanning markdown files in: ${contentDir}`);
  const mdFiles = getAllMarkdownFiles(contentDir);

  if (mdFiles.length === 0) {
    console.log(` ⏩ Skipping parsing, no md files found at: ${contentDir}`);
    return;
  }

  console.log(` ⭐ Found ${mdFiles.length} md files for processing...`);

  const linkGraph: Record<string, string[]> = {};
  const pageTitles: Record<string, string> = {};

  // First pass: collect all page titles from frontmatter
  for (const filePath of mdFiles) {
    try {
      const content = readFileSync(filePath, "utf-8");
      const { data: frontmatter } = matter(content);

      const urlPath = filePathToUrl(filePath, contentDir);
      pageTitles[urlPath] = frontmatter.title || getFileNameAsTitle(filePath);
    } catch (error) {
      console.log(` 🟡 Failed to parse ${filePath}:`, "warn");
    }
  }

  // Second pass: build the forward link graph
  for (const filePath of mdFiles) {
    try {
      const content = readFileSync(filePath, "utf-8");
      const { content: markdownContent } = matter(content);

      const urlPath = filePathToUrl(filePath, contentDir);
      const links = extractMarkdownLinks(markdownContent, filePath, contentDir);

      linkGraph[urlPath] = links;
    } catch (error) {
      console.log(` 🟡 Failed to parse ${filePath}:`, "warn");
    }
  }

  // Invert to create backlinks graph
  const backlinksGraph: Record<string, string[]> = {};

  for (const [sourcePage, targetPages] of Object.entries(linkGraph)) {
    for (const targetPage of targetPages) {
      if (!backlinksGraph[targetPage]) {
        backlinksGraph[targetPage] = [];
      }
      if (!backlinksGraph[targetPage].includes(sourcePage)) {
        backlinksGraph[targetPage].push(sourcePage);
      }
    }
  }

  // Write to public folder (VitePress will copy to dist)
  const outputPath = join(publicDir, "link-graph.json");
  const output = {
    backlinks: backlinksGraph,
    titles: pageTitles,
  };

  try {
    writeFileSync(outputPath, JSON.stringify(output, null, 2));
    console.log(` ✅ Graph generated at ${outputPath}`);
    console.log(`    ├─ 📄 Pages     : ${Object.keys(pageTitles).length}`);
    console.log(`    ╰─ 🔗 Backlinks : ${Object.keys(backlinksGraph).length}`);
  } catch (error) {
    console.log(" 🟡 Failed to write link graph:");
  }
}

function getAllMarkdownFiles(dir: string): string[] {
  const files: string[] = [];

  function walk(currentDir: string) {
    try {
      const entries = readdirSync(currentDir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = join(currentDir, entry.name);

        if (entry.isDirectory()) {
          walk(fullPath);
        } else if (entry.isFile() && entry.name.endsWith(".md")) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      console.log(` 🔴 Failed to read directory: ${currentDir}`);
    }
  }

  walk(dir);
  return files;
}

function filePathToUrl(filePath: string, contentDir: string): string {
  // Get relative path from content directory
  const rel = relative(contentDir, filePath);

  // Remove .md extension
  const withoutExt = rel.replace(/\.md$/, "");

  // Convert to URL format (handle Windows paths)
  let urlPath = withoutExt.split(sep).join("/");

  // Handle index files
  if (urlPath.endsWith("/index")) {
    urlPath = urlPath.replace(/\/index$/, "");
  }

  // Ensure leading slash
  if (!urlPath.startsWith("/")) {
    urlPath = "/" + urlPath;
  }

  // Handle root index
  if (urlPath === "/index" || urlPath === "") {
    urlPath = "/";
  }

  return urlPath;
}

function extractMarkdownLinks(
  content: string,
  sourceFilePath: string,
  contentDir: string,
): string[] {
  const links: string[] = [];

  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;

  for (const match of content.matchAll(linkRegex)) {
    const linkPath = match[2];

    // Skip external links and anchors
    if (
      linkPath.startsWith("http") ||
      linkPath.startsWith("#") ||
      linkPath.startsWith("//")
    ) {
      continue;
    }

    // Resolve the link relative to the source file
    const sourceDir = parse(sourceFilePath).dir;
    let targetPath = resolve(sourceDir, linkPath);

    // Remove anchor fragments
    targetPath = targetPath.split("#")[0];

    // Ensure link is inside content directory
    if (!targetPath.startsWith(contentDir)) {
      continue;
    }

    // Normalize: ensure we end up with a valid markdown file path
    let actualTargetPath = targetPath;

    if (!actualTargetPath.endsWith(".md")) {
      if (existsSync(actualTargetPath + ".md")) {
        actualTargetPath = actualTargetPath + ".md";
      } else if (existsSync(join(actualTargetPath, "index.md"))) {
        actualTargetPath = join(actualTargetPath, "index.md");
      } else {
        continue;
      }
    }

    // Convert to URL path and collect
    if (existsSync(actualTargetPath)) {
      links.push(filePathToUrl(actualTargetPath, contentDir));
    }
  }

  return [...new Set(links)];
}

function getFileNameAsTitle(filePath: string): string {
  const { name } = parse(filePath);

  if (name === "index") {
    // Use parent directory name
    const parts = filePath.split(sep);
    const dirName = parts[parts.length - 2] || "Home";
    return formatTitle(dirName);
  }

  return formatTitle(name);
}

function formatTitle(str: string): string {
  // Convert kebab-case, snake_case, or space-separated to Title Case
  return str
    .replace(/[-_]/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
