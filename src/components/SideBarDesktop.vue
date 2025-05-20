<!-- src/components/SideBar.vue -->
<template>
  <aside class="sidebar">
    <MySection title="Поиск">
      <SearchInput v-model="searchQuery" placeholder="Искать тег..." />
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
import MySection     from '@/components/common/MySection.vue'
import SearchInput   from '@/components/common/SearchInput.vue'
import TagList       from '@/components/common/TagList.vue'
import ToggleSwitch  from '@/components/common/ToggleSwitch.vue'

const searchQuery  = ref('')
const selectedTags = ref<number[]>([])
const matchAllTags = ref(false)
</script>

<style scoped>
.sidebar {
  padding: 1rem;
  height: 100%;
  width: 20rem;
  display: flex;
  flex-direction: column;
  color: var(--tg-theme-text-color);
}

.hint {
  color: var(--tg-theme-hint-color);
}
</style>
