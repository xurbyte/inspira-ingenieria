"use client"

import { Button } from "@/components/ui/button"
import { Home, Factory } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState, useRef } from "react"

export function ProjectsSection() {
  const router = useRouter()
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
    <section ref={sectionRef} id="proyectos" className="min-h-screen flex items-center justify-center bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div
            className={`mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Nuestros Proyectos</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
              Explora nuestros proyectos organizados por tipo de construcción. Cada categoría muestra soluciones
              técnicas específicas adaptadas a las necesidades de cada obra.
            </p>
          </div>

          <div
            className={`grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <div className="group cursor-pointer" onClick={() => router.push("/proyectos/viviendas")}>
              <div className="bg-card border border-border rounded-lg p-8 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                  <Home className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Viviendas</h3>
                <p className="text-muted-foreground mb-6">
                  Proyectos residenciales con diferentes sistemas constructivos: tradicional, steel frame y wood frame.
                </p>
                <Button className="w-full">Ver Proyectos de Viviendas</Button>
              </div>
            </div>

            <div className="group cursor-pointer" onClick={() => router.push("/proyectos/naves-industriales")}>
              <div className="bg-card border border-border rounded-lg p-8 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                  <Factory className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Naves Industriales</h3>
                <p className="text-muted-foreground mb-6">
                  Estructuras metálicas para uso industrial, comercial y logístico con soluciones eficientes.
                </p>
                <Button className="w-full">Ver Proyectos Industriales</Button>
              </div>
            </div>
          </div>

          <div
            className={`mt-12 transition-all duration-1000 delay-400 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <p className="text-muted-foreground mb-4">¿Tenés un proyecto en mente?</p>
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                const element = document.getElementById("contacto")
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" })
                }
              }}
            >
              Consultanos tu proyecto
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
