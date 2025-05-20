<template>
  <div class="media-tag-bar">
    <TagButton
      v-for="tag in tags"
      :key="tag.tagID"
      :tag="tag"
      :disabled="true"
      :active="true"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import TagButton from '@/components/common/TagButton.vue'
import { getMediaTags } from '@/api/mediaTags'

interface Tag {
  tagID: number
  Name: string
}

const props = defineProps<{
  media_id: number
}>()

const tags = ref<Tag[]>([])

onMounted(async () => {
  tags.value = await getMediaTags(props.media_id)
})
</script>

<style scoped>
.media-tag-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;               /* соответствует flex gap-2 */
  align-items: center;
  padding: 0.25rem 0.5rem 0; /* px-2 pb-1 */

  background: var(--bg);     /* основной фон */
  color: var(--text);        /* цвет текста кнопок, если потребуется */
  border-bottom: 1px solid var(--border); /* тонкая граница снизу */
}
</style>
