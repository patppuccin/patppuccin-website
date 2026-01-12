import {
  writeFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
} from "fs";
import { resolve, join, relative, parse, sep } from "path";
import matter from "gray-matter";
import MarkdownIt from "markdown-it";
import natural from "natural";

const TfIdf = natural.TfIdf;
const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
});

// ================================
// TYPES
// ================================

interface MarkdownFile {
  path: string;
  url: string;
  slug: string;
  title: string;
  frontmatter: Record<string, any>;
  content: string;
  rawContent: string;
}

interface LinkGraph {
  backlinks: Record<string, string[]>;
  titles: Record<string, string>;
}

interface Definition {
  aliases: string[];
  content: string;
  readMoreLink?: {
    text: string;
    url: string;
  };
}

interface BlogPost {
  url: string;
  title: string;
  author: string;
  date: string;
  cover: string | null;
  excerpt: string;
  tags: string[];
}

interface BlogRelated {
  [slug: string]: {
    related: Array<{
      url: string;
      title: string;
      author: string;
      date: string;
      cover: string | null;
      excerpt: string;
    }>;
  };
}

interface ProcessingStats {
  totalFiles: number;
  blogPosts: number;
  definitions: number;
  backlinks: number;
  related: number;
}

// ================================
// CONFIGURATION
// ================================

const CONFIG = {
  definitions: {
    allowedPrefixes: ["definitions", "glossary", "terms", "concepts"],
    allowedTags: new Set(["p", "strong", "em", "code", "ul", "li", "br", "hr"]),
    maxLength: 400,
    readMorePattern: /^read more:\s*\[([^\]]+)\]\(([^)]+)\)\s*$/im,
  },
  blog: {
    directory: "Ruminations",
    weights: {
      tfidf: 0.55,
      tags: 0.35,
      recency: 0.1,
    },
    relatedCount: 3,
    recencyWindow: 90, // days
  },
};

// ================================
// MAIN FUNCTION
// ================================

export function generateMeta(srcPath: string): void {
  const startTime = Date.now();

  printHeader("Content Metadata Generation");

  const contentDir = srcPath;
  const publicDir = join(contentDir, "public");

  // Validate
  if (!existsSync(contentDir)) {
    printError(`Content directory missing: ${contentDir}`);
    return;
  }

  // Ensure public directory exists
  if (!existsSync(publicDir)) {
    mkdirSync(publicDir, { recursive: true });
  }

  // Read all markdown files once
  printStep("Scanning markdown files");
  const files = readAllMarkdownFiles(contentDir);

  if (files.length === 0) {
    printWarning("No markdown files found");
    return;
  }

  printInfo(`Found ${files.length} markdown files`);

  const stats: ProcessingStats = {
    totalFiles: files.length,
    blogPosts: 0,
    definitions: 0,
    backlinks: 0,
    related: 0,
  };

  // Generate all metadata
  printStep("Generating link graph");
  const linkGraph = generateLinkGraph(files, contentDir);
  stats.backlinks = Object.keys(linkGraph.backlinks).length;
  writeOutput(publicDir, "link-graph.json", linkGraph);

  printStep("Extracting definitions");
  const definitions = generateDefinitions(files, contentDir);
  stats.definitions = Object.keys(definitions).length;
  writeOutput(publicDir, "definitions.json", definitions);

  printStep("Computing blog relationships");
  const blogRelated = generateBlogRelated(files, contentDir);
  stats.related = Object.keys(blogRelated).length;
  stats.blogPosts = stats.related;
  writeOutput(publicDir, "blog-related.json", blogRelated);

  printStep("Generating blog posts list");
  const blogPosts = generateBlogPostsList(files, contentDir);
  writeOutput(publicDir, "blog-posts.json", blogPosts);

  // Summary
  const elapsed = Date.now() - startTime;
  printSummary(stats, elapsed);
}

// ================================
// FILE READING
// ================================

