<template>
  <div
    class="flex gap-2 flex-wrap items-center px-2 pb-1"
    :style="{ backgroundColor: themeParams.backgroundColor() }"
  >
    <TagButton
      v-for="tag in tags"
      :key="tag.tagID"
      :tag="tag"
      :disabled="true"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { themeParams } from '@telegram-apps/sdk-vue'
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
