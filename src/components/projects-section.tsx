"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
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
    <section ref={sectionRef} id="proyectos" className="min-h-screen flex items-center justify-center bg-primary/20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div
            className={`mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 mt-8 uppercase">Nuestros Proyectos</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty font-semibold">
              Explorá nuestros proyectos organizados por tipo de construcción. Cada obra refleja
              soluciones adaptadas a las necesidades de cada cliente.
            </p>
          </div>

          <div
            className={`grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <Card className="group cursor-pointer h-full hover:shadow-lg transition-all duration-300 hover:scale-105 bg-background border-primary/30" onClick={() => router.push("/proyectos/viviendas")}>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                  <Home className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4 uppercase">Viviendas</h3>
              </CardHeader>
              <CardContent className="flex flex-col h-full">
                <p className="text-muted-foreground mb-6 font-semibold flex-grow">
                  Proyectos residenciales en sistemas tradicionales, steel frame y wood frame.
                </p>
                {/* <Button className="w-full mt-auto cursor-pointer">Ver Proyectos de Viviendas</Button> */}
              </CardContent>
            </Card>

            <Card className="group cursor-pointer h-full hover:shadow-lg transition-all duration-300 hover:scale-105 bg-background border-primary/30" onClick={() => router.push("/proyectos/naves-industriales")}>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                  <Factory className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4 uppercase">Naves Industriales</h3>
              </CardHeader>
              <CardContent className="flex flex-col h-full">
                <p className="text-muted-foreground mb-6 font-semibold flex-grow">
                  Estructuras metálicas para uso industrial, comercial y logístico, diseñadas para ser seguras
                  y eficientes
                </p>
                {/* <Button className="w-full mt-auto cursor-pointer">Ver Proyectos Industriales</Button> */}
              </CardContent>
            </Card>
          </div>

          <div
            className={`mt-12 transition-all duration-1000 delay-400 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <p className=" mb-4 uppercase font-semibold">¿Tenés un proyecto en mente?</p>
            <Button
              variant="outline"
              className="cursor-pointer uppercase bg-primary mb-6"
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
