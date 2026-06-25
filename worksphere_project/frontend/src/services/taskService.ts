import { api } from './api'
import type { Task, TaskListResponse, TaskPayload, TaskStatus } from '../types'

export interface TaskFilters {
  search?: string
  status?: string
  priority?: string
  employee_id?: number
  skip?: number
  limit?: number
}

export const taskService = {
  async list(filters: TaskFilters = {}): Promise<TaskListResponse> {
    const { data } = await api.get<TaskListResponse>('/api/tasks', {
      params: filters,
    })
    return data
  },

  async get(id: number): Promise<Task> {
    const { data } = await api.get<Task>(`/api/tasks/${id}`)
    return data
  },

  async create(payload: TaskPayload): Promise<Task> {
    const { data } = await api.post<Task>('/api/tasks', payload)
    return data
  },

  async update(id: number, payload: Partial<TaskPayload>): Promise<Task> {
    const { data } = await api.put<Task>(`/api/tasks/${id}`, payload)
    return data
  },

  async updateStatus(id: number, status: TaskStatus): Promise<Task> {
    const { data } = await api.patch<Task>(`/api/tasks/${id}/status`, { status })
    return data
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/api/tasks/${id}`)
  },
}
