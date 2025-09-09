"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageModal } from "@/components/ui/image-modal"
import { ArrowLeft, MapPin, User, Building } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface ProjectImage {
  src: string
  alt: string
}

interface ProjectSpecs {
  system: string
  foundations: string
  structure: string
  normative: string
}

interface Project {
  id: string
  title: string
  architect: string
  location: string
  year: string
  system: string
  coverImage: ProjectImage
  images: ProjectImage[]
  description: string
  challenge: string
  solution: string
  result: string
  specs: ProjectSpecs
}

interface ProjectDetailClientProps {
  project: Project
  category: string
}

export function ProjectDetailClient({ project, category }: ProjectDetailClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const openImageModal = (index: number) => {
    setSelectedImageIndex(index)
    setIsModalOpen(true)
  }

  const getCategoryPath = () => {
    switch (category) {
      case 'viviendas':
        return '/proyectos/viviendas'
      case 'naves-industriales':
        return '/proyectos/naves-industriales'
      case 'funcional':
        return '/proyectos/funcional'
      default:
        return '/proyectos'
    }
  }

  const getCategoryLabel = () => {
    switch (category) {
      case 'viviendas':
        return 'Viviendas'
      case 'naves-industriales':
        return 'Naves Industriales'
      case 'funcional':
        return 'Proyectos Funcionales'
      default:
        return 'Proyectos'
    }
  }

  return (
    <main className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <div className="mb-6">
          <Link href={getCategoryPath()}>
            <Button variant="ghost" className="hover:bg-primary/10">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a {getCategoryLabel()}
            </Button>
          </Link>
        </div>

        <div className="space-y-8">
          {/* Hero Section */}
          <div className="relative h-[60vh] rounded-lg overflow-hidden">
            <Image
              src={project.coverImage.src}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/40 flex items-end">
              <div className="p-8 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    {category}
                  </Badge>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2">{project.title}</h1>
                <p className="text-xl text-white/90">{project.year}</p>
              </div>
            </div>
          </div>

          {/* Project Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-background border-primary/30">
              <CardContent className="p-4 flex items-center">
                <User className="h-5 w-5 text-primary mr-3" />
                <div>
                  <p className="text-sm text-muted-foreground uppercase font-semibold">Arquitecto</p>
                  <p className="font-semibold">{project.architect}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-background border-primary/30">
              <CardContent className="p-4 flex items-center">
                <MapPin className="h-5 w-5 text-primary mr-3" />
                <div>
                  <p className="text-sm text-muted-foreground uppercase font-semibold">Ubicación</p>
                  <p className="font-semibold">{project.location}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-background border-primary/30">
              <CardContent className="p-4 flex items-center">
                <Building className="h-5 w-5 text-primary mr-3" />
                <div>
                  <p className="text-sm text-muted-foreground uppercase font-semibold">Sistema</p>
                  <p className="font-semibold">{project.system}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Images */}
          {project.images && project.images.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {project.images.map((image: ProjectImage, index: number) => (
                <div 
                  key={index} 
                  className="relative h-64 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => openImageModal(index)}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors" />
                </div>
              ))}
            </div>
          )}

          {/* Project Details */}
          <div className="space-y-8">
            <Card className="bg-background border-primary/30">
              <CardHeader>
                <CardTitle className="uppercase">Descripción del Proyecto</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground font-semibold leading-relaxed">{project.description}</p>
              </CardContent>
            </Card>

            <Card className="bg-background border-primary/30">
              <CardHeader>
                <CardTitle className="uppercase">Desafío Estructural</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground font-semibold leading-relaxed">{project.challenge}</p>
              </CardContent>
            </Card>

            <Card className="bg-background border-primary/30">
              <CardHeader>
                <CardTitle className="uppercase">Solución Técnica</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground font-semibold leading-relaxed">{project.solution}</p>
              </CardContent>
            </Card>

            <Card className="bg-background border-primary/30">
              <CardHeader>
                <CardTitle className="uppercase">Resultado</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground font-semibold leading-relaxed">{project.result}</p>
              </CardContent>
            </Card>

            <Card className="bg-background border-primary/30">
              <CardHeader>
                <CardTitle className="uppercase">Especificaciones Técnicas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground uppercase font-semibold mb-1">
                      Sistema
                    </span>
                    <span className="font-semibold">{project.specs.system}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground uppercase font-semibold mb-1">
                      Fundaciones
                    </span>
                    <span className="font-semibold">{project.specs.foundations}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground uppercase font-semibold mb-1">
                      Estructura
                    </span>
                    <span className="font-semibold">{project.specs.structure}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground uppercase font-semibold mb-1">
                      Normativa
                    </span>
                    <span className="font-semibold">{project.specs.normative}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Image Modal */}
      {project.images && (
        <ImageModal
          images={project.images}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialIndex={selectedImageIndex}
        />
      )}
    </main>
  )
}
