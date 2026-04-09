-- Lanzadera B2B Platform - Initial Schema

-- Table: empresas_leads
-- Stores enriched company data from Google Places + form submissions
CREATE TABLE IF NOT EXISTS public.empresas_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  telefono TEXT,
  website TEXT,
  direccion TEXT,
  ciudad TEXT,
  provincia TEXT,
  codigo_postal TEXT,
  sector TEXT,
  programa_solicitado TEXT CHECK (programa_solicitado IN ('aceleracion', 'innovacion_abierta')),
  descripcion TEXT,
  num_empleados TEXT,
  score INTEGER DEFAULT 0,
  status TEXT DEFAULT 'nuevo' CHECK (status IN ('nuevo', 'contactado', 'en_proceso', 'aceptado', 'rechazado')),
  google_place_id TEXT,
  datos_google JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Table: usuarios_admin
-- Admin users linked to Supabase Auth
CREATE TABLE IF NOT EXISTS public.usuarios_admin (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  nombre TEXT,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'viewer')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Table: eventos_analitica
-- Analytics events for tracking funnel + admin activity
CREATE TABLE IF NOT EXISTS public.eventos_analitica (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo_evento TEXT NOT NULL,
  empresa_lead_id UUID REFERENCES public.empresas_leads(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.empresas_leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_programa ON public.empresas_leads(programa_solicitado);
CREATE INDEX IF NOT EXISTS idx_leads_created ON public.empresas_leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_eventos_tipo ON public.eventos_analitica(tipo_evento);
CREATE INDEX IF NOT EXISTS idx_eventos_lead ON public.eventos_analitica(empresa_lead_id);

-- RLS Policies
ALTER TABLE public.empresas_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usuarios_admin ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eventos_analitica ENABLE ROW LEVEL SECURITY;

-- empresas_leads: anyone can INSERT (public form), only authenticated admins can SELECT/UPDATE/DELETE
CREATE POLICY "Public can insert leads" ON public.empresas_leads
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Admins can view leads" ON public.empresas_leads
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.usuarios_admin WHERE id = auth.uid())
  );

CREATE POLICY "Admins can update leads" ON public.empresas_leads
  FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM public.usuarios_admin WHERE id = auth.uid())
  );

CREATE POLICY "Admins can delete leads" ON public.empresas_leads
  FOR DELETE TO authenticated USING (
    EXISTS (SELECT 1 FROM public.usuarios_admin WHERE id = auth.uid())
  );

-- usuarios_admin: only the user themselves or service role
CREATE POLICY "Admins can view own profile" ON public.usuarios_admin
  FOR SELECT TO authenticated USING (id = auth.uid());

-- eventos_analitica: anyone can INSERT (tracking), admins can SELECT
CREATE POLICY "Public can insert events" ON public.eventos_analitica
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Authenticated can insert events" ON public.eventos_analitica
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Admins can view events" ON public.eventos_analitica
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.usuarios_admin WHERE id = auth.uid())
  );

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.empresas_leads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
