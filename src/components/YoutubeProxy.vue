<template>
  <div class="search-input-container">
    <h1 class="title">Найди или вставь ссылку на YouTube</h1>

    <div class="input-wrapper">
      <input
        v-model="query"
        type="text"
        placeholder="Ссылка или поисковый запрос"
        class="input-field"
        @keydown.enter.prevent="handleSubmit"
        :disabled="searchLoading || resolveLoading"
      />
      <button
        @click="handleSubmit"
        class="icon-button"
        :disabled="searchLoading || resolveLoading"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>
    </div>

    <p v-if="error" class="error-msg">{{ error }}</p>

    <VideoList
      :videos="videos"
      :loading="searchLoading"
      @select="selectVideo"
      @scroll-bottom="loadMoreVideos"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
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

const query = ref('')
const currentQuery = ref('')
const videos = ref<VideoItem[]>([])
const nextPageToken = ref<string | null>(null)
const error = ref<string | null>(null)
const searchLoading = ref(false)
const resolveLoading = ref(false)

const emit = defineEmits<{
  (e: 'resolved', payload: { src: string; artist: string; title: string; cover: string }): void
  (e: 'loading', val: boolean): void
}>()

function looksLikeURL(str: string): boolean {
  return /^(https?:\/\/|www\.)/i.test(str)
}

async function handleSubmit() {
  if (!query.value.trim()) return
  error.value = null

  if (looksLikeURL(query.value)) {
    await resolveVideo(query.value)
  } else {
    await searchNewVideos(query.value)
  }
}

async function searchNewVideos(q: string) {
  videos.value = []
  nextPageToken.value = null
  currentQuery.value = q
  await loadMoreVideos()
}

async function loadMoreVideos() {
  if (searchLoading.value || !currentQuery.value) return
  searchLoading.value = true
  try {
    const url = new URL('https://www.googleapis.com/youtube/v3/search')
    url.searchParams.set('part', 'snippet')
    url.searchParams.set('q', currentQuery.value)
    url.searchParams.set('type', 'video')
    url.searchParams.set('maxResults', String(maxResults))
    url.searchParams.set('key', API_KEY)
    if (nextPageToken.value) {
      url.searchParams.set('pageToken', nextPageToken.value)
    }

    const res = await fetch(url.toString())
    const json = await res.json()
    if (!res.ok) throw new Error(json.error?.message || 'Ошибка поиска')

    videos.value.push(...json.items)
    nextPageToken.value = json.nextPageToken || null
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : String(e)
  } finally {
    searchLoading.value = false
  }
}

async function resolveVideo(link: string) {
  resolveLoading.value = true
  emit('loading', true)
  try {
    const data = await resolveYouTubeVideo(link)
    if (!('audio_url' in data)) throw new Error('Не удалось получить ссылку на аудио')

    emit('resolved', {
      src: data.audio_url,
      artist: data.artist || '—',
      title: data.title,
      cover: data.thumbnail_url || ''
    })
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : String(e)
  } finally {
    resolveLoading.value = false
    emit('loading', false)
  }
}

function selectVideo(item: VideoItem) {
  resolveVideo(`https://www.youtube.com/watch?v=${item.id.videoId}`)
}
</script>

<style scoped>
.search-input-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Заголовок */
.title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text-accent);
}

/* Обёртка для инпута и кнопки */
.input-wrapper {
  position: relative;
  width: 100%;
  max-width: 24rem;
  margin-bottom: 1rem;
}

/* Поле ввода */
.input-field {
  width: 100%;
  padding: 0.5rem 2.5rem 0.5rem 1rem;
  border-radius: 0.5rem;
  background: var(--bg-header);
  color: var(--text);
  border: 1px solid var(--border);
  outline: none;
  transition: box-shadow 0.2s ease;
}
.input-field:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.input-field::placeholder {
  color: var(--text-muted);
}
.input-field:focus {
  box-shadow: 0 0 0 2px var(--btn-bg);
}

/* Кнопка-иконка */
.icon-button {
  position: absolute;
  top: 50%;
  right: 0.75rem;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--text-link);
  transition: color 0.2s ease;
}
.icon-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* SVG-иконка */
.icon {
  width: 1.25rem;
  height: 1.25rem;
}

/* Сообщение об ошибке */
.error-msg {
  margin-top: 0.5rem;
  color: var(--text-destructive);
}
</style>
