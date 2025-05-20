"use client"

import { useState, useEffect, useMemo } from "react"
import { Badge } from "@/components/ui/badge"

// Type pour les images de doigtés stockées
interface FingeringImage {
  note: string
  octave: number
  isAlternate: boolean
  alternateNumber?: number
  dataUrl: string
}

export function FingeringDiagram({ note }) {
  const [uploadedImages, setUploadedImages] = useState<FingeringImage[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Charger les images depuis le localStorage au démarrage
  useEffect(() => {
    setIsLoading(true)
    const savedImages = localStorage.getItem("saxophoneFingeringImages")
    if (savedImages) {
      try {
        setUploadedImages(JSON.parse(savedImages))
      } catch (error) {
        console.error("Erreur lors du chargement des images:", error)
      }
    }
    setIsLoading(false)
  }, [])

  // Filtrer les images pour la note actuelle avec useMemo pour optimiser les performances
  const noteImages = useMemo(() => {
    return uploadedImages.filter((img) => img.note === note.name && img.octave === note.octave)
  }, [uploadedImages, note.name, note.octave])

  // Image principale (non alternative)
  const mainImage = useMemo(() => {
    return noteImages.find((img) => !img.isAlternate)
  }, [noteImages])

  // Images alternatives
  const alternateImages = useMemo(() => {
    return noteImages
      .filter((img) => img.isAlternate)
      .sort((a, b) => (a.alternateNumber || 0) - (b.alternateNumber || 0))
  }, [noteImages])

  // Toutes les images disponibles pour cette note
  const allImages = useMemo(() => {
    return mainImage ? [mainImage, ...alternateImages] : alternateImages
  }, [mainImage, alternateImages])

  // Si en cours de chargement, afficher un indicateur
  if (isLoading) {
    return (
      <div className="text-center p-4">
        <h3 className="text-lg font-semibold mb-2">
          Chargement du doigté pour {note.name}
          {note.octave}...
        </h3>
        <div className="animate-pulse h-40 bg-gray-200 rounded-md"></div>
      </div>
    )
  }

  // Si aucune image téléchargée n'est disponible, ne rien afficher
  if (allImages.length === 0) {
    return (
      <div className="text-center p-4">
        <h3 className="text-lg font-semibold mb-2">
          Doigté pour {note.name}
          {note.octave}
        </h3>
        <p className="text-gray-500">
          Aucune image de doigté disponible pour cette note. Veuillez télécharger une image dans l'onglet "Gérer les
          Images".
        </p>
      </div>
    )
  }

  return (
    <div className="text-center">
      <h3 className="text-lg font-semibold mb-4">
        Doigtés pour {note.name}
        {note.octave}
      </h3>

      {/* Affichage de toutes les images de doigtés côte à côte, centrées */}
      <div className="flex flex-wrap justify-center gap-8">
        {allImages.map((image, index) => (
          <div key={index} className="flex flex-col items-center mb-4">
            <div className="relative">
              <Badge className="absolute top-2 left-2 z-10" variant={image.isAlternate ? "outline" : "default"}>
                {image.isAlternate ? `Alternative ${image.alternateNumber}` : "Principal"}
              </Badge>
              <img
                src={image.dataUrl || "/placeholder.svg"}
                alt={`Doigté ${image.isAlternate ? "alternatif" : "principal"} pour ${note.name}${note.octave}`}
                className="max-w-full h-auto max-h-[300px] object-contain"
                loading="lazy"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
