"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, Upload, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Type pour les images de doigtés stockées
interface FingeringImage {
  note: string
  octave: number
  isAlternate: boolean
  alternateNumber?: number
  dataUrl: string
}

export function FingeringUploader() {
  const [uploadedImages, setUploadedImages] = useState<FingeringImage[]>([])
  const [activeTab, setActiveTab] = useState("upload")
  const [showHelp, setShowHelp] = useState(true)

  // Charger les images depuis le localStorage au démarrage
  useEffect(() => {
    const savedImages = localStorage.getItem("musicFingeringImages")
    if (savedImages) {
      try {
        setUploadedImages(JSON.parse(savedImages))
      } catch (error) {
        console.error("Erreur lors du chargement des images:", error)
      }
    }
  }, [])

  // Sauvegarder les images dans le localStorage quand elles changent
  useEffect(() => {
    if (uploadedImages.length > 0) {
      localStorage.setItem("musicFingeringImages", JSON.stringify(uploadedImages))
    } else {
      localStorage.removeItem("musicFingeringImages")
    }
  }, [uploadedImages])

  // Gérer le téléchargement de fichiers
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    // Traiter chaque fichier
    Array.from(files).forEach((file) => {
      // Optimiser l'image avant de la stocker
      optimizeImage(file, (dataUrl) => {
        // Analyser le nom du fichier pour extraire les informations de la note
        const { note, octave, isAlternate, alternateNumber } = parseFileName(file.name)

        // Ajouter l'image à la liste
        setUploadedImages((prev) => [...prev, { note, octave, isAlternate, alternateNumber, dataUrl }])
      })
    })

    // Réinitialiser l'input file
    event.target.value = ""
  }

  // Optimiser l'image avant de la stocker
  const optimizeImage = (file: File, callback: (dataUrl: string) => void) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        // Créer un canvas pour redimensionner l'image
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")

        // Définir une taille maximale (ajuster selon vos besoins)
        const MAX_WIDTH = 600
        const MAX_HEIGHT = 600

        let width = img.width
        let height = img.height

        // Calculer les nouvelles dimensions tout en conservant le ratio
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width
            width = MAX_WIDTH
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height
            height = MAX_HEIGHT
          }
        }

        // Définir les dimensions du canvas
        canvas.width = width
        canvas.height = height

        // Dessiner l'image redimensionnée
        ctx.drawImage(img, 0, 0, width, height)

        // Convertir en dataURL avec une qualité réduite
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85)
        callback(dataUrl)
      }
      img.src = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  // Supprimer une image
  const deleteImage = (index: number) => {
    setUploadedImages((prev) => {
      const newImages = [...prev]
      newImages.splice(index, 1)
      return newImages
    })
  }

  // Supprimer toutes les images
  const deleteAllImages = () => {
    if (confirm("Êtes-vous sûr de vouloir supprimer toutes les images de doigtés ?")) {
      setUploadedImages([])
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      {showHelp && (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Comment nommer vos fichiers</AlertTitle>
          <AlertDescription>
            <p className="mb-2">
              Pour que vos images de doigtés soient correctement reconnues, nommez-les selon ces formats :
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Format standard :</strong> Note+Octave (ex: C4.jpg, A#3.png, D#4.jpg)
              </li>
              <li>
                <strong>Format alternatif :</strong> Note+Octave+a+Numéro (ex: C#4a1.jpg, C#4a2.jpg)
              </li>
            </ul>
            <Button variant="outline" size="sm" className="mt-2" onClick={() => setShowHelp(false)}>
              Compris
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Télécharger des doigtés</TabsTrigger>
          <TabsTrigger value="manage">
            Gérer les doigtés
            <Badge variant="secondary" className="ml-2">
              {uploadedImages.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Télécharger des images de doigtés</CardTitle>
              <CardDescription>
                Téléchargez vos propres images de doigtés pour votre instrument. Les noms de fichiers doivent suivre le
                format: Note+Octave (ex: C4, A#3) ou Note+Octave+a+Numéro pour les alternatives (ex: C#4a1).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid w-full gap-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="fingering-upload">Images de doigtés</Label>
                  <div className="flex items-center gap-2">
                    <Input id="fingering-upload" type="file" accept="image/*" multiple onChange={handleFileUpload} />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => document.getElementById("fingering-upload")?.click()}
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">{uploadedImages.length} image(s) téléchargée(s)</p>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="manage" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Gérer les images de doigtés</CardTitle>
              <CardDescription>Visualisez et gérez les images de doigtés que vous avez téléchargées.</CardDescription>
            </CardHeader>
            <CardContent>
              {uploadedImages.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {uploadedImages.map((img, index) => (
                    <div key={index} className="relative border rounded-md overflow-hidden">
                      <div className="aspect-square relative">
                        <img
                          src={img.dataUrl || "/placeholder.svg"}
                          alt={`Doigté ${img.note}${img.octave}${img.isAlternate ? ` (alt ${img.alternateNumber})` : ""}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-2 bg-white flex justify-between items-center">
                        <span className="text-sm font-medium">
                          {img.note}
                          {img.octave}
                          {img.isAlternate && <span className="text-xs ml-1">(alt {img.alternateNumber})</span>}
                        </span>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => deleteImage(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Aucune image téléchargée</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <p className="text-sm text-muted-foreground">{uploadedImages.length} image(s) téléchargée(s)</p>
              {uploadedImages.length > 0 && (
                <Button variant="destructive" size="sm" onClick={deleteAllImages}>
                  Tout supprimer
                </Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Fonction pour analyser le nom de fichier et extraire les informations de la note
function parseFileName(fileName: string): {
  note: string
  octave: number
  isAlternate: boolean
  alternateNumber?: number
} {
  // Supprimer l'extension du fichier
  const nameWithoutExt = fileName.split(".")[0]

  // Vérifier si c'est une alternative (format: Note+Octave+a+Numéro)
  // Par exemple: C#4a1, F#4a2, etc.
  const alternateMatch = nameWithoutExt.match(/^([A-G][#b]?)(\d+)a(\d+)$/)
  if (alternateMatch) {
    return {
      note: alternateMatch[1],
      octave: Number.parseInt(alternateMatch[2], 10),
      isAlternate: true,
      alternateNumber: Number.parseInt(alternateMatch[3], 10),
    }
  }

  // Format standard (Note+Octave)
  // Par exemple: C4, A#3, etc.
  const standardMatch = nameWithoutExt.match(/^([A-G][#b]?)(\d+)$/)
  if (standardMatch) {
    return {
      note: standardMatch[1],
      octave: Number.parseInt(standardMatch[2], 10),
      isAlternate: false,
    }
  }

  // Format par défaut si le nom ne correspond pas
  console.warn(`Format de nom de fichier non reconnu: ${fileName}. Utilisation des valeurs par défaut.`)
  return {
    note: nameWithoutExt.replace(/[^A-G#b]/g, "").substring(0, 2) || "C",
    octave: Number.parseInt(nameWithoutExt.match(/\d+/)?.[0] || "4", 10),
    isAlternate: nameWithoutExt.includes("a"),
    alternateNumber: nameWithoutExt.includes("a") ? 1 : undefined,
  }
}
