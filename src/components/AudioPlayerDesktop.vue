<template>

  <div
  class="w-full "
  >
  <!-- Теги песни -->
  <MediaTagBar :media_id="media_id" />

    <!-- Прогресс-бар с возможностью тащить мышью -->
    <SeekBar
      v-model:progress="progress"
      :duration="duration"
      @start="pauseLoop"
      @end="resumeLoop"
    />

    <!-- Основная панель управления (шире, чем на телефоне) -->
    <div class="max-w-5xl mx-auto flex items-center justify-between pt-3"
    :style="{ backgroundColor: themeParams.bottomBarBgColor() }"

    >
      <!-- Кнопки навигации и Play/Pause -->
      <div class="flex items-center gap-2">
        <SkipButton direction="prev" @click="prevTrack">
          <svg class="w-5 h-5 -scale-x-100 fill-current" viewBox="-2 0 24 24"><path d="M5 4l7 8-7 8V4zM12 4l7 8-7 8V4z"/></svg></SkipButton>
        <PlayPauseButton :is-playing="isPlaying" @click="togglePlay" />
        <SkipButton direction="next" @click="nextTrack">
          <svg class="w-5 h-5 fill-current" viewBox="-2 0 24 24"><path d="M5 4l7 8-7 8V4zM12 4l7 8-7 8V4z"/></svg>
        </SkipButton>
      </div>

      <!-- Инфо о треке -->
      <TrackInfo
        class="flex-1 px-4"
        :cover="props.cover"
        :title="props.title"
        :artist="props.artist"
      />

      <!-- Громкость -->
      <VolumeControl
        :volume="volume"
        :is-muted="isMuted"
        @update:volume="onVolumeChange"
        @update:isMuted="toggleMute"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Howl } from 'howler'
import { themeParams } from '@telegram-apps/sdk-vue'

import MediaTagBar     from '@/components/audio/MediaTagBar.vue'
import SeekBar         from '@/components/audio/SeekBar.vue'
import PlayPauseButton from '@/components/audio/PlayPauseButton.vue'
import SkipButton      from '@/components/audio/SkipButton.vue'
import TrackInfo       from '@/components/audio/TrackInfo.vue'
import VolumeControl   from '@/components/audio/VolumeControl.vue'

const media_id = 6

/** Входные пропсы */
type Props = {
  src: string
  cover: string
  title: string
  artist: string
  autoplay?: boolean
  loop?: boolean
}
const props = defineProps<Props>()

// *** Состояние ***
const progress      = ref(0) // 0–100 %
const duration      = ref(0) // сек
const displayedTime = ref('00:00')
const isPlaying     = ref(false)
const volume        = ref(1)
const isMuted       = ref(false)

let sound: Howl
let rafId = 0

// формируем MM:SS
function formatTime(sec: number) {
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

/** Переключение Play/Pause */
function togglePlay() {
  if (!sound) return
  if (isPlaying.value) sound.pause()
  else sound.play()
}

// *** Seek-логика ***
function pauseLoop() {
  cancelAnimationFrame(rafId)
}
function resumeLoop() {
  if (!sound) return
  // важный момент: переводим Howler на позицию, выбранную пользователем
  const newPos = (progress.value / 100) * (sound.duration() || 0)
  sound.seek(newPos)
  rafLoop()
}

// *** RAF-обновление прогресса ***
function updateProgress() {
  if (!sound) return
  const cur = (sound.seek() as number) || 0
  const dur = sound.duration() || 0
  progress.value = dur > 0 ? (cur / dur) * 100 : 0
  duration.value = dur
  displayedTime.value = formatTime(cur)
}
function rafLoop() {
  updateProgress()
  rafId = requestAnimationFrame(rafLoop)
}

// *** Громкость ***
function onVolumeChange(v: number) {
  volume.value = v
  isMuted.value = v === 0
  sound.volume(v)
}
function toggleMute() {
  isMuted.value = !isMuted.value
  sound.volume(isMuted.value ? 0 : volume.value)
}

// заглушки для prev/next — при необходимости подключите логику
function prevTrack() {
  /* TODO: вызвать смену трека */
}
function nextTrack() {
  /* TODO: вызвать смену трека */
}

// *** Инициализируем Howler ***
onMounted(() => {
  sound = new Howl({
    src: [props.src],
    html5: true,
    preload: true,
    autoplay: props.autoplay ?? false,
    loop: props.loop ?? false,
    volume: volume.value,
    onload: () => {
      duration.value = sound.duration() || 0
    },
    onplay: () => {
      isPlaying.value = true
      rafLoop()
    },
    onpause: () => {
      isPlaying.value = false
      cancelAnimationFrame(rafId)
    },
    onend: () => {
      isPlaying.value = false
      progress.value  = 0
      cancelAnimationFrame(rafId)
    }
  })
})

onBeforeUnmount(() => {
  sound.unload()
  cancelAnimationFrame(rafId)
})
</script>

<style scoped>
/* ПК‑специфические доработки, если понадобятся */
</style>
