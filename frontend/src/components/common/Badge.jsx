import styles from './Badge.module.css'

const variantMap = {
  // Status
  'Active': 'success',
  'Inactive': 'default',
  'Pending': 'warning',
  'In Progress': 'info',
  'Completed': 'success',
  // Priority
  'Low': 'default',
  'Medium': 'info',
  'High': 'warning',
  'Critical': 'danger',
}

export default function Badge({ label, variant }) {
  const resolvedVariant = variant || variantMap[label] || 'default'
  return (
    <span className={`${styles.badge} ${styles[resolvedVariant]}`}>
      {label}
    </span>
  )
}
