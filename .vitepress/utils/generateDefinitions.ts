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

// -------------------------------
// TYPES
// -------------------------------
interface Definition {
  aliases: string[];
  content: string;
}

interface ValidationWarnings {
  unsupportedTags: string[];
  tooLong: string[];
  duplicates: string[];
  aliasConflicts: Array<{ alias: string; conflictsWith: string }>;
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
    console.error(`🔴 Content directory missing: ${contentDir}`);
    return;
  }

  // Ensure public directory exists
  if (!existsSync(publicDir)) {
    mkdirSync(publicDir, { recursive: true });
  }

  // Find all definition files
  const mdFiles = getDefinitionFiles(contentDir);

  if (mdFiles.length === 0) {
    console.log("⏩ No definition files found, skipping.");
    return;
  }

  console.log(`⭐ Found ${mdFiles.length} definition file(s)`);
  console.log("🔍 Extracting definitions...");

  const definitions: Record<string, Definition> = {};
  const warnings: ValidationWarnings = {
    unsupportedTags: [],
    tooLong: [],
    duplicates: [],
    aliasConflicts: [],
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
        if (baseName.startsWith("definitions")) {
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
  // Matches: ###### Term (aliases)\n content \n (until next ###### or --- or EOF)
  const regex = /^######\s+(.+?)\s*\n([\s\S]*?)(?=^######\s+|^---\s*$|\n*$)/gm;
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
      continue; // Skip duplicate, keep first occurrence
    }

    // Render markdown to HTML
    const rendered = md.render(body);

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
    definitions[canonical] = {
      aliases: aliases,
      content: truncateHTML(rendered, MAX_LENGTH),
    };
  }
}

// -------------------------------
// PARSING HELPERS
// -------------------------------
function parseHeading(heading: string): { term: string; aliases: string[] } {
  // Match the last parentheses group
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
      // Check if alias conflicts with another canonical term
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

  // Simple truncation with tag awareness
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

  console.log(`\n✅ Definitions generated at ${outputPath}`);
  console.log(`   ├─ 📄 Entries: ${totalEntries}`);
  console.log(`   ╰─ 📁 Output: public/definitions.json`);

  // Print warnings
  if (warnings.duplicates.length > 0) {
    console.log("\n⚠️  Duplicate terms found (first occurrence kept):");
    warnings.duplicates.forEach((term, i) => {
      const prefix = i === warnings.duplicates.length - 1 ? "╰─" : "├─";
      console.log(`   ${prefix} 📄 ${term}`);
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
    warnings.unsupportedTags.length === 0 &&
    warnings.tooLong.length === 0 &&
    warnings.aliasConflicts.length === 0
  ) {
    console.log("\n✨ No warnings - all definitions are valid!");
  }
}
