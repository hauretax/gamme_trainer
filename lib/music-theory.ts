// Types for music theory concepts
export type NoteName = "C" | "C#" | "D" | "D#" | "E" | "F" | "F#" | "G" | "G#" | "A" | "A#" | "B"
export type ScaleType = "major" | "minor" | "harmonic minor" | "melodic minor"

export interface Note {
  name: NoteName
  octave: number
  position: number // Position in the scale
}

export interface Scale {
  key: NoteName
  type: ScaleType
  notes: Note[]
}

// Constants
export const ALL_NOTES: NoteName[] = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]

// Scale intervals in semitones
export const SCALE_INTERVALS = {
  major: [0, 2, 4, 5, 7, 9, 11, 12],
  minor: [0, 2, 3, 5, 7, 8, 10, 12],
  "harmonic minor": [0, 2, 3, 5, 7, 8, 11, 12],
  "melodic minor": [0, 2, 3, 5, 7, 9, 11, 12],
}

// Utility functions

/**
 * Generate notes for a scale
 */
export function generateScale(key: NoteName, type: ScaleType): Note[] {
  const startIndex = ALL_NOTES.indexOf(key)
  if (startIndex === -1) return []

  const intervals = SCALE_INTERVALS[type]

  return intervals.map((interval) => {
    const noteIndex = (startIndex + interval) % 12
    return {
      name: ALL_NOTES[noteIndex],
      octave: Math.floor((startIndex + interval) / 12) + 4, // Starting from middle C (C4)
      position: interval,
    }
  })
}

/**
 * Transpose a note for alto saxophone (Eb instrument)
 * Written C sounds as Eb (down a major sixth)
 */
export function transposeForAltoSax(note: Note): Note {
  // Alto sax is in Eb, so written C sounds as Eb
  // To get the written note from concert pitch, go up a major sixth

  const concertPitchIndex = ALL_NOTES.indexOf(note.name)
  if (concertPitchIndex === -1) return note

  // Major sixth = 9 semitones
  const writtenPitchIndex = (concertPitchIndex + 9) % 12
  const octaveChange = Math.floor((concertPitchIndex + 9) / 12)

  return {
    name: ALL_NOTES[writtenPitchIndex],
    octave: note.octave + octaveChange,
    position: note.position,
  }
}

/**
 * Get concert pitch from written note for alto saxophone
 */
export function getConcertPitchFromAltoSax(note: Note): Note {
  // Alto sax is in Eb, so written C sounds as Eb
  // To get concert pitch from written note, go down a major sixth

  const writtenPitchIndex = ALL_NOTES.indexOf(note.name)
  if (writtenPitchIndex === -1) return note

  // Major sixth = 9 semitones
  const concertPitchIndex = (writtenPitchIndex - 9 + 12) % 12
  const octaveChange = Math.floor((writtenPitchIndex - 9) / 12)

  return {
    name: ALL_NOTES[concertPitchIndex],
    octave: note.octave + octaveChange,
    position: note.position,
  }
}
