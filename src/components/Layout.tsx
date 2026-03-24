import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/Sidebar'
import { Header } from '@/components/Header'

export default function Layout() {
  return (
    <div className="flex min-h-screen relative overflow-x-hidden bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-20 transition-all duration-300">
        <Header />
        <main className="flex-1 p-6 md:p-10 pt-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
