<template>
  <input
    type="text"
    :value="modelValue"
    @input="onInput"
    :placeholder="placeholder"
    class="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
  />
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

// Пропсы
const props = defineProps<{
  modelValue: string
  placeholder?: string
}>()

// Эмитим обновление value
const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void
}>()

// Обработчик input-события
function onInput(e: Event) {
  const target = e.target as HTMLInputElement | null
  if (!target) return
  emit('update:modelValue', target.value)
}
</script>
