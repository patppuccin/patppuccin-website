// https://vitepress.dev/guide/custom-theme
import { h } from "vue";
import type { Theme } from "vitepress";
import { useData } from "vitepress";
import DefaultTheme from "vitepress/theme";
import "./styles/custom.css";
import "virtual:group-icons.css";

import DocHeader from "./partials/DocHeader.vue";
import DocFooter from "./partials/DocFooter.vue";
import DefinitionsPreview from "./components/DefinitionsPreview.vue";
import ContactForm from "./components/ContactForm.vue";
import BlogIndex from "./components/BlogIndex.vue";

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      "doc-before": () => h(DocHeader),
      "doc-footer-before": () => h(DocFooter),
      "layout-bottom": () => h(DefinitionsPreview),
    });
  },
  enhanceApp({ app, router, siteData }) {
    app.component("BlogIndex", BlogIndex);
    app.component("ContactForm", ContactForm);
  },
} satisfies Theme;

// export default {
//   extends: DefaultTheme,
//   Layout: () => {
//     return h(LinkPreview, null, {
//       default: () =>
//         h(DefaultTheme.Layout, null, {
//           "doc-before": () => h(DocHeader),
//           "doc-footer-before": () => h(DocFooter),
//         }),
//     });
//   },
//   enhanceApp({ app, router, siteData }) {
//     app.component("ContactForm", ContactForm);
//   },
// } satisfies Theme;
