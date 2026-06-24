import styles from './Spinner.module.css'

export default function Spinner({ size = 32, center = false }) {
  const el = (
    <div
      className={styles.spinner}
      style={{ width: size, height: size }}
      role="status"
      aria-label="Loading"
    />
  )
  if (center) {
    return <div className={styles.center}>{el}</div>
  }
  return el
}
