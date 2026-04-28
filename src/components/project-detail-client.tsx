"use client"

import { useState } from "react"
import { ImageModal } from "@/components/ui/image-modal"
import { CornerBracket, AxisLine, GridOverlay } from "@/components/structural"
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
            <Link
              href={getCategoryPath()}
              className="label-mono text-muted-foreground hover:text-[var(--color-cyan-accent)] transition-colors duration-200 flex items-center gap-2 w-fit"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver a {getCategoryLabel()}
            </Link>
          </div>

          <div className="space-y-8">
            {/* Hero Section */}
            <div className="relative h-[50vh] md:h-[70vh] overflow-hidden">
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
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(var(--color-dark-section-rgb) / 0.80) 0%, rgba(var(--color-dark-section-rgb) / 0.40) 50%, transparent 100%)" }} />
              <GridOverlay className="absolute inset-0" color="rgba(255,255,255,0.03)" spacing={80} />

              {/* Corner brackets on hero image */}
              <CornerBracket position="top-left" size={32} color="var(--color-cyan-accent)" />
              <CornerBracket position="top-right" size={32} color="var(--color-cyan-accent)" />
              <CornerBracket position="bottom-left" size={32} color="var(--color-cyan-accent)" />
              <CornerBracket position="bottom-right" size={32} color="var(--color-cyan-accent)" />

              {/* Category badge top-right */}
              <div className="absolute top-4 right-4 md:top-8 md:right-8 flex flex-wrap gap-3">
                <span
                  className="label-mono text-[var(--color-cyan-accent)] border border-[var(--color-cyan-accent)]/40 px-3 py-1"
                  style={{ viewTransitionName: `project-year-${project.id}` }}
                >
                  <Calendar className="inline h-3 w-3 mr-1" />
                  {project.year}
                </span>
                <span className="label-mono bg-[var(--color-cyan-accent)] text-[var(--color-dark-section)] px-3 py-1">
                  {category.replace('-', ' ').toUpperCase()}
                </span>
              </div>

              {/* Title bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 text-white">
                <div className="label-mono text-[var(--color-cyan-accent)] mb-3 flex items-center gap-3">
                  <span className="inline-block w-8 h-px bg-[var(--color-cyan-accent)]" />
                  <span>PROYECTO</span>
                </div>
                <h1
                  className="heading-section text-white mb-4 leading-tight"
                  style={{ viewTransitionName: `project-title-${project.id}` }}
                >
                  {project.title}
                </h1>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                  <div className="flex items-center text-white/70 text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-[var(--color-cyan-accent)]" />
                    {project.location}
                  </div>
                  <div className="flex items-center text-white/70 text-sm">
                    <User className="h-4 w-4 mr-2 text-[var(--color-cyan-accent)]" />
                    {project.architect}
                  </div>
                  <div className="flex items-center text-white/70 text-sm">
                    <Building className="h-4 w-4 mr-2 text-[var(--color-cyan-accent)]" />
                    {project.specs?.system || 'No especificado'}
                  </div>
                </div>
              </div>
            </div>

            {/* Project Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {/* Arquitecto */}
              <div className="border border-border p-6 flex items-center gap-4">
                <User className="h-6 w-6 text-[var(--color-cyan-accent)] flex-shrink-0" />
                <div>
                  <p className="label-mono text-muted-foreground mb-1">Arquitecto / Director</p>
                  <p className="font-bold text-base">{project.architect}</p>
                </div>
              </div>
              {/* Ubicación */}
              <div className="border border-border p-6 flex items-center gap-4">
                <MapPin className="h-6 w-6 text-[var(--color-cyan-accent)] flex-shrink-0" />
                <div>
                  <p className="label-mono text-muted-foreground mb-1">Ubicación del Proyecto</p>
                  <p className="font-bold text-base">{project.location}</p>
                </div>
              </div>
              {/* Sistema */}
              <div className="border border-border p-6 flex items-center gap-4">
                <Wrench className="h-6 w-6 text-[var(--color-cyan-accent)] flex-shrink-0" />
                <div>
                  <p className="label-mono text-muted-foreground mb-1">Sistema Constructivo</p>
                  <p className="font-bold text-base">{project.specs?.system || 'No especificado'}</p>
                </div>
              </div>
            </div>

            {/* Additional Images */}
            {project.images && project.images.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {project.images.map((image: ProjectImage, index: number) => (
                  <div
                    key={index}
                    className="relative h-64 overflow-hidden cursor-pointer group"
                    onClick={() => openImageModal(index)}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    <CornerBracket position="top-left" size={20} color="var(--color-cyan-accent)" />
                    <CornerBracket position="top-right" size={20} color="var(--color-cyan-accent)" />
                    <CornerBracket position="bottom-left" size={20} color="var(--color-cyan-accent)" />
                    <CornerBracket position="bottom-right" size={20} color="var(--color-cyan-accent)" />
                    <span className="absolute bottom-3 left-3 label-mono text-white/30 text-xs">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Project Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Descripción */}
                <div className="border border-border p-6">
                  <div className="label-mono mb-4 flex items-center gap-3">
                    <Target className="h-4 w-4" />
                    <span>DESCRIPCIÓN DEL PROYECTO</span>
                  </div>
                  <AxisLine direction="horizontal" className="mb-4" color="rgba(var(--color-cyan-accent-rgb) / 0.2)" />
                  <p className="text-muted-foreground leading-relaxed text-base md:text-lg">{project.description}</p>
                </div>

                {/* Desafío */}
                <div className="border border-border p-6">
                  <div className="label-mono mb-4 flex items-center gap-3">
                    <Shield className="h-4 w-4" />
                    <span>DESAFÍO ESTRUCTURAL</span>
                  </div>
                  <AxisLine direction="horizontal" className="mb-4" color="rgba(var(--color-cyan-accent-rgb) / 0.2)" />
                  <p className="text-muted-foreground leading-relaxed text-base md:text-lg">{project.challenge}</p>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Solución */}
                <div className="border border-border p-6">
                  <div className="label-mono mb-4 flex items-center gap-3">
                    <Lightbulb className="h-4 w-4" />
                    <span>SOLUCIÓN TÉCNICA</span>
                  </div>
                  <AxisLine direction="horizontal" className="mb-4" color="rgba(var(--color-cyan-accent-rgb) / 0.2)" />
                  <p className="text-muted-foreground leading-relaxed text-base md:text-lg">{project.solution}</p>
                </div>

                {/* Resultado */}
                <div className="border border-border p-6">
                  <div className="label-mono mb-4 flex items-center gap-3">
                    <TrendingUp className="h-4 w-4" />
                    <span>RESULTADO</span>
                  </div>
                  <AxisLine direction="horizontal" className="mb-4" color="rgba(var(--color-cyan-accent-rgb) / 0.2)" />
                  <p className="text-muted-foreground leading-relaxed text-base md:text-lg">{project.result}</p>
                </div>
              </div>
            </div>

            {/* Technical Specifications — dark engineering data sheet */}
            <div className="relative dark-section p-6 md:p-10 overflow-hidden">
              <GridOverlay color="rgba(255,255,255,0.03)" spacing={80} />
              <CornerBracket position="top-left" size={24} color="var(--color-cyan-accent)" />
              <CornerBracket position="top-right" size={24} color="var(--color-cyan-accent)" />
              <CornerBracket position="bottom-left" size={24} color="var(--color-cyan-accent)" />
              <CornerBracket position="bottom-right" size={24} color="var(--color-cyan-accent)" />

              <div className="relative z-10">
                <div className="label-mono text-[var(--color-cyan-accent)] mb-2 flex items-center gap-3">
                  <span className="inline-block w-8 h-px bg-[var(--color-cyan-accent)]" />
                  <span>FICHA TÉCNICA</span>
                </div>
                <div className="flex items-center gap-3 mb-6">
                  <Ruler className="h-6 w-6 text-white" />
                  <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wide text-white">Especificaciones Técnicas</h2>
                </div>
                <AxisLine direction="horizontal" className="mb-8" color="rgba(var(--color-cyan-accent-rgb) / 0.3)" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <Wrench className="h-5 w-5 text-[var(--color-cyan-accent)] mt-1 flex-shrink-0" />
                      <div>
                        <span className="label-mono text-white/40 mb-2 block">Sistema Estructural</span>
                        <span className="text-lg font-semibold text-white">
                          {project.specs?.system || 'No especificado'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Shield className="h-5 w-5 text-[var(--color-cyan-accent)] mt-1 flex-shrink-0" />
                      <div>
                        <span className="label-mono text-white/40 mb-2 block">Fundaciones</span>
                        <span className="text-lg font-semibold text-white">
                          {project.specs?.foundations || 'No especificado'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <Building className="h-5 w-5 text-[var(--color-cyan-accent)] mt-1 flex-shrink-0" />
                      <div>
                        <span className="label-mono text-white/40 mb-2 block">Estructura Principal</span>
                        <span className="text-lg font-semibold text-white">
                          {project.specs?.structure || 'No especificado'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <CheckCircle className="h-5 w-5 text-[var(--color-cyan-accent)] mt-1 flex-shrink-0" />
                      <div>
                        <span className="label-mono text-white/40 mb-2 block">Normativa Aplicada</span>
                        <span className="text-lg font-semibold text-white">
                          {project.specs?.normative || 'No especificado'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
