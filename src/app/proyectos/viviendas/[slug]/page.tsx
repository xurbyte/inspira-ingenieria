import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, MapPin, Ruler, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Mock data - in a real app this would come from a database or CMS
interface ProjectData {
  title: string;
  type: string;
  year: string;
  location: string;
  area: string;
  client: string;
  description: string;
  challenge: string;
  solution: string;
  result: string;
  images: string[];
  specs: string[];
}

const projectsData: Record<string, ProjectData> = {
  "vivienda-ramiro-uriarte": {
    title: "Vivienda Unifamiliar - Arq. Ramiro Uriarte",
    type: "Tradicional",
    year: "2024",
    location: "Puerto Madryn, Chubut",
    area: "150 m²",
    client: "Arq. Ramiro Uriarte",
    images: [
      "/proyectos/1.ViviendaUnifamiliarArqRamiroIriarte/1234.jpg",
      "/proyectos/1.ViviendaUnifamiliarArqRamiroIriarte/RenderEtapa1.jpg",
      "/proyectos/1.ViviendaUnifamiliarArqRamiroIriarte/RenderEtapa2.jpg",
    ],
    description:
      "Vivienda unifamiliar en Puerto Madryn, proyectada por el Arq. Ramiro Uriarte. Inspira Ingeniería desarrolló el cálculo estructural completo, integrando fundaciones, columnas, vigas y losas de hormigón armado con el diseño arquitectónico.",
    challenge:
      "El principal desafío fue diseñar una estructura resistente al viento predominante de la Patagonia, manteniendo la eficiencia económica del proyecto y evitando sobredimensionamientos.",
    solution:
      "Se dimensionaron fundaciones, columnas y losas de hormigón armado según normativa CIRSOC. Se optimizaron las secciones estructurales y se elaboró documentación técnica detallada para garantizar coordinación con la arquitectura y ejecución sin errores.",
    result:
      "Se logró una estructura segura, eficiente y optimizada en consumo de materiales, lista para su construcción sin retrabajos ni modificaciones.",
    specs: [
      "Sistema: Hormigón armado y mampostería",
      "Fundaciones: Zapatas centradas y excéntricas de hormigón armado",
      "Estructura: Columnas, vigas y losas de hormigón armado",
      "Normativa: CIRSOC 201 y 301",
    ],
  },
  "vivienda-dos-plantas-franco-moretta": {
    title: "Vivienda de Dos Plantas - Arq. Franco Moretta",
    type: "Tradicional",
    year: "2024",
    location: "Puerto Madryn, Chubut",
    area: "220 m²",
    client: "Arq. Franco Moretta",
    images: [
      "/proyectos/5.ProyectoCyJMoretta/render CyJ.jpg",
      "/proyectos/5.ProyectoCyJMoretta/RenderFachada.png",
      "/proyectos/5.ProyectoCyJMoretta/Render Contrafachada.png",
    ],
    description:
      "Vivienda de dos plantas proyectada por el Arq. Franco Moreta en Puerto Madryn. Inspira Ingeniería desarrolló el cálculo estructural completo, integrando el diseño arquitectónico con la estructura resistente en sistema tradicional.",
    challenge:
      "El desafío principal fue garantizar la estabilidad global de la estructura frente a cargas de viento, resolver correctamente la transmisión de cargas entre plantas y optimizar las fundaciones de acuerdo a las características del terreno.",
    solution:
      "Se diseñaron zapatas centradas y excéntricas de hormigón armado, junto con columnas, vigas y losas estructurales. Se aplicó normativa CIRSOC para el dimensionamiento y se elaboró documentación técnica detallada, asegurando la correcta coordinación con el proyecto arquitectónico.",
    result:
      "El proyecto resultó en una estructura confiable y eficiente, con secciones optimizadas que redujeron el consumo de materiales, garantizando seguridad y economía en la ejecución.",
    specs: [
      "Sistema: Tradicional (hormigón armado y mampostería)",
      "Fundaciones: Zapatas centradas y excéntricas de hormigón armado",
      "Estructura: Columnas, vigas y losas de hormigón armado",
      "Normativa: CIRSOC 201 y 301",
    ],
  },
  "gimnasio-martina-larovere": {
    title: "Gimnasio - Arq. Martina Larovere",
    type: "Steel Frame",
    year: "2024",
    location: "Buenos Aires",
    area: "400 m²",
    client: "Arq. Martina Larovere",
    images: [
      "/proyectos/2. Gimnasio Galpon/Proyecto gimnasio.png",
      "/proyectos/2. Gimnasio Galpon/IMG-20250415-WA0006.jpg",
      "/proyectos/2. Gimnasio Galpon/IMG-20250415-WA0011.jpg",
    ],
    description:
      "Proyecto estructural para un gimnasio en Buenos Aires, en colaboración con la Arq. Martina Larovere. Inspira Ingeniería desarrolló el cálculo de la estructura resistente, asegurando espacios amplios y funcionales para su uso deportivo.",
    challenge:
      "El principal desafío fue diseñar una estructura metálica con grandes luces libres, que garantizara la seguridad frente a uso intensivo, manteniendo la economía en la elección de materiales y perfiles.",
    solution:
      "Se proyectó una estructura de acero conformada por pórticos principales y correas secundarias, dimensionada según normativa CIRSOC. Se optimizaron perfiles comerciales disponibles y se diseñaron fundaciones de hormigón armado para una correcta transmisión de cargas al suelo.",
    result:
      "Se logró una estructura robusta, segura y de ejecución eficiente, que permite un espacio interior libre de columnas intermedias y adaptable a diferentes usos deportivos.",
    specs: [
      "Sistema: Estructura metálica con pórticos y correas",
      "Fundaciones: Zapatas aisladas de hormigón armado",
      "Cubierta: Chapa metálica con pendiente mínima",
      "Normativa: CIRSOC 301 (acero) y 201 (fundaciones)",
    ],
  },
  "vivienda-wood-frame-martina-larovere": {
    title: "Vivienda Wood Frame - Arq. Martina Larovere",
    type: "Wood Frame",
    year: "2024",
    location: "Buenos Aires",
    area: "140 m²",
    client: "Arq. Martina Larovere",
    images: [
      "/proyectos/3. Casa Woodframe/casa de madera.png",
      "/proyectos/3. Casa Woodframe/borrar 3.jpg",
      "/proyectos/3. Casa Woodframe/borrar 5.jpg",
    ],
    description:
      "Vivienda unifamiliar proyectada por la Arq. Martina Larovere en Buenos Aires. Inspira Ingeniería desarrolló el cálculo estructural en sistema wood frame, priorizando eficiencia y rapidez constructiva en un contexto urbano.",
    challenge:
      "El desafío principal fue garantizar el correcto desempeño del sistema de madera frente a cargas de viento y sismo, optimizando secciones para evitar sobrecostos y asegurando rigidez lateral en los muros portantes.",
    solution:
      "Se diseñaron paneles estructurales con montantes de madera dimensionados según normativa, rigidizados con diafragmas de OSB. Se resolvieron apoyos sobre platea de hormigón armado y se verificó el comportamiento global de la estructura con software de cálculo.",
    result:
      "La estructura se optimizó para lograr un sistema liviano y eficiente, con buen comportamiento térmico y menor tiempo de ejecución respecto al sistema tradicional.",
    specs: [
      "Sistema: Wood frame (paneles de montantes + rigidización con OSB)",
      "Fundaciones: Platea de hormigón armado",
      "Estructura: Muros portantes de madera + diafragmas",
      "Normativa: CIRSOC 601 (madera) y 201 (fundaciones)",
    ],
  },
};

interface ProjectPageProps {
  params: {
    slug: string;
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = params;
  const project = projectsData[slug];


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
                {project.client}
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {project.images.map((image: string, index: number) => (
              <div
                key={index}
                className="relative h-64 md:h-80 rounded-lg overflow-hidden"
              >
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
  );
}
