"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const GMB_PAYLOAD = {
  languageCode: "es",
  profile: {
    description:
      "Lanzadera es el Centro de Alto Rendimiento para Startups en España, impulsado por Juan Roig y Marina de Empresas. Ofrecemos programas de Aceleración e Innovación Abierta, conectando a emprendedores con inversión, mentoría de primer nivel y corporaciones líderes para escalar modelos de negocio sin fricciones.",
  },
  regularHours: {
    periods: [
      { openDay: "MONDAY", openTime: { hours: 9, minutes: 0 }, closeDay: "MONDAY", closeTime: { hours: 19, minutes: 0 } },
      { openDay: "TUESDAY", openTime: { hours: 9, minutes: 0 }, closeDay: "TUESDAY", closeTime: { hours: 19, minutes: 0 } },
      { openDay: "WEDNESDAY", openTime: { hours: 9, minutes: 0 }, closeDay: "WEDNESDAY", closeTime: { hours: 19, minutes: 0 } },
      { openDay: "THURSDAY", openTime: { hours: 9, minutes: 0 }, closeDay: "THURSDAY", closeTime: { hours: 19, minutes: 0 } },
      { openDay: "FRIDAY", openTime: { hours: 9, minutes: 0 }, closeDay: "FRIDAY", closeTime: { hours: 15, minutes: 0 } },
    ],
  },
}

const DAYS_ES: Record<string, string> = {
  MONDAY: "Lunes",
  TUESDAY: "Martes",
  WEDNESDAY: "Miércoles",
  THURSDAY: "Jueves",
  FRIDAY: "Viernes",
}

function formatTime(t: { hours: number; minutes: number }) {
  return `${String(t.hours).padStart(2, "0")}:${String(t.minutes).padStart(2, "0")}`
}

export default function SeoFixPage() {
  const [copied, setCopied] = useState(false)
  const payloadStr = JSON.stringify(GMB_PAYLOAD, null, 2)

  async function handleCopy() {
    await navigator.clipboard.writeText(payloadStr)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-2xl font-bold tracking-tight text-black mb-1">Corrección SEO Local</h1>
      <p className="text-sm text-gray-500 mb-8">
        Corrige los hallazgos críticos de la auditoría: horarios de apertura y descripción editorial
        faltantes en el Perfil de Empresa de Google.
      </p>

      {/* Audit findings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card className="border-red-200 bg-red-50/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-red-800">Hallazgo: Horarios faltantes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-red-700">
              El Perfil de Empresa de Google de Lanzadera no muestra horarios de apertura.
              Esto reduce la visibilidad local y la confianza del usuario.
            </p>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-red-800">Hallazgo: Sin descripción editorial</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-red-700">
              Falta una descripción editorial en el perfil de Google. Esto impacta negativamente
              el SEO local y la claridad de la oferta.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Preview */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Vista previa de la corrección</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Descripción editorial</h3>
            <p className="text-sm text-gray-800 leading-relaxed border-l-2 border-black pl-3">
              {GMB_PAYLOAD.profile.description}
            </p>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Horarios de apertura</h3>
            <div className="space-y-1">
              {GMB_PAYLOAD.regularHours.periods.map((p) => (
                <div key={p.openDay} className="flex items-center gap-3 text-sm">
                  <span className="w-24 font-medium text-gray-700">{DAYS_ES[p.openDay]}</span>
                  <span className="text-gray-600">
                    {formatTime(p.openTime)} – {formatTime(p.closeTime)}
                  </span>
                </div>
              ))}
              <div className="flex items-center gap-3 text-sm">
                <span className="w-24 font-medium text-gray-400">Sábado</span>
                <span className="text-gray-400">Cerrado</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="w-24 font-medium text-gray-400">Domingo</span>
                <span className="text-gray-400">Cerrado</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* JSON payload */}
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-semibold">Payload JSON para Google Business Profile API</CardTitle>
            <p className="text-xs text-gray-500 mt-1">
              PATCH https://mybusinessbusinessinformation.googleapis.com/v1/&#123;locations/*&#125;?updateMask=profile.description,regularHours
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleCopy} className="shrink-0">
            {copied ? "✓ Copiado" : "Copiar Payload"}
          </Button>
        </CardHeader>
        <CardContent>
          <textarea
            readOnly
            value={payloadStr}
            className="w-full h-80 font-mono text-xs bg-[#F9F9F9] border border-gray-200 rounded-md p-4 resize-none focus:outline-none"
          />
        </CardContent>
      </Card>

      <p className="text-xs text-gray-400 mt-4">
        Instrucciones: Copia el payload y aplícalo mediante la consola de Google Business Profile API
        o envíalo al equipo técnico de Google My Business de Lanzadera.
      </p>
    </div>
  )
}
