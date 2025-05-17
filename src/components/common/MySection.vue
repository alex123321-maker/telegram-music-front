<template>
  <div class="my-4">
    <h3 v-if="title" class="text-lg font-semibold mb-2">{{ title }}</h3>
    <slot />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  title?: string
}>()
</script>
