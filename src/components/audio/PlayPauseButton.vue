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
import { onMounted, onBeforeUnmount } from 'vue'

const props = defineProps<{ isPlaying: boolean }>()
const emit  = defineEmits<{ (e: 'toggle'): void }>()

function handleKeydown(e: KeyboardEvent) {
  if (e.code !== 'Space') return       // интересует только пробел

  // 1. Узнаём, где сейчас фокус
  const el = e.target as HTMLElement | null
  const isTextInput =
    el &&
    (
      el.tagName === 'INPUT' ||
      el.tagName === 'TEXTAREA' ||
      el.isContentEditable
    )

  if (isTextInput) {
    // Вводит текст → не мешаем
    return
  }

  // 2. Фокус не в поле ввода: это «горячая клавиша»
  e.preventDefault()   // убираем прокрутку
  emit('toggle')
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>


<style scoped>
.play-pause-button {
  padding: 0.5rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;

  /* основной фон и цвет текста из темы */
  background: var(--btn-bg);
  color: var(--btn-text);

  /* анимация состояний */
  transition: transform 0.2s ease,
              background-color 0.3s ease,
              color 0.3s ease;
}

.play-pause-button:hover {
  background: var(--btn-bg-hover);
}

.play-pause-button:active {
  background: var(--btn-bg-active);
}

.play-pause-button.playing {
  transform: scale(1.1);
  background: var(--btn-bg-active);
}

.icon {
  width: 1.5rem;
  height: 1.5rem;
}
</style>
