<!-- src/components/audio/MediaTagBar.vue -->
<template>
  <div class="media-tag-bar flex gap-2 flex-wrap items-center px-2 pb-1">
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
  /* фон из темы Telegram Mini App */
  background-color: var(--tg-theme-background-color);
}
</style>
