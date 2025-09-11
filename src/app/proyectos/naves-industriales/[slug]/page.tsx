'use client'

import { useParams } from 'next/navigation'
import { useProjects } from '@/contexts/projects-context'
import { ProjectDetailClient } from '@/components/project-detail-client'
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"

export default function ProjectPage() {
  const params = useParams()
  const { projects, loading, error } = useProjects()
  const slug = params.slug as string

  // Buscar proyecto en los datos ya cargados
  const project = projects['naves-industriales'].find(p => p.slug === slug)

  // Estados de carga y error
  if (loading) {
    return (
      <main className="min-h-screen pt-20 pb-16 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Cargando proyecto...</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen pt-20 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Error al cargar proyecto</h1>
          <Link href="/proyectos/naves-industriales">
            <Button variant="ghost" className="hover:bg-primary/10">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Naves Industriales
            </Button>
          </Link>
        </div>
      </main>
    )
  }

  if (!project) {
    return (
      <main className="min-h-screen pt-20 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Proyecto no encontrado</h1>
          <Link href="/proyectos/naves-industriales">
            <Button variant="ghost" className="hover:bg-primary/10">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Naves Industriales
            </Button>
          </Link>
        </div>
      </main>
    )
  }

  return <ProjectDetailClient project={project} category="naves-industriales" />
}
