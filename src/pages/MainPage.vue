<template>
  <div
    class="flex box-border h-dvh"
    :style="{ background: themeParams.backgroundColor(), color: themeParams.textColor() }"
  >
    <Sidebar @toggle="isSidebarOpen = $event" />

    <main
      class="flex-1 h-full transition-all duration-300 relative overflow-hidden"
    >
      <MainContent />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { themeParams } from '@telegram-apps/sdk-vue'
import Sidebar     from '@/components/SideBar.vue'
import MainContent from '@/components/MainContent.vue'

const isSidebarOpen = ref(false)
</script>

<style scoped>
main {
  overflow-x: hidden;
}
</style>
