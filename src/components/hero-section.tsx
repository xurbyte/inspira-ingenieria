import Image from "next/image"
import { SmoothScrollLink } from "@/components/smooth-scroll-link"
import { GridOverlay } from "@/components/structural/grid-overlay"
import { AxisLine } from "@/components/structural/axis-line"
import { CornerBracket } from "@/components/structural/corner-bracket"

export function HeroSection() {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ backgroundColor: "var(--color-dark-section)" }}
    >
      {/* === Background Layers === */}

      {/* Hero Image — full bleed */}
      <Image
        src="/hero.jpg"
        alt="Inspira Ingeniería - Estructuras seguras en la Patagonia"
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />

      {/* Asymmetric gradient overlay — dark left (text) to semi-visible right */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(105deg, rgba(44,62,80,0.97) 0%, rgba(44,62,80,0.90) 35%, rgba(44,62,80,0.70) 60%, rgba(44,62,80,0.35) 100%)",
        }}
      />

      {/* Subtle structural grid — behind content */}
      <GridOverlay
        className="absolute inset-0"
        color="rgba(255,255,255,0.03)"
        spacing={80}
      />

      {/* === Structural Decorations === */}

      {/* Top-left bracket — marks the content zone */}
      <CornerBracket
        position="top-left"
        size={40}
        className="ml-4 mt-4 md:ml-8 md:mt-8 opacity-50"
      />

      {/* Bottom-right bracket — counterbalance */}
      <CornerBracket
        position="bottom-right"
        size={40}
        className="mr-4 mb-4 md:mr-8 md:mb-8 opacity-25"
      />

      {/* Vertical axis — left edge, blueprint reference line */}
      <AxisLine
        direction="vertical"
        className="absolute left-6 md:left-14 top-0 bottom-0 opacity-20"
      />

      {/* Horizontal axis — near bottom, ground plane reference */}
      <AxisLine
        direction="horizontal"
        className="absolute bottom-20 md:bottom-24 left-0 right-0 opacity-10"
      />

      {/* === Content === */}
      <div className="relative z-10 w-full">
        <div className="container mx-auto px-4 sm:px-8 lg:px-20 pt-28 pb-20 md:pt-32 md:pb-24">
          <div className="max-w-3xl mx-auto text-center hero-stagger">
            {/* Category label — engineering specification style */}
            <div className="label-mono text-[var(--color-cyan-accent)] mb-6 flex items-center justify-center gap-3">
              <span className="inline-block w-8 h-px bg-[var(--color-cyan-accent)]" />
              <span>INGENIERÍA ESTRUCTURAL · PATAGONIA</span>
              <span className="inline-block w-8 h-px bg-[var(--color-cyan-accent)]" />
            </div>

            {/* Headline — THE visual anchor */}
            <h1 className="heading-hero text-white mb-8 text-balance">
              Transformamos diseños en{" "}
              <span className="text-[var(--color-cyan-accent)]">
                estructuras seguras
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-white/60 max-w-xl mx-auto mb-12 leading-relaxed">
              Estudio de ingeniería estructural en Puerto Madryn. Diseñamos
              soluciones para arquitectos y desarrolladores, adaptadas a la
              Patagonia.
            </p>

            {/* CTAs — engineering callout style */}
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <SmoothScrollLink
                targetId="servicios"
                className="inline-flex items-center justify-center px-8 py-4 text-sm font-semibold tracking-widest uppercase border-2 border-[var(--color-cyan-accent)] text-white hover:bg-[var(--color-cyan-accent)] hover:text-[var(--color-dark-section)] transition-all duration-300"
              >
                Ver Servicios
              </SmoothScrollLink>
              <SmoothScrollLink
                targetId="contacto"
                className="inline-flex items-center justify-center px-8 py-4 text-sm font-semibold tracking-widest uppercase border border-white/25 text-white/70 hover:text-white hover:border-white/50 transition-all duration-300"
              >
                Consultá tu Proyecto
              </SmoothScrollLink>
            </div>

            {/* Bottom accent — replaces generic icon cards */}
            <div className="mt-16 pt-8 border-t border-white/10 flex items-center justify-center gap-4">
              <div className="w-1.5 h-1.5 bg-[var(--color-cyan-accent)] rotate-45 shrink-0" />
              <span className="text-white/30 text-sm tracking-wide">
                Diseño estructural conforme a CIRSOC · Adaptado a la Patagonia
                argentina
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
