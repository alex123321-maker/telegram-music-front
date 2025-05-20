<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import {
  onSettingsButtonClick,
} from '@telegram-apps/sdk'

import SettingsModal from '@/components/SettingsModal.vue'

/* состояние окна настроек */
const isSettingsOpen = ref(false)
function openSettings() {
  isSettingsOpen.value = true
}

/* ——— подписка на кнопку Telegram ——— */
let detach: (() => void) | null = null   // сюда сохраним «отписку»

onMounted(() => {
  if (onSettingsButtonClick.isAvailable()) {
    // вариант 1: сохранить возвращённую функцию-«отписку»
    detach = onSettingsButtonClick(openSettings)

    /* — либо вариант 2 —
       onSettingsButtonClick(openSettings)          // подписались
       //и всё; отписка будет через offSettingsButtonClick ниже */
  }
})

onBeforeUnmount(() => {
  detach?.()


})
</script>

<template>
  <RouterView />
  <SettingsModal v-model="isSettingsOpen" />
</template>
