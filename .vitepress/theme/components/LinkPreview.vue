<template>
    <div class="link-preview-container">
        <slot />

        <Teleport to="body">
            <Transition name="preview-fade">
                <div
                    v-if="showPreview && previewData"
                    ref="previewRef"
                    class="link-preview-popup"
                    :style="{ left: `${position.x}px`, top: `${position.y}px` }"
                    @mouseenter="handlePreviewEnter"
                    @mouseleave="handlePreviewLeave"
                >
                    <div class="preview-content">
                        <h3 class="preview-title">{{ previewData.title }}</h3>

                        <p
                            v-if="previewData.description"
                            class="preview-description"
                        >
                            {{ previewData.description }}
                        </p>
                    </div>
                </div>
            </Transition>
        </Teleport>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { useData, useRouter } from "vitepress";

const router = useRouter();
const { page } = useData();

const showPreview = ref(false);
const previewData = ref(null);
const previewRef = ref(null);
const position = ref({ x: 0, y: 0 });

let hoverTimeout = null;
let contentRoot = null;

const findContentRoot = () => {
    // VitePress doc content appears in one of these depending on theme version
    return (
        document.querySelector(".vp-doc") ||
        document.querySelector(".vp-content") ||
        null
    );
};

const calculatePosition = (el) => {
    const rect = el.getBoundingClientRect();
    const previewWidth = 320;
    const previewHeight = 200;

    let x = rect.left + rect.width / 2 - previewWidth / 2;
    let y = rect.bottom + 10;

    if (x + previewWidth > window.innerWidth - 20)
        x = window.innerWidth - previewWidth - 20;

    if (x < 20) x = 20;

    if (y + previewHeight > window.innerHeight - 20)
        y = rect.top - previewHeight - 10;

    return { x, y };
};

const fetchPageData = async (href) => {
    try {
        let base = href.replace(/\.md$/, "");
        let url = base.endsWith("/") ? `${base}index.html` : `${base}.html`;

        let res = await fetch(url);
        if (!res.ok) res = await fetch(`${base}/index.html`);
        if (!res.ok) return null;

        const html = await res.text();
        const doc = new DOMParser().parseFromString(html, "text/html");

        let title =
            doc.querySelector("title")?.textContent.split("|")[0].trim() ||
            doc.querySelector("h1")?.textContent?.trim() ||
            "";

        const description =
            doc.querySelector('meta[name="description"]')?.content || "";

        if (!title && !description) return null;

        return { title: title || "Untitled", description };
    } catch {
        return null;
    }
};

const handleLinkHover = (e) => {
    if (!contentRoot || !contentRoot.contains(e.target)) return;

    const link = e.target.closest("a");
    if (!link) return;

    const href = link.getAttribute("href");
    if (!href || href.startsWith("http") || href.startsWith("#")) return;

    clearTimeout(hoverTimeout);

    hoverTimeout = setTimeout(async () => {
        const data = await fetchPageData(href);
        if (data) {
            previewData.value = data;
            position.value = calculatePosition(link);
            showPreview.value = true;
        }
    }, 300);
};

const handleLinkLeave = () => {
    clearTimeout(hoverTimeout);
    hoverTimeout = setTimeout(() => {
        showPreview.value = false;
    }, 200);
};

const attachListeners = () => {
    detachListeners();

    contentRoot = findContentRoot();
    if (!contentRoot) return;

    contentRoot.addEventListener("mouseover", handleLinkHover);
    contentRoot.addEventListener("mouseout", handleLinkLeave);
};

const detachListeners = () => {
    if (!contentRoot) return;
    contentRoot.removeEventListener("mouseover", handleLinkHover);
    contentRoot.removeEventListener("mouseout", handleLinkLeave);
};

onMounted(() => {
    // Initial attach
    setTimeout(attachListeners, 50); // allow DOM to settle
});

// Re-attach whenever route changes
watch(
    () => page.value.relativePath,
    () => {
        setTimeout(attachListeners, 50);
    },
);

onBeforeUnmount(() => {
    detachListeners();
    clearTimeout(hoverTimeout);
});
</script>

<style scoped>
.link-preview-container {
    position: relative;
}

/* popup */
.link-preview-popup {
    position: fixed;
    z-index: 9999;
    width: 320px;
    pointer-events: auto;
}

/* card */
.preview-content {
    background-color: var(--vp-c-bg-soft);
    border-radius: 8px;
    box-shadow: var(--vp-shadow-3);
    border: 1px solid var(--vp-c-divider);
    padding: 16px;
}

/* text */
.preview-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--vp-c-text-1);
    margin: 0 0 12px 0;
    line-height: 1.4;
}

.preview-description {
    font-size: 14px;
    font-weight: 500;
    color: var(--vp-c-text-2);
    margin: 0;
    line-height: 1.6;
}

/* fade transition */
.preview-fade-enter-active,
.preview-fade-leave-active {
    transition:
        opacity 0.2s var(--vp-t-easing),
        transform 0.2s var(--vp-t-easing);
}

.preview-fade-enter-from,
.preview-fade-leave-to {
    opacity: 0;
    transform: translateY(-4px);
}

.dark .preview-content {
    box-shadow: var(--vp-shadow-4);
}
</style>
