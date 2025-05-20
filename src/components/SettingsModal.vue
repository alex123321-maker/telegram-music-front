<template>
  <Teleport to="body">
    <!-- затемнение -->
    <div v-if="modelValue" class="backdrop" @click="close" />

    <!-- модалка -->
    <section
      v-if="modelValue"
      class="modal"
      role="dialog"
      aria-modal="true"
    >
      <header class="modal__header"><h2>Настройки</h2></header>

      <div class="modal__content">
        <label class="toggle">
          <input type="checkbox" v-model="prefersTelegramTheme" />
          <span class="toggle__indicator" />
          <span class="toggle__label">
            {{ prefersTelegramTheme
                ? 'Тема Telegram'
                : 'Дефолтная тема' }}
          </span>
        </label>
      </div>

      <footer class="modal__footer">
        <button class="btn" @click="close">Закрыть</button>
      </footer>
    </section>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { cloudStorage } from '@telegram-apps/sdk-vue'      // ⬅️

/* v-model */
defineProps<{ modelValue: boolean }>()
const emit  = defineEmits<{ (e:'update:modelValue',v:boolean):void }>()

function close() { emit('update:modelValue', false) }

/* ---------------- облачное хранилище ---------------- */
const KEY = 'prefersTelegramTheme'
const prefersTelegramTheme = ref(false)

/* читаем сохранённое значение */
onMounted(async () => {
  if (cloudStorage.getItem.isAvailable()) {                // :contentReference[oaicite:0]{index=0}
    try {
      const raw = await cloudStorage.getItem(KEY)
      prefersTelegramTheme.value = raw === 'true'
    } catch (err) {
      console.error('CloudStorage getItem error:', err)
    }
  }
  applyTheme(prefersTelegramTheme.value)   // первичное применение
})

/* пишем обратно при изменении */
watch(prefersTelegramTheme, async val => {
  applyTheme(val)

  if (cloudStorage.setItem.isAvailable()) {                // :contentReference[oaicite:1]{index=1}
    try {
      await cloudStorage.setItem(KEY, String(val))
    } catch (err) {
      console.error('CloudStorage setItem error:', err)
    }
  }
})

/* ---------------- визуальное применение темы ---------------- */
function applyTheme(useTG: boolean) {
  document.documentElement.dataset.theme = useTG ? 'telegram' : 'default'
}
</script>

<style scoped>
/* … прежные стили backdrop / modal / toggle / btn … */
</style>
