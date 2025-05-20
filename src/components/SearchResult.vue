<!-- components/VideoList.vue -->
<template>
  <ul class="mt-4 space-y-3 max-w-xl w-full">
    <!-- Скелетон -->
    <template v-if="loading">
      <li
        v-for="n in skeletonCount"
        :key="n"
        class="flex items-start space-x-3 w-full"
      >
        <div
          class="w-24 h-16 rounded-lg animate-pulse"
          :style="{ backgroundColor: skeletonBg }"
        ></div>
        <div class="flex-1 space-y-2 py-1">
          <div
            class="h-4 rounded animate-pulse w-full"
            :style="{ backgroundColor: skeletonBg }"
          ></div>
          <div
            class="h-3 rounded animate-pulse w-1/2"
            :style="{ backgroundColor: skeletonBg }"
          ></div>
        </div>
      </li>
    </template>

    <!-- Реальные элементы -->
    <template v-else>
      <li
        v-for="item in videos"
        :key="item.id.videoId"
        class="flex items-start space-x-3 cursor-pointer rounded-lg p-1 hover:bg-hoverBg"
        @click="$emit('select', item)"
      >
        <img
          :src="item.snippet.thumbnails.default.url"
          :alt="item.snippet.title"
          class="w-24 h-16 object-cover rounded-lg"
        />
        <div class="flex-1 overflow-hidden">
          <p class="font-medium truncate"
             :style="{ color: textColor }">
            {{ item.snippet.title }}
          </p>
          <p class="text-sm truncate"
             :style="{ color: hintColor }">
            {{ item.snippet.channelTitle }}
          </p>
        </div>
      </li>
    </template>
  </ul>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { themeParams } from '@telegram-apps/sdk-vue'

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
}>()

// Количество скелетонов по умолчанию
const skeletonCount = props.skeletonCount ?? 5

// Цвета из темы
const skeletonBg = computed(() => themeParams.sectionSeparatorColor())
const hoverBg     = computed(() => themeParams.sectionBackgroundColor())
const textColor   = computed(() => themeParams.textColor())
const hintColor   = computed(() => themeParams.hintColor())
</script>

<style scoped>
/* Hover-цвет через CSS-переменную */
.hover\:bg-hoverBg:hover {
  background-color: var(--hoverBg) !important;
}
</style>
