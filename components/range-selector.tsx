"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Toutes les notes possibles
const ALL_NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]

// Plage d'octaves disponibles
const OCTAVES = [2, 3, 4, 5, 6]

// Générer toutes les notes avec octaves
const NOTES_WITH_OCTAVES = OCTAVES.flatMap((octave) =>
  ALL_NOTES.map((note) => ({ note, octave, label: `${note}${octave}` })),
)

export function RangeSelector({ initialRange, onRangeChange }) {
  // Référence pour suivre si c'est le premier rendu
  const isFirstRender = useRef(true)

  // Trouver les indices initiaux basés sur la plage fournie
  const findInitialIndex = useCallback((noteObj) => {
    return NOTES_WITH_OCTAVES.findIndex((n) => n.note === noteObj.note && n.octave === noteObj.octave)
  }, [])

  // Calculer les indices initiaux
  const initialStartIndex = findInitialIndex(initialRange.start)
  const initialEndIndex = findInitialIndex(initialRange.end)

  // Définir les états avec les valeurs par défaut
  const [startNoteIndex, setStartNoteIndex] = useState(
    initialStartIndex !== -1 ? initialStartIndex : 12, // B3 par défaut (index 12) si non trouvé
  )
  const [endNoteIndex, setEndNoteIndex] = useState(
    initialEndIndex !== -1 ? initialEndIndex : 25, // C5 par défaut (index 25) si non trouvé
  )

  // Mettre à jour la plage uniquement lorsque les indices changent et que ce n'est pas le premier rendu
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    const startNote = NOTES_WITH_OCTAVES[startNoteIndex]
    const endNote = NOTES_WITH_OCTAVES[endNoteIndex]

    onRangeChange({
      start: startNote,
      end: endNote,
    })
  }, [startNoteIndex, endNoteIndex, onRangeChange])

  // Mettre à jour les indices lorsque initialRange change
  useEffect(() => {
    const newStartIndex = findInitialIndex(initialRange.start)
    const newEndIndex = findInitialIndex(initialRange.end)

    if (newStartIndex !== -1 && newStartIndex !== startNoteIndex) {
      setStartNoteIndex(newStartIndex)
    }

    if (newEndIndex !== -1 && newEndIndex !== endNoteIndex) {
      setEndNoteIndex(newEndIndex)
    }
  }, [initialRange, findInitialIndex, startNoteIndex, endNoteIndex])

  // Gérer le changement de la note de début via le sélecteur
  const handleStartNoteChange = (value) => {
    const newIndex = NOTES_WITH_OCTAVES.findIndex((n) => n.label === value)
    if (newIndex !== -1) {
      // S'assurer que la note de début est toujours inférieure à la note de fin
      setStartNoteIndex(Math.min(newIndex, endNoteIndex - 1))
    }
  }

  // Gérer le changement de la note de fin via le sélecteur
  const handleEndNoteChange = (value) => {
    const newIndex = NOTES_WITH_OCTAVES.findIndex((n) => n.label === value)
    if (newIndex !== -1) {
      // S'assurer que la note de fin est toujours supérieure à la note de début
      setEndNoteIndex(Math.max(newIndex, startNoteIndex + 1))
    }
  }

  // Gérer le changement via le curseur
  const handleSliderChange = (values) => {
    if (values[0] < values[1]) {
      setStartNoteIndex(values[0])
      setEndNoteIndex(values[1])
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label>Plage de notes</Label>
          <div className="text-sm text-muted-foreground">
            {NOTES_WITH_OCTAVES[startNoteIndex].label} à {NOTES_WITH_OCTAVES[endNoteIndex].label}
          </div>
        </div>

        <Slider
          value={[startNoteIndex, endNoteIndex]}
          min={0}
          max={NOTES_WITH_OCTAVES.length - 1}
          step={1}
          onValueChange={handleSliderChange}
          className="py-4"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start-note">Note de début</Label>
          <Select value={NOTES_WITH_OCTAVES[startNoteIndex].label} onValueChange={handleStartNoteChange}>
            <SelectTrigger id="start-note">
              <SelectValue placeholder="Sélectionner une note" />
            </SelectTrigger>
            <SelectContent>
              {NOTES_WITH_OCTAVES.map((n, index) => (
                <SelectItem key={n.label} value={n.label} disabled={index >= endNoteIndex}>
                  {n.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="end-note">Note de fin</Label>
          <Select value={NOTES_WITH_OCTAVES[endNoteIndex].label} onValueChange={handleEndNoteChange}>
            <SelectTrigger id="end-note">
              <SelectValue placeholder="Sélectionner une note" />
            </SelectTrigger>
            <SelectContent>
              {NOTES_WITH_OCTAVES.map((n, index) => (
                <SelectItem key={n.label} value={n.label} disabled={index <= startNoteIndex}>
                  {n.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
