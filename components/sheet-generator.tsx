"use client"

import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Shuffle, Music } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export function SheetGenerator({ scaleNotes, scaleName }) {
  const canvasRef = useRef(null)

  // Configuration de la partition
  const [linesCount, setLinesCount] = useState(4)
  const [notesPerLine, setNotesPerLine] = useState(12)
  const [randomNotes, setRandomNotes] = useState(false)
  const [notesToDraw, setNotesToDraw] = useState([])

  // Générer les notes à dessiner
  useEffect(() => {
    if (!scaleNotes || scaleNotes.length === 0) return

    // Si mode aléatoire activé, mélanger les notes
    if (randomNotes) {
      const totalNotes = linesCount * notesPerLine
      const randomizedNotes = []

      // Générer des notes aléatoires à partir des notes disponibles
      for (let i = 0; i < totalNotes; i++) {
        const randomIndex = Math.floor(Math.random() * scaleNotes.length)
        randomizedNotes.push(scaleNotes[randomIndex])
      }

      setNotesToDraw(randomizedNotes)
    } else {
      // Utiliser les notes de la gamme, répétées si nécessaire pour remplir toutes les lignes
      const totalNotes = linesCount * notesPerLine
      let repeatedNotes = []

      // Répéter les notes de la gamme jusqu'à avoir assez de notes
      while (repeatedNotes.length < totalNotes) {
        repeatedNotes = [...repeatedNotes, ...scaleNotes]
      }

      // Limiter au nombre exact de notes nécessaires
      setNotesToDraw(repeatedNotes.slice(0, totalNotes))
    }
  }, [scaleNotes, linesCount, notesPerLine, randomNotes])

  // Dessiner la partition quand les notes ou la configuration changent
  useEffect(() => {
    if (!canvasRef.current || notesToDraw.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    // Ajuster la hauteur du canvas en fonction du nombre de lignes
    canvas.height = 150 * linesCount + 50 // 150px par ligne + 50px de marge

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw staff and notes
    drawCompleteSheet(ctx, canvas.width, canvas.height, notesToDraw, scaleName, linesCount, notesPerLine)
  }, [notesToDraw, scaleName, linesCount, notesPerLine])

  // Fonction pour télécharger la partition
  const downloadSheet = () => {
    if (!canvasRef.current) return

    // Convertir le canvas en image
    const dataUrl = canvasRef.current.toDataURL("image/png")

    // Créer un lien de téléchargement
    const link = document.createElement("a")
    link.href = dataUrl
    link.download = `gamme_${scaleName.replace(/\s+/g, "_")}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Fonction pour générer de nouvelles notes aléatoires
  const regenerateRandomNotes = () => {
    if (!scaleNotes || scaleNotes.length === 0 || !randomNotes) return

    const totalNotes = linesCount * notesPerLine
    const randomizedNotes = []

    // Générer des notes aléatoires à partir des notes disponibles
    for (let i = 0; i < totalNotes; i++) {
      const randomIndex = Math.floor(Math.random() * scaleNotes.length)
      randomizedNotes.push(scaleNotes[randomIndex])
    }

    setNotesToDraw(randomizedNotes)
  }

  return (
    <Card className="w-full bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 shadow-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
        <CardTitle className="flex items-center gap-2">
          <Music className="h-6 w-6" />
          Partition de la gamme
        </CardTitle>
        <CardDescription className="text-indigo-100">
          Visualisez et téléchargez la partition complète de la gamme sélectionnée
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-indigo-100 space-y-2">
            <Label htmlFor="lines-count" className="text-indigo-700 font-semibold">
              Nombre de lignes
            </Label>
            <Input
              id="lines-count"
              type="number"
              min="1"
              max="10"
              value={linesCount}
              onChange={(e) => setLinesCount(Number.parseInt(e.target.value) || 1)}
              className="border-indigo-200 focus:ring-indigo-500"
            />
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-indigo-100 space-y-2">
            <Label htmlFor="notes-per-line" className="text-indigo-700 font-semibold">
              Notes par ligne
            </Label>
            <Input
              id="notes-per-line"
              type="number"
              min="1"
              max="24"
              value={notesPerLine}
              onChange={(e) => setNotesPerLine(Number.parseInt(e.target.value) || 1)}
              className="border-indigo-200 focus:ring-indigo-500"
            />
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-indigo-100 flex items-center space-x-2">
            <Switch
              id="random-notes"
              checked={randomNotes}
              onCheckedChange={setRandomNotes}
              className="data-[state=checked]:bg-indigo-500"
            />
            <Label htmlFor="random-notes" className="font-medium">
              Notes aléatoires
            </Label>
          </div>

          {randomNotes && (
            <div className="bg-white p-4 rounded-lg shadow-sm border border-indigo-100">
              <Button
                onClick={regenerateRandomNotes}
                variant="outline"
                className="w-full border-indigo-300 text-indigo-700 hover:bg-indigo-50"
              >
                <Shuffle className="mr-2 h-4 w-4" />
                Générer de nouvelles notes
              </Button>
            </div>
          )}
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md border-2 border-indigo-200 overflow-x-auto">
          <canvas
            ref={canvasRef}
            width={Math.max(800, notesPerLine * 50 + 100)}
            height={150 * linesCount + 50}
            className="w-full h-auto"
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between p-6 bg-gradient-to-r from-indigo-100 to-purple-100">
        <Button
          onClick={downloadSheet}
          className="ml-auto bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-md"
        >
          <Download className="mr-2 h-4 w-4" />
          Télécharger la partition
        </Button>
      </CardFooter>
    </Card>
  )
}

// Dessiner une partition complète
function drawCompleteSheet(ctx, width, height, notes, scaleName, linesCount, notesPerLine) {
  // Dessiner le fond
  ctx.fillStyle = "#ffffff"
  ctx.fillRect(0, 0, width, height)

  // Dessiner le titre
  ctx.fillStyle = "#4338ca" // Indigo-700
  ctx.font = "bold 20px Arial"
  ctx.textAlign = "center"
  ctx.fillText(`Gamme de ${scaleName}`, width / 2, 30)

  // Paramètres pour les portées
  const lineSpacing = 10
  const staffHeight = lineSpacing * 4 // Hauteur d'une portée (5 lignes)
  const lineHeight = 150 // Hauteur totale d'une ligne (portée + espace)

  // Diviser les notes en lignes
  for (let lineIndex = 0; lineIndex < linesCount; lineIndex++) {
    // Position Y de la portée actuelle
    const startY = 60 + lineIndex * lineHeight

    // Dessiner la portée
    drawStaff(ctx, width, startY, lineSpacing)

    // Dessiner les notes de cette ligne
    const lineNotes = notes.slice(lineIndex * notesPerLine, (lineIndex + 1) * notesPerLine)
    drawNotesOnStaff(ctx, lineNotes, startY, 100, (width - 120) / notesPerLine, lineSpacing)
  }
}

// Dessiner une portée avec clé de sol
function drawStaff(ctx, width, startY, lineSpacing) {
  ctx.strokeStyle = "#4338ca" // Indigo-700
  ctx.lineWidth = 1

  // Draw 5 staff lines
  for (let i = 0; i < 5; i++) {
    ctx.beginPath()
    ctx.moveTo(40, startY + i * lineSpacing)
    ctx.lineTo(width - 40, startY + i * lineSpacing)
    ctx.stroke()
  }

  // Draw treble clef
  drawTrebleClef(ctx, 60, startY + 2 * lineSpacing, lineSpacing * 4)
}

// Dessiner une clé de sol
function drawTrebleClef(ctx, x, y, height) {
  const scale = height / 80

  ctx.save()
  ctx.translate(x, y)
  ctx.scale(scale, scale)
  ctx.strokeStyle = "#4338ca" // Indigo-700
  ctx.lineWidth = 2

  // Draw the treble clef shape
  ctx.beginPath()

  // Main spiral
  ctx.moveTo(0, 0)
  ctx.bezierCurveTo(0, -10, 10, -30, 0, -40)
  ctx.bezierCurveTo(-15, -55, -20, -35, -15, -25)
  ctx.bezierCurveTo(-10, -15, 0, -10, 5, -20)
  ctx.bezierCurveTo(10, -30, 5, -45, -5, -50)
  ctx.bezierCurveTo(-15, -55, -25, -50, -30, -40)
  ctx.bezierCurveTo(-35, -25, -25, 0, -10, 15)
  ctx.bezierCurveTo(0, 25, 5, 35, 5, 45)
  ctx.bezierCurveTo(5, 55, 0, 65, -10, 70)

  // Lower curl
  ctx.bezierCurveTo(-20, 75, -30, 70, -30, 60)
  ctx.bezierCurveTo(-30, 50, -20, 40, -10, 40)
  ctx.bezierCurveTo(0, 40, 5, 45, 5, 55)
  ctx.bezierCurveTo(5, 65, -5, 75, -15, 75)

  ctx.stroke()
  ctx.restore()
}

// Dessiner les notes sur la portée
function drawNotesOnStaff(ctx, notes, startY, startX, noteSpacing, lineSpacing) {
  // Positions des notes sur la portée en clé de sol
  const notePositions = {
    C: -4, // Do (C4) - 2ème ligne supplémentaire en dessous
    "C#": -4,
    D: -3, // Ré (D4) - 1er espace en dessous
    "D#": -3,
    E: -2, // Mi (E4) - 1ère ligne supplémentaire en dessous
    F: -1, // Fa (F4) - 1er espace en dessous de la portée
    "F#": -1,
    G: 0, // Sol (G4) - 1ère ligne de la portée
    "G#": 0,
    A: 1, // La (A4) - 1er espace
    "A#": 1,
    B: 2, // Si (B4) - 2ème ligne
  }

  // Décalage vertical pour ajuster la position des notes
  const verticalOffset = (6 * lineSpacing) / 2

  notes.forEach((note, index) => {
    const x = startX + index * noteSpacing

    // Calculer la position verticale de la note
    const basePosition = notePositions[note.name] || 0
    const octaveOffset = (note.octave - 4) * 7 // 7 positions par octave

    // Calculer la position Y
    const y = startY - ((basePosition + octaveOffset) * lineSpacing) / 2 + verticalOffset

    // Draw note (ellipse for note head)
    ctx.beginPath()
    ctx.ellipse(x, y, lineSpacing * 0.6, lineSpacing * 0.4, 0, 0, Math.PI * 2)
    ctx.fillStyle = "#4338ca" // Indigo-700
    ctx.fill()
    ctx.strokeStyle = "#4338ca" // Indigo-700
    ctx.lineWidth = 1
    ctx.stroke()

    // Draw stem
    ctx.strokeStyle = "#4338ca" // Indigo-700
    ctx.lineWidth = 1.5

    // Les notes au-dessus de la 3ème ligne (B4) ont la hampe vers le bas
    // Les notes en-dessous ont la hampe vers le haut
    if (basePosition + octaveOffset > 2) {
      // Stem down for notes above middle line (B4)
      ctx.beginPath()
      ctx.moveTo(x + lineSpacing * 0.5, y)
      ctx.lineTo(x + lineSpacing * 0.5, y + lineSpacing * 3.5)
      ctx.stroke()
    } else {
      // Stem up for notes below middle line (B4)
      ctx.beginPath()
      ctx.moveTo(x - lineSpacing * 0.5, y)
      ctx.lineTo(x - lineSpacing * 0.5, y - lineSpacing * 3.5)
      ctx.stroke()
    }

    // Draw ledger lines if needed
    ctx.strokeStyle = "#4338ca" // Indigo-700
    ctx.lineWidth = 1

    // Ledger lines above staff (au-dessus de la 5ème ligne - F5)
    if (basePosition + octaveOffset > 8) {
      for (let i = 10; i <= basePosition + octaveOffset; i += 2) {
        if (i % 2 === 0) {
          // Seulement pour les positions de ligne (pas d'espace)
          const ledgerY = startY - (i * lineSpacing) / 2 + verticalOffset
          ctx.beginPath()
          ctx.moveTo(x - lineSpacing * 1.2, ledgerY)
          ctx.lineTo(x + lineSpacing * 1.2, ledgerY)
          ctx.stroke()
        }
      }
    }

    // Ledger lines below staff (en-dessous de la 1ère ligne - G4)
    if (basePosition + octaveOffset < 0) {
      for (let i = -2; i >= basePosition + octaveOffset; i -= 2) {
        if (i % 2 === 0) {
          // Seulement pour les positions de ligne (pas d'espace)
          const ledgerY = startY - (i * lineSpacing) / 2 + verticalOffset
          ctx.beginPath()
          ctx.moveTo(x - lineSpacing * 1.2, ledgerY)
          ctx.lineTo(x + lineSpacing * 1.2, ledgerY)
          ctx.stroke()
        }
      }
    }

    // Draw accidental if needed
    if (note.name.includes("#")) {
      ctx.fillStyle = "#4338ca" // Indigo-700
      ctx.font = `bold ${lineSpacing * 1.8}px serif`
      ctx.fillText("#", x - lineSpacing * 2, y + lineSpacing * 0.6)
    }
  })
}
