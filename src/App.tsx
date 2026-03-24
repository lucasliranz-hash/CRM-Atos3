import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Index from './pages/Index'
import Accounts from './pages/Accounts'
import Contacts from './pages/Contacts'
import Activities from './pages/Activities'
import Pipeline from './pages/Pipeline'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'
import Login from './pages/Login'
import Layout from './components/Layout'
import { MainProvider } from '@/stores/main'
import { AuthProvider } from '@/hooks/use-auth'

const App = () => (
  <AuthProvider>
    <MainProvider>
      <BrowserRouter
        future={{ v7_startTransition: false, v7_relativeSplatPath: false }}
      >
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/accounts" element={<Accounts />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/activities" element={<Activities />} />
              <Route path="/pipeline" element={<Pipeline />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </BrowserRouter>
    </MainProvider>
  </AuthProvider>
)

export default App
