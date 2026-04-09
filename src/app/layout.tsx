import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Lanzadera — Centro de Alto Rendimiento para Startups",
  description:
    "Plataforma de captación y onboarding B2B para startups y corporaciones. Programas de Aceleración e Innovación Abierta respaldados por Juan Roig.",
  metadataBase: new URL("https://aiteam-lanzadera-mns08mk9.vercel.app"),
  openGraph: {
    title: "Lanzadera — Centro de Alto Rendimiento para Startups",
    description:
      "Programas de Aceleración e Innovación Abierta para startups y corporaciones.",
    type: "website",
    locale: "es_ES",
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-white text-black">
        {children}
      </body>
    </html>
  )
}
