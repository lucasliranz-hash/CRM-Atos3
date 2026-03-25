import { Outlet, Navigate } from 'react-router-dom'
import { Sidebar } from '@/components/Sidebar'
import { Header } from '@/components/Header'
import { useAuth } from '@/hooks/use-auth'

export default function Layout() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-black animate-pulse flex items-center justify-center shadow-lg">
            <span className="text-white font-black text-xl tracking-tighter">
              A3
            </span>
          </div>
          <p className="text-gray-500 font-bold text-sm tracking-wide">
            Carregando CRM...
          </p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="flex min-h-screen bg-slate-50/50 selection:bg-black selection:text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-20 transition-all duration-300 min-h-screen overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 w-full max-w-[1600px] mx-auto custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
