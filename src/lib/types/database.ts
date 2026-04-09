export type ProgramaSolicitado = "aceleracion" | "innovacion_abierta" | "otro"
export type LeadStatus = "nuevo" | "contactado" | "en_proceso" | "aceptado" | "rechazado"
export type AdminRole = "admin" | "superadmin" | "viewer"

export interface EmpresaLead {
  id: string
  nombre: string
  email: string | null
  telefono: string | null
  website: string | null
  direccion: string | null
  ciudad: string | null
  provincia: string | null
  codigo_postal: string | null
  sector: string | null
  programa_solicitado: ProgramaSolicitado | null
  descripcion: string | null
  num_empleados: string | null
  score: number
  status: LeadStatus
  google_place_id: string | null
  datos_google: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface UsuarioAdmin {
  id: string
  email: string
  nombre: string | null
  role: AdminRole
  created_at: string
}

export interface EventoAnalitica {
  id: string
  tipo_evento: string
  empresa_lead_id: string | null
  metadata: Record<string, unknown>
  created_at: string
}
