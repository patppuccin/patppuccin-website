<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { useData } from "vitepress";

const { page } = useData();

// State
const showPreview = ref(false);
const previewData = ref(null);
const position = ref({ x: 0, y: 0 });

const isHoveringTerm = ref(false);
const isHoveringPopup = ref(false);

let hoverTimeout = null;
let contentRoot = null;
let definitions = null;

// Definitions loading
const loadDefinitions = async () => {
  if (definitions) return definitions;

  try {
    const res = await fetch("/definitions.json");
    definitions = await res.json();
  } catch {
    definitions = {};
  }

  return definitions;
};

const resolveDefinition = (term: string, defs: any) => {
  const clean = term.trim().toLowerCase();

  if (defs[term]) return { key: term, entry: defs[term] };

  for (const key in defs) {
    const entry = defs[key];
    if (entry.aliases?.some((a: string) => a.toLowerCase() === clean)) {
      return { key, entry };
    }
  }

  return null;
};

// DOM helpers
const findContentRoot = () =>
  document.querySelector(".vp-doc") ||
  document.querySelector(".vp-content") ||
  null;

const calculatePosition = (el: HTMLElement) => {
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

// Hide scheduling
const scheduleHide = () => {
  clearTimeout(hoverTimeout);
  hoverTimeout = setTimeout(() => {
    if (!isHoveringTerm.value && !isHoveringPopup.value) {
      showPreview.value = false;
    }
  }, 150);
};

// Popup hover handlers
const handlePopupEnter = () => {
  isHoveringPopup.value = true;
  clearTimeout(hoverTimeout);
};

const handlePopupLeave = () => {
  isHoveringPopup.value = false;
  scheduleHide();
};

// Definition hover handlers
const handleDefinitionHover = async (e: MouseEvent) => {
  if (!contentRoot || !contentRoot.contains(e.target as Node)) return;

  const termEl = (e.target as HTMLElement).closest(
    ".definition-term"
  ) as HTMLElement;
  if (!termEl) return;

  const rawTerm = termEl.dataset.term;
  if (!rawTerm) return;

  isHoveringTerm.value = true;
  clearTimeout(hoverTimeout);

  hoverTimeout = setTimeout(async () => {
    const defs = await loadDefinitions();
    const resolved = resolveDefinition(rawTerm, defs);
    if (!resolved) return;

    const { key, entry } = resolved;

    previewData.value = {
      title: key,
      content: entry.content || "",
      aliases: entry.aliases || [],
      readMore: entry.readMoreLink || null,
    };

    position.value = calculatePosition(termEl);
    showPreview.value = true;
  }, 200);
};

const handleDefinitionLeave = () => {
  isHoveringTerm.value = false;
  scheduleHide();
};

// Listener wiring
const attachListeners = () => {
  detachListeners();

  contentRoot = findContentRoot();
  if (!contentRoot) return;

  contentRoot.addEventListener(
    "mouseover",
    handleDefinitionHover as EventListener
  );
  contentRoot.addEventListener("mouseout", handleDefinitionLeave);
};

const detachListeners = () => {
  if (!contentRoot) return;

  contentRoot.removeEventListener(
    "mouseover",
    handleDefinitionHover as EventListener
  );
  contentRoot.removeEventListener("mouseout", handleDefinitionLeave);
};

onMounted(() => setTimeout(attachListeners, 50));

watch(
  () => page.value.relativePath,
  () => setTimeout(attachListeners, 50)
);

onBeforeUnmount(() => {
  detachListeners();
  clearTimeout(hoverTimeout);
});
</script>

<template>
  <Teleport to="body">
    <Transition name="preview-fade">
      <div
        v-if="showPreview && previewData"
        class="definition-preview-popup"
        :style="{ left: `${position.x}px`, top: `${position.y}px` }"
        @mouseenter="handlePopupEnter"
        @mouseleave="handlePopupLeave"
      >
        <div class="preview-content">
          <h3 class="preview-title">
            {{ previewData.title }}
          </h3>

          <div v-if="previewData.aliases?.length" class="aliases-container">
            <span class="alias-pill" v-for="a in previewData.aliases" :key="a">
              {{ a }}
            </span>
          </div>

          <p
            v-if="previewData.content"
            class="preview-description"
            v-html="previewData.content"
          ></p>

          <div v-if="previewData.readMore" class="read-more">
            <a :href="previewData.readMore.url" class="read-more-link">
              Read more →
            </a>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.definition-preview-popup {
  position: fixed;
  z-index: 9999;
  width: 320px;
  pointer-events: auto;
  padding: 6px;
}

.preview-content {
  background-color: var(--vp-c-bg-soft);
  border-radius: 8px;
  box-shadow: var(--vp-shadow-3);
  border: 1px solid var(--vp-c-divider);
  padding: 16px;
}

.preview-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 10px;
}

.aliases-container {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 10px;
}

.alias-pill {
  background: var(--vp-c-default-soft);
  border-radius: 6px;
  padding: 2px 8px;
  font-size: 12px;
  border: 1px solid var(--vp-c-divider-light);
}

.preview-description {
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
}

.read-more {
  margin-top: 10px;
  text-align: right;
}

.read-more-link {
  font-size: 13px;
  color: var(--vp-c-brand);
  text-decoration: none;
}

.read-more-link:hover {
  text-decoration: underline;
}

.preview-fade-enter-active,
.preview-fade-leave-active {
  transition: opacity 0.2s var(--vp-t-easing), transform 0.2s var(--vp-t-easing);
}

.preview-fade-enter-from,
.preview-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
