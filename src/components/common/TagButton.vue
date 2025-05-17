<template>
  <button
    @click="$emit('click', tag)"
    :class="[
      'px-2 py-1 rounded-full text-sm font-medium transition',
      active
        ? 'bg-blue-600 text-white'
        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
    ]"
  >
    {{ tag }}
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{
  tag: string
  active?: boolean
}>()
const emit = defineEmits<{
  (e: 'click', tag: string): void
}>()
</script>
