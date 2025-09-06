import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, MapPin, Ruler, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getProjectBySlug } from '@/lib/project-data';

interface ProjectImage {
  src: string;
  alt: string;
}

interface ProjectSpecs {
  system: string;
  foundations: string;
  structure: string;
  normative: string;
}


interface ProjectPageProps {
  params: {
    slug: string;
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  
  // Get project data using the new unified function
  const project = await getProjectBySlug('viviendas', slug);


  if (!project) {
    return (
      <main className="min-h-screen pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Proyecto no encontrado</h1>
            <Link href="/proyectos/viviendas">
              <Button>Volver a Viviendas</Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Link href="/proyectos/viviendas">
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
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {project.title}
            </h1>

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
                {project.architect}
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {/* Cover Image */}
            <div className="relative h-64 md:h-80 rounded-lg overflow-hidden">
              <Image
                src={project.coverImage.src || "/placeholder.svg"}
                alt={project.coverImage.alt}
                fill
                className="object-cover"
              />
            </div>
            {/* Additional Images */}
            {project.images.map((image: ProjectImage, index: number) => (
              <div
                key={index}
                className="relative h-64 md:h-80 rounded-lg overflow-hidden"
              >
                <Image
                  src={image.src || "/placeholder.svg"}
                  alt={image.alt}
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
                <h2 className="text-xl font-semibold mb-3 uppercase">
                  Descripción del Proyecto
                </h2>
                <p className="font-normal">{project.description}</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3 uppercase">
                  Desafío Estructural
                </h2>
                <p className="font-normal">{project.challenge}</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3 uppercase">
                  Solución Técnica
                </h2>
                <p className="font-normal">{project.solution}</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3 uppercase">
                  Resultado
                </h2>
                <p className="font-normal">{project.result}</p>
              </div>
            </div>

            <div>
              <div className="bg-background border border-primary/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Especificaciones Técnicas
                </h3>
                <ul className="space-y-2">
                  <li className="text-sm text-muted-foreground">
                    • Sistema: {project.specs.system}
                  </li>
                  <li className="text-sm text-muted-foreground">
                    • Fundaciones: {project.specs.foundations}
                  </li>
                  <li className="text-sm text-muted-foreground">
                    • Estructura: {project.specs.structure}
                  </li>
                  <li className="text-sm text-muted-foreground">
                    • Normativa: {project.specs.normative}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
