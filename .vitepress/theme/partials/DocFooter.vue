<!-- .vitepress/theme/partials/DocFooter.vue -->
<script setup lang="ts">
import { useData } from "vitepress";
import { computed, ref, onMounted } from "vue";
import Backlinks from "../components/Backlinks.vue";

// Add interface for related post type
interface RelatedPost {
  url: string;
  title: string;
  author: string;
  date: string;
  cover: string | null;
  excerpt: string;
}

const { frontmatter, page } = useData();
const isBlog = computed(() => frontmatter.value.blog === true);
const relatedPosts = ref<RelatedPost[]>([]);
const loading = ref(true);

// Get current post slug from URL
const currentSlug = computed(() => {
  const parts = page.value.relativePath.split("/");
  const filename = parts[parts.length - 1];
  return filename.replace(".md", "");
});

onMounted(async () => {
  if (isBlog.value) {
    try {
      const response = await fetch("/blog-related.json");
      if (response.ok) {
        const data = await response.json();
        const postData = data[currentSlug.value];
        if (postData && postData.related) {
          relatedPosts.value = postData.related;
        }
      }
    } catch (error) {
      console.error("Failed to load related posts:", error);
    } finally {
      loading.value = false;
    }
  } else {
    loading.value = false;
  }
});

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
</script>

<template>
  <div class="doc-footer">
    <div class="backlinks-section">
      <Backlinks />
    </div>

    <div v-if="isBlog && !loading && relatedPosts.length > 0" class="related-posts">
      <hr class="divider" />
      <h3>Related Posts</h3>
      <div class="posts-grid">
        <a v-for="post in relatedPosts" :key="post.url" :href="post.url" class="post-card">
          <!-- Cover Image (or placeholder) -->
          <div class="post-cover">
            <img v-if="post.cover" :src="post.cover" :alt="post.title" class="cover-image" />
            <div v-else class="cover-placeholder">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
          </div>

          <!-- Content -->
          <div class="post-content">
            <h4 class="post-title">{{ post.title }}</h4>
            <div class="post-meta">
              <span class="author">{{ post.author }}</span>
              <span class="date">{{ formatDate(post.date) }}</span>
            </div>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.doc-footer {
  padding-bottom: 24px;
}

.divider {
  border: none;
  border-top: 1px solid var(--vp-c-divider);
  margin: 0 0 24px 0;
}

.related-posts {
  padding-top: 24px;
}

.related-posts h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--vp-c-text-1);
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.post-card {
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background: transparent;
  overflow: hidden;
  transition: background-color 0.2s, border-color 0.2s;
  text-decoration: none;
}

.post-card:hover {
  border-color: var(--vp-c-brand-2);
  background: var(--vp-c-bg-soft);
}

.post-cover {
  width: 100%;
  height: 140px;
  overflow: hidden;
  background: var(--vp-c-bg-soft);
  display: flex;
  align-items: center;
  justify-content: center;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0;
}

.cover-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: var(--vp-c-text-3);
}

.post-content {
  padding: 1rem;
  flex: 1;
}

.post-title {
  font-size: 1rem;
  font-weight: 500;
  margin: 0 0 0.5rem 0;
  color: var(--vp-c-text-1);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  /* Add standard property */
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-meta {
  display: flex;
  gap: 0.75rem;
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
}

.post-meta span:not(:last-child)::after {
  content: "•";
  margin-left: 0.75rem;
  color: var(--vp-c-text-3);
}

/* Responsive: stack on mobile */
@media (max-width: 640px) {
  .posts-grid {
    grid-template-columns: 1fr;
  }
}
</style>
