import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { GA4Script } from "@/components/ga4-script"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  title: {
    default: "Lanzadera — Centro de Alto Rendimiento para Startups",
    template: "%s | Lanzadera",
  },
  description:
    "Plataforma de captación y onboarding B2B para startups y corporaciones. Programas de Aceleración e Innovación Abierta respaldados por Juan Roig y Marina de Empresas.",
  metadataBase: new URL("https://aiteam-lanzadera-mns08mk9.vercel.app"),
  alternates: { canonical: "/" },
  openGraph: {
    title: "Lanzadera — Centro de Alto Rendimiento para Startups",
    description:
      "Programas de Aceleración e Innovación Abierta para startups y corporaciones. Aplica en menos de 1 minuto.",
    type: "website",
    locale: "es_ES",
    siteName: "Lanzadera",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lanzadera — Centro de Alto Rendimiento para Startups",
    description:
      "Escala tu empresa con Lanzadera. Programas de Aceleración e Innovación Abierta.",
  },
  robots: { index: true, follow: true },
  keywords: [
    "Lanzadera",
    "aceleradora startups España",
    "programa aceleración Valencia",
    "innovación abierta corporaciones",
    "Marina de Empresas",
    "Juan Roig startups",
    "onboarding B2B",
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={cn("h-full antialiased font-sans", geist.variable)}>
      <body className="min-h-full flex flex-col font-sans bg-white text-black">
        <GA4Script />
        {children}
      </body>
    </html>
  )
}
