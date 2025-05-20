<template>
  <input
    type="text"
    :value="modelValue"
    @input="onInput"
    :placeholder="placeholder"
    class="search-input w-full px-3 py-2 rounded focus:outline-none"
  />
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
  placeholder?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void
}>()

function onInput(e: Event) {
  const target = e.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<style scoped>
.search-input {
  background-color: var(--tg-theme-secondary-bg-color);
  color: var(--tg-theme-text-color);
  outline-color: var(--tg-theme-link-color);
}
.search-input::placeholder {
  color: var(--tg-theme-hint-color);
}
.search-input:focus {
  outline: none;
  box-shadow: none;
}
</style>
