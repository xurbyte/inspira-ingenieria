"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Users, Target, Eye, Award } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"

export function AboutSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} id="nosotros" className="min-h-screen py-24 bg-background flex items-center">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div
            className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 uppercase">Quiénes Somos</h2>
            <p className="text-xl text-muted-foreground font-normal max-w-3xl mx-auto text-pretty">
              Somos Tomás y Mateo Portalez, ingenieros civiles con experiencia en proyectos que
              van desde viviendas unifamiliares hasta grandes obras industriales en la Patagonia.
            </p>
          </div>

          <div
            className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16 transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-6 uppercase">Nuestra Historia</h3>
              <p className="text-muted-foreground mb-6 font-semibold leading-relaxed">
                En Inspira Ingeniería nos enfocamos en el cálculo estructural y la optimización de
                proyectos. Usamos herramientas BIM y software avanzado (CYPE, Revit, AutoCAD,
                SketchUp) para transformar ideas arquitectónicas en estructuras seguras y eficientes.

              </p>
              <p className="text-muted-foreground font-semibold leading-relaxed">
                Acompañamos a arquitectos, desarrolladores y constructoras como socios técnicos
                confiables, aportando claridad y eficiencia en cada decisión estructural.
              </p>
            </div>
            <div className="relative h-80 w-full">
              <Image
                src="/asd.jpg"
                alt="Tomás y Mateo Portalez trabajando en proyectos estructurales"
                fill
                className="rounded-lg shadow-lg object-cover"
              />
            </div>
          </div>

          {/* Mission and Vision */}
          <div
            className={`grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 transition-all duration-1000 delay-400 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <Card className="border-primary/30 bg-background backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <Target className="h-8 w-8 text-primary mr-3" />
                  <h3 className="text-2xl font-bold text-foreground uppercase">Misión</h3>
                </div>
                <p className="text-muted-foreground font-semibold leading-relaxed">
                  Ayudamos a arquitectos, desarrolladores y constructoras a transformar sus diseños
                  en obras seguras y eficientes. Optimizamos cada estructura con criterios técnicos
                  claros, adaptados a la realidad constructiva de la Patagonia
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/30 bg-background backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <Eye className="h-8 w-8 text-primary mr-3" />
                  <h3 className="text-2xl font-bold text-foreground uppercase">Visión</h3>
                </div>
                <p className="text-muted-foreground font-semibold leading-relaxed">
                  Queremos ser un referente en soluciones estructurales en la Patagonia, creciendo paso a
                  paso hacia un estudio integral que acompañe proyectos de mayor escala. Buscamos ser
                  reconocidos por nuestra confiabilidad técnica y cercanía profesional.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Differentials */}
          <div
            className={`text-center mb-12 transition-all duration-1000 delay-600 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <h3 className="text-2xl font-bold text-foreground mb-8">Nuestros Diferenciales</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-2 uppercase">Eficiencia Estructural</h4>
                <p className="text-sm text-muted-foreground font-semibold">
                  Optimizamos cada proyecto evitando sobredimensionamientos y logrando ahorros de hasta un 10% en
                  materiales.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-2 uppercase">Adaptación Local</h4>
                <p className="text-sm text-muted-foreground font-semibold">
                  Diseños adaptados a los vientos fuertes, suelos variables y
                  normativas argentinas.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-2 uppercase">Equipo Actualizado</h4>
                <p className="text-sm text-muted-foreground font-semibold">
                  Trabajamos con software avanzado y metodologías BIM para
                  una mejor coordinación.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-2 uppercase">Socios Confiables</h4>
                <p className="text-sm text-muted-foreground font-semibold">
                  Acompañamos desde el anteproyecto, previniendo retrabajos y
                  asegurando claridad técnica.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
