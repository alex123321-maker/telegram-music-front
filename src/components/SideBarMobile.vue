<template>
  <!-- Оверлей -->
  <MyOverlay :visible="isOpen" @click="closeSidebar" />

  <!-- Сам сайдбар -->
  <aside
    ref="sidebar"
    :class="[
      'bg-gray-500 shadow-md p-4 h-full w-64 fixed top-0 right-0 z-40 transform transition-transform duration-300 ease-in-out',
      isOpen ? 'translate-x-0' : 'translate-x-full',
    ]"
  >
    <MySection title="Поиск">
      <SearchInput v-model="searchQuery" placeholder="Искать..." />
    </MySection>

    <MySection title="Теги">
      <TagList v-model="selectedTags" :tags="tags" />
      <div class="flex gap-2 mt-2">
        <button
          @click="setFilterMode(false)"
          class="px-3 py-1 rounded"
          :class="!matchAllTags
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-800'"
        >
          хоть один
        </button>
        <button
          @click="setFilterMode(true)"
          class="px-3 py-1 rounded"
          :class="matchAllTags
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-800'"
        >
          все
        </button>
      </div>
    </MySection>

    <MySection title="Дополнительно">
      <ToggleSwitch v-model="onlyFavorites" label="Только избранное" />
    </MySection>
  </aside>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import MyOverlay from '@/components/common/MyOverlay.vue'
import MySection from '@/components/common/MySection.vue'
import SearchInput from '@/components/common/SearchInput.vue'
import TagList from '@/components/common/TagList.vue'
import ToggleSwitch from '@/components/common/ToggleSwitch.vue'

const isOpen = ref(false)
const emit = defineEmits<{
  (e: 'toggle', val: boolean): void
}>()

// Пример списка тегов — замените на свои данные
const tags = ref<string[]>([
  'Реактивные рецепты',
  'Завтраки',
  'Постные блюда',
  'Быстро и вкусно',
  'Без сахара',
  'Микс витаминов',
  'Салаты',
])

const searchQuery = ref('')
const selectedTags = ref<string[]>([])
const matchAllTags = ref(false)
const onlyFavorites = ref(false)

function setFilterMode(val: boolean) {
  matchAllTags.value = val
}

function openSidebar() {
  isOpen.value = true
  emit('toggle', true)
}

function closeSidebar() {
  isOpen.value = false
  emit('toggle', false)
}

// --- Логика свайпов справа налево для открытия и слева направо для закрытия ---
let touchStartX = 0
let touchCurrentX = 0
let touching = false

// Порог в пикселях: отступ от правого края для начала открытия,
// и минимальное смещение для срабатывания жеста.
const EDGE_THRESHOLD = 70
const SWIPE_THRESHOLD = 50

function onTouchStart(e: TouchEvent) {
  if (e.touches.length !== 1) return
  touchStartX = e.touches[0].clientX
  touchCurrentX = touchStartX
  touching = true
}

function onTouchMove(e: TouchEvent) {
  if (!touching || e.touches.length !== 1) return
  touchCurrentX = e.touches[0].clientX
}

function onTouchEnd() {
  if (!touching) return
  const deltaX = touchCurrentX - touchStartX
  touching = false

  if (!isOpen.value) {
    // свайп справа(около правого края) → влево для открытия
    if (
      touchStartX > window.innerWidth - EDGE_THRESHOLD &&
      deltaX < -SWIPE_THRESHOLD
    ) {
      openSidebar()
    }
  } else {
    // свайп слева → вправо для закрытия
    if (deltaX > SWIPE_THRESHOLD) {
      closeSidebar()
    }
  }
}

onMounted(() => {
  window.addEventListener('touchstart', onTouchStart)
  window.addEventListener('touchmove', onTouchMove)
  window.addEventListener('touchend', onTouchEnd)
})

onBeforeUnmount(() => {
  window.removeEventListener('touchstart', onTouchStart)
  window.removeEventListener('touchmove', onTouchMove)
  window.removeEventListener('touchend', onTouchEnd)
})
</script>

<style scoped>
/* Анимация затемнения вынесена в MyOverlay */
</style>
