<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useData } from "vitepress";

interface LinkGraphData {
    backlinks: Record<string, string[]>;
    titles: Record<string, string>;
}

const { page } = useData();
const isOpen = ref(false);
const linkGraphData = ref<LinkGraphData | null>(null);
const loading = ref(true);

const currentPath = computed(() => {
    // Normalize the current page path to match our graph format
    let path = page.value.relativePath
        .replace(/\.md$/, "")
        .replace(/\/index$/, "");

    if (!path || path === "index") {
        return "/";
    }

    return "/" + path;
});

const backlinks = computed(() => {
    if (!linkGraphData.value) return [];

    const links = linkGraphData.value.backlinks[currentPath.value] || [];

    return links.map((link) => ({
        url: link,
        title: linkGraphData.value!.titles[link] || link,
    }));
});

const backlinkCount = computed(() => backlinks.value.length);

onMounted(async () => {
    try {
        const response = await fetch("/link-graph.json");
        if (response.ok) {
            linkGraphData.value = await response.json();
        }
    } catch (error) {
        console.error("Failed to load link graph:", error);
    } finally {
        loading.value = false;
    }
});

function toggleOpen() {
    isOpen.value = !isOpen.value;
}
</script>

<template>
    <div class="backlinks-container" v-if="!loading">
        <div class="backlinks-wrapper" :class="{ 'is-open': isOpen }">
            <button
                class="backlinks-header"
                @click="toggleOpen"
                :aria-expanded="isOpen"
                aria-controls="backlinks-content"
            >
                <span class="backlinks-title">
                    <svg
                        class="backlinks-icon"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <path
                            d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
                        ></path>
                        <path
                            d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
                        ></path>
                    </svg>
                    Backlinks
                </span>
                <span class="backlinks-actions">
                    <span class="backlinks-count">{{ backlinkCount }}</span>
                    <svg
                        class="backlinks-chevron"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </span>
            </button>

            <div id="backlinks-content" class="backlinks-content">
                <div class="backlinks-content-inner">
                    <ul v-if="backlinkCount > 0" class="backlinks-list">
                        <li
                            v-for="link in backlinks"
                            :key="link.url"
                            class="backlinks-item"
                        >
                            <a :href="link.url" class="backlinks-link">
                                {{ link.title }}
                            </a>
                        </li>
                    </ul>
                    <p v-else class="backlinks-empty">No backlinks found</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.backlinks-container {
    /*margin-top: 102px;*/
    padding: 24px 0px;
    border-top: 1px solid var(--vp-c-divider);
}

.backlinks-wrapper {
    border: 1px solid var(--vp-c-divider);
    border-radius: 8px;
    background: var(--vp-c-bg-soft);
    transition:
        border-color 0.25s,
        box-shadow 0.25s;
}

.backlinks-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 10px 16px;
    background: transparent;
    border: none;
    color: var(--vp-c-text-1);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: color 0.25s;
}

.backlinks-header:hover {
    color: var(--vp-c-brand-1);
}

.backlinks-title {
    display: flex;
    align-items: center;
    gap: 8px;
}

.backlinks-icon {
    color: var(--vp-c-text-2);
    transition: color 0.25s;
}

.backlinks-header:hover .backlinks-icon {
    color: var(--vp-c-brand-1);
}

.backlinks-actions {
    display: flex;
    align-items: center;
    gap: 8px;
}

.backlinks-count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
    height: 20px;
    padding: 0 6px;
    background: var(--vp-c-default-soft);
    border-radius: 10px;
    color: var(--vp-c-text-2);
    font-size: 12px;
    font-weight: 600;
    line-height: 1;
}

.backlinks-chevron {
    color: var(--vp-c-text-3);
    transition:
        transform 0.25s ease,
        color 0.25s;
    flex-shrink: 0;
}

.backlinks-wrapper.is-open .backlinks-chevron {
    transform: rotate(180deg);
}

.backlinks-header:hover .backlinks-chevron {
    color: var(--vp-c-brand-1);
}

.backlinks-content {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.3s ease;
    overflow: hidden;
}

.backlinks-wrapper.is-open .backlinks-content {
    grid-template-rows: 1fr;
}

.backlinks-content-inner {
    min-height: 0;
    overflow: hidden;
}

.backlinks-list {
    list-style: none;
    padding: 0 12px 12px 12px;
    margin: 0;
}

.backlinks-item {
    margin: 0;
    padding: 0;
}

.backlinks-item + .backlinks-item {
    margin-top: 4px;
}

.backlinks-link {
    display: block;
    padding: 8px 12px;
    color: var(--vp-c-text-1);
    text-decoration: none;
    border-radius: 6px;
    transition:
        color 0.25s,
        background-color 0.25s;
    font-size: 14px;
    line-height: 1.5;
}

.backlinks-link:hover {
    color: var(--vp-c-brand-1);
    background: var(--vp-c-default-soft);
}

.backlinks-empty {
    padding: 12px 16px;
    margin: 0;
    color: var(--vp-c-text-3);
    font-size: 14px;
    font-style: italic;
}
</style>
