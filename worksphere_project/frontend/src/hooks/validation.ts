export const validators = {
  required: (value: unknown, label = 'This field'): string | undefined => {
    if (value === null || value === undefined || value === '') return `${label} is required`
    return undefined
  },

  email: (value: string): string | undefined => {
    if (!value) return undefined
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(value) ? undefined : 'Enter a valid email address'
  },

  minLength: (value: string, min: number, label = 'This field'): string | undefined => {
    if (!value) return undefined
    return value.length < min ? `${label} must be at least ${min} characters` : undefined
  },

  passwordMatch: (password: string, confirm: string): string | undefined => {
    if (!confirm) return undefined
    return password === confirm ? undefined : 'Passwords do not match'
  },
}

export function combineErrors(
  ...checks: (string | undefined)[]
): string | undefined {
  return checks.find((c) => c !== undefined)
}
