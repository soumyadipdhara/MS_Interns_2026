import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Input from '../components/Input'
import Button from '../components/Button'
import { validators, combineErrors } from '../hooks/validation'

interface FormErrors {
  email?: string
  password?: string
}

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  function validate(): boolean {
    const newErrors: FormErrors = {
      email: combineErrors(
        validators.required(form.email, 'Email'),
        validators.email(form.email)
      ),
      password: validators.required(form.password, 'Password'),
    }
    setErrors(newErrors)
    return !Object.values(newErrors).some(Boolean)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    try {
      await login(form)
      navigate('/dashboard')
    } catch {
      // error toast handled in context
    } finally {
      setIsSubmitting(false)
    }
  }

  function fillDemo(role: 'admin' | 'user') {
    setForm(
      role === 'admin'
        ? { email: 'admin@worksphere.com', password: 'Admin@123' }
        : { email: 'user@worksphere.com', password: 'User@123' }
    )
    setErrors({})
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-600 text-lg font-bold text-white">
            WS
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="mt-1 text-sm text-gray-500">Sign in to your WorkSphere account</p>
        </div>

        <div className="card p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input
              label="Email address"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="you@company.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              error={errors.email}
              required
            />
            <Input
              label="Password"
              type="password"
              name="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              error={errors.password}
              required
            />
            <Button type="submit" isLoading={isSubmitting} className="w-full">
              Sign in
            </Button>
          </form>

          <div className="mt-5 rounded-lg bg-gray-50 p-3">
            <p className="mb-2 text-xs font-medium text-gray-500">Quick demo access:</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fillDemo('admin')}
                className="flex-1 rounded-md border border-gray-200 bg-white px-2 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
              >
                Use Admin demo
              </button>
              <button
                type="button"
                onClick={() => fillDemo('user')}
                className="flex-1 rounded-md border border-gray-200 bg-white px-2 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
              >
                Use User demo
              </button>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-primary-600 hover:text-primary-700">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
