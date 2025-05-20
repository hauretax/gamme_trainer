"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ScaleSelector({ selectedScale, onScaleChange }) {
  const keys = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
  const types = ["major", "minor", "harmonic minor", "melodic minor"]

  const handleKeyChange = (value) => {
    onScaleChange({ ...selectedScale, key: value })
  }

  const handleTypeChange = (value) => {
    onScaleChange({ ...selectedScale, type: value })
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="key-select">Tonalité</Label>
        <Select value={selectedScale.key} onValueChange={handleKeyChange}>
          <SelectTrigger id="key-select" className="w-full">
            <SelectValue placeholder="Choisir une tonalité" />
          </SelectTrigger>
          <SelectContent>
            {keys.map((key) => (
              <SelectItem key={key} value={key}>
                {key}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="type-select">Type de gamme</Label>
        <Select value={selectedScale.type} onValueChange={handleTypeChange}>
          <SelectTrigger id="type-select" className="w-full">
            <SelectValue placeholder="Choisir un type" />
          </SelectTrigger>
          <SelectContent>
            {types.map((type) => (
              <SelectItem key={type} value={type}>
                {type === "major"
                  ? "Majeure"
                  : type === "minor"
                    ? "Mineure naturelle"
                    : type === "harmonic minor"
                      ? "Mineure harmonique"
                      : "Mineure mélodique"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
