import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import { ToastProvider } from "@/components/ui/toast";
import { ProjectsProvider } from "@/contexts/projects-context";
import { ConditionalViewTransition } from "@/components/conditional-view-transition";
import "./globals.css";

const tasaOrbiter = localFont({
  src: [
    {
      path: '../../public/fonts/static/TASAOrbiter-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/static/TASAOrbiter-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/static/TASAOrbiter-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/static/TASAOrbiter-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/static/TASAOrbiter-ExtraBold.ttf',
      weight: '800',
      style: 'normal',
    },
  ],
  variable: '--font-tasa-orbiter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: "Inspira Ingeniería",
    template: "%s | Inspira Ingeniería",
  },
  description: "Estudio de ingeniería civil en Puerto Madryn especializado en cálculo estructural, modelado BIM y dirección de obra para viviendas, naves industriales y proyectos funcionales en la Patagonia argentina.",
  keywords: [
    // Ciudades principales + ingeniería civil
    "ingeniería civil Puerto Madryn",
    "ingeniería civil Trelew",
    "ingeniería civil Rawson",
    "ingeniería civil Comodoro Rivadavia",
    "ingeniería civil Esquel",
    "ingeniería civil Gaiman",
    "ingeniería civil Dolavon",
    "ingeniería civil Sarmiento",
    "ingeniería civil Rada Tilly",
    "ingeniería civil Camarones",
  
    // Estudio de ingeniería
    "estudio ingeniería Puerto Madryn",
    "estudio ingeniería Trelew",
    "estudio ingeniería Rawson",
    "estudio ingeniería Comodoro Rivadavia",
    "estudio ingeniería Esquel",
    "estudio ingeniería Chubut",
  
    // Cálculo estructural
    "cálculo estructural Puerto Madryn",
    "cálculo estructural Trelew",
    "cálculo estructural Rawson",
    "cálculo estructural Comodoro Rivadavia",
    "cálculo estructural Esquel",
    "cálculo estructural Chubut",
  
    // Dirección de obra
    "dirección de obra Puerto Madryn",
    "dirección de obra Trelew",
    "dirección de obra Rawson",
    "dirección de obra Comodoro Rivadavia",
    "dirección de obra Esquel",
    "dirección de obra Chubut",
  
    // Sistemas constructivos
    "woodframe Puerto Madryn",
    "woodframe Trelew",
    "woodframe Rawson",
    "woodframe Comodoro Rivadavia",
    "woodframe Esquel",
    "steelframe Puerto Madryn",
    "steelframe Trelew",
    "steelframe Rawson",
    "steelframe Comodoro Rivadavia",
    "steelframe Esquel",
    "construcción en seco Chubut",
    "estructuras metálicas Chubut",
    "estructuras de madera Chubut",
  
    // Marca e identidad
    "Inspira Ingeniería",
    "Inspira Puerto Madryn",
    "Inspira Chubut",
    "Inspira Ingeniería Civil",
  
    // Servicios adicionales
    "consultoría ingeniería Puerto Madryn",
    "consultoría ingeniería Trelew",
    "consultoría ingeniería Rawson",
    "consultoría ingeniería Comodoro Rivadavia",
    "consultoría ingeniería Esquel",
    "proyectos civiles sostenibles Chubut",
    "ingeniería sostenible Puerto Madryn",
    "ingeniería sostenible Chubut",
    "diseño estructural Puerto Madryn",
    "diseño estructural Trelew",
    "diseño estructural Rawson",
    "diseño estructural Comodoro Rivadavia",
    "diseño estructural Esquel"
  ],
  authors: [{ name: "Inspira Ingeniería, Maximo Ozonas" }],
  creator: "Maximo Ozonas",
  publisher: "Inspira Ingeniería",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Inspira Ingeniería",
    description: "Estudio de ingeniería civil en Puerto Madryn, Chubut. Expertos en diseño estructural, consultoría y proyectos sostenibles.",
    url: "https://www.ingenieriainspira.com",
    siteName: "Inspira Ingeniería",
    images: [
      {
        url: "/logo-opengraph.png",
        width: 1200,
        height: 630,
        alt: "Inspira Ingeniería Logo",
      },
    ],
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Inspira Ingeniería",
    description: "Estudio de ingeniería civil en Puerto Madryn, Chubut. Expertos en diseño estructural, consultoría y proyectos sostenibles. Proyectos de viviendas, naves industriales y proyectos funcionales en la Patagonia argentina.",
    images: ["/logo-opengraph.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${tasaOrbiter.variable} antialiased font-[family-name:var(--font-tasa-orbiter)]`}
      >
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-DWPVQ2HED7"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-DWPVQ2HED7');
          `}
        </Script>

        <Script
          id="organization-structured-data"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Inspira Ingeniería",
              url: "https://www.ingenieriainspira.com",
              logo: "https://www.ingenieriainspira.com/logo.png",
              sameAs: [
                "https://www.instagram.com/inspira.ing"
              ]
            })
          }}
        />
        <ToastProvider>
          <ProjectsProvider>
            <ConditionalViewTransition>
              {children}
            </ConditionalViewTransition>
          </ProjectsProvider>
        </ToastProvider>
      </body>
    </html>
  );
}