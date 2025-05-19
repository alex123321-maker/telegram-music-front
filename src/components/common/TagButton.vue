<template>
  <button
    :disabled="disabled"
    @click="handleClick"
    class="px-3 pb-2 pt-1 rounded-2xl text-sm font-medium transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed shadow-md "
    :style="buttonStyle"
  >
    {{ tag.Name }}
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { themeParams } from '@telegram-apps/sdk-vue'
const props = defineProps<{
  tag: { tagID: number; Name: string }
  active?: boolean
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'click', tagID: number): void
}>()

function handleClick() {
  if (!props.disabled) {
    emit('click', props.tag.tagID)
  }
}

const buttonStyle = computed(() => {
  if (props.active) {
    return {
      backgroundColor: themeParams.buttonColor(),
      color:           themeParams.buttonTextColor()
    }
  } else {
    return {
      backgroundColor: themeParams.secondaryBackgroundColor(),
      color:           themeParams.textColor()
    }
  }
})
</script>
