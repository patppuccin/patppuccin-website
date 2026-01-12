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
  let path = page.value.relativePath
    .replace(/\.md$/, "")
    .replace(/\/index$/, "");

  return !path || path === "index" ? "/" : "/" + path;
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
  <div v-if="!loading" class="backlinks">
    <div class="wrapper" :class="{ 'is-open': isOpen }">
      <button
        class="header"
        @click="toggleOpen"
        :aria-expanded="isOpen"
        aria-controls="backlinks-content"
      >
        <span class="title">
          <svg
            class="icon"
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
            />
            <path
              d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
            />
          </svg>
          Backlinks
        </span>
        <span class="actions">
          <span class="count">{{ backlinkCount }}</span>
          <svg
            class="chevron"
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
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>

      <div id="backlinks-content" class="content">
        <div class="content-inner">
          <ul v-if="backlinkCount > 0" class="list">
            <li v-for="link in backlinks" :key="link.url" class="item">
              <a :href="link.url" class="link">{{ link.title }}</a>
            </li>
          </ul>
          <p v-else class="empty">No backlinks found</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.backlinks {
  /* Container - no extra styles needed */
}

.wrapper {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  transition: border-color 0.25s, box-shadow 0.25s;
}

.header {
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

.header:hover {
  color: var(--vp-c-brand-1);
}

.title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon {
  color: var(--vp-c-text-2);
  transition: color 0.25s;
}

.header:hover .icon {
  color: var(--vp-c-brand-1);
}

.actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.count {
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

.chevron {
  color: var(--vp-c-text-3);
  transition: transform 0.25s ease, color 0.25s;
  flex-shrink: 0;
}

.wrapper.is-open .chevron {
  transform: rotate(180deg);
}

.header:hover .chevron {
  color: var(--vp-c-brand-1);
}

.content {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.3s ease;
  overflow: hidden;
}

.wrapper.is-open .content {
  grid-template-rows: 1fr;
}

.content-inner {
  min-height: 0;
  overflow: hidden;
}

.list {
  list-style: none;
  padding: 0 12px 12px 12px;
  margin: 0;
}

.item {
  margin: 0;
  padding: 0;
}

.item + .item {
  margin-top: 4px;
}

.link {
  display: block;
  padding: 8px 12px;
  color: var(--vp-c-text-1);
  text-decoration: none;
  border-radius: 6px;
  transition: color 0.25s, background-color 0.25s;
  font-size: 14px;
  line-height: 1.5;
}

.link:hover {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-default-soft);
}

.empty {
  padding: 12px 16px;
  margin: 0;
  color: var(--vp-c-text-3);
  font-size: 14px;
  font-style: italic;
}
</style>
