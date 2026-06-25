export type UserRole = 'admin' | 'user'

export interface User {
  id: number
  full_name: string
  email: string
  role: UserRole
  created_at: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
  user: User
}

export type EmployeeStatus = 'Active' | 'Inactive'

export interface Employee {
  id: number
  employee_code: string
  name: string
  email: string
  department: string
  designation: string
  joining_date: string
  status: EmployeeStatus
  created_at: string
  updated_at?: string | null
}

export interface EmployeePayload {
  name: string
  email: string
  department: string
  designation: string
  joining_date: string
  status: EmployeeStatus
}

export interface EmployeeListResponse {
  total: number
  items: Employee[]
}

export type TaskPriority = 'Low' | 'Medium' | 'High'
export type TaskStatus = 'Pending' | 'In Progress' | 'Completed'

export interface Task {
  id: number
  title: string
  description?: string | null
  priority: TaskPriority
  due_date: string
  assigned_employee_id?: number | null
  assigned_employee?: Employee | null
  status: TaskStatus
  created_at: string
  updated_at?: string | null
}

export interface TaskPayload {
  title: string
  description?: string
  priority: TaskPriority
  due_date: string
  assigned_employee_id?: number | null
  status: TaskStatus
}

export interface TaskListResponse {
  total: number
  items: Task[]
}

export interface DashboardStats {
  employees: {
    total: number
    active: number
    inactive: number
  }
  tasks: {
    total: number
    pending: number
    in_progress: number
    completed: number
  }
  department_breakdown: { department: string; count: number }[]
}

export interface ApiError {
  detail: string
}
