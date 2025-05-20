"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>
}

export function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    // Détecter si l'appareil est iOS
    const isIOSDevice =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
    setIsIOS(isIOSDevice)

    // Écouter l'événement beforeinstallprompt pour les appareils non-iOS
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e as BeforeInstallPromptEvent)
      setShowPrompt(true)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    // Vérifier si l'application est déjà installée
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setShowPrompt(false)
    } else if (isIOSDevice) {
      // Vérifier si l'utilisateur a déjà vu le message (pour iOS)
      const hasSeenPrompt = localStorage.getItem("pwa-ios-prompt-seen")
      if (!hasSeenPrompt) {
        setShowPrompt(true)
      }
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!installPrompt) return

    await installPrompt.prompt()
    const choiceResult = await installPrompt.userChoice

    if (choiceResult.outcome === "accepted") {
      console.log("L'utilisateur a accepté l'installation")
    } else {
      console.log("L'utilisateur a refusé l'installation")
    }

    setInstallPrompt(null)
    setShowPrompt(false)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    // Pour iOS, enregistrer que l'utilisateur a vu le message
    if (isIOS) {
      localStorage.setItem("pwa-ios-prompt-seen", "true")
    }
  }

  if (!showPrompt) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg animate-slideUp">
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 text-white hover:text-indigo-100 transition-colors"
        aria-label="Fermer"
      >
        <X size={20} />
      </button>

      <div className="flex flex-col items-center md:flex-row md:items-center gap-4">
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-1">Installez l'application</h3>
          <p className="text-sm text-indigo-100">
            {isIOS
              ? "Ajoutez cette application à votre écran d'accueil : appuyez sur l'icône de partage puis 'Sur l'écran d'accueil'"
              : "Installez cette application sur votre appareil pour y accéder rapidement, même hors ligne !"}
          </p>
        </div>

        {!isIOS && (
          <Button
            onClick={handleInstallClick}
            className="bg-white text-indigo-600 hover:bg-indigo-100 shadow-md whitespace-nowrap"
          >
            Installer
          </Button>
        )}
      </div>
    </div>
  )
}
