<!-- src/components/audio/MediaTagBar.vue -->
<template>
  <div class="media-tag-bar scroll-hide" ref="bar">
    <!-- закреплённая кнопка добавления -->
    <button class="add-tag-btn" @click="$emit('add-tag')">
      +
    </button>

    <!-- горизонтальная лента тегов -->
    <div class="tag-track">
      <span
        v-for="tag in tags"
        :key="tag.tagID"
        class="tag-pill"
        title="Тег принадлежит треку"
      >
        {{ tag.Name }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getMediaTags } from '@/api/mediaTags'

interface Tag { tagID: number; Name: string }

const props = defineProps<{ media_id: number }>()
defineEmits<{ (e: 'add-tag'): void }>()

const tags = ref<Tag[]>([])

onMounted(async () => {
  tags.value = await getMediaTags(props.media_id)
})
</script>

<style scoped>
/* корневая полоса */
.media-tag-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.5rem;
  background: var(--bg);
  border-bottom: 1px solid var(--border);
  overflow-x: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--btn-bg) transparent;
}
.media-tag-bar::-webkit-scrollbar {
  height: 6px;
}
.media-tag-bar::-webkit-scrollbar-thumb {
  background: var(--btn-bg);
  border-radius: 3px;
}

/* кнопка «+» — закреплена слева и не скроллится */
.add-tag-btn {
  position: sticky;
  left: 0;
  z-index: 2;
  flex: 0 0 auto;
  width: 1.75rem;
  height: 1.75rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--btn-bg);
  color: var(--btn-text);
  font-size: 1.25rem;
  cursor: pointer;
  border: none;
}

/* лента тегов (скроллится) */
.tag-track {
  display: flex;
  gap: 0.5rem;
  flex: 1 1 auto;
  overflow-x: auto;        /* или overflow-x:auto для горизонтали */
  /* Chrome / Safari / Opera */
  scrollbar-width: none;   /* Firefox */
  -ms-overflow-style: none
}
.scroll-hide::-webkit-scrollbar {
    display: none;

  ;/* IE 10/11, старый Edge */
}
.scroll-hide::-webkit-scrollbar {
  width: 0;     /* вертикальный скроллбар */
  height: 0;    /* горизонтальный */
}


/* сам «пилл»-тег */
.tag-pill {
  flex: 0 0 auto;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  background: var(--bg-section);
  color: var(--text);
  font-size: 0.875rem;
  white-space: nowrap;
}
</style>
