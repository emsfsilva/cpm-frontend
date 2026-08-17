// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";
import styles from "./(privada)/privateLayout.module.css";
import { Toaster } from "sonner";
import RegisterServiceWorker from "@/components/RegisterServiceWorker";

export const metadata: Metadata = {
  title: "Atos",
  description: "Sistema de Atos do Colégio da Polícia Militar - CPM",
  manifest: "/manifest.json",
  icons: {
    icon: "/assets/images/iconcpm.png",
    shortcut: "/assets/images/iconcpm.png",
    apple: "/icons/icon-192.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Atos",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" translate="no">
      <head>
        <meta name="google" content="notranslate" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
        />
      </head>
      <body className="antialiased">
        <div className={styles.imgbackground}></div>
        <div className={styles.imgbackgroundMedia}></div>
        <Toaster richColors position="top-right" />
        <RegisterServiceWorker />
        {children}
      </body>
    </html>
  );
}
