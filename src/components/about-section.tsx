"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Users, Target, Eye, Award } from "lucide-react"
import { useEffect, useRef, useState } from "react"

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
    <section ref={sectionRef} id="nosotros" className="min-h-screen py-20 bg-white flex items-center">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div
            className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Quiénes Somos</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
              Somos Tomás y Mateo Portalez, ingenieros civiles con experiencia en proyectos que van desde viviendas
              hasta grandes obras industriales en la región.
            </p>
          </div>

          <div
            className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16 transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-6">Nuestra Historia</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                En Inspira Ingeniería nos enfocamos en el cálculo estructural y la optimización de proyectos, aplicando
                herramientas BIM y software avanzado (CYPE, Revit, AutoCAD, SketchUp) para transformar ideas
                arquitectónicas en estructuras seguras y eficientes.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Nuestro propósito es acompañar a arquitectos, desarrolladores y constructoras como socios técnicos
                confiables, aportando claridad y eficiencia en cada decisión estructural.
              </p>
            </div>
            <div className="relative">
              <img
                src="/two-professional-engineers-working-with-structural.png"
                alt="Tomás y Mateo Portalez trabajando en proyectos estructurales"
                className="rounded-lg shadow-lg w-full"
              />
            </div>
          </div>

          {/* Mission and Vision */}
          <div
            className={`grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 transition-all duration-1000 delay-400 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <Card className="border-primary/20">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <Target className="h-8 w-8 text-primary mr-3" />
                  <h3 className="text-2xl font-bold text-foreground">Misión</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  En Inspira Ingeniería ayudamos a arquitectos, desarrolladores y constructoras a transformar sus
                  diseños en obras sólidas, seguras y eficientes. Nuestro compromiso es optimizar cada estructura con
                  criterios técnicos claros, adaptados a la realidad constructiva de la Patagonia.
                </p>
              </CardContent>
            </Card>

            <Card className="border-secondary/20">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <Eye className="h-8 w-8 text-secondary mr-3" />
                  <h3 className="text-2xl font-bold text-foreground">Visión</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Convertirnos en un referente en soluciones estructurales en la Patagonia, creciendo paso a paso hacia
                  un estudio integral que acompañe proyectos de mayor escala y complejidad. Queremos ser reconocidos por
                  nuestra confiabilidad técnica y cercanía profesional.
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
                <h4 className="font-semibold text-foreground mb-2">Eficiencia Estructural</h4>
                <p className="text-sm text-muted-foreground">
                  Optimizamos proyectos evitando sobredimensionamientos, ahorrando hasta 10% en materiales
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">Adaptación Local</h4>
                <p className="text-sm text-muted-foreground">
                  Diseños considerando vientos fuertes, suelos variables y normativas argentinas
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">Equipo Actualizado</h4>
                <p className="text-sm text-muted-foreground">
                  Software avanzado y metodologías BIM para mejor coordinación
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">Socios Confiables</h4>
                <p className="text-sm text-muted-foreground">
                  Acompañamiento desde anteproyecto, previniendo retrabajos
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
