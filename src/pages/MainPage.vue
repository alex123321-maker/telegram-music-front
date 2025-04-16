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
      @click="embedVideo"
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

const youtubeUrl = ref<string>('')
const embedUrl = ref<string>('')
const error = ref<string>('')

function extractVideoId(url: string): string | null {
  const regex =
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  const match = url.match(regex)
  return match ? match[1] : null
}

function embedVideo(): void {
  error.value = ''
  const id = extractVideoId(youtubeUrl.value)
  if (id) {
    embedUrl.value = `https://www.youtube.com/embed/${id}?rel=0`
  } else {
    embedUrl.value = ''
    error.value = 'Неверная ссылка на YouTube'
  }
}
</script>
