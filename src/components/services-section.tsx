import { SmoothScrollLink } from "@/components/smooth-scroll-link"
import { AxisLine } from "@/components/structural/axis-line"
import { GridOverlay } from "@/components/structural/grid-overlay"
import { CornerBracket } from "@/components/structural/corner-bracket"
import {
  Calculator,
  Building2,
  FileText,
  Users,
  ArrowRight,
} from "lucide-react"

const services = [
  {
    icon: Calculator,
    title: "Cálculo Estructural",
    description:
      "Diseñamos estructuras seguras y eficientes para viviendas, edificios y naves industriales.",
    details: [
      "Sistemas constructivos tradicionales (hormigón y mampostería)",
      "Estructuras en wood frame y steel frame",
      "Estructuras metálicas para naves industriales",
      "Acompañamiento técnico desde el anteproyecto",
    ],
    cta: "Consultanos tu proyecto de cálculo estructural",
    primary: true,
  },
  {
    icon: Building2,
    title: "Modelado BIM",
    description:
      "Modelos digitales que integran planos, detalles y documentación en un único entorno.",
    details: [
      "Mejor coordinación con la arquitectura",
      "Menos errores en obra",
      "Visualización previa de la estructura",
      "Documentación integrada y actualizada",
    ],
    cta: "Solicitá tu modelo BIM estructural",
    primary: false,
  },
  {
    icon: FileText,
    title: "Memorias de Cálculo y Documentación",
    description:
      "Elaboramos memorias de cálculo, planos estructurales y documentación técnica completa.",
    details: [
      "Documentación para aprobaciones municipales",
      "Preparación para licitaciones",
      "Control de obra",
      "Planos estructurales detallados",
    ],
    cta: "Solicitar documentación técnica",
    primary: false,
  },
  {
    icon: Users,
    title: "Dirección de Obra",
    description:
      "Brindamos dirección de obra para garantizar que la construcción se ejecute según proyecto.",
    details: [
      "Supervisión de trabajos estructurales en obra",
      "Verificación de calidad en materiales y técnicas constructivas",
      "Control de tiempos y costos",
      "Ajustes técnicos durante la ejecución",
    ],
    cta: "Consultar dirección de obra",
    primary: false,
  },
]

export function ServicesSection() {
  const primary = services.find((s) => s.primary)!
  const secondary = services.filter((s) => !s.primary)

  return (
    <section id="servicios" className="dark-section py-20 md:py-28 relative overflow-hidden">
      {/* Subtle structural grid */}
      <GridOverlay
        className="absolute inset-0"
        color="rgba(255,255,255,0.03)"
        spacing={80}
      />

      {/* Structural decorations */}
      <CornerBracket
        position="top-right"
        size={32}
        className="mr-6 mt-6 md:mr-10 md:mt-10 opacity-30"
      />
      <AxisLine
        direction="vertical"
        className="absolute right-6 md:right-14 top-0 bottom-0 opacity-10"
      />

      <div className="container mx-auto px-4 sm:px-8 lg:px-16 relative z-10">
        {/* Section Heading */}
        <div className="mb-16 md:mb-20">
          <div className="label-mono text-[var(--color-cyan-accent)] mb-4 flex items-center gap-3">
            <span className="inline-block w-8 h-px bg-[var(--color-cyan-accent)]" />
            <span>SERVICIOS</span>
          </div>
          <h2 className="heading-section text-white mb-6">
            Nuestros Servicios
          </h2>
          <p className="text-lg text-white/60 leading-relaxed">
            Ofrecemos soluciones integrales en ingeniería estructural, desde el cálculo hasta la documentación
            completa, adaptadas a las necesidades específicas de cada proyecto.
          </p>
        </div>

        {/* Primary Service — Featured band */}
        <div className="mb-8 border border-white/10 p-8 md:p-12 relative">
          <AxisLine
            direction="vertical"
            className="absolute left-0 top-4 bottom-4 opacity-40"
          />
          <div className="pl-6 md:pl-10">
            <div className="flex flex-col md:flex-row md:items-start gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <primary.icon
                    className="h-5 w-5 text-[var(--color-cyan-accent)]"
                    strokeWidth={1.5}
                  />
                  <span className="label-mono text-[var(--color-cyan-accent)]">
                    SERVICIO PRINCIPAL
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-wide mb-4">
                  {primary.title}
                </h3>
                <p className="text-white/70 leading-relaxed mb-6">
                  {primary.description}
                </p>
                <ul className="space-y-2">
                  {primary.details.map((detail, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <ArrowRight className="h-3.5 w-3.5 text-[var(--color-cyan-accent)] mt-1 shrink-0" />
                      <span className="text-white/60 text-sm">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="md:self-center shrink-0">
                <SmoothScrollLink
                  targetId="contacto"
                  className="inline-flex items-center gap-2 px-8 py-4 text-sm font-semibold tracking-widest uppercase border-2 border-[var(--color-cyan-accent)] text-white hover:bg-[var(--color-cyan-accent)] hover:text-[var(--color-dark-section)] transition-all duration-300"
                >
                  {primary.cta}
                </SmoothScrollLink>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5">
          {secondary.map((service, i) => (
            <div key={i} className="bg-[var(--color-dark-section)] p-6 md:p-8 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <service.icon
                  className="h-4 w-4 text-[var(--color-cyan-accent)]"
                  strokeWidth={1.5}
                />
                <span className="label-mono text-white/30 text-xs">
                  {String(i + 2).padStart(2, "0")}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wide mb-3">
                {service.title}
              </h3>
              <p className="text-white/50 text-sm leading-relaxed mb-4 flex-grow">
                {service.description}
              </p>
              <ul className="space-y-1.5 mb-6">
                {service.details.map((detail, j) => (
                  <li key={j} className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-[var(--color-cyan-accent)] rotate-45 mt-1.5 shrink-0" />
                    <span className="text-white/40 text-xs">{detail}</span>
                  </li>
                ))}
              </ul>
              <SmoothScrollLink
                targetId="contacto"
                className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[var(--color-cyan-accent)] hover:text-white transition-colors"
              >
                {service.cta}
                <ArrowRight className="h-3 w-3" />
              </SmoothScrollLink>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
