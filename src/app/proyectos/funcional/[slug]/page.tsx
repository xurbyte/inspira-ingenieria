import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, MapPin, User, Building } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { getProjectBySlug } from '@/lib/project-data'

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
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Proyectos Funcionales
            </Button>
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/proyectos/funcional">
            <Button variant="ghost" className="mb-8">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Proyectos Funcionales
            </Button>
          </Link>

          {/* Hero Image */}
          <div className="relative h-64 md:h-96 rounded-lg overflow-hidden mb-8">
            <Image
              src={project.coverImage.src || "/placeholder.svg"}
              alt={project.coverImage.alt}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute bottom-4 left-4">
              <Badge variant="secondary" className="mb-2">{project.year}</Badge>
              <h1 className="text-2xl md:text-4xl font-bold text-white uppercase">{project.title}</h1>
            </div>
          </div>

          {/* Project Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {project.images.map((image: ProjectImage, index: number) => (
                <div key={index} className="relative h-48 rounded-lg overflow-hidden">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover"
                  />
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
    </main>
  )
}
