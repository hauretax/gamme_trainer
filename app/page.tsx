"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { ScaleSelector } from "@/components/scale-selector"
import { StaffNotation } from "@/components/staff-notation"
import { FingeringDiagram } from "@/components/fingering-diagram"
import { FingeringUploader } from "@/components/fingering-uploader"
import { RangeSelector } from "@/components/range-selector"
import { PracticeGame } from "@/components/practice-game"
import { SheetGenerator } from "@/components/sheet-generator"
import { NoteScroller } from "@/components/note-scroller"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { loadAppState, saveAppState } from "@/lib/app-state"
import { AboutSection } from "@/components/about-section"
import { Music, Play, Upload, Info } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"

// Toutes les notes possibles
const ALL_NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]

export default function MusicScalesApp() {
  // Référence pour suivre si c'est le premier rendu
  const isFirstRender = useRef(true)

  // Détecter si l'écran est petit (mobile) ou très petit
  const isMobile = useMediaQuery("(max-width: 640px)")
  const isVerySmall = useMediaQuery("(max-width: 380px)")

  // Charger l'état initial depuis le stockage local
  const { scale: initialScale, range: initialRange, activeTab: initialTab } = loadAppState()

  // États pour l'onglet actif, la gamme et la plage
  const [activeTab, setActiveTab] = useState(initialTab)
  const [selectedScale, setSelectedScale] = useState(initialScale)
  const [noteRange, setNoteRange] = useState(initialRange)

  // États pour les notes et la note sélectionnée
  const [selectedNote, setSelectedNote] = useState(null)
  const [scaleNotes, setScaleNotes] = useState([])
  const [filteredNotes, setFilteredNotes] = useState([])

  // Sauvegarder les paramètres lorsqu'ils changent, mais pas au premier rendu
  useEffect(() => {
    if (!isFirstRender.current) {
      saveAppState(selectedScale, noteRange, activeTab)
    } else {
      isFirstRender.current = false
    }
  }, [selectedScale, noteRange, activeTab])

  // Fonction pour générer les notes de la gamme
  const generateNotes = useCallback((key, type) => {
    // Intervals for different scale types (in semitones)
    const intervals = {
      major: [0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17, 19, 21, 23, 24], // 2 octaves
      minor: [0, 2, 3, 5, 7, 8, 10, 12, 14, 15, 17, 19, 20, 22, 24],
      "harmonic minor": [0, 2, 3, 5, 7, 8, 11, 12, 14, 15, 17, 19, 20, 23, 24],
      "melodic minor": [0, 2, 3, 5, 7, 9, 11, 12, 14, 15, 17, 19, 21, 23, 24],
    }

    // Find starting index
    const startIndex = ALL_NOTES.indexOf(key)
    if (startIndex === -1) return []

    // Generate scale based on intervals
    const scaleIntervals = intervals[type] || intervals.major

    // Generate notes
    // Commencer à l'octave 3 pour avoir une plage plus large
    return scaleIntervals.map((interval) => {
      const noteIndex = (startIndex + interval) % 12
      return {
        name: ALL_NOTES[noteIndex],
        octave: Math.floor((startIndex + interval) / 12) + 3, // Starting from octave 3
        position: interval, // Position in the scale (0 = root, etc.)
      }
    })
  }, [])

  // Fonction pour filtrer les notes en fonction de la plage
  const filterNotes = useCallback((notes, range) => {
    // Convertir les notes de début et de fin en valeurs numériques pour la comparaison
    const startValue = range.start.octave * 12 + ALL_NOTES.indexOf(range.start.note)
    const endValue = range.end.octave * 12 + ALL_NOTES.indexOf(range.end.note)

    // Filtrer les notes qui sont dans la plage
    return notes.filter((note) => {
      const noteValue = note.octave * 12 + ALL_NOTES.indexOf(note.name)
      return noteValue >= startValue && noteValue <= endValue
    })
  }, [])

  // Mettre à jour les notes de la gamme lorsque la sélection change
  useEffect(() => {
    const allNotes = generateNotes(selectedScale.key, selectedScale.type)
    setScaleNotes(allNotes)

    const filtered = filterNotes(allNotes, noteRange)
    setFilteredNotes(filtered)
  }, [selectedScale, noteRange, generateNotes, filterNotes])

  // Mettre à jour la note sélectionnée lorsque les notes filtrées changent
  useEffect(() => {
    if (filteredNotes.length > 0) {
      // Si une note est déjà sélectionnée, vérifier si elle est toujours dans la plage
      if (selectedNote) {
        const isInRange = filteredNotes.some(
          (note) => note.name === selectedNote.name && note.octave === selectedNote.octave,
        )

        // Si la note sélectionnée n'est plus dans la plage, sélectionner la première note
        if (!isInRange) {
          setSelectedNote(filteredNotes[0])
        }
      } else {
        // Si aucune note n'est sélectionnée, sélectionner la première note
        setSelectedNote(filteredNotes[0])
      }
    } else {
      // S'il n'y a pas de notes filtrées, réinitialiser la note sélectionnée
      setSelectedNote(null)
    }
  }, [filteredNotes, selectedNote])

  // Gérer le changement de gamme
  const handleScaleChange = useCallback((scale) => {
    setSelectedScale(scale)
  }, [])

  // Gérer le changement de plage
  const handleRangeChange = useCallback((range) => {
    setNoteRange(range)
  }, [])

  // Obtenir le nom complet de la gamme
  const getFullScaleName = () => {
    const scaleTypeNames = {
      major: "Majeure",
      minor: "Mineure naturelle",
      "harmonic minor": "Mineure harmonique",
      "melodic minor": "Mineure mélodique",
    }
    return `${selectedScale.key} ${scaleTypeNames[selectedScale.type] || selectedScale.type}`
  }

  // Composant de sélection de gamme et de plage réutilisable
  const ScaleAndRangeSelectors = () => (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <h2 className="text-lg font-semibold mb-4">Sélection de la gamme</h2>
        <ScaleSelector selectedScale={selectedScale} onScaleChange={handleScaleChange} />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Plage de notes</h2>
        <RangeSelector initialRange={noteRange} onRangeChange={handleRangeChange} />
      </div>
    </div>
  )

  return (
    <main className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Gammes Musicales</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
          {/* Menu adaptatif pour différentes tailles d'écran */}
          {isMobile ? (
            // Version mobile
            <div className="space-y-2">
              <TabsList className="grid w-full grid-cols-2 mb-2">
                <TabsTrigger value="scales" className="flex items-center justify-center gap-2">
                  <Music className="h-5 w-5" />
                  {!isVerySmall && <span>Gammes</span>}
                </TabsTrigger>
                <TabsTrigger value="practice" className="flex items-center justify-center gap-2">
                  <Play className="h-5 w-5" />
                  {!isVerySmall && <span>Pratique</span>}
                </TabsTrigger>
              </TabsList>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload" className="flex items-center justify-center gap-2">
                  <Upload className="h-5 w-5" />
                  {!isVerySmall && <span>Images</span>}
                </TabsTrigger>
                <TabsTrigger value="about" className="flex items-center justify-center gap-2">
                  <Info className="h-5 w-5" />
                  {!isVerySmall && <span>À propos</span>}
                </TabsTrigger>
              </TabsList>
            </div>
          ) : (
            // Version desktop avec texte complet
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="scales" className="flex items-center justify-center gap-2">
                <Music className="h-4 w-4" />
                <span>Gammes et Doigtés</span>
              </TabsTrigger>
              <TabsTrigger value="practice" className="flex items-center justify-center gap-2">
                <Play className="h-4 w-4" />
                <span>Pratique</span>
              </TabsTrigger>
              <TabsTrigger value="upload" className="flex items-center justify-center gap-2">
                <Upload className="h-4 w-4" />
                <span>Gérer les Images</span>
              </TabsTrigger>
              <TabsTrigger value="about" className="flex items-center justify-center gap-2">
                <Info className="h-4 w-4" />
                <span>À propos</span>
              </TabsTrigger>
            </TabsList>
          )}

          <TabsContent value="scales" className="mt-4">
            <div className="space-y-8">
              <ScaleAndRangeSelectors />

              <Separator />

              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <StaffNotation
                  scale={selectedScale}
                  scaleNotes={filteredNotes}
                  onNoteSelect={setSelectedNote}
                  selectedNote={selectedNote}
                />

                {/* Nouveau composant de défilement des notes */}
                <NoteScroller notes={filteredNotes} selectedNote={selectedNote} onNoteSelect={setSelectedNote} />
              </div>

              {selectedNote && (
                <div className="flex justify-center">
                  <FingeringDiagram note={selectedNote} />
                </div>
              )}

              <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                <h2 className="font-semibold mb-2">À propos des doigtés :</h2>
                <p>
                  Vous pouvez télécharger vos propres images de doigtés pour votre instrument dans l'onglet "Gérer les
                  Images". Nommez vos fichiers selon le format Note+Octave (ex: C4.jpg) ou Note+Octave+a+Numéro pour les
                  doigtés alternatifs (ex: C#4a1.jpg).
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="practice" className="mt-4">
            <div className="space-y-8">
              <ScaleAndRangeSelectors />

              <Separator />

              <PracticeGame scaleNotes={scaleNotes} filteredNotes={filteredNotes} />

              <Separator />

              <SheetGenerator scaleNotes={filteredNotes} scaleName={getFullScaleName()} />
            </div>
          </TabsContent>

          <TabsContent value="upload" className="mt-4">
            <FingeringUploader />
          </TabsContent>

          <TabsContent value="about" className="mt-4">
            <AboutSection />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
