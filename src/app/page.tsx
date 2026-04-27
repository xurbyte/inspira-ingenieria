import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { ServicesSection } from "@/components/services-section"
import { TeamSection } from "@/components/team-section"
import { ProjectsSection } from "@/components/projects-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { ScrollReveal } from "@/components/precision-ui"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero — with staggered entrance */}
      <ScrollReveal className="hero-reveal" threshold={0.05}>
        <HeroSection />
      </ScrollReveal>

      {/* About — Light bg, asymmetric layout */}
      <ScrollReveal threshold={0.1}>
        <AboutSection />
      </ScrollReveal>

      {/* Services — Dark bg, featured service + grid */}
      <ScrollReveal threshold={0.1}>
        <ServicesSection />
      </ScrollReveal>

      {/* Team — Light bg, staggered editorial layout */}
      <ScrollReveal threshold={0.1} stagger staggerDelay={150}>
        <TeamSection />
      </ScrollReveal>

      {/* Projects — Dark bg with photo, engineering panels */}
      <ScrollReveal threshold={0.1}>
        <ProjectsSection />
      </ScrollReveal>

      {/* Contact — Client component (form state), precision-brutalist styling */}
      <ScrollReveal threshold={0.1}>
        <ContactSection />
      </ScrollReveal>

      {/* Footer — RSC, dark bg, loads immediately */}
      <Footer />
    </main>
  )
}
