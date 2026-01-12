<!-- .vitepress/theme/partials/DocHeader.vue -->
<script setup lang="ts">
import { useData } from "vitepress";
import { computed, onMounted, ref } from "vue";
import CopyMarkdown from "../components/CopyMarkdown.vue";

const { frontmatter } = useData();

const isBlog = computed(() => frontmatter.value.blog === true);
const showHeader = computed(() => frontmatter.value.noBanner !== true);
const readingTime = ref(0);

// Calculate reading time from the actual rendered content
onMounted(() => {
  if (isBlog.value) {
    const contentEl = document.querySelector('.vp-doc');
    if (contentEl) {
      const text = contentEl.textContent || '';
      const words = text.split(/\s+/).length;
      readingTime.value = Math.ceil(words / 200);
    }
  }
});

const formattedDate = computed(() => {
  if (!frontmatter.value.publishDate) return "";
  return new Date(frontmatter.value.publishDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});
</script>

<template>
  <!-- Full header with all features -->
  <div v-if="showHeader" class="doc-header">
    <!-- Cover Image (Blog only) -->
    <div v-if="isBlog && frontmatter.cover" class="cover-wrapper">
      <img
        :src="frontmatter.cover"
        :alt="frontmatter.title"
        class="cover-image"
      />
      <div class="copy-button-overlay">
        <CopyMarkdown />
      </div>
    </div>

    <div class="header-content">
      <!-- Title and Copy Button Row -->
      <div class="title-row">
        <h1 v-if="frontmatter.title" class="doc-title">
          {{ frontmatter.title }}
        </h1>
        <div v-if="!isBlog || !frontmatter.cover" class="copy-button-inline">
          <CopyMarkdown />
        </div>
      </div>

      <!-- Meta Info -->
      <div v-if="isBlog || frontmatter.publishDate" class="meta-info">
        <span v-if="isBlog && frontmatter.author" class="author">
          By {{ frontmatter.author }}
        </span>
        <span v-if="frontmatter.publishDate" class="date">
          {{ formattedDate }}
        </span>
        <span v-if="isBlog && readingTime > 0" class="reading-time">
          {{ readingTime }} min read
        </span>
      </div>

      <!-- Tags (Blog only) -->
      <div
        v-if="isBlog && frontmatter.tags && frontmatter.tags.length"
        class="tags"
      >
        <span v-for="tag in frontmatter.tags" :key="tag" class="tag">
          {{ tag }}
        </span>
      </div>
    </div>
  </div>

  <!-- Minimal header when noBanner is true - just show the title -->
  <div v-else-if="frontmatter.title" class="doc-header-minimal">
    <h1 class="doc-title-minimal">{{ frontmatter.title }}</h1>
  </div>
</template>

<style scoped>
.doc-header {
  margin-bottom: 2rem;
}

.cover-wrapper {
  position: relative;
  margin-bottom: 1.5rem;
}

.cover-image {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 8px;
  display: block;
}

.copy-button-overlay {
  position: absolute;
  top: 1rem;
  right: 1rem;
}

.title-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
}

.doc-title {
  flex: 1;
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.2;
  margin: 0;
  color: var(--vp-c-text-1);
}

.copy-button-inline {
  flex-shrink: 0;
  margin-top: 0.25rem;
}

/* Responsive: prevent button from overlapping title on small screens */
@media (max-width: 768px) {
  .title-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .copy-button-inline {
    align-self: flex-end;
    margin-top: 0.75rem;
  }

  .doc-title {
    font-size: 2rem; /* Slightly smaller title on mobile */
  }
}

.meta-info {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.meta-info span:not(:last-child)::after {
  content: "•";
  margin-left: 1rem;
  color: var(--vp-c-text-3);
}

.tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  background: var(--vp-c-default-soft);
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  transition: background 0.2s;
}

.tag:hover {
  background: var(--vp-c-default);
}

.doc-header-minimal {
  margin-bottom: 2rem;
}

.doc-title-minimal {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.2;
  margin: 0;
  color: var(--vp-c-text-1);
}

@media (max-width: 768px) {
  .doc-title-minimal {
    font-size: 2rem;
  }
}
</style>
