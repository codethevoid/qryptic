import "../styles/globals.css";
import { ReactNode } from "react";
import { Providers } from "@/app/providers";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          {children}
          <Toaster closeButton richColors />
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
