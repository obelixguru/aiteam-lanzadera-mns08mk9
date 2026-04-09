"use client"

import Script from "next/script"
import { getGAId } from "@/lib/analytics"

export function GA4Script() {
  const gaId = getGAId()
  if (gaId === "G-XXXXXXXXXX") return null // Don't load in dev/mock mode

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  )
}
