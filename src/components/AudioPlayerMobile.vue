<template>
  <div
    class="fixed bottom-0 left-0 w-full shadow-lg"
    style="touch-action: none"
    :style="{ backgroundColor: themeParams.bottomBarBgColor() }"
  >
  <MediaTagBar :media_id="media_id"></MediaTagBar>

    <!-- Прогресс-бар -->
    <div
      ref="progressBar"
      class="h-2 cursor-pointer relative"
      @mousedown.prevent="startSeek"
      @touchstart.prevent="startSeek"
      :style="{ backgroundColor: themeParams.secondaryBackgroundColor() }"
    >
      <div
        class="h-full"
        :style="{
          width: progress + '%',
          backgroundColor: themeParams.buttonColor()
        }"
      />
      <div
        v-if="isDragging"
        class="absolute -top-6 text-xs whitespace-nowrap transform -translate-x-1/2"
        :style="{
          left: progress + '%',
          color: themeParams.textColor()
        }"
      >
        {{ displayedTime }}
      </div>
    </div>

    <div class="max-w-3xl mx-auto flex items-center justify-between pt-2">
      <!-- Кнопки Prev / Play / Next -->
      <div class="flex items-center space-x-4">
        <button
          disabled
          class="p-2 rounded-full transition"
          :style="{ color: themeParams.hintColor() }"
        >
          <!-- Назад (disabled) -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
               stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M11 19l-7-7 7-7m8 14V5" />
          </svg>
        </button>

        <button
          @click="togglePlay"
          class="p-2 rounded-full transition duration-300 ease-in-out transform"
          :style="playPauseStyle"
        >
          <svg v-if="!isPlaying" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6"
               fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6"
               fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
          </svg>
        </button>

        <button
          disabled
          class="p-2 rounded-full transition"
          :style="{ color: themeParams.hintColor() }"
        >
          <!-- Вперёд (disabled) -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
               stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13 5l7 7-7 7M5 5v14" />
          </svg>
        </button>
      </div>

      <!-- Информация трека -->
      <div class="flex items-center space-x-4 overflow-hidden">
        <img :src="props.cover" alt="cover" class="h-12 w-12 rounded" />
        <div class="flex flex-col">
          <span
            class="font-semibold truncate"
            :style="{ color: themeParams.textColor() }"
          >
            {{ props.title }}
          </span>
          <span
            class="text-sm truncate"
            :style="{ color: themeParams.subtitleTextColor() }"
          >
            {{ props.artist }}
          </span>
        </div>
      </div>

      <!-- Контроль громкости -->
      <div
        class="relative volume-control"
        @mouseenter="onVolumeMouseEnter"
        @mouseleave="onVolumeMouseLeave"
      >
        <button
          @click="handleVolumeIconClick"
          class="p-2 rounded-full transition"
          :style="{
            backgroundColor: themeParams.secondaryBackgroundColor(),
            color: themeParams.textColor()
          }"
        >
          <svg v-if="isMuted" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6"
               fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M11 5L6 9H2v6h4l5 4V5z M19 9l-4 4m0-4l4 4" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6"
               fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M11 5L6 9H2v6h4l5 4V5z" />
          </svg>
        </button>

        <input
          v-if="showVolume"
          ref="volumeSlider"
          type="range" min="0" max="1" step="0.01"
          v-model.number="volume"
          @input="onVolumeChange"
          @touchstart.stop
          @touchmove.prevent="onVolumeTouchMove"
          class="absolute bottom-full mb-8 left-1/2 transform -translate-x-1/2 -rotate-90 w-24 h-2 appearance-none transition-all duration-300 opacity-100 scale-100"
          :style="volumeSliderStyle"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { Howl } from 'howler'
import { themeParams } from '@telegram-apps/sdk-vue'
import MediaTagBar from './audio/MediaTagBar.vue'

const media_id = 6


type Props = {
  src: string
  cover: string
  title: string
  artist: string
  autoplay?: boolean
  loop?: boolean
}
const props = defineProps<Props>()

// Состояние
const isPlaying     = ref(false)
const isMuted       = ref(false)
const volume        = ref(1)
const showVolume    = ref(false)
const isMobile      = ref(true)
const progress      = ref(0)
const displayedTime = ref('00:00')
const isDragging    = ref(false)
const dragPercent   = ref(0)
const progressBar   = ref<HTMLElement | null>(null)
const volumeSlider  = ref<HTMLInputElement | null>(null)

let sound: Howl
let rafId = 0

