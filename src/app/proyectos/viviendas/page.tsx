"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Home, Hammer, TreePine } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

const projectsByType = {
  tradicional: [
    {
      id: "vivienda-ramiro-uriarte",
      title: "Vivienda Unifamiliar - Arq. Ramiro Uriarte",
      image: "/proyectos/1. Vivienda Unifamiliar Arq Ramiro Iriarte/Render Etapa 1.jpg",
      description: "Vivienda unifamiliar en Puerto Madryn con estructura de hormigón armado resistente a vientos patagónicos.",
      year: "2024",
      architect: "Arq. Ramiro Uriarte",
      location: "Puerto Madryn",
      system: "Hormigón armado y mampostería"
    },
    {
      id: "vivienda-franco-moretta",
      title: "Vivienda Unifamiliar - Arq. Franco Moretta",
      image: "/proyectos/2. Duplex Tradicional Hormig-n Dos Plantas/duplex-tradicional-hormig-n-dos-plantas.png",
      description: "Vivienda unifamiliar en Puerto Madryn con estructura tradicional optimizada.",
      year: "2024",
      architect: "Arq. Franco Moretta",
      location: "Puerto Madryn",
      system: "Hormigón armado y mampostería"
    },
    {
      id: "vivienda-dos-plantas-franco-moretta",
      title: "Vivienda de Dos Plantas - Arq. Franco Moretta",
      image: "/casa-tradicional-hormig-n-mamposter-a-patagonia.png",
      description: "Vivienda de dos plantas con estructura tradicional y estabilidad global optimizada.",
      year: "2024",
      architect: "Arq. Franco Moretta",
      location: "Puerto Madryn",
      system: "Hormigón armado y mampostería"
    },
  ],
  steelframe: [
    {
      id: "gimnasio-martina-larovere",
      title: "Gimnasio - Arq. Martina Larovere",
      image: "/casa-moderna-steel-frame-estructura-met-lica.png",
      description: "Estructura metálica para gimnasio con grandes luces libres y espacios funcionales.",
      year: "2024",
      architect: "Arq. Martina Larovere",
      location: "Buenos Aires",
      system: "Estructura metálica con pórticos"
    },
  ],
  woodframe: [
    {
      id: "vivienda-wood-frame-martina-larovere",
      title: "Vivienda Wood Frame - Arq. Martina Larovere",
      image: "/caba-a-madera-wood-frame-patagonia.png",
      description: "Vivienda unifamiliar en sistema wood frame con eficiencia constructiva y comportamiento térmico optimizado.",
      year: "2024",
      architect: "Arq. Martina Larovere",
      location: "Buenos Aires",
      system: "Wood frame con paneles estructurales"
    },
  ],
}

export default function ViviendasPage() {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<"tradicional" | "steelframe" | "woodframe">("tradicional")

  const handleProjectClick = (projectId: string) => {
    router.push(`/proyectos/viviendas/${projectId}`)
  }

  return (
    <main className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <Button variant="ghost" onClick={() => router.push("/#proyectos")} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          {/* Header */}
          <div className="flex items-center justify-center mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 uppercase">Proyectos de Viviendas</h1>
              <p className="text-muted-foreground font-semibold">Soluciones residenciales con diferentes sistemas constructivos</p>
            </div>
          </div>

          {/* Type Filter */}
          <div className="flex flex-wrap gap-4 mb-8">
            <Button
              variant={selectedType === "tradicional" ? "default" : "outline"}
              onClick={() => setSelectedType("tradicional")}
              className="flex items-center"
            >
              <Home className="h-4 w-4 mr-2" />
              Tradicional
            </Button>
            <Button
              variant={selectedType === "steelframe" ? "default" : "outline"}
              onClick={() => setSelectedType("steelframe")}
              className="flex items-center"
            >
              <Hammer className="h-4 w-4 mr-2" />
              Steel Frame
            </Button>
            <Button
              variant={selectedType === "woodframe" ? "default" : "outline"}
              onClick={() => setSelectedType("woodframe")}
              className="flex items-center"
            >
              <TreePine className="h-4 w-4 mr-2" />
              Wood Frame
            </Button>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectsByType[selectedType].map((project) => (
              <Card
                key={project.id}
                className="group cursor-pointer overflow-hidden py-0 hover:shadow-lg transition-all duration-300 hover:scale-105 bg-background border-primary/30"
                onClick={() => handleProjectClick(project.id)}
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary">{project.year}</Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors uppercase">
                    {project.title}
                  </h3>
                  <p className="text-sm text-muted-foreground font-semibold">{project.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
