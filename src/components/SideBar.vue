<template>
  <!-- Затемнение фона -->
  <transition name="fade">
  <div
    v-if="isOpen && isMobile"
    class="fixed inset-0 bg-black opacity-50 z-30"
    @click="closeSidebar"
  />
  </transition>

  <!-- Сайдбар -->
  <aside
    ref="sidebar"
    :class="[
      'bg-gray-500 shadow-md p-4 h-full w-64 fixed md:w-80 md:relative top-0 right-0 z-40 transform transition-transform duration-300 ease-in-out',
      isOpen ? 'translate-x-0' : 'translate-x-full',
      'md:translate-x-0 md:block'
    ]"
  >
    <h2 class="text-xl font-bold mb-4 text-white">Теги</h2>

    <!-- 🔍 Поиск -->
    <input
      v-model="search"
      @input="onInput"
      type="text"
      placeholder="Поиск тегов..."
      class="w-full mb-4 px-3 py-1 rounded bg-white text-gray-700 text-sm"
    />

    <!-- 🔄 Переключатель фильтрации -->
    <div class="mb-2">
      <div class="flex rounded-full overflow-hidden border bg-white text-sm">
        <button
          @click="setFilterMode(false)"
          class="flex items-center gap-1 flex-1 px-3 py-1 justify-center transition"
          :class="!matchAllTags ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'"
        >
          хоть один
        </button>
        <button
          @click="setFilterMode(true)"
          class="flex items-center gap-1 flex-1 px-3 py-1 justify-center transition"
          :class="matchAllTags ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'"
        >
          все
        </button>
      </div>
      <p class="text-xs text-gray-200 mt-1">
        {{ matchAllTags
          ? 'Показать треки, содержащие все выбранные теги'
          : 'Показать треки, содержащие хотя бы один из выбранных тегов' }}
      </p>
    </div>

    <!-- 🏷️ Список тегов -->
    <div class="flex flex-wrap gap-2">
      <button
        v-for="tag in filteredTags"
        :key="tag"
        @click="toggleTag(tag)"
        :class="[
          'px-3 py-1 rounded-full text-sm transition-all duration-200',
          selectedTags.includes(tag)
            ? 'bg-blue-600 text-white'
            : 'bg-white text-gray-700 hover:bg-blue-100'
        ]"
      >
        {{ tag }}
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const isOpen = ref(false)
const isMobile = ref(false)
const emit = defineEmits<{ (e: 'toggle', val: boolean): void }>()

// Мок теги (будут приходить с бэка)
const tags = ref<string[]>([
  'Реактивные рецепты',
  'Завтраки',
  'Постные блюда',
  'Быстро и вкусно',
  'Без сахара',
  'Микс витаминов',
  'Салаты',
  'Десерты',
  'Овощи',
  'Кето',
  'ЗОЖ'
])

const selectedTags = ref<string[]>([])
const search = ref('')

// Фильтрация по поиску
const filteredTags = computed(() =>
  tags.value.filter(tag => tag.toLowerCase().includes(search.value.toLowerCase()))
)

const matchAllTags = ref(false) // true = "все теги", false = "любой тег"

function setFilterMode(mode: boolean) {
  matchAllTags.value = mode
}

// Выбор/удаление тега
function toggleTag(tag: string) {
  if (selectedTags.value.includes(tag)) {
    selectedTags.value = selectedTags.value.filter(t => t !== tag)
  } else {
    selectedTags.value.push(tag)
  }
}



// Swipe logic
let touchStartX = 0
let touchCurrentX = 0
let touchStartTime = 0
const SWIPE_THRESHOLD = 75
const SWIPE_TIME_MAX = 300

function handleTouchStart(e: TouchEvent) {
  const target = e.target as HTMLElement
  if (target.closest('.volume-control')) return

  const touchX = e.touches[0].clientX
  const edgeThreshold = window.innerWidth * 0.2
  if (touchX > window.innerWidth - edgeThreshold) {
    touchStartX = touchX
    touchStartTime = Date.now()
  } else {
    touchStartX = 0
  }
}
function onInput(e: Event) {
  search.value = (e.target as HTMLInputElement).value
}
function handleTouchMove(e: TouchEvent) {
  touchCurrentX = e.touches[0].clientX
}

function handleTouchEnd() {
  const delta = touchCurrentX - touchStartX
  const time = Date.now() - touchStartTime
  const isRealSwipe = Math.abs(delta) > SWIPE_THRESHOLD && time < SWIPE_TIME_MAX

  if (!isOpen.value && delta < -SWIPE_THRESHOLD && isRealSwipe) {
    isOpen.value = true
    emit('toggle', true)
  }

  if (isOpen.value && delta > SWIPE_THRESHOLD && isRealSwipe) {
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
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 0.5;
}
</style>
