<!-- src/components/SideBar.vue -->
<template>
  <!-- Оверлей -->
  <MyOverlay :visible="isOpen" @click="closeSidebar" />

  <!-- Сам сайдбар -->
  <aside
    ref="sidebar"
    class="sidebar-mobile"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
  >
    <MySection title="Поиск">
      <SearchInput v-model="searchQuery" placeholder="Искать тег..." />
    </MySection>
    <MySection title="Дополнительно">
      <ToggleSwitch v-model="matchAllTags" />
      <p class="hint mt-1 text-xs">
        {{ matchAllTags
          ? 'Показать треки, содержащие все выбранные теги'
          : 'Показать треки, содержащие хотя бы один из выбранных тегов' }}
      </p>
    </MySection>
    <MySection title="Теги">
      <TagList v-model="selectedTags" />
    </MySection>
  </aside>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import MyOverlay      from '@/components/common/MyOverlay.vue'
import MySection      from '@/components/common/MySection.vue'
import SearchInput    from '@/components/common/SearchInput.vue'
import TagList        from '@/components/common/TagList.vue'
import ToggleSwitch   from '@/components/common/ToggleSwitch.vue'

const emit         = defineEmits<{
  (e: 'toggle', val: boolean): void
}>()

const isOpen       = ref(false)
const searchQuery  = ref('')
const selectedTags = ref<number[]>([])
const matchAllTags = ref(false)

function openSidebar() {
  isOpen.value = true
  emit('toggle', true)
}

function closeSidebar() {
  isOpen.value = false
  emit('toggle', false)
}

// свайповая логика
let touchStartX = 0, touchCurrentX = 0, touching = false
const EDGE_THRESHOLD  = 70
const SWIPE_THRESHOLD = 50

function onTouchStart(e: TouchEvent) {
  touching = e.touches.length === 1
  if (touching) touchStartX = e.touches[0].clientX
}
function onTouchMove(e: TouchEvent) {
  if (touching) touchCurrentX = e.touches[0].clientX
}
function onTouchEnd() {
  if (!touching) return
  const deltaX = touchCurrentX - touchStartX
  touching = false
  if (!isOpen.value) {
    if (touchStartX > window.innerWidth - EDGE_THRESHOLD && deltaX < -SWIPE_THRESHOLD) {
      openSidebar()
    }
  } else if (deltaX > SWIPE_THRESHOLD) {
    closeSidebar()
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
</script>

<style scoped>
.sidebar-mobile {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 16rem;
  padding: 0 1rem;
  background-color: var(--tg-theme-secondary-bg-color);
  border-left: 1px solid var(--tg-theme-section-separator-color);
  transform: translateX(100%);
  transition: transform 0.3s ease-in-out;
}

/* Когда открыто, выезжаем */
.sidebar-mobile[style*="translateX(0)"] {
  transform: translateX(0);
}

.hint {
  color: var(--tg-theme-hint-color);
}
</style>
