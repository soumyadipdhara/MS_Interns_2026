import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { dashboardService } from '../services/dashboardService'
import { getErrorMessage } from '../services/api'
import { useAuth } from '../context/AuthContext'
import type { DashboardStats } from '../types'
import { Spinner } from '../components/Loaders'

interface StatCardProps {
  label: string
  value: number
  icon: JSX.Element
  color: string
  to?: string
}

function StatCard({ label, value, icon, color, to }: StatCardProps) {
  const content = (
    <div className="card flex items-center gap-4 p-5 transition-shadow hover:shadow-md">
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  )
  return to ? <Link to={to}>{content}</Link> : content
}

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const data = await dashboardService.getStats()
        setStats(data)
      } catch (error) {
        toast.error(getErrorMessage(error))
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (!stats) return null

  const maxDeptCount = Math.max(...stats.department_breakdown.map((d) => d.count), 1)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">
          Welcome back, {user?.full_name?.split(' ')[0]} 👋
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Here's what's happening across your organization today.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Employees"
          value={stats.employees.total}
          color="bg-primary-50 text-primary-600"
          to="/employees"
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.75}
                d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m5-4a3 3 0 11-6 0 3 3 0 016 0zm6 1a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          }
        />
        <StatCard
          label="Active Employees"
          value={stats.employees.active}
          color="bg-green-50 text-green-600"
          to="/employees"
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.75}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
        <StatCard
          label="Total Tasks"
          value={stats.tasks.total}
          color="bg-purple-50 text-purple-600"
          to="/tasks"
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.75}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          }
        />
        <StatCard
          label="Completed Tasks"
          value={stats.tasks.completed}
          color="bg-amber-50 text-amber-600"
          to="/tasks"
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.75}
                d="M5 13l4 4L19 7"
              />
            </svg>
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <h3 className="mb-4 text-sm font-semibold text-gray-900">Task Status Breakdown</h3>
          <div className="space-y-3">
            {[
              { label: 'Pending', value: stats.tasks.pending, color: 'bg-amber-400' },
              { label: 'In Progress', value: stats.tasks.in_progress, color: 'bg-blue-500' },
              { label: 'Completed', value: stats.tasks.completed, color: 'bg-green-500' },
            ].map((item) => {
              const pct = stats.tasks.total ? (item.value / stats.tasks.total) * 100 : 0
              return (
                <div key={item.label}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="font-medium text-gray-600">{item.label}</span>
                    <span className="text-gray-500">{item.value}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={`h-full rounded-full ${item.color} transition-all`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="card p-5">
          <h3 className="mb-4 text-sm font-semibold text-gray-900">Employees by Department</h3>
          {stats.department_breakdown.length === 0 ? (
            <p className="text-sm text-gray-400">No department data yet.</p>
          ) : (
            <div className="space-y-3">
              {stats.department_breakdown.map((dept) => (
                <div key={dept.department}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="font-medium text-gray-600">{dept.department}</span>
                    <span className="text-gray-500">{dept.count}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-primary-500 transition-all"
                      style={{ width: `${(dept.count / maxDeptCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
