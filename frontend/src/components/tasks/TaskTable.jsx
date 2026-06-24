import Badge from '../common/Badge'
import Button from '../common/Button'
import styles from './TaskTable.module.css'
import { format } from 'date-fns'

export default function TaskTable({ tasks, onEdit, onDelete, isAdmin }) {
  if (tasks.length === 0) {
    return (
      <div className={styles.empty}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="48" height="48" color="var(--gray-300)">
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
        <p>No tasks found</p>
        <span>Try adjusting your search or filters</span>
      </div>
    )
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Task ID</th>
            <th>Title</th>
            <th>Priority</th>
            <th>Due Date</th>
            <th>Assigned To</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => {
            const isOverdue = task.status !== 'Completed' && new Date(task.due_date) < new Date()
            return (
              <tr key={task.id}>
                <td>
                  <span className={styles.taskId}>{task.task_id}</span>
                </td>
                <td>
                  <div className={styles.titleCell}>
                    <div className={styles.taskTitle}>{task.title}</div>
                    {task.description && (
                      <div className={styles.taskDesc}>{task.description.slice(0, 60)}{task.description.length > 60 ? '…' : ''}</div>
                    )}
                  </div>
                </td>
                <td><Badge label={task.priority} /></td>
                <td>
                  <span className={isOverdue ? styles.overdue : ''}>
                    {task.due_date ? format(new Date(task.due_date), 'MMM d, yyyy') : '—'}
                    {isOverdue && <span className={styles.overdueTag}>Overdue</span>}
                  </span>
                </td>
                <td>
                  {task.assigned_employee ? (
                    <div className={styles.assignee}>
                      <div className={styles.assigneeAvatar}>
                        {task.assigned_employee.name[0].toUpperCase()}
                      </div>
                      <span>{task.assigned_employee.name}</span>
                    </div>
                  ) : (
                    <span className={styles.unassigned}>Unassigned</span>
                  )}
                </td>
                <td><Badge label={task.status} /></td>
                <td>
                  <div className={styles.actionBtns}>
                    <Button variant="ghost" size="sm" onClick={() => onEdit(task)}>
                      {isAdmin ? 'Edit' : 'Update Status'}
                    </Button>
                    {isAdmin && (
                      <Button variant="danger" size="sm" onClick={() => onDelete(task)}>Delete</Button>
                    )}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
