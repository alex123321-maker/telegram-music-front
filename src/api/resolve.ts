import apiClient from './client'
import type { ResolveMediaResponse } from './models'

export async function resolveYouTubeVideo(
  url: string
): Promise<ResolveMediaResponse> {
  const { data } = await apiClient.post('/resolve', { url })
  return {
    id: data.ID,
    source_id: data.SourceID,
    source_type: data.SourceType,
    title: data.Title,
    artist: data.Artist,
    description: data.Description,
    duration: data.Duration,
    thumbnail_url: data.ThumbnailURL,
    audio_url: data.URL
  }
}
