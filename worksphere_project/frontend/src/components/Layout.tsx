import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

const titleMap: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/employees': 'Employees',
  '/tasks': 'Tasks',
}

function getTitle(pathname: string): string {
  for (const path of Object.keys(titleMap)) {
    if (pathname.startsWith(path)) return titleMap[path]
  }
  return 'WorkSphere'
}

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar onMenuClick={() => setSidebarOpen(true)} title={getTitle(location.pathname)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
