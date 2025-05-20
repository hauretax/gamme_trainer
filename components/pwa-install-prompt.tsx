"use client"

import { useState, useEffect } from "react"
import { X, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMediaQuery } from "@/hooks/use-media-query"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>
}

export function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isIOS, setIsIOS] = useState(false)

  // Détecter si l'appareil est mobile
  const isMobile = useMediaQuery("(max-width: 768px)")

  useEffect(() => {
    // Détecter si l'appareil est iOS
    const isIOSDevice =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
    setIsIOS(isIOSDevice)

    // Vérifier si l'application est déjà installée
    const isAppInstalled = window.matchMedia("(display-mode: standalone)").matches

    // Ne pas afficher le prompt si l'app est déjà installée
    if (isAppInstalled) {
      setShowPrompt(false)
      return
    }

    // Écouter l'événement beforeinstallprompt pour les appareils non-iOS
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log("Capture de l'événement beforeinstallprompt")
      e.preventDefault()
      setInstallPrompt(e as BeforeInstallPromptEvent)

      // Vérifier si l'utilisateur a déjà fermé le prompt
      const hasClosedPrompt = localStorage.getItem("pwa-prompt-closed")

      // Sur mobile, toujours montrer le prompt sauf s'il a été fermé récemment
      if (isMobile && !hasClosedPrompt) {
        // Attendre un peu avant d'afficher le prompt pour ne pas perturber le chargement initial
        setTimeout(() => {
          setShowPrompt(true)
        }, 2000)
      }
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    // Pour iOS sur mobile, afficher automatiquement le prompt
    if (isIOSDevice && isMobile) {
      const hasSeenPrompt = localStorage.getItem("pwa-ios-prompt-seen")
      const lastPromptTime = localStorage.getItem("pwa-ios-prompt-time")
      const now = Date.now()

      // Ne pas montrer le prompt s'il a été vu récemment (moins de 3 jours)
      const shouldShowPrompt =
        !hasSeenPrompt || (lastPromptTime && now - Number.parseInt(lastPromptTime) > 3 * 24 * 60 * 60 * 1000)

      if (shouldShowPrompt) {
        // Attendre un peu avant d'afficher le prompt
        setTimeout(() => {
          setShowPrompt(true)
          // Enregistrer le moment où le prompt a été montré
          localStorage.setItem("pwa-ios-prompt-time", now.toString())
        }, 2000)
      }
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [isMobile])

  const handleInstallClick = async () => {
    if (!installPrompt) return

    try {
      await installPrompt.prompt()
      const choiceResult = await installPrompt.userChoice

      if (choiceResult.outcome === "accepted") {
        console.log("L'utilisateur a accepté l'installation")
      } else {
        console.log("L'utilisateur a refusé l'installation")
      }

      setInstallPrompt(null)
      setShowPrompt(false)
    } catch (error) {
      console.error("Erreur lors de l'installation:", error)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)

    // Enregistrer que l'utilisateur a fermé le prompt
    if (isIOS) {
      localStorage.setItem("pwa-ios-prompt-seen", "true")
    } else {
      // Enregistrer l'heure à laquelle le prompt a été fermé
      localStorage.setItem("pwa-prompt-closed", Date.now().toString())
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
            className="bg-white text-indigo-600 hover:bg-indigo-100 shadow-md whitespace-nowrap flex items-center gap-2"
          >
            <Download size={16} />
            Installer
          </Button>
        )}
      </div>
    </div>
  )
}
