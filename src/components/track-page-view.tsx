"use client"

import { useEffect } from "react"
import { analytics } from "@/lib/analytics"

export function TrackLandingView() {
  useEffect(() => { analytics.landingPageView() }, [])
  return null
}
