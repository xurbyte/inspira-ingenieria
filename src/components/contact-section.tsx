"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, Instagram, Linkedin, MessageCircle } from "lucide-react"

export function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [formStartTime, setFormStartTime] = useState<number>(Date.now())
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    project: "",
    message: "",
    honeypot: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage(null)

    // Client-side validation — field-specific errors
    const errors: Record<string, string> = {}

    // Check minimum form completion time (3 seconds to prevent bots)
    const timeElapsed = Date.now() - formStartTime
    if (timeElapsed < 3000) {
      setSubmitMessage({ type: 'error', text: 'Por favor, toma un momento para completar el formulario.' })
      setIsSubmitting(false)
      return
    }

    // Validate name
    if (!formData.name.trim()) {
      errors.name = 'El nombre es requerido.'
    } else if (formData.name.trim().length < 2) {
      errors.name = 'El nombre debe tener al menos 2 caracteres.'
    } else if (formData.name.trim().length > 100) {
      errors.name = 'El nombre es demasiado largo.'
    }

    // Validate email
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    if (!formData.email.trim()) {
      errors.email = 'El email es requerido.'
    } else if (!emailRegex.test(formData.email.trim())) {
      errors.email = 'Formato de email inválido.'
    }

    // Validate phone if provided
    if (formData.phone.trim()) {
      const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,20}$/
      if (!phoneRegex.test(formData.phone.trim())) {
        errors.phone = 'Formato de teléfono inválido.'
      }
    }

    // Validate message
    if (!formData.message.trim()) {
      errors.message = 'El mensaje es requerido.'
    } else if (formData.message.trim().length < 10) {
      errors.message = 'El mensaje debe tener al menos 10 caracteres.'
    } else if (formData.message.trim().length > 2000) {
      errors.message = 'El mensaje es demasiado largo (máximo 2000 caracteres).'
    }

    // If there are validation errors, show them inline
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      setIsSubmitting(false)
      return
    }

    setFieldErrors({})

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitMessage({ type: 'success', text: data.message })
        setFormData({ name: "", email: "", phone: "", project: "", message: "", honeypot: "" })
        setFieldErrors({})
        setFormStartTime(Date.now())
      } else {
        setSubmitMessage({ type: 'error', text: data.error || 'Error al enviar la consulta. Inténtalo de nuevo.' })
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitMessage({ type: 'error', text: 'Error de conexión. Verifica tu conexión a internet e intenta de nuevo.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <section id="contacto" className="py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-8 lg:px-16">
        {/* Section Heading */}
        <div className="mb-16 md:mb-20">
          <div className="label-mono text-[var(--color-cyan-accent)] mb-4 flex items-center gap-3">
            <span className="inline-block w-8 h-px bg-[var(--color-cyan-accent)]" />
            <span>CONTACTO</span>
          </div>
          <h2 className="heading-section text-foreground mb-6">
            Contactanos
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            ¿Tenés un proyecto en mente? Contanos sobre tu obra y te ayudamos a definir la
            mejor solución estructural.
          </p>
        </div>

        {/* 2-column: Form (wider) + Info (narrower) */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Form — 3/5 */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="name"
                    className="label-mono text-foreground/60 mb-2 block"
                  >
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
                    className={`bg-transparent focus:border-[var(--color-cyan-accent)] focus:ring-[var(--color-cyan-accent)]/20 rounded-none ${fieldErrors.name ? "border-red-400" : "border-border/60"}`}
                  />
                  {fieldErrors.name && (
                    <p className="mt-1 text-xs text-red-500">{fieldErrors.name}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="label-mono text-foreground/60 mb-2 block"
                  >
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
                    className={`bg-transparent focus:border-[var(--color-cyan-accent)] focus:ring-[var(--color-cyan-accent)]/20 rounded-none ${fieldErrors.email ? "border-red-400" : "border-border/60"}`}
                  />
                  {fieldErrors.email && (
                    <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="phone"
                    className="label-mono text-foreground/60 mb-2 block"
                  >
                    Teléfono
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+54 9 280 456-3172"
                    className={`bg-transparent focus:border-[var(--color-cyan-accent)] focus:ring-[var(--color-cyan-accent)]/20 rounded-none ${fieldErrors.phone ? "border-red-400" : "border-border/60"}`}
                  />
                  {fieldErrors.phone && (
                    <p className="mt-1 text-xs text-red-500">{fieldErrors.phone}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="project"
                    className="label-mono text-foreground/60 mb-2 block"
                  >
                    Tipo de proyecto
                  </label>
                  <Input
                    id="project"
                    name="project"
                    type="text"
                    value={formData.project}
                    onChange={handleChange}
                    placeholder="Ej: Vivienda, Edificio, Nave industrial"
                    className="border-border/60 bg-transparent focus:border-[var(--color-cyan-accent)] focus:ring-[var(--color-cyan-accent)]/20 rounded-none"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="label-mono text-foreground/60 mb-2 block"
                >
                  Mensaje *
                </label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Contanos sobre tu proyecto: ubicación, tipo de estructura, etapa del proyecto, etc."
                  className={`bg-transparent focus:border-[var(--color-cyan-accent)] focus:ring-[var(--color-cyan-accent)]/20 rounded-none min-h-[120px] ${fieldErrors.message ? "border-red-400" : "border-border/60"}`}
                />
                {fieldErrors.message && (
                  <p className="mt-1 text-xs text-red-500">{fieldErrors.message}</p>
                )}
              </div>

              {/* Honeypot field */}
              <div className="sr-only" aria-hidden="true">
                <label htmlFor="honeypot">
                  No completar este campo (es para detectar spam):
                </label>
                <Input
                  id="honeypot"
                  name="honeypot"
                  type="text"
                  value={formData.honeypot}
                  onChange={handleChange}
                  placeholder="Campo anti-spam"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto inline-flex items-center justify-center px-8 py-4 text-xs font-semibold tracking-widest uppercase border-2 border-[var(--color-cyan-accent)] bg-transparent text-foreground hover:bg-[var(--color-cyan-accent)] hover:text-white transition-all duration-300 rounded-none"
              >
                {isSubmitting ? "Enviando..." : "Enviar consulta"}
              </Button>

              {submitMessage && (
                <div
                  className={`mt-4 p-4 border ${
                    submitMessage.type === "success"
                      ? "border-green-200 bg-green-50/50 text-green-800"
                      : "border-red-200 bg-red-50/50 text-red-800"
                  }`}
                >
                  <p className="text-sm font-medium">
                    {submitMessage.type === "success" ? "✅ " : "❌ "}
                    {submitMessage.text}
                  </p>
                </div>
              )}
            </form>
          </div>

          {/* Contact Info — 2/5, structured data style */}
          <div className="lg:col-span-2 space-y-0">
            {/* Contact details — structured data */}
            <div className="py-6">
              <div className="label-mono text-[var(--color-cyan-accent)] mb-5 flex items-center gap-3">
                <span className="inline-block w-6 h-px bg-[var(--color-cyan-accent)]" />
                <span>DATOS DE CONTACTO</span>
              </div>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <Mail className="h-4 w-4 text-[var(--color-cyan-accent)] mt-0.5 shrink-0" />
                  <div>
                    <p className="label-mono text-foreground/40 text-xs mb-1">EMAIL</p>
                    <a
                      href="mailto:ingenieria.inspira@gmail.com"
                      className="text-foreground/80 hover:text-[var(--color-cyan-accent)] transition-colors text-sm"
                    >
                      ingenieria.inspira@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone className="h-4 w-4 text-[var(--color-cyan-accent)] mt-0.5 shrink-0" />
                  <div>
                    <p className="label-mono text-foreground/40 text-xs mb-1">WHATSAPP</p>
                    <a
                      href="https://wa.me/5492804563172"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground/80 hover:text-[var(--color-cyan-accent)] transition-colors text-sm"
                    >
                      +54 9 280 456-3172
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MapPin className="h-4 w-4 text-[var(--color-cyan-accent)] mt-0.5 shrink-0" />
                  <div>
                    <p className="label-mono text-foreground/40 text-xs mb-1">UBICACIÓN</p>
                    <p className="text-foreground/80 text-sm">
                      Puerto Madryn, Chubut, Argentina
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-border/50" />

            {/* Social links */}
            <div className="py-6">
              <div className="label-mono text-[var(--color-cyan-accent)] mb-4 flex items-center gap-3">
                <span className="inline-block w-6 h-px bg-[var(--color-cyan-accent)]" />
                <span>REDES</span>
              </div>
              <div className="flex items-center gap-5">
                <a
                  href="https://instagram.com/inspira.ing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="label-mono text-xs text-muted-foreground hover:text-[var(--color-cyan-accent)] transition-colors flex items-center gap-2"
                  aria-label="Instagram de Inspira Ingeniería"
                >
                  <Instagram className="h-3.5 w-3.5" />
                  <span>Instagram</span>
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="label-mono text-xs text-muted-foreground hover:text-[var(--color-cyan-accent)] transition-colors flex items-center gap-2"
                  aria-label="LinkedIn de Inspira Ingeniería"
                >
                  <Linkedin className="h-3.5 w-3.5" />
                  <span>LinkedIn</span>
                </a>
                <a
                  href="https://wa.me/5492804563172"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="label-mono text-xs text-muted-foreground hover:text-[var(--color-cyan-accent)] transition-colors flex items-center gap-2"
                  aria-label="WhatsApp de Inspira Ingeniería"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
