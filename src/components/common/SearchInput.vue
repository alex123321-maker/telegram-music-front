<template>
  <input
    type="text"
    :value="modelValue"
    @input="onInput"
    :placeholder="placeholder"
    class="search-input w-full px-3 py-2 rounded "
  />
</template>

<script setup lang="ts">
defineProps<{ modelValue: string; placeholder?: string }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: string): void }>()

function onInput(e: Event) {
  const target = e.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<style scoped>
.search-input {
  width: 100%;
  outline: none;

  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  background: var(--bg-header);
  color: var(--text);
  border: 1px solid var(--border);
  transition: border 0.2s ease, box-shadow 0.2s ease;
}
.search-input::placeholder {
  color: var(--text-muted);
}
.search-input:focus {
  outline: none;
  box-shadow: 0 0 0 2px var(--btn-bg);

  border-color: var(--border);
}
</style>
