<template>
  <div class="tag-list">
    <TagButton
      v-for="t in tags"
      :key="t.tagID"
      :tag="t"
      :active="modelValue.includes(t.tagID)"
      @click="toggleTag"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getUserTags } from '@/api/mediaTags'
import TagButton from '@/components/common/TagButton.vue'

interface Tag {
  tagID: number
  Name: string
}

const props = defineProps<{ modelValue: number[] }>()
const emit  = defineEmits<{ (e: 'update:modelValue', value: number[]): void }>()

const tags = ref<Tag[]>([])

onMounted(async () => {
  tags.value = await getUserTags()
})

function toggleTag(tag_id: number) {
  const index = props.modelValue.indexOf(tag_id)
  const next  = [...props.modelValue]

  if (index === -1) next.push(tag_id)
  else next.splice(index, 1)

  emit('update:modelValue', next)
}
</script>

<style scoped>
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;

  /* пример: фон секции */
  background: var(--bg-section);
  padding: 0.5rem;
  border-radius: 0.5rem;
}

</style>
