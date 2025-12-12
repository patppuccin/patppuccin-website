import {
  writeFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
} from "fs";
import { join } from "path";
import MarkdownIt from "markdown-it";
import grayMatter from "gray-matter";

const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
});

// -------------------------------
// CONFIG
// -------------------------------
const ALLOWED_FILE_NAME_PREFIXES = [
  "definitions",
  "glossary",
  "terms",
  "concepts",
];
const ALLOWED_TAGS = new Set([
  "p",
  "strong",
  "em",
  "code",
  "ul",
  "li",
  "br",
  "hr",
]);
const MAX_LENGTH = 400;
const READ_MORE_PATTERN = /^read more:\s*\[([^\]]+)\]\(([^)]+)\)\s*$/im;

// -------------------------------
// TYPES
// -------------------------------
interface ReadMoreLink {
  text: string;
  url: string;
}

interface Definition {
  aliases: string[];
  content: string;
  readMoreLink?: ReadMoreLink;
}

interface ValidationWarnings {
  unsupportedTags: string[];
  tooLong: string[];
  duplicates: string[];
  aliasConflicts: Array<{ alias: string; conflictsWith: string }>;
  invalidReadMoreUrls: Array<{ term: string; url: string }>;
  multipleReadMore: string[];
}

// -------------------------------
// MAIN FUNCTION
// -------------------------------
export function generateDefinitions(srcPath: string): void {
  console.log("\n📚 Generating definitions...");

  const contentDir = srcPath;
  const publicDir = join(contentDir, "public");
  const outputPath = join(publicDir, "definitions.json");

  // Validate input directory
  if (!existsSync(contentDir)) {
    console.error(` 🔴 Content directory missing: ${contentDir}`);
    return;
  }

  // Ensure public directory exists
  if (!existsSync(publicDir)) {
    mkdirSync(publicDir, { recursive: true });
  }

  // Find all definition files
  const mdFiles = getDefinitionFiles(contentDir);

  if (mdFiles.length === 0) {
    console.log(" ⏩ No definition files found, skipping.");
    return;
  }

  console.log(` 🔍 Found ${mdFiles.length} definition file(s), extracting...`);

  const definitions: Record<string, Definition> = {};
  const warnings: ValidationWarnings = {
    unsupportedTags: [],
    tooLong: [],
    duplicates: [],
    aliasConflicts: [],
    invalidReadMoreUrls: [],
    multipleReadMore: [],
  };

  // Process each file
  for (const filePath of mdFiles) {
    processDefinitionFile(filePath, definitions, warnings);
  }

  // Validate cross-term conflicts
  validateAliasConflicts(definitions, warnings);

  // Write output
  writeFileSync(outputPath, JSON.stringify(definitions, null, 2), "utf-8");

  // Print summary
  printSummary(outputPath, definitions, warnings);
}

// -------------------------------
// FILE PROCESSING
// -------------------------------
function getDefinitionFiles(dir: string): string[] {
  const files: string[] = [];

  function walk(currentDir: string): void {
    const entries = readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(currentDir, entry.name);

      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) {
        const baseName = entry.name.toLowerCase();
        if (ALLOWED_FILE_NAME_PREFIXES.some((p) => baseName.startsWith(p))) {
          files.push(fullPath);
        }
      }
    }
  }

  walk(dir);
  return files;
}

