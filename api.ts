import type { Task } from './types'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5089/api'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
  if (!res.ok) throw new Error(await res.text())
  return res.status === 204 ? (undefined as T) : await res.json()
}

export const Api = {
  list: () => request<Task[]>('/tasks'),
  create: (description: string) => request<Task>('/tasks', {
    method: 'POST',
    body: JSON.stringify({ description }),
  }),
  update: (id: number, partial: Partial<Omit<Task, 'id'>>) => request<Task>(`/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(partial),
  }),
  remove: (id: number) => request<void>(`/tasks/${id}`, { method: 'DELETE' }),
}
