<template>
  <transition name="fade">
    <div
      v-if="visible"
      class="overlay fixed inset-0 z-30"
      @click="$emit('click')"
    />
  </transition>
</template>

<script setup lang="ts">
defineProps<{ visible: boolean }>()
defineEmits<{
  (e: 'click'): void
}>()
</script>

<style scoped>
.overlay {
  /* Фоновый цвет из темы с полупрозрачностью */
  background-color: var(--tg-theme-section-bg-color);
  opacity: 0.5;
}

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