function processDefinitionFile(
  filePath: string,
  definitions: Record<string, Definition>,
  warnings: ValidationWarnings,
): void {
  const raw = readFileSync(filePath, "utf-8");

  // Strip frontmatter
  const { content } = grayMatter(raw);

  // Normalize line endings
  const normalized = content.replace(/\r\n/g, "\n");

  // Extract definition blocks
  // Match everything from ###### heading until the next ###### or --- separator or end
  const regex = /^######\s+(.+?)\s*\n([\s\S]*?)(?=^######\s+|\Z)/gm;
  const matches = [...normalized.matchAll(regex)];

  for (const match of matches) {
    const heading = match[1].trim();
    let body = match[2].trim();

    if (!heading || !body) continue;

    // Remove any stray horizontal rules
    body = body.replace(/^---\s*$/gm, "").trim();

    if (!body) continue;

    // Parse term and aliases
    const { term: canonical, aliases } = parseHeading(heading);

    // Check for duplicates
    if (definitions[canonical]) {
      warnings.duplicates.push(canonical);
      continue;
    }

    // Extract "Read More:" link if present
    const { content: cleanedBody, readMoreLink } = extractReadMore(
      body,
      canonical,
      warnings,
    );

    // Debug: Show raw body for first term
    if (canonical === "Authentication") {
      console.log("\n🔍 Debug - Raw body for Authentication:");
      console.log(`"${body}"`);
      console.log("\n🔍 Body length:", body.length);
      console.log("🔍 Contains 'Read More':", body.includes("Read More"));
    }

    // Render markdown to HTML
    const rendered = md.render(cleanedBody);

    // Validate HTML tags
    const hasUnsupportedTags = detectUnsupportedTags(rendered);
    if (hasUnsupportedTags) {
      warnings.unsupportedTags.push(canonical);
    }

    // Check length and truncate if necessary
    const isTooLong = rendered.length > MAX_LENGTH;
    if (isTooLong) {
      warnings.tooLong.push(canonical);
    }

    // Store definition
    const definition: Definition = {
      aliases: aliases,
      content: truncateHTML(rendered, MAX_LENGTH),
    };

    if (readMoreLink) {
      definition.readMoreLink = readMoreLink;
    }

    definitions[canonical] = definition;
  }
}

// -------------------------------
// PARSING HELPERS
// -------------------------------
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

function extractReadMore(
  body: string,
  term: string,
  warnings: ValidationWarnings,
): { content: string; readMoreLink?: ReadMoreLink } {
  // Split body into lines
  const lines = body.split("\n");

  // Debug: Log lines for the first term to see what we're working with
  if (term === "Authentication") {
    console.log("\n🔍 Debug - Authentication body lines:");
    lines.forEach((line, i) => {
      console.log(`   Line ${i}: "${line}"`);
      console.log(`   Matches pattern: ${READ_MORE_PATTERN.test(line)}`);
    });
  }

  // Find all "Read More:" lines
  const readMoreLines: number[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (READ_MORE_PATTERN.test(lines[i])) {
      readMoreLines.push(i);
    }
  }

  // No "Read More:" found
  if (readMoreLines.length === 0) {
    return { content: body };
  }

  // Multiple "Read More:" found - warn and use last one
  if (readMoreLines.length > 1) {
    warnings.multipleReadMore.push(term);
  }

  // Get the last "Read More:" line
  const lastReadMoreIndex = readMoreLines[readMoreLines.length - 1];
  const readMoreLine = lines[lastReadMoreIndex];

  // Extract link from "Read More:" line
  const match = readMoreLine.match(READ_MORE_PATTERN);

  if (!match) {
    // This shouldn't happen due to the test above, but safety check
    return { content: body };
  }

  const linkText = match[1].trim();
  const linkUrl = match[2].trim();

  // Validate URL
  const isValidUrl = validateReadMoreUrl(linkUrl);
  if (!isValidUrl) {
    warnings.invalidReadMoreUrls.push({ term, url: linkUrl });
    // Invalid URL - remove "Read More:" line but don't include link
    const contentLines = lines.slice(0, lastReadMoreIndex);
    return { content: contentLines.join("\n").trim() };
  }

  // Valid URL - extract and remove "Read More:" section
  const contentLines = lines.slice(0, lastReadMoreIndex);
  const cleanedContent = contentLines.join("\n").trim();

  return {
    content: cleanedContent,
    readMoreLink: {
      text: linkText,
      url: linkUrl,
    },
  };
}

function validateReadMoreUrl(url: string): boolean {
  // Allow internal links starting with /
  if (url.startsWith("/")) {
    return true;
  }

  // Allow relative paths (./ and ../)
  if (url.startsWith("./") || url.startsWith("../")) {
    return true;
  }

  // Allow http and https URLs
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return true;
  }

  // Reject javascript:, data:, and other dangerous protocols
  return false;
}

// -------------------------------
// VALIDATION HELPERS
// -------------------------------
function detectUnsupportedTags(html: string): boolean {
  const tagRegex = /<\/?([a-zA-Z0-9-]+)(?:\s+[^>]*)?>/g;
  const matches = [...html.matchAll(tagRegex)];

  for (const match of matches) {
    const tag = match[1].toLowerCase();
    if (!ALLOWED_TAGS.has(tag)) {
      return true;
    }
  }

  return false;
}

