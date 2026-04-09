"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Input } from "@/components/ui/input"

interface Prediction {
  place_id: string
  description: string
  structured_formatting: {
    main_text: string
    secondary_text: string
  }
}

interface PlaceDetails {
  name: string
  formatted_address: string
  website?: string
  formatted_phone_number?: string
  address_components?: Array<{
    long_name: string
    types: string[]
  }>
  place_id: string
}

interface PlacesAutocompleteProps {
  onSelect: (details: PlaceDetails) => void
  placeholder?: string
}

export function PlacesAutocomplete({ onSelect, placeholder = "Nombre de tu empresa" }: PlacesAutocompleteProps) {
  const [query, setQuery] = useState("")
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  const search = useCallback(async (input: string) => {
    if (input.length < 2) {
      setPredictions([])
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/api/places/autocomplete?input=${encodeURIComponent(input)}`)
      const data = await res.json()
      setPredictions(data.predictions || [])
      setOpen(true)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleChange = (value: string) => {
    setQuery(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => search(value), 300)
  }

  const handleSelect = async (prediction: Prediction) => {
    setQuery(prediction.structured_formatting.main_text)
    setOpen(false)
    setPredictions([])
    try {
      const res = await fetch(`/api/places/details?place_id=${encodeURIComponent(prediction.place_id)}`)
      const data = await res.json()
      if (data.result) onSelect(data.result)
    } catch {
      // silently fail — user can fill manually
    }
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div ref={wrapperRef} className="relative">
      <Input
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
      />
      {loading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
          Buscando...
        </div>
      )}
      {open && predictions.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-sm">
          {predictions.map((p) => (
            <li
              key={p.place_id}
              className="cursor-pointer px-3 py-2 text-sm hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
              onMouseDown={() => handleSelect(p)}
            >
              <span className="font-medium">{p.structured_formatting.main_text}</span>
              <span className="ml-1 text-gray-500">{p.structured_formatting.secondary_text}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
