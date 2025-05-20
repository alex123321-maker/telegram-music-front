<!-- src/components/audio/PlayPauseButton.vue -->
<template>
  <button
    @click="emit('toggle')"
    :class="['play-pause-button', { playing: props.isPlaying }]"
  >
    <svg
      v-if="!props.isPlaying"
      xmlns="http://www.w3.org/2000/svg"
      class="icon"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M8 5v14l11-7z" />
    </svg>
    <svg
      v-else
      xmlns="http://www.w3.org/2000/svg"
      class="icon"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{ isPlaying: boolean }>()
// Определяем emit через сигнатуру, а не через массив
const emit = defineEmits<{
  (e: 'toggle'): void
}>()
</script>

<style scoped>
.play-pause-button {
  padding: 0.5rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;

  background-color: var(--tg-theme-secondary-bg-color);
  color:           var(--tg-theme-text-color);

  transition: transform 0.2s ease, background-color 0.3s ease, color 0.3s ease;
  transform:  scale(1);
}

.play-pause-button.playing {
  background-color: var(--tg-theme-button-color);
  color:            var(--tg-theme-button-text-color);
  transform:        scale(1.1);
}

.icon {
  width: 1.5rem;
  height: 1.5rem;
}
</style>