function readAllMarkdownFiles(dir: string): MarkdownFile[] {
  const files: MarkdownFile[] = [];

  function walk(currentDir: string) {
    try {
      const entries = readdirSync(currentDir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = join(currentDir, entry.name);

        if (entry.isDirectory()) {
          walk(fullPath);
        } else if (entry.isFile() && entry.name.endsWith(".md")) {
          try {
            const raw = readFileSync(fullPath, "utf-8");
            const { data: frontmatter, content } = matter(raw);

            const url = filePathToUrl(fullPath, dir);
            const slug = url.split("/").pop() || "";
            const title = frontmatter.title || getFileNameAsTitle(fullPath);

            files.push({
              path: fullPath,
              url,
              slug,
              title,
              frontmatter,
              content: extractTextContent(content),
              rawContent: content,
            });
          } catch (error) {
            printWarning(`Failed to parse: ${entry.name}`);
          }
        }
      }
    } catch (error) {
      printError(`Failed to read directory: ${currentDir}`);
    }
  }

  walk(dir);
  return files;
}

// ================================
// LINK GRAPH GENERATION
// ================================

function generateLinkGraph(
  files: MarkdownFile[],
  contentDir: string
): LinkGraph {
  const linkGraph: Record<string, string[]> = {};
  const pageTitles: Record<string, string> = {};

  // Collect titles
  for (const file of files) {
    pageTitles[file.url] = file.title;
  }

  // Build forward links
  for (const file of files) {
    const links = extractMarkdownLinks(file.rawContent, file.path, contentDir);
    linkGraph[file.url] = links;
  }

  // Invert to create backlinks
  const backlinks: Record<string, string[]> = {};

  for (const [sourcePage, targetPages] of Object.entries(linkGraph)) {
    for (const targetPage of targetPages) {
      if (!backlinks[targetPage]) {
        backlinks[targetPage] = [];
      }
      if (!backlinks[targetPage].includes(sourcePage)) {
        backlinks[targetPage].push(sourcePage);
      }
    }
  }

  return { backlinks, titles: pageTitles };
}

function extractMarkdownLinks(
  content: string,
  sourceFilePath: string,
  contentDir: string
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

    const sourceDir = parse(sourceFilePath).dir;
    let targetPath = resolve(sourceDir, linkPath);
    targetPath = targetPath.split("#")[0];

    if (!targetPath.startsWith(contentDir)) {
      continue;
    }

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

    if (existsSync(actualTargetPath)) {
      links.push(filePathToUrl(actualTargetPath, contentDir));
    }
  }

  return [...new Set(links)];
}

// ================================
// DEFINITIONS GENERATION
// ================================

function generateDefinitions(
  files: MarkdownFile[],
  contentDir: string
): Record<string, Definition> {
  const definitions: Record<string, Definition> = {};

  // Filter definition files
  const defFiles = files.filter((f) => {
    const baseName = parse(f.path).name.toLowerCase();
    return CONFIG.definitions.allowedPrefixes.some((p) =>
      baseName.startsWith(p)
    );
  });

  for (const file of defFiles) {
    extractDefinitionsFromFile(file, definitions);
  }

  return definitions;
}

function extractDefinitionsFromFile(
  file: MarkdownFile,
  definitions: Record<string, Definition>
): void {
  const normalized = file.rawContent.replace(/\r\n/g, "\n");
  const regex = /^######\s+(.+?)\s*\n([\s\S]*?)(?=^######\s+|\Z)/gm;
  const matches = [...normalized.matchAll(regex)];

  for (const match of matches) {
    const heading = match[1].trim();
    let body = match[2].trim();

    if (!heading || !body) continue;

    body = body.replace(/^---\s*$/gm, "").trim();
    if (!body) continue;

    const { term: canonical, aliases } = parseHeading(heading);

    if (definitions[canonical]) {
      continue; // Skip duplicates
    }

    const { content: cleanedBody, readMoreLink } = extractReadMore(body);
    const rendered = md.render(cleanedBody);

    const definition: Definition = {
      aliases,
      content: truncateHTML(rendered, CONFIG.definitions.maxLength),
    };

    if (readMoreLink) {
      definition.readMoreLink = readMoreLink;
    }

    definitions[canonical] = definition;
  }
}

