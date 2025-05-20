"use client"

import { useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

export function NoteScroller({ notes, selectedNote, onNoteSelect }) {
  const scrollContainerRef = useRef(null)
  const selectedNoteRef = useRef(null)

  // Faire défiler jusqu'à la note sélectionnée lorsqu'elle change
  useEffect(() => {
    if (selectedNoteRef.current && scrollContainerRef.current) {
      // Obtenir la position de l'élément sélectionné
      const container = scrollContainerRef.current
      const selectedElement = selectedNoteRef.current

      // Calculer la position de défilement pour centrer l'élément
      const containerWidth = container.offsetWidth
      const elementLeft = selectedElement.offsetLeft
      const elementWidth = selectedElement.offsetWidth

      // Position centrée
      const scrollPosition = elementLeft - containerWidth / 2 + elementWidth / 2

      // Faire défiler en douceur
      container.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      })
    }
  }, [selectedNote])

  // Vérifier si deux notes sont identiques
  const isSameNote = (note1, note2) => {
    return note1 && note2 && note1.name === note2.name && note1.octave === note2.octave
  }

  return (
    <div className="w-full mt-6">
      <ScrollArea className="w-full whitespace-nowrap rounded-md border">
        <div className="flex p-4 gap-2" ref={scrollContainerRef}>
          {notes.map((note, index) => (
            <Button
              key={`${note.name}${note.octave}-${index}`}
              ref={isSameNote(note, selectedNote) ? selectedNoteRef : null}
              variant={isSameNote(note, selectedNote) ? "default" : "outline"}
              className="min-w-[60px] h-14 flex flex-col items-center justify-center p-1"
              onClick={() => onNoteSelect(note)}
            >
              <span className="text-lg font-bold">{note.name}</span>
              <span className="text-xs">{note.octave}</span>
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
