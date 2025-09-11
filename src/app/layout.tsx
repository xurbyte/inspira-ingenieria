import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
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
  title: "Inspira - Ingeniería Civil en Puerto Madryn, Chubut",
  description:
    "Inspira: Estudio de ingeniería civil en Puerto Madryn, Chubut. Expertos en diseño estructural, consultoría y proyectos sostenibles. ¡Contáctanos hoy!",
  keywords: [
    "ingeniería civil Puerto Madryn",
    "estudio ingeniería Chubut",
    "diseño estructural Argentina",
    "consultoría ingeniería Madryn",
    "proyectos civiles sostenibles",
    "Inspira Ingeniería",
  ],
  robots: "index, follow",
  viewport: "width=device-width, initial-scale=1",
  openGraph: {
    title: "Inspira - Ingeniería Civil en Puerto Madryn, Chubut",
    description:
      "Inspira: Estudio de ingeniería civil en Puerto Madryn, Chubut. Expertos en diseño estructural, consultoría y proyectos sostenibles. ¡Contáctanos hoy!",
    url: "https://www.inspiracivil.com", // Cambia a tu dominio real
    siteName: "Inspira Ingeniería",
    images: [
      {
        url: "/images/inspira-og-image.jpg", // Asegúrate de tener una imagen optimizada (1200x630px)
        width: 1200,
        height: 630,
        alt: "Inspira Ingeniería Civil en Puerto Madryn",
      },
    ],
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Inspira - Ingeniería Civil en Puerto Madryn, Chubut",
    description:
      "Expertos en ingeniería civil en Puerto Madryn, Chubut. Diseño estructural y consultoría sostenible.",
    images: ["/images/inspira-og-image.jpg"],
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
