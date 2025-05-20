"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Play, Pause, RotateCcw, Music, Zap } from "lucide-react"
import { FingeringDiagram } from "@/components/fingering-diagram"
import { MiniStaffNotation } from "@/components/mini-staff-notation"

// Tempos courants en BPM
const TEMPO_PRESETS = [
  { label: "Lent", value: 60 },
  { label: "Modéré", value: 90 },
  { label: "Allegro", value: 120 },
  { label: "Rapide", value: 144 },
]

// Positions dans le carrousel
const POSITIONS = {
  PREVIOUS: "previous",
  CURRENT: "current",
  NEXT: "next",
}

export function PracticeGame({ scaleNotes, filteredNotes }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [tempo, setTempo] = useState(90) // BPM par défaut
  const [randomMode, setRandomMode] = useState(true) // Mode aléatoire par défaut
  const [countdown, setCountdown] = useState(null)

  // Options d'affichage
  const [showLetterNote, setShowLetterNote] = useState(true) // Afficher la note sous forme de lettre
  const [showStaffNote, setShowStaffNote] = useState(true) // Afficher la note sur une portée
  const [showFingering, setShowFingering] = useState(true) // Afficher le doigté

  // État pour le carrousel de notes (précédente, actuelle, suivante)
  const [carouselNotes, setCarouselNotes] = useState([])
  const [beatCount, setBeatCount] = useState(0) // Compteur de temps pour les animations

  const intervalRef = useRef(null)
  const availableNotes = filteredNotes.length > 0 ? filteredNotes : scaleNotes

  // Calculer l'intervalle en millisecondes à partir du tempo
  const interval = 60000 / tempo

  // Fonction pour obtenir une note aléatoire
  const getRandomNote = () => {
    if (availableNotes.length === 0) return null

    // En mode aléatoire, choisir une note au hasard
    if (randomMode) {
      const randomIndex = Math.floor(Math.random() * availableNotes.length)
      return availableNotes[randomIndex]
    }
    // En mode séquentiel, suivre l'ordre de la gamme
    else {
      // Si aucune note actuelle, commencer par la première
      if (carouselNotes.length === 0) return availableNotes[0]

      // Trouver l'index de la note actuelle
      const currentNote = carouselNotes.find((item) => item.position === POSITIONS.CURRENT)?.note
      if (!currentNote) return availableNotes[0]

      const currentIndex = availableNotes.findIndex(
        (note) => note.name === currentNote.name && note.octave === currentNote.octave,
      )

      // Passer à la note suivante, ou revenir à la première si on est à la fin
      const nextIndex = (currentIndex + 1) % availableNotes.length
      return availableNotes[nextIndex]
    }
  }

  // Fonction pour avancer le carrousel
  const advanceCarousel = () => {
    // Générer une nouvelle note pour la position "suivante"
    const newNote = getRandomNote()
    if (!newNote) return

    // Mettre à jour le carrousel
    setCarouselNotes((prev) => {
      // Si le carrousel n'est pas encore complet, l'initialiser
      if (prev.length < 3) {
        const position = prev.length === 0 ? POSITIONS.CURRENT : prev.length === 1 ? POSITIONS.NEXT : POSITIONS.PREVIOUS
        return [...prev, { note: newNote, position }]
      }

      // Trouver les notes actuelles
      const currentNote = prev.find((item) => item.position === POSITIONS.CURRENT)?.note
      const nextNote = prev.find((item) => item.position === POSITIONS.NEXT)?.note

      // Créer un nouveau carrousel:
      // - La note actuelle devient précédente
      // - La note suivante devient actuelle
      // - La nouvelle note devient suivante
      return [
        { note: currentNote, position: POSITIONS.PREVIOUS },
        { note: nextNote, position: POSITIONS.CURRENT },
        { note: newNote, position: POSITIONS.NEXT },
      ]
    })

    // Incrémenter le compteur de temps pour les animations
    setBeatCount((prev) => prev + 1)
  }

  // Démarrer le jeu
  const startGame = () => {
    // Ajouter un compte à rebours de 3 secondes
    setCountdown(3)

    // Après le compte à rebours, démarrer le jeu
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval)
          actuallyStartGame()
          return null
        }
        return prev - 1
      })
    }, 1000)
  }

  // Fonction qui démarre réellement le jeu après le compte à rebours
  const actuallyStartGame = () => {
    setIsPlaying(true)
    setBeatCount(0)

    // Initialiser le carrousel avec trois notes
    const note1 = getRandomNote()
    const note2 = getRandomNote()
    const note3 = getRandomNote()

    if (note1 && note2 && note3) {
      setCarouselNotes([
        { note: note1, position: POSITIONS.PREVIOUS },
        { note: note2, position: POSITIONS.CURRENT },
        { note: note3, position: POSITIONS.NEXT },
      ])
    }

    // Démarrer l'intervalle pour avancer le carrousel
    intervalRef.current = setInterval(() => {
      advanceCarousel()
    }, interval)
  }

  // Arrêter le jeu
  const stopGame = () => {
    setIsPlaying(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  // Réinitialiser le jeu
  const resetGame = () => {
    stopGame()
    setCarouselNotes([])
    setBeatCount(0)
  }

  // Mettre à jour l'intervalle lorsque le tempo change
  useEffect(() => {
    if (isPlaying) {
      stopGame()
      actuallyStartGame()
    }
  }, [tempo, randomMode])

  // Nettoyer l'intervalle lorsque le composant est démonté
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  // Si aucune note n'est disponible
  if (availableNotes.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
          <CardTitle>Pratique des gammes</CardTitle>
          <CardDescription className="text-indigo-100">
            Aucune note disponible dans la plage sélectionnée.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  // Calculer la hauteur du carrousel en fonction des options d'affichage
  const getCarouselHeight = () => {
    let height = 100 // Hauteur de base pour la note (lettre)
    if (showStaffNote) height += 120 // Ajouter de l'espace pour la partition
    if (showFingering) height += 300 // Ajouter de l'espace pour le doigté
    return height
  }

  return (
    <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 shadow-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
        <CardTitle className="flex items-center gap-2">
          <Music className="h-6 w-6" />
          Pratique des gammes
        </CardTitle>
        <CardDescription className="text-indigo-100">
          Entraînez-vous à jouer les notes de la gamme à un tempo défini
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 p-6">
        {/* Affichage du compte à rebours */}
        {countdown && (
          <div className="flex justify-center items-center h-40">
            <div className="text-7xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text animate-pulse">
              {countdown}
            </div>
          </div>
        )}

        {/* Carrousel de notes */}
        {!countdown && carouselNotes.length > 0 && (
          <div
            className="relative rounded-xl bg-white overflow-hidden shadow-md border-2 border-indigo-200"
            style={{ height: `${getCarouselHeight()}px` }}
          >
            {/* Indicateur de tempo */}
            <div className="absolute top-2 right-2 bg-indigo-100 rounded-full px-3 py-1 text-xs font-semibold text-indigo-700 flex items-center gap-1 z-10">
              <Zap className={`h-3 w-3 ${beatCount % 2 === 0 ? "text-yellow-500" : "text-indigo-500"}`} />
              {tempo} BPM
            </div>

            {/* Conteneur du carrousel avec les 3 notes visibles */}
            <div className="grid grid-cols-3 h-full w-full">
              {carouselNotes.map((item, index) => {
                // Déterminer les styles en fonction de la position
                const isActive = item.position === POSITIONS.CURRENT

                return (
                  <div
                    key={`${item.note.name}${item.note.octave}-${index}`}
                    className={`transition-all duration-500 ease-in-out flex items-center justify-center
                      ${
                        isActive
                          ? "opacity-100 scale-100 z-20"
                          : item.position === POSITIONS.PREVIOUS
                            ? "opacity-40 scale-85 -translate-x-4 z-10"
                            : "opacity-40 scale-85 translate-x-4 z-10"
                      }`}
                  >
                    <div
                      className={`flex flex-col items-center p-4 w-full rounded-lg ${
                        isActive ? "bg-gradient-to-b from-indigo-50 to-white shadow-md" : ""
                      }`}
                    >
                      {/* Note sous forme de lettre */}
                      {showLetterNote && (
                        <div
                          className={`text-6xl font-bold mb-4 transition-all duration-300 ${
                            isActive
                              ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text"
                              : "text-gray-400"
                          }`}
                        >
                          {item.note.name}
                          <span className="text-3xl">{item.note.octave}</span>
                        </div>
                      )}

                      {/* Note sous forme de partition */}
                      {showStaffNote && (
                        <div
                          className={`w-full max-w-xs mb-4 transition-all duration-300 ${
                            isActive ? "transform scale-110" : "opacity-70"
                          }`}
                        >
                          <MiniStaffNotation note={item.note} />
                        </div>
                      )}

                      {/* Doigté (seulement pour la note active) */}
                      {showFingering && isActive && (
                        <div className="w-full max-w-xs animate-fadeIn">
                          <FingeringDiagram note={item.note} />
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Contrôles du tempo */}
        <div className="space-y-4 bg-white p-4 rounded-lg shadow-sm border border-indigo-100">
          <div className="flex justify-between items-center">
            <Label htmlFor="tempo-slider" className="text-indigo-700 font-semibold flex items-center gap-2">
              <Music className="h-4 w-4" />
              Tempo: {tempo} BPM
            </Label>
            <div className="flex gap-2 flex-wrap">
              {TEMPO_PRESETS.map((preset) => (
                <Button
                  key={preset.value}
                  variant={tempo === preset.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTempo(preset.value)}
                  disabled={isPlaying}
                  className={
                    tempo === preset.value
                      ? "bg-gradient-to-r from-indigo-500 to-purple-500 border-none"
                      : "border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                  }
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>

          <Slider
            id="tempo-slider"
            min={40}
            max={200}
            step={1}
            value={[tempo]}
            onValueChange={(values) => setTempo(values[0])}
            disabled={isPlaying}
            className="py-4"
          />
        </div>

        {/* Options de jeu */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-indigo-100 flex items-center space-x-2">
            <Switch
              id="random-mode"
              checked={randomMode}
              onCheckedChange={setRandomMode}
              disabled={isPlaying}
              className="data-[state=checked]:bg-indigo-500"
            />
            <Label htmlFor="random-mode" className="font-medium">
              Mode {randomMode ? "aléatoire" : "séquentiel"}
            </Label>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-indigo-100 flex items-center space-x-2">
            <Switch
              id="show-letter"
              checked={showLetterNote}
              onCheckedChange={setShowLetterNote}
              className="data-[state=checked]:bg-indigo-500"
            />
            <Label htmlFor="show-letter" className="font-medium">
              Afficher la note (lettre)
            </Label>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-indigo-100 flex items-center space-x-2">
            <Switch
              id="show-staff"
              checked={showStaffNote}
              onCheckedChange={setShowStaffNote}
              className="data-[state=checked]:bg-indigo-500"
            />
            <Label htmlFor="show-staff" className="font-medium">
              Afficher la partition
            </Label>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-indigo-100 flex items-center space-x-2">
            <Switch
              id="show-fingering"
              checked={showFingering}
              onCheckedChange={setShowFingering}
              className="data-[state=checked]:bg-indigo-500"
            />
            <Label htmlFor="show-fingering" className="font-medium">
              Afficher les doigtés
            </Label>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between p-6 bg-gradient-to-r from-indigo-100 to-purple-100">
        <Button
          variant="outline"
          onClick={resetGame}
          disabled={!isPlaying}
          className="border-indigo-300 text-indigo-700 hover:bg-indigo-50"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Réinitialiser
        </Button>

        <Button
          onClick={isPlaying ? stopGame : startGame}
          disabled={availableNotes.length === 0}
          className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-md"
        >
          {isPlaying ? (
            <>
              <Pause className="mr-2 h-4 w-4" />
              Pause
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Démarrer
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
