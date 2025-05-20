<template>
  <div
    class="flex box-border h-dvh"


  >
    <Sidebar @toggle="isSidebarOpen = $event" />

    <main
      class="flex-1 h-full transition-all duration-300 relative overflow-hidden"
    >
      <MainContent />
    </main>
  <SettingsModal v-model="isSettingsOpen" />

  </div>
</template>

<script setup lang="ts">
import Sidebar     from '@/components/SideBar.vue'
import MainContent from '@/components/MainContent.vue'

import { onMounted, onBeforeUnmount, ref } from 'vue'
import {
  onSettingsButtonClick,
} from '@telegram-apps/sdk'

import SettingsModal from '@/components/SettingsModal.vue'

/* состояние окна настроек */
const isSettingsOpen = ref(false)
function openSettings() {
  console.log("OPEN SETTINGS")
  isSettingsOpen.value = true
}

/* ——— подписка на кнопку Telegram ——— */
let detach: (() => void) | null = null

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
  isSettingsOpen.value = false

})




const isSidebarOpen = ref(false)
</script>

<style scoped>
main {
  overflow-x: hidden;
}
</style>
