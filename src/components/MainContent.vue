<template>
  <div :style="containerStyle" class="flex flex-col min-h-screen">
    <!-- Центрированный прокси -->
    <div class="flex-1 flex items-center justify-center">
      <YoutubeProxy
        @resolved="onResolved"
        @loading ="isLoading = $event"
      />
    </div>


    <!-- Скелетон -->
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
import { ref, computed }  from 'vue'
import { themeParams }    from '@telegram-apps/sdk-vue'
import YoutubeProxy       from '@/components/YoutubeProxy.vue'
import AudioPlayer        from '@/components/AudioPlayer.vue'
import AudioPlayerSkeleton from '@/components/AudioPlayerSkeleton.vue'


/** состояние */
const audio      = ref({ src:'', artist:'', title:'', cover:'' })
const isLoading  = ref(false)

/** событие от прокси */
function onResolved (payload: typeof audio.value) {
  audio.value = payload
}

/** цвета темы */
const containerStyle = computed(() => ({
  backgroundColor : themeParams.secondaryBackgroundColor(),
  color           : themeParams.textColor()
}))
</script>