// Формат времени
function formatTime(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

// Play/Pause
function togglePlay(): void {
  if (!sound) return
  if (isPlaying.value) sound.pause()
  else sound.play()
}

// Громкость
function handleVolumeIconClick(): void {
  if (isMobile.value) {
    if (showVolume.value) toggleMute()
    showVolume.value = !showVolume.value
  } else {
    toggleMute()
  }
}
function onVolumeChange(): void {
  isMuted.value = volume.value === 0
  sound.volume(volume.value)
  updateVolumeBackground()
}
function toggleMute(): void {
  isMuted.value = !isMuted.value
  sound.volume(isMuted.value ? 0 : volume.value)
  updateVolumeBackground()
}
const volumeBackground = ref('')
function updateVolumeBackground(): void {
  const pct = isMuted.value ? 0 : volume.value * 100
  volumeBackground.value = `linear-gradient(to right, ${themeParams.buttonColor()} ${pct}%, ${themeParams.secondaryBackgroundColor()} ${pct}%)`
}

// Progress loop
function updateProgress(): void {
  if (!isDragging.value) {
    const cur = (sound.seek() as number) || 0
    const dur = sound.duration() || 0
    progress.value      = dur > 0 ? (cur / dur) * 100 : 0
    displayedTime.value = formatTime(cur)
  }
}
function progressLoop(): void {
  updateProgress()
  rafId = requestAnimationFrame(progressLoop)
}

// Seek
function startSeek(e: MouseEvent | TouchEvent): void {
  isDragging.value = true
  cancelAnimationFrame(rafId)
  seek(e)
  window.addEventListener('mousemove', seek)
  window.addEventListener('mouseup', endSeek)
  window.addEventListener('touchmove', seek)
  window.addEventListener('touchend', endSeek)
}
function getX(e: MouseEvent | TouchEvent): number {
  return 'touches' in e && e.touches.length
    ? e.touches[0].clientX
    : (e as MouseEvent).clientX
}
function seek(e: MouseEvent | TouchEvent): void {
  if (!progressBar.value) return
  const rect = progressBar.value.getBoundingClientRect()
  let pct = (getX(e) - rect.left) / rect.width
  pct = Math.min(Math.max(pct, 0), 1)
  dragPercent.value = pct
  const dur = sound.duration() || 0
  progress.value      = pct * 100
  displayedTime.value = formatTime(dur * pct)
}
function endSeek(): void {
  isDragging.value = false
  window.removeEventListener('mousemove', seek)
  window.removeEventListener('mouseup', endSeek)
  window.removeEventListener('touchmove', seek)
  window.removeEventListener('touchend', endSeek)
  const dur = sound.duration() || 0
  if (dur) sound.seek(dur * dragPercent.value)
  rafId = requestAnimationFrame(progressLoop)
}

// Volume slider show/hide
function onVolumeMouseEnter() { showVolume.value = true }
function onVolumeMouseLeave() { setTimeout(() => (showVolume.value = false), 3000) }
function onVolumeTouchMove(e: TouchEvent) {
  e.preventDefault()
  if (!volumeSlider.value) return
  const rect = volumeSlider.value.getBoundingClientRect()
  const y = e.touches[0].clientY
  const pct = Math.min(Math.max((rect.bottom - y) / rect.height, 0), 1)
  volume.value = pct
  isMuted.value = pct === 0
  sound.volume(pct)
  updateVolumeBackground()
}
function handleClickOutside(e: MouseEvent) {
  if (!(e.target as HTMLElement).closest('.volume-control')) {
    showVolume.value = false
  }
}

// Lifecycle
onMounted(() => {
  sound = new Howl({
    src: [props.src],
    html5: true,
    preload: true,
    autoplay: props.autoplay ?? false,
    loop: props.loop ?? false,
    volume: volume.value,
    onplay:  () => { isPlaying.value = true; rafId = requestAnimationFrame(progressLoop) },
    onpause: () => { isPlaying.value = false; cancelAnimationFrame(rafId) },
    onend:   () => { isPlaying.value = false; progress.value = 0; cancelAnimationFrame(rafId) }
  })
  updateVolumeBackground()
  window.addEventListener('click', handleClickOutside)
})
onBeforeUnmount(() => {
  sound.unload()
  cancelAnimationFrame(rafId)
  window.removeEventListener('click', handleClickOutside)
})

// Computed styles
const playPauseStyle = computed(() => ({
  backgroundColor: isPlaying.value
    ? themeParams.buttonColor()
    : themeParams.secondaryBackgroundColor(),
  color: isPlaying.value
    ? themeParams.buttonTextColor()
    : themeParams.textColor(),
  transform: isPlaying.value ? 'scale(1.1)' : 'scale(1.0)'
}))
const volumeSliderStyle = computed(() => ({
  background: volumeBackground.value
}))
</script>

<style scoped>
/* При необходимости добавьте дополнительные scoped-стили */
</style>
