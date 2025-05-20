<template>
  <button
    @click="onClick"
    :disabled="props.disabled"
    class="skip-button"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{ disabled?: boolean }>()
const emit  = defineEmits<{
  (e: 'skip'): void
}>()

function onClick() {
  if (!props.disabled) emit('skip')
}
</script>

<style scoped>
.skip-button {
  padding: 0.5rem;
  border-radius: 9999px;
  background: transparent;
  color: var(--text);
  transition: background-color 0.3s ease, color 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.skip-button:not(:disabled):hover {
  background: var(--bg-secondary);
}

.skip-button:disabled {
  color: var(--text-muted);
}
</style>
