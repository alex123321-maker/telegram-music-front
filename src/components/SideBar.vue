<template>
  <!-- Overlay для клика вне сайдбара -->
  <div
    v-if="isOpen && isMobile"
    class="fixed inset-0 bg-black opacity-15 z-30"
    @click="closeSidebar"
  ></div>

  <!-- Сайдбар справа -->
  <aside
    ref="sidebar"
    :class="[
      'bg-gray-500 shadow-md p-4 h-full w-64 fixed md:w-80 md:relative top-0 right-0 z-40 transform transition-transform duration-300 ease-in-out',
      isOpen ? 'translate-x-0' : 'translate-x-full',
      'md:translate-x-0 md:block'
    ]"
  >
    <h2 class="text-xl font-bold mb-6 text-white">Меню</h2>
    <nav class="space-y-2">
      <button class="w-full text-left px-4 py-2 rounded hover:bg-blue-100">Главная</button>
      <button class="w-full text-left px-4 py-2 rounded hover:bg-blue-100">Плейлисты</button>
      <button class="w-full text-left px-4 py-2 rounded hover:bg-blue-100">Профиль</button>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const isOpen = ref(false)
const isMobile = ref(false)
const emit = defineEmits<{ (e: 'toggle', val: boolean): void }>()
let touchStartX = 0
let touchCurrentX = 0

function handleTouchStart(e: TouchEvent) {
  touchStartX = e.touches[0].clientX
}

function handleTouchMove(e: TouchEvent) {
  touchCurrentX = e.touches[0].clientX
}

function handleTouchEnd() {
  const delta = touchCurrentX - touchStartX

  // Открытие свайпом справа (при касании с правого края)
  if (!isOpen.value && delta < -150) {
    isOpen.value = true
    emit('toggle', true)
  }

  // Закрытие свайпом влево
  if (isOpen.value && delta > 50) {
    isOpen.value = false
    emit('toggle', false)
  }
}

function closeSidebar() {
  isOpen.value = false
  emit('toggle', false)
}

onMounted(() => {
  isMobile.value = window.innerWidth < 768

  window.addEventListener('touchstart', handleTouchStart)
  window.addEventListener('touchmove', handleTouchMove)
  window.addEventListener('touchend', handleTouchEnd)
})

onBeforeUnmount(() => {
  window.removeEventListener('touchstart', handleTouchStart)
  window.removeEventListener('touchmove', handleTouchMove)
  window.removeEventListener('touchend', handleTouchEnd)
})
</script>
