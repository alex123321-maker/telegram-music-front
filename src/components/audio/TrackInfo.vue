<template>
  <div class="flex items-center space-x-4 overflow-hidden">
    <img :src="cover" alt="cover" class="h-12 w-12 rounded" />
    <div class="flex flex-col">
      <span class="font-semibold truncate text-gray-900">{{ title }}</span>
      <span class="text-sm text-gray-600 truncate">{{ artist }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  cover: string
  title: string
  artist: string
}>()
</script>
