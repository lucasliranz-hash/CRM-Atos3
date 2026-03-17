import { Users, Truck, Bus, CarFront, CalendarDays } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useLeads } from '@/contexts/LeadsContext'

export function Metrics() {
  const { leads } = useLeads()

  const totalLeads = leads.length

  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  const newLeadsThisWeek = leads.filter(
    (l) => new Date(l.createdAt) >= oneWeekAgo,
  ).length

  const busCount = leads.filter((l) => l.vehicleType === 'Bus').length
  const truckCount = leads.filter((l) => l.vehicleType === 'Truck').length
  const mixedCount = leads.filter((l) => l.vehicleType === 'Mixed Fleet').length

  return (
    <div className="grid gap-4 md:grid-cols-3 mb-8">
      <Card className="bg-white/60 backdrop-blur-md border-white/60 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700">
            Total Leads
          </CardTitle>
          <div className="bg-blue-100 p-2 rounded-full">
            <Users className="h-4 w-4 text-blue-700" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-900">{totalLeads}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Total de prospects cadastrados
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white/60 backdrop-blur-md border-white/60 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700">
            Novos Leads
          </CardTitle>
          <div className="bg-green-100 p-2 rounded-full">
            <CalendarDays className="h-4 w-4 text-green-700" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-900">
            +{newLeadsThisWeek}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Adicionados nesta semana
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white/60 backdrop-blur-md border-white/60 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-700">
            Composição da Frota
          </CardTitle>
          <div className="bg-purple-100 p-2 rounded-full">
            <Truck className="h-4 w-4 text-purple-700" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <Bus className="h-3 w-3 text-blue-600" />
                <span className="text-gray-600">Bus</span>
              </div>
              <span className="font-semibold">{busCount}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <Truck className="h-3 w-3 text-orange-600" />
                <span className="text-gray-600">Truck</span>
              </div>
              <span className="font-semibold">{truckCount}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <CarFront className="h-3 w-3 text-purple-600" />
                <span className="text-gray-600">Mixed Fleet</span>
              </div>
              <span className="font-semibold">{mixedCount}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
