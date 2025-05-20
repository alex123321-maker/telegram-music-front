<template>
  <div class="audio-player w-full">
    <!-- Теги трека -->
    <MediaTagBar :media_id="media_id" />

    <!-- Прогресс -->
    <SeekBar
      v-model:progress="progress"
      :duration="duration"
      @start="pauseLoop"
      @end="resumeLoop"
    />

    <!-- Нижняя панель -->
    <div class="bottom-bar mx-auto flex items-center justify-between pt-3">
      <!-- Навигация + Play/Pause -->
      <div class="controls flex items-center gap-2">
        <SkipButton direction="prev" @click="prevTrack">
          <svg class="w-5 h-5 -scale-x-100 fill-current" viewBox="-2 0 24 24">
            <path d="M5 4l7 8-7 8V4zM12 4l7 8-7 8V4z"/>
          </svg>
        </SkipButton>

        <PlayPauseButton :is-playing="isPlaying" @toggle="togglePlay" />

        <SkipButton direction="next" @click="nextTrack">
          <svg class="w-5 h-5 fill-current" viewBox="-2 0 24 24">
            <path d="M5 4l7 8-7 8V4zM12 4l7 8-7 8V4z"/>
          </svg>
        </SkipButton>
      </div>

      <!-- Информация о треке -->
      <TrackInfo
        class="track-info flex-1 px-4"
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

import MediaTagBar     from '@/components/audio/MediaTagBar.vue'
import SeekBar         from '@/components/audio/SeekBar.vue'
import PlayPauseButton from '@/components/audio/PlayPauseButton.vue'
import SkipButton      from '@/components/audio/SkipButton.vue'
import TrackInfo       from '@/components/audio/TrackInfo.vue'
import VolumeControl   from '@/components/audio/VolumeControl.vue'

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

const progress      = ref(0)
const duration      = ref(0)
const displayedTime = ref('00:00')
const isPlaying     = ref(false)
const volume        = ref(1)
const isMuted       = ref(false)

let sound: Howl
let rafId = 0

function formatTime(sec: number) {
  const m = Math.floor(sec/60)
  const s = Math.floor(sec%60).toString().padStart(2,'0')
  return `${m}:${s}`
}

function togglePlay() {
  if (!sound) return
  if(isPlaying.value){ sound.pause()}else {sound.play()}
}

function pauseLoop() {

  cancelAnimationFrame(rafId)
}

function resumeLoop() {
  if (!sound) return
  const target = (progress.value / 100) * duration.value
  sound.seek(target)
  rafLoop()
}

function updateProgress() {
  if (!sound) return
  const cur = (sound.seek() as number) || 0
  const dur = sound.duration() || 0
  progress.value = dur>0 ? (cur/dur)*100 : 0
  duration.value = dur
  displayedTime.value = formatTime(cur)
}

function rafLoop() {
  updateProgress()
  rafId = requestAnimationFrame(rafLoop)
}

function onVolumeChange(v: number) {
  volume.value = v
  sound.volume(v)
}

function toggleMute(muted: boolean) {
  isMuted.value = muted
  sound.volume(muted ? 0 : volume.value)
}

function prevTrack() {}
function nextTrack() {}

onMounted(() => {
  sound = new Howl({
    src: [props.src], html5: true, preload: true,
    autoplay: props.autoplay||false, loop: props.loop||false, volume: volume.value,
    onload: () => duration.value = sound.duration()||0,
    onplay: () => { isPlaying.value = true; rafLoop() },
    onpause: () => { isPlaying.value = false; cancelAnimationFrame(rafId) },
    onend: () => { isPlaying.value=false; progress.value=0; cancelAnimationFrame(rafId) }
  })
})

onBeforeUnmount(() => {
  sound.unload()
  cancelAnimationFrame(rafId)
})
</script>


<style scoped>
.audio-player {
  width: 100%;
}

/* нижняя панель плеера */
.bottom-bar {
  background: var(--bg-header);   /* универсальное для хедеров/футеров */
  color: var(--text);
  border-top: 1px solid var(--border);
}

.controls {
  /* при необходимости можно задать gap через var(); пока достаточно Tailwind-classes */
}

.track-info {
  /* padding заданы классами px-4 */
}
</style>
