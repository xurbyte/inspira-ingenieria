"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Factory, Building2, Warehouse } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

const projectsByType = {
  naves: [
    {
      id: "nave-industrial-andrea-garilio",
      title: "Nave Industrial - Arq. Andrea Garilio",
      image: "/proyectos/4. Galpón Gariglio/INTERIOR1.png",
      description: "Nave industrial con estructura metálica y grandes luces libres, optimizada para vientos patagónicos.",
      year: "2024",
      architect: "Arq. Andrea Garilio",
      location: "Patagonia",
      system: "Estructura metálica con pórticos"
    },
  ],
  comerciales: [
    {
      id: "estudio-naval-arqueadoestudio",
      title: "Estudio Naval - Arqueadoestudio",
      image: "/proyectos/6. Proyecto WG/IMG-20250722-WA0025.jpg",
      description: "Estructura para estudio naval con grandes luces y espacios amplios en zona costera.",
      year: "2024",
      architect: "Arqueadoestudio",
      location: "Puerto Madryn",
      system: "Hormigón armado"
    },
    {
      id: "salon-eventos-nicolas-mirantes",
      title: "Salón de Eventos - Arq. Nicolás Mirantes",
      image: "/proyectos/7.Salon de eventos/17Foto.jpg",
      description: "Salón de eventos en chacra con espacios amplios libres de columnas intermedias.",
      year: "2024",
      architect: "Arq. Nicolás Mirantes",
      location: "Gaiman",
      system: "Hormigón armado con pórticos"
    },
  ],
  depositos: [
    {
      id: "deposito-soterrado-ramiro-iriarte",
      title: "Depósito Soterrado - Arq. Ramiro Iriarte",
      image: "/proyectos/8.Deposito Soterrado/3D.jpg",
      description: "Cubierta metálica para depósito soterrado con cabreadas optimizadas.",
      year: "2024",
      architect: "Arq. Ramiro Iriarte",
      location: "Puerto Madryn",
      system: "Estructura metálica (cabreadas)"
    },
  ],
}

export default function NavesIndustrialesPage() {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<"naves" | "comerciales" | "depositos">("naves")

  const handleProjectClick = (projectId: string) => {
    router.push(`/proyectos/naves-industriales/${projectId}`)
  }

  return (
    <main className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <Button variant="ghost" onClick={() => router.back()} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          {/* Header */}
          <div className="flex items-center justify-center mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 uppercase">Naves Industriales</h1>
              <p className="text-muted-foreground font-semibold">Estructuras metálicas y de hormigón para uso industrial y comercial</p>
            </div>
          </div>

          {/* Type Filter */}
          <div className="flex flex-wrap gap-4 mb-8">
            <Button
              variant={selectedType === "naves" ? "default" : "outline"}
              onClick={() => setSelectedType("naves")}
              className="flex items-center"
            >
              <Factory className="h-4 w-4 mr-2" />
              Naves Industriales
            </Button>
            <Button
              variant={selectedType === "comerciales" ? "default" : "outline"}
              onClick={() => setSelectedType("comerciales")}
              className="flex items-center"
            >
              <Building2 className="h-4 w-4 mr-2" />
              Comerciales
            </Button>
            <Button
              variant={selectedType === "depositos" ? "default" : "outline"}
              onClick={() => setSelectedType("depositos")}
              className="flex items-center"
            >
              <Warehouse className="h-4 w-4 mr-2" />
              Depósitos
            </Button>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectsByType[selectedType].map((project) => (
              <Card
                key={project.id}
                className="group cursor-pointer overflow-hidden py-0 hover:shadow-lg transition-all duration-300 hover:scale-105 bg-background border-primary/30"
                onClick={() => handleProjectClick(project.id)}
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary">{project.year}</Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors uppercase">
                    {project.title}
                  </h3>
                  <p className="text-sm text-muted-foreground font-semibold">{project.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
