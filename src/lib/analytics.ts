// GA4 Analytics helper
// MOCK: replace G-XXXXXXXXXX with real GA4 Measurement ID when human reviews
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-XXXXXXXXXX"

export function getGAId() {
  return GA_MEASUREMENT_ID
}

type GTagEvent = {
  action: string
  category?: string
  label?: string
  value?: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

export function trackEvent({ action, category, label, value, ...rest }: GTagEvent) {
  if (typeof window === "undefined" || !window.gtag) return
  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value,
    ...rest,
  })
}

// Pre-defined events matching the taxonomy
export const analytics = {
  landingPageView: () => trackEvent({ action: "landing_page_view", category: "engagement" }),
  funnelStart: () => trackEvent({ action: "funnel_start", category: "funnel" }),
  funnelStep2: () => trackEvent({ action: "funnel_step_2_view", category: "funnel" }),
  funnelStep3: () => trackEvent({ action: "funnel_step_3_view", category: "funnel" }),
  leadFormSubmit: (programa: string) =>
    trackEvent({ action: "lead_form_submit", category: "conversion", label: programa }),
  adminLoginSuccess: () => trackEvent({ action: "admin_login_success", category: "admin" }),
}
