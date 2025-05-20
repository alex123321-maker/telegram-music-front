<template>
  <!-- Desktop: кнопка + горизонтальный ползунок -->
  <div v-if="!isMobile" class="flex items-center gap-2 px-2">
    <button @click="onToggleMute" :style="btnStyle" class="p-2 rounded-full">
      <svg v-if="props.isMuted" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5"
           viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M11 5L6 9H2v6h4l5 4V5z M19 9l-4 4m0-4l4 4"/>
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5"
           viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M11 5L6 9H2v6h4l5 4V5z"/>
      </svg>
    </button>

    <input
      type="range" min="0" max="1" step="0.01"
      :value="props.isMuted ? 0 : props.volume"
      @input="onInput"
      class="w-28 h-2 appearance-none rounded overflow-hidden cursor-pointer"
      :style="sliderBg"
    />
  </div>

  <!-- Mobile: только кнопка mute -->
  <button v-else @click="onToggleMute" :style="btnStyle" class="p-2 rounded-full">
    <svg v-if="props.isMuted" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5"
         viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M11 5L6 9H2v6h4l5 4V5z M19 9l-4 4m0-4l4 4"/>
    </svg>
    <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5"
         viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M11 5L6 9H2v6h4l5 4V5z"/>
    </svg>
  </button>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { themeParams } from '@telegram-apps/sdk-vue'

const props = defineProps<{ volume: number; isMuted: boolean }>()
const emit  = defineEmits<{
  (e: 'update:volume', v: number): void
  (e: 'update:isMuted', v: boolean): void
}>()

// --- responsive detection -------------------------------------------------
const isMobile = ref(false)
if (typeof window !== 'undefined') {
  isMobile.value = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window
}
let mq: MediaQueryList | null = null
function handleMQ(e: MediaQueryListEvent) {
  isMobile.value = e.matches
}
onMounted(() => {
  if (!window) return
  mq = window.matchMedia('(pointer: coarse)')
  mq.addEventListener('change', handleMQ)
})
onBeforeUnmount(() => {
  mq?.removeEventListener('change', handleMQ)
})

// --- styles ---------------------------------------------------------------
const btnStyle = computed(() => ({
  backgroundColor: themeParams.secondaryBackgroundColor(),
  color          : themeParams.textColor()
}))
const sliderBg = computed(() => {
  const pct = props.isMuted ? 0 : props.volume * 100
  return {
    background: `linear-gradient(to right, ${themeParams.buttonColor()} ${pct}%, ${themeParams.secondaryBackgroundColor()} ${pct}%)`
  }
})

// --- actions --------------------------------------------------------------
function onToggleMute() {
  emit('update:isMuted', !props.isMuted)
}

function onInput(e: Event) {
  const v = +(e.target as HTMLInputElement).value
  emit('update:volume', v)
  emit('update:isMuted', v === 0)
}
</script>

<style scoped>
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background: white;
  border: 1px solid #ccc;
}
input[type="range"]::-moz-range-thumb {
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background: white;
  border: 1px solid #ccc;
}
</style>
