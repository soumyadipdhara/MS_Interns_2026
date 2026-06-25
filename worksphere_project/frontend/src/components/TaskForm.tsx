import { useState, useEffect, type FormEvent } from 'react'
import Input from './Input'
import Select from './Select'
import Button from './Button'
import { validators, combineErrors } from '../hooks/validation'
import { employeeService } from '../services/employeeService'
import type { Employee, Task, TaskPayload } from '../types'

interface TaskFormProps {
  initialData?: Task | null
  onSubmit: (payload: TaskPayload) => Promise<void>
  onCancel: () => void
}

interface FormErrors {
  title?: string
  due_date?: string
}

export default function TaskForm({ initialData, onSubmit, onCancel }: TaskFormProps) {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [employeesLoading, setEmployeesLoading] = useState(true)

  const [form, setForm] = useState<TaskPayload>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    priority: initialData?.priority || 'Medium',
    due_date: initialData?.due_date || new Date().toISOString().slice(0, 10),
    assigned_employee_id: initialData?.assigned_employee_id ?? null,
    status: initialData?.status || 'Pending',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    async function loadEmployees() {
      try {
        const data = await employeeService.list({ status: 'Active', limit: 500 })
        setEmployees(data.items)
      } finally {
        setEmployeesLoading(false)
      }
    }
    loadEmployees()
  }, [])

  function validate(): boolean {
    const newErrors: FormErrors = {
      title: combineErrors(
        validators.required(form.title, 'Title'),
        validators.minLength(form.title, 2, 'Title')
      ),
      due_date: validators.required(form.due_date, 'Due date'),
    }
    setErrors(newErrors)
    return !Object.values(newErrors).some(Boolean)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    try {
      await onSubmit(form)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <Input
        label="Task title"
        name="title"
        placeholder="e.g. Prepare quarterly report"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        error={errors.title}
        required
      />

      <div>
        <label htmlFor="description" className="input-label">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          className="input-field resize-none"
          placeholder="Add task details..."
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Select
          label="Priority"
          name="priority"
          value={form.priority}
          onChange={(e) => setForm({ ...form, priority: e.target.value as TaskPayload['priority'] })}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </Select>
        <Input
          label="Due date"
          type="date"
          name="due_date"
          value={form.due_date}
          onChange={(e) => setForm({ ...form, due_date: e.target.value })}
          error={errors.due_date}
          required
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Select
          label="Assign to"
          name="assigned_employee_id"
          value={form.assigned_employee_id ?? ''}
          onChange={(e) =>
            setForm({
              ...form,
              assigned_employee_id: e.target.value ? Number(e.target.value) : null,
            })
          }
          disabled={employeesLoading}
        >
          <option value="">Unassigned</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.name} — {emp.department}
            </option>
          ))}
        </Select>
        <Select
          label="Status"
          name="status"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value as TaskPayload['status'] })}
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </Select>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {initialData ? 'Save changes' : 'Create task'}
        </Button>
      </div>
    </form>
  )
}
