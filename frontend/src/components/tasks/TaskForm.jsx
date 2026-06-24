import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { taskAPI, employeeAPI } from '../../api'
import Input from '../common/Input'
import Select from '../common/Select'
import Button from '../common/Button'
import toast from 'react-hot-toast'
import styles from './TaskForm.module.css'

export default function TaskForm({ task, onSuccess, onCancel, isAdmin }) {
  const isEdit = Boolean(task)
  const [employees, setEmployees] = useState([])
  const [loadingEmps, setLoadingEmps] = useState(true)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: task
      ? {
          title: task.title,
          description: task.description || '',
          priority: task.priority,
          due_date: task.due_date,
          status: task.status,
          assigned_employee_id: task.assigned_employee_id || '',
        }
      : { priority: 'Medium', status: 'Pending' },
  })

  useEffect(() => {
    employeeAPI.list({ status: 'Active', limit: 500 })
      .then(({ data }) => setEmployees(data.employees))
      .catch(() => toast.error('Could not load employees'))
      .finally(() => setLoadingEmps(false))
  }, [])

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description || '',
        priority: task.priority,
        due_date: task.due_date,
        status: task.status,
        assigned_employee_id: task.assigned_employee_id || '',
      })
    }
  }, [task, reset])

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      assigned_employee_id: data.assigned_employee_id
        ? Number(data.assigned_employee_id)
        : null,
    }
    try {
      if (isEdit) {
        if (!isAdmin) {
          await taskAPI.update(task.id, { status: data.status })
        } else {
          await taskAPI.update(task.id, payload)
        }
        toast.success('Task updated successfully')
      } else {
        await taskAPI.create(payload)
        toast.success('Task created successfully')
      }
      onSuccess()
    } catch (err) {
      const detail = err.response?.data?.detail
      if (Array.isArray(detail)) {
        toast.error(detail[0]?.msg || 'Validation error')
      } else {
        toast.error(detail || 'Something went wrong')
      }
    }
  }

  // Today's date for min due date
  const today = new Date().toISOString().split('T')[0]

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
      {isAdmin && (
        <>
          <Input
            label="Task Title"
            placeholder="e.g. Implement user authentication"
            required
            error={errors.title?.message}
            {...register('title', {
              required: 'Task title is required',
              minLength: { value: 3, message: 'Title must be at least 3 characters' },
            })}
          />

          <div className={styles.group}>
            <label className={styles.label}>Description <span className={styles.optional}>(optional)</span></label>
            <textarea
              className={styles.textarea}
              placeholder="Describe what needs to be done, acceptance criteria, links…"
              rows={3}
              {...register('description')}
            />
          </div>

          <div className={styles.grid2}>
            <Select
              label="Priority"
              required
              error={errors.priority?.message}
              {...register('priority', { required: 'Priority is required' })}
            >
              <option value="Low">🟢 Low</option>
              <option value="Medium">🔵 Medium</option>
              <option value="High">🟠 High</option>
              <option value="Critical">🔴 Critical</option>
            </Select>
            <Input
              label="Due Date"
              type="date"
              required
              min={today}
              error={errors.due_date?.message}
              {...register('due_date', { required: 'Due date is required' })}
            />
          </div>

          <Select
            label="Assign to Employee"
            error={errors.assigned_employee_id?.message}
            {...register('assigned_employee_id')}
          >
            <option value="">— Unassigned —</option>
            {loadingEmps
              ? <option disabled>Loading employees…</option>
              : employees.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name} — {e.department} ({e.designation})
                  </option>
                ))
            }
          </Select>
        </>
      )}

      <Select
        label="Status"
        required
        error={errors.status?.message}
        {...register('status', { required: 'Status is required' })}
      >
        <option value="Pending">⏳ Pending</option>
        <option value="In Progress">🔄 In Progress</option>
        <option value="Completed">✅ Completed</option>
      </Select>

      {!isAdmin && (
        <div className={styles.userNote}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          As a User you can only update the task status.
        </div>
      )}

      <div className={styles.actions}>
        <Button variant="secondary" type="button" onClick={onCancel} disabled={isSubmitting}>Cancel</Button>
        <Button type="submit" loading={isSubmitting}>
          {isEdit ? 'Save Changes' : 'Create Task'}
        </Button>
      </div>
    </form>
  )
}
