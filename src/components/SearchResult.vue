<template>
  <div
  v-show="videos.length || loading"

  class="list-wrapper">
    <ul
    class="video-list"
    @scroll.passive="handleScroll"
    ref="listRef"
  >
    <!-- Скелетон -->
    <template v-if="loading && videos.length === 0">
      <li v-for="n in skeletonCount" :key="n" class="skeleton-item">
        <div class="skeleton-thumb"></div>
        <div class="skeleton-text">
          <div class="skeleton-line full"></div>
          <div class="skeleton-line half"></div>
        </div>
      </li>
    </template>

    <!-- Реальные элементы -->
    <template v-else>
      <li
        v-for="item in videos"
        :key="item.id.videoId"
        class="video-item"
        @click="$emit('select', item)"
      >
        <img
          :src="item.snippet.thumbnails.default.url"
          :alt="item.snippet.title"
          class="video-thumb"
        />
        <div class="video-info">
          <p class="video-title">{{ item.snippet.title }}</p>
          <p class="video-channel">{{ item.snippet.channelTitle }}</p>
        </div>
      </li>
    </template>

    <!-- Прелоадер при догрузке -->
    <li v-if="loading && videos.length > 0" class="skeleton-item">
      <div class="skeleton-thumb"></div>
      <div class="skeleton-text">
        <div class="skeleton-line full"></div>
        <div class="skeleton-line half"></div>
      </div>
    </li>
  </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface VideoItem {
  id: { videoId: string }
  snippet: {
    thumbnails: { default: { url: string } }
    title: string
    channelTitle: string
  }
}

const props = defineProps<{
  videos: VideoItem[]
  loading: boolean
  skeletonCount?: number
}>()

const emit = defineEmits<{
  (e: 'select', item: VideoItem): void
  (e: 'scroll-bottom'): void
}>()

const listRef = ref<HTMLElement | null>(null)
const skeletonCount = props.skeletonCount ?? 5

function handleScroll() {
  const el = listRef.value
  if (!el) return

  const threshold = 100 // пикселей до низа
  if (el.scrollTop + el.clientHeight >= el.scrollHeight - threshold) {
    emit('scroll-bottom')
  }
}
</script>

<style scoped>
.list-wrapper{
  padding: 1rem 0rem 1rem 1rem;
  background: var(--bg-section);
  width: 100%;
  isplay: flex;
  max-width: 36rem;
  border-radius: 0.5rem;


}
.video-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
  max-width: 36rem;
  padding-left: 1rem;
  border-radius: 0.5rem;
  max-height: 400px;
  overflow-y: auto;

  /* Скроллбар */
  scrollbar-width: thin;
  scrollbar-color: var(--btn-bg) var(--bg-section);

}
.video-list::-webkit-scrollbar {
  width: 8px;
}
.video-list::-webkit-scrollbar-track {
  background: var(--bg);
}
.video-list::-webkit-scrollbar-thumb {
  background-color: var(--btn-bg);
  border-radius: 4px;
  border: 2px solid transparent;
  background-clip: content-box;
}
.video-list::-webkit-scrollbar-thumb:hover {
  background-color: var(--text-link);
}

.skeleton-item {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}
.skeleton-thumb {
  width: 6rem;
  height: 4rem;
  border-radius: 0.5rem;
  background: var(--border);
  animation: pulse 1.5s infinite;
}
.skeleton-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.skeleton-line {
  background: var(--border);
  border-radius: 0.25rem;
  animation: pulse 1.5s infinite;
}
.skeleton-line.full { width: 100%; height: 1rem; }
.skeleton-line.half { width: 50%; height: 1rem; }

.video-item {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  padding: 0.5rem;
  margin-right: 1rem;
  border-radius: 0.5rem;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border);
  transition: background 0.2s ease;
}
.video-item:hover {
  background: var(--bg);
}

.video-thumb {
  width: 6rem;
  height: 4rem;
  border-radius: 0.5rem;
  object-fit: cover;
  box-shadow: var(--shadow);
}

.video-info {
  flex: 1;
  overflow: hidden;
}
.video-title {
  margin: 0;
  font-weight: 500;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.video-channel {
  margin: 0;
  font-size: 0.875rem;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Анимация пульса */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.4; }
}
</style>
