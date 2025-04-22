import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'https://mandrikov-ad.ru:3000/api',
  timeout: 100000, // 10 секунд
  headers: {
    'Content-Type': 'application/json',
  },
})

// Пример перехватчика на будущее (например, для токенов)
// apiClient.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token')
//   if (token) config.headers.Authorization = `Bearer ${token}`
//   return config
// })

export default apiClient
