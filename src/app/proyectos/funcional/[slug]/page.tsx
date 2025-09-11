import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getProjectBySlug } from '@/lib/project-data'
import { ProjectDetailClient } from '@/components/project-detail-client'


interface ProjectPageProps {
  params: {
    slug: string
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  
  // Get project data using the new unified function
  const project = await getProjectBySlug('funcional', slug)

  if (!project) {
    return (
      <main className="min-h-screen pt-20 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Proyecto no encontrado</h1>
          <Link href="/proyectos/funcional">
            <Button className="hover:bg-primary/10">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Proyectos Funcionales
            </Button>
          </Link>
        </div>
      </main>
    )
  }

  return <ProjectDetailClient project={project} category="funcional" />
}
