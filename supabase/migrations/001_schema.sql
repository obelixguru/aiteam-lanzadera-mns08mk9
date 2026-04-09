-- Lanzadera B2B Platform Schema
-- Tables: empresas_leads, usuarios_admin, eventos_analitica

-- 1. empresas_leads — enriched lead data from Google Places
CREATE TABLE IF NOT EXISTS public.empresas_leads (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre text NOT NULL,
  email text,
  telefono text,
  website text,
  direccion text,
  ciudad text,
  provincia text,
  codigo_postal text,
  sector text,
  programa_solicitado text CHECK (programa_solicitado IN ('aceleracion', 'innovacion_abierta', 'otro')),
  descripcion_empresa text,
  num_empleados text,
  score integer DEFAULT 0 CHECK (score >= 0 AND score <= 100),
  status text DEFAULT 'nuevo' CHECK (status IN ('nuevo', 'contactado', 'en_proceso', 'aceptado', 'rechazado')),
  google_place_id text,
  datos_google jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. usuarios_admin — admin users (linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.usuarios_admin (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  nombre text,
  role text DEFAULT 'admin' CHECK (role IN ('admin', 'superadmin', 'viewer')),
  created_at timestamptz DEFAULT now()
);

-- 3. eventos_analitica — analytics events
CREATE TABLE IF NOT EXISTS public.eventos_analitica (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tipo_evento text NOT NULL,
  empresa_lead_id uuid REFERENCES public.empresas_leads(id) ON DELETE SET NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
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
CREATE POLICY "Allow public lead submission" ON public.empresas_leads
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view leads" ON public.empresas_leads
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can update leads" ON public.empresas_leads
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete leads" ON public.empresas_leads
  FOR DELETE USING (auth.role() = 'authenticated');

-- usuarios_admin: only authenticated users can see their own record
CREATE POLICY "Users can view own admin record" ON public.usuarios_admin
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Service role manages admins" ON public.usuarios_admin
  FOR ALL USING (auth.role() = 'service_role');

-- eventos_analitica: public insert (for tracking), admin select
CREATE POLICY "Allow public event tracking" ON public.eventos_analitica
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view events" ON public.eventos_analitica
  FOR SELECT USING (auth.role() = 'authenticated');

-- Updated_at trigger for empresas_leads
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
