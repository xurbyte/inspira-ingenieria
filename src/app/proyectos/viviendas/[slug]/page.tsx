import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, MapPin, Ruler, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Mock data - in a real app this would come from a database or CMS
const projectsData: Record<string, any> = {
  "casa-familiar-puerto-madryn": {
    title: "Casa Familiar Puerto Madryn",
    type: "Tradicional",
    year: "2023",
    location: "Puerto Madryn, Chubut",
    area: "180 m²",
    client: "Familia González",
    images: ["/casa-tradicional-hormig-n-fachada-principal.png", "/casa-tradicional-interior-living-comedor.png", "/planos-estructurales-casa-tradicional.png"],
    description:
      "Vivienda unifamiliar de 180m² con sistema constructivo tradicional de hormigón armado y mampostería. El proyecto se desarrolló considerando las condiciones climáticas específicas de la Patagonia, con especial atención a los vientos predominantes y las variaciones térmicas.",
    challenge:
      "El principal desafío fue optimizar la estructura para resistir los vientos patagónicos manteniendo la economía del proyecto. El terreno presentaba características particulares que requerían una fundación específica.",
    solution:
      "Se diseñó una estructura de hormigón armado con muros de mampostería, optimizando las secciones para reducir el consumo de materiales sin comprometer la seguridad. Se implementaron detalles constructivos específicos para el clima local.",
    result:
      "La obra se ejecutó sin inconvenientes, logrando una reducción del 8% en el consumo de hormigón respecto al diseño inicial, manteniendo todos los factores de seguridad requeridos por normativa.",
    specs: [
      "Sistema: Hormigón armado y mampostería",
      "Fundación: Plateas y zapatas corridas",
      "Cubierta: Losa de hormigón armado",
      "Normativa: CIRSOC 201 y 301",
    ],
  },
  // Add more projects here...
}

interface ProjectPageProps {
  params: {
    slug: string
  }
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const project = projectsData[params.slug]

  if (!project) {
    return (
      <main className="min-h-screen pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Proyecto no encontrado</h1>
            <Link href="/viviendas">
              <Button>Volver a Viviendas</Button>
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Link href="/viviendas">
              <Button variant="ghost" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a Viviendas
              </Button>
            </Link>
          </div>

          {/* Project Header */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary">{project.type}</Badge>
              <Badge variant="outline">{project.year}</Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{project.title}</h1>

            {/* Project Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                {project.year}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mr-2" />
                {project.location}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Ruler className="h-4 w-4 mr-2" />
                {project.area}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="h-4 w-4 mr-2" />
                {project.client}
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {project.images.map((image: string, index: number) => (
              <div key={index} className="relative h-64 md:h-80 rounded-lg overflow-hidden">
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${project.title} - Imagen ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          {/* Project Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-3">Descripción del Proyecto</h2>
                <p className="text-muted-foreground">{project.description}</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">Desafío Estructural</h2>
                <p className="text-muted-foreground">{project.challenge}</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">Solución Técnica</h2>
                <p className="text-muted-foreground">{project.solution}</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">Resultado</h2>
                <p className="text-muted-foreground">{project.result}</p>
              </div>
            </div>

            <div>
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Especificaciones Técnicas</h3>
                <ul className="space-y-2">
                  {project.specs.map((spec: string, index: number) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      • {spec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
