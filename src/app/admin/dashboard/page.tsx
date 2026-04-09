import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Lead {
  id: string
  nombre_empresa: string
  email: string
  website: string | null
  direccion: string | null
  telefono: string | null
  sector: string | null
  programa_solicitado: string | null
  nombre_contacto: string | null
  google_place_id: string | null
  datos_google: Record<string, unknown> | null
  created_at: string
  status: string
}

function computeScore(lead: Lead): number {
  let score = 0
  // +30 if came from Google Places autocomplete
  if (lead.google_place_id) score += 30
  // +20 if has Google data
  if (lead.datos_google && Object.keys(lead.datos_google).length > 0) score += 20
  // +15 if has website
  if (lead.website) score += 15
  // +10 if has phone
  if (lead.telefono) score += 10
  // +10 if has address
  if (lead.direccion) score += 10
  // +15 for key sectors
  const keySectors = ["saas", "fintech", "healthtech"]
  if (lead.sector && keySectors.includes(lead.sector.toLowerCase())) score += 15
  return Math.min(score, 100)
}

function ScoreBadge({ score }: { score: number }) {
  if (score >= 80) {
    return <Badge className="bg-black text-white border-black">{score}</Badge>
  }
  if (score >= 50) {
    return <Badge variant="secondary" className="bg-gray-100 text-black border-gray-300">{score}</Badge>
  }
  return <Badge variant="outline" className="text-gray-400 border-dashed border-gray-300">{score}</Badge>
}

function ProgramBadge({ program }: { program: string | null }) {
  if (!program) return <span className="text-gray-400 text-sm">—</span>
  return (
    <Badge variant="outline" className="border-gray-300 text-black font-normal">
      {program === "aceleracion" ? "Aceleración" : program === "innovacion" ? "Innovación" : program}
    </Badge>
  )
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const { data: leads, error } = await supabase
    .from("empresas_leads")
    .select("*")
    .order("created_at", { ascending: false })

  const allLeads: Lead[] = (leads as Lead[]) ?? []
  const totalLeads = allLeads.length
  const aceleracionCount = allLeads.filter(
    (l) => l.programa_solicitado === "aceleracion"
  ).length
  const innovacionCount = allLeads.filter(
    (l) => l.programa_solicitado === "innovacion"
  ).length

  return (
    <div className="p-8 max-w-6xl">
      <h1 className="text-2xl font-bold tracking-tight text-black mb-8">
        Visión General
      </h1>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <Card className="border border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-black">{totalLeads}</p>
            <p className="text-xs text-gray-500 mt-1">Empresas registradas</p>
          </CardContent>
        </Card>
        <Card className="border border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Aceleración
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-black">{aceleracionCount}</p>
            <p className="text-xs text-gray-500 mt-1">Startups registradas</p>
          </CardContent>
        </Card>
        <Card className="border border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Innovación Abierta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-black">{innovacionCount}</p>
            <p className="text-xs text-gray-500 mt-1">
              Corporaciones registradas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Leads Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#F9F9F9]">
              <TableHead>Empresa</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead>Programa</TableHead>
              <TableHead>Sector</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Fecha</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allLeads.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-gray-400 py-12"
                >
                  No hay leads registrados aún.
                </TableCell>
              </TableRow>
            ) : (
              allLeads.map((lead) => {
                const score = computeScore(lead)
                return (
                  <TableRow key={lead.id}>
                    <TableCell>
                      <p className="font-medium text-black">
                        {lead.nombre_empresa}
                      </p>
                      {lead.website && (
                        <a
                          href={lead.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-gray-400 hover:text-gray-600"
                        >
                          {lead.website}
                        </a>
                      )}
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-black">
                        {lead.nombre_contacto ?? "—"}
                      </p>
                      <p className="text-xs text-gray-400">{lead.email}</p>
                    </TableCell>
                    <TableCell>
                      <ProgramBadge program={lead.programa_solicitado} />
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {lead.sector ?? "—"}
                    </TableCell>
                    <TableCell>
                      <ScoreBadge score={score} />
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {formatDate(lead.created_at)}
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {error && (
        <p className="mt-4 text-sm text-red-600">
          Error al cargar datos: {error.message}
        </p>
      )}
    </div>
  )
}
