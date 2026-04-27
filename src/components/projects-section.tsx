import Link from "next/link"
import Image from "next/image"
import { Home, Factory, ArrowRight } from "lucide-react"
import { SmoothScrollLink } from "@/components/smooth-scroll-link"
import { GridOverlay } from "@/components/structural/grid-overlay"
import { AxisLine } from "@/components/structural/axis-line"
import { CornerBracket } from "@/components/structural/corner-bracket"

const projectCategories = [
  {
    href: "/proyectos/viviendas",
    title: "Viviendas",
    description:
      "Proyectos residenciales en sistemas tradicionales, steel frame y wood frame.",
    icon: Home,
  },
  {
    href: "/proyectos/naves-industriales",
    title: "Naves Industriales",
    description:
      "Estructuras metálicas para uso industrial, comercial y logístico.",
    icon: Factory,
  },
  {
    href: "/proyectos/funcional",
    title: "Funcional",
    description:
      "Proyectos funcionales y especializados para usos específicos.",
    icon: Factory,
  },
]

export function ProjectsSection() {
  return (
    <section
      id="proyectos"
      className="relative py-20 md:py-28 overflow-hidden"
      style={{ backgroundColor: "var(--color-dark-section)" }}
    >
      {/* Background Image — dramatic treatment */}
      <Image
        src="/puerto madryn.jpg"
        alt="Puerto Madryn — inspiración de nuestros proyectos"
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />
      {/* Dark overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: "rgba(44,62,80,0.82)" }}
      />
      {/* Subtle grid */}
      <GridOverlay
        className="absolute inset-0"
        color="rgba(255,255,255,0.03)"
        spacing={80}
      />

      {/* Structural decorations */}
      <CornerBracket
        position="top-left"
        size={32}
        className="ml-6 mt-6 md:ml-10 md:mt-10 opacity-25"
      />
      <AxisLine
        direction="vertical"
        className="absolute left-6 md:left-14 top-0 bottom-0 opacity-10"
      />

      <div className="container mx-auto px-4 sm:px-8 lg:px-16 relative z-10">
        {/* Section Heading */}
        <div className="mb-16 md:mb-20">
          <div className="label-mono text-[var(--color-cyan-accent)] mb-4 flex items-center gap-3">
            <span className="inline-block w-8 h-px bg-[var(--color-cyan-accent)]" />
            <span>PORTAFOLIO</span>
          </div>
          <h2 className="heading-section text-white mb-6">
            Nuestros Proyectos
          </h2>
          <p className="text-lg text-white/50 max-w-2xl leading-relaxed">
            Explorá nuestros proyectos organizados por tipo de construcción. Cada obra refleja
            soluciones adaptadas a las necesidades de cada cliente.
          </p>
        </div>

        {/* Project Cards — Engineering drawing panel style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 md:mb-20">
          {projectCategories.map((cat, i) => (
            <Link
              key={i}
              href={cat.href}
              className="group border border-white/10 p-6 md:p-8 hover:border-[var(--color-cyan-accent)]/40 transition-all duration-300 relative"
              style={{ backgroundColor: "rgba(44,62,80,0.6)" }}
            >
              {/* Numbered label */}
              <div className="flex items-center gap-3 mb-6">
                <span className="label-mono text-white/20 text-xs">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <AxisLine direction="horizontal" className="flex-1 opacity-10" />
              </div>

              {/* Icon + Title */}
              <div className="flex items-center gap-3 mb-4">
                <cat.icon
                  className="h-4 w-4 text-[var(--color-cyan-accent)]"
                  strokeWidth={1.5}
                />
                <h3 className="text-lg font-bold text-white uppercase tracking-wide">
                  {cat.title}
                </h3>
              </div>

              {/* Description */}
              <p className="text-white/50 text-sm leading-relaxed mb-6">
                {cat.description}
              </p>

              {/* Arrow indicator */}
              <div className="flex items-center gap-2 text-[var(--color-cyan-accent)] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="label-mono text-xs">VER PROYECTOS</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Link>
          ))}
        </div>

        {/* CTA — Strong typographic element */}
        <div className="border-t border-white/10 pt-10 md:pt-14 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="text-2xl md:text-3xl font-bold text-white uppercase tracking-wide">
              ¿Tenés un proyecto en mente?
            </p>
            <p className="text-white/40 text-sm mt-2">
              Contanos tu idea y te ayudamos a definir la mejor solución estructural.
            </p>
          </div>
          <SmoothScrollLink
            targetId="contacto"
            className="inline-flex items-center gap-2 px-8 py-4 text-sm font-semibold tracking-widest uppercase border-2 border-[var(--color-cyan-accent)] text-white hover:bg-[var(--color-cyan-accent)] hover:text-[var(--color-dark-section)] transition-all duration-300 shrink-0"
          >
            Consultanos tu proyecto
          </SmoothScrollLink>
        </div>
      </div>
    </section>
  )
}
