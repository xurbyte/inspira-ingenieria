import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-primary/20 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo and Description */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-xl font-bold uppercase">
                  Inspira Ingeniería
                </span>
              </div>
              <p className="mb-4 max-w-md">
                Estudio de ingeniería civil especializado en cálculo estructural
                y soluciones BIM. Transformamos diseños en estructuras seguras y
                eficientes en la Patagonia.
              </p>
              <p className="text-sm">
                Fundado por Tomás y Mateo Portalez en Puerto Madryn, Chubut.
              </p>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-semibold mb-4 uppercase">Servicios</h4>
              <ul className="space-y-2 text-sm">
                <li>Cálculo Estructural</li>
                <li>Modelado BIM</li>
                <li>Memorias de Cálculo</li>
                <li>Asesorías Técnicas</li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold mb-4 uppercase">Contacto</h4>
              <ul className="space-y-2 text-sm">
                <li>Puerto Madryn, Chubut</li>
                <li>+54 9 280 456-3172</li>
                <li>ingenieria.inspira@gmail.com</li>
                <li>@inspira.ing</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-background/20 mt-8 pt-8 text-center uppercase">
            <p className="text-sm flex justify-center items-center gap-1">
              © 2024 Inspira Ingeniería. Todos los derechos reservados. |
              Desarrollado por
              <a
                href="https://xurbyte.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline flex items-center gap-1"
              >
                <Image
                  src="/logoxurbyte.png"
                  alt="Logo Xurbyte"
                  width={80} // ancho requerido
                  height={80} // alto requerido
                  className="inline-block mb-1"
                />
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
