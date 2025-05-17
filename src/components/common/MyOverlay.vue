<template>
  <transition name="fade">
    <div
      v-if="visible"
      class="fixed inset-0 bg-black opacity-50 z-30"
      @click="$emit('click')"
    />
  </transition>
</template>

<script setup lang="ts">
const props = defineProps<{ visible: boolean }>()
const emit = defineEmits<{
  (e: 'click'): void
}>()
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
