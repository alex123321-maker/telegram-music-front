import apiClient from './client'
import type { ResolveMediaResponse } from './models'

export async function resolveYouTubeVideo(
  url: string
): Promise<ResolveMediaResponse> {
  const { data } = await apiClient.post<ResolveMediaResponse>('/resolve', { url })
  return data
}
