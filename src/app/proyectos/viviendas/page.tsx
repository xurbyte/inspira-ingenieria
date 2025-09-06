"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Home, Hammer, TreePine } from "lucide-react"
import { ViviendasProject } from "@/types/project"

export default function ViviendasPage() {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<"tradicional" | "steelframe" | "woodframe">("tradicional")
  const [projects, setProjects] = useState<ViviendasProject[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects?category=viviendas')
        const data = await response.json()
        setProjects(data.projects || [])
      } catch (error) {
        console.error('Error fetching projects:', error)
        setProjects([])
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  // Group projects by type
  const projectsByType = {
    tradicional: projects.filter(p => p.type === "tradicional"),
    steelframe: projects.filter(p => p.type === "steelframe"),
    woodframe: projects.filter(p => p.type === "woodframe"),
  }

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

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Cargando proyectos...</p>
            </div>
          )}

          {/* Projects Grid */}
          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projectsByType[selectedType].length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">No hay proyectos de este tipo disponibles.</p>
                </div>
              ) : (
                projectsByType[selectedType].map((project) => (
                  <Card
                    key={project.id}
                    className="group cursor-pointer overflow-hidden py-0 hover:shadow-lg transition-all duration-300 hover:scale-105 bg-background border-primary/30"
                    onClick={() => handleProjectClick(project.id)}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={project.coverImage.src || "/placeholder.svg"}
                        alt={project.coverImage.alt}
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
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
