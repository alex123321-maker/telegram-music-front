<template>
  <div
    class="flex flex-wrap gap-2"
    :style="{ backgroundColor: themeParams.backgroundColor() }"
  >
    <TagButton
      v-for="t in tags"
      :key="t"
      :tag="t"
      :active="modelValue.includes(t)"
      @click="toggleTag"
    />
  </div>
</template>

<script setup lang="ts">
import { themeParams } from '@telegram-apps/sdk-vue'
import TagButton from '@/components/common/TagButton.vue'

const props = defineProps<{
  modelValue: string[]
  tags: string[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: string[]): void
}>()

function toggleTag(tag: string) {
  const idx = props.modelValue.indexOf(tag)
  const next = [...props.modelValue]
  if (idx === -1) next.push(tag)
  else next.splice(idx, 1)
  emit('update:modelValue', next)
}
</script>
