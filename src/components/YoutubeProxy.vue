<template>
  <div class="flex flex-col items-center justify-center bg-gray-100 px-4">
    <h1 class="text-2xl font-bold mb-4">Смотри YouTube без VPN чмо</h1>

    <input
      v-model="youtubeUrl"
      type="text"
      placeholder="Вставь ссылку на YouTube"
      class="w-full max-w-md px-4 py-2 rounded-lg border text-black mb-4"
    />

    <button
      @click="resolveVideo"
      class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
    >
      Смотреть
    </button>

    <div v-if="error" class="mt-4 text-red-500">{{ error }}</div>

    <AudioPlayer
      v-if="audioUrl"
      :src="audioUrl"
      :artist="artist"
      :title="title"
      :cover="cover"
    />
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import AudioPlayer from '@/components/AudioPlayer.vue'
import { resolveYouTubeVideo } from '@/api/resolve'

const youtubeUrl = ref('')
const audioUrl = ref('')
const error = ref('')
const artist = ref('')
const title = ref('')
const cover = ref('')

async function resolveVideo() {
  error.value = ''
  audioUrl.value = ''

  if (!youtubeUrl.value) {
    error.value = 'Введите ссылку на видео'
    return
  }

  try {
    const data = await resolveYouTubeVideo(youtubeUrl.value)
    console.log(data)
    if (data.audio_url) {
      audioUrl.value = data.audio_url
      artist.value = data.artist ?? 'Нет артиста'
      title.value = data.title
      cover.value = data.thumbnail_url
    } else {
      error.value = 'Не удалось получить ссылку на аудио'
    }
  } catch (err) {
    error.value = 'Ошибка при загрузке аудио'
    console.error(err)
  }
}
</script>

