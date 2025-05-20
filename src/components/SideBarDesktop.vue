<!-- src/components/SideBar.vue -->
<template>
  <aside class="sidebar">
    <MySection title="Поиск">
      <SearchInput v-model="searchQuery" placeholder="Искать тег…" />
    </MySection>

    <MySection title="Дополнительно">
      <ToggleSwitch v-model="matchAllTags" />
      <p class="hint mt-1 text-xs">
        {{ matchAllTags
          ? 'Показать треки, содержащие все выбранные теги'
          : 'Показать треки, содержащие хотя бы один из выбранных тегов' }}
      </p>
    </MySection>

    <MySection title="Теги">
      <TagList v-model="selectedTags" />
    </MySection>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import MySection    from '@/components/common/MySection.vue'
import SearchInput  from '@/components/common/SearchInput.vue'
import TagList      from '@/components/common/TagList.vue'
import ToggleSwitch from '@/components/common/ToggleSwitch.vue'

const searchQuery  = ref('')
const selectedTags = ref<number[]>([])
const matchAllTags = ref(false)
</script>

<style scoped>
.sidebar {
  width: 20rem;
  height: 100%;
  padding: 1rem;

  display: flex;
  flex-direction: column;

  /* цвета из общей темы */
  background: var(--bg-section);
  color: var(--text);
}

.hint {
  color: var(--text-muted);
}
</style>
