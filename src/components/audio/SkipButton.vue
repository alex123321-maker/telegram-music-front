<template>
  <button
    @click="emit('skip')"
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

// Объявляем событие 'skip'
const emit = defineEmits<{
  (e: 'skip'): void;
}>()

// Принимаем пропс и задаём булевый дефолт
const props = defineProps<{ disabled?: boolean }>()
const disabled = computed(() => props.disabled ?? false)

// Локальное состояние hover
const isHovered = ref(false)

// Стиль кнопки с вызовом функций signals вместо .value
const buttonStyle = computed(() => ({
  backgroundColor:
    isHovered.value && !disabled.value
      ? themeParams.secondaryBackgroundColor()
      : 'transparent',
  color:
    disabled.value
      ? themeParams.hintColor()
      : themeParams.textColor(),
}))
</script>
