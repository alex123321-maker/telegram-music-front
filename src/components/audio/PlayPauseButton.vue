<template>
  <button
    @click="emit('toggle')"
    class="p-2 rounded-full"
    :style="buttonStyle"
  >
    <svg
      v-if="!isPlaying"
      xmlns="http://www.w3.org/2000/svg"
      class="h-6 w-6"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M8 5v14l11-7z" />
    </svg>
    <svg
      v-else
      xmlns="http://www.w3.org/2000/svg"
      class="h-6 w-6"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { themeParams } from '@telegram-apps/sdk-vue'


const props = defineProps<{ isPlaying: boolean }>()
const emit = defineEmits<['toggle']>()

const buttonStyle = computed(() => {
  const base = {
    transition: 'all 0.3s ease-in-out',
    transform: props.isPlaying ? 'scale(1.1)' : 'scale(1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
  if (props.isPlaying) {
    return {
      ...base,
      backgroundColor: themeParams.buttonColor(),
      color: themeParams.buttonTextColor(),
    }
  } else {
    return {
      ...base,
      backgroundColor: themeParams.secondaryBackgroundColor(),
      color: themeParams.textColor(),
    }
  }
})
</script>
