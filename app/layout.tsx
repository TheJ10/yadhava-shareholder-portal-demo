import type { Metadata, Viewport } from "next";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/cormorant-garamond/700.css";
import "@fontsource/cormorant-garamond/500-italic.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { ToastProvider } from "@/lib/toast-context";
import Header, { HEADER_HEIGHT } from "@/components/Header";
import KrishnaWatermark from "@/components/KrishnaWatermark";

export const metadata: Metadata = {
  title: "Yadhava Convention Hall — Shareholder Portal",
  description: "Shareholder Portal for Yadhava Convention Hall.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans text-ink bg-cream min-h-screen relative">
        <AuthProvider>
          <ToastProvider>
            <Header />
            <KrishnaWatermark />
            <div
              className="relative z-10 max-w-[480px] md:max-w-[560px] mx-auto min-h-screen flex flex-col"
              style={{ paddingTop: HEADER_HEIGHT }}
            >
              <main className="flex-1 px-[18px] pt-[26px] pb-[60px]">{children}</main>
              <footer className="text-center px-5 pt-4 pb-[30px] text-[10.5px] tracking-wide text-ink-faint relative z-10">
                Private shareholder access · Yadhava Convention Hall
              </footer>
            </div>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
