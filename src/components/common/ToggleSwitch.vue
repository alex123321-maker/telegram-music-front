<template>
  <div class="mode-switcher" @click.stop>
    <button
      type="button"
      class="seg-btn"
      :class="{ 'is-active': !modelValue }"
      @click="() => $emit('update:modelValue', false)"
      :style="segStyle(!modelValue)"
    >
      {{ offLabel }}
    </button>
    <button
      type="button"
      class="seg-btn"
      :class="{ 'is-active': modelValue }"
      @click="() => $emit('update:modelValue', true)"
      :style="segStyle(modelValue)"
    >
      {{ onLabel }}
    </button>
    <div class="seg-underline" :style="underlineStyle" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { themeParams } from '@telegram-apps/sdk-vue'

const props = defineProps<{
  modelValue: boolean
  offLabel?: string
  onLabel?: string
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
}>()

const offLabel = computed(() => props.offLabel ?? 'Хоть один')
const onLabel  = computed(() => props.onLabel  ?? 'Все')

// Заберём цвета темы один раз
const btnColor  = themeParams.buttonColor()
const btnText   = themeParams.buttonTextColor()
const textMain  = themeParams.textColor()

// Общий стиль для каждой кнопки
function segStyle(active: boolean) {
  return {
    backgroundColor: 'transparent',
    color: active ? btnText : textMain,
  }
}

// Стиль для скользящей линии
const underlineStyle = computed(() => ({
  backgroundColor: btnColor,
  transform: `translateX(${props.modelValue ? 100 : 0}%)`,
}))
</script>

<style scoped>
.mode-switcher {
  position: relative;
  display: flex;
  width: 100%;
  border-bottom: 2px solid var(--underline-inactive, transparent);
}

.seg-btn {
  flex: 1;
  /* убрали паддинг целиком */
  padding: 0;
  height: 2.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  background: transparent;
  border: none;
  outline: none;
  cursor: pointer;
  transition: color 0.2s;
}

/* скользящая подчёркивающая линия */
.seg-underline {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50%;
  height: 3px;
  border-radius: 2px 2px 0 0;
  transition: transform 0.3s ease, background-color 0.3s ease;
  z-index: 0;
}

/* Активный текст чуть жирнее */
.seg-btn.is-active {
  font-weight: 700;
}
</style>
