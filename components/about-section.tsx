"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Coffee, Linkedin, Github, Mail, Music, Heart, Lightbulb } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function AboutSection() {
  return (
    <div className="space-y-8">
      <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 shadow-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-6 w-6" />À propos du développeur
          </CardTitle>
          <CardDescription className="text-indigo-100">
            Informations sur le créateur de cette application
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-4xl font-bold">
              HT
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text mb-2">
                Huggo Tricottet
              </h2>
              <p className="text-gray-600 mb-4">
                Développeur passionné de musique. Cette application a été créée pour aider les musiciens à apprendre et
                pratiquer leurs gammes de manière interactive, quel que soit leur instrument.
              </p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 border-indigo-300 hover:bg-indigo-50"
                  asChild
                >
                  <Link
                    href="https://www.linkedin.com/in/huggo-tricottet-3b19691a9/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 border-indigo-300 hover:bg-indigo-50"
                  asChild
                >
                  <Link href="https://github.com/hauretax" target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4" />
                    GitHub
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 shadow-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-6 w-6" />
            Proposer une amélioration
          </CardTitle>
          <CardDescription className="text-green-100">
            Aidez à améliorer cette application avec vos idées
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="mb-6 text-gray-700">
              Vous avez une idée pour améliorer cette application ? Une fonctionnalité que vous aimeriez voir ajoutée ?
              Un bug à signaler ? N'hésitez pas à me contacter !
            </p>
            <div className="bg-gray-100 p-4 rounded-lg inline-block">
              <p className="font-medium text-gray-800 flex items-center justify-center gap-2">
                <Mail className="h-5 w-5 text-green-600" />
                <span>huggotrico@protonmail.ch</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200 shadow-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white">
          <CardTitle className="flex items-center gap-2">
            <Coffee className="h-6 w-6" />
            Soutenez ce projet
          </CardTitle>
          <CardDescription className="text-amber-100">
            Si cette application vous est utile, vous pouvez soutenir son développement
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="mb-6 text-gray-700">
              Le développement et la maintenance de cette application sont réalisés sur mon temps libre. Si vous trouvez
              cette application utile pour votre pratique musicale, vous pouvez me soutenir en m'offrant un café !
            </p>
            <Button
              className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 shadow-md"
              asChild
            >
              <Link href="https://paypal.me/tricottethuggo" target="_blank" rel="noopener noreferrer">
                <Coffee className="mr-2 h-5 w-5" />
                M'offrir un café
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 shadow-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
          <CardTitle className="flex items-center gap-2">
            <Music className="h-6 w-6" />À propos de l'application
          </CardTitle>
          <CardDescription className="text-blue-100">
            Informations sur cette application de gammes musicales
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
            <div className="w-32 h-32 relative">
              <Image src="/logo.png" alt="Logo de l'application" width={128} height={128} className="rounded-xl" />
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Fonctionnalités</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li>Visualisation des gammes sur partition avec notation musicale</li>
                  <li>Doigtés personnalisables pour différents instruments</li>
                  <li>Mode pratique avec tempo ajustable</li>
                  <li>Générateur de partitions pour l'impression</li>
                  <li>Application installable sur mobile (PWA)</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Technologies utilisées</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                <li>Next.js et React</li>
                <li>Tailwind CSS pour le design</li>
                <li>Canvas API pour le rendu des partitions</li>
                <li>Progressive Web App (PWA) pour l'installation sur mobile</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Version</h3>
              <p className="text-gray-700">Version 1.0.0 - Mai 2025</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-gradient-to-r from-blue-100 to-cyan-100 p-4">
          <p className="text-sm text-gray-600 w-full text-center">© 2025 Huggo Tricottet - Tous droits réservés</p>
        </CardFooter>
      </Card>
    </div>
  )
}
