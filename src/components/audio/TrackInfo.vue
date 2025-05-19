<template>
  <div class="flex items-center space-x-4 overflow-hidden">
    <img :src="cover" alt="cover" class="h-12 w-12 rounded object-cover" />
    <div class="flex flex-col">
      <span
        class="font-semibold truncate"
        :style="{ color: themeParams.textColor() }"
      >
        {{ title }}
      </span>
      <span
        class="text-sm truncate"
        :style="{ color: themeParams.subtitleTextColor() }"
      >
        {{ artist }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { themeParams } from '@telegram-apps/sdk-vue'

const props = defineProps<{
  cover: string
  title: string
  artist: string
}>()
</script>