function parseHeading(heading: string): { term: string; aliases: string[] } {
  const aliasMatch = heading.match(/\(([^)]+)\)\s*$/);

  if (!aliasMatch) {
    return { term: heading.trim(), aliases: [] };
  }

  const aliasStr = aliasMatch[1];
  const aliases = aliasStr
    .split(",")
    .map((a) => a.trim())
    .filter(Boolean);

  const canonical = heading.replace(/\([^)]+\)\s*$/, "").trim();

  return { term: canonical, aliases };
}

function extractReadMore(body: string): {
  content: string;
  readMoreLink?: { text: string; url: string };
} {
  const lines = body.split("\n");
  const readMoreLines: number[] = [];

  for (let i = 0; i < lines.length; i++) {
    if (CONFIG.definitions.readMorePattern.test(lines[i])) {
      readMoreLines.push(i);
    }
  }

  if (readMoreLines.length === 0) {
    return { content: body };
  }

  const lastIndex = readMoreLines[readMoreLines.length - 1];
  const readMoreLine = lines[lastIndex];
  const match = readMoreLine.match(CONFIG.definitions.readMorePattern);

  if (!match) {
    return { content: body };
  }

  const linkText = match[1].trim();
  const linkUrl = match[2].trim();

  if (!validateReadMoreUrl(linkUrl)) {
    const contentLines = lines.slice(0, lastIndex);
    return { content: contentLines.join("\n").trim() };
  }

  const contentLines = lines.slice(0, lastIndex);
  return {
    content: contentLines.join("\n").trim(),
    readMoreLink: { text: linkText, url: linkUrl },
  };
}

function validateReadMoreUrl(url: string): boolean {
  return (
    url.startsWith("/") ||
    url.startsWith("./") ||
    url.startsWith("../") ||
    url.startsWith("http://") ||
    url.startsWith("https://")
  );
}

function truncateHTML(html: string, maxLength: number): string {
  if (html.length <= maxLength) {
    return html;
  }

  let truncated = html.slice(0, maxLength);
  const lastClosingTag = truncated.lastIndexOf("</");
  const lastOpeningTag = truncated.lastIndexOf("<");

  if (lastOpeningTag > lastClosingTag) {
    truncated = truncated.slice(0, lastOpeningTag);
  }

  return truncated.trim() + "...";
}

// ================================
// BLOG RELATED GENERATION
// ================================

function generateBlogRelated(
  files: MarkdownFile[],
  contentDir: string
): BlogRelated {
  // Filter blog posts
  const blogPosts = files.filter(
    (f) =>
      f.url.startsWith(`/${CONFIG.blog.directory}/`) &&
      f.slug !== "index" &&
      f.frontmatter.blog !== false
  );

  if (blogPosts.length === 0) {
    return {};
  }

  // Compute TF-IDF
  const tfidf = new TfIdf();

  blogPosts.forEach((post) => {
    const tags = post.frontmatter.tags || [];
    const text = `${post.title} ${post.title} ${post.title} ${
      post.content
    } ${tags.join(" ")}`;
    tfidf.addDocument(text);
  });

  const blogRelated: BlogRelated = {};

  blogPosts.forEach((post, idx) => {
    const related: Array<{ post: MarkdownFile; score: number }> = [];

    tfidf.tfidfs(post.content, (i: number, tfidfScore: number) => {
      if (i !== idx) {
        let score = tfidfScore * CONFIG.blog.weights.tfidf;

        const otherPost = blogPosts[i];
        const postTags = (post.frontmatter.tags || []) as string[];
        const otherTags = (otherPost.frontmatter.tags || []) as string[];
        const sharedTags = intersection(postTags, otherTags);
        score += sharedTags.length * CONFIG.blog.weights.tags;

        const daysDiff =
          Math.abs(
            new Date(post.frontmatter.date || Date.now()).getTime() -
              new Date(otherPost.frontmatter.date || Date.now()).getTime()
          ) /
          (1000 * 60 * 60 * 24);
        const recencyBoost =
          Math.max(
            0,
            (CONFIG.blog.recencyWindow - daysDiff) / CONFIG.blog.recencyWindow
          ) * CONFIG.blog.weights.recency;
        score += recencyBoost;

        related.push({ post: otherPost, score });
      }
    });

    const topRelated = related
      .sort((a, b) => b.score - a.score)
      .slice(0, CONFIG.blog.relatedCount)
      .map(({ post }) => ({
        url: post.url,
        title: post.title,
        author: post.frontmatter.author || "Patrick Ambrose",
        date: post.frontmatter.date || new Date().toISOString(),
        cover: post.frontmatter.cover || null,
        excerpt: post.frontmatter.description || "",
      }));

    blogRelated[post.slug] = { related: topRelated };
  });

  return blogRelated;
}

