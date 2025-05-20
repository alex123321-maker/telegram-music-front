<!-- src/components/MainContent.vue -->
<template>
  <div class="main-content flex flex-col min-h-screen" :style="containerStyle">
    <!-- Центрированный прокси -->
    <div class="flex-1 flex items-center justify-center">
      <YoutubeProxy
        @resolved="onResolved"
        @loading="isLoading = $event"
      />
    </div>

    <!-- Скелетон плеера -->
    <AudioPlayerSkeleton v-if="isLoading" />

    <!-- Настоящий плеер -->
    <AudioPlayer
      v-else-if="audio.src"
      :src="audio.src"
      :artist="audio.artist"
      :title="audio.title"
      :cover="audio.cover"
      autoplay
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import YoutubeProxy        from '@/components/YoutubeProxy.vue'
import AudioPlayer         from '@/components/AudioPlayer.vue'
import AudioPlayerSkeleton from '@/components/AudioPlayerSkeleton.vue'

const audio     = ref({ src: '', artist: '', title: '', cover: '' })
const isLoading = ref(false)

function onResolved(payload: typeof audio.value) {
  audio.value = payload
}

const containerStyle = computed(() => ({
  backgroundColor: 'var(--tg--theme-bg-color)',
  color:           'var(--tg-theme-text-color)'
}))
</script>

<style scoped>
.main-content {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
