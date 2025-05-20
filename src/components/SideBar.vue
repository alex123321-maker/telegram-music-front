<!-- src/components/SideBar.vue -->
<template>
  <div class="sidebar-wrapper">
    <SideBarMobile
      v-if="isMobile"
      :is-open="isOpen"
      @toggle="onToggle"
    />
    <SideBarDesktop v-else />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import SideBarMobile from '@/components/SideBarMobile.vue'
import SideBarDesktop from '@/components/SideBarDesktop.vue'

const isOpen = ref(false)
const isMobile = ref(false)
const emit = defineEmits<{
  (e: 'toggle', val: boolean): void
}>()

// Определяем текущий breakpoint
function updateIsMobile() {
  isMobile.value = window.innerWidth < 768
}

// Пробрасываем событие наружу
function onToggle(val: boolean) {
  isOpen.value = val
  emit('toggle', val)
}

onMounted(() => {
  updateIsMobile()
  window.addEventListener('resize', updateIsMobile)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateIsMobile)
})
</script>

<style scoped>
.sidebar-wrapper {
  min-height: 100vh;
  padding-bottom: 3.5rem; /* соответствует pb-14 */
  background-color: var(--tg-theme-background-color);
  border-right: 1px solid var(--tg-theme-section-separator-color);
}
</style>
