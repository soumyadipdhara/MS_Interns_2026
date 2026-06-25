import { useState, type FormEvent } from 'react'
import Input from './Input'
import Select from './Select'
import Button from './Button'
import { validators, combineErrors } from '../hooks/validation'
import type { Employee, EmployeePayload } from '../types'

interface EmployeeFormProps {
  initialData?: Employee | null
  onSubmit: (payload: EmployeePayload) => Promise<void>
  onCancel: () => void
}

interface FormErrors {
  name?: string
  email?: string
  department?: string
  designation?: string
  joining_date?: string
}

const departments = [
  'Engineering',
  'Human Resources',
  'Sales',
  'Marketing',
  'Finance',
  'Operations',
  'Customer Support',
  'Product',
]

export default function EmployeeForm({ initialData, onSubmit, onCancel }: EmployeeFormProps) {
  const [form, setForm] = useState<EmployeePayload>({
    name: initialData?.name || '',
    email: initialData?.email || '',
    department: initialData?.department || departments[0],
    designation: initialData?.designation || '',
    joining_date: initialData?.joining_date || new Date().toISOString().slice(0, 10),
    status: initialData?.status || 'Active',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  function validate(): boolean {
    const newErrors: FormErrors = {
      name: combineErrors(
        validators.required(form.name, 'Name'),
        validators.minLength(form.name, 2, 'Name')
      ),
      email: combineErrors(
        validators.required(form.email, 'Email'),
        validators.email(form.email)
      ),
      department: validators.required(form.department, 'Department'),
      designation: validators.required(form.designation, 'Designation'),
      joining_date: validators.required(form.joining_date, 'Joining date'),
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
        label="Full name"
        name="name"
        placeholder="e.g. Priya Sharma"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        error={errors.name}
        required
      />
      <Input
        label="Email address"
        type="email"
        name="email"
        placeholder="employee@company.com"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        error={errors.email}
        required
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Select
          label="Department"
          name="department"
          value={form.department}
          onChange={(e) => setForm({ ...form, department: e.target.value })}
          error={errors.department}
          required
        >
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </Select>
        <Input
          label="Designation"
          name="designation"
          placeholder="e.g. Software Engineer"
          value={form.designation}
          onChange={(e) => setForm({ ...form, designation: e.target.value })}
          error={errors.designation}
          required
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Joining date"
          type="date"
          name="joining_date"
          value={form.joining_date}
          onChange={(e) => setForm({ ...form, joining_date: e.target.value })}
          error={errors.joining_date}
          required
        />
        <Select
          label="Status"
          name="status"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value as 'Active' | 'Inactive' })}
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </Select>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {initialData ? 'Save changes' : 'Add employee'}
        </Button>
      </div>
    </form>
  )
}
