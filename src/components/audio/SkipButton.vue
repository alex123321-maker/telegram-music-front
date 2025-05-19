<template>
  <button
    @click="onClick"
    :disabled="props.disabled"
    class="p-2 rounded-full transition"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    :style="buttonStyle"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { themeParams } from '@telegram-apps/sdk-vue'


const props = defineProps<{ disabled?: boolean }>()
const emit = defineEmits(['skip'])
const isHovered = ref(false)

function onClick() {
  if (!props.disabled) emit('skip')
}

const buttonStyle = computed(() => ({
  backgroundColor:
    isHovered.value && !props.disabled
      ? themeParams.secondaryBackgroundColor()
      : 'transparent',
  color: props.disabled
    ? themeParams.hintColor()
    : themeParams.textColor(),
}))
</script>
