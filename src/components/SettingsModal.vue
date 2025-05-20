<template>
  <Teleport to="body">
    <div v-if="modelValue" class="backdrop" @click="close" />
    <section v-if="modelValue" class="modal" role="dialog" aria-modal="true">
      <header class="modal__header"><h2>Настройки</h2></header>
      <div class="modal__content">
        <ToggleSwitch
          v-model="prefersTelegramTheme"
          off-label="Дефолтная"
          on-label="Telegram"
          class="toggle"
        />
        <ToggleSwitch
          v-if="fullscreenSupported"
          v-model="fullscreen"
          off-label="Окно"
          on-label="Fullscreen"
          class="toggle"
        />
        <p v-else class="hint text-sm">Полноэкранный режим не поддерживается этим клиентом</p>
      </div>
      <footer class="modal__footer">
        <button class="btn" @click="close">Закрыть</button>
      </footer>
    </section>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { cloudStorage, viewport, useSignal } from '@telegram-apps/sdk-vue'
import ToggleSwitch from "./common/ToggleSwitch.vue"

defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void }>()
const close = () => emit('update:modelValue', false)

const KEY_THEME = 'prefersTelegramTheme'
const prefersTelegramTheme = ref(false)

const KEY_FS = 'prefersFullscreen'
const fullscreenSupported =
  viewport.requestFullscreen.isAvailable() &&
  viewport.exitFullscreen.isAvailable()
const fullscreenSignal = fullscreenSupported ? useSignal(viewport.isFullscreen) : ref(false)
const fullscreen = ref(false)

onMounted(async () => {
  if (cloudStorage.getItem.isAvailable()) {
    try {
      prefersTelegramTheme.value = (await cloudStorage.getItem(KEY_THEME)) === 'true'
      if (fullscreenSupported) {
        fullscreen.value = (await cloudStorage.getItem(KEY_FS)) === 'true'
      }
    } catch {}
  }
  applyTheme(prefersTelegramTheme.value)
  if (fullscreenSupported) await applyFullscreen(fullscreen.value)
})

watch(prefersTelegramTheme, async val => {
  applyTheme(val)
  if (cloudStorage.setItem.isAvailable()) await cloudStorage.setItem(KEY_THEME, String(val))
})

watch(fullscreen, async val => {
  if (!fullscreenSupported) return
  await applyFullscreen(val)
  if (cloudStorage.setItem.isAvailable()) await cloudStorage.setItem(KEY_FS, String(val))
})

function applyTheme(useTG: boolean) {
  document.documentElement.dataset.theme = useTG ? 'telegram' : 'default'
}

async function applyFullscreen(enable: boolean) {
  try {
    if (enable && viewport.requestFullscreen.isAvailable()) {
      await viewport.requestFullscreen()
    } else if (!enable && viewport.exitFullscreen.isAvailable()) {
      await viewport.exitFullscreen()
    }
  } finally {
    fullscreen.value = viewport.isFullscreen()
  }
}
</script>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0 0 0 / 0.45);
  backdrop-filter: blur(2px);
  z-index: 20;
}
.modal {
  position: fixed;
  inset: 50% auto auto 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 22rem;
  background: var(--modal-bg, #fff);
  color: var(--modal-fg, #111);
  border-radius: 1rem;
  box-shadow: 0 6px 24px rgba(0 0 0 / 0.2);
  display: flex;
  flex-direction: column;
  z-index: 30;
}
.modal__header,
.modal__footer {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border, #e5e5e5);
}
.modal__footer {
  border: none;
}
.modal__content {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.btn {
  width: 100%;
  padding: 0.6rem 1rem;
  background: var(--btn-bg, #0088cc);
  color: #fff;
  border: none;
  border-radius: 0.5rem;
}
.toggle {
  border:1px solid var(--border);
  box-shadow: 0 0 0 2px var(--shadow);
}
.hint {
  color: var(--text-muted, #6b7280);
  margin-top: 0.5rem;
}
</style>
