<template>
  <div
    class="w-full flex flex-col items-center justify-center px-4"
    :style="containerStyle"
  >
    <h1 class="text-2xl font-bold mb-4" :style="titleStyle">
      Смотри YouTube без VPN
    </h1>

    <input
      v-model="youtubeUrl"
      type="text"
      placeholder="Вставь ссылку на YouTube"
      class="w-full max-w-md px-4 py-2 rounded-lg mb-4"
      :style="inputStyle"
    />

    <button
      @click="resolveVideo"
      class="px-6 py-2 rounded-lg mb-4"
      :style="buttonStyle"
    >
      Смотреть
    </button>

    <p v-if="error" class="mt-4" :style="errorStyle">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { themeParams } from '@telegram-apps/sdk-vue'
import { resolveYouTubeVideo } from '@/api/resolve'

const youtubeUrl = ref('')
const error = ref('')

/** Цветовая схема из themeParams */
const containerStyle = computed(() => ({
  backgroundColor: themeParams.backgroundColor(),
  color: themeParams.textColor()
}))
const titleStyle = computed(() => ({ color: themeParams.accentTextColor() }))
const inputStyle = computed(() => ({
  backgroundColor: themeParams.secondaryBackgroundColor(),
  color: themeParams.textColor()
}))
const buttonStyle = computed(() => ({
  backgroundColor: themeParams.buttonColor(),
  color: themeParams.buttonTextColor()
}))
const errorStyle = computed(() => ({ color: themeParams.destructiveTextColor() }))

/** Что приходит от backend‑сервиса */
type ResolveResponse = {
  audio_url: string
  artist?: string
  title: string
  thumbnail_url?: string
}

/** Что отдаём родителю */
export type ResolvedPayload = {
  src: string
  artist: string
  title: string
  cover: string
}

/** События наружу */
const emit = defineEmits<{
  (e: 'resolved', payload: ResolvedPayload): void
  (e: 'loading', value: boolean): void
}>()

/** Получить аудио‑URL и отдать данные родителю */
async function resolveVideo() {
  error.value = ''

  if (!youtubeUrl.value) {
    error.value = 'Введите ссылку на видео'
    return
  }

  emit('loading', true)

  try {
    const data = (await resolveYouTubeVideo(youtubeUrl.value)) as ResolveResponse

    if (!data.audio_url) {
      error.value = 'Не удалось получить ссылку на аудио'
      return
    }

    const payload: ResolvedPayload = {
      src: data.audio_url,
      artist: data.artist ?? '—',
      title: data.title,
      cover: data.thumbnail_url ?? ''
    }

    emit('resolved', payload)
  } catch (err) {
    console.error(err)
    error.value = 'Ошибка при загрузке аудио'
  } finally {
    emit('loading', false)
  }
}
</script>
