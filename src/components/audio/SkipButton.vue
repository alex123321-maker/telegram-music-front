<template>
  <button
    @click="$emit('skip')"
    :disabled="disabled"
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
const emit = defineEmits<['skip']>()

const isHovered = ref(false)

const buttonStyle = computed(() => ({
  // фон при ховере (если не disabled) и прозрачный в обычном состоянии
  backgroundColor:
    isHovered.value && !props.disabled
      ? themeParams.secondary_bg_color
      : 'transparent',
  // цвет текста: hint_color для disabled, иначе основной текст
  color:
    props.disabled
      ? themeParams.hint_color
      : themeParams.text_color,
}))
</script>
