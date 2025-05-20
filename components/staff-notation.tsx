"use client"

import { useEffect, useRef } from "react"

export function StaffNotation({ scale, scaleNotes, onNoteSelect, selectedNote }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current || scaleNotes.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw staff
    drawStaff(ctx, canvas.width, canvas.height)

    // Draw notes
    drawNotes(ctx, scaleNotes, canvas.width, canvas.height, selectedNote)
  }, [scaleNotes, selectedNote])

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Calculate which note was clicked
    const noteWidth = (canvas.width - 100) / scaleNotes.length
    const noteIndex = Math.floor((x - 80) / noteWidth)

    if (noteIndex >= 0 && noteIndex < scaleNotes.length) {
      onNoteSelect(scaleNotes[noteIndex])
    }
  }

  return (
    <div className="relative">
      <h2 className="text-xl font-semibold mb-4">
        Gamme de {scale.key}{" "}
        {scale.type === "major"
          ? "Majeure"
          : scale.type === "minor"
            ? "Mineure naturelle"
            : scale.type === "harmonic minor"
              ? "Mineure harmonique"
              : "Mineure mélodique"}
        {scaleNotes.length > 0 && (
          <span className="text-base font-normal ml-2">
            ({scaleNotes[0].name}
            {scaleNotes[0].octave} à {scaleNotes[scaleNotes.length - 1].name}
            {scaleNotes[scaleNotes.length - 1].octave})
          </span>
        )}
      </h2>
      <canvas
        ref={canvasRef}
        width={800}
        height={240}
        className="w-full h-auto border rounded bg-white"
        onClick={handleCanvasClick}
      />
    </div>
  )
}

// Draw a detailed staff with treble clef
function drawStaff(ctx, width, height) {
  const lineSpacing = 10
  const startY = height / 2 - lineSpacing * 2
  const staffWidth = width - 40

  ctx.strokeStyle = "#000"
  ctx.lineWidth = 1

  // Draw 5 staff lines
  for (let i = 0; i < 5; i++) {
    ctx.beginPath()
    ctx.moveTo(40, startY + i * lineSpacing)
    ctx.lineTo(width - 20, startY + i * lineSpacing)
    ctx.stroke()
  }

  // Draw treble clef
  drawTrebleClef(ctx, 45, startY + 2 * lineSpacing, lineSpacing * 4)
}

// Draw a detailed treble clef
function drawTrebleClef(ctx, x, y, height) {
  const scale = height / 80

  ctx.save()
  ctx.translate(x, y)
  ctx.scale(scale, scale)

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

// Modifier la fonction drawNotes pour corriger le positionnement des notes
function drawNotes(ctx, notes, width, height, selectedNote) {
  if (!notes.length) return

  const lineSpacing = 10
  const startY = height / 2 - lineSpacing * 2 // Position de la ligne inférieure de la portée (E4)
  const noteWidth = (width - 100) / notes.length

  // Positions des notes sur la portée en clé de sol
  // En clé de sol:
  // - La première ligne (la plus basse) est Mi (E4)
  // - Do central (C4) est sur la 2ème ligne supplémentaire en dessous de la portée

  // Valeurs en positions par rapport à la première ligne de la portée (E4)
  // Chaque position (ligne ou espace) est séparée de 1
  // Valeurs négatives = en dessous de la première ligne
  // Valeurs positives = au-dessus de la première ligne
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

  notes.forEach((note, index) => {
    const x = 80 + noteWidth * index + noteWidth / 2

    // Calculer la position verticale de la note
    const basePosition = notePositions[note.name] || 0
    const octaveOffset = (note.octave - 4) * 7 // 7 positions par octave

    // Calculer la position Y
    // Plus la position est élevée, plus la note est haute sur la portée (donc Y diminue)
    // Ajout d'un décalage de 6 lignes vers le bas (6 * lineSpacing / 2)
    const verticalOffset = (6 * lineSpacing) / 2
    const y = startY - ((basePosition + octaveOffset) * lineSpacing) / 2 + verticalOffset

    // Check if this note is selected
    const isSelected = selectedNote && selectedNote.name === note.name && selectedNote.octave === note.octave

    // Draw note (ellipse for note head)
    ctx.beginPath()
    ctx.ellipse(x, y, lineSpacing * 0.6, lineSpacing * 0.4, 0, 0, Math.PI * 2)
    ctx.fillStyle = isSelected ? "#4f46e5" : "#000"
    ctx.fill()
    ctx.strokeStyle = "#000"
    ctx.lineWidth = 1
    ctx.stroke()

    // Draw stem
    ctx.strokeStyle = isSelected ? "#4f46e5" : "#000"
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
    ctx.strokeStyle = "#000"
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
      ctx.fillStyle = isSelected ? "#4f46e5" : "#000"
      ctx.font = `bold ${lineSpacing * 1.8}px serif`
      ctx.fillText("#", x - lineSpacing * 2, y + lineSpacing * 0.6)
    }

    // Optionally, draw octave number for clarity
    ctx.fillStyle = isSelected ? "#4f46e5" : "#666"
    ctx.font = `${lineSpacing * 1}px sans-serif`
    ctx.fillText(note.octave.toString(), x - lineSpacing * 0.5, y - lineSpacing * 3)
  })
}
