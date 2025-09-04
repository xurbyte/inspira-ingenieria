"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Linkedin, Mail } from "lucide-react"
import Image from "next/image"

export function TeamSection() {
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

  const team = [
    {
      name: "Tomás Portalez",
      title: "Ingeniero Civil - Co-fundador",
      image: "/professional-engineer-portrait-tom-s.png",
      description:
        "Especialista en cálculo estructural y elaboración de memorias técnicas, con experiencia en viviendas, edificios y obras industriales",
    },
    {
      name: "Mateo Portalez",
      title: "Ingeniero Civil - Co-fundador",
      image: "/professional-engineer-portrait-mateo.png",
      description:
        "Referente en modelado estructural y documentación técnica, integrando arquitectura y cálculo en entornos BIM.",
    },
  ]

  return (
    <section ref={sectionRef} id="equipo" className="min-h-screen py-24 bg-background flex items-center">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div
            className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 uppercase">Nuestro Equipo</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty font-semibold">
              Conocé a Tomás y Mateo Portalez, ingenieros civiles fundadores de Inspira
              Ingeniería. Combinamos experiencia técnica y herramientas digitales para diseñar
              estructuras seguras y eficientes, adaptadas a la Patagonia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <div
                key={index}
                className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                style={{ transitionDelay: `${(index + 1) * 200}ms` }}
              >
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-background border-primary/30">
                  <div className="aspect-square overflow-hidden relative">
                    <Image
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-6 text-center">
                    <h3 className="text-2xl font-bold text-foreground mb-2">{member.name}</h3>
                    <p className="text-primary font-semibold mb-4 uppercase">{member.title}</p>
                    <p className="text-muted-foreground mb-6 leading-relaxed font-semibold">{member.description}</p>
                    <div className="flex justify-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors cursor-pointer">
                        <Linkedin className="h-5 w-5 text-primary" />
                      </div>
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors cursor-pointer">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                    </div>
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
