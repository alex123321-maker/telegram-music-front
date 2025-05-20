import {
  init as initSDK,
  $debug,
  backButton,
  miniApp,
  themeParams,
  initData,
  settingsButton,
} from '@telegram-apps/sdk-vue';


export async function init(debug = false): Promise<void> {
  /* 1. Инициализируем SDK и дебаг-режим */
  $debug.set(debug);
  initSDK();

  if (debug) {
    import('eruda').then(e => e.default.init()).catch(console.error);
  }

  /* 2. Быстрая проверка, поддерживает ли клиент базовые фичи */
  if (!backButton.isSupported() || !miniApp.isSupported()) {
    throw new Error('ERR_NOT_SUPPORTED');
  }
  if (settingsButton.mount.isAvailable()) {
    settingsButton.mount();
    settingsButton.show();
  }
  /* 3. Монтируем необходимые скоупы */
  if (themeParams.mount.isAvailable()) themeParams.mount();
  if (miniApp.mount.isAvailable())     miniApp.mount();
  if (backButton.mount.isAvailable())  backButton.mount();


  initData.restore();

  miniApp.bindCssVars.ifAvailable?.();
  themeParams.bindCssVars.ifAvailable?.();
}
