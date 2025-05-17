import apiClient from './client'
import type { MediaTag } from './models'   // добавьте в models.ts, если нужно тип ответа

export interface LinkTagRequest {
  media_id: number
  tag_id:   number
}

export interface MediaTagWithName {
  tagID: number
  Name: string
}

/**
 * Получить все уникальные теги, связанные с текущим пользователем
 * (tg_id извлекается на сервере через X-Tg-Init-Data)
 */
export async function getUserTags(): Promise<MediaTagWithName[]> {
  const { data } = await apiClient.get<MediaTagWithName[]>('/my-tags')
  return data
}
export async function getMediaTags(id: number): Promise<MediaTagWithName[]> {
  const { data } = await apiClient.get<MediaTagWithName[]>(`media/${id}/my-tags`)
  return data
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
