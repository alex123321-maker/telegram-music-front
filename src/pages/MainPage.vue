<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
    <h1 class="text-2xl font-bold mb-4">Смотри YouTube без VPN чмо</h1>

    <input
      v-model="youtubeUrl"
      type="text"
      placeholder="Вставь ссылку на YouTube"
      class="w-full max-w-md px-4 py-2 rounded-lg border border-gray-300 mb-4"
    />

    <button
      @click="resolveVideo"
      class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
    >
      Смотреть
    </button>

    <div v-if="embedUrl" class="mt-6 w-full max-w-xl aspect-video">
      <iframe
        :src="embedUrl"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        class="w-full h-full rounded-lg shadow-lg"
      ></iframe>
    </div>

    <div v-if="error" class="mt-4 text-red-500">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

const youtubeUrl = ref<string>('')
const embedUrl = ref<string>('')
const error = ref<string>('')

async function resolveVideo() {
  error.value = ''
  embedUrl.value = ''

  if (!youtubeUrl.value) {
    error.value = 'Введите ссылку на видео'
    return
  }

  try {
    const response = await axios.post('https://mandrikov-ad.ru:3000/api/resolve', {
      url: youtubeUrl.value
    },{ timeout: 30000 } )

    if (response.data?.embed_url) {
      embedUrl.value = response.data.embed_url
    } else {
      error.value = 'Не удалось получить ссылку на видео'
    }
  } catch (err) {
    error.value = 'Ошибка при загрузке видео'
    console.error(err)
  }
}
</script>
