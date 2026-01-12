import { defineConfig } from "vitepress";
import {
  groupIconMdPlugin,
  groupIconVitePlugin,
} from "vitepress-plugin-group-icons";
import { withSidebar } from "vitepress-sidebar";
import { resolve } from "node:path";
import parseDefinitions from "./utils/mdDefinitions.ts";
import { generateMeta } from "./utils/generateMeta.ts";

const srcDirConfig = "content";
const R2_BASE = process.env.R2_BASE_URL || "https://cdn.patppuccin.com";
const ATTACHMENTS_BASE = /\(\/Appendix\/([^)\s]+)\)/g;

const navBarConfig = [
  { text: "Atlas", link: "/Atlas/" },
  { text: "Expeditions", link: "/Expeditions/" },
  { text: "Ruminations", link: "/Ruminations/" },
  { text: "Workshop", link: "/Workshop/" },
];

const socialLinksConfig = [
  {
    icon: "linkedin",
    link: "https://www.linkedin.com/in/pat-ambrose",
    ariaLabel: "LinkedIn",
  },
  {
    icon: "github",
    link: "https://github.com/patppuccin",
    ariaLabel: "GitHub",
  },
];

const sidebarConfig = [
  {
    documentRootPath: "content",
    scanStartPath: "Expeditions",
    basePath: "/Expeditions/",
    resolvePath: "/Expeditions/",
    useTitleFromFrontmatter: true,
    collapsed: true,
    collapseDepth: 1,
    sortMenusByName: false,
    sortMenusByFrontmatterOrder: true,
    useFolderTitleFromIndexFile: true,
    useFolderLinkFromIndexFile: true,
    includeFolderIndexFile: false,
    hyphenToSpace: true,
    excludeByFolderDepth: 4,
    excludeFilesByFrontmatterFieldName: "exclude",
  },
  {
    documentRootPath: "content",
    scanStartPath: "Ruminations",
    basePath: "/Ruminations/",
    resolvePath: "/Ruminations/",
    useTitleFromFrontmatter: true,
    collapsed: true,
    collapseDepth: 1,
    sortMenusByName: false,
    sortMenusByFrontmatterOrder: true,
    useFolderTitleFromIndexFile: true,
    useFolderLinkFromIndexFile: true,
    includeFolderIndexFile: false,
    hyphenToSpace: true,
  },
  {
    documentRootPath: "content",
    scanStartPath: "Workshop",
    basePath: "/Workshop/",
    resolvePath: "/Workshop/",
    useTitleFromFrontmatter: true,
    collapsed: true,
    collapseDepth: 1,
    sortMenusByName: false,
    sortMenusByFrontmatterOrder: true,
    useFolderTitleFromIndexFile: true,
    useFolderLinkFromIndexFile: true,
    includeFolderIndexFile: false,
    hyphenToSpace: true,
  },
];

const vitePressConfig = defineConfig({
  srcDir: srcDirConfig,

  lang: "en-US",
  title: "Patppuccin",
  titleTemplate: "DevOps, Cloud & Open-Source",
  description: "Pat's platform to share his work, exploration, & thoughts.",
  sitemap: { hostname: "https://patppuccin.com" },
  ignoreDeadLinks: true,
  head: [
    ["link", { rel: "icon", href: "/favicon.ico" }],
    ["meta", { rel: "og:image", content: "/og-image.jpg" }],
  ],

  themeConfig: {
    logo: "/logo.png",
    siteTitle: "Patppuccin",
    search: { provider: "local" },
    outline: [2, 3],

    lastUpdated: {
      text: "Updated at",
      formatOptions: {
        dateStyle: "medium",
        timeStyle: "short",
      },
    },

    nav: navBarConfig,
    socialLinks: socialLinksConfig,
    footer: {
      message: "Made with ❤️ and <a href='https://vitepress.dev'>Vitepress</a>",
      copyright: `Copyright © ${new Date().getFullYear()} <a href="https://patrickambrose.com">Patrick Ambrose</a>.`,
    },
  },

  markdown: {
    theme: { light: "rose-pine-dawn", dark: "kanagawa-wave" },
    config(md) {
      md.use(groupIconMdPlugin);
      md.use(parseDefinitions);
    },
  },

  // Auto-apply layout for blog posts
  async transformPageData(pageData) {
    const isBlogPost =
      pageData.relativePath.startsWith("Ruminations/") &&
      pageData.relativePath !== "Ruminations/index.md";

    if (isBlogPost && !pageData.frontmatter.layout) {
      pageData.frontmatter.blog = true;
      if (!pageData.frontmatter.author) {
        pageData.frontmatter.author = "Patrick Ambrose";
      }
    }
  },

  vite: {
    plugins: [
      groupIconVitePlugin({
        customIcon: {
          ".mdx": "vscode-icons:file-type-light-mdx",
          ".terminal": "mynaui:terminal",
        },
      }),
      {
        name: "rewrite-attachment-urls",
        enforce: "pre",
        transform(code: string, id: string) {
          if (!id.endsWith(".md")) return;
          const rewritten = code.replace(
            ATTACHMENTS_BASE,
            (_match, filename) => `(${R2_BASE}/${filename})`
          );
          return rewritten;
        },
      },
    ],
  },
});

// Generate Link-Graph for Backlinks
const srcDir = vitePressConfig.srcDir ?? "content";
const srcPath = resolve(process.cwd(), srcDir);
generateMeta(srcPath);
// generateLinkGraph(srcPath);
// generateDefinitions(srcPath);

// Export Config for VitePress
export default defineConfig(withSidebar(vitePressConfig, sidebarConfig));
