<template>
  <aside
    class="p-4 h-full w-80 flex flex-col"
    :style="sidebarStyle"
  >
    <MySection title="Поиск">
      <SearchInput v-model="searchQuery" placeholder="Искать тег..." />
    </MySection>
    <MySection title="Дополнительно">
      <ToggleSwitch v-model="matchAllTags"/>
      <p class="text-xs mt-1" :style="themeParams.hintColor()">
        {{ matchAllTags
          ? 'Показать треки, содержащие все выбранные теги'
          : 'Показать треки, содержащие хотя бы один из выбранных тегов' }}
      </p>
    </MySection>
    <MySection title="Теги">
      <TagList v-model="selectedTags"/>
    </MySection>
  </aside>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { themeParams } from '@telegram-apps/sdk-vue'
import MySection from '@/components/common/MySection.vue'
import SearchInput from '@/components/common/SearchInput.vue'
import TagList from '@/components/common/TagList.vue'
import ToggleSwitch from '@/components/common/ToggleSwitch.vue'



const searchQuery = ref('')
const selectedTags = ref<number[]>([])
const matchAllTags = ref(false)

// Стили боковой панели из темы
const sidebarStyle = computed(() => ({
  color:            themeParams.textColor(),
}))
</script>

<style scoped>
/* Убираем фиксированные Tailwind-цвета, остальное остаётся */
</style>
