<template>
  <div class="track-info flex items-center space-x-4 overflow-hidden">
    <img
      :src="cover"
      alt="cover"
      class="h-12 w-12 rounded object-cover"
    />
    <div class="flex flex-col">
      <span class="title font-semibold truncate">
        {{ title }}
      </span>
      <span class="artist text-sm truncate">
        {{ artist }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  cover: string
  title: string
  artist: string
}>()
</script>

<style scoped>
.track-info {
  color: var(--text);
}
.track-info .title {
  color: var(--text);
}
.track-info .artist {
  color: var(--text-muted);
}
</style>
