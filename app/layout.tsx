import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { PWAInstallPrompt } from "@/components/pwa-install-prompt"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Gammes Musicales",
  description: "Application d'apprentissage des gammes musicales pour tous instruments",
  manifest: "/manifest.json",
  icons: {
    apple: "/icons/apple-touch-icon.png",
    icon: "/logo.png",
  },
    generator: 'v0.dev'
}

export const viewport: Viewport = {
  themeColor: "#4f46e5",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="icon" href="/logo.png" type="image/png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={inter.className}>
        {children}
        <PWAInstallPrompt />
        <Script id="handle-github-pages-redirect" strategy="beforeInteractive">
          {`
            // Gestion des redirections pour GitHub Pages
            (function() {
              const params = new URLSearchParams(window.location.search);
              const redirectPath = params.get('path');
              if (redirectPath) {
                // Supprimer le paramètre de l'URL sans recharger la page
                params.delete('path');
                const newUrl = window.location.pathname + (params.toString() ? '?' + params.toString() : '') + window.location.hash;
                window.history.replaceState({}, document.title, newUrl);
              }
            })();
          `}
        </Script>
      </body>
    </html>
  )
}
