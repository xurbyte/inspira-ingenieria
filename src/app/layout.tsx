import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import { ToastProvider } from "@/components/ui/toast";
import { ProjectsProvider } from "@/contexts/projects-context";
import { ConditionalViewTransition } from "@/components/conditional-view-transition";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
    "Inspira Ingeniería",
    "cálculo estructural Puerto Madryn",
    "modelado BIM Patagonia",
    "ingeniería civil Chubut",
    "ingeniería civil Patagonia",
    "ingeniería estructural Argentina",
    "diseño y documentación estructural",
    "dirección de obra Patagonia",
    "proyectos industriales Chubut",
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
        className={`${geistSans.variable} ${geistMono.variable} ${tasaOrbiter.variable} antialiased font-[family-name:var(--font-tasa-orbiter)]`}
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