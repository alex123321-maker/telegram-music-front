<template>
  <!-- Оверлей -->
  <MyOverlay :visible="isOpen" @click="closeSidebar" />

  <!-- Сам сайдбар -->
  <aside
    ref="sidebar"
    class="fixed top-0 right-0 px-3 z-40 h-full w-64 shadow-md transform transition-transform duration-300 ease-in-out"
    :style="sidebarStyle"
  >
    <MySection title="Поиск">
      <SearchInput v-model="searchQuery" placeholder="Искать тег..." />
    </MySection>
    <MySection title="Дополнительно">
      <ToggleSwitch v-model="matchAllTags"/>
      <p class="text-xs mt-1" :style="themeParams.textColor()">
        {{ matchAllTags
          ? 'Показать треки, содержащие все выбранные теги'
          : 'Показать треки, содержащие хотя бы один из выбранных тегов' }}
      </p>
    </MySection>
    <MySection title="Теги">
      <TagList v-model="selectedTags"/>
    </MySection>


  </aside>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { themeParams } from '@telegram-apps/sdk-vue'
import MyOverlay from '@/components/common/MyOverlay.vue'
import MySection from '@/components/common/MySection.vue'
import SearchInput from '@/components/common/SearchInput.vue'
import TagList from '@/components/common/TagList.vue'
import ToggleSwitch from '@/components/common/ToggleSwitch.vue'

const emit = defineEmits<{
  (e: 'toggle', val: boolean): void
}>()

const isOpen = ref(false)

const searchQuery   = ref('')
const selectedTags  = ref<number[]>([])
const matchAllTags  = ref(false)

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

// Свайповая логика
let touchStartX = 0, touchCurrentX = 0, touching = false
const EDGE_THRESHOLD  = 70
const SWIPE_THRESHOLD = 50

function onTouchStart(e: TouchEvent) {
  if (e.touches.length !== 1) return
  touchStartX   = e.touches[0].clientX
  touchCurrentX = touchStartX
  touching      = true
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
    if (touchStartX > window.innerWidth - EDGE_THRESHOLD && deltaX < -SWIPE_THRESHOLD) {
      openSidebar()
    }
  } else {
    if (deltaX > SWIPE_THRESHOLD) {
      closeSidebar()
    }
  }
}

onMounted(() => {
  window.addEventListener('touchstart', onTouchStart)
  window.addEventListener('touchmove',  onTouchMove)
  window.addEventListener('touchend',   onTouchEnd)
})
onBeforeUnmount(() => {
  window.removeEventListener('touchstart', onTouchStart)
  window.removeEventListener('touchmove',  onTouchMove)
  window.removeEventListener('touchend',   onTouchEnd)
})

// фон боковой панели
const sidebarStyle = computed(() => ({
  backgroundColor: themeParams.sectionBackgroundColor(),
  transform:       isOpen.value ? 'translateX(0)' : 'translateX(100%)',
  borderLeft:      `1px solid ${themeParams.sectionSeparatorColor()}`
}))


</script>

<style scoped>
/* никаких жёстких цветов — всё задаётся через inline-стили */
</style>
