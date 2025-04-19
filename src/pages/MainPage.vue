<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 pb-32">
    <h1 class="text-2xl font-bold mb-4">Смотри YouTube без VPN чмо</h1>

    <input
      v-model="youtubeUrl"
      type="text"
      placeholder="Вставь ссылку на YouTube"
      class="w-full max-w-md px-4 py-2 rounded-lg border mb-4"
    />

    <button
      @click="resolveVideo"
      class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
    >
      Смотреть
    </button>

    <div v-if="error" class="mt-4 text-red-500">{{ error }}</div>

    <!-- Аудиоплеер появляется после получения audioUrl -->
    <AudioPlayer
      :src="audioUrl"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AudioPlayer from '@/components/AudioPlayer.vue'
import { mockResolveMedia } from '@/mockResolve'

const youtubeUrl = ref<string>('')
const audioUrl = ref<string>('')
const error = ref<string>('')

async function resolveVideo() {
  error.value = ''
  audioUrl.value = ''

  if (!youtubeUrl.value) {
    error.value = 'Введите ссылку на видео'
    return
  }

  try {
    const response = await mockResolveMedia(youtubeUrl.value)

    if (response.data?.audio_url) {
      audioUrl.value = response.data.audio_url
    } else {
      error.value = 'Не удалось получить ссылку на аудио'
    }
  } catch (err) {
    error.value = 'Ошибка при загрузке аудио'
    console.error(err)
  }
}
</script>

<style scoped>
/* Используется pb-32 в корневом div для пространства под плеер */
</style>
