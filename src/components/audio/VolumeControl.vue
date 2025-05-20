<template>
  <!-- Desktop: кнопка + горизонтальный ползунок -->
  <div v-if="!isMobile" class="volume-control-desktop flex items-center gap-2 px-2">
    <button
      @click="onToggleMute"
      :class="['vc-button', { muted: props.isMuted }]"
    >
      <svg
        v-if="props.isMuted"
        xmlns="http://www.w3.org/2000/svg"
        class="icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
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
        class="icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
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
      type="range"
      min="0"
      max="1"
      step="0.01"
      :value="props.isMuted ? 0 : props.volume"
      @input="onInput"
      class="vc-slider"
      :style="sliderBg"
    />
  </div>

  <!-- Mobile: только кнопка mute -->
  <button
    v-else
    @click="onToggleMute"
    :class="['vc-button', { muted: props.isMuted }]"
  >
    <svg
      v-if="props.isMuted"
      xmlns="http://www.w3.org/2000/svg"
      class="icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
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
      class="icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M11 5L6 9H2v6h4l5 4V5z"
      />
    </svg>
  </button>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps<{ volume: number; isMuted: boolean }>()
const emit = defineEmits<{
  (e: 'update:volume', v: number): void
  (e: 'update:isMuted', v: boolean): void
}>()

// --- Responsive detection -------------------------------------------------
const isMobile = ref(false)
if (typeof window !== 'undefined') {
  isMobile.value = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window
}
let mq: MediaQueryList | null = null
function handleMQ(e: MediaQueryListEvent) {
  isMobile.value = e.matches
}
onMounted(() => {
  mq = window.matchMedia('(pointer: coarse)')
  mq.addEventListener('change', handleMQ)
})
onBeforeUnmount(() => {
  mq?.removeEventListener('change', handleMQ)
})

// --- Computed styles -------------------------------------------------------
const sliderBg = computed(() => {
  const pct = props.isMuted ? 0 : props.volume * 100
  return {
    background: `linear-gradient(to right, var(--tg-theme-button-color) ${pct}%, var(--tg-theme-secondary-bg-color) ${pct}%)`
  }
})

// --- Actions ---------------------------------------------------------------
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
.vc-button {
  padding: 0.5rem;
  border-radius: 9999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: var(--tg-theme-secondary-bg-color);
  color: var(--tg-theme-text-color);
  transition: background-color 0.3s ease, color 0.3s ease;
}
.vc-button.muted {
  opacity: 0.6;
}

.vc-slider {
  width: 7rem;
  height: 0.5rem;
  appearance: none;
  border-radius: 0.125rem;
  overflow: hidden;
  cursor: pointer;
}

.vc-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background: var(--tg-theme-button-color);
  border: 1px solid var(--tg-theme-section-separator-color);
}
.vc-slider::-moz-range-thumb {
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background: var(--tg-theme-button-color);
  border: 1px solid var(--tg-theme-section-separator-color);
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
}
</style>
