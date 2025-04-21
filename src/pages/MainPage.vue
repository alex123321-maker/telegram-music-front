<template>
  <div class="flex box-border h-dvh bg-gray-100">
    <Sidebar @toggle="isSidebarOpen = $event" />

    <main :class="['flex-1 h-full transition-all duration-300', isSidebarOpen ? 'md:mr-128' : '']">

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

    <!-- Аудиоплеер появляется после получения audioUrl -->
    <AudioPlayer
      v-if="audioUrl"
      :src="audioUrl"
      :artist="artist"
      :title="title"
      :cover="cover"

    />

  </div>
    </main>
  </div>
</template>


<script setup lang="ts">
import { ref } from 'vue'
import AudioPlayer from '@/components/AudioPlayer.vue'
import Sidebar from '@/components/SideBar.vue'

import { mockResolveMedia } from '@/mockResolve'


const isSidebarOpen = ref(false)
const youtubeUrl = ref<string>('')
const audioUrl = ref<string>('')
const error = ref<string>('')
const artist = ref<string>('')
const title = ref<string>('')
const cover = ref<string>('')


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
      artist.value=response.data.artist ? response.data.artist:"Нет артиста"
      title.value=response.data.title
      cover.value=response.data.thumbnail_url ? response.data.thumbnail_url : "https://mir-s3-cdn-cf.behance.net/project_modules/1400/073c9f95753035.5e9efb0182827.jpg"
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
