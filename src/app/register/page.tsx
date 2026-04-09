"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { PlacesAutocomplete } from "@/components/places-autocomplete"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { analytics } from "@/lib/analytics"

interface PlaceDetails {
  name: string
  formatted_address: string
  website?: string
  formatted_phone_number?: string
  address_components?: Array<{ long_name: string; types: string[] }>
  place_id: string
}

type Programa = "aceleracion" | "innovacion_abierta"

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [manualMode, setManualMode] = useState(false)

  // Step 1 — Company
  const [empresa, setEmpresa] = useState("")
  const [direccion, setDireccion] = useState("")
  const [website, setWebsite] = useState("")
  const [placeId, setPlaceId] = useState<string | null>(null)
  const [datosGoogle, setDatosGoogle] = useState<Record<string, unknown>>({})
  const [ciudad, setCiudad] = useState("")
  const [provincia, setProvincia] = useState("")
  const [codigoPostal, setCodigoPostal] = useState("")

  // Step 2 — Contact
  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [telefono, setTelefono] = useState("")

  // Step 3 — Program
  const [programa, setPrograma] = useState<Programa | null>(null)
  const [sector, setSector] = useState("")

  useEffect(() => { analytics.funnelStart() }, [])
  useEffect(() => {
    if (step === 2) analytics.funnelStep2()
    if (step === 3) analytics.funnelStep3()
  }, [step])

  function handlePlaceSelect(details: PlaceDetails) {
    setEmpresa(details.name)
    setDireccion(details.formatted_address)
    setWebsite(details.website || "")
    setPlaceId(details.place_id)
    setDatosGoogle(details as unknown as Record<string, unknown>)
    setManualMode(false)

    const comps = details.address_components || []
    const loc = comps.find((c) => c.types.includes("locality"))
    const prov = comps.find((c) => c.types.includes("administrative_area_level_2"))
    const cp = comps.find((c) => c.types.includes("postal_code"))
    if (loc) setCiudad(loc.long_name)
    if (prov) setProvincia(prov.long_name)
    if (cp) setCodigoPostal(cp.long_name)
  }

  const canContinueStep1 = empresa.trim().length > 0
  const canContinueStep2 = nombre.trim().length > 0 && email.trim().length > 0
  const canSubmit = programa !== null

  async function handleSubmit() {
    if (!programa) return
    setSubmitting(true)
    try {
      const supabase = createClient()
      await supabase.from("empresas_leads").insert({
        nombre: empresa,
        email,
        telefono: telefono || null,
        website: website || null,
        direccion: direccion || null,
        ciudad: ciudad || null,
        provincia: provincia || null,
        codigo_postal: codigoPostal || null,
        sector: sector || null,
        programa_solicitado: programa,
        google_place_id: placeId,
        datos_google: datosGoogle,
        score: 0,
        status: "nuevo",
      })
      analytics.leadFormSubmit(programa)
      setSubmitted(true)
    } catch {
      alert("Error al enviar. Inténtalo de nuevo.")
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <Card className="w-full max-w-lg text-center">
          <CardHeader>
            <CardTitle className="text-2xl">¡Solicitud enviada!</CardTitle>
            <CardDescription>
              Hemos recibido tu solicitud. Nuestro equipo la revisará y te contactará pronto.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button variant="outline">Volver al inicio</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Progress indicator */}
        <div className="mb-8 flex items-center justify-center gap-2 text-sm text-gray-500">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs font-medium ${
                  s === step
                    ? "border-black bg-black text-white"
                    : s < step
                      ? "border-gray-300 bg-gray-100 text-gray-600"
                      : "border-gray-200 text-gray-400"
                }`}
              >
                {s < step ? "✓" : s}
              </div>
              {s < 3 && <div className={`h-px w-8 ${s < step ? "bg-gray-400" : "bg-gray-200"}`} />}
            </div>
          ))}
        </div>

        {/* Step 1: Company */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Tu Empresa</CardTitle>
              <CardDescription>
                Busca tu empresa y autocompletamos los datos por ti.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!manualMode ? (
                <>
                  <div>
                    <Label htmlFor="empresa">Nombre de la empresa</Label>
                    <PlacesAutocomplete onSelect={handlePlaceSelect} />
                  </div>
                  {empresa && (
                    <div className="space-y-3 rounded-md border border-gray-200 bg-gray-50 p-4 text-sm">
                      <p><span className="font-medium">Empresa:</span> {empresa}</p>
                      {direccion && <p><span className="font-medium">Dirección:</span> {direccion}</p>}
                      {website && <p><span className="font-medium">Web:</span> {website}</p>}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => setManualMode(true)}
                    className="text-xs text-gray-400 underline hover:text-gray-600"
                  >
                    ¿No encuentras tu empresa? Introducir datos manualmente
                  </button>
                </>
              ) : (
                <>
                  <div>
                    <Label htmlFor="empresa-manual">Nombre de la empresa</Label>
                    <Input
                      id="empresa-manual"
                      value={empresa}
                      onChange={(e) => setEmpresa(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="direccion">Dirección</Label>
                    <Input
                      id="direccion"
                      value={direccion}
                      onChange={(e) => setDireccion(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="website">Sitio web</Label>
                    <Input
                      id="website"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setManualMode(false)}
                    className="text-xs text-gray-400 underline hover:text-gray-600"
                  >
                    Volver a búsqueda automática
                  </button>
                </>
              )}
              <div className="pt-2">
                <Button
                  onClick={() => setStep(2)}
                  disabled={!canContinueStep1}
                  className="w-full"
                >
                  Continuar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Contact */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Datos de Contacto</CardTitle>
              <CardDescription>
                ¿Quién será el representante de {empresa || "tu empresa"}?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="nombre">Nombre completo</Label>
                <Input
                  id="nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="email">Email profesional</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  type="tel"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Atrás
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={!canContinueStep2}
                  className="flex-1"
                >
                  Continuar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Program */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Programa y Fit</CardTitle>
              <CardDescription>
                ¿Qué programa te interesa?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                <button
                  type="button"
                  onClick={() => setPrograma("aceleracion")}
                  className={`rounded-lg border p-4 text-left transition-colors ${
                    programa === "aceleracion"
                      ? "border-black bg-black/[0.02]"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <p className="font-semibold">Aceleración</p>
                  <p className="mt-1 text-sm text-gray-500">
                    Para startups buscando inversión y mentoría intensiva.
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => setPrograma("innovacion_abierta")}
                  className={`rounded-lg border p-4 text-left transition-colors ${
                    programa === "innovacion_abierta"
                      ? "border-black bg-black/[0.02]"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <p className="font-semibold">Innovación Abierta</p>
                  <p className="mt-1 text-sm text-gray-500">
                    Para corporaciones buscando resolver retos estratégicos.
                  </p>
                </button>
              </div>
              <div>
                <Label htmlFor="sector">Sector (opcional)</Label>
                <select
                  id="sector"
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                >
                  <option value="">Selecciona un sector</option>
                  <option value="SaaS">SaaS</option>
                  <option value="Fintech">Fintech</option>
                  <option value="Healthtech">Healthtech</option>
                  <option value="Retail">Retail</option>
                  <option value="DeepTech">DeepTech</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                  Atrás
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!canSubmit || submitting}
                  className="flex-1"
                >
                  {submitting ? "Enviando..." : "Enviar Solicitud"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
