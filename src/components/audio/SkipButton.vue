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
  background-color: transparent;
  color: var(--tg-theme-text-color);
  transition: background-color 0.3s ease, color 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.skip-button:not(:disabled):hover {
  background-color: var(--tg-theme-secondary-bg-color);
}

.skip-button:disabled {
  color: var(--tg-theme-hint-color);
}
</style>
