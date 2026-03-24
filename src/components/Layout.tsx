import { Outlet, Navigate } from 'react-router-dom'
import { Sidebar } from '@/components/Sidebar'
import { Header } from '@/components/Header'
import { useAuth } from '@/hooks/use-auth'

export default function Layout() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 font-bold animate-pulse">
          Carregando CRM...
        </p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

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
