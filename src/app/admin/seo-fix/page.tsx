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

const UPDATE_MASK = "profile.description,regularHours"
const API_ENDPOINT = "https://mybusinessbusinessinformation.googleapis.com/v1/{name=locations/*}?updateMask=" + UPDATE_MASK

export default function SeoFixPage() {
  const [copied, setCopied] = useState<"payload" | "endpoint" | null>(null)

  function copyToClipboard(text: string, type: "payload" | "endpoint") {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(type)
      setTimeout(() => setCopied(null), 2000)
    })
  }

  const payloadString = JSON.stringify(GMB_PAYLOAD, null, 2)

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-2xl font-bold tracking-tight text-black mb-2">
        Corrección SEO — Google Business Profile
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        Este módulo genera el payload JSON exacto para corregir los hallazgos
        críticos de la auditoría SEO local: horarios de apertura y descripción
        editorial faltantes en el Perfil de Empresa de Google.
      </p>

      {/* Audit findings */}
      <div className="grid gap-4 md:grid-cols-2 mb-8">
        <Card className="border border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-gray-900">
              Horarios no publicados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500">
              La auditoría detectó que el Perfil de Empresa de Google de
              Lanzadera no tiene horarios de apertura configurados. El payload
              incluye L-J 9:00-19:00 y V 9:00-15:00.
            </p>
          </CardContent>
        </Card>
        <Card className="border border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-gray-900">
              Descripción editorial ausente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500">
              No existe una descripción editorial en el perfil. El payload
              incluye una descripción optimizada que destaca los programas y el
              respaldo de Juan Roig.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* API Endpoint */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
            API Endpoint (PATCH)
          </label>
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-7"
            onClick={() => copyToClipboard(API_ENDPOINT, "endpoint")}
          >
            {copied === "endpoint" ? "Copiado" : "Copiar"}
          </Button>
        </div>
        <code className="block w-full p-3 bg-[#F9F9F9] border border-gray-200 rounded-md text-xs text-gray-700 font-mono break-all">
          {API_ENDPOINT}
        </code>
        <p className="text-xs text-gray-400 mt-1">
          Requiere: OAuth 2.0 con permisos de propietario del perfil de empresa.
          updateMask={UPDATE_MASK}
        </p>
      </div>

      {/* JSON Payload */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
            Payload JSON
          </label>
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-7"
            onClick={() => copyToClipboard(payloadString, "payload")}
          >
            {copied === "payload" ? "Copiado" : "Copiar Payload"}
          </Button>
        </div>
        <textarea
          readOnly
          value={payloadString}
          className="w-full h-96 p-4 bg-[#F9F9F9] border border-gray-200 rounded-md text-xs text-gray-800 font-mono resize-none focus:outline-none"
        />
      </div>

      {/* Instructions */}
      <Card className="border border-dashed border-gray-300 bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-gray-900">
            Instrucciones de aplicación
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-gray-600 space-y-2">
          <p>
            1. Accede a la consola de Google Business Profile con la cuenta
            propietaria del perfil de Lanzadera.
          </p>
          <p>
            2. <strong>Opción manual:</strong> Actualiza los horarios (L-J
            9-19h, V 9-15h) y la descripción directamente desde la interfaz web.
          </p>
          <p>
            3. <strong>Opción API:</strong> Usa el payload JSON de arriba con una
            petición PATCH autenticada al endpoint indicado (requiere OAuth con
            verificación de propiedad del negocio).
          </p>
          <p>
            4. Tras aplicar los cambios, los hallazgos de la auditoría SEO local
            quedarán resueltos y la puntuación debería subir significativamente.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
