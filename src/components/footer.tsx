export function Footer() {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo and Description */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">I</span>
                </div>
                <span className="text-xl font-bold">Inspira Ingeniería</span>
              </div>
              <p className="text-background/80 mb-4 max-w-md">
                Estudio de ingeniería civil especializado en cálculo estructural y soluciones BIM. Transformamos diseños
                en estructuras seguras y eficientes en la Patagonia.
              </p>
              <p className="text-background/60 text-sm">Fundado por Tomás y Mateo Portalez en Puerto Madryn, Chubut.</p>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-semibold mb-4">Servicios</h4>
              <ul className="space-y-2 text-sm text-background/80">
                <li>Cálculo Estructural</li>
                <li>Modelado BIM</li>
                <li>Memorias de Cálculo</li>
                <li>Asesorías Técnicas</li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold mb-4">Contacto</h4>
              <ul className="space-y-2 text-sm text-background/80">
                <li>Puerto Madryn, Chubut</li>
                <li>+54 9 280 456-3172</li>
                <li>ingenieria.inspira@gmail.com</li>
                <li>@inspira.ing</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-background/20 mt-8 pt-8 text-center">
            <p className="text-background/60 text-sm">
              © 2024 Inspira Ingeniería. Todos los derechos reservados. | Diseño y desarrollo web profesional.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
