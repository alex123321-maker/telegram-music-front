import {
  init as initSDK,
  $debug,
  backButton,
  miniApp,
  themeParams,
  viewport,
  initData,
  settingsButton,
  swipeBehavior,
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


  /* 5. Отключаем вертикальный свайп (если доступно) */
  swipeBehavior.disableVertical.ifAvailable?.();

  /* 6. Восстанавливаем initData */
  initData.restore();

  /* 7. Viewport + fullscreen */
  if (viewport.mount.isAvailable()) {
    await viewport.mount().catch(e =>
      console.error('Viewport mount error:', e),
    );
    viewport.bindCssVars();
  }

  if (viewport.requestFullscreen.isAvailable()) {
    await viewport.requestFullscreen();
    /* expand() лучше вызывать уже в fullscreen */
    viewport.expand.ifAvailable?.();
  }

  /* 8. Проброс CSS-переменных */
  miniApp.bindCssVars.ifAvailable?.();
  themeParams.bindCssVars.ifAvailable?.();
}
