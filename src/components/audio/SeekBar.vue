<template>
  <div
    ref="bar"
    class="seek-bar h-2 cursor-pointer relative bg-track"
    @mousedown.prevent="startDrag"
    @touchstart.prevent="startDrag"
  >
    <!-- Заполненная часть -->
    <div
      class="h-full bg-fill"
      :style="{ width: internalProgress + '%' }"
    />

    <!-- Попап с временем -->
    <div
      v-if="dragging"
      class="seek-popup absolute -top-6 text-xs whitespace-nowrap transform -translate-x-1/2"
      :style="{ left: internalProgress + '%' }"
    >
      {{ formattedTime }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount } from 'vue'

/** Входные пропсы */
const props = defineProps<{
  /** Процент 0–100 */
  progress: number
  /** Общая длительность трека в секундах */
  duration: number
}>()

/** События */
const emit = defineEmits<{
  /** v-model:progress */
  (e: 'update:progress', v: number): void
  /** начало перетаскивания */
  (e: 'start'): void
  /** конец перетаскивания */
  (e: 'end'): void
}>()

// внутренний прогресс
const internalProgress = ref(props.progress)
watch(() => props.progress, v => {
  if (!dragging.value) internalProgress.value = v
})

// DOM-элемент бара
const bar = ref<HTMLElement | null>(null)
defineExpose({ bar })

// флаг «перетаскиваем»
const dragging = ref(false)

function startDrag(e: MouseEvent | TouchEvent) {
  dragging.value = true
  emit('start')
  window.addEventListener('mousemove', onDrag)
  window.addEventListener('mouseup',   endDrag)
  window.addEventListener('touchmove', onDrag)
  window.addEventListener('touchend',  endDrag)
  onDrag(e)
}

function onDrag(e: MouseEvent | TouchEvent) {
  if (!dragging.value || !bar.value) return
  const x = 'touches' in e && e.touches.length
    ? e.touches[0].clientX
    : (e as MouseEvent).clientX
  const { left, width } = bar.value.getBoundingClientRect()
  let pct = (x - left) / width
  pct = Math.max(0, Math.min(1, pct))
  internalProgress.value = pct * 100
  emit('update:progress', internalProgress.value)
}

function endDrag() {
  if (!dragging.value) return
  dragging.value = false
  window.removeEventListener('mousemove', onDrag)
  window.removeEventListener('mouseup',   endDrag)
  window.removeEventListener('touchmove', onDrag)
  window.removeEventListener('touchend',  endDrag)
  emit('end')
}

// для попапа времени
const formattedTime = computed(() => {
  const sec = Math.round((internalProgress.value / 100) * props.duration)
  const m = Math.floor(sec / 60)
  const s = (sec % 60).toString().padStart(2, '0')
  return `${m}:${s}`
})

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', onDrag)
  window.removeEventListener('mouseup',   endDrag)
  window.removeEventListener('touchmove', onDrag)
  window.removeEventListener('touchend',  endDrag)
})
</script>

<style scoped>
.seek-bar {
  border-radius: 0.25rem;
}

/* Цвет фона всей полосы */
.bg-track {
  background: var(--bg-secondary);
}

/* Цвет заполненной части */
.bg-fill {
  background: var(--btn-bg);
}

/* Текст попапа времени */
.seek-popup {
  color: var(--text);
}
</style>
