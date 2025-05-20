// src/mockEnv.ts
import {
  mockTelegramEnv,
  parseInitData,
  themeParams,
} from '@telegram-apps/sdk-vue'
import type { LaunchParams } from '@telegram-apps/sdk-vue'

if (import.meta.env.DEV) {
  // Собираем initDataRaw с теми же параметрами, что у вас были
  const initDataRaw = new URLSearchParams([
    ['user', JSON.stringify({
      id: 99281932,
      first_name: 'Andrew',
      last_name: 'Rogue',
      username: 'rogue',
      language_code: 'en',
      is_premium: true,
      allows_write_to_pm: true,
    })],
    ['hash'          , '89d6079ad6762351f38c6dbbc41bb53048019256a9443988af7a48bcad16ba31'],
    ['signature'     , '89d6079ad6762351f38c6dbbc41bb53048019256a9443988af7a48bcad16ba31'],
    ['auth_date'     , '1716922846'],
    ['start_param'   , 'debug'],
    ['chat_type'     , 'sender'],
    ['chat_instance' , '8428209589180549439'],
  ]).toString()

  // Как и раньше, парсим initData
  const initData = parseInitData(initDataRaw)

  // Наши snake_case цвета
  const theme = {
    bg_color:                  '#1e1e1e',
    section_bg_color:          '#191819',
    secondary_bg_color:        '#000000',
    text_color:                '#ffffff',
    hint_color:                '#7d7d7d',
    link_color:                '#a183d2',
    button_color:              '#a583da',
    button_text_color:         '#ffffff',
    header_bg_color:           '#252425',
    accent_text_color:         '#af90df',
    section_header_text_color: '#b995e4',
    subtitle_text_color:       '#7f7e7f',
    destructive_text_color:    '#ee686f',
    section_separator_color:   '#000000',
    bottom_bar_bg_color:       '#000000',
  } as const

  // Собираем LaunchParams
  const lp = {
    themeParams : theme,
    initData    : initData,
    initDataRaw : initDataRaw,
    version     : '8',
    platform    : 'tdesktop',
  } as LaunchParams

  // Мокаем и сразу же перемонтируем тему
  mockTelegramEnv(lp)


  console.warn('🛠️ Telegram environment mocked with custom initData (DEV only)')
}
