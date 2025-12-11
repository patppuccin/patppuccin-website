// https://vitepress.dev/guide/custom-theme
import { h } from "vue";
import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import "./styles/custom.css";
import "virtual:group-icons.css";

import CopyMarkdown from "./components/CopyMarkdown.vue";
import ContactForm from "./components/ContactForm.vue";
import Backlinks from "./components/Backlinks.vue";
import LinkPreview from "./components/LinkPreview.vue";

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(LinkPreview, null, {
      default: () =>
        h(DefaultTheme.Layout, null, {
          "doc-before": () => h(CopyMarkdown),
          "doc-footer-before": () => h(Backlinks),
        }),
    });
  },
  enhanceApp({ app, router, siteData }) {
    // ...
    app.component("CopyMarkdown", CopyMarkdown);
    app.component("ContactForm", ContactForm);
    app.component("Backlinks", Backlinks);
    app.component("LinkPreview", LinkPreview); // Optional: register globally
  },
} satisfies Theme;
