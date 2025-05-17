import axios from 'axios'
import { initDataRaw as initDataRaw } from '@telegram-apps/sdk-vue' // Vue SDK 2.x

/** Инициализируем once и экспортируем */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'https://mandrikov-ad.ru:3000/api',
  timeout: 100_000,
  headers: { 'Content-Type': 'application/json' }
})

apiClient.interceptors.request.use(config => {
  const rawInitData = initDataRaw()
  if (rawInitData) {
    config.headers['X-Tg-Init-Data'] = rawInitData
  }else{
    console.error("INIT DATA BROKEN: ",rawInitData)
  }
  return config
})

export default apiClient
