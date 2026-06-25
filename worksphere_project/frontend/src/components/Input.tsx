import { forwardRef, type InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = '', id, ...rest }, ref) => {
    const inputId = id || rest.name

    return (
      <div>
        {label && (
          <label htmlFor={inputId} className="input-label">
            {label}
            {rest.required && <span className="ml-0.5 text-red-500">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`input-field ${error ? 'input-error' : ''} ${className}`}
          {...rest}
        />
        {error ? (
          <p className="input-error-text">{error}</p>
        ) : hint ? (
          <p className="mt-1.5 text-xs text-gray-500">{hint}</p>
        ) : null}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
