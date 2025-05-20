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
  offSettingsButtonClick,
  onSettingsButtonClick,
  settingsButton,
} from '@telegram-apps/sdk-vue'

import SettingsModal from '@/components/SettingsModal.vue'

/* состояние окна настроек */
const isSettingsOpen = ref(false)
function openSettings() {
  isSettingsOpen.value = true
}


onMounted(() => {
  /* показываем кнопку */
  if (settingsButton.show.isAvailable()) settingsButton.show()

  /* подписываемся на клик */
  if (onSettingsButtonClick.isAvailable()) {
    onSettingsButtonClick(openSettings)
  }
})

onBeforeUnmount(() => {
  /* снимаем обработчик при размонтировании */
  if (offSettingsButtonClick.isAvailable()) {
    offSettingsButtonClick(openSettings)
  }
})




const isSidebarOpen = ref(false)
</script>

<style scoped>
main {
  overflow-x: hidden;
}
</style>
