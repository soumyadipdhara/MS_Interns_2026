import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { employeeAPI } from '../../api'
import Input from '../common/Input'
import Select from '../common/Select'
import Button from '../common/Button'
import toast from 'react-hot-toast'
import styles from './EmployeeForm.module.css'

const DEPARTMENTS = [
  'Engineering', 'Product', 'Design', 'Marketing',
  'Sales', 'HR', 'Finance', 'Operations', 'Legal', 'Customer Support',
]

const DESIGNATIONS = [
  'Software Engineer', 'Senior Software Engineer', 'Lead Engineer',
  'Engineering Manager', 'Product Manager', 'UI/UX Designer',
  'Marketing Manager', 'Sales Executive', 'HR Manager',
  'Finance Analyst', 'Operations Manager', 'Director', 'VP', 'C-Suite',
]

export default function EmployeeForm({ employee, onSuccess, onCancel }) {
  const isEdit = Boolean(employee)
  const [previewLetter, setPreviewLetter] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: employee
      ? {
          name: employee.name,
          email: employee.email,
          department: employee.department,
          designation: employee.designation,
          joining_date: employee.joining_date,
          status: employee.status,
        }
      : { status: 'Active' },
  })

  const watchedName = watch('name', '')
  useEffect(() => {
    setPreviewLetter(watchedName?.trim()?.[0]?.toUpperCase() || '?')
  }, [watchedName])

  useEffect(() => {
    if (employee) {
      reset({
        name: employee.name,
        email: employee.email,
        department: employee.department,
        designation: employee.designation,
        joining_date: employee.joining_date,
        status: employee.status,
      })
    }
  }, [employee, reset])

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        await employeeAPI.update(employee.id, data)
        toast.success(`${data.name} updated successfully`)
      } else {
        await employeeAPI.create(data)
        toast.success(`${data.name} added successfully`)
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
      {/* Avatar preview */}
      <div className={styles.avatarPreview}>
        <div className={styles.avatar}>{previewLetter}</div>
        <div className={styles.avatarHint}>
          {isEdit ? 'Editing employee record' : 'New employee will receive a unique ID'}
        </div>
      </div>

      <div className={styles.grid2}>
        <Input
          label="Full Name"
          placeholder="e.g. John Doe"
          required
          error={errors.name?.message}
          {...register('name', {
            required: 'Full name is required',
            minLength: { value: 2, message: 'Name must be at least 2 characters' },
          })}
        />
        <Input
          label="Email Address"
          type="email"
          placeholder="john@company.com"
          required
          error={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            pattern: { value: /\S+@\S+\.\S+/, message: 'Enter a valid email address' },
          })}
        />
      </div>

      <div className={styles.grid2}>
        <Select
          label="Department"
          required
          error={errors.department?.message}
          {...register('department', { required: 'Please select a department' })}
        >
          <option value="">Select department</option>
          {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
        </Select>
        <Select
          label="Designation"
          required
          error={errors.designation?.message}
          {...register('designation', { required: 'Please select a designation' })}
        >
          <option value="">Select designation</option>
          {DESIGNATIONS.map((d) => <option key={d} value={d}>{d}</option>)}
        </Select>
      </div>

      <div className={styles.grid2}>
        <Input
          label="Joining Date"
          type="date"
          required
          error={errors.joining_date?.message}
          {...register('joining_date', { required: 'Joining date is required' })}
        />
        <Select
          label="Status"
          required
          error={errors.status?.message}
          {...register('status', { required: true })}
        >
          <option value="Active">✅ Active</option>
          <option value="Inactive">⛔ Inactive</option>
        </Select>
      </div>

      <div className={styles.actions}>
        <Button variant="secondary" type="button" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {isEdit ? 'Save Changes' : '➕ Add Employee'}
        </Button>
      </div>
    </form>
  )
}
