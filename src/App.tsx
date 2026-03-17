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
import NotFound from './pages/NotFound'
import Layout from './components/Layout'

const App = () => (
  <BrowserRouter
    future={{ v7_startTransition: false, v7_relativeSplatPath: false }}
  >
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Index />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/pipeline" element={<Pipeline />} />
          <Route path="/reports" element={<Reports />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </BrowserRouter>
)

export default App
