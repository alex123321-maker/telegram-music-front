import './assets/index.css'

import { createApp } from 'vue'
import { retrieveLaunchParams, themeParams } from '@telegram-apps/sdk-vue'

import App from './App.vue'
import router from './router'
import { errorHandler } from './errorHandler'
import { init } from './init'

// Mock the environment in case, we are outside Telegram.
import './mockEnv'

// Configure all application dependencies.
init(retrieveLaunchParams().startParam === 'debug' || import.meta.env.DEV)

const app = createApp(App)
app.config.errorHandler = errorHandler
app.use(router)
app.mount('#app')
