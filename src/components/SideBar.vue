<template>
  <SideBarMobile
    v-if="isMobile"
    :is-open="isOpen"
    @toggle="onToggle"
  />
  <SideBarDesktop v-else />
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

function updateIsMobile() {
  isMobile.value = window.innerWidth < 768
}

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
