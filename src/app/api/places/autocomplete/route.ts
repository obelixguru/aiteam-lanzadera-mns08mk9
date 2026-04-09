import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("input")
  if (!query || query.length < 2) {
    return Response.json({ predictions: [] })
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  if (!apiKey || apiKey === "MOCK_GOOGLE_PLACES_KEY_HERE") {
    // Return mock predictions for development
    return Response.json({
      predictions: [
        {
          place_id: "mock_place_1",
          description: `${query} S.L. — Valencia, España`,
          structured_formatting: {
            main_text: `${query} S.L.`,
            secondary_text: "Valencia, España",
          },
        },
        {
          place_id: "mock_place_2",
          description: `${query} Tech — Madrid, España`,
          structured_formatting: {
            main_text: `${query} Tech`,
            secondary_text: "Madrid, España",
          },
        },
      ],
    })
  }

  const url = new URL("https://maps.googleapis.com/maps/api/place/autocomplete/json")
  url.searchParams.set("input", query)
  url.searchParams.set("types", "establishment")
  url.searchParams.set("components", "country:es")
  url.searchParams.set("language", "es")
  url.searchParams.set("key", apiKey)

  const res = await fetch(url.toString())
  const data = await res.json()

  return Response.json({
    predictions: (data.predictions || []).map((p: Record<string, unknown>) => ({
      place_id: p.place_id,
      description: p.description,
      structured_formatting: p.structured_formatting,
    })),
  })
}
