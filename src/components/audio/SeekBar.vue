<template>
  <div
    ref="barRef"
    class="h-2 cursor-pointer relative"
    @mousedown.prevent="onStart"
    @touchstart.prevent="onStart"
    :style="{ backgroundColor: trackBg }"
  >
    <div
      class="h-full"
      :style="{ width: props.progress + '%', backgroundColor: fillColor }"
    />
    <div
      v-if="dragging"
      class="absolute -top-6 text-xs whitespace-nowrap transform -translate-x-1/2"
      :style="{ left: props.progress + '%', color: textColor }"
    >
      {{ props.thumbLabel }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { themeParams } from '@telegram-apps/sdk-vue'

const props = defineProps<{
  progress: number
  thumbLabel: string
}>()

const emit = defineEmits<{
  (e: 'start', ev: MouseEvent | TouchEvent): void
  (e: 'move', ev: MouseEvent | TouchEvent): void
  (e: 'end'): void
}>()



// Вычисляем цвета на основе themeParams
const trackBg = computed(() => themeParams.secondary_bg_color)
const fillColor = computed(() => themeParams.button_color)
const textColor = computed(() => themeParams.text_color)

const barRef = ref<HTMLElement | null>(null)
const dragging = ref(false)

function onStart(e: MouseEvent | TouchEvent) {
  dragging.value = true
  emit('start', e)
  window.addEventListener('mousemove', onMove)
  window.addEventListener('mouseup', onEnd)
  window.addEventListener('touchmove', onMove)
  window.addEventListener('touchend', onEnd)
}

function onMove(e: MouseEvent | TouchEvent) {
  if (dragging.value) {
    emit('move', e)
  }
}

function onEnd() {
  if (!dragging.value) return
  dragging.value = false
  window.removeEventListener('mousemove', onMove)
  window.removeEventListener('mouseup', onEnd)
  window.removeEventListener('touchmove', onMove)
  window.removeEventListener('touchend', onEnd)
  emit('end')
}
</script>
