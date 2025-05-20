<template>
  <div class="my-section my-4">
    <h3 v-if="title" class="section-title text-lg font-semibold mb-2">
      {{ title }}
    </h3>
    <div class="section-content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title?: string }>()
</script>

<style scoped>
.my-section {
  /* Отступ снизу */
  margin-bottom: 1rem;
}

.section-title {
  /* Заголовок раздела */
  color: var(--text);
}

.section-content {
  /* Контент раздела */
  color: var(--text);
}
</style>
