import apiClient from './client'

export async function resolveYouTubeVideo(url: string) {
  const response = await apiClient.post('/resolve', {
    url
  })

  return response.data
}
