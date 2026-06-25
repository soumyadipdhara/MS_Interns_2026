import { useEffect, useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import { taskService } from '../services/taskService'
import { employeeService } from '../services/employeeService'
import { getErrorMessage } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useDebounce } from '../hooks/useDebounce'
import type { Employee, Task, TaskStatus } from '../types'
import Button from '../components/Button'
import Input from '../components/Input'
import Select from '../components/Select'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import TaskForm from '../components/TaskForm'
import Badge, { taskStatusColor, priorityColor } from '../components/Badge'
import Pagination from '../components/Pagination'
import EmptyState from '../components/EmptyState'
import { TableSkeleton } from '../components/Loaders'

const PAGE_SIZE = 8

function isOverdue(task: Task): boolean {
  if (task.status === 'Completed') return false
  return new Date(task.due_date) < new Date(new Date().toDateString())
}

export default function Tasks() {
  const { isAdmin } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)

  const [employees, setEmployees] = useState<Employee[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [employeeFilter, setEmployeeFilter] = useState('')
  const debouncedSearch = useDebounce(search, 400)

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [statusUpdating, setStatusUpdating] = useState<number | null>(null)

  useEffect(() => {
    employeeService.list({ limit: 500 }).then((data) => setEmployees(data.items))
  }, [])

  const loadTasks = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await taskService.list({
        search: debouncedSearch || undefined,
        status: statusFilter || undefined,
        priority: priorityFilter || undefined,
        employee_id: employeeFilter ? Number(employeeFilter) : undefined,
        skip: (page - 1) * PAGE_SIZE,
        limit: PAGE_SIZE,
      })
      setTasks(data.items)
      setTotal(data.total)
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setIsLoading(false)
    }
  }, [debouncedSearch, statusFilter, priorityFilter, employeeFilter, page])

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, statusFilter, priorityFilter, employeeFilter])

  function openAddForm() {
    setEditingTask(null)
    setIsFormOpen(true)
  }

  function openEditForm(task: Task) {
    setEditingTask(task)
    setIsFormOpen(true)
  }

  async function handleFormSubmit(payload: Parameters<typeof taskService.create>[0]) {
    try {
      if (editingTask) {
        await taskService.update(editingTask.id, payload)
        toast.success('Task updated successfully')
      } else {
        await taskService.create(payload)
        toast.success('Task created successfully')
      }
      setIsFormOpen(false)
      loadTasks()
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  async function handleStatusChange(task: Task, status: TaskStatus) {
    setStatusUpdating(task.id)
    try {
      await taskService.updateStatus(task.id, status)
      toast.success(`Task marked as ${status}`)
      loadTasks()
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setStatusUpdating(null)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      await taskService.remove(deleteTarget.id)
      toast.success('Task deleted')
      setDeleteTarget(null)
      loadTasks()
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setIsDeleting(false)
    }
  }

  const hasActiveFilters = !!(debouncedSearch || statusFilter || priorityFilter || employeeFilter)

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Tasks</h2>
          <p className="text-sm text-gray-500">Track and manage work assignments</p>
        </div>
        {isAdmin && (
          <Button
            onClick={openAddForm}
            icon={
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            }
          >
            Create Task
          </Button>
        )}
      </div>

      <div className="card space-y-3 p-4">
        <Input
          placeholder="Search tasks by title or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </Select>
          <Select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
            <option value="">All priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </Select>
          <Select
            value={employeeFilter}
            onChange={(e) => setEmployeeFilter(e.target.value)}
            className="col-span-2 sm:col-span-1"
          >
            <option value="">All employees</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="card overflow-hidden">
        {isLoading ? (
          <TableSkeleton rows={6} cols={6} />
        ) : tasks.length === 0 ? (
          <EmptyState
            title="No tasks found"
            description={
              hasActiveFilters
                ? 'Try adjusting your search or filters.'
                : 'Get started by creating your first task.'
            }
            action={
              isAdmin && !hasActiveFilters ? (
                <Button onClick={openAddForm}>Create Task</Button>
              ) : undefined
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <th className="px-6 py-3">Task</th>
                  <th className="px-6 py-3">Assigned To</th>
                  <th className="px-6 py-3">Priority</th>
                  <th className="px-6 py-3">Due Date</th>
                  <th className="px-6 py-3">Status</th>
                  {isAdmin && <th className="px-6 py-3 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tasks.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{task.title}</p>
                      {task.description && (
                        <p className="mt-0.5 max-w-xs truncate text-xs text-gray-500">
                          {task.description}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {task.assigned_employee ? task.assigned_employee.name : (
                        <span className="text-gray-400">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Badge color={priorityColor(task.priority)}>{task.priority}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <span className={isOverdue(task) ? 'font-medium text-red-600' : 'text-gray-600'}>
                        {new Date(task.due_date).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                      {isOverdue(task) && (
                        <span className="ml-1.5 text-xs text-red-500">Overdue</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={task.status}
                        disabled={statusUpdating === task.id}
                        onChange={(e) => handleStatusChange(task, e.target.value as TaskStatus)}
                        className={`badge cursor-pointer border-0 ${
                          taskStatusColor(task.status) === 'green'
                            ? 'bg-green-50 text-green-700'
                            : taskStatusColor(task.status) === 'blue'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-amber-50 text-amber-700'
                        } disabled:opacity-50`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEditForm(task)}
                            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-primary-600"
                            aria-label={`Edit ${task.title}`}
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.75}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => setDeleteTarget(task)}
                            className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
                            aria-label={`Delete ${task.title}`}
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.75}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!isLoading && tasks.length > 0 && (
          <Pagination total={total} page={page} pageSize={PAGE_SIZE} onPageChange={setPage} />
        )}
      </div>

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingTask ? 'Edit Task' : 'Create New Task'}
        size="lg"
      >
        <TaskForm
          initialData={editingTask}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Task"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
