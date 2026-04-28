"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import Image from "next/image"
import { SmoothScrollLink } from "@/components/smooth-scroll-link"

const NAV_ITEMS = [
  { id: "inicio", label: "Inicio" },
  { id: "nosotros", label: "Nosotros" },
  { id: "servicios", label: "Servicios" },
  { id: "equipo", label: "Equipo" },
  { id: "proyectos", label: "Proyectos" },
  { id: "contacto", label: "Contacto" },
]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const logoSrc = (!isScrolled && pathname === "/") ? "/logo-blanco.png" : "/logo-negro.png"

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-[var(--color-cyan-accent)]/20 shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-8 lg:px-20 py-3 md:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <SmoothScrollLink targetId="inicio" onClick={closeMenu}>
            <Image
              src={logoSrc}
              alt="Inspira Ingeniería Logo"
              width={200}
              height={80}
              className={`h-12 md:h-16 w-auto ${
                !isScrolled
                  ? "[filter:drop-shadow(0_1px_3px_rgba(0,0,0,0.4))]"
                  : ""
              }`}
            />
          </SmoothScrollLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {NAV_ITEMS.map((item) => (
              <SmoothScrollLink
                key={item.id}
                targetId={item.id}
                className={`transition-colors font-medium text-sm tracking-wider uppercase ${
                  isScrolled
                    ? "text-foreground hover:text-[var(--color-cyan-accent)]"
                    : "text-white/90 hover:text-[var(--color-cyan-accent)] [text-shadow:0_1px_4px_rgba(0,0,0,0.5)]"
                }`}
              >
                {item.label}
              </SmoothScrollLink>
            ))}
          </nav>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
            className={`md:hidden ${
              !isScrolled && "text-white hover:text-[var(--color-cyan-accent)]"
            }`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation — CSS slide-in */}
        <div
          className={`md:hidden absolute top-full left-0 right-0 transition-all duration-300 ease-in-out overflow-hidden ${
            isMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="bg-[var(--color-dark-section)]/95 backdrop-blur-xl border-b border-[var(--color-cyan-accent)]/10">
            {/* Structural accent line */}
            <div className="h-px bg-[var(--color-cyan-accent)]/20 mx-4" />
            <div className="p-4 space-y-0.5">
              {NAV_ITEMS.map((item) => (
                <SmoothScrollLink
                  key={item.id}
                  targetId={item.id}
                  onClick={closeMenu}
                  className="block w-full text-left px-4 py-3 text-white/80 hover:text-[var(--color-cyan-accent)] hover:bg-white/5 transition-all duration-200 font-medium text-sm tracking-wider uppercase"
                >
                  {item.label}
                </SmoothScrollLink>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
