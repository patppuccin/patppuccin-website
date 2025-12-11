<script setup>
import { useData } from "vitepress";
import { ref, computed } from "vue";

const { page, frontmatter } = useData();
const copied = ref(false);

// Convert HTML back to approximate markdown
function htmlToMarkdown(html) {
    const div = document.createElement("div");
    div.innerHTML = html;

    // Remove script tags and other non-content elements
    div.querySelectorAll("script, style").forEach((el) => el.remove());

    return div.innerText;
}

// Reconstruct markdown from available data
function getMarkdownContent() {
    let markdown = "";

    // Add frontmatter if it exists
    if (frontmatter.value && Object.keys(frontmatter.value).length > 0) {
        markdown += "---\n";
        for (const [key, value] of Object.entries(frontmatter.value)) {
            if (typeof value === "string") {
                markdown += `${key}: ${value}\n`;
            } else {
                markdown += `${key}: ${JSON.stringify(value)}\n`;
            }
        }
        markdown += "---\n\n";
    }

    // Add title if available
    if (page.value.title && page.value.title !== frontmatter.value?.title) {
        markdown += `# ${page.value.title}\n\n`;
    }

    // Get the main content
    // VitePress provides the rendered HTML in page.value.content
    // We'll try to get the text content from the DOM instead
    const mainContent = document.querySelector(".vp-doc");
    if (mainContent) {
        // Clone to avoid modifying the actual page
        const clone = mainContent.cloneNode(true);

        // Remove UI elements that shouldn't be in markdown
        clone
            .querySelectorAll(".header-anchor, .VPBadge")
            .forEach((el) => el.remove());

        // Convert headings
        clone.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach((heading) => {
            const level = heading.tagName[1];
            const text = heading.textContent.trim();
            const hashes = "#".repeat(parseInt(level));
            const span = document.createElement("span");
            span.textContent = `\n${hashes} ${text}\n\n`;
            heading.replaceWith(span);
        });

        // Convert code blocks
        clone.querySelectorAll("pre code").forEach((code) => {
            const lang = code.className.match(/language-(\w+)/)?.[1] || "";
            const text = code.textContent;
            const span = document.createElement("span");
            span.textContent = `\n\`\`\`${lang}\n${text}\n\`\`\`\n\n`;
            code.closest("pre").replaceWith(span);
        });

        // Convert inline code
        clone.querySelectorAll("code").forEach((code) => {
            const span = document.createElement("span");
            span.textContent = `\`${code.textContent}\``;
            code.replaceWith(span);
        });

        // Convert links
        clone.querySelectorAll("a").forEach((link) => {
            const span = document.createElement("span");
            span.textContent = `[${link.textContent}](${link.href})`;
            link.replaceWith(span);
        });

        // Convert bold
        clone.querySelectorAll("strong, b").forEach((el) => {
            const span = document.createElement("span");
            span.textContent = `**${el.textContent}**`;
            el.replaceWith(span);
        });

        // Convert italic
        clone.querySelectorAll("em, i").forEach((el) => {
            const span = document.createElement("span");
            span.textContent = `*${el.textContent}*`;
            el.replaceWith(span);
        });

        // Convert lists
        clone.querySelectorAll("ul, ol").forEach((list) => {
            const items = Array.from(list.querySelectorAll("li"));
            const isOrdered = list.tagName === "OL";
            const listText = items
                .map((item, i) => {
                    const prefix = isOrdered ? `${i + 1}.` : "-";
                    return `${prefix} ${item.textContent.trim()}`;
                })
                .join("\n");
            const span = document.createElement("span");
            span.textContent = `\n${listText}\n\n`;
            list.replaceWith(span);
        });

        // Convert paragraphs
        clone.querySelectorAll("p").forEach((p) => {
            const span = document.createElement("span");
            span.textContent = `${p.textContent.trim()}\n\n`;
            p.replaceWith(span);
        });

        markdown += clone.textContent.trim();
    } else if (page.value.content) {
        // Fallback to raw content if available
        markdown += page.value.content;
    }

    return markdown;
}

async function copyAsMarkdown() {
    try {
        const markdown = getMarkdownContent();
        await navigator.clipboard.writeText(markdown);
        copied.value = true;
        setTimeout(() => (copied.value = false), 2000);
    } catch (err) {
        console.error("Failed to copy:", err);
        alert("Failed to copy markdown. Please try again.");
    }
}
</script>

<template>
    <button
        @click="copyAsMarkdown"
        class="copy-markdown-btn"
        :class="{ copied }"
        title="Copy page content as Markdown for LLMs"
    >
        <span v-if="!copied">
            <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
            >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path
                    d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
                ></path>
            </svg>
            Copy as Markdown
        </span>
        <span v-else>
            <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
            >
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Copied to clipboard!
        </span>
    </button>
</template>

<style scoped>
.copy-markdown-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 7px 12px;
    margin-bottom: 16px;
    background: var(--vp-c-bg-alt);
    border: 1px solid var(--vp-c-bg-soft);
    border-radius: 10px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
    color: var(--vp-c-text-1);
    transition: all 0.2s;
    font-family: var(--vp-font-family-base);
    margin-left: auto;
}

.copy-markdown-btn:hover {
    background: var(--vp-c-bg-elv);
    border: 1px solid var(--vp-c-bg-soft);
    color: var(--vp-c-brand-1);
}

.copy-markdown-btn:active {
    transform: translateY(1px);
}

.copy-markdown-btn.copied {
    background: var(--vp-c-bg-elv);
    border: 1px solid var(--vp-c-bg-soft);
    color: var(--vp-c-success-1);
}

.copy-markdown-btn span {
    display: flex;
    align-items: center;
    gap: 6px;
}

.copy-markdown-btn svg {
    flex-shrink: 0;
}
</style>
