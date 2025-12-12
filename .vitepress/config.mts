import { defineConfig } from "vitepress";
import {
  groupIconMdPlugin,
  groupIconVitePlugin,
} from "vitepress-plugin-group-icons";
import { withSidebar } from "vitepress-sidebar";
import { resolve } from "node:path";
import marrkdownItDefn from "./plugins/markdownDefinitions.ts";
import { generateLinkGraph } from "./utils/generateGraph.ts";
import { generateDefinitions } from "./utils/generateDefinitions.ts";

const srcDirConfig = "content";
const R2_BASE = process.env.R2_BASE_URL || "https://cdn.patppuccin.calm";
const ATTACHMENTS_BASE = /\(\/Appendix\/([^)\s]+)\)/g;

const navBarConfig = [
  {
    text: "Studio",
    items: [
      { text: "Expeditions", link: "/Studio/Expeditions/" },
      { text: "Curations", link: "/Studio/Curations/" },
      { text: "Ruminations", link: "/Studio/Ruminations/" },
    ],
  },
  {
    text: "Workshop",
    items: [
      { text: "Labs", link: "/Workshop/Labs/" },
      { text: "Projects", link: "/Workshop/Projects/" },
    ],
  },
  { text: "Persona", link: "/about" },
];

const socialLinksConfig = [
  {
    icon: "gmail",
    link: "mailto:hey@patrickambrose.com",
    ariaLabel: "Email",
  },
  {
    icon: "github",
    link: "https://github.com/patppuccin",
    ariaLabel: "GitHub",
  },
  {
    icon: "linkedin",
    link: "https://www.linkedin.com/in/pat-ambrose",
    ariaLabel: "LinkedIn",
  },
  {
    icon: "googleearth",
    link: "https://www.patrickambrose.com",
    ariaLabel: "Website",
  },
];

const sidebarConfig = [
  {
    documentRootPath: "content",
    scanStartPath: "Studio/Expeditions",
    basePath: "/Studio/Expeditions/",
    resolvePath: "/Studio/Expeditions/",
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
    scanStartPath: "Studio/Curations",
    basePath: "/Studio/Curations/",
    resolvePath: "/Studio/Curations/",
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
    scanStartPath: "Workshop/Labs",
    basePath: "/Workshop/Labs/",
    resolvePath: "/Workshop/Labs/",
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
    scanStartPath: "Workshop/Projects",
    basePath: "/Workshop/Projects/",
    resolvePath: "/Workshop/Projects/",
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
      md.use(marrkdownItDefn);
    },
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
            (_match, filename) => `(${R2_BASE}/${filename})`,
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
generateLinkGraph(srcPath);
generateDefinitions(srcPath);

// Export Config for VitePress
export default defineConfig(withSidebar(vitePressConfig, sidebarConfig));
