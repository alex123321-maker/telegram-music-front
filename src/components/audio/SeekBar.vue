<template>
  <div
    ref="bar"
    class="h-2 cursor-pointer relative shadow-md"
    :style="{ backgroundColor: trackBg }"
    @mousedown.prevent="startDrag"
    @touchstart.prevent="startDrag"
  >
    <div
      class="h-full"
      :style="{ width: internalProgress + '%', backgroundColor: fillColor }"
    />
    <div
      v-if="dragging"
      class="absolute -top-6 text-xs whitespace-nowrap transform -translate-x-1/2"
      :style="{ left: internalProgress + '%', color: textColor }"
    >
      {{ formattedTime }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import { themeParams } from '@telegram-apps/sdk-vue'

/** Входные пропсы */
const props = defineProps<{
  /** Процент 0–100 */
  progress: number
  /** Общая длительность трека в секундах */
  duration: number
}>()

/** Эвенты */
const emit = defineEmits<{
  /** v-model:progress */
  (e: 'update:progress', v: number): void
  /** начало перетаскивания */
  (e: 'start'): void
  /** конец перетаскивания */
  (e: 'end'): void
}>()

// локальный прогресс
const internalProgress = ref(props.progress)
// если прогресс меняется извне и мы не в драге — синхронизируем
watch(() => props.progress, v => {
  if (!dragging.value) internalProgress.value = v
})

// тема
const trackBg   = computed(() => themeParams.secondaryBackgroundColor())
const fillColor = computed(() => themeParams.buttonColor())
const textColor = computed(() => themeParams.textColor())

// DOM-элемент бара
const bar = ref<HTMLElement|null>(null)

// expose, если кому-то нужен bar, но сейчас не нужен
defineExpose({ bar })

// флаг «перетаскиваем»
const dragging = ref(false)

function startDrag(e: MouseEvent|TouchEvent) {
  dragging.value = true
  emit('start')
  window.addEventListener('mousemove', onDrag)
  window.addEventListener('mouseup',   endDrag)
  window.addEventListener('touchmove', onDrag)
  window.addEventListener('touchend',  endDrag)
  onDrag(e)
}

function onDrag(e: MouseEvent|TouchEvent) {
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
  emit('end')
  window.removeEventListener('mousemove', onDrag)
  window.removeEventListener('mouseup',   endDrag)
  window.removeEventListener('touchmove', onDrag)
  window.removeEventListener('touchend',  endDrag)
}

// для попапа времени
const formattedTime = computed(() => {
  const sec = Math.round((internalProgress.value/100) * props.duration)
  const m = Math.floor(sec/60)
  const s = (sec%60).toString().padStart(2,'0')
  return `${m}:${s}`
})

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', onDrag)
  window.removeEventListener('mouseup',   endDrag)
  window.removeEventListener('touchmove', onDrag)
  window.removeEventListener('touchend',  endDrag)
})
</script>
