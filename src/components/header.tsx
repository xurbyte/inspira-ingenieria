"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import Image from "next/image"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setIsMenuOpen(false)
    }
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/95 backdrop-blur-sm border-b border-border shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Image
              src="/logo.png"
              alt="Inspira Ingeniería Logo"
              width={180}
              height={40}
              className="h-10 w-auto"
            />
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection("inicio")}
              className={`transition-colors ${
                isScrolled ? "text-foreground hover:text-primary" : "text-white hover:text-primary"
              }`}
            >
              Inicio
            </button>
            <button
              onClick={() => scrollToSection("nosotros")}
              className={`transition-colors ${
                isScrolled ? "text-foreground hover:text-primary" : "text-white hover:text-primary"
              }`}
            >
              Nosotros
            </button>
            <button
              onClick={() => scrollToSection("servicios")}
              className={`transition-colors ${
                isScrolled ? "text-foreground hover:text-primary" : "text-white hover:text-primary"
              }`}
            >
              Servicios
            </button>
            <button
              onClick={() => scrollToSection("equipo")}
              className={`transition-colors ${
                isScrolled ? "text-foreground hover:text-primary" : "text-white hover:text-primary"
              }`}
            >
              Equipo
            </button>
            <button
              onClick={() => scrollToSection("proyectos")}
              className={`transition-colors ${
                isScrolled ? "text-foreground hover:text-primary" : "text-white hover:text-primary"
              }`}
            >
              Proyectos
            </button>
            <button
              onClick={() => scrollToSection("contacto")}
              className={`transition-colors ${
                isScrolled ? "text-foreground hover:text-primary" : "text-white hover:text-primary"
              }`}
            >
              Contacto
            </button>
          </nav>

          <Button onClick={() => scrollToSection("contacto")} className="hidden md:inline-flex">
            Consultanos
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className={`md:hidden ${isScrolled ? "" : "text-white hover:text-primary"}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-border pt-4 bg-background/95 backdrop-blur-sm rounded-lg">
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => scrollToSection("inicio")}
                className="text-left text-foreground hover:text-primary transition-colors"
              >
                Inicio
              </button>
              <button
                onClick={() => scrollToSection("nosotros")}
                className="text-left text-foreground hover:text-primary transition-colors"
              >
                Nosotros
              </button>
              <button
                onClick={() => scrollToSection("servicios")}
                className="text-left text-foreground hover:text-primary transition-colors"
              >
                Servicios
              </button>
              <button
                onClick={() => scrollToSection("equipo")}
                className="text-left text-foreground hover:text-primary transition-colors"
              >
                Equipo
              </button>
              <button
                onClick={() => scrollToSection("proyectos")}
                className="text-left text-foreground hover:text-primary transition-colors"
              >
                Proyectos
              </button>
              <button
                onClick={() => scrollToSection("contacto")}
                className="text-left text-foreground hover:text-primary transition-colors"
              >
                Contacto
              </button>
              <Button onClick={() => scrollToSection("contacto")} className="w-full mt-4">
                Consultanos
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
