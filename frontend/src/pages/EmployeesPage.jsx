import { useState, useEffect, useCallback } from 'react'
import { employeeAPI } from '../api'
import { useAuth } from '../context/AuthContext'
import EmployeeTable from '../components/employees/EmployeeTable'
import EmployeeForm from '../components/employees/EmployeeForm'
import Modal from '../components/common/Modal'
import ConfirmDialog from '../components/common/ConfirmDialog'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import Select from '../components/common/Select'
import Spinner from '../components/common/Spinner'
import toast from 'react-hot-toast'
import styles from './ListPage.module.css'

const DEPARTMENTS = [
  'Engineering', 'Product', 'Design', 'Marketing',
  'Sales', 'HR', 'Finance', 'Operations', 'Legal', 'Customer Support',
]

export default function EmployeesPage() {
  const { isAdmin } = useAuth()
  const [employees, setEmployees] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [department, setDepartment] = useState('')
  const [status, setStatus] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const fetchEmployees = useCallback(() => {
    setLoading(true)
    const params = {}
    if (search) params.search = search
    if (department) params.department = department
    if (status) params.status = status
    employeeAPI.list(params)
      .then(({ data }) => {
        setEmployees(data.employees)
        setTotal(data.total)
      })
      .catch(() => toast.error('Failed to load employees'))
      .finally(() => setLoading(false))
  }, [search, department, status])

  useEffect(() => {
    const t = setTimeout(fetchEmployees, 300)
    return () => clearTimeout(t)
  }, [fetchEmployees])

  const handleEdit = (emp) => { setEditingEmployee(emp); setShowForm(true) }
  const handleDelete = (emp) => setDeleteTarget(emp)

  const confirmDelete = async () => {
    setDeleteLoading(true)
    try {
      await employeeAPI.delete(deleteTarget.id)
      toast.success(`${deleteTarget.name} deleted`)
      setDeleteTarget(null)
      fetchEmployees()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to delete')
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingEmployee(null)
    fetchEmployees()
  }

  const clearFilters = () => {
    setSearch('')
    setDepartment('')
    setStatus('')
  }

  const hasFilters = search || department || status

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
              placeholder="Search by name, email, department, ID…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className={styles.clearSearch} onClick={() => setSearch('')}>✕</button>
            )}
          </div>
          <Select value={department} onChange={(e) => setDepartment(e.target.value)} className={styles.filterSelect}>
            <option value="">All Departments</option>
            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
          </Select>
          <Select value={status} onChange={(e) => setStatus(e.target.value)} className={styles.filterSelect}>
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </Select>
          {hasFilters && (
            <button className={styles.clearFilters} onClick={clearFilters}>Clear filters</button>
          )}
        </div>
        <div className={styles.toolbarRight}>
          <span className={styles.total}>{total} employee{total !== 1 ? 's' : ''}</span>
          {isAdmin && (
            <Button onClick={() => { setEditingEmployee(null); setShowForm(true) }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add Employee
            </Button>
          )}
        </div>
      </div>

      {loading ? <Spinner center /> : (
        <EmployeeTable
          employees={employees}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isAdmin={isAdmin}
        />
      )}

      <Modal
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditingEmployee(null) }}
        title={editingEmployee ? `Edit — ${editingEmployee.name}` : 'Add New Employee'}
        width="640px"
      >
        <EmployeeForm
          employee={editingEmployee}
          onSuccess={handleFormSuccess}
          onCancel={() => { setShowForm(false); setEditingEmployee(null) }}
        />
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        loading={deleteLoading}
        title="Delete Employee"
        message={`Are you sure you want to delete ${deleteTarget?.name} (${deleteTarget?.employee_id})? Their tasks will be unassigned. This cannot be undone.`}
      />
    </div>
  )
}
