import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Index from './pages/Index'
import Accounts from './pages/Accounts'
import Contacts from './pages/Contacts'
import LeadDetails from './pages/LeadDetails'
import Activities from './pages/Activities'
import Pipeline from './pages/Pipeline'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import CalendarView from './pages/Calendar'
import FocusMode from './pages/FocusMode'
import Proposals from './pages/Proposals'
import ProposalEditor from './pages/ProposalEditor'
import Orders from './pages/Orders'
import OrderEditor from './pages/OrderEditor'
import LostLeads from './pages/LostLeads'
import Clients from './pages/Clients'
import NotFound from './pages/NotFound'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Layout from './components/Layout'
import DebugSupabase from './pages/DebugSupabase'
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
            <Route path="/signup" element={<Signup />} />
            <Route path="/debug-supabase" element={<DebugSupabase />} />
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/accounts" element={<Accounts />} />
              <Route path="/leads/:id" element={<LeadDetails />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/activities" element={<Activities />} />
              <Route path="/pipeline" element={<Pipeline />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/settings/company" element={<Settings />} />
              <Route path="/calendar" element={<CalendarView />} />
              <Route path="/focus" element={<FocusMode />} />
              <Route path="/proposals" element={<Proposals />} />
              <Route path="/proposals/:id" element={<ProposalEditor />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/orders/new" element={<OrderEditor />} />
              <Route path="/orders/:id" element={<OrderEditor />} />
              <Route path="/lost-leads" element={<LostLeads />} />
              <Route path="/clients" element={<Clients />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </BrowserRouter>
    </MainProvider>
  </AuthProvider>
)

export default App
