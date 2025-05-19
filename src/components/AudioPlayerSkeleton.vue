<template>
  <!-- Скелетон плеера: повторяет финальную вёрстку -->
  <div
    class="w-full px-4 py-2 animate-pulse"
    :style="{ backgroundColor: themeParams.backgroundColor() }"
  >
    <!-- полоска прогресса -->
    <div class="h-1.5 rounded bg-gray-500/30 w-full mb-2" />

    <!-- основная линия управления -->
    <div class="flex items-center gap-3">
      <!-- prev / play / next -->
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 bg-gray-500/30 rounded-full" />
        <div class="w-10 h-10 bg-gray-500/30 rounded-full" />
        <div class="w-8 h-8 bg-gray-500/30 rounded-full" />
      </div>

      <!-- обложка -->
      <div class="w-12 h-12 bg-gray-500/30 rounded" />

      <!-- текст -->
      <div class="flex-1 space-y-1">
        <div class="h-4 bg-gray-500/30 rounded w-2/3" />
        <div class="h-3 bg-gray-500/30 rounded w-1/3" />
      </div>

      <!-- громкость -->
      <div class="w-8 h-8 bg-gray-500/30 rounded-full" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { themeParams } from '@telegram-apps/sdk-vue'
</script>
