import apiClient from './client'
import type { MediaTag } from './models'   // добавьте в models.ts, если нужно тип ответа

export interface LinkTagRequest {
  tg_id:    number
  media_id: number
  tag_id:   number
}

export async function linkTagToMedia(
  payload: LinkTagRequest
): Promise<MediaTag> {
  const { data } = await apiClient.post<MediaTag>('/media-tags', payload)
  return data
}

export async function deleteMediaTag(id: number): Promise<void> {
  await apiClient.delete(`/media-tags/${id}`)
}
