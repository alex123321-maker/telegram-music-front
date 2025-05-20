<!-- src/components/AudioPlayer.vue -->
<template>
  <component
    :is="isMobile ? AudioPlayerMobile : AudioPlayerDesktop"
    v-bind="props"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import AudioPlayerMobile from '@/components/AudioPlayerMobile.vue'
import AudioPlayerDesktop from '@/components/AudioPlayerDesktop.vue'

/**
 * Обёртка-плеер, переключает мобильный и десктопный интерфейс
 */
type Props = {
  src: string
  cover: string
  title: string
  artist: string
  autoplay?: boolean
  loop?: boolean
}
const props = defineProps<Props>()
const isMobile = ref(false)

// Определяем мобильный режим по ширине окна
function updateIsMobile() {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  updateIsMobile()
  window.addEventListener('resize', updateIsMobile)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateIsMobile)
})
</script>

<style scoped>
/* В этом компоненте специфичных стилей нет */
</style>
