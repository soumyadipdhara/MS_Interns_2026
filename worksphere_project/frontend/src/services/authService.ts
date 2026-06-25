import { api } from './api'
import type { AuthResponse, User } from '../types'

export interface RegisterPayload {
  full_name: string
  email: string
  password: string
  role?: 'admin' | 'user'
}

export interface LoginPayload {
  email: string
  password: string
}

export const authService = {
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/api/auth/register', payload)
    return data
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/api/auth/login', payload)
    return data
  },

  async getMe(): Promise<User> {
    const { data } = await api.get<User>('/api/auth/me')
    return data
  },
}
