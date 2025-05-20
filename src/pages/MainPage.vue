<template>
  <div
    class="flex box-border h-dvh"
    :style="{ background: themeParams.backgroundColor(), color: themeParams.textColor() }"
  >
    <Sidebar @toggle="isSidebarOpen = $event" />

    <main
    :style="safeAreaStyle"
      class="flex-1 h-full transition-all duration-300 relative overflow-hidden"
    >
      <MainContent />
    </main>
  <SettingsModal v-model="isSettingsOpen" />

  </div>
</template>

<script setup lang="ts">
import { themeParams,useSignal,viewport } from '@telegram-apps/sdk-vue'
import Sidebar     from '@/components/SideBar.vue'
import MainContent from '@/components/MainContent.vue'

import { computed, onMounted, onBeforeUnmount, ref } from 'vue'
import {
  onSettingsButtonClick,
} from '@telegram-apps/sdk'

import SettingsModal from '@/components/SettingsModal.vue'

/* состояние окна настроек */
const isSettingsOpen = ref(true)
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
  isSettingsOpen.value = false

})

const insets = useSignal(viewport.safeAreaInsets)

const safeAreaStyle = computed(() => {
  const { top, right, bottom, left } = insets.value
  return { padding: `${bottom}px ${left}px ${right}px ${top}px` }
})


const isSidebarOpen = ref(false)
</script>

<style scoped>
main {
  overflow-x: hidden;
}
</style>
