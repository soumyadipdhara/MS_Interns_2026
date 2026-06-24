import { forwardRef } from 'react'
import styles from './Input.module.css'

const Input = forwardRef(function Input(
  { label, error, required, className = '', type = 'text', ...props },
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
      <input
        ref={ref}
        type={type}
        className={`${styles.input} ${error ? styles.inputError : ''}`}
        {...props}
      />
      {error && <span className={styles.error}>{error}</span>}
    </div>
  )
})

export default Input
