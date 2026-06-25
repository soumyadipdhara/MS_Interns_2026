import { forwardRef, type SelectHTMLAttributes, type ReactNode } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  children: ReactNode
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, className = '', id, children, ...rest }, ref) => {
    const selectId = id || rest.name

    return (
      <div>
        {label && (
          <label htmlFor={selectId} className="input-label">
            {label}
            {rest.required && <span className="ml-0.5 text-red-500">*</span>}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={`input-field ${error ? 'input-error' : ''} ${className}`}
          {...rest}
        >
          {children}
        </select>
        {error && <p className="input-error-text">{error}</p>}
      </div>
    )
  }
)

Select.displayName = 'Select'

export default Select
