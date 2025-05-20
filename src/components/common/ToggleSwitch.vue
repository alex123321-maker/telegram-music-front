<template>
  <div class="mode-switcher" @click.stop>
    <button
      type="button"
      class="seg-btn"
      :class="{ 'is-active': !modelValue }"
      @click="() => emit('update:modelValue', false)"
      :style="segStyle(!modelValue)"
    >
      {{ offLabel }}
    </button>
    <button
      type="button"
      class="seg-btn"
      :class="{ 'is-active': modelValue }"
      @click="() => emit('update:modelValue', true)"
      :style="segStyle(modelValue)"
    >
      {{ onLabel }}
    </button>
    <div class="seg-underline" :style="underlineStyle" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue: boolean
  offLabel?: string
  onLabel?: string
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
}>()

const offLabel = props.offLabel ?? 'Хоть один'
const onLabel  = props.onLabel  ?? 'Все'

// Цвет темы для underline и текста
const btnColor      = 'var(--tg-theme-button-color)'
const btnTextColor  = 'var(--tg-theme-button-text-color)'
const subtitleColor = 'var(--tg-theme-subtitle-text-color)'

// Подчёркивание всегда активного цвета
const underlineActiveColor = btnColor

function segStyle(active: boolean) {
  return {
    backgroundColor: 'transparent',
    color: active ? btnTextColor : subtitleColor,
  }
}

const underlineStyle = computed(() => ({
  backgroundColor: underlineActiveColor,
  transform: `translateX(${props.modelValue ? 100 : 0}%)`,
}))
</script>

<style scoped>
.mode-switcher {
  position: relative;
  display: flex;
  width: 100%;
  border-bottom: 2px solid var(--tg-theme-header-bg-color);
}

.seg-btn {
  flex: 1;
  padding: 0;
  height: 2.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color 0.2s ease;
  position: relative;
  z-index: 1;
}

.seg-btn.is-active {
  font-weight: 700;
}

.seg-underline {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50%;
  height: 3px;
  border-radius: 2px 2px 0 0;
  transition: transform 0.3s ease;
  z-index: 0;
}
</style>
