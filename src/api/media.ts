import apiClient from './client'
import type { MediaWithTags } from './models'

export interface MediaByTagsRequest {
  tg_id:     number
  tags?:     number[]
  match_all?: boolean
}

export async function getMediaByTags(
  payload: MediaByTagsRequest
): Promise<MediaWithTags[]> {
  const { data } = await apiClient.post<MediaWithTags[]>('/media', payload)
  return data
}
