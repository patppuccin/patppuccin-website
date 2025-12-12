import type MarkdownIt from "markdown-it";

/**
 * Markdown-it plugin to transform ==Term== into:
 * <dfn class="definition-term" data-term="Term">Term</dfn>
 */
export default function markdownItDfn(md: MarkdownIt) {
  const dfnRegex = /==([^=\n]+)==/g;

  function transformDefinitions(state: any) {
    const tokens = state.tokens;

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];

      if (token.type !== "inline") continue;

      const children = token.children || [];

      const containsCode = children.some(
        (child: any) => child.type === "code_inline",
      );
      if (containsCode) continue;

      for (let j = 0; j < children.length; j++) {
        const child = children[j];

        if (child.type !== "text") continue;

        const text: string = child.content;

        if (!dfnRegex.test(text)) {
          dfnRegex.lastIndex = 0;
          continue;
        }

        dfnRegex.lastIndex = 0;

        const replaced = text.replace(dfnRegex, (_, termRaw) => {
          const term = termRaw.trim();
          return `<dfn class="definition-term" data-term="${term}">${term}</dfn>`;
        });

        child.type = "html_inline";
        child.content = replaced;
      }
    }
  }

  md.core.ruler.after("inline", "definition_transform", transformDefinitions);
}
