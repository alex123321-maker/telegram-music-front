// src/utils/handlePaste.ts
import { readTextFromClipboard } from '@telegram-apps/sdk'

/**
 * Универсальный обработчик события paste.
 * Передайте его прямо в шаблоне: @paste.prevent="handlePaste(onText)"
 *
 * @param onText функция-колбэк, в которую попадёт вставленный текст
 * @returns (e: ClipboardEvent) => Promise<void>
 */
export function handlePaste (onText: (text: string) => void) {
  return async (e: ClipboardEvent) => {
    e.preventDefault()

    let text: string | null = null
    if (readTextFromClipboard.isAvailable()) {
      text = await readTextFromClipboard()
    } else {
      try {
        text = await navigator.clipboard.readText()
      } catch { /* локальный браузер без прав */ }
    }

    if (text) onText(text)
  }
}
