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
  title: {
    default: "Inspira Ingeniería",
    template: "%s | Inspira Ingeniería",
  },
  description: "Estudio de ingeniería civil en Puerto Madryn, Chubut. Expertos en diseño estructural, consultoría y proyectos sostenibles. ¡Contáctanos hoy!",
  keywords: [
    "Inspira Ingeniería",
    "ingeniería civil Puerto Madryn",
    "ingeniería civil Chubut",
    "ingeniería civil Patagonia",
    "ingeniería civil Argentina",
    "diseño estructural",
    "consultoría estructural",
    "proyectos sostenibles",
    "dirección estructural",
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
    description: "Estudio de ingeniería civil en Puerto Madryn, Chubut. Expertos en diseño estructural, consultoría y proyectos sostenibles.",
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