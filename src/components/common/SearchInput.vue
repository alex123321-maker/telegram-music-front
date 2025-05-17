<template>
  <input
    type="text"
    :value="modelValue"
    @input="onInput"
    :placeholder="placeholder"
    class="w-full px-3 py-2 rounded focus:outline-none"
    :style="inputStyle"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { themeParams } from '@telegram-apps/sdk-vue'

const props = defineProps<{
  modelValue: string
  placeholder?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void
}>()

function onInput(e: Event) {
  const target = e.target as HTMLInputElement | null
  if (!target) return
  emit('update:modelValue', target.value)
}

// Динамические стили из темы
const inputStyle = computed(() => ({
  backgroundColor: themeParams.backgroundColor(),
  color: themeParams.textColor(),
  border: `1px solid ${themeParams.secondaryBackgroundColor()}`,
  '::placeholder': {
    color: themeParams.hintColor()
  },
  outlineColor: themeParams.linkColor(),
}))
</script>
