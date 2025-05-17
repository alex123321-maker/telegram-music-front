<template>
  <div :style="wrapperStyle" class="min-h-screen pb-14">
    <SideBarMobile
      v-if="isMobile"
      :is-open="isOpen"
      @toggle="onToggle"
    />
    <SideBarDesktop v-else />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { themeParams } from '@telegram-apps/sdk-vue'
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

// Динамический фон по теме
const wrapperStyle = computed(() => ({
  backgroundColor: themeParams.backgroundColor()
}))
</script>

<style scoped>
.min-h-screen {
  min-height: 100vh;
}
</style>
