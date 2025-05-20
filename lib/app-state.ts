// Types pour les données de l'application
export type NoteName = "C" | "C#" | "D" | "D#" | "E" | "F" | "F#" | "G" | "G#" | "A" | "A#" | "B"
export type ScaleType = "major" | "minor" | "harmonic minor" | "melodic minor"

export interface ScaleSelection {
  key: NoteName
  type: ScaleType
}

export interface NoteRange {
  start: {
    note: NoteName
    octave: number
    label: string
  }
  end: {
    note: NoteName
    octave: number
    label: string
  }
}

// Valeurs par défaut
export const DEFAULT_SCALE: ScaleSelection = { key: "C", type: "major" }
export const DEFAULT_RANGE: NoteRange = {
  start: { note: "B", octave: 3, label: "B3" },
  end: { note: "C", octave: 5, label: "C5" },
}
export const DEFAULT_TAB = "scales"

// Fonctions pour sauvegarder et charger les données
export function saveAppState(scale: ScaleSelection, range: NoteRange, activeTab: string): void {
  localStorage.setItem("saxophoneSelectedScale", JSON.stringify(scale))
  localStorage.setItem("saxophoneNoteRange", JSON.stringify(range))
  localStorage.setItem("saxophoneActiveTab", activeTab)
}

export function loadAppState(): {
  scale: ScaleSelection
  range: NoteRange
  activeTab: string
} {
  let scale = DEFAULT_SCALE
  let range = DEFAULT_RANGE
  let activeTab = DEFAULT_TAB

  try {
    const savedScale = localStorage.getItem("saxophoneSelectedScale")
    if (savedScale) {
      scale = JSON.parse(savedScale)
    }

    const savedRange = localStorage.getItem("saxophoneNoteRange")
    if (savedRange) {
      range = JSON.parse(savedRange)
    }

    const savedTab = localStorage.getItem("saxophoneActiveTab")
    if (savedTab) {
      activeTab = savedTab
      if (activeTab !== "scales" && activeTab !== "about") {
        activeTab = DEFAULT_TAB
      }
    }
  } catch (error) {
    console.error("Erreur lors du chargement des données:", error)
  }

  return { scale, range, activeTab }
}
