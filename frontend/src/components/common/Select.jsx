import { forwardRef } from 'react'
import styles from './Input.module.css'
import selectStyles from './Select.module.css'

const Select = forwardRef(function Select(
  { label, error, required, children, className = '', ...props },
  ref
) {
  return (
    <div className={`${styles.group} ${className}`}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <select
        ref={ref}
        className={`${styles.input} ${selectStyles.select} ${error ? styles.inputError : ''}`}
        {...props}
      >
        {children}
      </select>
      {error && <span className={styles.error}>{error}</span>}
    </div>
  )
})

export default Select
