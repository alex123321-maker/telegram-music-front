<template>
  <div :style="containerStyle" class="w-full flex flex-col items-center px-4">
    <h1 class="text-2xl font-bold mb-4" :style="titleStyle">
      Найди или вставь ссылку на YouTube
    </h1>

    <!-- Единый инпут с иконкой -->
    <div class="w-full max-w-md relative mb-4">
      <input
        v-model="query"
        type="text"
        placeholder="Ссылка или поисковый запрос"
        class="w-full px-4 py-2 rounded-lg pr-10"
        :style="inputStyle"
        @keydown.enter.prevent="handleSubmit"
        :disabled="searchLoading || resolveLoading"
      />
      <button
        @click="handleSubmit"
        class="absolute inset-y-0 right-0 flex items-center pr-3"
        :style="buttonIconStyle"
        :disabled="searchLoading || resolveLoading"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5"
             fill="none" stroke="currentColor" stroke-width="2"
             stroke-linecap="round" stroke-linejoin="round"
             viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>
    </div>

    <!-- Сообщения -->
    <p v-if="error" class="mt-2" :style="errorStyle">{{ error }}</p>

    <!-- Компонент списка видео: скелетон только во время searchLoading -->
    <VideoList
      :videos="videos"
      :loading="searchLoading"
      @select="selectVideo"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { themeParams } from '@telegram-apps/sdk-vue'
import { resolveYouTubeVideo } from '@/api/resolve'
import VideoList from '@/components/SearchResult.vue'

const API_KEY = 'AIzaSyBPeujaYVohiDobRdccR5JWfMNRgWA4YLw'
const maxResults = 10

interface VideoItem {
  id: { videoId: string }
  snippet: {
    thumbnails: { default: { url: string } }
    title: string
    channelTitle: string
  }
}

const query         = ref<string>('')
const videos        = ref<VideoItem[]>([])
const error         = ref<string | null>(null)
const searchLoading = ref<boolean>(false)
const resolveLoading = ref<boolean>(false)

const containerStyle  = computed(() => ({
  color          : themeParams.textColor()
}))
const titleStyle      = computed(() => ({ color: themeParams.accentTextColor() }))
const inputStyle      = computed(() => ({
  backgroundColor: themeParams.backgroundColor(),
  color          : themeParams.textColor(),
  outline        : 'none',       // всегда нет outline
  boxShadow      : 'none'
}))
const buttonIconStyle = computed(() => ({ color: themeParams.buttonTextColor() }))
const errorStyle      = computed(() => ({ color: themeParams.destructiveTextColor() }))

const emit = defineEmits<{
  (e: 'resolved', payload: { src: string; artist: string; title: string; cover: string }): void
  (e: 'loading', val: boolean): void
}>()

function looksLikeURL(str: string): boolean {
  return /^(https?:\/\/|www\.)/i.test(str)
}

async function handleSubmit() {
  if (!query.value.trim()) return

  // сбросим предыдущие результаты/ошибки
  videos.value = []
  error.value = null

  if (looksLikeURL(query.value)) {
    await resolveVideo(query.value)
  } else {
    await searchVideos(query.value)
  }
}

async function searchVideos(q: string) {
  searchLoading.value = true
  try {
    const url = new URL('https://www.googleapis.com/youtube/v3/search')
    url.searchParams.set('part', 'snippet')
    url.searchParams.set('q', q)
    url.searchParams.set('type', 'video')
    url.searchParams.set('maxResults', String(maxResults))
    url.searchParams.set('key', API_KEY)

    const res  = await fetch(url.toString())
    const json = await res.json()
    if (!res.ok) throw new Error(json.error?.message || 'Ошибка поиска')

    videos.value = json.items
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : String(e)
  } finally {
    searchLoading.value = false
    emit('loading', false)
  }
}

async function resolveVideo(link: string) {
  // отдельный флаг, не трогаем searchLoading и не эмитим туда
  resolveLoading.value = true
  emit('loading', true)

  try {
    const data = await resolveYouTubeVideo(link)
    if (!('audio_url' in data)) throw new Error('Не удалось получить ссылку на аудио')

    emit('resolved', {
      src   : data.audio_url,
      artist: data.artist || '—',
      title : data.title,
      cover : data.thumbnail_url || ''
    })
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : String(e)
  } finally {
    resolveLoading.value = false
  emit('loading', false)

  }
}

function selectVideo(item: VideoItem) {
  const link = `https://www.youtube.com/watch?v=${item.id.videoId}`
  resolveVideo(link)
}
</script>

<style scoped>
/* Tailwind + themeParams покрывают всё */
</style>
