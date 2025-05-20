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
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { themeParams,useSignal,viewport } from '@telegram-apps/sdk-vue'
import Sidebar     from '@/components/SideBar.vue'
import MainContent from '@/components/MainContent.vue'

const insets = useSignal(viewport.safeAreaInsets)

const safeAreaStyle = computed(() => {
  const { top, right, bottom, left } = insets.value
  return { padding: `${top}px ${right}px ${bottom}px ${left}px` }
})


const isSidebarOpen = ref(false)
</script>

<style scoped>
main {
  overflow-x: hidden;
}
</style>
