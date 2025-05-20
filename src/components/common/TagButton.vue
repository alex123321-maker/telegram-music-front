<template>
  <button
    class="tag-button"
    :class="{ active: props.active }"
    :disabled="props.disabled"
    @click="handleClick"
  >
    {{ props.tag.Name }}
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{ tag: { tagID: number; Name: string }; active?: boolean; disabled?: boolean }>()
const emit  = defineEmits<{ (e: 'click', tagID: number): void }>()

function handleClick() {
  if (!props.disabled) emit('click', props.tag.tagID)
}
</script>

<style scoped>
.tag-button {
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;

  background: var(--bg-section);
  color: var(--text);

  transition: background 0.3s ease, color 0.3s ease;
  box-shadow: var(--shadow);
}

.tag-button.active {
  background: var(--btn-bg);
  color: var(--btn-text);
}

.tag-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
