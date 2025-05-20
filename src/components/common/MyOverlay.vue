<template>
  <transition name="fade">
    <div
      v-if="visible"
      class="overlay"
      @click="$emit('click')"
    />
  </transition>
</template>

<script setup lang="ts">
defineProps<{ visible: boolean }>()
defineEmits<{ (e: 'click'): void }>()
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: 20;               /* ниже сайдбара, но выше контента */
  background: var(--overlay);/* полупрозрачный цвет из темы */
}

/* анимация появления/исчезновения */
.fade-enter-active,
.fade-leave-active {
  transition: opacity .4s ease;
}
.fade-enter-from,
.fade-leave-to   { opacity: 0;   }
.fade-enter-to,
.fade-leave-from { opacity: 1;   }
</style>
