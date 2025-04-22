<template>
  <div class="fixed bottom-0 left-0 w-full bg-white shadow-lg" style="touch-action: none" >

    <div
      ref="progressBar"
      class="h-2 bg-gray-300 cursor-pointer"
      @mousedown.prevent="startSeek"
      @touchstart.prevent="startSeek"
    >
    <div
        class="h-full bg-blue-600"
        :style="{ width: progress + '%' }"
      />
      <div
        v-if="isDragging"
        class="absolute -top-6 text-xs text-gray-700 whitespace-nowrap transform -translate-x-1/2"
        :style="{ left: progress + '%' }"
      >
        {{ displayedTime }}
      </div>
    </div>

    <div class="max-w-3xl mx-auto flex items-center justify-between p-4">
      <div class="flex items-center space-x-4">
        <button disabled class="text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14V5" />
          </svg>
        </button>
        <button
            @click="togglePlay"
            :class="[
              'p-2 rounded-full transition duration-300 ease-in-out transform',
              isPlaying ? 'bg-blue-600 text-white scale-110' : 'bg-gray-200 text-gray-800 scale-100'
            ]"
          >
          <svg v-if="!isPlaying" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
          </svg>
        </button>
        <button disabled class="text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5v14" />
          </svg>
        </button>
      </div>

      <div class="flex items-center space-x-4 overflow-hidden">
        <img :src="props.cover" alt="cover" class="h-12 w-12 rounded" />
        <div class="flex flex-col">
          <span class="font-semibold truncate text-gray-900">{{ props.title }}</span>
          <span class="text-sm text-gray-600 truncate">{{ props.artist }}</span>
        </div>
      </div>

      <div
        class="relative volume-control"
        @mouseenter="onVolumeMouseEnter"
        @mouseleave="onVolumeMouseLeave"

      >
        <button @click="handleVolumeIconClick" class="p-2 rounded-full hover:bg-gray-200 transition">
          <svg v-if="isMuted" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5L6 9H2v6h4l5 4V5z M19 9l-4 4m0-4l4 4" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5L6 9H2v6h4l5 4V5z" />
          </svg>
        </button>

        <input
          v-if="showVolume"
          ref="volumeSlider"
          type="range"
          min="0"
          max="1"
          step="0.01"
          v-model.number="volume"
          @input="onVolumeChange"
          @touchstart.stop
          @touchmove.prevent="onVolumeTouchMove"
          class="absolute bottom-full mb-8 left-1/2 transform -translate-x-1/2 -rotate-90 w-24 h-2 appearance-none transition-all duration-300 opacity-100 scale-100"
          :style="{ background: volumeBackground }"
        />
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { Howl } from 'howler'

type Props = {
  src: string
  cover: string
  title: string
  artist: string
  autoplay?: boolean
  loop?: boolean
}
const props = defineProps<Props>()

const isPlaying = ref(false)
const isMuted = ref(false)
const volume = ref(1)
const showVolume = ref(false)
const isMobile = ref(false)

const progress = ref(0)
const displayedTime = ref('00:00')
const isDragging = ref(false)
const dragPercent = ref(0)

const progressBar = ref<HTMLElement | null>(null)
const volumeSlider = ref<HTMLInputElement | null>(null)
let sound: Howl
let rafId = 0

const volumeBackground = ref('')

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

function togglePlay(): void {
  if (!sound) return;
  if (isPlaying.value) {
    sound.pause();
  } else {
    sound.play();
  }
}

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

function updateVolumeBackground(): void {
  const pct = isMuted.value ? 0 : volume.value * 100
  volumeBackground.value = `linear-gradient(to right, #3b82f6 ${pct}%, #e5e7eb ${pct}%)`
}

watch(volume, () => {
  updateVolumeBackground()
})

function updateProgress(): void {
  if (!isDragging.value) {
    const cur = (sound.seek() as number) || 0
    const d = sound.duration() || 0
    progress.value = d > 0 ? (cur / d) * 100 : 0
    displayedTime.value = formatTime(cur)
  }
}

function progressLoop(): void {
  updateProgress()
  rafId = requestAnimationFrame(progressLoop)
}

function startSeek(e: MouseEvent | TouchEvent): void {
  isDragging.value = true
  cancelAnimationFrame(rafId) // Останавливаем автообновление
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
  pct = Math.max(0, Math.min(1, pct))
  dragPercent.value = pct
  const d = sound.duration() || 0
  progress.value = pct * 100
  displayedTime.value = formatTime(d * pct)
}

function endSeek(): void {
  isDragging.value = false
  window.removeEventListener('mousemove', seek)
  window.removeEventListener('mouseup', endSeek)
  window.removeEventListener('touchmove', seek)
  window.removeEventListener('touchend', endSeek)

  const d = sound.duration() || 0
  if (d) sound.seek(d * dragPercent.value)

  // Возобновляем обновление прогресса
  rafId = requestAnimationFrame(progressLoop)
}

function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (!target.closest('.volume-control')) {
    showVolume.value = false
  }
}

onMounted(() => {
  isMobile.value = 'ontouchstart' in window
  sound = new Howl({
    src: [props.src], html5: true, preload: true,
    autoplay: props.autoplay || false, loop: props.loop || false,
    volume: volume.value,
    onplay: () => { isPlaying.value = true; rafId = requestAnimationFrame(progressLoop) },
    onpause: () => { isPlaying.value = false; cancelAnimationFrame(rafId) },
    onend: () => { isPlaying.value = false; progress.value = 0; cancelAnimationFrame(rafId) }
  })

  updateVolumeBackground()

  window.addEventListener('click', handleClickOutside)
})
let volumeHideTimeout: ReturnType<typeof setTimeout> | null = null;

function onVolumeMouseEnter() {
  if (!isMobile.value) {
    if (volumeHideTimeout) clearTimeout(volumeHideTimeout)
    showVolume.value = true
  }
}

function onVolumeMouseLeave() {
  if (!isMobile.value) {
    if (volumeHideTimeout) clearTimeout(volumeHideTimeout)
    volumeHideTimeout = setTimeout(() => {
      showVolume.value = false
    }, 3000)
  }
}

function onVolumeTouchMove(e: TouchEvent) {
  e.preventDefault()
  if (!volumeSlider.value) return
  const rect = volumeSlider.value.getBoundingClientRect()
  const touch = e.touches[0]
  const y = touch.clientY
  const percent = Math.min(Math.max((rect.bottom - y) / rect.height, 0), 1)
  volume.value = percent
  isMuted.value = volume.value === 0
  sound.volume(volume.value)
  updateVolumeBackground()
}

onBeforeUnmount(() => {
  sound.unload()
  cancelAnimationFrame(rafId)
  showVolume.value = false
  window.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
</style>
