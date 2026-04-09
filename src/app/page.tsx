import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { TrackLandingView } from "@/components/track-page-view"

function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Lanzadera",
    url: "https://lanzadera.es",
    logo: "https://lanzadera.es/logo.png",
    description:
      "Centro de Alto Rendimiento para Startups. Programas de Aceleración e Innovación Abierta respaldados por Juan Roig y Marina de Empresas.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Muelle de la Aduana s/n, Edificio Lanzadera",
      addressLocality: "Valencia",
      addressRegion: "Comunidad Valenciana",
      postalCode: "46024",
      addressCountry: "ES",
    },
    founder: { "@type": "Person", name: "Juan Roig" },
    parentOrganization: { "@type": "Organization", name: "Marina de Empresas" },
    sameAs: [
      "https://www.linkedin.com/company/lanzadera",
      "https://twitter.com/laboratoriolzd",
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.6",
      reviewCount: "424",
      bestRating: "5",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "20:00",
      },
    ],
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export default function Home() {
  return (
    <>
      <JsonLd />
      <TrackLandingView />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-border">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <span className="text-lg font-bold tracking-tight">Lanzadera</span>
          <div className="hidden items-center gap-6 sm:flex">
            <a href="#programas" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Programas
            </a>
            <a href="#ecosistema" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Ecosistema
            </a>
            <Link href="/register">
              <Button variant="outline" size="sm">Aplicar ahora</Button>
            </Link>
          </div>
          <Link href="/register" className="sm:hidden">
            <Button variant="outline" size="sm">Aplicar</Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-3xl px-6 py-24 text-center md:py-32">
          <p className="mb-4 text-sm font-medium tracking-widest uppercase text-muted-foreground">
            Centro de Alto Rendimiento para Startups
          </p>
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            Escala tu empresa.<br className="hidden sm:block" /> Sin fricciones.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
            Únete a Lanzadera y accede a inversión, mentoría y corporaciones
            líderes. Aplica en menos de 1 minuto con nuestro onboarding
            inteligente.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/register">
              <Button size="lg" className="px-8 text-base">
                Iniciar Solicitud
              </Button>
            </Link>
            <a
              href="#programas"
              className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Ver programas <span aria-hidden="true">→</span>
            </a>
          </div>
        </section>

        {/* Programas */}
        <section id="programas" className="border-t border-border bg-[#F9F9F9] py-20">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="mb-12 text-center text-2xl font-semibold tracking-tight md:text-3xl">
              Programas diseñados para tu fase de crecimiento
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {/* Aceleración */}
              <Card className="flex flex-col">
                <CardHeader>
                  <p className="mb-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                    Para Startups
                  </p>
                  <CardTitle className="text-xl">Aceleración</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <CardDescription className="text-base leading-relaxed">
                    Mentoría intensiva, espacio de trabajo en Marina de Empresas
                    y acceso a rondas de inversión para escalar tu modelo de
                    negocio.
                  </CardDescription>
                </CardContent>
                <CardFooter>
                  <Link href="/register?programa=aceleracion" className="w-full">
                    <Button variant="outline" className="w-full">
                      Aplicar a Aceleración
                    </Button>
                  </Link>
                </CardFooter>
              </Card>

              {/* Innovación Abierta */}
              <Card className="flex flex-col">
                <CardHeader>
                  <p className="mb-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                    Para Corporaciones
                  </p>
                  <CardTitle className="text-xl">Innovación Abierta</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <CardDescription className="text-base leading-relaxed">
                    Conecta con el ecosistema emprendedor más ágil para resolver
                    retos estratégicos y desarrollar pilotos tecnológicos.
                  </CardDescription>
                </CardContent>
                <CardFooter>
                  <Link href="/register?programa=innovacion" className="w-full">
                    <Button variant="outline" className="w-full">
                      Explorar Innovación
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* Beneficios / Trust */}
        <section id="ecosistema" className="border-t border-border py-20">
          <div className="mx-auto max-w-5xl px-6">
            <div className="grid gap-12 md:grid-cols-3">
              <div className="text-center md:text-left">
                <h3 className="mb-2 text-lg font-semibold">Onboarding Inteligente</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Autocompletado de datos empresariales. Cero papeleo
                  innecesario.
                </p>
              </div>
              <div className="text-center md:text-left">
                <h3 className="mb-2 text-lg font-semibold">Respaldo Sólido</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Impulsado por Juan Roig y el ecosistema de Marina de Empresas.
                </p>
              </div>
              <div className="text-center md:text-left">
                <h3 className="mb-2 text-lg font-semibold">Red de Contactos</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Acceso directo a inversores, corporaciones y talento.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-white py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Lanzadera</span>
            <span>© 2024 Marina de Empresas</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacidad</a>
            <a href="#" className="hover:text-foreground transition-colors">Cookies</a>
            <Link href="/admin/login" className="hover:text-foreground transition-colors">
              Acceso Admin
            </Link>
          </div>
        </div>
      </footer>
    </>
  )
}
