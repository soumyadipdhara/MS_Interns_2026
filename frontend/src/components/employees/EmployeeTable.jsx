import Badge from '../common/Badge'
import Button from '../common/Button'
import styles from './EmployeeTable.module.css'
import { format } from 'date-fns'

export default function EmployeeTable({ employees, onEdit, onDelete, isAdmin }) {
  if (employees.length === 0) {
    return (
      <div className={styles.empty}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="48" height="48" color="var(--gray-300)">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
        <p>No employees found</p>
        <span>Try adjusting your search or filters</span>
      </div>
    )
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Department</th>
            <th>Designation</th>
            <th>Joining Date</th>
            <th>Status</th>
            {isAdmin && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td>
                <span className={styles.empId}>{emp.employee_id}</span>
              </td>
              <td>
                <div className={styles.nameCell}>
                  <div className={styles.avatar}>{emp.name[0].toUpperCase()}</div>
                  <div>
                    <div className={styles.name}>{emp.name}</div>
                    <div className={styles.email}>{emp.email}</div>
                  </div>
                </div>
              </td>
              <td>{emp.department}</td>
              <td>{emp.designation}</td>
              <td>{emp.joining_date ? format(new Date(emp.joining_date), 'MMM d, yyyy') : '—'}</td>
              <td><Badge label={emp.status} /></td>
              {isAdmin && (
                <td>
                  <div className={styles.actionBtns}>
                    <Button variant="ghost" size="sm" onClick={() => onEdit(emp)}>Edit</Button>
                    <Button variant="danger" size="sm" onClick={() => onDelete(emp)}>Delete</Button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
