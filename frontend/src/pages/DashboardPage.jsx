import { useState, useEffect } from 'react'
import { taskAPI } from '../api'
import { useAuth } from '../context/AuthContext'
import Spinner from '../components/common/Spinner'
import Badge from '../components/common/Badge'
import styles from './DashboardPage.module.css'

function StatCard({ label, value, color, icon }) {
  return (
    <div className={styles.statCard} style={{ '--accent': color }}>
      <div className={styles.statIcon}>{icon}</div>
      <div className={styles.statBody}>
        <span className={styles.statValue}>{value ?? '—'}</span>
        <span className={styles.statLabel}>{label}</span>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { user, isAdmin } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    taskAPI.dashboardStats()
      .then(({ data }) => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner center />

  const taskCompletion = stats?.total_tasks
    ? Math.round((stats.completed_tasks / stats.total_tasks) * 100)
    : 0

  return (
    <div className={styles.page}>
      <div className={styles.welcome}>
        <h2 className={styles.welcomeTitle}>
          Welcome back, {user?.username}! 👋
        </h2>
        <p className={styles.welcomeSub}>
          {isAdmin ? "Here's your team's overview." : "Here's your task summary."}
        </p>
      </div>

      {/* Personal stats for regular users */}
      {!isAdmin && stats?.personal && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>My Tasks</h3>
          <div className={styles.personalBanner}>
            <div className={styles.personalInfo}>
              <span className={styles.personalName}>{stats.personal.employee_name}</span>
              <span className={styles.personalDept}>{stats.personal.department}</span>
            </div>
          </div>
          <div className={styles.grid}>
            <StatCard label="My Total Tasks" value={stats.personal.my_total_tasks} color="#4F46E5"
              icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>} />
            <StatCard label="Pending" value={stats.personal.my_pending} color="#F59E0B"
              icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>} />
            <StatCard label="In Progress" value={stats.personal.my_in_progress} color="#06B6D4"
              icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>} />
            <StatCard label="Completed" value={stats.personal.my_completed} color="#10B981"
              icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>} />
          </div>
        </section>
      )}

      {/* Admin - Workforce stats */}
      {isAdmin && (
        <>
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Workforce</h3>
            <div className={styles.grid}>
              <StatCard label="Total Employees" value={stats?.total_employees} color="#4F46E5"
                icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>} />
              <StatCard label="Active" value={stats?.active_employees} color="#10B981"
                icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>} />
              <StatCard label="Inactive" value={stats?.inactive_employees} color="#F59E0B"
                icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>} />
            </div>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Tasks Overview</h3>
            <div className={styles.grid}>
              <StatCard label="Total Tasks" value={stats?.total_tasks} color="#6366F1"
                icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>} />
              <StatCard label="Pending" value={stats?.pending_tasks} color="#F59E0B"
                icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>} />
              <StatCard label="In Progress" value={stats?.in_progress_tasks} color="#06B6D4"
                icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>} />
              <StatCard label="Completed" value={stats?.completed_tasks} color="#10B981"
                icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>} />
            </div>
          </section>

          {/* Task completion progress */}
          {stats?.total_tasks > 0 && (
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Task Completion Rate</h3>
              <div className={styles.progressCard}>
                <div className={styles.progressHeader}>
                  <span>Overall Progress</span>
                  <span className={styles.progressPct}>{taskCompletion}%</span>
                </div>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: `${taskCompletion}%` }} />
                </div>
                <div className={styles.progressLegend}>
                  <span className={styles.legendItem}><span className={styles.dot} style={{ background: '#F59E0B' }} />Pending: {stats.pending_tasks}</span>
                  <span className={styles.legendItem}><span className={styles.dot} style={{ background: '#06B6D4' }} />In Progress: {stats.in_progress_tasks}</span>
                  <span className={styles.legendItem}><span className={styles.dot} style={{ background: '#10B981' }} />Completed: {stats.completed_tasks}</span>
                </div>
              </div>
            </section>
          )}

          {/* Department breakdown */}
          {stats?.department_breakdown?.length > 0 && (
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Employees by Department</h3>
              <div className={styles.deptGrid}>
                {stats.department_breakdown.map((d) => (
                  <div key={d.department} className={styles.deptCard}>
                    <span className={styles.deptName}>{d.department}</span>
                    <span className={styles.deptCount}>{d.count}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Priority breakdown */}
          {stats?.priority_breakdown?.length > 0 && (
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Tasks by Priority</h3>
              <div className={styles.priorityList}>
                {stats.priority_breakdown.map((p) => (
                  <div key={p.priority} className={styles.priorityRow}>
                    <Badge label={p.priority} />
                    <div className={styles.priorityBar}>
                      <div
                        className={styles.priorityFill}
                        style={{
                          width: `${stats.total_tasks ? (p.count / stats.total_tasks) * 100 : 0}%`,
                          background: p.priority === 'Critical' ? '#EF4444' : p.priority === 'High' ? '#F59E0B' : p.priority === 'Medium' ? '#3B82F6' : '#6B7280'
                        }}
                      />
                    </div>
                    <span className={styles.priorityCount}>{p.count}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* No employee linked warning for users */}
      {!isAdmin && !stats?.personal && (
        <div className={styles.noLink}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="48" height="48">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <h3>No Employee Record Linked</h3>
          <p>Your account email doesn't match any employee in the system. Please contact your Admin to add your employee record with the email <strong>{user?.email}</strong>.</p>
        </div>
      )}
    </div>
  )
}
