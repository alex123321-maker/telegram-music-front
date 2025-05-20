<!-- src/components/MainContent.vue -->
<template>
  <ul class="video-list">
    <!-- Скелетон -->
    <template v-if="loading">
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
  </ul>
</template>

<script setup lang="ts">
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
defineEmits<{
  (e: 'select', item: VideoItem): void
}>()

const skeletonCount = props.skeletonCount ?? 5
</script>

<style scoped>
.video-list {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 36rem;
  width: 100%;
}

/* Скелетон */
.skeleton-item {
  display: flex;
  align-items: start;
  gap: 0.75rem;
}
.skeleton-thumb {
  width: 6rem;
  height: 4rem;
  border-radius: 0.5rem;
  background-color: var(--tg-theme-section-separator-color);
  animation: pulse 1.5s infinite;
}
.skeleton-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-top: 0.25rem;
}
.skeleton-line {
  height: 1rem;
  border-radius: 0.25rem;
  background-color: var(--tg-theme-section-separator-color);
  animation: pulse 1.5s infinite;
}
.skeleton-line.full { width: 100%; }
.skeleton-line.half { width: 50%; }

/* Элементы видео */
.video-item {
  display: flex;
  align-items: start;
  gap: 0.75rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.5rem;
  transition: background-color 0.2s;
}
.video-item:hover {
  background-color: var(--tg-theme-section-background-color);
}
.video-thumb {
  width: 6rem;
  height: 4rem;
  border-radius: 0.5rem;
  object-fit: cover;
}
.video-info {
  flex: 1;
  overflow: hidden;
}
.video-title {
  margin: 0;
  font-weight: 500;
  color: var(--tg-theme-text-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.video-channel {
  margin: 0;
  font-size: 0.875rem;
  color: var(--tg-theme-hint-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Анимация пульсации для скелетона */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
</style>
