<template>
  <div
    class="relative volume-control inline-block"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <button
      @click="handleClick"
      class="p-2 rounded-full transition"
      :style="buttonStyle"
    >
      <svg
        v-if="props.isMuted"
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M11 5L6 9H2v6h4l5 4V5z M19 9l-4 4m0-4l4 4"
        />
      </svg>
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M11 5L6 9H2v6h4l5 4V5z"
        />
      </svg>
    </button>

    <input
      v-if="showSlider"
      ref="slider"
      type="range"
      min="0"
      max="1"
      step="0.01"
      :value="props.volume"
      @input="onInput"
      @touchstart.stop
      @touchmove.prevent="onTouchMove"
      class="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 -rotate-90 w-24 h-2 appearance-none transition-all duration-300"
      :style="sliderStyle"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue'
import { themeParams } from '@telegram-apps/sdk-vue'

const props = defineProps<{
  volume: number
  isMuted: boolean
}>()

const emit = defineEmits<{
  (e: 'update:volume', v: number): void
  (e: 'update:isMuted', v: boolean): void
}>()

const showSlider = ref(false)
const isTouch = ref(false)
const slider = ref<HTMLInputElement | null>(null)
let hideTimeout: number | null = null

// Динамически пересчитываем фон ползунка
const sliderStyle = computed(() => {
  const pct = props.isMuted ? 0 : props.volume * 100
  return {
    background: `linear-gradient(to right, ${themeParams.buttonColor()} ${pct}%, ${themeParams.secondaryBackgroundColor()} ${pct}%)`
  }
})

// Динамический стиль для кнопки
const buttonStyle = computed(() => ({
  backgroundColor: themeParams.secondaryBackgroundColor(),
  color: themeParams.textColor()
}))

// Перехватываем изменения громкости и мьюта для обновления стилей
watch(() => props.volume, () => {}, { immediate: true })
watch(() => props.isMuted,   () => {}, { immediate: true })

onMounted(() => {
  isTouch.value = 'ontouchstart' in window
})

onBeforeUnmount(() => {
  if (hideTimeout) clearTimeout(hideTimeout)
})

function handleClick() {
  if (isTouch.value) {
    if (showSlider.value) {
      emit('update:isMuted', !props.isMuted)
    } else {
      showSlider.value = true
      hideTimeout = window.setTimeout(() => (showSlider.value = false), 5000)
    }
  } else {
    emit('update:isMuted', !props.isMuted)
  }
}

function onMouseEnter() {
  if (!isTouch.value) {
    if (hideTimeout) clearTimeout(hideTimeout)
    showSlider.value = true
  }
}

function onMouseLeave() {
  if (!isTouch.value) {
    hideTimeout = window.setTimeout(() => (showSlider.value = false), 2000)
  }
}

function onInput(e: Event) {
  const v = +(e.target as HTMLInputElement).value
  emit('update:volume', v)
  emit('update:isMuted', v === 0)
}

function onTouchMove(e: TouchEvent) {
  e.preventDefault()
  if (!slider.value) return
  const rect = slider.value.getBoundingClientRect()
  const y = e.touches[0].clientY
  const pct = Math.min(Math.max((rect.bottom - y) / rect.height, 0), 1)
  emit('update:volume', pct)
  emit('update:isMuted', pct === 0)
}
</script>

<style scoped>
/* Ползунок WebKit */
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background: white;
  border: 1px solid #ccc;
}
/* Ползунок Firefox */
input[type="range"]::-moz-range-thumb {
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background: white;
  border: 1px solid #ccc;
}
</style>
