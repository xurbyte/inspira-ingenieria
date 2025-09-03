"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Home, Hammer, TreePine } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

const projectsByType = {
  tradicional: [
    {
      id: "casa-familiar-puerto-madryn",
      title: "Casa Familiar Puerto Madryn",
      image: "/casa-tradicional-hormig-n-mamposter-a-patagonia.png",
      description: "Vivienda unifamiliar con sistema constructivo tradicional de hormigón y mampostería.",
      year: "2023",
    },
    {
      id: "duplex-centro-madryn",
      title: "Dúplex Centro Madryn",
      image: "/duplex-tradicional-hormig-n-dos-plantas.png",
      description: "Desarrollo de dos unidades con estructura de hormigón armado.",
      year: "2023",
    },
  ],
  steelframe: [
    {
      id: "casa-moderna-steel-frame",
      title: "Casa Moderna Steel Frame",
      image: "/casa-moderna-steel-frame-estructura-met-lica.png",
      description: "Vivienda contemporánea con sistema steel frame optimizado para vientos patagónicos.",
      year: "2024",
    },
    {
      id: "ampliacion-steel-frame",
      title: "Ampliación Steel Frame",
      image: "/ampliaci-n-casa-steel-frame-estructura-liviana.png",
      description: "Ampliación de vivienda existente con estructura metálica liviana.",
      year: "2024",
    },
  ],
  woodframe: [
    {
      id: "cabana-wood-frame",
      title: "Cabaña Wood Frame",
      image: "/caba-a-madera-wood-frame-patagonia.png",
      description: "Cabaña residencial con sistema wood frame adaptado al clima patagónico.",
      year: "2023",
    },
    {
      id: "casa-sustentable-madera",
      title: "Casa Sustentable Madera",
      image: "/casa-sustentable-madera-wood-frame-ecol-gica.png",
      description: "Vivienda ecológica con estructura de madera y criterios de sustentabilidad.",
      year: "2024",
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
          {/* Header */}
          <div className="flex items-center mb-8">
            <Button variant="ghost" onClick={() => router.back()} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Proyectos de Viviendas</h1>
              <p className="text-muted-foreground">Soluciones residenciales con diferentes sistemas constructivos</p>
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

          {/* Projects Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectsByType[selectedType].map((project) => (
              <div
                key={project.id}
                className="group cursor-pointer bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105"
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
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{project.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
