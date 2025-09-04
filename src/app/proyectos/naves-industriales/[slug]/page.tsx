"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, MapPin, User, Building } from "lucide-react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"

interface ProjectSpecs {
  system?: string;
  foundations?: string;
  roof?: string;
  normative?: string;
  structure?: string;
}

interface Project {
  title: string;
  architect: string;
  location: string;
  year: string;
  system: string;
  image: string;
  description: string;
  challenge: string;
  solution: string;
  result: string;
  specs: ProjectSpecs;
}

const projectsData: Record<string, Project> = {
  "nave-industrial-andrea-garilio": {
    title: "Nave Industrial - Arq. Andrea Garilio",
    architect: "Arq. Andrea Garilio",
    location: "Patagonia",
    year: "2024",
    system: "Estructura metálica con pórticos",
    image: "/nave-industrial-estructura-metalica-patagonia.png",
    description: "Proyecto estructural de una nave industrial en colaboración con la Arq. Andrea Garilio. Inspira Ingeniería estuvo a cargo del diseño y cálculo de la estructura metálica, adaptada al uso productivo y a las dimensiones libres requeridas para la operación de la nave.",
    challenge: "El principal desafío fue resolver una estructura con grandes luces libres y altura significativa, garantizando resistencia frente a cargas de viento características de la Patagonia, y al mismo tiempo optimizando perfiles metálicos comerciales para mantener la economía de la obra.",
    solution: "Se diseñó un sistema de pórticos metálicos con correas secundarias, dimensionado según normativa CIRSOC. Las fundaciones se resolvieron mediante zapatas aisladas de hormigón armado, asegurando transmisión de cargas eficiente. El proyecto fue modelado digitalmente para coordinar con arquitectura y prever detalles de montaje.",
    result: "Se logró una estructura robusta y eficiente, adaptable a distintos usos industriales, con un diseño optimizado en costo y facilidad de ejecución.",
    specs: {
      system: "Estructura metálica con pórticos y correas",
      foundations: "Zapatas aisladas de hormigón armado",
      roof: "Chapa metálica con pendiente mínima",
      normative: "CIRSOC 301 (acero) y 201 (fundaciones)"
    }
  },
  "estudio-naval-arqueadoestudio": {
    title: "Estudio Naval - Arqueadoestudio",
    architect: "Arqueadoestudio",
    location: "Puerto Madryn",
    year: "2024",
    system: "Hormigón armado",
    image: "/estudio-naval-estructura-hormigon-puerto-madryn.png",
    description: "Proyecto estructural desarrollado en conjunto con Arqueadoestudio para un Estudio Naval en Puerto Madryn. Inspira Ingeniería estuvo a cargo del cálculo estructural completo, integrando la propuesta arquitectónica con una estructura resistente y funcional.",
    challenge: "El principal desafío fue resolver una estructura con grandes luces y espacios amplios, garantizando estabilidad frente a las cargas de viento características de la zona costera de Puerto Madryn. Se buscó además mantener un diseño limpio y adaptable al uso específico del estudio.",
    solution: "Se diseñó una estructura portante en hormigón armado con fundaciones adecuadas a las condiciones del suelo local. El cálculo se realizó siguiendo normativa CIRSOC, optimizando secciones para reducir materiales sin comprometer seguridad. La coordinación con el estudio de arquitectura permitió integrar la solución estructural al diseño estético planteado.",
    result: "Se logró una estructura sólida y eficiente, preparada para un uso intensivo y de bajo mantenimiento, con un diseño estructural que acompaña la propuesta arquitectónica.",
    specs: {
      system: "Hormigón armado",
      foundations: "Zapatas de hormigón armado",
      structure: "Columnas, vigas y losas portantes",
      normative: "CIRSOC 201 y 301"
    }
  },
  "salon-eventos-nicolas-mirantes": {
    title: "Salón de Eventos - Arq. Nicolás Mirantes",
    architect: "Arq. Nicolás Mirantes",
    location: "Gaiman",
    year: "2024",
    system: "Hormigón armado con pórticos",
    image: "/salon-eventos-estructura-hormigon-gaiman.png",
    description: "Proyecto estructural para un salón de eventos en una chacra de Gaiman, diseñado por el Arq. Nicolás Mirantes. Inspira Ingeniería desarrolló el cálculo de la estructura portante, adaptada al programa de grandes reuniones sociales y a las condiciones del valle.",
    challenge: "El principal desafío fue garantizar espacios amplios y libres de columnas intermedias, con una cubierta de gran luz que resistiera las cargas de viento de la región, sin sobredimensionar ni encarecer la estructura.",
    solution: "Se diseñó una estructura de hormigón armado con pórticos principales y vigas portantes que permitieron liberar el espacio interior. Las fundaciones se dimensionaron considerando las características del suelo de Gaiman, aplicando normativa CIRSOC.",
    result: "El diseño estructural permitió un salón amplio, seguro y eficiente, optimizando materiales y garantizando la durabilidad de la construcción.",
    specs: {
      system: "Hormigón armado",
      foundations: "Zapatas aisladas y vigas de fundación",
      structure: "Pórticos de hormigón armado, vigas y losas",
      normative: "CIRSOC 201 (hormigón armado) y 301 (cargas)"
    }
  },
  "deposito-soterrado-ramiro-iriarte": {
    title: "Depósito Soterrado - Arq. Ramiro Iriarte",
    architect: "Arq. Ramiro Iriarte",
    location: "Puerto Madryn",
    year: "2024",
    system: "Estructura metálica (cabreadas)",
    image: "/deposito-soterrado-cubierta-metalica.png",
    description: "Proyecto estructural desarrollado junto al Arq. Ramiro Iriarte para resolver la cubierta de un depósito soterrado en Puerto Madryn. Inspira Ingeniería estuvo a cargo del diseño y cálculo de la estructura metálica de cubierta.",
    challenge: "El desafío principal fue diseñar una cubierta metálica liviana que trabajara con perfiles comerciales disponibles en plaza, asegurando resistencia frente a las cargas de viento predominantes en la Patagonia, dentro de una geometría restringida por el soterramiento existente.",
    solution: "Se diseñaron cabreadas metálicas con doble cordón inferior y superior, vinculadas mediante diagonales intermedias, logrando un sistema eficiente que permitió verificar los perfiles comerciales. El cálculo se realizó aplicando normativa CIRSOC, asegurando seguridad y estabilidad.",
    result: "La solución permitió ejecutar una cubierta liviana, eficiente y de rápida construcción, garantizando seguridad estructural sin sobredimensionar ni encarecer el proyecto.",
    specs: {
      system: "Estructura metálica (cabreadas)",
      foundations: "Integradas al depósito existente",
      structure: "Cabreadas con doble cordón y diagonales intermedias",
      roof: "Chapa metálica",
      normative: "CIRSOC 301 (acero)"
    }
  }
}

export default function ProjectDetailPage() {
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string
  
  const project = projectsData[slug]
  
  if (!project) {
    return (
      <main className="min-h-screen pt-20 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Proyecto no encontrado</h1>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" onClick={() => router.back()} className="mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Naves Industriales
          </Button>

          {/* Hero Image */}
          <div className="relative h-64 md:h-96 rounded-lg overflow-hidden mb-8">
            <Image
              src={project.image || "/placeholder.svg"}
              alt={project.title}
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
                  {Object.entries(project.specs).map(([key, value]) => (
                    <div key={key} className="flex flex-col">
                      <span className="text-sm text-muted-foreground uppercase font-semibold mb-1">
                        {key === 'system' ? 'Sistema' : 
                         key === 'foundations' ? 'Fundaciones' : 
                         key === 'structure' ? 'Estructura' : 
                         key === 'roof' ? 'Cubierta' : 
                         key === 'normative' ? 'Normativa' : key}
                      </span>
                      <span className="font-semibold">{value as string}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
