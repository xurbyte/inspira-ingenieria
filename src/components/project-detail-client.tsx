"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageModal } from "@/components/ui/image-modal"
import { ArrowLeft, MapPin, User, Building, Wrench, Shield, Ruler, Calendar, CheckCircle, Target, Lightbulb, TrendingUp } from "lucide-react"
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
  description: string
  challenge: string
  solution: string
  result: string
  coverImage: ProjectImage
  images: ProjectImage[]
  specs: ProjectSpecs
}

interface ProjectDetailClientProps {
  project: Project
  category: string
}

export function ProjectDetailClient({ project, category }: ProjectDetailClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  // Debug logging
  console.log('ProjectDetailClient - Project data:', project)
  console.log('ProjectDetailClient - Project specs:', project?.specs)
  console.log('ProjectDetailClient - Project specs system:', project?.specs?.system)

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
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <Link href={getCategoryPath()}>
              <Button variant="ghost" className="hover:bg-none">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a {getCategoryLabel()}
              </Button>
            </Link>
          </div>

          <div className="space-y-8">
          {/* Hero Section */}
          <div className="relative h-[70vh] rounded-lg overflow-hidden shadow-2xl">
            <Image
              src={project.coverImage.src}
              alt={project.title}
              fill
              className="object-cover"
              priority
              style={{
                viewTransitionName: `project-cover-${project.id}`
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <div className="max-w-6xl mx-auto">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <Badge 
                    variant="secondary" 
                    className="bg-primary text-white shadow-lg"
                  >
                    {category.replace('-', ' ').toUpperCase()}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className="bg-white/20 text-white border-white/30"
                    style={{
                      viewTransitionName: `project-year-${project.id}`
                    }}
                  >
                    <Calendar className="h-3 w-3 mr-1" />
                    {project.year}
                  </Badge>
                </div>
                <h1 
                  className="text-5xl md:text-6xl font-bold mb-4 leading-tight"
                  style={{
                    viewTransitionName: `project-title-${project.id}`
                  }}
                >
                  {project.title}
                </h1>
                <div 
                  className="flex flex-wrap items-center gap-6 text-lg"
                >
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    {project.location}
                  </div>
                  <div className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    {project.architect}
                  </div>
                  <div className="flex items-center">
                    <Building className="h-5 w-5 mr-2" />
                    {project.specs?.system || 'No especificado'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Project Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-background border-primary/30 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 flex items-center">
                <User className="h-6 w-6 text-primary mr-4" />
                <div>
                  <p className="text-sm text-muted-foreground uppercase font-semibold mb-1">Arquitecto / Director</p>
                  <p className="font-bold text-lg">{project.architect}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-background border-primary/30 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 flex items-center">
                <MapPin className="h-6 w-6 text-primary mr-4" />
                <div>
                  <p className="text-sm text-muted-foreground uppercase font-semibold mb-1">Ubicación del Proyecto</p>
                  <p className="font-bold text-lg">{project.location}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-background border-primary/30 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 flex items-center">
                <Wrench className="h-6 w-6 text-primary mr-4" />
                <div>
                  <p className="text-sm text-muted-foreground uppercase font-semibold mb-1">Sistema Constructivo</p>
                  <p className="font-bold text-lg">{project.specs?.system || 'No especificado'}</p>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <Card className="bg-background border-primary/30 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-xl uppercase text-foreground">
                    <Target className="h-6 w-6 mr-3 text-primary" />
                    Descripción del Proyecto
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground font-medium leading-relaxed text-lg">{project.description}</p>
                </CardContent>
              </Card>

              <Card className="bg-background border-primary/30 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-xl uppercase text-foreground">
                    <Shield className="h-6 w-6 mr-3 text-primary" />
                    Desafío Estructural
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground font-medium leading-relaxed text-lg">{project.challenge}</p>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <Card className="bg-background border-primary/30 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-xl uppercase text-foreground">
                    <Lightbulb className="h-6 w-6 mr-3 text-primary" />
                    Solución Técnica
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground font-medium leading-relaxed text-lg">{project.solution}</p>
                </CardContent>
              </Card>

              <Card className="bg-background border-primary/30 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-xl uppercase text-foreground">
                    <TrendingUp className="h-6 w-6 mr-3 text-primary" />
                    Resultado
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground font-medium leading-relaxed text-lg">{project.result}</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Technical Specifications */}
          <Card className="bg-background border-primary/30 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center text-2xl uppercase text-foreground">
                <Ruler className="h-7 w-7 mr-3 text-primary" />
                Especificaciones Técnicas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-start">
                    <Wrench className="h-6 w-6 text-primary mr-4 mt-1 flex-shrink-0" />
                    <div>
                      <span className="text-sm text-muted-foreground uppercase font-bold mb-2 block">Sistema Estructural</span>
                      <span className="text-lg font-semibold text-foreground">
                        {project.specs?.system || 'No especificado'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Shield className="h-6 w-6 text-primary mr-4 mt-1 flex-shrink-0" />
                    <div>
                      <span className="text-sm text-muted-foreground uppercase font-bold mb-2 block">Fundaciones</span>
                      <span className="text-lg font-semibold text-foreground">
                        {project.specs?.foundations || 'No especificado'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <Building className="h-6 w-6 text-primary mr-4 mt-1 flex-shrink-0" />
                    <div>
                      <span className="text-sm text-muted-foreground uppercase font-bold mb-2 block">Estructura Principal</span>
                      <span className="text-lg font-semibold text-foreground">
                        {project.specs?.structure || 'No especificado'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-primary mr-4 mt-1 flex-shrink-0" />
                    <div>
                      <span className="text-sm text-muted-foreground uppercase font-bold mb-2 block">Normativa Aplicada</span>
                      <span className="text-lg font-semibold text-foreground">
                        {project.specs?.normative || 'No especificado'}
                      </span>
                    </div>
                  </div>
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