function generateBlogPostsList(
  files: MarkdownFile[],
  contentDir: string
): BlogPost[] {
  const blogPosts = files.filter(
    (f) =>
      f.url.startsWith(`/${CONFIG.blog.directory}/`) &&
      f.slug !== "index" &&
      f.frontmatter.blog !== false
  );

  return blogPosts
    .map((post) => ({
      url: post.url,
      title: post.title,
      author: post.frontmatter.author || "Patrick Ambrose",
      date: post.frontmatter.date || new Date().toISOString(),
      cover: post.frontmatter.cover || null,
      excerpt: post.frontmatter.description || "",
      tags: (post.frontmatter.tags || []) as string[],
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// ================================
// UTILITY FUNCTIONS
// ================================

function filePathToUrl(filePath: string, contentDir: string): string {
  const rel = relative(contentDir, filePath);
  const withoutExt = rel.replace(/\.md$/, "");
  let urlPath = withoutExt.split(sep).join("/");

  if (urlPath.endsWith("/index")) {
    urlPath = urlPath.replace(/\/index$/, "");
  }

  if (!urlPath.startsWith("/")) {
    urlPath = "/" + urlPath;
  }

  if (urlPath === "/index" || urlPath === "") {
    urlPath = "/";
  }

  return urlPath;
}

function getFileNameAsTitle(filePath: string): string {
  const { name } = parse(filePath);

  if (name === "index") {
    const parts = filePath.split(sep);
    const dirName = parts[parts.length - 2] || "Home";
    return formatTitle(dirName);
  }

  return formatTitle(name);
}

function formatTitle(str: string): string {
  return str
    .replace(/[-_]/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function extractTextContent(content: string): string {
  return content
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]+`/g, "")
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1")
    .replace(/[#*_~]/g, "")
    .replace(/\n+/g, " ")
    .trim();
}

function intersection<T>(arr1: T[], arr2: T[]): T[] {
  return arr1.filter((item) => arr2.includes(item));
}

function writeOutput(dir: string, filename: string, data: any): void {
  const path = join(dir, filename);
  writeFileSync(path, JSON.stringify(data, null, 2), "utf-8");
}

// ================================
// CONSOLE OUTPUT (Clean & Minimal)
// ================================

const COLORS = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  blue: "\x1b[34m",
};

function printHeader(title: string): void {
  console.log(`\n${COLORS.bright}${COLORS.cyan}▸ ${title}${COLORS.reset}`);
}

function printStep(message: string): void {
  console.log(`${COLORS.dim}  ├─ ${message}...${COLORS.reset}`);
}

function printInfo(message: string): void {
  console.log(`${COLORS.dim}  │  ${message}${COLORS.reset}`);
}

function printWarning(message: string): void {
  console.log(`${COLORS.yellow}  │  ⚠ ${message}${COLORS.reset}`);
}

function printError(message: string): void {
  console.log(`${COLORS.red}  │  ✖ ${message}${COLORS.reset}`);
}

function printSummary(stats: ProcessingStats, elapsed: number): void {
  console.log(
    `${COLORS.dim}  └─ ${COLORS.reset}${COLORS.green}✓ Complete${COLORS.reset} ${COLORS.dim}(${elapsed}ms)${COLORS.reset}`
  );
  console.log(
    `${COLORS.dim}     Files: ${stats.totalFiles} | Backlinks: ${stats.backlinks} | Definitions: ${stats.definitions} | Blog posts: ${stats.blogPosts}${COLORS.reset}\n`
  );
}
