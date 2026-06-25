import { api } from './api'
import type { Employee, EmployeeListResponse, EmployeePayload } from '../types'

export interface EmployeeFilters {
  search?: string
  department?: string
  status?: string
  skip?: number
  limit?: number
}

export const employeeService = {
  async list(filters: EmployeeFilters = {}): Promise<EmployeeListResponse> {
    const { data } = await api.get<EmployeeListResponse>('/api/employees', {
      params: filters,
    })
    return data
  },

  async get(id: number): Promise<Employee> {
    const { data } = await api.get<Employee>(`/api/employees/${id}`)
    return data
  },

  async create(payload: EmployeePayload): Promise<Employee> {
    const { data } = await api.post<Employee>('/api/employees', payload)
    return data
  },

  async update(id: number, payload: Partial<EmployeePayload>): Promise<Employee> {
    const { data } = await api.put<Employee>(`/api/employees/${id}`, payload)
    return data
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/api/employees/${id}`)
  },
}
