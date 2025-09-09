"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, Instagram, Linkedin, MessageCircle } from "lucide-react"

export function ContactSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    project: "",
    message: "",
  })

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the form data to your backend
    // Form submitted
    // For now, we'll just show an alert
    alert("Gracias por tu consulta. Te contactaremos pronto.")
    setFormData({ name: "", email: "", phone: "", project: "", message: "" })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <section ref={sectionRef} id="contacto" className="min-h-screen py-24 bg-background flex items-center">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div
            className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 uppercase">Contactanos</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty font-semibold">
              ¿Tenés un proyecto en mente? Contanos sobre tu obra y te ayudamos a definir la
              mejor solución estructural.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div
              className={`transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              <Card className="hover:shadow-lg h-full transition-shadow duration-300 bg-background backdrop-blur-sm border-primary/30">
                <CardHeader>
                  <CardTitle className="uppercase">Consultanos tu proyecto</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col h-full">
                  <form onSubmit={handleSubmit} className="flex flex-col h-full">
                    <div className="space-y-6 flex-grow">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="name" className="block text-sm text-foreground mb-2 uppercase font-semibold">
                            Nombre *
                          </label>
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Tu nombre completo"
                            className="border-primary/30"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm text-foreground mb-2 uppercase font-semibold">
                            Email *
                          </label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="tu@email.com"
                            className="border-primary/30"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="phone" className="block text-sm text-foreground mb-2 uppercase font-semibold">
                            Teléfono
                          </label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+54 9 280 456-3172"
                            className="border-primary/30"
                          />
                        </div>
                        <div>
                          <label htmlFor="project" className="block text-sm text-foreground mb-2 uppercase font-semibold">
                            Tipo de proyecto
                          </label>
                          <Input
                            id="project"
                            name="project"
                            type="text"
                            value={formData.project}
                            onChange={handleChange}
                            placeholder="Ej: Vivienda, Edificio, Nave industrial"
                            className="border-primary/30"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col flex-grow">
                        <label htmlFor="message" className="block text-sm text-foreground mb-2 uppercase font-semibold">
                          Mensaje *
                        </label>
                        <Textarea
                          id="message"
                          name="message"
                          required
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Contanos sobre tu proyecto: ubicación, tipo de estructura, etapa del proyecto, etc."
                          className="border-primary/30 h-[100px]"
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full mt-6">
                      Enviar consulta
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div
              className={`space-y-8 transition-all duration-1000 delay-400 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              <Card className="hover:shadow-lg transition-shadow duration-300 bg-background backdrop-blur-sm border-primary/30">
                <CardHeader>
                  <CardTitle>Información de contacto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <Mail className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h4 className="font-semibold text-foreground">Email</h4>
                      <a
                        href="mailto:ingenieria.inspira@gmail.com"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        ingenieria.inspira@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Phone className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h4 className="font-semibold text-foreground">WhatsApp</h4>
                      <a
                        href="https://wa.me/5492804563172"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        +54 9 280 456-3172
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <MapPin className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h4 className="font-semibold text-foreground">Ubicación</h4>
                      <p className="text-muted-foreground">Puerto Madryn, Chubut, Argentina</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-300 bg-background backdrop-blur-sm border-primary/30">
                <CardHeader>
                  <CardTitle>Seguinos en redes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-4">
                    <a
                      href="https://instagram.com/inspira.ing"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
                    >
                      <Instagram className="h-6 w-6 text-primary" />
                    </a>
                    <a
                      href="#"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
                    >
                      <Linkedin className="h-6 w-6 text-primary" />
                    </a>
                    <a
                      href="https://wa.me/5492804563172"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
                    >
                      <MessageCircle className="h-6 w-6 text-primary" />
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* <Card className="bg-background border-primary/20 hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-foreground mb-2">¿Proyecto urgente?</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Para consultas urgentes o proyectos con plazos ajustados, contactanos directamente por WhatsApp.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open("https://wa.me/5492804563172", "_blank")}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    WhatsApp directo
                  </Button>
                </CardContent>
              </Card> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
