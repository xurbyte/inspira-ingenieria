"use client"

import { Button } from "@/components/ui/button"
import { Calculator, Building2, Zap } from "lucide-react"
import { useEffect, useState } from "react"
import Image from "next/image"

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section
      id="inicio"
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
    >
      <Image
        src="/hero.jpg"
        alt="Inspira Ingeniería - Estructuras seguras en la Patagonia"
        fill
        className="object-cover -z-10"
        priority
      />
      <div className="absolute inset-0 bg-black/80 -z-10" />
      <div className="container mx-auto px-4 pt-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className={`mb-8 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 text-balance">
              Transformamos diseños en <span className="text-primary">estructuras seguras</span>
            </h1>
            <p className="text-xl text-gray-200 mb-8 text-pretty max-w-2xl mx-auto font-semibold">
              Estudio de ingeniería estructural en Puerto Madryn. Diseñamos soluciones para
              arquitectos y desarrolladores, adaptadas a la Patagonia.
            </p>
          </div>

          <div
            className={`flex flex-col sm:flex-row gap-4 justify-center mb-12 ${isVisible ? "animate-fade-in-up animate-delay-200" : "opacity-0"}`}
          >
            <Button size="lg" onClick={() => scrollToSection("servicios")} className="text-black text-lg px-8 py-6">
              Ver Servicios
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => scrollToSection("contacto")}
              className="text-lg px-8 py-6 bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Consultanos tu proyecto
            </Button>
          </div>

          <div
            className={`grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 ${isVisible ? "animate-fade-in-up animate-delay-400" : "opacity-0"}`}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4">
                <Calculator className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white uppercase">Cálculo Estructural</h3>
              <p className="text-gray-200 text-sm font-semibold">Estructuras seguras y eficientes según normativas argentinas
                (CIRSOC)
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white uppercase">Modelado BIM</h3>
              <p className="text-gray-200 text-sm font-semibold">Modelos digitales integrados con herramientas avanzadas</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white uppercase">Adaptación Local</h3>
              <p className="text-gray-200 text-sm font-semibold">Diseñamos estructuras adaptadas a las condiciones únicas de la
                Patagonia
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
