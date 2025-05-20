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
const props = defineProps<{
  tag: { tagID: number; Name: string }
  active?: boolean
  disabled?: boolean
}>()
const emit = defineEmits<{
  (e: 'click', tagID: number): void
}>()

function handleClick() {
  if (!props.disabled) {
    emit('click', props.tag.tagID)
  }
}
</script>

<style scoped>
.tag-button {
  /* Отступы */
  padding: 0.25rem 0.5rem;
  /* Скругление */
  border-radius: 0.375rem;
  /* Типографика */
  font-size: 0.875rem;
  font-weight: 500;
  /* Цвета по умолчанию */
  background-color: var(--tg-theme-secondary-bg-color);
  color: var(--tg-theme-text-color);
  /* Анимация перехода */
  transition: background-color 0.3s ease, color 0.3s ease;
  /* Тень */
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.tag-button.active {
  background-color: var(--tg-theme-button-color);
  color: var(--tg-theme-button-text-color);
}

.tag-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
