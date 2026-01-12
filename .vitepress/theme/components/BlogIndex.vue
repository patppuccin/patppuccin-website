<!-- .vitepress/theme/components/BlogIndex.vue -->
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';

interface BlogPost {
  url: string;
  title: string;
  author: string;
  date: string;
  cover: string | null;
  excerpt: string;
  tags: string[];
}

const posts = ref<BlogPost[]>([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const response = await fetch('/blog-posts.json');
    if (response.ok) {
      posts.value = await response.json();
    }
  } catch (error) {
    console.error('Failed to load blog posts:', error);
  } finally {
    loading.value = false;
  }
});

const featuredPost = computed(() => posts.value[0] || null);
const recentPosts = computed(() => posts.value.slice(1, 10)); // Next 9 posts

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
</script>

<template>
  <div class="blog-index">
    <div v-if="loading" class="loading">Loading posts...</div>

    <div v-else-if="posts.length === 0" class="no-posts">
      No blog posts yet. Check back soon!
    </div>

    <div v-else class="blog-content">
      <!-- Featured Post -->
      <a v-if="featuredPost" :href="featuredPost.url" class="featured-post">
        <div class="featured-cover">
          <img v-if="featuredPost.cover" :src="featuredPost.cover" :alt="featuredPost.title" class="cover-image" />
          <div v-else class="cover-placeholder">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
        </div>
        <div class="featured-content">
          <div class="featured-badge">Latest Post</div>
          <h2 class="featured-title">{{ featuredPost.title }}</h2>
          <p v-if="featuredPost.excerpt" class="featured-excerpt">
            {{ featuredPost.excerpt }}
          </p>
          <div class="featured-meta">
            <span class="author">{{ featuredPost.author }}</span>
            <span class="date">{{ formatDate(featuredPost.date) }}</span>
          </div>
          <div v-if="featuredPost.tags?.length" class="tags">
            <span v-for="tag in featuredPost.tags" :key="tag" class="tag">
              {{ tag }}
            </span>
          </div>
        </div>
      </a>

      <!-- Recent Posts Grid -->
      <div v-if="recentPosts.length > 0" class="recent-section">
        <h3 class="section-title">Recent Posts</h3>
        <div class="posts-grid">
          <a v-for="post in recentPosts" :key="post.url" :href="post.url" class="post-card">
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
  </div>
</template>

<style scoped>
.blog-index {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 0;
}

.loading,
.no-posts {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--vp-c-text-2);
}

.blog-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Featured Post */
.featured-post {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
  background: var(--vp-c-bg-soft);
  transition: border-color 0.2s, background-color 0.2s;
  text-decoration: none;
}

.featured-post:hover {
  border-color: var(--vp-c-brand-2);
  background: var(--vp-c-bg);
}

.featured-cover {
  width: 100%;
  height: 100%;
  /* Remove aspect-ratio - let it fill the grid cell */
  background: var(--vp-c-bg-soft);
  display: flex;
  align-items: center;
  justify-content: center;
}

.featured-cover .cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0;
}

.featured-cover .cover-placeholder {
  color: var(--vp-c-text-3);
}

.featured-content {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.featured-badge {
  display: inline-block;
  width: fit-content;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--vp-c-brand);
  background: var(--vp-c-brand-soft);
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

.featured-title {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.2;
  margin: 0 0 0.5rem 0;
  color: var(--vp-c-text-1);
}

.featured-excerpt {
  font-size: 0.9rem;
  line-height: 1.5;
  color: var(--vp-c-text-2);
  margin: 0 0 0.75rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.featured-meta {
  display: flex;
  gap: 0.75rem;
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  margin-bottom: 0.5rem;
}

.featured-meta span:not(:last-child)::after {
  content: '•';
  margin-left: 0.75rem;
  color: var(--vp-c-text-3);
}

/* Recent Posts */
.recent-section {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.section-title {
  font-size: 1.35rem;
  font-weight: 600;
  margin: 0;
  color: var(--vp-c-text-1);
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.25rem;
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
  height: 160px;
  overflow: hidden;
  background: var(--vp-c-bg-soft);
  display: flex;
  align-items: center;
  justify-content: center;
}

.post-cover .cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0;
}

.post-cover .cover-placeholder {
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
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: var(--vp-c-text-1);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-meta {
  display: flex;
  gap: 0.75rem;
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
}

.post-meta span:not(:last-child)::after {
  content: '•';
  margin-left: 0.75rem;
  color: var(--vp-c-text-3);
}

.tags {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
  margin-top: 0;
}

.tag {
  background: var(--vp-c-default-soft);
  padding: 0.15rem 0.5rem;
  border-radius: 10px;
  font-size: 0.65rem;
  color: var(--vp-c-text-2);
}

/* Responsive */
@media (max-width: 968px) {
  .featured-post {
    grid-template-columns: 1fr;
  }

  .featured-cover {
    aspect-ratio: 16 / 9;
    /* Add aspect-ratio back for mobile */
  }

  .featured-title {
    font-size: 1.3rem;
  }
}

@media (max-width: 640px) {
  .posts-grid {
    grid-template-columns: 1fr;
  }
}
</style>