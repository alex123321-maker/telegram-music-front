<template>
  <button
    class="px-3 pb-2 pt-1 rounded-2xl text-sm font-medium transition duration-150 ease-in-out
           disabled:opacity-50 disabled:cursor-not-allowed
           text-[var(--tg-theme-text-color)]
           hover:bg-[var(--tg-theme-link-color)]"
    :class="active
      ? 'bg-[var(--tg-theme-button-color)] text-[var(--tg-theme-button-text-color)]'
      : 'bg-[var(--tg-theme-secondary-bg-color)]'"
    :disabled="disabled"
    @click="handleClick"
  >
    {{ tag.Name }}
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