function validateAliasConflicts(
  definitions: Record<string, Definition>,
  warnings: ValidationWarnings,
): void {
  const allTerms = new Set(Object.keys(definitions));

  for (const [term, def] of Object.entries(definitions)) {
    for (const alias of def.aliases) {
      if (allTerms.has(alias) && alias !== term) {
        warnings.aliasConflicts.push({
          alias,
          conflictsWith: term,
        });
      }
    }
  }
}

// -------------------------------
// CONTENT PROCESSING
// -------------------------------
function truncateHTML(html: string, maxLength: number): string {
  if (html.length <= maxLength) {
    return html;
  }

  let truncated = html.slice(0, maxLength);

  // Find last complete tag before cutoff
  const lastClosingTag = truncated.lastIndexOf("</");
  const lastOpeningTag = truncated.lastIndexOf("<");

  // If we cut in the middle of a tag, truncate before it
  if (lastOpeningTag > lastClosingTag) {
    truncated = truncated.slice(0, lastOpeningTag);
  }

  return truncated.trim() + "...";
}

// -------------------------------
// OUTPUT & LOGGING
// -------------------------------
function printSummary(
  outputPath: string,
  definitions: Record<string, Definition>,
  warnings: ValidationWarnings,
): void {
  const totalEntries = Object.keys(definitions).length;
  const withReadMore = Object.values(definitions).filter(
    (d) => d.readMoreLink,
  ).length;

  console.log(`\n✅ Definitions generated at ${outputPath}`);
  console.log(`   ├─ 📄 Total entries: ${totalEntries}`);
  console.log(`   ├─ 🔗 With "Read More": ${withReadMore}`);
  console.log(`   ╰─ 📁 Output: public/definitions.json`);

  // Print warnings
  if (warnings.duplicates.length > 0) {
    console.log("\n⚠️  Duplicate terms found (first occurrence kept):");
    warnings.duplicates.forEach((term, i) => {
      const prefix = i === warnings.duplicates.length - 1 ? "╰─" : "├─";
      console.log(`   ${prefix} 📄 ${term}`);
    });
  }

  if (warnings.multipleReadMore.length > 0) {
    console.log('\n⚠️  Multiple "Read More:" found (using last occurrence):');
    warnings.multipleReadMore.forEach((term, i) => {
      const prefix = i === warnings.multipleReadMore.length - 1 ? "╰─" : "├─";
      console.log(`   ${prefix} 📄 ${term}`);
    });
  }

  if (warnings.invalidReadMoreUrls.length > 0) {
    console.log('\n⚠️  Invalid "Read More:" URLs (link removed):');
    warnings.invalidReadMoreUrls.forEach((item, i) => {
      const prefix =
        i === warnings.invalidReadMoreUrls.length - 1 ? "╰─" : "├─";
      console.log(`   ${prefix} 📄 ${item.term} → ${item.url}`);
    });
  }

  if (warnings.unsupportedTags.length > 0) {
    console.log("\n⚠️  Definitions with unsupported HTML tags:");
    warnings.unsupportedTags.forEach((term, i) => {
      const prefix = i === warnings.unsupportedTags.length - 1 ? "╰─" : "├─";
      console.log(`   ${prefix} 📄 ${term}`);
    });
  }

  if (warnings.tooLong.length > 0) {
    console.log("\n📏 Definitions exceeding length limit (truncated):");
    warnings.tooLong.forEach((term, i) => {
      const prefix = i === warnings.tooLong.length - 1 ? "╰─" : "├─";
      console.log(`   ${prefix} 📄 ${term}`);
    });
  }

  if (warnings.aliasConflicts.length > 0) {
    console.log("\n⚠️  Alias conflicts with canonical terms:");
    warnings.aliasConflicts.forEach((conflict, i) => {
      const prefix = i === warnings.aliasConflicts.length - 1 ? "╰─" : "├─";
      console.log(
        `   ${prefix} 📄 "${conflict.alias}" (from term "${conflict.conflictsWith}")`,
      );
    });
  }

  if (
    warnings.duplicates.length === 0 &&
    warnings.multipleReadMore.length === 0 &&
    warnings.invalidReadMoreUrls.length === 0 &&
    warnings.unsupportedTags.length === 0 &&
    warnings.tooLong.length === 0 &&
    warnings.aliasConflicts.length === 0
  ) {
    console.log("\n✨ No warnings - all definitions are valid!");
  }
}
