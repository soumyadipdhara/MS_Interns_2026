import type { ReactNode } from 'react'

type BadgeColor = 'green' | 'red' | 'yellow' | 'blue' | 'gray' | 'purple'

interface BadgeProps {
  color?: BadgeColor
  children: ReactNode
}

const colorClassMap: Record<BadgeColor, string> = {
  green: 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-200',
  red: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-200',
  yellow: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200',
  blue: 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200',
  gray: 'bg-gray-100 text-gray-700 ring-1 ring-inset ring-gray-200',
  purple: 'bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-200',
}

export default function Badge({ color = 'gray', children }: BadgeProps) {
  return <span className={`badge ${colorClassMap[color]}`}>{children}</span>
}

export function employeeStatusColor(status: string): BadgeColor {
  return status === 'Active' ? 'green' : 'gray'
}

export function taskStatusColor(status: string): BadgeColor {
  switch (status) {
    case 'Completed':
      return 'green'
    case 'In Progress':
      return 'blue'
    default:
      return 'yellow'
  }
}

export function priorityColor(priority: string): BadgeColor {
  switch (priority) {
    case 'High':
      return 'red'
    case 'Medium':
      return 'yellow'
    default:
      return 'gray'
  }
}
