<template>
  <button
    @click="emit('click', tag)"
    class="px-2 py-1 rounded-full text-sm font-medium transition"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    :style="buttonStyle"
  >
    {{ tag }}
  </button>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { themeParams } from '@telegram-apps/sdk-vue'

const props = defineProps<{
  tag: string
  active?: boolean
}>()

const emit = defineEmits<{
  (e: 'click', tag: string): void
}>()

const isHovered = ref(false)

const buttonStyle = computed(() => {
  if (props.active) {
    return {
      backgroundColor: themeParams.buttonColor(),     // основной фон кнопки :contentReference[oaicite:0]{index=0}
      color:           themeParams.buttonTextColor()  // цвет текста кнопки :contentReference[oaicite:1]{index=1}
    }
  } else {
    return {
      backgroundColor: themeParams.secondaryBackgroundColor(), // фон неактивного состояния :contentReference[oaicite:2]{index=2}
      color:           themeParams.textColor(),        // цвет текста неактивного состояния :contentReference[oaicite:3]{index=3}
      ...(isHovered.value && {
        backgroundColor: themeParams.linkColor()      // фон при hover (неактивная) :contentReference[oaicite:4]{index=4}
      })
    }
  }
})
</script>
