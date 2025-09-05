"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Home, Factory } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState, useRef } from "react"
import Image from "next/image"

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
    <section ref={sectionRef} id="proyectos" className="min-h-screen py-20 flex items-center justify-center relative overflow-hidden">
      {/* Background Image */}
      <Image
        src="/puerto madryn.jpg"
        alt="Puerto Madryn"
        fill
        className="object-cover -z-10 "
        priority
      />
      <div className="absolute inset-0 bg-black/60 -z-10" />
      <div className="absolute inset-0 bg-primary/30 -z-10" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div
            className={`mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 mt-8 uppercase">Nuestros Proyectos</h2>
            <p className="text-xl text-white max-w-3xl mx-auto text-pretty font-semibold">
              Explorá nuestros proyectos organizados por tipo de construcción. Cada obra refleja
              soluciones adaptadas a las necesidades de cada cliente.
            </p>
          </div>

          <div
            className={`grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <Card className="group cursor-pointer h-full hover:shadow-lg transition-all duration-300 hover:scale-105 bg-background border-primary/30" onClick={() => router.push("/proyectos/viviendas")}>
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors">
                  <Home className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground uppercase">Viviendas</h3>
              </CardHeader>
              <CardContent className="flex flex-col h-full pt-0">
                <p className="text-muted-foreground text-sm font-semibold flex-grow">
                  Proyectos residenciales en sistemas tradicionales, steel frame y wood frame.
                </p>
              </CardContent>
            </Card>

            <Card className="group cursor-pointer h-full hover:shadow-lg transition-all duration-300 hover:scale-105 bg-background border-primary/30" onClick={() => router.push("/proyectos/naves-industriales")}>
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors">
                  <Factory className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground uppercase">Naves Industriales</h3>
              </CardHeader>
              <CardContent className="flex flex-col h-full pt-0">
                <p className="text-muted-foreground text-sm font-semibold flex-grow">
                  Estructuras metálicas para uso industrial, comercial y logístico.
                </p>
              </CardContent>
            </Card>

            <Card className="group cursor-pointer h-full hover:shadow-lg transition-all duration-300 hover:scale-105 bg-background border-primary/30" onClick={() => router.push("/proyectos/funcional")}>
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors">
                  <Factory className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground uppercase">Funcional</h3>
              </CardHeader>
              <CardContent className="flex flex-col h-full pt-0">
                <p className="text-muted-foreground text-sm font-semibold flex-grow">
                  Proyectos funcionales y especializados para usos específicos.
                </p>
              </CardContent>
            </Card>
          </div>

          <div
            className={`mt-12 transition-all duration-1000 delay-400 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <p className=" mb-4 uppercase text-white font-semibold">¿Tenés un proyecto en mente?</p>
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
