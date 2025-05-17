<template>
  <div
    class="my-4"
    :style="{ backgroundColor: themeParams.sectionBackgroundColor() }"
  >
    <h3
      v-if="title"
      class="text-lg font-semibold mb-2"
      :style="{ color: themeParams.textColor() }"
    >
      {{ title }}
    </h3>
    <div :style="{ color: themeParams.textColor() }">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { themeParams } from '@telegram-apps/sdk-vue'

const props = defineProps<{
  title?: string
}>()
</script>
