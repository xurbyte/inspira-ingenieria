"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calculator, Building2, FileText, Users, ArrowRight } from "lucide-react"
import { useEffect, useRef, useState } from "react"

export function ServicesSection() {
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

  const scrollToContact = () => {
    const element = document.getElementById("contacto")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const services = [
    {
      icon: Calculator,
      title: "Cálculo Estructural",
      description:
        "Diseñamos y verificamos estructuras seguras y eficientes para viviendas, edificios y obras industriales.",
      details: [
        "Sistemas constructivos tradicionales (hormigón y mampostería)",
        "Wood frame y steel frame",
        "Estructuras metálicas para naves industriales",
        "Optimización de materiales aplicando normativas CIRSOC",
      ],
      cta: "Consultanos tu proyecto de cálculo estructural",
    },
    {
      icon: Building2,
      title: "Modelado BIM",
      description:
        "Generamos modelos estructurales digitales que integran planos, detalles y documentación en un solo entorno.",
      details: [
        "Coordinación mejorada con arquitectura",
        "Reducción de errores en obra",
        "Visualización previa de la estructura",
        "Documentación integrada y actualizada",
      ],
      cta: "Solicitá tu modelo BIM estructural",
    },
    {
      icon: FileText,
      title: "Memorias de Cálculo y Documentación",
      description: "Elaboramos memorias de cálculo, planos estructurales y documentación técnica completa.",
      details: [
        "Documentación para aprobaciones municipales",
        "Preparación para licitaciones",
        "Control de obra",
        "Planos estructurales detallados",
      ],
      cta: "Solicitar documentación técnica",
    },
    {
      icon: Users,
      title: "Asesorías Técnicas para Profesionales",
      description:
        "Acompañamos a arquitectos, constructoras y desarrolladores en decisiones estructurales desde el anteproyecto.",
      details: [
        "Evitar sobredimensionamientos",
        "Reducir retrabajos",
        "Soporte técnico en cada etapa",
        "Optimización de costos y tiempos",
      ],
      cta: "Consultar asesoría técnica",
    },
  ]

  return (
    <section ref={sectionRef} id="servicios" className="min-h-screen py-20 bg-white flex items-center">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div
            className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Nuestros Servicios</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
              Ofrecemos soluciones integrales en ingeniería estructural, desde el cálculo hasta la documentación
              completa, adaptadas a las necesidades específicas de cada proyecto.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                style={{ transitionDelay: `${(index + 1) * 200}ms` }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <CardHeader>
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                        <service.icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                    </div>
                    <p className="text-muted-foreground">{service.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      {service.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-start">
                          <ArrowRight className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{detail}</span>
                        </li>
                      ))}
                    </ul>
                    <Button variant="outline" className="w-full bg-transparent" onClick={scrollToContact}>
                      {service.cta}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
