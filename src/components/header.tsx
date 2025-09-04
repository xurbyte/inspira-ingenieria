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
      <div className="container mx-auto px-20 py-4 ">
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
          <div className="md:hidden absolute top-full left-0 right-0 mt-2 mx-4">
            <nav className="bg-card/95 backdrop-blur-md border border-border rounded-xl shadow-xl overflow-hidden">
              <div className="p-6 space-y-1">
                <button
                  onClick={() => scrollToSection("inicio")}
                  className="w-full text-left px-4 py-3 rounded-lg text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200 font-medium"
                >
                  Inicio
                </button>
                <button
                  onClick={() => scrollToSection("nosotros")}
                  className="w-full text-left px-4 py-3 rounded-lg text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200 font-medium"
                >
                  Nosotros
                </button>
                <button
                  onClick={() => scrollToSection("servicios")}
                  className="w-full text-left px-4 py-3 rounded-lg text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200 font-medium"
                >
                  Servicios
                </button>
                <button
                  onClick={() => scrollToSection("equipo")}
                  className="w-full text-left px-4 py-3 rounded-lg text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200 font-medium"
                >
                  Equipo
                </button>
                <button
                  onClick={() => scrollToSection("proyectos")}
                  className="w-full text-left px-4 py-3 rounded-lg text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200 font-medium"
                >
                  Proyectos
                </button>
                <button
                  onClick={() => scrollToSection("contacto")}
                  className="w-full text-left px-4 py-3 rounded-lg text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200 font-medium"
                >
                  Contacto
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
