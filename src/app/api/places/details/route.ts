import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const placeId = request.nextUrl.searchParams.get("place_id")
  if (!placeId) {
    return Response.json({ error: "place_id required" }, { status: 400 })
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  if (!apiKey || apiKey === "MOCK_GOOGLE_PLACES_KEY_HERE") {
    // Return mock details for development
    return Response.json({
      result: {
        name: "Empresa Mock S.L.",
        formatted_address: "Calle de la Innovación 42, 46024 Valencia, España",
        website: "https://empresa-mock.es",
        formatted_phone_number: "+34 963 123 456",
        address_components: [
          { long_name: "Valencia", types: ["locality"] },
          { long_name: "Valencia", types: ["administrative_area_level_2"] },
          { long_name: "46024", types: ["postal_code"] },
        ],
        place_id: placeId,
      },
    })
  }

  const fields = "name,formatted_address,website,formatted_phone_number,address_components,place_id,geometry,types"
  const url = new URL("https://maps.googleapis.com/maps/api/place/details/json")
  url.searchParams.set("place_id", placeId)
  url.searchParams.set("fields", fields)
  url.searchParams.set("language", "es")
  url.searchParams.set("key", apiKey)

  const res = await fetch(url.toString())
  const data = await res.json()

  return Response.json({ result: data.result || null })
}
