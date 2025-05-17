<template>
  <aside
    class="bg-gray-500 shadow-md p-4 h-full w-80"
  >
    <MySection title="Поиск">
      <SearchInput v-model="searchQuery" placeholder="Искать..." />
    </MySection>
    <MySection title="Дополнительно">
      <ToggleSwitch v-model="onlyFavorites" label="Только избранное" />
    </MySection>

    <MySection title="Теги">
      <TagList v-model="selectedTags" :tags="tags" />

    </MySection>


  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MySection from '@/components/common/MySection.vue'
import SearchInput from '@/components/common/SearchInput.vue'
import TagList from '@/components/common/TagList.vue'
import ToggleSwitch from '@/components/common/ToggleSwitch.vue'

// Пример набора тегов (замените на реальные данные)
const tags = ref<string[]>([
  'Реактивные рецепты',
  'Завтраки',
  'Постные блюда',
  'Быстро и вкусно',
  'Без сахара',
  'Микс витаминов',
  'Салаты',
])

const searchQuery = ref('')
const selectedTags = ref<string[]>([])
const matchAllTags = ref(false)
const onlyFavorites = ref(false)

function setFilterMode(val: boolean) {
  matchAllTags.value = val
}
</script>

<style scoped>
/* Для десктопа сайдбар всегда статичен, поэтому нет fixed/transform */
</style>
