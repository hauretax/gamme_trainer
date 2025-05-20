"use client"

import { useState, useEffect } from "react"

export function useMediaQuery(query: string): boolean {
  // Par défaut, supposons que nous ne sommes pas sur mobile pour le rendu côté serveur
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    // Vérifier si window est défini (côté client uniquement)
    if (typeof window !== "undefined") {
      const media = window.matchMedia(query)

      // Définir la valeur initiale
      setMatches(media.matches)

      // Définir un gestionnaire pour les changements
      const listener = () => {
        setMatches(media.matches)
      }

      // Utiliser addEventListener avec fallback pour les anciens navigateurs
      if (media.addEventListener) {
        media.addEventListener("change", listener)
      } else {
        // @ts-ignore - Pour la compatibilité avec les anciens navigateurs
        media.addListener(listener)
      }

      // Nettoyer
      return () => {
        if (media.removeEventListener) {
          media.removeEventListener("change", listener)
        } else {
          // @ts-ignore - Pour la compatibilité avec les anciens navigateurs
          media.removeListener(listener)
        }
      }
    }
  }, [query])

  return matches
}
