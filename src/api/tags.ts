import apiClient from './client'
import type { Tag } from './models'

export async function createTag(name: string): Promise<Tag> {
  const { data } = await apiClient.post<Tag>('/tags', { name })
  return data
}

export async function getTags(): Promise<Tag[]> {
  const { data } = await apiClient.get<Tag[]>('/tags')
  return data
}

export async function deleteTag(id: number): Promise<void> {
  await apiClient.delete(`/tags/${id}`)
}
