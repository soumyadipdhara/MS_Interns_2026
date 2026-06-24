import { useState, useEffect, useCallback } from 'react'
import { taskAPI, employeeAPI } from '../api'
import { useAuth } from '../context/AuthContext'
import TaskTable from '../components/tasks/TaskTable'
import TaskForm from '../components/tasks/TaskForm'
import Modal from '../components/common/Modal'
import ConfirmDialog from '../components/common/ConfirmDialog'
import Button from '../components/common/Button'
import Select from '../components/common/Select'
import Spinner from '../components/common/Spinner'
import toast from 'react-hot-toast'
import styles from './ListPage.module.css'

export default function TasksPage() {
  const { isAdmin } = useAuth()
  const [tasks, setTasks] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [employees, setEmployees] = useState([])

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [priority, setPriority] = useState('')
  const [employeeId, setEmployeeId] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    if (isAdmin) {
      employeeAPI.list({ limit: 500 })
        .then(({ data }) => setEmployees(data.employees))
        .catch(() => {})
    }
  }, [isAdmin])

  const fetchTasks = useCallback(() => {
    setLoading(true)
    const params = {}
    if (search) params.search = search
    if (status) params.status = status
    if (priority) params.priority = priority
    if (employeeId) params.employee_id = employeeId
    taskAPI.list(params)
      .then(({ data }) => {
        setTasks(data.tasks)
        setTotal(data.total)
      })
      .catch(() => toast.error('Failed to load tasks'))
      .finally(() => setLoading(false))
  }, [search, status, priority, employeeId])

  useEffect(() => {
    const t = setTimeout(fetchTasks, 300)
    return () => clearTimeout(t)
  }, [fetchTasks])

  const handleEdit = (task) => { setEditingTask(task); setShowForm(true) }
  const handleDelete = (task) => setDeleteTarget(task)

  const confirmDelete = async () => {
    setDeleteLoading(true)
    try {
      await taskAPI.delete(deleteTarget.id)
      toast.success('Task deleted')
      setDeleteTarget(null)
      fetchTasks()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to delete task')
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingTask(null)
    fetchTasks()
  }

  const clearFilters = () => {
    setSearch('')
    setStatus('')
    setPriority('')
    setEmployeeId('')
  }

  const hasFilters = search || status || priority || employeeId

  return (
    <div className={styles.page}>
      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <div className={styles.searchWrap}>
            <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              className={styles.searchInput}
              placeholder="Search by title, task ID…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className={styles.clearSearch} onClick={() => setSearch('')}>✕</button>
            )}
          </div>
          <Select value={status} onChange={(e) => setStatus(e.target.value)} className={styles.filterSelect}>
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </Select>
          <Select value={priority} onChange={(e) => setPriority(e.target.value)} className={styles.filterSelect}>
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </Select>
          {isAdmin && (
            <Select value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} className={styles.filterSelect}>
              <option value="">All Employees</option>
              {employees.map((e) => (
                <option key={e.id} value={e.id}>{e.name}</option>
              ))}
            </Select>
          )}
          {hasFilters && (
            <button className={styles.clearFilters} onClick={clearFilters}>Clear filters</button>
          )}
        </div>
        <div className={styles.toolbarRight}>
          <span className={styles.total}>{total} task{total !== 1 ? 's' : ''}</span>
          {isAdmin && (
            <Button onClick={() => { setEditingTask(null); setShowForm(true) }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              New Task
            </Button>
          )}
        </div>
      </div>

      {loading ? <Spinner center /> : (
        <TaskTable
          tasks={tasks}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isAdmin={isAdmin}
        />
      )}

      <Modal
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditingTask(null) }}
        title={editingTask
          ? (isAdmin ? `Edit — ${editingTask.title}` : 'Update Task Status')
          : 'Create New Task'}
        width="580px"
      >
        <TaskForm
          task={editingTask}
          onSuccess={handleFormSuccess}
          onCancel={() => { setShowForm(false); setEditingTask(null) }}
          isAdmin={isAdmin}
        />
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        loading={deleteLoading}
        title="Delete Task"
        message={`Are you sure you want to delete "${deleteTarget?.title}" (${deleteTarget?.task_id})? This cannot be undone.`}
      />
    </div>
  )
}
